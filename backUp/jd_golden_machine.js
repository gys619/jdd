/**
活动路径  首页搜索 金机馆
cron 33 4,7 8-20 8 * https://raw.githubusercontent.com/star261/jd/main/scripts/jd_golden_machine.js
第一个账号参加作者内置的团，其他账号参加第一个账号的团
 */
const $ = new Env('金机奖投票');
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';
let cookiesArr = [];
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
    cookiesArr = [
        $.getdata("CookieJD"),
        $.getdata("CookieJD2"),
        ...$.toObj($.getdata("CookiesJD") || "[]").map((item) => item.cookie)].filter((item) => !!item);
}
$.authorizationInfo = {};
$.joinTeamLsit = [];
$.inviteList = [];
$.authorCode = '';
let res = [];
!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
        return;
    }

    try{res = await getAuthorShareCode('https://raw.githubusercontent.com/star261/jd/main/code/goldPhone.json');}catch (e) {}
    if(!res){
        try{res = await getAuthorShareCode('https://gitee.com/star267/share-code/raw/master/goldPhone.json');}catch (e) {}
        if(!res){res = [];}
    }
    if(res && res.length > 0){
        $.authorCode = getRandomArrayElements(res,1)[0];
    }
    for (let i = 0; i < cookiesArr.length; i++) {
        await getUA();
        $.index = i + 1;
        $.cookie = cookiesArr[i];
        $.isLogin = true;
        $.nickName = '';
        $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
        await TotalBean();
        console.log(`\n*****开始【京东账号${$.index}】${$.nickName || $.UserName}*****\n`);
        if (!$.isLogin) {
            $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
            if ($.isNode()) {
                await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
            }
            continue
        }
        await main();
        await $.wait(1000);
        $.authorizationInfo[$.UserName] = $.authorization;
    }
})().catch((e) => {$.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')}).finally(() => {$.done();});

async function main() {
    $.token = ``;
    await getToken();
    if($.token === `` || !$.token){
        console.log(`获取token失败`);return;
    }
    console.log(`token:${$.token}`);
    await $.wait(1000);
    $.authorization = ``;
    await getJdUserInfo();
    if($.authorization === ``){
        console.log(`获取authorization失败`);return;
    }
    await $.wait(1000);
    $.useInfo = {};
    await takeGetRequest('get_user_info');
    if(JSON.stringify($.useInfo) === `{}` || $.useInfo.status_code === 403){
        console.log(`获取用户信息失败,可能是黑号`);return;
    }
    console.log(`组队码：${$.useInfo.code}`);
    await $.wait(1000);
    $.homeInfo = {};
    await takeGetRequest('get_home_info');
    if(JSON.stringify($.homeInfo) === `{}`){
        console.log(`获取活动详情失败`);return;
    }
    if($.useInfo.member_team_id === 0 && $.authorCode){
        console.log(`去参团: ${$.authorCode}`)
        await takePostRequest('join_team');
    }else{
        console.log(`已参团`);
    }
    if($.index === 1){
        $.authorCode = $.useInfo.code
    }
    $.needVoteList = $.homeInfo.hard_list;
    await doVote();
    $.needVoteList = $.homeInfo.soft_list;
    await doVote();
    $.teamInfo = {}
    $.type = 1;
    await takeGetRequest('team_info');
    console.log(`自己队伍分数：${$.teamInfo.team_vote_total}`);
    await $.wait(2000);
    if(Number($.teamInfo.my_vote_total) > 0){
        if($.teamInfo.draw_total_first === 0 && $.teamInfo.team_vote_total >= 80){
            console.log(`去抽奖1`);
            $.draw_type = 1;
            await takePostRequest('draw_prize');
            await $.wait(2000);
        }
        if($.teamInfo.draw_total_second === 1 && $.teamInfo.team_vote_total >= 180){
            console.log(`去抽奖2`);
            $.draw_type = 2;
            await takePostRequest('draw_prize');
            await $.wait(2000);
        }
    }
    $.type = 2;
    await takeGetRequest('team_info');
    console.log(`加入队伍分数：${$.teamInfo.team_vote_total}`);
    await $.wait(2000);
    if(Number($.teamInfo.my_vote_total) > 0){
        if($.teamInfo.draw_total_first === 0 && $.teamInfo.team_vote_total >= 80){
            console.log(`去抽奖3`);
            $.draw_type = 1;
            await takePostRequest('draw_prize');
            await $.wait(2000);
        }
        if($.teamInfo.draw_total_second === 1 && $.teamInfo.team_vote_total >= 180){
            console.log(`去抽奖4`);
            $.draw_type = 2;
            await takePostRequest('draw_prize');
            await $.wait(2000);
        }
    }
    await takeGetRequest('my_prize');
}

async function doVote(){
    for (let i = 0; i < $.needVoteList.length; i++) {
        $.oneVoteInfo = $.needVoteList[i];
        if($.oneVoteInfo.is_vote === 1){
            console.log(`${$.oneVoteInfo.name},已投票`);
            continue;
        }
        $.productList = $.oneVoteInfo.product_list;
        $.productList = $.productList.sort(compare('vote_total'));
        $.productInfo = $.productList[0];
        console.log(`${$.oneVoteInfo.name},去投票，投给${$.productInfo.product_name}`);
        await takePostRequest('product_vote');
        await $.wait(2000);
    }
}

function compare(property){
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value2 -  value1;
    }
}
async function takeGetRequest(type){
    let  url= `https://xinrui1-isv.isvjcloud.com/gapi/${type}`;
    if( type === 'team_info'){
        url = `https://xinrui1-isv.isvjcloud.com/gapi/team_info?type=${$.type}`;
    }else if(type  === 'my_prize'){
        url = `https://xinrui1-isv.isvjcloud.com/gapi/my_prize?type=5&page=1`
    }
    let myRequest = getGetRequest(url);
    return new Promise(async resolve => {
        $.get(myRequest, (err, resp, data) => {
            try {
                dealReturn(type, data);
            } catch (e) {
                console.log(data);
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}
async function takePostRequest(type){
    let url = '';
    let body = '';
    switch (type) {
        case 'product_vote':
            body= JSON.stringify({"position_id":$.oneVoteInfo.id,"product_id":$.productInfo.id});
            url = `https://xinrui1-isv.isvjcloud.com/gapi/product_vote`;
            break;
        case 'join_team':
            body= JSON.stringify({"inviter_id":$.authorCode});
            url = `https://xinrui1-isv.isvjcloud.com/gapi/join_team`;
            break;
        case 'draw_prize':
            body= JSON.stringify({"type":$.type ,"draw_type":$.draw_type});
            url = `https://xinrui1-isv.isvjcloud.com/gapi/draw_prize`;
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
                }else{
                    //console.log(`为空`)
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
    }
    switch (type) {
        case 'get_home_info':
            if(data){
                $.homeInfo = data;
            }
            break;
        case 'get_user_info':
            if(data){
                $.useInfo = data;
            }
            break;
        case 'home_task_info':
            if(data){
                $.taskInfo = data;
            }
            break;
        case 'product_vote':
            if(data){
                console.log(`投票成功，获得豆子：${data.beans_num || 0}`);
            }
            break;
        case 'join_team':
            if(data){
                console.log(JSON.stringify(data));
            }
            break;
        case 'team_info':
            if(data){
                $.teamInfo = data
            }
            break;
        case 'draw_prize':
            if(data){
                console.log(JSON.stringify(data));
            }
            break;
        case 'my_prize':
            if(data){
                let message = '';
                if(data && data.length>0){
                    for (let i = 0; i < data.length; i++) {
                        let oneInfo = data[i];
                        if(oneInfo.is_get !== 1){
                            console.log(`奖品：${oneInfo.name},未填写地址`)
                            message+= oneInfo.name+'\n';
                        }else{
                            console.log(`奖品：${oneInfo.name},已填写地址`)
                        }
                    }
                    if(message !== ''){
                        message = `京东账号${$.index} ${$.UserName},抽到实物，请到APP填写地址\n 活动路径: 手机馆--》IQOO大牌日--》左下角金机馆\n`+message;
                        notify.sendNotify(`金机奖投票`,message);
                    }
                }
            }
            break;
        default:
            console.log(JSON.stringify(data));
    }
}
function getGetRequest(url) {
    let headers =  {
        'Host': 'xinrui1-isv.isvjcloud.com',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cookie': $.cookie + `wait-update=${$.authorization};`,
        'Connection':'keep-alive',
        'User-Agent':$.UA,
        'Authorization': 'bearer '+ ($.authorization === '' ? 'undefined' : $.authorization),
        'Referer': 'https://xinrui1-isv.isvjcloud.com/gold-phone/loading/',
        'Accept-Language': 'zh-cn',
    }
    return  {url: url, headers: headers};
}
function getPostRequest(url,body) {
    let headers =  {
        'Host': 'xinrui1-isv.isvjcloud.com',
        'Accept':'application/x.jd-school-raffle.v1+json',
        'Authorization': 'Bearer '+ ($.authorization === '' ? 'undefined' : $.authorization),
        'Source':'02',
        'Accept-Language': 'zh-cn',
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Type':'application/json;charset=utf-8',
        'Origin':'https://xinrui1-isv.isvjcloud.com',
        'User-Agent':$.UA,
        'Connection':'keep-alive',
        'Referer':'https://xinrui1-isv.isvjcloud.com/gold-phone/?channel=fc&tttparams=MMzMjfMTeyJnTG5nIjoiMTIxLjM5MzIwMyIsImdMYXQiOiIzMS4yMjI3NzEifQ8%3D%3D&lng=121.393203&lat=31.222771&sid=38228f043bc4906c37889c187fd10b5w&un_area=2_2841_61104_0',
        'Content-Length':32,
        'Cookie': `jd-golden-phone=${$.authorization};`,
    }
    return  {url: url, headers: headers,body:body};
}
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
async function getToken() {
    let config = {
        url: `https://api.m.jd.com/client.action?functionId=isvObfuscator`,
        body: 'area=16_1315_3486_59648&body=%7B%22url%22%3A%22https%3A%5C/%5C/xinrui1-isv.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&build=167764&client=apple&clientVersion=10.0.10&d_brand=apple&d_model=iPhone12%2C1&eid=eidIde27812210seewuOJWEnRZ6u7X5cB/JIQnsLj51RJEe7PtlRG/yNSbeUMf%2BbNdgjQzFxhZsU4m5/PLZOhi87ebHQ0wPc9qd82Bh%2BVoPAhwbhRqFY&isBackground=N&joycious=54&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=ebf4ce8ecbb641054b00c00483b1cee85660d196&osVersion=14.3&partner=apple&rfs=0000&scope=11&screen=828%2A1792&sign=3090b2b2997d877191d0aef083b8d985&st=1628230407213&sv=102&uemps=0-0&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJtgH/sOkA5ELPGCiuUXbsrWcAq%2B0c83LNknkzBXgDXlQ3pq2eMY2enviS/%2BJ6TGkfqBEbO/bQ5%2BKGVjit9RrmNU/D2OwTZ2Bqi/idA2EqDmsJuNS3bvh8kCV4sO4DAHDETkc3g6r8ZeDy72mlQ1hCUss2YaXalY%2BbnkC07OlzyjC8/fuhehBm0g%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=796606e8e181aa5865ec20728a27238b',
        headers: {
            'Host': 'api.m.jd.com',
            'accept': '*/*',
            'user-agent': 'JD4iPhone/167490 (iPhone; iOS 14.2; Scale/3.00)',
            'accept-language': 'zh-Hans-CN;q=1, en-CN;q=0.9',
            'accept-encoding':' gzip, deflate, br',
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
async function getJdUserInfo(){
    let url= `https://xinrui1-isv.isvjcloud.com/gapi/jd-user-info`;
    let body = `{"token":"${$.token}","source":"01"}`;
    let headers =  {
        'Host': 'xinrui1-isv.isvjcloud.com',
        'Accept': 'application/json, text/plain, */*',
        'Authorization': 'bearer '+ ($.authorization === '' ? 'undefined' : $.authorization),
        'Accept-Language': 'zh-cn',
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Type':'application/json;charset=utf-8',
        'Origin':'https://xinrui1-isv.isvjcloud.com',
        'User-Agent':$.UA,
        'Connection':'keep-alive',
        'Referer':'https://xinrui1-isv.isvjcloud.com/gold-phone/logined_jd/',
        'Content-Length':'101',
        'Cookie': $.cookie,
    }
    let myRequest = {url: url, headers: headers, body: body};
    return new Promise(async resolve => {
        $.post(myRequest, (err, resp, data) => {
            try {
                if (data) {
                    data = JSON.parse(data);
                    $.authorization = data.access_token;
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
