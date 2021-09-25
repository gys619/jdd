/**
cron=2 0,6-22/3 * * * jd_work_cookie.js
new Env('京东Cookie过期判断');
 */

let common = require("./function/common");
let $ = new common.env('京东Cookie过期判断');
$.setOptions({
    headers: {
        'content-type': 'application/json',
        'user-agent': 'jdapp;iPhone;9.4.6;14.2;965af808880443e4c1306a54afdd5d5ae771de46;network/wifi;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone8,4;addressid/;supportBestPay/0;appBuild/167618;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
        'referer': 'https://happy.m.jd.com/babelDiy/Zeus/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html?asid=287215626&un_area=12_904_905_57901&lng=117.612969135975&lat=23.94014745198865',
    }
});
eval(common.eval.mainEval($));
async function main(id) {
    let url = 'https://wq.jd.com/bases/orderlist/list?order_type=3&start_page=1&page_size=10&last_page=0&callersource=mainorder&traceid=1173839808217437357&t=1619852939462&sceneval=2&g_ty=ls&g_tk=5381'
    try {
        await $.curl(url);
        console.log($.source.errCode)
        if ($.source.errCode == '13') {
            $.notice('账号过期')
        }
    } catch (e) {}
}
