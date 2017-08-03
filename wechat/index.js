import config from 'config'
import Payment from './payment'
import Auth from './auth'

const localIp = config.get('wechat.localIp')

// 微信支付
const payConfig = config.get('wechat.pay')
const pay = new Payment(payConfig)

// 微信授权
const authConfig = config.get('wechat.auth')
const auth = new Auth(authConfig)

/**
 * 微信支付-预下单
 * @param body 商品描述
 * @param outTradeNo 商户订单号
 * @param totalFee 总金额,单位为分
 * @param notifyUrl 交易结果通知地址
 * @returns {*}
 */
export const unifiedOrder = (body, outTradeNo, totalFee, notifyUrl) => {
    return pay.unifiedOrder({
        body: body,
        out_trade_no: outTradeNo,
        total_fee: totalFee,
        notify_url: notifyUrl,
        spbill_create_ip: localIp
    })
}

/**
 * APP端调起支付所需参数
 * @param prepayId 预下单返回的预支付交易会话标识
 * @param timestamp 时间戳,标准北京时间，时区为东八区，自1970年1月1日 0点0分0秒以来的秒数
 * @returns {*}
 */
export const payParams = (prepayId, timestamp) => {
    return pay.payParams({
        prepayid: prepayId,
        timestamp: timestamp
    })
}

/**
 * 微信支付-查询订单
 * @param outTradeNo 商户订单号
 * @returns {*}
 */
export const orderQuery = (outTradeNo) => {
    return pay.orderQuery({
        out_trade_no: outTradeNo
    })
}

/**
 * 微信支付-取消订单
 * @param outTradeNo 商户订单号
 * @returns {*}
 */
export const closeOrder = (outTradeNo) => {
    return pay.closeOrder({
        out_trade_no: outTradeNo
    })
}

/**
 * 微信支付-申请退货
 * @param outTradeNo 商户订单号
 * @param outRefundNo 商户退款单号
 * @param totalFee 订单总金额,单位为分
 * @param refundFee 退款总金额,单位为分
 * @returns {*}
 */
export const refund = (outTradeNo, outRefundNo, totalFee, refundFee) => {
    return pay.refund({
        out_trade_no: outTradeNo,
        out_refund_no: outRefundNo,
        total_fee: totalFee,
        refund_fee: refundFee
    })
}

/**
 * 微信支付-退货查询
 * @param outRefundNo 商户退款单号
 * @returns {*}
 */
export const refundQuery = (outRefundNo) => {
    return pay.refundQuery({
        out_refund_no: outRefundNo
    })
}

/**
 * 企业付款
 * @param partnerTradeNo 商户订单号
 * @param openId 用户openid
 * @param amount 金额,单位为分
 * @returns {*}
 */
export const transfers = (partnerTradeNo, openId, amount) => {
    return pay.transfers({
        partner_trade_no: partnerTradeNo,
        openid: openId,
        amount: amount,
        desc: '用户提现',
        spbill_create_ip: localIp
    })
}

/**
 * 查询企业付款
 * @param partnerTradeNo 查询企业付款信息
 * @returns {*}
 */
export const getTransferInfo = (partnerTradeNo) => {
    return pay.getTransferInfo({
        partner_trade_no: partnerTradeNo
    })
}

export const getAccessToken = (code) => {
    return auth.getAccessToken(code)
}

export default {
    unifiedOrder,
    payParams,
    orderQuery,
    closeOrder,
    refund,
    refundQuery,
    transfers,
    getTransferInfo,
    getAccessToken
}