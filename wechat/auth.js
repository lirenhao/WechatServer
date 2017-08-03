import fetch from 'node-fetch'
import {GET_ACCESS_TOKEN} from './link'

class Auth {
    constructor(config) {
        this.appId = config.appId
        this.appSecret = config.appSecret
    }

    getAccessToken(code) {
        return fetch(`${GET_ACCESS_TOKEN}?appid=${this.appId}&secret=${this.appSecret}&code=${code}&grant_type=authorization_code`)
            .then((res) => JSON.parse(res.body))
    }
}

export default Auth