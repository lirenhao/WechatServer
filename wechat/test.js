import * as wechat from './index'

const body = 'test'
const outTradeNo = '20170802083212001'
const outRefundNo = '20170802083212006'
const totalFee = 100
const notifyUrl = 'http://10.2.54.17:8080/pay'

// wechat.orderQuery(outTradeNo).then(console.log)
wechat.refund(outTradeNo, outRefundNo, totalFee, 50).then(console.log)
// wechat.refundQuery(outRefundNo).then(console.log)