FROM node:8-alpine

ADD ./ /opt/wechatServer

RUN apk add --no-cache --virtual .build-deps \
        g++ \
        make \
        python \
    && cd /opt/wechatServer && npm i --production \
    && apk del .build-deps

WORKDIR /opt/wechatServer

CMD ["node", "index.js"]

VOLUME ["/opt/wechatServer/config"]
EXPOSE 3000
