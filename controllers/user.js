'use strict'

/**
 * 查询题库Id
 * @param {*} ctx 
 * @param {*} next 
 */
var getChapterid = async (ctx, next) => {
    console.log(`getChapterid userId: ${ctx.query.userId}`);
    
    let result = require('../data/qb_chapterid.json')
    ctx.response.body = result;
};

module.exports = {
    'GET /sdbeacononline/getchapterid': getChapterid,

}