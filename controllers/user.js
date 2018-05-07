'use strict'

const fs = require('fs');
const path = require('path');
const tesseract = require('node-tesseract');

/**
 * 查询题库Id
 * @param {*} ctx
 * @param {*} next
 */
let getChapterid = async (ctx, next) => {
    console.log(`getChapterid userId: ${ctx.query.userId}`);

    let result = require('../data/qb_chapterid.json')
    ctx.response.body = result;
};

/**
 * 更新错题集
 * @param {*} ctx
 * @param {*} next
 */
let updateFailureList = async (ctx, next) => {
    // console.log(`${JSON.stringify(ctx.request.header)}`);

    console.log(`updateFailureList: ${JSON.stringify(ctx.request.body)}`);

    ctx.response.body = {
        status: 0,
        msg: '错题上传成功!'
    };
};

let vcodeOcr = async (ctx) => {
        console.log(`${JSON.stringify(ctx.request.header)}`);
        // console.log(ctx.request.body.fields);
        let files = ctx.request.body.files;
        // console.log(files);
        for (let fileName in files) {
            let file = files[fileName];
            console.log(file.path);
            try {
                let ocrResult = await new Promise((resolve, reject) => {
                    tesseract.process(file.path, function (err, text) {
                        if (err) {
                            reject(err);
                        } else {
                            //过滤多余空格
                            resolve(text.trim().replace(/ /g, ''));
                        }
                    });
                });
                console.log(`ocr result: ${ocrResult}`);
                ctx.response.body = {
                    status: 0,
                    msg: 'ocr success!',
                    data: ocrResult
                };
            } catch (e) {
                ctx.response.body = {
                    status: 1,
                    msg: e.toString(),
                };
            }
            break;
        }
    }
;

module.exports = {
    'GET /sdbeacononline/getchapterid': getChapterid,
    'POST /sdbeacononline/updatefailurelist': updateFailureList,
    'POST /sdbeacononline/vcodeocr': vcodeOcr,

}