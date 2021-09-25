/*
入口 京东APP >> 玩一玩 >> 汽车生活节
https://h5.m.jd.com/babelDiy/Zeus/2FdCyR9rffxKUkMpQTP4WT4bArmL/index.html


============Quantumultx===============
[task_local]
#8.12-8.20 汽车生活节
30 9,21 12-20 8 * https://raw.githubusercontent.com/smiek2221/scripts/master/jd_qcshj.js, tag=8.12-8.20 汽车生活节, enabled=true

================Loon==============
[Script]
cron "30 9,21 12-20 8 *" script-path=https://raw.githubusercontent.com/smiek2221/scripts/master/jd_qcshj.js,tag=8.12-8.20 汽车生活节

===============Surge=================
8.12-8.20 汽车生活节 = type=cron,cronexp="30 9,21 12-20 8 *",wake-system=1,timeout=3600,script-path=https://raw.githubusercontent.com/smiek2221/scripts/master/jd_qcshj.js

============小火箭=========
8.12-8.20 汽车生活节 = type=cron,script-path=https://raw.githubusercontent.com/smiek2221/scripts/master/jd_qcshj.js, cronexpr="30 9,21 12-20 8 *", timeout=3600, enable=true
*/

const $ = new Env('汽车生活节');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message = '',
  allMessage = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
  };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

function getUA() {
  $.UA = `jdapp;iPhone;10.0.10;14.3;${randomString(40)};network/wifi;model/iPhone12,1;addressid/4199175193;appBuild/167741;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`
}

function randomString(e) {
  e = e || 32;
  let t = "abcdef0123456789", a = t.length, n = "";
  for (i = 0; i < e; i++)
    n += t.charAt(Math.floor(Math.random() * a));
  return n
}

