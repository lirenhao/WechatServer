import xml2js from 'xml2js'
import md5 from 'md5'

/**
 * 构建xml报文
 * @param obj
 */
export const buildXml = (obj) => {
    const builder = new xml2js.Builder({
        headless: true,
        rootName: 'xml',
        allowSurrogateChars: true
    })
    return builder.buildObject(obj)
}

/**
 * 解析xml报文
 * @param xml
 * @returns {Promise}
 */
export const parseXml = (xml) => {
    return new Promise((resolve, reject) => {
        xml2js.parseString(
            xml,
            {trim: true, explicitArray: false},
            (err, result) => {
                if (err)
                    reject(err)
                else
                    resolve(result.xml)
            }
        )
    })
}

/**
 * 生成随机字符串，默认32位
 * @param length
 * @returns {string}
 */
export const getNonceStr = (length = 32) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const maxPos = chars.length
    const nonceChars = []
    for (let i = 0; i < length; i++) {
        nonceChars.push(chars.charAt(Math.floor(Math.random() * maxPos)))
    }
    return nonceChars.join('')
}

/**
 * 生成MD5签名
 * @param params
 * @param key
 * @returns {*}
 */
export const getSign = (params, key) => {
    const signString = Object.keys(params)
            .filter(key => params[key] !== undefined && params[key] !== '' && key !== 'sign')
            .sort().map(key => key + '=' + params[key])
            .join('&') + '&key=' + key
    return md5(signString).toUpperCase()
}

/**
 * 验证签名
 * @param params
 * @param key
 * @returns {boolean}
 */
export const verifySign = (params, key) => {
    const sign = params.sign
    const verifySign = getSign(params, key)
    return sign === verifySign
}