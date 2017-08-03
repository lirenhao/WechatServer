import log4js from 'log4js'
import fecha from 'fecha'
import express from 'express'
import bodyParser from 'body-parser'
import wechat from './wechat'
import {parseXml} from './wechat/util'

log4js.configure({
    appenders: {
        out: {type: 'stdout'},
        file: {type: 'file', filename: './log/logs.txt'}
    },
    categories: {
        default: {appenders: ['out', 'file'], level: 'debug'}
    }
})

const logger = log4js.getLogger()

const body = '用户微信支付'
const totalFee = 1
const notifyUrl = 'http://47.93.100.211:3000/pay'
const getOutTradeNo = () => fecha.format(new Date(), 'YYYYMMDDHHmmss') + '0001'

const app = express()

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.get("origin"))
    res.header("Access-Control-Allow-Credentials", true)
    next()
})

app.get('/wechat', (req, res) => {
    const outTradeNo = getOutTradeNo()
    logger.info('outTradeNo', outTradeNo)
    wechat.unifiedOrder(body, outTradeNo, totalFee, notifyUrl)
        .then((params) => {
            const timestamp = Math.floor(Date.now() / 1000)
            logger.info('unifiedOrder', JSON.stringify(params))
            const pay = wechat.payParams(params.prepay_id, timestamp)
            logger.info('payParams', JSON.stringify(pay))
            res.send(pay)
        })
})

app.post('/pay', bodyParser.text({type: '*/xml'}), (req, res) => {
    const xml = req.body
    parseXml(xml)
        .then(params => {
            logger.info('payResult', JSON.stringify(params))
            res.end()
        })
})

app.listen(3000, () => logger.info('start'))