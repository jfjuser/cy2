var utilMd5 = require('./md5.js');
const key = 'yNoLvDZp6M7uzifaR4CWn8TSPEctbsx9';
const sign_mix = 'O7RFJN9c';

function formatTime(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n
}

//邮箱以及手机的正则表达式
function regexConfig() {
    var reg = {
        email: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
        phone: /^1(3|4|5|7|8)\d{9}$/,
        plate: /^[\u4e00-\u9fa5][a-zA-Z](([DF](?![a-zA-Z0-9]*[IO])[0-9]{4})|([0-9]{5}[DF]))|^[冀豫云辽黑湘皖鲁苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼渝京津沪新京军空海北沈兰济南广成使领A-Z]{1}[a-zA-Z0-9]{5}[a-zA-Z0-9挂学警港澳]{1}$/,
		userName: /^(\w){6,12}$/,
    };
    return reg;
}

function getSign(signStr) {
    var signTmp = sign_mix + signStr + 'key=' + key;
    var sign = utilMd5.hexMD5(signTmp);
    return sign.toUpperCase();
}

module.exports = {
    formatTime: formatTime,
    regexConfig: regexConfig,
    getSign: getSign,
    sign_mix: sign_mix
};



