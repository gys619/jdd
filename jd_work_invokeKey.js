/**
cron=30 7,15,23 * * * jd_work_invokeKey.js
new Env('京东invokeKey获取替换');
 */

let common = require("./function/common");
let $ = new common.env('京东invokeKey获取替换');
let fs = require("fs");
let min = 2,
    help = $.config[$.filename(__filename)] || Math.min(min, $.config.JdMain) || min;
$.setOptions({
    headers: {
        'content-type': 'application/json',
        'user-agent': 'jdapp;iPhone;9.4.6;14.2;965af808880443e4c1306a54afdd5d5ae771de46;network/wifi;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone8,4;addressid/;supportBestPay/0;appBuild/167618;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
        'referer': 'https://happy.m.jd.com/babelDiy/',
    }
});
$.readme = `
50 7,15,23 * * * task ${$.runfile}
`
eval(common.eval.mainEval($));
async function prepare() {
    invokeKey = ''
    try {
        let html = await $.curl('https://prodev.m.jd.com/mall/active/2tZssTgnQsiUqhmg5ooLSHY9XSeN/index.html')
        let js = "https://storage.360buyimg.com/" + $.match(/"htmlSourceUrl":"([^\"]+)"/, html)
        jsContent = await $.curl(js)
        let index = 'https:' + $.match(/src="([^\"]+)"/, jsContent)
        let indexContent = await $.curl(index)
        invokeKey = $.match(/\w+\s*=\s*\w+\(\d+\)\s*,\s*\w+\s*=\s*"(\w{16})"/, indexContent)
    } catch (e) {}
    if (invokeKey) {
        let config = require("./function/config");
        config.invokeKey = invokeKey
        data = `module.exports = ${JSON.stringify(config)}`
        console.log(data)
        fs.writeFile("./function/config.js", data, function(err, data) {
            if (err) {
                throw err;
            }
            console.log("写入成功")
        })
    } else {
        console.log("未获取到invokeKey")
    }
}