$.taskVos = []
$.helpCodes = []
$.allMsg = ''
$.canLottery = true
appid = "1E1xRy6c"
const JD_API_HOST = 'https://api.m.jd.com/client.action';
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
    return;
  }
  console.log('8月来电好物节')
  console.log('截至时间8月20日')
  if (new Date('2021-8-20 23:59:59') < Date.now()) {
    console.log('下个月更精彩！！')
    return
  }
  getUA()
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.beans = 0;
      $.isLogin = true;
      $.nickName = '';
      message = ''
      console.log(`\n\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if ($.UserName === 'null') continue;
      await main()
      if($.beans > 0) $.allMsg += `京东账号${$.index} ${$.nickName || $.UserName}\n获得${$.beans}京豆\n`
      
    }
  }
  if($.helpCodes.length > 0)
    console.log('=======================================内部好友助力==============================')
  //给个好友只能助力3次
  for (let i = 0; i < cookiesArr.length && $.helpCodes.length > 0; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      message = ''
      $.canHelp = true
      for (let i of $.helpCodes) {
        if (!$.canHelp)
          continue
        if (i.user == $.UserName || !i.id)
          continue;
        console.log(`${$.UserName} 助力${i.user}`)
        await toHelp(i.id)
        await $.wait(500)
      }
    }
  }
  await showMsg();
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })


function showMsg() {
  return new Promise(async resolve => {
    console.log('运行完毕')
    if($.allMsg){
      $.msg($.name, '', $.allMsg);
      if ($.isNode()){
        await notify.sendNotify($.name, $.allMsg)
      }
    }
    resolve()
  })
}
async function main() {
  await getHome()
  for (let t of $.taskVos) {
    if (t.status == 2)
      continue
    console.log(`开始任务${t.taskName}`)

    if (t.taskType == 3) {
      await browse(t.shoppingActivityVos[0].taskToken, t.taskId, 1)
      await $.wait(1000)
      await browse(t.shoppingActivityVos[0].taskToken, t.taskId, 0)
      //todo 浏览关注暂时没做
    } else if ([9].includes(t.taskType) && t.shoppingActivityVos) {
      let success = await browse(t.shoppingActivityVos[0].taskToken, t.taskId, 1)
      if (success.indexOf('成功') > -1) {
        await $.wait(7000)
        await browse(t.shoppingActivityVos[0].taskToken, t.taskId, 0)
      } else {
        console.log('浏览失败')
      }
      //助力好友
    } else if (t.taskType == 14) {
      $.helpCodes.push({
        user: $.UserName,
        id: t.assistTaskDetailVo.taskToken
      })
      //关注并浏览
    } else if (t.taskType == 1) {
      for (let f of t.followShopVo) {
        await browse(f.taskToken, t.taskId, 1)
        await $.wait(7000)
        await browse(f.taskToken, t.taskId, 0)
      }
      //浏览指定商品
    } else if (t.taskType == 8) {
      for (let f of t.productInfoVos) {
        await browse(f.taskToken, t.taskId, 1)
        await $.wait(7000)
        await browse(f.taskToken, t.taskId, 0)
      }
    } else if (t.taskType == 21) {
      //todo 开卡
    }
    await $.wait(1000)
  }
  $.canLottery = true
  await getHome();
  while ($.userScore >= 200 && $.canLottery) {
    try {
      await lottery()
    } catch (e) {
      console.log(e)
    }
    await $.wait(1000)
    await getHome()
    await $.wait(1000)
  }
}

async function getHome() {
  return new Promise(async resolve => {
    $.post(request("healthyDay_getHomeData", { "appId": appid, "taskToken": "", "channelId": 1 }),
      (e, r, d) => {
        d = JSON.parse(d)
        if (d.data.bizCode == 0) {
          //获取任务
          $.taskVos = d.data.result.taskVos
          $.userScore = d.data.result.userInfo.userScore
        }
        resolve()
      })
  })
}

/**
 * 签到
 *
 * @returns {Promise<void>}
 */
async function sign(taskToken, taskId) {
  return new Promise(resolve => {
    $.post(request("harmony_collectScore", {
      "appId": appid,
      "taskToken": taskToken,
      "taskId": taskId,
      "actionType": "0"
    }),
      (e, r, d) => {
        d = JSON.parse(d);
        if (d.data.bizCode == 0) {
          console.log(`签到成功 获取电量${d.data.result.acquiredScore}`)
        }
        resolve()
      })
  })
}

/**
 * 浏览任务
 *
 * @param taskToken
 * @param taskId
 * @param actionType
 * @returns {Promise<unknown>}
 */
async function browse(taskToken, taskId, actionType) {
  return new Promise(resolve => {
    $.post(request("harmony_collectScore", {
      "appId": appid,
      "taskToken": taskToken,
      "taskId": taskId,
      "actionType": actionType
    }),
      (e, r, d) => {
        d = JSON.parse(d);
        console.log(`${d.data.bizMsg}`)
        resolve(d.data.bizMsg)
      })
  })
}

async function toHelp(taskToken) {
  return new Promise(resolve => {
    $.post(request("harmony_collectScore", {
      "appId": appid,
      "taskToken": taskToken,
      "taskId": 6,
      "actionType": 0
    }),
      (e, r, d) => {
        d = JSON.parse(d);
        console.log(`助力结果：${d.data.bizMsg}`)
        if (d.data.bizMsg.indexOf("上限") > -1)
          $.canHelp = false
        else if (d.data.bizMsg.indexOf("满员") > -1) {
          for (let i in $.helpCodes) {
            if ($.helpCodes[i].user == $.UserName) {
              $.helpCodes[i] = ''
            }
          }
        }
        resolve()
      })
  })
}

/**
 * 狗命抽奖
 *
 * @returns {Promise<unknown>}
 */
async function lottery() {
  return new Promise(resolve => {
    $.post(request("interact_template_getLotteryResult", { "appId": appid }),
      (e, r, d) => {
        d = JSON.parse(d)
        if (d.data.bizCode != 0) {
          $.canLottery = false
        }
        let result = d.data.result
        if (result.userAwardsCacheDto.type == 0)
          console.log('抽个寂寞')
        else if (result.userAwardsCacheDto.type == 2) {
          $.beans += Number(result.userAwardsCacheDto.jBeanAwardVo.quantity) || 0
          console.log(result.userAwardsCacheDto.jBeanAwardVo)
        } else
          console.log('没用的优惠券' + JSON.stringify(result))
        resolve(result.userScore)
      })
  })
}

function request(func, body = { "appId": appid, "taskToken": "", "channelId": 1 }) {
  let p = {
    "url": `${JD_API_HOST}`,
    "headers": {
      "Origin": "https://h5.m.jd.com",
      "Accept": "application/json,text/plain, */*",
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      "Connection": "keep-alive",
      "Cookie": cookie,
      "Referer": "https://h5.m.jd.com/babelDiy/Zeus/4BvJGuWhUZkGTF9Z2FryWtrLWbDm/index.html?babelChannel=ttt12&utm_campaign=&utm_source=&utm_term=&utm_medium=",
      "User-Agent": $.UA
    },
    body: `functionId=${func}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=1.0.0`

  }

  return p
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