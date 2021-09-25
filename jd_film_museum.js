/*
动人影像馆
抽奖貌似没水了，累计签到有豆子，5天25豆，10天50豆，14天100豆  应该能拿到
注意*****************脚本会开一个会员卡，会加购，会助力作者********************
///cron 23 15 13-26 9 *
///https://raw.githubusercontent.com/star261/jd/main/scripts/jd_film_museum.js
* */
const $ = new Env('影像馆');
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';
let cookiesArr = [];
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
    };
} else {
    cookiesArr = [
        $.getdata("CookieJD"),
        $.getdata("CookieJD2"),
        ...$.toObj($.getdata("CookiesJD") || "[]").map((item) => item.cookie)].filter((item) => !!item);
}
!(async () => {
    if(Date.now() > 1632672000000){
        console.log(`活动已结束`);
        return ;
    }
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
        return;
    }
    let res = [];
    try{res = await getAuthorShareCode('https://raw.githubusercontent.com/star261/jd/main/code/museum.json');}catch (e) {}
    if(!res){
        try{res = await getAuthorShareCode('https://gitee.com/star267/share-code/raw/master/museum.json');}catch (e) {}
        if(!res){res = [];}
    }
    if(res.length === 0){
        $.shareUuid = '';
    }else{
        $.shareUuid = getRandomArrayElements(res,1)[0];
    }
    for (let i = 0; i < cookiesArr.length; i++) {
        getUA();
        $.index = i + 1;
        $.cookie = cookiesArr[i];
        $.isLogin = true;
        $.nickName = '';
        await TotalBean();
        $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
        console.log(`\n*****开始【京东账号${$.index}】${$.nickName || $.UserName}*****\n`);
        if (!$.isLogin) {
            $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
            if ($.isNode()) {
                await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
            }
            continue
        }
        $.shareUuid = '';
        await main();
    }
})().catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
}).finally(() => {
    $.done();
});

async function main() {
    $.token = ``;
    $.apptoken = ``;
    await getToken();
    if ($.token === ``) {console.log(`获取token失败`);return;}
    console.log(`获取token成功`);
    await getHtml();
    let apptokenInfo = await takePost('getAppTokenByJDToken',`jdtoken=${$.token}&shareuid=${$.shareUuid}`);
    if(apptokenInfo && apptokenInfo.apptoken){
        $.apptoken = apptokenInfo.apptoken;
    }else{
        console.log(`获取apptoken失败`);return;
    }
    console.log(`获取apptoken成功`);
    await $.wait(500);
    let typeList = ['lotteryCount','lotteryHistory','isFollow','isViewVR','isJoin','lotteryPublicShow','globalLotteryHistory','getLiveShowUrl'];
    $.activityInfo = {};
    for (let i = 0; i < typeList.length; i++) {
        $.activityInfo[typeList[i]] = await takeGet(typeList[i]);
        await $.wait(100);
    }
    if(!$.activityInfo.lotteryCount.cuponcode){
        let cuponcodeInfo =  await takeGet('getCuponCode');
        console.log(`获得活动抽奖码：${cuponcodeInfo.cuponcode}`);
        await $.wait(2000);
    }else{
        console.log(`活动抽奖码：${$.activityInfo.lotteryCount.cuponcode}`);
    }
    if($.activityInfo.isJoin.status === '0' && $.shareUuid){
        await join('1000085868');
        await $.wait(1000);
        for (let i = 0; i < typeList.length; i++) {
            $.activityInfo[typeList[i]] = await takeGet(typeList[i]);
            await $.wait(100);
        }
    }
    await $.wait(2000);
    await doTask();
    let lotteryCountInfo =  await takeGet('lotteryCount');
    let count = lotteryCountInfo.count;
    console.log(`可抽奖：${count}次`);
    for (let i = 0; i < count; i++) {
        console.log(`\n进行第${i+1}次抽奖`)
        let lotteryInfo = await takeGet('doLottery');
        console.log(JSON.stringify(lotteryInfo));
        await $.wait(2000);
    }
}

async function takePost(type,body) {
    let url =  `https://xm.bjsidao.com/${type}`;
    let info = {
        url: url,
        body:body,
        headers: {
            "Host": "xm.bjsidao.com",
            "Accept": "*/*",
            "Content-Type":"application/x-www-form-urlencoded",
            "Origin":"https://jmkj2-isv.isvjcloud.com",
            "Referer": "https://jmkj2-isv.isvjcloud.com/",
            "apptoken":$.apptoken,
            "User-Agent": $.UA,
            "Accept-Language": "zh-cn",
            "Accept-Encoding": "gzip, deflate, br",
        }
    }
    return new Promise(resolve => {
        $.post(info, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data);
                    if(data.data === null){
                        data.data = {};
                    }
                    data.data.message = data.message;
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data.data);
            }
        })
    })
}

