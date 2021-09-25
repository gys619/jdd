/**
cron=42 23 * * * jd_work_unfollowShop.js
new Env('京东取关店铺');
 */

let common = require("./function/common");
let $ = new common.env('京东取关店铺');
let min = 2,
    help = $.config[$.filename(__filename)] || Math.min(min, $.config.JdMain) || min;
$.setOptions({
    headers: {
        'content-type': 'application/json',
        'user-agent': 'jdapp;iPhone;9.4.6;14.2;965af808880443e4c1306a54afdd5d5ae771de46;network/wifi;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone8,4;addressid/;supportBestPay/0;appBuild/167618;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
        'referer': 'https://happy.m.jd.com/babelDiy/Zeus/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html?asid=287215626&un_area=12_904_905_57901&lng=117.612969135975&lat=23.94014745198865',
    }
});
$.readme = `
42 23 * * * task ${$.runfile}
export ${$.runfile}=2  #默认执行2次取关API,共20个店铺
`
eval(common.eval.mainEval($));
async function prepare() {
    $.n = $.config[$.runfile] ? Math.ceil($.config[$.runfile]) : 2
}
async function main(id) {
    url = `https://wq.jd.com/fav/shop/QueryShopFavList?cp=1&pageSize=10&lastlogintime=${$.timestamp}&_=1629620296971&g_login_type=0&callback=jsonpCBKA&g_tk=1994796340&g_ty=ls&sceneval=2&g_login_type=1`
    array = []
    for (let j = 0; j < $.n; j++) {
        await $.curl(url, 'lists')
        if ($.lists.data) {
            for (let i of $.lists.data) {
                await $.curl({
                    'url': 'https://api.m.jd.com/client.action?g_ty=ls&g_tk=518274330',
                    'form': `functionId=followShop&body={"follow":"false","shopId":"${i.shopId}","award":"true","sourceRpc":"shop_app_home_follow"}&osVersion=13.7&appid=wh5&clientVersion=9.2.0&loginType=2&loginWQBiz=interact`
                    //
                })
                console.log("取消关注", i.shopName)
                array.push(i.shopName)
            }
        }else{
            console.log("未获取到店铺关注信息")
        }
    }
    $.notice(`取消关注:\n${array.join("\n")}`,1)
}

