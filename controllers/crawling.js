/**
 * 信息爬取
 */
const result = require('../consts/result');

var crawling = async (ctx, next) => {
    console.log(`crawling: ${JSON.stringify(ctx.request.body)}`);

    ctx.response.body = result.success;
}

module.exports = {
    'POST /api/v1/applications/ubt': crawling,
    'POST /api/v1/applications/crawling-info': crawling,
    'POST /api/v1/applications/:appId/device-token': crawling,
}