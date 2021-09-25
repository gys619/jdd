/*
    9.18-10.9 明星小店
    cron 12 19 19-30 9 * https://raw.githubusercontent.com/star261/jd/main/scripts/jd_star_shop.js
 */
const $ = new Env('明星小店');
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
$.inviteCodeList = [];
$.authorCodeList = [];
let cookiesArr = [];
$.linkID = '';
let uniqueIdList = [
    {'id':'RU59FC','name':'尹正','linkID':'Q7qMuOyySR-qdWRz4YYR0w','taskId':259},
];
const rewardList = [
    'Q7qMuOyySR-qdWRz4YYR0w',
]
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    });
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
    cookiesArr = [
        $.getdata("CookieJD"),
        $.getdata("CookieJD2"),
        ...$.toObj($.getdata("CookiesJD") || "[]").map((item) => item.cookie)].filter((item) => !!item);
}
!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
        return;
    }
    console.log(`==================开始执行明星小店任务==================`);
    for (let i = 0; i < cookiesArr.length; i++) {
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
        await main();
    }
    if($.authorCodeList.length > 0){
        $.inviteCodeList.push(...getRandomArrayElements($.authorCodeList, 1));
    }
    cookiesArr = getRandomArrayElements(cookiesArr,cookiesArr.length);
    for (let i = 0; i < cookiesArr.length; i++) {
        $.cookie = cookiesArr[i];
        $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
        $.taskId = false;
        while (!$.taskId ){
            let sar = Math.floor((Math.random() * uniqueIdList.length));
            $.uniqueId = uniqueIdList[sar].id;
            $.linkID = uniqueIdList[sar].linkID;
            $.taskId = uniqueIdList[sar].taskId;
        }
        for (let k = 0; k < $.inviteCodeList.length; k++) {
            $.oneCode = $.inviteCodeList[k];
            console.log(`${$.UserName}去助力：${$.uniqueId} 活动，助力码：${$.oneCode}`);
            //await takePostRequest('help');
            await help()
            await $.wait(2000);
        }
    }
})()
    .catch((e) => {
        $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
        $.done();
    })

