const qs = require('querystring')
let url = qs.parse('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx915008be9bda881b&redirect_uri=https%3A%2F%2Fwww.cytingchechang.com%2Fview%2FCYWeChatPay%2FdirectPay%2Findex.html%3Fd%3D2681%26c%3D1%26s%3D1&response_type=code&scope=snsapi_base&connect_redirect=1#wechat_redirect')
console.log(url);
