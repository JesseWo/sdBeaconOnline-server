'use strict'

const fs = require('fs');
const path = require('path');
const request = require('superagent');
const log = require('../utils/logUtils');

//题库ID
const chapterIds = [
    'v8og97kgn6iguomqpqfvsdfp32',//12月
    '2c14hou1q8h1bqq615p6rqe11e',//1月
    '7gi1s8384sjaarvsc0m5hskjv2',//2月
    '7j0d8qp4r2g28ogjt5hq0cbhne',//3月
    'qbqkfcn2fuihtqtnvo5t8e3mri',//4月
    '61mm88291ah3soo5gqjjkjrdas',//5月
];

async function updateQuestionBank() {
    try {
        let questionBank = [];
        let qbArr = await Promise.all(chapterIds.map(value => getQuestionBank(value)));
        qbArr.forEach(value => {
            const {chapterTitle, totalSubject, subjectInfoList} = value;
            log.d(`获取 [${chapterTitle.trim()}] 题库, 共计${totalSubject}题.`);
            questionBank.push(...subjectInfoList);
        });
        //缓存题库
        let jString = JSON.stringify(questionBank);
        fs.writeFile(path.join(__dirname, '../data/questionBank.json'), jString, (err) => {
            if (err) {
                log.e(err);
            } else {
                log.d('题库缓存ok.');
            }
        });
    } catch (e) {
        log.e(e);
    }
}

function getQuestionBank(chapterId) {
    return new Promise((resolve, reject) => {
        request
            .get('http://xxjs.dtdjzx.gov.cn/quiz-api/subject_info/list')
            .query({
                'chapterId': chapterId
            })
            .then(res => {
                let data = res.body;
                if (data.code === 200 && data.success) {
                    resolve(data.data);
                } else {
                    // log.e(`${data.code} Error ${data.msg}`);
                    reject(`getQuestionBank: ${data.code} Error ${data.msg}`);
                }
            });
    });
}

updateQuestionBank();