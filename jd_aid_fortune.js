/**
cron=20 0,6-22 * * * jd_aid_fortune.js
new Env('京喜财富岛助力');
 */

let common = require("./function/common");
let $ = new common.env('京喜财富岛助力');
let min = 3,
    help = $.config[$.filename(__filename)] || Math.min(min, $.config.JdMain) || min;
$.setOptions({
    headers: {
        'content-type': 'application/json',
        'user-agent': 'jdapp;iPhone;10.0.8;13.7;7b01d4690ef13716984dcfcf96068f36b41f6c51;network/wifi;model/iPhone8,1;addressid/4666062376;appBuild/167741;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
        'referer': 'https://st.jingxi.com/fortune_island/index2.html',
    }
});
eval(common.eval.mainEval($));
async function prepare() {
    jxAlgo.set({
        'appId': 10032
    })
    for (let i of cookies['help']) {
        $.setCookie(i);
        let token = jxAlgo.token(i)
        await work(`https://m.jingxi.com/jxbfd/user/QueryUserInfo?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=&ddwTaskId=&strShareId=&strMarkList=guider_step%2Ccollect_coin_auth%2Cguider_medal%2Cguider_over_flag%2Cbuild_food_full%2Cbuild_sea_full%2Cbuild_shop_full%2Cbuild_fun_full%2Cmedal_guider_show%2Cguide_guider_show%2Cguide_receive_vistor%2Cdaily_task%2Cguider_daily_task&strPgtimestamp=${token.strPgtimestamp}&strPhoneID=${token.strPhoneID}&strPgUUNum=${token.strPgUUNum}&strVersion=1.0.1&_stk=_cfd_t%2CbizCode%2CddwTaskId%2CdwEnv%2Cptag%2Csource%2CstrMarkList%2CstrPgUUNum%2CstrPgtimestamp%2CstrPhoneID%2CstrShareId%2CstrVersion%2CstrZone&_ste=1`, 'QueryUserInfo')
        await $.wait(500)
        try {
            $.sharecode.push($.compact($.QueryUserInfo, ['strMyShareId']))
        } catch (e) {}
    }
}
async function main(id) {
    common.assert(id.strMyShareId, "没有可助力ID")
    url = `https://m.jingxi.com/jxbfd/story/helpbystage?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=139022.1.2&strShareId=${id.strMyShareId}&_stk=_cfd_t%2CbizCode%2CdwEnv%2Cptag%2Csource%2CstrShareId%2CstrZone&_ste=1`
    let dec = await jxAlgo.dec(url)
    dec.cookie = id.cookie
    dec.console = 1
    await $.curl(dec)
}
async function work(url, source = '') {
    let dec = await jxAlgo.dec(url)
    await $.curl(dec,source)
}
