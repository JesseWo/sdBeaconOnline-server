const random = require('../utils/randomUtils');

/**
 * mock 点击数据
 * 下一题按钮
 * 左上角(552,804)
 * 右下角(644,832)
 * @param totalSubject 试题数量,默认20
 * @returns {{sameNum: number, clickX: string, clickY: string}}
 */
function mockHumanBehaviors(totalSubject = 20) {
    let clickTimes = totalSubject - 1;
    let clientXArr = [];
    let clientXArrY = [];
    let maxArr = [];
    let obj = {};
    for (let i = 0; i < clickTimes; i++) {
        let x = random(552, 644);
        clientXArr.push(x);
        let y = random(804, 832);
        clientXArrY.push(y);

        if (obj[x]) {
            obj[x]++;
            maxArr.push(obj[clientXArr[i]]);
        } else {
            obj[x] = 1
        }
    }
    maxArr = maxArr.sort(function (x, y) {
        return x - y
    });
    let repeatX = maxArr.length > 0 ? maxArr[maxArr.length - 1] : 0; //重复x 坐标的次数

    return {
        sameNum: repeatX,
        clickX: clientXArr.join(','),
        clickY: clientXArrY.join(',')
    };
}

module.exports = mockHumanBehaviors;