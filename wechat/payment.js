import fetch from 'node-fetch'
import https from 'https'
import fs from 'fs'
import {buildXml, parseXml, getNonceStr, getSign, verifySign} from './util'
import {
    UNIFIED_ORDER, ORDER_QUERY, CLOSE_ORDER,
    REFUND, REFUND_QUERY, TRANSFERS, GET_TRANSFER_INFO
} from './link'

class Payment {

    constructor(config) {
        this.appId = config.appId
        this.mchId = config.mchId
        this.partnerKey = config.partnerKey
        this.agentKey = config.agentKey
        this.agentCert = config.agentCert
    }

    /**
     * 微信支付预下单
     * @param {Object} params 预下单信息
     * @param {string} params.body 商品描述
     * @param {string} params.out_trade_no 商户订单号
     * @param {number} params.total_fee 总金额,单位为分
     * @param {string} params.spbill_create_ip 终端IP
     * @param {string} params.notify_url 通知地址
     */
    unifiedOrder(params) {
        // 组装报文
        params.appid = this.appId
        params.mch_id = this.mchId
        params.nonce_str = getNonceStr()
        params.trade_type = 'APP'
        // 签名
        params.sign = getSign(params, this.partnerKey)

        const options = {
            method: 'post',
            body: buildXml(params)
        }

        return fetch(UNIFIED_ORDER, options)
            .then((res) => res.text())
            .then((xml) => parseXml(xml))
    }

    /**
     *
     * @param {Object} params
     * @param {string} params.prepayid 预支付交易会话ID
     * @param {number} params.timestamp 时间戳,标准北京时间，时区为东八区，自1970年1月1日 0点0分0秒以来的秒数
     */
    payParams(params) {
        params.appid = this.appId
        params.partnerid = this.mchId
        params.package = 'Sign=WXPay'
        params.noncestr = getNonceStr()
        params.sign = getSign(params, this.partnerKey)
        return params
    }

    /**
     * 微信支付查询订单
     * @param {Object} params 查询订单信息
     * @param {string} params.out_trade_no 商户订单号
     */
    orderQuery(params) {
        // TODO 查询时一定要查询出明确的结果(成功/失败)
        // 组装报文
        params.appid = this.appId
        params.mch_id = this.mchId
        params.nonce_str = getNonceStr()
        // 签名
        params.sign = getSign(params, this.partnerKey)

        const options = {
            method: 'post',
            body: buildXml(params)
        }

        return fetch(ORDER_QUERY, options)
            .then((res) => res.text())
            .then((xml) => parseXml(xml))
            .then((obj) => {
                if (verifySign(obj, this.partnerKey))
                    return obj
                else
                // TODO 验签失败如何处理
                    return {}
            })
    }

    /**
     * 微信支付取消订单
     * @param {Object} params 查询订单信息
     * @param {string} params.out_trade_no 商户订单号
     */
    closeOrder(params) {
        // 组装报文
        params.appid = this.appId
        params.mch_id = this.mchId
        params.nonce_str = getNonceStr()
        // 签名
        params.sign = getSign(params, this.partnerKey)

        const options = {
            method: 'post',
            body: buildXml(params)
        }

        return fetch(CLOSE_ORDER, options)
            .then((res) => res.text())
            .then((xml) => parseXml(xml))
    }

    /**
     * 微信支付申请退货
     * @param {Object} params 申请退货信息
     * @param {string} params.out_trade_no 商户订单号
     * @param {string} params.out_refund_no 商户退款单号
     * @param {number} params.total_fee 订单总金额,单位为分
     * @param {string} params.refund_fee 退款总金额,单位为分
     */
    refund(params) {
        // 组装报文
        params.appid = this.appId
        params.mch_id = this.mchId
        params.nonce_str = getNonceStr()
        // 签名
        params.sign = getSign(params, this.partnerKey)

        const options = {
            method: 'post',
            body: buildXml(params),
            agent: new https.Agent({
                key: fs.readFileSync(this.agentKey),
                cert: fs.readFileSync(this.agentCert)
            })
        }

        return fetch(REFUND, options)
            .then((res) => res.text())
            .then((xml) => parseXml(xml))
    }

    /**
     * 微信支付退货查询
     * @param {Object} params 退货查询
     * @param {string} params.out_refund_no 商户退款单号
     */
    refundQuery(params) {
        // 组装报文
        params.appid = this.appId
        params.mch_id = this.mchId
        params.nonce_str = getNonceStr()
        // 签名
        params.sign = getSign(params, this.partnerKey)

        const options = {
            method: 'post',
            body: buildXml(params)
        }

        return fetch(REFUND_QUERY, options)
            .then((res) => res.text())
            .then((xml) => parseXml(xml))
    }

    /**
     * 企业付款
     * 需要证书
     * @param {Object} params 企业付款信息
     * @param {string} params.partner_trade_no 商户订单号
     * @param {string} params.openid 用户openid
     * @param {string} params.amount 金额,单位为分
     * @param {string} params.desc 企业付款描述信息
     * @param {string} params.spbill_create_ip IP地址
     */
    transfers(params) {
        // 组装报文
        params.mch_appid = this.appId
        params.mchid = this.mchId
        params.check_name = 'NO_CHECK'
        params.nonce_str = getNonceStr()
        // 签名
        params.sign = getSign(params, this.partnerKey)

        const options = {
            method: 'post',
            body: buildXml(params),
            agent: new https.Agent({
                key: fs.readFileSync(this.agentKey),
                cert: fs.readFileSync(this.agentCert)
            })
        }

        return fetch(TRANSFERS, options)
            .then((res) => res.text())
            .then((xml) => parseXml(xml))
    }

    /**
     * 查询企业付款
     * 需要证书
     * @param {Object} params 查询企业付款信息
     * @param {string} params.partner_trade_no 商户订单号
     */
    getTransferInfo(params) {
        // 组装报文
        params.appid = this.appId
        params.mch_id = this.mchId
        params.nonce_str = getNonceStr()
        // 签名
        params.sign = getSign(params, this.partnerKey)

        const options = {
            method: 'post',
            body: buildXml(params),
            agent: new https.Agent({
                key: fs.readFileSync(this.agentKey),
                cert: fs.readFileSync(this.agentCert)
            })
        }

        return fetch(GET_TRANSFER_INFO, options)
            .then((res) => res.text())
            .then((xml) => parseXml(xml))
    }
}

export default  Payment