async function takeGet(type) {
    let url =  `https://xm.bjsidao.com/${type}`;
    let info = {
        url: url,
        headers: {
            "Host": "xm.bjsidao.com",
            "Accept": "*/*",
            "Content-Type":"application/x-www-form-urlencoded",
            "Origin":"https://jmkj2-isv.isvjcloud.com",
            "Referer": "https://jmkj2-isv.isvjcloud.com/",
            "apptoken":$.apptoken,
            "User-Agent": $.UA,
            "Accept-Language": "zh-cn",
            "Accept-Encoding": "gzip, deflate, br",
        }
    }
    return new Promise(resolve => {
        $.get(info, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data);
                    if(data.data === null){
                        data.data = {};
                    }
                    data.data.message = data.message;
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data.data);
            }
        })
    })
}

async function doTask(){
    console.log(`执行签到任务`);
    let returnInfo = await takeGet('checkIn');
    console.log(`签到：${returnInfo.message}`);
    await $.wait(2000);
    if($.activityInfo.isFollow.status === '0'){
        console.log(`执行关注任务`);
        let info = await takeGet('followShop');
        console.log(`关注：${info.message}`);
        await $.wait(2000);
    }
    if($.activityInfo.isViewVR.status === '0'){
        console.log(`执行VR任务`);
        let info = await takeGet('viewVR');
        console.log(`VR：${info.message}`);
        await $.wait(2000);
    }
    console.log(`进入直播间任务`);
    returnInfo = await takeGet('viewLiveShow');
    console.log(`进入直播间：${returnInfo.message}`);
    await $.wait(2000);
    let itemList = ['100025643312','100025643292','100025678746'];
    for (let i = 0; i < itemList.length; i++) {
        console.log(`浏览：${itemList[i]}`);
        returnInfo = await takePost('viewProduct',`sku=${itemList[i]}`);
        console.log(`浏览：${returnInfo.message}`);
        await $.wait(2000);
    }
    for (let i = 0; i < itemList.length; i++) {
        console.log(`加购：${itemList[i]}`);
        returnInfo = await takePost('addToCart',`num=1&itemId=${itemList[i]}`);
        console.log(`加购：${returnInfo.message}`);
        await $.wait(2000);
    }
    let shareTime = 0;
    let runTime = 0;
    do {
        console.log(`执行分享`);
        shareTime ++;
        returnInfo = await takeGet('shareCount');
        shareTime = returnInfo.shareCount;
        await $.wait(1000);
        returnInfo = await takeGet('shareReport');
        shareTime = returnInfo.shareCount;
        await $.wait(2000);
        console.log(`已分享：${shareTime}次`);
        runTime++;
    }while (shareTime < 5 && runTime < 5)

}
function getHtml() {
    let config ={
        url:`https://jmkj2-isv.isvjcloud.com//jd/index.html?vtype=share&uid=${$.shareUuid}`,
        headers: {
            'Host':'jmkj2-isv.isvjcloud.com',
            'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Cookie': `IsvToken=${$.token};${$.cookie}`,
            "User-Agent": $.UA,
            'Accept-Language':'zh-cn',
            'Accept-Encoding':'gzip, deflate, br',
            'Connection':'keep-alive'
        }
    }
    return new Promise(resolve => {
        $.get(config, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {

                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}
async function join(venderId) {
    return new Promise(async resolve => {
        $.shopactivityId = ''
        await $.wait(1000)
        await getshopactivityId(venderId)
        $.get(ruhui(`${venderId}`), async (err, resp, data) => {
            try {
                // console.log(data)
                data = JSON.parse(data);
                if(data.success == true){
                    $.log(data.message)
                    if(data.result && data.result.giftInfo){
                        for(let i of data.result.giftInfo.giftList){
                            console.log(`入会获得:${i.discountString}${i.prizeName}${i.secondLineDesc}`)
                        }
                    }
                }else if(data.success == false){
                    $.log(data.message)
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}
async function getshopactivityId(venderId) {
    return new Promise(resolve => {
        $.get(shopactivityId(`${venderId}`), async (err, resp, data) => {
            try {
                data = JSON.parse(data);
                if(data.success == true){
                    console.log(`入会:${data.result.shopMemberCardInfo.venderCardName || ''}`)
                    $.shopactivityId = data.result.interestsRuleList && data.result.interestsRuleList[0] && data.result.interestsRuleList[0].interestsInfo && data.result.interestsRuleList[0].interestsInfo.activityId || ''
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}
function ruhui(functionId) {
    let activityId = ``
    if($.shopactivityId) activityId = `,"activityId":${$.shopactivityId}`
    return {
        url: `https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=bindWithVender&body={"venderId":"${functionId}","shopId":"${functionId}","bindByVerifyCodeFlag":1,"registerExtend":{},"writeChildFlag":0${activityId},"channel":401}&client=H5&clientVersion=9.2.0&uuid=88888`,
        headers: {
            'Content-Type': 'text/plain; Charset=UTF-8',
            'Origin': 'https://api.m.jd.com',
            'Host': 'api.m.jd.com',
            'accept': '*/*',
            'User-Agent': $.UA,
            'content-type': 'application/x-www-form-urlencoded',
            'Referer': `https://shopmember.m.jd.com/shopcard/?venderId=${functionId}&shopId=${functionId}&venderType=5&channel=401&returnUrl=https://lzdz1-isv.isvjcloud.com/dingzhi/dz/openCard/activity/832865?activityId=c225ad5922cf4ac8b4a68fd37f486088&shareUuid=${$.shareUuid}`,
            'Cookie': $.cookie
        }
    }
}
function shopactivityId(functionId) {
    return {
        url: `https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=getShopOpenCardInfo&body=%7B%22venderId%22%3A%22${functionId}%22%2C%22channel%22%3A401%7D&client=H5&clientVersion=9.2.0&uuid=88888`,
        headers: {
            'Content-Type': 'text/plain; Charset=UTF-8',
            'Origin': 'https://api.m.jd.com',
            'Host': 'api.m.jd.com',
            'accept': '*/*',
            'User-Agent': $.UA,
            'content-type': 'application/x-www-form-urlencoded',
            'Referer': `https://shopmember.m.jd.com/shopcard/?venderId=${functionId}&shopId=${functionId}&venderType=5&channel=401&returnUrl=https://lzdz1-isv.isvjcloud.com/dingzhi/dz/openCard/activity/832865?activityId=c225ad5922cf4ac8b4a68fd37f486088&shareUuid=${$.shareUuid}`,
            'Cookie': $.cookie
        }
    }
}
function getToken() {
    let config = {
        url: 'https://api.m.jd.com/client.action?functionId=isvObfuscator',
        body: `area=2_2830_51828_0&body=%7B%22url%22%3A%22https%3A%5C/%5C/jmkj2-isv.isvjcloud.com%5C/%5C/jd%5C/index.html?vtype%3Dshare%26uid%3D1319%26lng%3D121.330575%26lat%3D31.292041%26sid%3Dd68167971a0380420a29f9072a7c491w%26un_area%3D2_2830_51828_0%22%2C%22id%22%3A%22%22%7D&build=167814&client=apple&clientVersion=10.1.4&d_brand=apple&d_model=iPhone9%2C2&eid=eidI42470115RDhDRjM1NjktODdGQi00RQ%3D%3DB3mSBu%2BcGp7WhKUUyye8/kqi1lxzA3Dv6a89ttwC7YFdT6JFByyAtAfO0TOmN9G2os20ud7RosfkMq80&isBackground=N&joycious=93&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=5a8a5743a5d2a4110a8ed396bb047471ea120c6a&osVersion=14.6&partner=apple&rfs=0000&scope=01&screen=1242%2A2208&sign=e1e6d76b164dd52cab8f0dcec61faa76&st=1631528316464&sv=100`,
        headers: {
            'Host': 'api.m.jd.com',
            'accept': '*/*',
            'user-agent': 'JD4iPhone/167490 (iPhone; iOS 14.2; Scale/3.00)',
            'accept-language': 'zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6',
            'content-type': 'application/x-www-form-urlencoded',
            'Cookie': $.cookie
        }
    }
    return new Promise(resolve => {
        $.post(config, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data);
                    $.token = data['token']
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}
function getUA(){
    $.UA = `jdapp;iPhone;10.0.10;14.3;${randomString(40)};network/wifi;model/iPhone12,1;addressid/4199175193;appBuild/167741;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`
}
function randomString(e) {
    e = e || 32;
    let t = "abcdef0123456789", a = t.length, n = "";
    for (i = 0; i < e; i++)
        n += t.charAt(Math.floor(Math.random() * a));
    return n
}
function TotalBean() {
    return new Promise(async resolve => {
        const options = {
            "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
            "headers": {
                "Accept": "application/json,text/plain, */*",
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-cn",
                "Connection": "keep-alive",
                "Cookie": $.cookie,
                "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data['retcode'] === 13) {
                            $.isLogin = false; //cookie过期
                            return
                        }
                        if (data['retcode'] === 0) {
                            $.nickName = (data['base'] && data['base'].nickname) || $.UserName;
                        } else {
                            $.nickName = $.UserName
                        }
                    } else {
                        console.log(`京东服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}
function getRandomArrayElements(arr, count) {
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}
function getAuthorShareCode(url) {
    return new Promise(async resolve => {
        const options = {
            "url": `${url}`,
            "timeout": 10000,
            "headers": {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
            }
        };
        if ($.isNode() && process.env.TG_PROXY_HOST && process.env.TG_PROXY_PORT) {
            const tunnel = require("tunnel");
            const agent = {
                https: tunnel.httpsOverHttp({
                    proxy: {
                        host: process.env.TG_PROXY_HOST,
                        port: process.env.TG_PROXY_PORT * 1
                    }
                })
            }
            Object.assign(options, { agent })
        }
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                } else {
                    if (data) data = JSON.parse(data)
                }
            } catch (e) {
                // $.logErr(e, resp)
            } finally {
                resolve(data || []);
            }
        })
        await $.wait(10000)
        resolve();
    })
}
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