async function help(){
    const url = `https://api.m.jd.com/?functionId=activityStarBackGetProgressInfo&body={%22starId%22:%22${$.uniqueId}%22,%22sharePin%22:%22${$.oneCode}%22,%22taskId%22:%22${$.taskId}%22,%22linkId%22:%22${$.linkID}%22}&_t=${Date.now()}&appid=activities_platform`;
    const headers = {
        'Origin' : `https://prodev.m.jd.com`,
        'Cookie': $.cookie,
        'Connection' : `keep-alive`,
        'Accept' : `application/json, text/plain, */*`,
        'Referer' : `https://prodev.m.jd.com/mall/active/34LcYfTMVLu6QPowsoLtk383Hcfv/index.html`,
        'Host' : `api.m.jd.com`,
        'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        'Accept-Encoding' : `gzip, deflate, br`,
        'Accept-Language' : `zh-cn`
    };
    let myRequest =  {url: url, headers: headers};
    return new Promise(async resolve => {
        $.get(myRequest, (err, resp, data) => {
            try {
                try {
                    console.log(data);
                } catch (e) {
                    console.log(`返回异常：${data}`);
                    return;
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

async function main() {
    let sendMessage = '';
    uniqueIdList = getRandomArrayElements(uniqueIdList, uniqueIdList.length);
    console.log(`现共查询到${uniqueIdList.length}个明星小店\n`);
    for (let j = 0; j < uniqueIdList.length; j++) {
        try{
            $.uniqueId = uniqueIdList[j].id;
            $.helpCode = '';
            console.log(`开始第${j + 1}个明星小店，ID：${$.uniqueId},明星：${uniqueIdList[j].name}`);
            $.linkID = uniqueIdList[j].linkID;
            await starShop();
            await $.wait(1000);
            if (j === 0) {
                console.log(`互助码：${$.helpCode}`);
                $.inviteCodeList.push($.helpCode);
            }
            console.log(`\n`);
        }catch (e) {
            console.log(JSON.stringify(e.message));
        }
    }
    console.log(`=============${$.UserName }：明星小店奖励汇总================`);
    await $.wait(1000);
    for (let i = 0; i < rewardList.length; i++) {
        $.linkID = rewardList[i];
        $.rewards = [];
        await getReward();
        for (let i = 0; i < $.rewards.length; i++) {
            if ($.rewards[i].prizeType === 1) {
                console.log(`获得优惠券`);
            } else if ($.rewards[i].prizeType === 6) {
                console.log(`获得明星照片或者视频`);
            } else if ($.rewards[i].prizeType === 5) {
                if(!$.rewards[i].fillReceiverFlag){
                    console.log(`获得实物：${$.rewards[i].prizeDesc || ''},未填写地址`);
                    sendMessage += `【京东账号${$.index}】${$.UserName }，获得实物：${$.rewards[i].prizeDesc || '' }\n`;
                }else{
                    console.log(`获得实物：${$.rewards[i].prizeDesc || ''},已填写地址`);
                }
            } else if ($.rewards[i].prizeType === 10) {
                console.log(`获得京豆`);
            } else {
                console.log(`获得其他：${$.rewards[i].prizeDesc || ''}`);
            }
        }
    }
    if(sendMessage){
        sendMessage += `填写收货地址路径：\n京东首页，搜索明星（尹正），进入明星小店，我的礼物，填写收货地址`;
        await notify.sendNotify(`星店长`, sendMessage);
    }
}


Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getUTCMonth() + 1,                 //月份
        "d+": this.getUTCDate(),                    //日
        "h+": this.getUTCHours(),                   //小时
        "m+": this.getUTCMinutes(),                 //分
        "s+": this.getUTCSeconds(),                 //秒
        "q+": Math.floor((this.getUTCMonth() + 3) / 3), //季度
        "S": this.getUTCMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getUTCFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
async function getReward() {
    const url = `https://api.m.jd.com/?functionId=activityStarBackGetRewardList&body={%22linkId%22:%22${$.linkID}%22}&_t=${Date.now()}&appid=activities_platform`;
    const method = `GET`;
    const headers = {
        'Origin': `https://prodev.m.jd.com`,
        'Cookie': $.cookie,
        'Connection': `keep-alive`,
        'Accept': `application/json, text/plain, */*`,
        'Referer': `https://prodev.m.jd.com/mall/active/7s5TYVpp8dKXF4FrDqe55H8esSV/index.html`,
        'Host': `api.m.jd.com`,
        'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        'Accept-Encoding': `gzip, deflate, br`,
        'Accept-Language': `zh-cn`
    };
    const myRequest = {url: url, method: method, headers: headers,};
    return new Promise(async resolve => {
        $.get(myRequest, (err, resp, data) => {
            try {
                data = JSON.parse(data);
                if (data.code === 0) {
                    $.rewards = data.data;
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

async function starShop() {
    $.info = {};
    //await takePostRequest('activityStarBackGetProgressBarInfo');
    await  getInfo();
    if (JSON.stringify($.info) === '{}') {
        console.log(`获取活动失败，ID：${$.uniqueId}`);
    }
    let prize = $.info.prize;
    let runFlag = false;
    for (let i = 1; i < 5; i++) {
        $.onePrize = prize[i];
        if ($.onePrize.state === 1) {
            console.log(`去抽奖，奖品为：${$.onePrize.name}`);
            await takePostRequest('activityStarBackDrawPrize');
            await $.wait(2000);
        } else if ($.onePrize.state === 0) {
            runFlag = true;
        }
    }
    if (!runFlag) {
        console.log(`该明星小店已完成所有抽奖`);
        return;
    }
    $.taskList = [];
    await takePostRequest('apTaskList');
    await $.wait(2000);
    $.runFlag = false;
    for (let i = 0; i < $.taskList.length; i++) {
        $.oneTask = $.taskList[i];
        if ($.oneTask.taskFinished) {
            console.log(`任务：${$.oneTask.taskTitle}，已完成`);
            continue;
        }
        if ($.oneTask.taskType === 'SHARE_INVITE') {
            continue;
        }
        $.runFlag = true;
        console.log(`去做任务：${$.oneTask.taskTitle}`);
        if ($.oneTask.taskType === 'SIGN') {
            await takePostRequest('SIGN');
            await $.wait(2000);
        } else if ($.oneTask.taskType === 'BROWSE_CHANNEL' || $.oneTask.taskType === 'FOLLOW_SHOP') {
            $.taskDetail = {};
            $.taskItemList = [];
            await takePostRequest('apTaskDetail');
            $.taskItemList = $.taskDetail.taskItemList || [];
            for (let j = 0; j < $.taskItemList.length; j++) {
                $.oneItemInfo = $.taskItemList[j];
                console.log(`浏览：${$.oneItemInfo.itemName}`);
                await takePostRequest('apDoTask');
                await $.wait(2000);
            }

        }
    }
    if($.runFlag){
        await  getInfo();
        prize = $.info.prize;
        for (let i = 1; i < 5; i++) {
            $.onePrize = prize[i];
            if ($.onePrize.state === 1) {
                console.log(`去抽奖，奖品为：${$.onePrize.name}`);
                await takePostRequest('activityStarBackDrawPrize');
                await $.wait(2000);
            }
        }
    }
}

async function takePostRequest(type) {
    let body = ``;
    let myRequest = ``;
    switch (type) {
        case 'activityStarBackGetProgressBarInfo':
            body = `functionId=activityStarBackGetProgressBarInfo&body={"starId":"${$.uniqueId}","linkId":"${$.linkID}"}&_t=${Date.now()}&appid=activities_platform`;
            myRequest = getPostRequest(body);
            console.log(body);
            break;
        case 'apTaskList':
            body = `functionId=apTaskList&body={"uniqueId":"${$.uniqueId}","linkId":"${$.linkID}"}&_t=${Date.now()}&appid=activities_platform`;
            myRequest = getPostRequest(body);
            break;
        case 'SIGN':
            body = `functionId=apDoTask&body={"taskType":"${$.oneTask.taskType}","taskId":${$.oneTask.id},"uniqueId":"${$.uniqueId}","linkId":"${$.linkID}"}&_t=${Date.now()}&appid=activities_platform`;
            myRequest = getPostRequest(body);
            break;
        case 'apTaskDetail':
            body = `functionId=apTaskDetail&body={"taskType":"${$.oneTask.taskType}","taskId":${$.oneTask.id},"uniqueId":"${$.uniqueId}","channel":4,"linkId":"${$.linkID}"}&_t=${Date.now()}&appid=activities_platform`;
            myRequest = getPostRequest(body);
            break;
        case 'apDoTask':
            body = `functionId=apDoTask&body={"taskType":"${$.oneTask.taskType}","taskId":${$.oneTask.id},"uniqueId":"${$.uniqueId}","channel":4,"linkId":"${$.linkID}","itemId":"${encodeURIComponent($.oneItemInfo.itemId)}"}&_t=${Date.now()}&appid=activities_platform`;
            myRequest = getPostRequest(body);
            break;
        case 'help':
            body = `functionId=activityStarBackGetProgressBarInfo&body={"starId":"${$.uniqueId}","sharePin":"${$.oneCode}","taskId":"129","linkId":"${$.linkID}"}&_t=${Date.now()}&appid=activities_platform`;
            myRequest = getPostRequest(body);
            break;
        case 'activityStarBackDrawPrize':
            body = `functionId=activityStarBackDrawPrize&body={"starId":"${$.uniqueId}","poolId":${$.onePrize.id},"pos":${$.onePrize.pos},"linkId":"${$.linkID}"}&_t=${Date.now()}&appid=activities_platform`;
            myRequest = getPostRequest(body);
            break;
        default:
            console.log(`错误${type}`);
    }
    return new Promise(async resolve => {
        $.post(myRequest, (err, resp, data) => {
            try {
                dealReturn(type, data);
            } catch (e) {
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
    } catch (e) {
        console.log(`返回异常：${data}`);
        return;
    }
    switch (type) {
        case 'activityStarBackGetProgressBarInfo':
            if (data.code === 0) {
                console.log(`${data.data.shareText}`);
                $.helpCode = data.data.encryptPin;
                $.info = data.data;
            }
            break;
        case 'apTaskList':
            if (data.code === 0) {
                $.taskList = data.data;
            }
            break;
        case 'SIGN':
            if (data.code === 0) {
                console.log('签到成功');
            }
            break;
        case 'apTaskDetail':
            if (data.code === 0) {
                $.taskDetail = data.data;
            }
            break;
        case 'apDoTask':
            if (data.code === 0) {
                console.log('成功');
            }
            break;
        case 'help':
            console.log('助力结果：' + JSON.stringify(data));
            break;
        case 'activityStarBackDrawPrize':
            if (data.code === 0) {
                if(data.data.prizeType === 0){
                    console.log(`未抽中`);
                }else{
                    console.log(`恭喜你、可能抽中了（以明星小店奖励汇总为准）`);
                }
            }
            console.log(JSON.stringify(data));
            break;
        default:
            console.log('异常');
            console.log(JSON.stringify(data));
    }
}

function getPostRequest(body) {
    const url = `https://api.m.jd.com/?${body}`;
    const headers = {
        'Origin' : `https://prodev.m.jd.com`,
        'Cookie': $.cookie,
        'Connection' : `keep-alive`,
        'Accept' : `application/json, text/plain, */*`,
        'Referer' : `https://prodev.m.jd.com/mall/active/34LcYfTMVLu6QPowsoLtk383Hcfv/index.html`,
        'Host' : `api.m.jd.com`,
        'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        'Accept-Encoding' : `gzip, deflate, br`,
        'Accept-Language' : `zh-cn`
    };
    return {url: url, headers: headers, body: ''};
}

async function getInfo() {
    const url = `https://api.m.jd.com/?functionId=activityStarBackGetProgressInfo&body={%22starId%22:%22${$.uniqueId}%22,%22linkId%22:%22${$.linkID}%22}&_t=${Date.now()}&appid=activities_platform`;
    const headers = {
        'Origin' : `https://prodev.m.jd.com`,
        'Cookie': $.cookie,
        'Connection' : `keep-alive`,
        'Accept' : `application/json, text/plain, */*`,
        'Referer' : `https://prodev.m.jd.com/mall/active/34LcYfTMVLu6QPowsoLtk383Hcfv/index.html`,
        'Host' : `api.m.jd.com`,
        'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        'Accept-Encoding' : `gzip, deflate, br`,
        'Accept-Language' : `zh-cn`
    };
    let myRequest =  {url: url, headers: headers};
    return new Promise(async resolve => {
        $.get(myRequest, (err, resp, data) => {
            try {
                try {
                    data = JSON.parse(data);
                    if (data.code === 0) {
                        console.log(`${data.data.shareText}`);
                        $.helpCode = data.data.encryptPin;
                        $.info = data.data;
                    }
                } catch (e) {
                    console.log(`返回异常：${data}`);
                    return;
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
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
/**
 * 随机从一数组里面取
 * @param arr
 * @param count
 * @returns {Buffer}
 */
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
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}

