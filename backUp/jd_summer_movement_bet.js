/*

cron  11 12,20 * * * jd_summer_movement_bet.js

*/
const $ = new Env('燃动夏季下注');
//环境变量是否下满注，false否，true是，（满注20次，前提：需要已经开过会员卡，若未开同会员，则只能下3注）
const maxBet =  $.isNode() ? (process.env.MAX_BET ? process.env.MAX_BET : false):false;
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const UA =  `jdpingou;iPhone;10.0.6;${Math.ceil(Math.random()*2+12)}.${Math.ceil(Math.random()*4)};${randomString(40)};`;
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
  console.log(`注意：每个奖品会花费200币下注，不想下注的人不要跑这个脚本`);
  console.log(`脚本默认下7注，若需要花费金币下满20注，则修改环境变量“MAX_BET”为true`);
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
  bubbleInfos = $.homeData.result.bubbleInfos;
  $.continueRun = true;
  $.betGoodsList = $.homeData.result.pawnshopInfo.betGoodsList;
  for (let i = 0; i < $.betGoodsList.length; i++) {
    $.oneGoodsInfo = $.betGoodsList[i];
    $.continueRun = true;
    if($.oneGoodsInfo.status === 1){
      console.log(`\n奖品：${$.oneGoodsInfo.skuName}，去开奖`);
      await takePostRequest('olympicgames_pawnshopRewardPop');
      await $.wait(2000);
      continue;
    }else if($.oneGoodsInfo.status === 3){
      console.log(`\n奖品：${$.oneGoodsInfo.skuName}，已开奖`);
      continue;
    }
    while (($.oneGoodsInfo.score < 7 || (maxBet && $.oneGoodsInfo.score < 20)) && $.continueRun){
      await takePostRequest('olympicgames_pawnshopBetPop');
      await $.wait(1000);
      console.log(`\n奖品：${$.oneGoodsInfo.skuName}，${$.betInfo.betText},去下注`);
      await takePostRequest('olympicgames_pawnshopBet');
      await $.wait(2000);
    }
  }
  await $.wait(2000);
  await takePostRequest('olympicgames_pawnshopBetRecord');
}

async function takePostRequest(type) {
  let body = ``;
  let myRequest = ``;
  switch (type) {
    case 'olympicgames_home':
      body = `functionId=olympicgames_home&body={}&client=wh5&clientVersion=1.0.0&uuid=${uuid}&appid=o2_act`;
      myRequest = await getPostRequest(body);
      break;
    case 'olympicgames_pawnshopBet':
      body = `functionId=olympicgames_pawnshopBet&body={"skuId":${$.oneGoodsInfo.skuId}}&client=wh5&clientVersion=1.0.0&uuid=${uuid}&appid=o2_act`;
      myRequest = await getPostRequest( body);
      break;
    case 'olympicgames_pawnshopBetPop':
      body = `functionId=olympicgames_pawnshopBetPop&body={"skuId":${$.oneGoodsInfo.skuId}}&client=wh5&clientVersion=1.0.0&uuid=${uuid}&appid=o2_act`;
      myRequest = await getPostRequest( body);
      break;
    case 'olympicgames_pawnshopRewardPop':
      body = `functionId=olympicgames_pawnshopRewardPop&body={"skuId":${$.oneGoodsInfo.skuId}}&client=wh5&clientVersion=1.0.0&uuid=${uuid}&appid=o2_act`;
      myRequest = await getPostRequest( body);
      break;
    case 'olympicgames_pawnshopBetRecord':
      body =  `functionId=olympicgames_pawnshopBetRecord&body={}&client=wh5&clientVersion=1.0.0&uuid=&uuid=${uuid}&appid=o2_act`;
      myRequest = await getPostRequest( body);
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
    case 'olympicgames_pawnshopBet':
      if (data.code === 0 && data.data && data.data.result) {
        console.log(`下注成功，已下注${data.data.result.score}次`);
        $.oneGoodsInfo.score = data.data.result.score;
      }else{
        $.continueRun = false;
        console.log(JSON.stringify(data));
      }
      break;
    case 'olympicgames_pawnshopBetPop':
      if (data.code === 0 && data.data && data.data.result) {
        $.betInfo = data.data.result;
      }else{
        console.log(JSON.stringify(data));
      }
      break;
    case 'olympicgames_pawnshopRewardPop':
      console.log(`开奖结果`);
      console.log(JSON.stringify(data));
      if(data.code === 0 && data.data && data.data.result){
        if(data.data.result.status === 2){
          console.log('恭喜你，应该是中奖了；');
          let message = `第【${$.index}】个账号，${$.UserName},可能抽中了【${data.data.result.skuName}】,请登录APP查看`
          await notify.sendNotify(`燃动夏季下注`, message);
        }else{
          console.log('未中奖');
        }
      }
      break;
    case 'olympicgames_pawnshopBetRecord':
      if (data.code === 0 && data.data && data.data.result && data.data.result[0]) {
        let rewardList = data.data.result[0].betRecordVOList;
        console.log(`\n下注记录`);
        for (let i = 0; i < rewardList.length; i++) {
          let oneInfo = rewardList[i];
          if(oneInfo.status === 0){
            console.log(`奖品：${oneInfo.skuName},已下注${oneInfo.score}次，未开奖`);
          }else if(oneInfo.status === 3){
            console.log(`奖品：${oneInfo.skuName},未中奖`);
          }else {
            console.log(`奖品：${oneInfo.skuName},其他情况，进APP查看`);
          }
        }
      }else{
        console.log(JSON.stringify(data));
      }
      break;
    default:
      console.log(`未判断的异常${type}`);
  }
}
function randomString(e) {
  e = e || 32;
  let t = "abcdefhijkmnprstwxyz2345678", a = t.length, n = "";
  for (i = 0; i < e; i++)
    n += t.charAt(Math.floor(Math.random() * a));
  return n
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
    'User-Agent': UA//$.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
  };
  return { method: method, headers: headers, body: body};
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


