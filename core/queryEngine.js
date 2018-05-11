'use strict';

const log = require('../utils/logUtils');
const fs = require('fs');

//错题集
const FAILURELIST_PATH = '../data/failureList.json';

/**
 *
 * @param {题库} questionBank
 * @param {试题} subjectInfoList
 */
function query(questionBank, subjectInfoList) {
    let answerList = [];
    let failureMap = {};
    //遍历试题
    for (let i = 0; i < subjectInfoList.length; i++) {
        const subjectInfo = subjectInfoList[i];
        const {subjectTitle, subjectType, optionInfoList} = subjectInfo;

        log.i(`${i + 1}.[${subjectType === '0' ? '单选' : '多选'}] ${subjectTitle}`);

        //遍历题库查询答案
        let correctOptionArr;
        //step1: 完全匹配
        for (let j = 0; j < questionBank.length; j++) {
            const answerSubjectInfo = questionBank[j];
            const answerSubjectTitle = answerSubjectInfo.subjectTitle;
            //去除题目中的特殊字符，然后进行匹配
            const questionRegex = /[ ,.，。、；：！？《》“”……—\(\)（）\\n]/g;
            if (subjectTitle.replace(questionRegex, '') === answerSubjectTitle.replace(questionRegex, '')
                && subjectType === answerSubjectInfo.subjectType) {
                let correctAnswerOptsArr = answerSubjectInfo.optionInfoList.filter((element) => element.isRight === '1');
                correctOptionArr = optionInfoList.filter((element) => {
                    for (const correctAnswerOption of correctAnswerOptsArr) {
                        //去除选项中的特殊字符, 然后进行匹配
                        const optsRegex = /[ ,.，。、\(\)]/g;
                        let a = element.optionTitle.replace(optsRegex, '');
                        let b = correctAnswerOption.optionTitle.replace(optsRegex, '');
                        if (a == b) {
                            return true;
                        }
                    }
                    return false;
                });
                break;
            }
        }
        //step2: ()截断匹配
        if (!correctOptionArr || correctOptionArr.length === 0) {
            log.d('完全匹配失败, 尝试截断模糊匹配...');
            for (let j = 0; j < questionBank.length; j++) {
                const answerSubjectInfo = questionBank[j];
                const answerSubjectTitle = answerSubjectInfo.subjectTitle;

                let queryArr = subjectTitle.split('（）');
                if (queryArr.length === 2) {
                    if (answerSubjectTitle.startsWith(queryArr[0])) {
                        let tmp = answerSubjectTitle.substring(queryArr[0].length);
                        correctOptionArr = optionInfoList.filter((element) => tmp.startsWith(element.optionTitle));
                        if (correctOptionArr) break;
                    } else if (answerSubjectTitle.endsWith(queryArr[1])) {
                        let tmp = answerSubjectTitle.substring(0, answerSubjectTitle.length - queryArr[1].length);
                        correctOptionArr = optionInfoList.filter((element) => tmp.endsWith(element.optionTitle));
                        if (correctOptionArr) break;
                    }
                }
            }
        }
        if (correctOptionArr && correctOptionArr.length > 0) {
            //查询成功
            let correctedOptsArr = [];
            let correctedOptsDetailArr = [];
            for (const iterator of correctOptionArr) {
                correctedOptsArr.push(iterator.optionType);
                correctedOptsDetailArr.push(`${iterator.optionType}. ${iterator.optionTitle}`);
            }
            let correctedOpts;
            let correctedOptsDetails;
            if (correctOptionArr.length > 1) {
                //多选
                correctedOpts = correctedOptsArr.join(',');
                correctedOptsDetails = correctedOptsDetailArr.join('\n');
            } else if (correctOptionArr.length === 1) {
                //单选
                correctedOpts = correctedOptsArr[0];
                correctedOptsDetails = correctedOptsDetailArr[0];
            }

            log.i(`答案:${correctedOpts}\n${correctedOptsDetails}\n`);

            //构建查询结果
            let answer = {};
            answer.id = subjectInfo.id;
            answer.answer = correctedOpts;
            answerList.push(answer);
        } else {
            failureMap[i] = subjectInfo;
            log.e('答案查询失败!\n');
        }
    }
    //将自动查询失败的问题 显示给用户
    let anies = Object.values(failureMap);
    if (anies.length > 0) {
        //汇总记录查询失败的问题
        try {
            let failureCollector = require(FAILURELIST_PATH);
            let collectorList = failureCollector.data.subjectInfoList;
            let newList = [];
            anies.forEach((value) => {
                //去重
                let item = value;
                let repeat = false;
                for (const collectorItem of collectorList) {
                    if (item.id === collectorItem.id) {
                        repeat = true;
                        break;
                    }
                }
                if (!repeat) {
                    newList.push(item);
                }
            });
            if (newList.length > 0) {
                failureCollector.data.subjectInfoList = collectorList.concat(newList);
                fs.writeFile(path.join(__dirname, FAILURELIST_PATH), JSON.stringify(failureCollector), (err) => {
                    if (err) {
                        log.e(err);
                    } else {
                        log.d('更新错题集.');
                    }
                });
            }
        } catch (e) {
            //ignore
        }

        log.e(`有${anies.length}个问题查询失败!\n`)
    }

    return {answerList, failureMap};
}

module.exports = query;