import wechat from './wechat'

const outTradeNo = '201708021605070001'
const outRefundNo = '201708021605070002'
const totalFee = 1

wechat.refund(outTradeNo, outRefundNo, totalFee, 1).then(console.log)