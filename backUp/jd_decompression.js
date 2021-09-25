/**
 * 蚊子腿豆子，24号应该可以参与瓜分
 * 活动到24号。一天可以跑2次
 * cron  5 6,8 12-24 8 *
 */
const $ = new Env('热血心跳,狂解压');
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';
let cookiesArr = [];
$.activityID = 'dz2107100008586804';
$.shopid = '1000085868';
$.shareUuid = '4efc89e0a5604304bd9414c21312ab0d';
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
    cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
        return;
    }
    for (let i = 0; i < cookiesArr.length; i++) {
        await getUA();
        $.index = i + 1;
        $.cookie = cookiesArr[i];
        $.oldcookie = cookiesArr[i];
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
        await main();
    }
})().catch((e) => {$.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')}).finally(() => {$.done();});

async function getUA(){
    $.UA = `jdapp;iPhone;10.0.10;14.3;${randomString(40)};network/wifi;model/iPhone12,1;addressid/3364463029;appBuild/167764;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`
}
function randomString(e) {
    e = e || 32;
    let t = "abcdef0123456789", a = t.length, n = "";
    for (i = 0; i < e; i++)
        n += t.charAt(Math.floor(Math.random() * a));
    return n
}

async function main() {
    $.token = ``;
    await getToken();
    if($.token === ``){
        console.log(`获取token失败`);return;
    }
    console.log(`token:${$.token}`);
    await $.wait(1000);
    await getActCk();
    await $.wait(1000);
    $.pin = '';
    await takePostRequest('getMyPing');
    console.log($.pin);
    if($.pin === ``){
        $.hotFlag = true;
        console.log(`获取pin失败,该账号可能是黑号`);return;
    }
    await $.wait(1000);
    await getUserInfo();
    await $.wait(1000);
    $.cookie=$.cookie + `AUTH_C_USER=${$.pin}`
    await accessLogWithAD();
    $.cookie=$.cookie + `AUTH_C_USER=${$.pin}`
    console.log(`初始化`);
    await $.wait(1000);
    $.activityData = {};
    await takePostRequest('activityContent');
    if(JSON.stringify($.activityData) === `{}`){
        console.log(`获取活动详情失败`);return;
    }
    console.log(`获取活动详情成功`);
    // console.log(`助力码：${$.activityData.actorUuid}`);
    // await doTask();
    // await $.wait(3000);
    // await takePostRequest('activityContent');
    // await $.wait(2000);
    await takePostRequest('guafen');
    //let score = $.activityData.score;
    //console.log(`可投票次数：`+score);
    //let scoreFlag = false;
    //$.canScore = true;
    //let aa = 0;
    // for (let i = 0; i < score && $.canScore && aa < 40; i++) {
    //     scoreFlag = true;
    //     console.log(`进行第${i+1}次投票`);
    //     await takePostRequest('insxintiao');
    //     await $.wait(1500);
    //     aa++;
    // }
    // if(scoreFlag){
    //     await $.wait(1000);
    //     await takePostRequest('activityContent');
    //     await $.wait(1000);
    // }
    // let score2 = $.activityData.score2;
    // console.log(`可扭蛋次数：`+score2);
    // if(score2 > 0){
    //     await takePostRequest('drawContent');
    //     await $.wait(1000);
    // }
    // for (let i = 0; i < score2; i++) {
    //     console.log(`进行第${i+1}次扭蛋`);
    //     await takePostRequest('draw');
    //     await $.wait(1500);
    // }
    // if($.shareUuid === '4efc89e0a5604304bd9414c21312ab0d'){
    //     $.shareUuid = $.activityData.actorUuid;
    // }
}

async function doTask(){
    $.taskValue = '';
    if(!$.activityData.signStatus){
        console.log(`去签到`);
        $.taskType=0;
        await takePostRequest('saveTask');
        await $.wait(1000);
    }else{
        console.log(`已签到`);
    }
    if(!$.activityData.followShopStatus){
        console.log(`去关注店铺`);
        $.taskType=23;
        await takePostRequest('saveTask');
        await $.wait(1000);
    }else{
        console.log(`已关注`);
    }
    if(!$.activityData.addCartStatus){
        console.log(`去执行加购`);
        $.taskType=21;
        await takePostRequest('saveTask');
        await $.wait(1000);
    }else{
        console.log(`已执行加购`);
    }
    let toMainData = $.activityData.toMainData;
    for (let i = 0; i < toMainData.length; i++) {
        $.taskType=12;
        if(!toMainData[i].toMainStatus){
            console.log(`去执行浏览会场`);
            $.taskValue = toMainData[i].value;
            await takePostRequest('saveTask');
            await $.wait(1000);
        }
    }
    let toShopStatus = $.activityData.toShopStatus;
    for (let i = 0; i < toShopStatus.length; i++) {
        $.taskType=14;
        if(!toShopStatus[i].toShopStatus){
            console.log(`去执行浏览店铺`);
            $.taskValue = toShopStatus[i].value;
            await takePostRequest('saveTask');
            await $.wait(1000);
        }
    }
    let viewViewData = $.activityData.viewViewData;
    for (let i = 0; i < viewViewData.length; i++) {
        $.taskType=31;
        if(!viewViewData[i].viewViewStatus){
            console.log(`去执行浏览视频`);
            $.taskValue = viewViewData[i].value;
            await takePostRequest('saveTask');
            await $.wait(1000);
        }
    }
}
async function takePostRequest(type){
    let url = '';
    let body = ``;
    switch (type) {
        case 'getMyPing':
            url= `https://lzdz1-isv.isvjcloud.com/customer/getMyPing`;
            body = `userId=${$.shopid}&token=${encodeURIComponent($.token)}&fromType=APP`;
            break;
        case 'activityContent':
            url= 'https://lzdz1-isv.isvjcloud.com/dingzhi/vivo/iqoojieyapa/activityContent';
            body = `activityId=${$.activityID}&pin=${encodeURIComponent($.pin)}&pinImg=${encodeURIComponent($.attrTouXiang)}&nick=${encodeURIComponent($.nickname)}&cjyxPin=&cjhyPin=&shareUuid=${$.shareUuid}`
            break;
        case 'saveTask':
            url= 'https://lzdz1-isv.isvjcloud.com/dingzhi/vivo/iqoojieyapa/saveTask';
            body = `pin=${encodeURIComponent($.pin)}&activityId=${$.activityID}&taskType=${$.taskType}&actorUuid=${$.activityData.actorUuid}&shareUuid=${$.shareUuid}&taskValue=${$.taskValue}`;
            break;
        case 'insxintiao':
            url= 'https://lzdz1-isv.isvjcloud.com/dingzhi/vivo/iqoojieyapa/insxintiao';
            body = `pin=${encodeURIComponent($.pin)}&activityId=${$.activityID}&playerId=8`;
            break;
        case 'draw':
            url= 'https://lzdz1-isv.isvjcloud.com/dingzhi/vivo/iqoojieyapa/draw';
            body = `activityId=${$.activityID}&uuid=${$.activityData.actorUuid}&pin=${encodeURIComponent($.pin)}`;
            break;
        case 'drawContent':
            url= 'https://lzdz1-isv.isvjcloud.com/dingzhi/taskact/common/drawContent';
            body = `activityId=dz2107100008586804&pin=${encodeURIComponent($.pin)}`;
            break;
        case 'guafen':
            url= 'https://lzdz1-isv.isvjcloud.com/dingzhi/vivo/iqoojieyapa/guafen';
            body = `activityId=dz2107100008586804&pin=${encodeURIComponent($.pin)}&playerId=8`;
            break;
        default:
            console.log(`错误${type}`);
    }
    let myRequest = getPostRequest(url,body);
    return new Promise(async resolve => {
        $.post(myRequest, (err, resp, data) => {
            try {
                if(data){
                    dealReturn(type, data);
                }
            } catch (e) {
                console.log(data);
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

function dealReturn(type, data) {
    try {
        data = JSON.parse(data);
    }catch (e) {
        console.log(`执行任务异常`);
        console.log(data);
        $.runFalag = false;
        $.canScore = false;
    }
    switch (type) {
        case 'getMyPing':
            if (data.data && data.data.secretPin) {
                $.pin = data.data.secretPin
                $.nickname = data.data.nickname
            }else{
                console.log(JSON.stringify(data));
            }
            break;
        case 'activityContent':
            if (data.data && data.result && data.count === 0) {
                $.activityData = data.data;
            } else {
                console.log(JSON.stringify(data));
            }
            break;
        case 'saveTask':
            if (data.result === true && data.count === 0) {
                console.log(`执行成功,获得京豆：${data.data.beans || 0}`);
            } else {
                //console.log(JSON.stringify(data))
            }
            console.log(JSON.stringify(data))
            break;
        case 'insxintiao':
            if (data.result === true && data.count === 0) {

            }else{
                $.canScore = false;
            }
            console.log(JSON.stringify(data));
            break;
        case 'draw':
            if (data.result === true && data.count === 0) {
                let wdsrvo = data.data.wdsrvo;
                if(wdsrvo.drawInfoType === 6){
                    console.log(`获得京豆：${wdsrvo.name}`);
                }else if(wdsrvo.drawInfoType === 0){
                    console.log(`啥都没有抽到`);
                }else{
                    console.log(`获得其他`);
                }
            } else {
                //console.log(JSON.stringify(data))
            }
            console.log(JSON.stringify(data))
            break;
        case 'insertCrmPageVisit':
            console.log(JSON.stringify(data))
            break;
        case 'getSimpleActInfoVo':
            console.log(JSON.stringify(data))
            break;
        case 'guafen':
            if (data.result === true && data.count === 0) {
                console.log(`瓜分获得：${data.data.beans || '0'}`)
            }
            console.log(JSON.stringify(data))
            break;
        default:
            console.log(JSON.stringify(data));
    }
}

function getPostRequest(url,body) {
    let headers =  {
        'Host': 'lzdz1-isv.isvjcloud.com',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Accept-Language': 'zh-cn',
        'Accept-Encoding': 'gzip, deflate, br',
        'content-type': 'application/x-www-form-urlencoded',
        'Origin':'https://lzdz1-isv.isvjcloud.com',
        'user-agent': $.UA,
        'Connection':'keep-alive',
        'Referer': `https://lzdz1-isv.isvjcloud.com/dingzhi/vivo/iqoojieyapa/activity/dz2107100008586804?activityId=dz2107100008586804`,
        'Cookie': $.cookie,
    }

    return  {url: url, method: `POST`, headers: headers, body: body};
}
async function getUserInfo() {
    const url = `https://lzdz1-isv.isvjcloud.com/wxActionCommon/getUserInfo`;
    const method = `POST`;
    const headers = {
        'Host' : `lzdz1-isv.isvjcloud.com`,
        'X-Requested-With' : `XMLHttpRequest`,
        'Connection' : `keep-alive`,
        'Accept-Encoding' : `gzip, deflate, br`,
        'Content-Type' : `application/x-www-form-urlencoded`,
        'Origin' : `https://lzdz1-isv.isvjcloud.com`,
        'User-Agent' : `JD4iPhone/162751 (iPhone; iOS 14.6; Scale/3.00)`,
        'Cookie' : $.cookie ,
        'Referer' : `https://lzdz1-isv.isvjcloud.com/dingzhi/vivo/iqoojieyapa/activity/${$.activityID}`,
        'Accept-Language' : `zh-cn`,
        'Accept' : `application/json`
    };
    const body = `pin=${encodeURIComponent($.pin)}`;
    let myRequest = {url: url, method: method, headers: headers, body: body};
    return new Promise(resolve => {
        $.post(myRequest, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                }
                else {
                    if(data){
                        data = JSON.parse(data);
                        if(data.count === 0 && data.result){
                            $.attrTouXiang = data.data.yunMidImageUrl
                            != data.data.yunMidImageUrl ? $.attrTouXiang = data.data.yunMidImageUrl : $.attrTouXiang = "https://img10.360buyimg.com/imgzone/jfs/t1/7020/27/13511/6142/5c5138d8E4df2e764/5a1216a3a5043c5d.png"
                        }
                    }
                }
            } catch (e) {
                console.log(e, resp)
            } finally {
                resolve();
            }
        })
    })
}
function accessLogWithAD() {
    let config = {
        url: `https://lzdz1-isv.isvjcloud.com/common/accessLogWithAD`,
        headers: {
            'Host': 'lzdz1-isv.isvjcloud.com',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Accept-Language': 'zh-cn',
            'Accept-Encoding': 'gzip, deflate, br',
            'content-type': 'application/x-www-form-urlencoded',
            'Origin':'https://lzdz1-isv.isvjcloud.com',
            'user-agent': $.UA,
            'Connection':'keep-alive',
            'Referer': `https://lzdz1-isv.isvjcloud.com/dingzhi/vivo/iqoojieyapa/activity/dz2107100008586804?activityId=dz2107100008586804`,
            'Cookie': $.cookie,
        },
        body:`venderId=${$.shopid}&code=99&pin=${encodeURIComponent($.pin)}&activityId=${$.activityID}&pageUrl=https%3A%2F%2Flzdz1-isv.isvjcloud.com%2Fdingzhi%2Fvivo%2Fiqoojieyapa%2Factivity%2F492728%3FactivityId%3Ddz2107100008586804%26shareUuid%3D%26adsource%3Dnull%26shareuserid4minipg%3D${encodeURIComponent($.pin)}%26shopid%3D1000085868%26lng%3D121.330619%26lat%3D31.292002%26sid%3Db1f8c732fcae5db1c375c5f51e92287w%26un_area%3D2_2826_51942_0&subType=app&adSource=null`
    }
    return new Promise(resolve => {
        $.post(config, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    $.cookie =  $.oldcookie;
                    if ($.isNode())
                        for (let ck of resp['headers']['set-cookie']) {
                            $.cookie = `${$.cookie}${ck.split(";")[0]};`
                        }
                    else {
                        for (let ck of resp['headers']['Set-Cookie'].split(',')) {
                            $.cookie = `${$.cookie}${ck.split(";")[0]};`
                        }
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}
function getActCk() {
    let config = {
        url: `https://lzdz1-isv.isvjcloud.com/dingzhi/vivo/iqoojieyapa/activity/dz2107100008586804`,
        headers: {
            'Host': 'lzdz1-isv.isvjcloud.com',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'user-agent': $.UA,
            'content-type': 'application/x-www-form-urlencoded',
            'Cookie': $.cookie,
        }
    }
    return new Promise(resolve => {
        $.get(config, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    $.cookie =  $.oldcookie;
                    if ($.isNode())
                        for (let ck of resp['headers']['set-cookie']) {
                            $.cookie = `${$.cookie}${ck.split(";")[0]};`
                        }
                    else {
                        for (let ck of resp['headers']['Set-Cookie'].split(',')) {
                            $.cookie = `${$.cookie}${ck.split(";")[0]};`
                        }
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}
function getToken() {
    let config = {
        url: 'https://api.m.jd.com/client.action?functionId=isvObfuscator',
        body: 'area=2_2830_51828_0&body=%7B%22url%22%3A%22https%3A%5C/%5C/lzdz1-isv.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&build=167764&client=apple&clientVersion=10.0.10&d_brand=apple&d_model=iPhone9%2C2&eid=eidI42470115RDhDRjM1NjktODdGQi00RQ%3D%3DB3mSBu%2BcGp7WhKUUyye8/kqi1lxzA3Dv6a89ttwC7YFdT6JFByyAtAfO0TOmN9G2os20ud7RosfkMq80&isBackground=N&joycious=95&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=5a8a5743a5d2a4110a8ed396bb047471ea120c6a&osVersion=14.6&partner=apple&rfs=0000&scope=01&screen=1242%2A2208&sign=d24754441cd36764a1c2a2d98a2d45dd&st=1628758493429&sv=122',
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
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
