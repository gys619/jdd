/*

 cron 7 10,20 * * * jd_summer_movement_map.js
 
 */
const $ = new Env('燃动夏季领店铺任务');
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const https = require('https');
const fs = require('fs/promises');
const { R_OK } = require('fs').constants;
const vm = require('vm');
const URL = 'https://wbbny.m.jd.com/babelDiy/Zeus/2rtpffK8wqNyPBH6wyUDuBKoAbCt/index.html';
const SYNTAX_MODULE = '!function(n){var r={};function o(e){if(r[e])';
const REG_SCRIPT = /<script type="text\/javascript" src="([^><]+\/(app\.\w+\.js))\">/gm;
const REG_ENTRY = /(__webpack_require__\(__webpack_require__.s=)(\d+)(?=\)})/;
const needModuleId = 356
const DATA = {appid:'50085',sceneid:'OY217hPageh5'};
let smashUtils;
const UA =  `jdpingou;iPhone;10.0.6;${Math.ceil(Math.random()*2+12)}.${Math.ceil(Math.random()*4)};${randomString(40)};`;
class MovementFaker {
  constructor(cookie) {this.cookie = cookie;this.ua = UA;}
  async run() {if (!smashUtils) {await this.init();}
    var t = Math.floor(1e7 + 9e7 * Math.random()).toString();
    var e = smashUtils.get_risk_result({id: t,data: {random: t}}).log;
    var o = JSON.stringify({extraData: {log:  e || -1,sceneid: DATA.sceneid,},random: t});
    return o;
  }
  async init() {
    try {
      console.time('MovementFaker');process.chdir(__dirname);const html = await MovementFaker.httpGet(URL);const script = REG_SCRIPT.exec(html);
      if (script) {const [, scriptUrl, filename] = script;const jsContent = await this.getJSContent(filename, scriptUrl);const fnMock = new Function;const ctx = {window: { addEventListener: fnMock },document: {addEventListener: fnMock,removeEventListener: fnMock,cookie: this.cookie,},navigator: { userAgent: this.ua },};vm.createContext(ctx);vm.runInContext(jsContent, ctx);smashUtils = ctx.window.smashUtils;smashUtils.init(DATA);
      }
      console.timeEnd('MovementFaker');
    } catch (e) {
      console.log(e)
    }
  }
  async getJSContent(cacheKey, url) {
    try {await fs.access(cacheKey, R_OK);const rawFile = await fs.readFile(cacheKey, { encoding: 'utf8' });return rawFile;
    } catch (e) {
      let jsContent = await MovementFaker.httpGet(url);
      const moduleIndex = jsContent.indexOf(SYNTAX_MODULE, 1);
      const findEntry = REG_ENTRY.test(jsContent);
      if (!(moduleIndex && findEntry)) {
        throw new Error('Module not found.');
      }
      jsContent = jsContent.replace(REG_ENTRY, `$1${needModuleId}`);
      fs.writeFile(cacheKey, jsContent);
      return jsContent;
      REG_ENTRY.lastIndex = 0;
      const entry = REG_ENTRY.exec(jsContent);
    }
  }
  static httpGet(url) {
    return new Promise((resolve, reject) => {
      const protocol = url.indexOf('http') !== 0 ? 'https:' : '';
      const req = https.get(protocol + url, (res) => {res.setEncoding('utf-8');let rawData = '';res.on('error', reject);res.on('data', chunk => rawData += chunk);res.on('end', () => resolve(rawData));});
      req.on('error', reject);
      req.end();
    });
  }
}

