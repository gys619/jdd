/*
没有加购
只有抽奖(3*5豆)和关注频道(10豆)
一次性脚本 最高获得25豆

豆源是网友提供
*/

const $ = new Env('关注频道、抽奖');
const jdCookieNode = $.isNode() ? require('../jdCookie.js') : '';
const notify = $.isNode() ? require('../sendNotify') : '';
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [],
    cookie = '';
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
    cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
message = ''
!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
            "open-url": "https://bean.m.jd.com/"
        });
        return;
    }
    for (let i = 0; i < cookiesArr.length; i++) {
        cookie = cookiesArr[i];
        if (cookie) {
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            $.index = i + 1;
            getUA()
            console.log(`\n\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
            await run();
        }
    }
    if(message){
        $.msg($.name, ``, `${message}`);
        if ($.isNode()){
            await notify.sendNotify(`${$.name}`, `${message}`);
        }
    }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())

async function run(){
    try{
        await userFollow()
        $.beans = 0
        $.flag = true
        let s = 0
        do{
            s++
            await babelGetLottery()
            await $.wait(parseInt(Math.random() * 2000 + 1000, 10))
        }while ($.flag && s < 5)
        if($.beans > 0)
            message += `【京东账号${$.index}】抽奖获得 ${$.beans}京豆\n`
        await $.wait(parseInt(Math.random() * 2000 + 1000, 10))
    }catch(e){
        console.log(e)
    }
}

function babelGetLottery() {
    return new Promise(resolve => {
        let body = `area=16_1315_1316_53522&body=%7B%22authType%22%3A%222%22%2C%22enAwardK%22%3A%22a94947799f78a6beb9538f694d528773%22%2C%22awardSource%22%3A%221%22%2C%22encryptProjectId%22%3A%222PJKi1sSGWmepwk3pvkbg3kLzFEx%22%2C%22riskParam%22%3A%7B%22eid%22%3A%22eidId10b812191seBCFGmtbeTX2vXF3lbgDAVwQhSA8wKqj6OA9J4foPQm3UzRwrrLdO23B3E2wCUY%5C/bODH01VnxiEnAUvoM6SiEnmP3IPqRuO%2By%5C/%2BZo%22%2C%22shshshfpb%22%3A%22tpRNQYF4B2ptZ07pyRA5oT8p3uygxNMHgYjTaoyaWdm0MzVxwOgxoCddGswY3RNJbWJd9%2BpPALsXXeXWkkJIqYw%3D%3D%22%2C%22pageClickKey%22%3A%22Babel_WheelSurf%22%2C%22childActivityUrl%22%3A%22https%3A%5C/%5C/pro.m.jd.com%5C/mall%5C/active%5C/3Sttv9H3o4Xzj2HMMotraf2Lzo1f%5C/index.html?utm_user%3Dplusmember%26gx%3DRnFtxWdRPjTfmdQXrY1zXI5ygbNbZ-0R7Ef-qH4%26ad_od%3Dshare%26utm_source%3Dandroidapp%26utm_medium%3Dappshare%26utm_campaign%3Dt_335139774%26utm_term%3DQQfriends%22%7D%2C%22encryptAssignmentId%22%3A%2226t15SxBQ1VqETFyK8SWnoVoaecY%22%2C%22lotteryCode%22%3A%22166995%22%7D&build=167774&client=apple&clientVersion=10.1.0&d_brand=apple&d_model=iPhone8%2C1&eid=eidId10b812191seBCFGmtbeTX2vXF3lbgDAVwQhSA8wKqj6OA9J4foPQm3UzRwrrLdO23B3E2wCUY/bODH01VnxiEnAUvoM6SiEnmP3IPqRuO%2By/%2BZo&isBackground=N&joycious=63&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=2f7578cb634065f9beae94d013f172e197d62283&osVersion=13.1.2&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=175ffa4391dd31ae85f717fe3aa11c68&st=1631256344628&sv=110&uemps=0-1&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJRafa%2Bs2BEBX9pS3KsJrvFAXgcNSMFT6cSrD5TfjjobEeoHVBkMDPzUkeM%2BFTwbShxTVdAxWNF1frZtECq5hrpdRO2JrIPHVNpKKxetW7HSmBqkpDN0oVQcKrnNs4p8Asf4Vm2qEASwmq4GUzvVtPFOROTnlbaDcZvTyEeJVWyjbkXSXBbw2iwQ%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=796606e8e181aa5865ec20728a27238b`
        $.post(taskPostUrl('/client.action?functionId=babelGetLottery', body), async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${$.toStr(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    // console.log(data)
                    let res = $.toObj(data,data);
                    if(typeof res == 'object'){
                        let value = 0
                        if(res.prizeName){
                            value = parseInt(res.prizeName.replace('京豆',''),10)>0 && parseInt(res.prizeName.replace('京豆',''),10) || 0;
                        }
                        if(value > 0){
                            console.log(`抽奖获得 ${res.prizeName}`)
                            $.beans += value
                        }else if(res.promptMsg){
                            if(res.promptMsg.indexOf('抽奖机会已用完') > -1) $.flag = false
                            console.log(res.promptMsg)
                        }else{
                            console.log(data)
                        }
                    }else{
                        console.log(data)
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
function userFollow() {
    return new Promise(resolve => {
        let body = `clientVersion=10.1.4&body=%7B%22businessId%22%3A%221%22%2C%22themeId%22%3A%22618%22%2C%22type%22%3A%221%22%7D&build=90060&client=android&d_brand=HUAWEI&d_model=WLZ-AN00&osVersion=10&screen=2277*1080&partner=jingdong&oaid=00000000-0000-0000-0000-000000000000&openudid=550eca6b467ca4f3&eid=eidAaa7d8120dds6KxVQ/99lT92AeqmVR9zAqCsVUnt19g7yWVNEIyR4go6LV/WEFDoGamh2Sn9+TW1MZsRSdUlSEJvAuk9Lboi0309hiuC3ABsP479p&sdkVersion=29&lang=zh_CN&uuid=550eca6b467ca4f3&aid=550eca6b467ca4f3&area=22_2005_2009_36385&networkType=wifi&wifiBssid=unknown&uts=0f31TVRjBStSrEdgtzPKCs3ulofiQ%2F1YAJ0dM1Y2f2IrLsiSVl4vTUrGmJrTiqDYbhGcTcl5krZU3lNSms35%2FF4OUGZzyLk8VjQPy4EiuPqO47KRYsJYvG40gttKF9SAk%2BNpLe0pN6yzMYaZhXPvZB0EvaRk6ihG8oZTrxu2QSjIK8EXFWD0hZzeLlLW1f3wN9rouVlYuVUglDzT0qLosw%3D%3D&uemps=0-0&harmonyOs=1&st=1631254110104&sign=44df55d23e1008cc07f642e1f596d4b0&sv=110`
        $.post(taskPostUrl('/client.action?functionId=userFollow', body), async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${$.toStr(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    // console.log(data)
                    let res = $.toObj(data);
                    if(typeof res == 'object'){
                        let msg = ''
                        if(res.resultMsg){
                            msg += res.resultMsg + " "
                            message += `【京东账号${$.index}】${res.resultMsg}\n`
                        }
                        if(res.themeText){
                            msg += res.themeText + " "
                        }
                        if(msg){
                            console.log(msg)
                        }else{
                            console.log(data)
                        }
                    }else{
                        console.log(data)
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

function taskPostUrl(url, body) {
    return {
        url: `https://api.m.jd.com${url}`,
        body: body,
        headers: {
            "Accept": "*/*",
            "Accept-Language": "zh-cn",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded",
            'Cookie': `${cookie}`,
            "Host": "api.m.jd.com",
            "User-Agent": $.UA ,
        }
    }
}
function getUA(){
    // $.UA = `jdapp;iPhone;10.1.1;14.3;${randomString(40)};network/wifi;model/iPhone12,1;addressid/4199175193;appBuild/167774;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`
    $.UA = "JD4iPhone/167774 (iPhone; iOS 14.3; Scale/2.00)"
}
function randomString(e) {
    e = e || 32;
    let t = "abcdef0123456789", a = t.length, n = "";
    for (i = 0; i < e; i++)
        n += t.charAt(Math.floor(Math.random() * a));
    return n
}

function jsonParse(str) {
    if (typeof str == "string") {
        try {
            return JSON.parse(str);
        } catch (e) {
            console.log(e);
            $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
            return [];
        }
    }
}

// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}


