/**
cron=1 0 * 8 * jd_aid_grapbean.js
new Env('全民抢京豆');
 */

let common = require("./function/common");
let $ = new common.env('全民抢京豆');
let min = 2,
    help = $.config[$.filename(__filename)] || Math.min(min, $.config.JdMain) || min;
$.setOptions({
    headers: {
        'content-type': 'application/json',
        'user-agent': 'jdapp;iPhone;9.4.6;14.2;965af808880443e4c1306a54afdd5d5ae771de46;network/wifi;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone8,4;addressid/;supportBestPay/0;appBuild/167618;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
        'referer': 'https://happy.m.jd.com/babelDiy/Zeus/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html?asid=287215626&un_area=12_904_905_57901&lng=117.612969135975&lat=23.94014745198865',
    }
});
eval(common.eval.mainEval($));
async function prepare() {
    for (let i of cookies['help']) {
        $.setCookie(i);
        let url = 'https://api.m.jd.com/client.action?functionId=signGroupHit&body=%7B%22activeType%22%3A2%7D&appid=ld&client=apple&clientVersion=9.5.4&networkType=wifi&osVersion=13.7&uuid=7b01d4690ef13716984dcfcf96068f36b41f6c51'
        await $.curl(url)
        url = 'https://api.m.jd.com/client.action?functionId=signBeanGroupStageIndex&body=%7B%22monitor_refer%22%3A%22%22%2C%22rnVersion%22%3A%223.9%22%2C%22fp%22%3A%22-1%22%2C%22shshshfp%22%3A%22-1%22%2C%22shshshfpa%22%3A%22-1%22%2C%22referUrl%22%3A%22-1%22%2C%22userAgent%22%3A%22-1%22%2C%22jda%22%3A%22-1%22%2C%22monitor_source%22%3A%22bean_m_bean_index%22%7D&appid=ld&client=apple&clientVersion=9.5.4&networkType=wifi&osVersion=13.7&uuid=7b01d4690ef13716984dcfcf96068f36b41f6c51'
        await $.curl(url)
        try {
            $.sharecode.push({
                'groupCode': $.source.data.groupCode,
                'shareCode': $.source.data.shareCode,
                'activeId': $.source.data.jklInfo.keyId
            })
        } catch (e) {}
    }
}
async function main(id) {
    common.assert(id.shareCode, "没有可助力ID")
    try {
        let url = `https://api.m.jd.com/client.action?functionId=signGroupHelp&body={"activeType":2,"groupCode":"${id.groupCode}","shareCode":"${id.shareCode}","activeId":"${id.activeId}","source":"guest"}&appid=ld&client=apple&clientVersion=9.5.4&networkType=wifi&osVersion=13.7&uuid=7b01d4690ef13716984dcfcf96068f36b41f6c51&openudid=7b01d4690ef13716984dcfcf96068f36b41f6c51`;
        await $.curl(url)
        console.log($.source.data.helpToast)
    } catch (e) {
        console.log(e.message)
    }
}