$.inviteList = [];
let uuid = 8888;
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
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      $.cookie = cookiesArr[i];
      uuid = getUUID();
      $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = $.UserName;
      await TotalBean();
      console.log(`\n*****开始【京东账号${$.index}】${$.nickName || $.UserName}*****\n`);
      console.log(`\n如有未完成的任务，请多执行几次\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      try {
        await main();
      }catch (e) {
        console.log(JSON.stringify(e));
        console.log(JSON.stringify(e.message));
      }
    }
  }


})().catch((e) => {$.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')}).finally(() => {$.done();})


async function main(){
  $.homeData = {};
  $.taskList = [];
  await takePostRequest('olympicgames_home');
  $.userInfo =$.homeData.result.userActBaseInfo
  console.log(`\n待兑换金额：${Number($.userInfo.poolMoney)} 当前等级:${$.userInfo.medalLevel} \n`);
  await $.wait(1000);
  if (Number($.userInfo.poolCurrency) >= Number($.userInfo.exchangeThreshold)) {
    console.log(`满足升级条件，去升级`);
    await $.wait(1000);
    await takePostRequest('olympicgames_receiveCash');
  }
  if($.homeData.result.trainingInfo.state === 0 && !$.homeData.result.trainingInfo.finishFlag){
    console.log(`开始运动`)
    await takePostRequest('olympicgames_startTraining');
  }else if($.homeData.result.trainingInfo.state === 0 && $.homeData.result.trainingInfo.finishFlag){
    console.log(`已完成今日运动`)
  }
  bubbleInfos = $.homeData.result.bubbleInfos;
  let runFlag = false;
  for(let item of bubbleInfos){
    if(item.type != 7){
      $.collectId = item.type
      await takePostRequest('olympicgames_collectCurrency');
      await $.wait(1000);
      runFlag = true;
    }
  }
  await $.wait(1000);
  console.log(`去做店铺任务`);
  $.shopInfoList = [];
  await takePostRequest('qryCompositeMaterials');
  console.log(`获取到${$.shopInfoList.length}个店铺`);
  for (let i = 0; i < $.shopInfoList.length; i++) {
    $.shopSign = $.shopInfoList[i].extension.shopId;
    console.log(`\n执行第${i+1}个店铺任务：${$.shopInfoList[i].name} ID:${$.shopSign}`);
    $.shopResult = {};
    await takePostRequest('olympicgames_shopLotteryInfo');
    await $.wait(1000);
    if(JSON.stringify($.shopResult) === `{}`) continue;
    $.shopTask = $.shopResult.taskVos;
    for (let i = 0; i < $.shopTask.length; i++) {
      $.oneTask = $.shopTask[i];
      if($.oneTask.taskType === 21 || $.oneTask.taskType === 14){
        console.log(`任务：${$.oneTask.subTitleName || $.oneTask.taskName},不执行`);
        continue;
      } //不做入会//不做邀请
      if($.oneTask.status !== 1){
        console.log(`任务：${$.oneTask.subTitleName},已完成`)
        continue;
      }
      $.activityInfoList = $.oneTask.browseShopVo || $.oneTask.simpleRecordInfoVo || $.oneTask.shoppingActivityVos||[];
      if($.oneTask.taskType === 12){//签到
        if($.shopResult.dayFirst === 0){
          $.oneActivityInfo =  $.activityInfoList;
          console.log(`店铺签到`);
          await takePostRequest('olympicgames_bdDoTask');
        }else{
          console.log(`店铺已签到`);
        }
        continue;
      }
      for (let j = 0; j < $.activityInfoList.length; j++) {
        $.oneActivityInfo = $.activityInfoList[j];
        if ($.oneActivityInfo.status !== 1 || !$.oneActivityInfo.taskToken) {
          continue;
        }
        $.callbackInfo = {};
        console.log(`做任务：${$.oneActivityInfo.subtitle || $.oneActivityInfo.title || $.oneActivityInfo.taskName || $.oneActivityInfo.shopName};等待完成`);
        await takePostRequest('olympicgames_bdDoTask');
        if ($.callbackInfo.code === 0 && $.callbackInfo.data && $.callbackInfo.data.result && $.callbackInfo.data.result.taskToken) {
          await $.wait(8000);
          let sendInfo = encodeURIComponent(`{"dataSource":"newshortAward","method":"getTaskAward","reqParams":"{\\"taskToken\\":\\"${$.callbackInfo.data.result.taskToken}\\"}","sdkVersion":"1.0.0","clientLanguage":"zh"}`)
          await callbackResult(sendInfo)
        } else  {
          await $.wait(2000);
          console.log(`任务完成`);
        }
      }
    }
    await $.wait(1000);
    let boxLotteryNum = $.shopResult.boxLotteryNum;
    for (let j = 0; j < boxLotteryNum; j++) {
      console.log(`开始第${j+1}次拆盒`)
      //抽奖
      await takePostRequest('olympicgames_boxShopLottery');
      await $.wait(3000);
    }
    // let wishLotteryNum = $.shopResult.wishLotteryNum;
    // for (let j = 0; j < wishLotteryNum; j++) {
    //   console.log(`开始第${j+1}次能量抽奖`)
    //   //抽奖
    //   await takePostRequest('zoo_wishShopLottery');
    //   await $.wait(3000);
    // }
    await $.wait(3000);
  }
}

async function getBody($) {const zf = new MovementFaker($.cookie);const ss = await zf.run();return ss;}

async function takePostRequest(type) {
  let body = ``;
  let myRequest = ``;
  switch (type) {
    case 'olympicgames_home':
      body = `functionId=olympicgames_home&body={}&client=wh5&clientVersion=1.0.0&uuid=${uuid}&appid=o2_act`;
      myRequest = await getPostRequest(body);
      break;
    case 'olympicgames_receiveCash':
      body = `functionId=olympicgames_receiveCash&body={"type":6}&client=wh5&clientVersion=1.0.0&uuid=${uuid}&appid=o2_act`;
      myRequest = await getPostRequest(body);
      break
    case 'olympicgames_collectCurrency':
      body = await getPostBody(type);
      myRequest = await getPostRequest(body);
      break
    case 'olympicgames_startTraining':
      body = await getPostBody(type);
      myRequest = await getPostRequest( body);
      break;
    case 'qryCompositeMaterials':
      body = `functionId=qryCompositeMaterials&body={"qryParam":"[{\\"type\\":\\"advertGroup\\",\\"id\\":\\"05371960\\",\\"mapTo\\":\\"logoData\\"}]","openid":-1,"applyKey":"big_promotion"}&client=wh5&clientVersion=1.0.0&uuid=${uuid}`;
      myRequest = await getPostRequest( body);
      break;
    case 'olympicgames_shopLotteryInfo':
      body = `functionId=olympicgames_shopLotteryInfo&body={"channelSign":"1","shopSign":"${$.shopSign}"}&client=wh5&clientVersion=1.0.0&uuid=${uuid}&appid=o2_act`;
      myRequest = await getPostRequest(body);
      break;
    case 'olympicgames_bdDoTask':
      body = await getPostBody(type);
      myRequest = await getPostRequest(body);
      break;
    case 'olympicgames_boxShopLottery':
      body = `functionId=olympicgames_boxShopLottery&body={"shopSign":"${$.shopSign}"}&client=wh5&clientVersion=1.0.0&uuid=${uuid}&appid=o2_act`;
      myRequest = await getPostRequest(body);
      break;
    default:
      console.log(`错误${type}`);
  }
  myRequest['url'] = `https://api.m.jd.com/client.action?advId=${type}`;
  return new Promise(async resolve => {
    $.post(myRequest, (err, resp, data) => {
      try {
        //console.log(data);
        dealReturn(type, data);
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

async function dealReturn(type, data) {
  try {
    data = JSON.parse(data);
  } catch (e) {
    console.log(`返回异常：${data}`);
    return;
  }
  switch (type) {
    case 'olympicgames_home':
      if (data.code === 0) {
        if (data.data['bizCode'] === 0) {
          $.homeData = data.data;
        }
      }
      break;
    case 'olympicgames_receiveCash':
      if (data.code === 0 && data.data && data.data.result) {
        console.log('升级成功')
      }
      console.log(JSON.stringify(data));
      break;
    case 'olympicgames_collectCurrency':
      if (data.code === 0 && data.data && data.data.result) {
        console.log(`收取成功，获得：${data.data.result.poolCurrency}`);
      }else{
        console.log(JSON.stringify(data));
      }
      if(data.code === 0 && data.data && data.data.bizCode === -1002){
        //$.hotFlag = true;:wq
        //console.log(`该账户脚本执行任务火爆，暂停执行任务，请手动做任务或者等待解决脚本火爆问题`)
      }
      break;
    case 'olympicgames_startTraining':
      if (data.code === 0 && data.data && data.data.result) {
        console.log(`执行运动成功`);
      }else{
        console.log(JSON.stringify(data));
      }
      break;
    case 'qryCompositeMaterials':
      if (data.code === '0' && data.data) {
        $.shopInfoList = data.data.logoData.list;
        console.log(`获取店铺列表成功`);
      }else{
        console.log(JSON.stringify(data));
      }
      break;
    case 'olympicgames_shopLotteryInfo':
      if (data.code === 0) {
        $.shopResult = data.data.result;
      }
      break;
    case 'olympicgames_bdDoTask':
      if (Number(data.code) === 0) {
        console.log(`签到获得：${data.data.result.score}`);
      }
      //console.log(JSON.stringify(data));
      break;
    case 'olympicgames_boxShopLottery':
      let result = data.data.result;
      switch (result.awardType) {
        case 8:
          console.log(`获得金币：${result.rewardScore}`);
          break;
        case 5:
          console.log(`获得：adidas能量`);
          break;
        case 2:
        case 3:
          console.log(`获得优惠券：${result.couponInfo.usageThreshold} 优惠：${result.couponInfo.quota}，${result.couponInfo.useRange}`);
          break;
        default:
          console.log(`抽奖获得未知`);
          console.log(JSON.stringify(data));
      }
      break
    default:
      console.log(`未判断的异常${type}`);
  }
}

//领取奖励
function callbackResult(info) {
  return new Promise((resolve) => {
    let url = {
      url: `https://api.m.jd.com/?functionId=qryViewkitCallbackResult&client=wh5&clientVersion=1.0.0&body=${info}&_timestamp=` + Date.now(),
      headers: {
        'Origin': `https://bunearth.m.jd.com`,
        'Cookie': $.cookie,
        'Connection': `keep-alive`,
        'Accept': `*/*`,
        'Host': `api.m.jd.com`,
        'User-Agent': UA,
        //'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        'Accept-Encoding': `gzip, deflate, br`,
        'Accept-Language': `zh-cn`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://bunearth.m.jd.com'
      }
    }

    $.get(url, async (err, resp, data) => {
      try {
        data = JSON.parse(data);
        console.log(data.toast.subTitle)
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    })
  })
}

async function getPostRequest(body) {
  const method = `POST`;
  const headers = {
    "Accept": "application/json",
    "Accept-Encoding": "gzip, deflgetPostRequestate, br",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Connection": "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded",
    'Cookie': $.cookie,
    "Origin": "https://wbbny.m.jd.com",
    "Referer": "https://wbbny.m.jd.com/",
    'User-Agent': UA,
    //'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
  };
  return { method: method, headers: headers, body: body};
}

async function getPostBody(type) {
  return new Promise(async resolve => {
    let taskBody = '';
    try {
      const log = await getBody($)
      if (type === 'help') {
        taskBody = `functionId=olympicgames_assist&body=${JSON.stringify({"inviteId":$.inviteId,"type": "confirm","ss" :log})}&client=wh5&clientVersion=1.0.0&uuid=${uuid}&appid=o2_act`
      } else if (type === 'olympicgames_collectCurrency') {
        taskBody = `functionId=olympicgames_collectCurrency&body=${JSON.stringify({"type":$.collectId,"ss" : log})}&client=wh5&clientVersion=1.0.0&uuid=${uuid}&appid=o2_act`;
      } else if(type === 'add_car'){
        taskBody = `functionId=olympicgames_doTaskDetail&body=${JSON.stringify({"taskId": $.taskId,"taskToken":$.taskToken,"ss" : log})}&client=wh5&clientVersion=1.0.0&uuid=${uuid}&appid=o2_act`
      }else if(type === 'olympicgames_startTraining'){
        taskBody = `functionId=olympicgames_startTraining&body=${JSON.stringify({"ss" : log})}&client=wh5&clientVersion=1.0.0&uuid=${uuid}&appid=o2_act`
      }else if(type === 'olympicgames_bdDoTask'){
        taskBody = `functionId=${type}&body=${JSON.stringify({"taskId": $.oneTask.taskId,"shopSign":$.shopSign,"actionType":1,"showErrorToast":false,"taskToken" : $.oneActivityInfo.taskToken,"ss" : log})}&client=wh5&clientVersion=1.0.0&uuid=${uuid}&appid=o2_act`
      }else{
        taskBody = `functionId=${type}&body=${JSON.stringify({"taskId": $.oneTask.taskId,"actionType":1,"taskToken" : $.oneActivityInfo.taskToken,"ss" : log})}&client=wh5&clientVersion=1.0.0&uuid=${uuid}&appid=o2_act`
      }
      //console.log(taskBody)
    } catch (e) {
      $.logErr(e)
    } finally {
      resolve(taskBody);
    }
  })
}
function getUUID() {
  var n = (new Date).getTime();
  let uuid="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
  uuid = uuid.replace(/[xy]/g, function (e) {
    var t = (n + 16 * Math.random()) % 16 | 0;
    return n = Math.floor(n / 16),
      ("x" == e ? t : 3 & t | 8).toString(16)
  }).replace(/-/g, "")
  return uuid
}
function randomString(e) {
  e = e || 32;
  let t = "abcdefhijkmnprstwxyz2345678", a = t.length, n = "";
  for (i = 0; i < e; i++)
    n += t.charAt(Math.floor(Math.random() * a));
  return n
}
function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      url: "https://me-api.jd.com/user_new/info/GetJDUserInfoUnion",
      headers: {
        Host: "me-api.jd.com",
        Accept: "*/*",
        Connection: "keep-alive",
        Cookie: $.cookie,
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        "Accept-Language": "zh-cn",
        "Referer": "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&",
        "Accept-Encoding": "gzip, deflate, br"
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          $.logErr(err)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === "1001") {
              $.isLogin = false; //cookie过期
              return;
            }
            if (data['retcode'] === "0" && data.data && data.data.hasOwnProperty("userInfo")) {
              $.nickName = data.data.userInfo.baseInfo.nickname;
            }
          } else {
            $.log('京东服务器返回空数据');
          }
        }
      } catch (e) {
        $.logErr(e)
      } finally {
        resolve();
      }
    })
  })
}
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}


