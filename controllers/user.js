'use strict'

const fs = require('fs');
const path = require('path');
const tesseract = require('node-tesseract');
const query = require('../core/queryEngine');

const QUESTION_BANK_PLUS_PATH = '../data/questionBank_plus.json';
const QUESTION_BANK_PATH = '../data/questionBank.json';

/**
 * 更新错题集
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
let updateFailureList = async ctx => {
    let failureList = ctx.request.body;
    console.log(`updateFailureList: ${JSON.stringify(failureList)}`);

    let newList = [];
    try {
        let qbPlus = require(QUESTION_BANK_PLUS_PATH);
        //去重
        failureList.forEach((value) => {
            //去重
            let newItem = value;
            let repeat = false;
            for (const oldItem of qbPlus) {
                if (newItem.id === oldItem.id) {
                    repeat = true;
                    break;
                }
            }
            if (!repeat) {
                newList.push(newItem);
            }
        });
        if (newList.length > 0) {
            qbPlus.push(...newList);
            fs.writeFile(path.join(__dirname, QUESTION_BANK_PLUS_PATH), JSON.stringify(qbPlus), (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`更新错题集: ${newList.length}条记录`);
                }
            });
        }
    } catch (e) {
        //ignore
    }

    //todo 存入MongoDB

    ctx.response.body = {
        status: 0,
        msg: `上传成功, 更新了${newList.length}条错题记录!`
    };
};

/**
 * 验证码ocr
 * @param ctx
 * @returns {Promise<void>}
 */
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
};

async function queryAnswer(ctx) {
    const {subjectInfoList, userId} = ctx.request.body;
    console.log(`queryAnswer userId: ${userId}`);

    let qb = require(QUESTION_BANK_PATH);
    let qbPlus = require(QUESTION_BANK_PLUS_PATH);
    qb.push(...qbPlus);

    let result = query(qb, subjectInfoList);
    console.log(JSON.stringify(result.failureMap));
    ctx.response.body = {
        status: 0,
        msg: 'query success!',
        data: result
    };
}

module.exports = {
    'POST /sdbeacononline/updatefailurelist': updateFailureList,
    'POST /sdbeacononline/vcodeocr': vcodeOcr,
    'POST /sdbeacononline/queryanswer': queryAnswer,

};