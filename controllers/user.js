'use strict'

/**
 * 查询用户状态
 * @param {*} ctx 
 * @param {*} next 
 */
var getChapterid = async (ctx, next) => {
    console.log(`getChapterid userId: ${ctx.params.userId}`);

    let result = require('../data/qb_chapterid.json')
    ctx.response.body = result;
};

module.exports = {
    'GET /sdbeacononline/getchapterid/:userId': getChapterid,

}