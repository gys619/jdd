/*
小鸽有礼 - 每日抽奖
活动入口：京东首页搜索 边玩边赚
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
===================quantumultx================
[task_local]
#每日抽奖
13 1,22,23 * * * jd_daily_lottery.js, tag=每日抽奖, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true

=====================Loon================
[Script]
cron "13 1,22,23 * * *" script-path=jd_daily_lottery.js, tag=每日抽奖

====================Surge================
每日抽奖 = type=cron,cronexp="13 1,22,23 * * *",wake-system=1,timeout=3600,script-path=jd_daily_lottery.js

============小火箭=========
每日抽奖 = type=cron,script-path=jd_daily_lottery.js, cronexpr="13 1,22,23 * * *", timeout=3600, enable=true
*/
const $ = new Env('小鸽有礼-每日抽奖');
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let activityType = '';
let activityCode = '';
const activityInfoList = [
  {'activityType':'WonderfulLuckDrawApi','activityCode':'1410048365793640448','title':'小哥有礼'},
  {'activityType':'luckdraw','activityCode':'1407251415377641472','title':'每日转盘'}
];
$.helpCodeList = [];
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '';
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
let allMessage = '';
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      await TotalBean();
      console.log(`\n*****开始【京东账号${$.index}】${$.nickName || $.UserName}*****\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }

      for (let j = 0; j < activityInfoList.length; j++) {
        activityType = activityInfoList[j].activityType;
        activityCode = activityInfoList[j].activityCode;
        console.log(`=============${activityInfoList[j].title}=============`)
        await dailyLottery()
      }
    }
  }
  // console.log(`\=============每日抽奖互助=============`)
  // activityType = activityInfoList[1].activityType;
  // activityCode = activityInfoList[1].activityCode;
  // for (let i = 0; i < $.helpCodeList.length && cookiesArr.length > 0; i++) {
  //   if ($.helpCodeList[i].needHelp === 0) {
  //     continue;
  //   }
  //   for (let j = 0; j < cookiesArr.length && $.helpCodeList[i].needHelp !== 0; j++) {
  //     $.helpFlag = '';
  //     cookie = cookiesArr[j];
  //     $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
  //     if ($.helpCodeList[i].use === $.UserName) {
  //       continue;
  //     }
  //     console.log(`${$.UserName}助力:${$.helpCodeList[i].helpCpde}`);
  //     $.oneCode = $.helpCodeList[i].helpCpde;
  //     //await helpFriend($.helpCodeList[i].helpCpde);
  //     await takePosttRequest('helpFriend');
  //     if ($.helpFlag === true) {
  //       $.helpCodeList[i].needHelp -= 1;
  //     }
  //     cookiesArr.splice(j, 1);
  //     j--;
  //   }
  // }
  if(allMessage){
    notify.sendNotify('小哥有礼-每日抽奖',allMessage);
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function dailyLottery() {
  $.lotteryInfo = {};
  $.missionList = [];
  await Promise.all([takePosttRequest('queryActivityBaseInfo'), takePosttRequest('queryMissionList')]);
  console.log(`初始化`);
  if ($.lotteryInfo.success !== true) {
    console.log(`${$.UserName}数据异常，执行失败`);
    return;
  }
  if ($.missionList.length === 0) {
    console.log(`${$.UserName}获取任务列表失败`);
    return;
  }
  $.runTime = 0;
  do {
    $.runFlag = false;
    await doMission();//做任务
    await collectionTimes();//领任务奖励
    $.runTime++;
  } while ($.runFlag && $.runTime < 30);
  let drawNum = $.lotteryInfo.content.drawNum || 0;
  console.log(`共有${drawNum}次抽奖机会`);
  for (let i = 0; i < drawNum; i++) {
    $.drawNumber = i + 1;
    await $.wait(1000);
    //执行抽奖
    await takePosttRequest('draw');
  }
  await $.wait(1000);
  //奖励列表
  await takePosttRequest('queryWinFlowList');
}

async function takePosttRequest(functionId) {
  let myRequest = ``;
  let body = ``;
  switch (functionId) {
    case 'queryActivityBaseInfo':
    case 'queryMissionList':
    case 'draw':
    case 'queryWinFlowList':
    case 'createInvitation':
      body = `[{"userNo":"$cooMrdGatewayUid$","activityCode":"${activityCode}"}]`;
      break;
    case 'completeMission':
      if($.oneMission.params){
        body = `[{"userNo":"$cooMrdGatewayUid$","activityCode":"${activityCode}","missionNo":"${$.oneMission.missionNo}","params":${JSON.stringify($.oneMission.params)}}]`;
      }else{
        body = `[{"userNo":"$cooMrdGatewayUid$","activityCode":"${activityCode}","missionNo":"${$.oneMission.missionNo}"}]`;
      }
      break;
    case 'getDrawChance':
      body = `[{"userNo":"$cooMrdGatewayUid$","activityCode":"${activityCode}","getCode":"${$.oneRewardNos}"}]`;
      break
    case 'helpFriend':
      body = `[{"userNo":"$cooMrdGatewayUid$","missionNo":"${$.oneCode }"}]`;
      break
    default:
      console.log(`错误${functionId}`);
  }
  myRequest = getPostRequest(functionId,body);
  return new Promise(async resolve => {
    $.post(myRequest, (err, resp, data) => {
      try {
        dealReturn(functionId, data);
      } catch (e) {
        console.log(data);
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function dealReturn(functionId, data) {
  try {
    data = JSON.parse(data);
  }catch (e) {
    console.log(`解析错误:${data}`);
    return
  }
  switch (functionId) {
    case 'queryActivityBaseInfo':
      $.lotteryInfo = data;
      break;
    case 'queryMissionList':
      if (data.success === true) {
        $.missionList = data.content.missionList;
      }
      break;
    case 'completeMission':
      if (data.success === true) {
        console.log(`${$.oneMission.title}，任务执行成功`);
        $.runFlag = true;
      } else {
        console.log(JSON.stringify(data));
        console.log(`${$.oneMission.title}，任务执行失败`);
      }
      break;
    case 'getDrawChance':
      if (data.success === true) {
        console.log(`${$.oneMission.title}，领取任务奖励成功`);
      } else {
        console.log(JSON.stringify(data));
        console.log(`${$.oneMission.title}，领取任务执行失败`);
      }
      break;
    case 'draw':
      if (data.success === true) {
        console.log(`${$.name}第${$.drawNumber}次抽奖，获得：${data.content.rewardDTO.title || ' '}`);
      } else {
        console.log(`${$.name}第${$.drawNumber}次抽奖失败`);
      }
      break;
    case 'queryWinFlowList':
      if (data.success === true) {
        let contentList = data.content;
        let bean = 0;
        for (let i = 0; i < contentList.length; i++) {
          if(contentList[i].type === -2 || //快递券
            contentList[i].type === 4 ||  //维修券
            contentList[i].type === 3 ||  //郎酒满减券
            contentList[i].type === 2 ||  //满减券
            contentList[i].type === 31   //卡片
          ){


          }else if(contentList[i].type === 102){
              bean += 2;
          }else{
            console.log(contentList[i].name);
            allMessage += `第${$.index}个账号，${$.UserName},获得:${contentList[i].name}\n`;
          }
        }
        console.log(`获得京豆总计${bean}`);
      } else {
        console.log(`获取奖品列表失败`);
      }
      break;
    case 'createInvitation':
      if (data.success === true) {
        $.helpCodeList.push({
          'use': $.UserName,
          'helpCpde': data.data,
          'needHelp': missionInfo['totalNum'] - missionInfo['completeNum']
        });
        console.log(`互助码(内部多账号自己互助)：${data.data}`);
      }
      break;
    case 'helpFriend':
      console.log(`助力结果:${JSON.stringify(data)}`);
      if (data.success === true && data.content === true) {
        console.log(`助力成功`);
        $.helpFlag = true;
      } else {
        $.helpFlag = false;
      }
      break;
    default:
      console.log(JSON.stringify(data));
  }
}

//做任务
async function doMission() {
  let flag = false;//是否执行过任务
  for (let i = 0; i < $.missionList.length; i++) {
    if ($.missionList[i].status !== 1) {
      continue;
    }
    if ($.missionList[i].jumpType === 135 || $.missionList[i].jumpType === 136 || $.missionList[i].jumpType === 137 || $.missionList[i].jumpType === 45 || $.missionList[i].jumpType === 31) {
      $.oneMission = $.missionList[i];
      console.log(`开始执行任务:${$.oneMission.title}  ${$.oneMission.desc || ''}`);
      await takePosttRequest('completeMission');
      await $.wait(1000);
      flag = true;
    }else if ($.missionList[i].jumpType === 1) {
      await takePosttRequest('createInvitation');
      await $.wait(1000);
    }
  }
  if(flag){
    await $.wait(1000);
    await Promise.all([takePosttRequest('queryActivityBaseInfo'), takePosttRequest('queryMissionList')]);
    await $.wait(1000);
  }
}

//领任务奖励
async function collectionTimes() {
  let flag = false;
  for (let i = 0; i < $.missionList.length; i++) {
    if ($.missionList[i].status === 11) {
      $.oneMission = $.missionList[i];
      console.log(`领取奖励:${$.oneMission.title}  ${$.oneMission.desc || ''}`);
      let getRewardNos = $.oneMission.getRewardNos;
      for (let j = 0; j < getRewardNos.length; j++) {
        $.oneRewardNos = getRewardNos[j];
        await takePosttRequest('getDrawChance');
        await $.wait(1000);
        flag = true;
      }
    }
  }
  if(flag){
    await $.wait(1000);
    await Promise.all([takePosttRequest('queryActivityBaseInfo'), takePosttRequest('queryMissionList')]);
    await $.wait(1000);
  }
}

function getPostRequest(functionId, body) {
  const url = `https://lop-proxy.jd.com/${activityType}/${functionId}`;
  const method = `POST`;
  const headers = {
    'Accept-Encoding': `gzip, deflate, br`,
    'Host': `lop-proxy.jd.com`,
    'Origin': `https://jingcai-h5.jd.com`,
    'Connection': `keep-alive`,
    'biz-type': `service-monitor`,
    'Accept-Language': `zh-cn`,
    'version': `1.0.0`,
    'Content-Type': `application/json;charset=utf-8`,
    "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
    'Referer': `https://jingcai-h5.jd.com`,
    'ClientInfo': `{"appName":"jingcai","client":"m"}`,
    'access': `H5`,
    'Accept': `application/json, text/plain, */*`,
    'jexpress-report-time': `${new Date().getTime()}`,
    'source-client': `2`,
    'X-Requested-With': `XMLHttpRequest`,
    'Cookie': cookie,
    'LOP-DN': `jingcai.jd.com`,
    'AppParams': `{"appid":158,"ticket_type":"m"}`,
    'app-key': `jexpress`
  };
  return {url: url, method: method, headers: headers, body: body};
}
function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      url: "https://wq.jd.com/user_new/info/GetJDUserInfoUnion?sceneval=2",
      headers: {
        Host: "wq.jd.com",
        Accept: "*/*",
        Connection: "keep-alive",
        Cookie: cookie,
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
            if (data['retcode'] === 1001) {
              $.isLogin = false; //cookie过期
              return;
            }
            if (data['retcode'] === 0 && data.data && data.data.hasOwnProperty("userInfo")) {
              $.nickName = data.data.userInfo.baseInfo.nickname;
            }
          } else {
            console.log('京东服务器返回空数据');
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