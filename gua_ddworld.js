/*

https://3.cn/102TmB-4K


17 10 * * * https://raw.githubusercontent.com/smiek2221/scripts/master/gua_UnknownTask6.js
*/
const $ = new Env('东东世界');
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';

const notify = $.isNode() ? require('./sendNotify') : '';
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
allMessage = ""
message = ""
let UA = ''
$.hotFlag = false
$.outFlag = false
$.assistToken = 'T0225KkcRkoc91DVIx2hkfALcgCjRVmIaV5kRrbA'
$.assistInviter = 'Jo250NiIScRn5f-7kseWcsdDu_qMbCRc3TYtNfsV9WY'
$.temp = [];
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
      "open-url": "https://bean.m.jd.com/"
    });
    return;
  }
  console.log(`入口:\nhttps://3.cn/102TmB-4K`)
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    if (cookie) {
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      message = ""
      $.bean = 0
      $.hotFlag = false
      await getUA()
      $.nickName = '';
      console.log(`\n\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      await run();
      if($.outFlag) break
    }
  }
  if(allMessage){
    $.msg($.name, ``, `${allMessage}`);
    if ($.isNode()){
      await notify.sendNotify(`${$.name}`, `${allMessage}`);
    }
  }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())


async function run() {
  try {
    $.Bearer = ''
    $.Token = ''
    $.Pin = ''
    $.inviter = ''
    await takePostRequest('isvObfuscator');
    await takePostRequest('userInfo');
    if($.Bearer == '') return
    await takePostRequest('get_user_info');
    await takePostRequest('do_assist_task');
    if($.toHelpMsg === true){
      console.log('助力成功')
      updatefriend($.assistInviter,1)
    }else{
      console.log($.toHelpMsg)
    }
    $.taskList = []
    $.userScore = 0
    await takePostRequest('get_task');
    console.log(`金币:${$.userScore}`)
    await $.wait(parseInt(Math.random() * 1000 + 2000, 10))
    let flag = 0
    for(let i in $.taskList || []){
      $.oneTask = $.taskList[i]
      console.log(`${$.oneTask.taskName} ${$.oneTask.times}/${$.oneTask.maxTimes}`)
      $.oneProduct = ''
      let num = $.oneTask.maxTimes - $.oneTask.times
      if($.oneTask.taskType == 6){
        console.log($.oneTask.assistTaskDetailVo.taskToken,$.inviter)
        $.temp.push({"assistToken":$.oneTask.assistTaskDetailVo.taskToken,"assistInviter":$.inviter,"count":$.oneTask.times,'index':$.index})
      }
      if(num == 0 || $.oneTask.taskName.indexOf('邀请') > -1) continue
      $.taskToken = ''
      if($.oneTask.taskType == 12 && $.oneTask.status === 1){
        flag = 1
        $.taskToken = $.oneTask.simpleRecordInfoVo.taskToken
        await takePostRequest('doTask');
        continue
      }
      let task = $.oneTask.browseShopVo || $.oneTask.shoppingActivityVos || $.oneTask.productInfoVos || []
      for(let b in task){
        $.doTask = task[b]
        if($.doTask.status === 1){
          flag = 1
          console.log(`${$.doTask.shopName || $.doTask.title || $.doTask.skuName}`)
          $.taskToken = $.doTask.taskToken
          await takePostRequest('doTask');
          await $.wait(parseInt(Math.random() * 1000 + 2000, 10))
        }
      }
    }
    if(flag == 1){
      await $.wait(parseInt(Math.random() * 1000 + 2000, 10))
      await takePostRequest('get_task');
      console.log(`金币:${$.userScore}`)
      await $.wait(parseInt(Math.random() * 1000 + 2000, 10))
    }
    if($.index === 1) updatefriend($.inviter,0)
  } catch (e) {
    console.log(e)
  }
}
function updatefriend(id,type) {
  let index = 0
  for(let i in $.temp){
    if($.temp[i] && $.temp[i].assistInviter == id){
      index = i
      break
    }
  }
  if(type == 1) $.temp[index].count++
  if($.temp[index].count >= 10 || type == 0){
    console.log(`助力码[${$.temp[index].assistInviter}] 已邀请${$.temp[index].count}`)
    for(let i in $.temp){
      if($.temp[i] && $.temp[i].count < 10){
        $.assistToken = $.temp[i].assistToken
        $.assistInviter = $.temp[i].assistInviter
        console.log(`更新助力码[${$.assistToken}] 账号${$.temp[i].index} 已邀请${$.temp[i].count}`)
        break
      }
    }
  }
}

async function takePostRequest(type) {
  if($.hotFlag) return
  let url = '';
  let body = ``;
  let method = 'POST'
  switch (type) {
    case 'isvObfuscator':
      url = `https://api.m.jd.com/client.action?functionId=isvObfuscator`;
      body = `area=16_1315_3486_59648&body=%7B%22url%22%3A%22https%3A%5C/%5C/ddsj-dz.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&build=167814&client=apple&clientVersion=10.1.4&d_brand=apple&d_model=iPhone12%2C1&eid=eidIeb54812323sf%2BAJEbj5LR0Kf6GUzM9DKXvgCReTpKTRyRwiuxY/uvRHBqebAAKCAXkJFzhWtPj5uoHxNeK3DjTumb%2BrfXOt1w0/dGmOJzfbLuyNo&isBackground=N&joycious=72&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=8a0d1837f803a12eb217fcf5e1f8769cbb3f898d&osVersion=14.3&partner=apple&rfs=0000&scope=01&screen=828%2A1792&sign=c8afbec4d4154c805df6fe0df8cb912f&st=1631889047122&sv=122&uemps=0-0&uts=0f31TVRjBSvb8zBUzHW5p1o1wbLCbHauTTreOnycneuWHYoZst0N7s4rTeFacDhCJnJNfFiqbcT1OXsBoHOXQYN926Ap2sr3zfchsEXk7lu4JO1uRn0nNK6szw88y4QmJj21u7poGsXqivIm1eoa5GruqZ3jYalxmzDPUSSqOug7Gu3BK8pgQ2vaYRYGBo8BMhd1YF4fP6xLgUwQG/wcsQ%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=796606e8e181aa5865ec20728a27238b`;
      break;
    case 'userInfo':
      url = `https://ddsj-dz.isvjcloud.com/dd-api/jd-user-info`;
      body = `token=${$.Token}&source=01`;
      break;
    case 'get_user_info':
      method = 'get'
      url = `https://ddsj-dz.isvjcloud.com/dd-api/get_user_info`;
      break;
    case 'get_task':
      method = 'get'
      url = `https://ddsj-dz.isvjcloud.com/dd-api/get_task`;
      break;
    case 'doTask':
      url = `https://ddsj-dz.isvjcloud.com/dd-api/do_task`;
      body = `taskToken=${$.taskToken}&task_id=${$.oneTask.taskId}&task_type=${$.oneTask.taskType}`
      if($.oneTask.taskType !== 12){
        body += `&task_name=${$.doTask.shopName || $.doTask.title || $.doTask.skuName}`
      }
      break;
    case 'do_assist_task':
      url = `https://ddsj-dz.isvjcloud.com/dd-api/do_assist_task`;
      body = `taskToken=${$.assistToken}&inviter_id=${$.assistInviter}`
      break;
    default:
      console.log(`错误${type}`);
  }
  let myRequest = getPostRequest(url, body, method);
  return new Promise(async resolve => {
    if(method == 'get'){
      $.get(myRequest, (err, resp, data) => {
        try {
          if (err) {
            if(resp && resp.statusCode && resp.statusCode == 493){
              console.log('此ip已被限制，请过10分钟后再执行脚本\n')
              $.outFlag = true
            }
            console.log(`${$.toStr(err,err)}`)
            console.log(`${$.toStr($.toObj(data,data))}`)
            console.log(`${type} API请求失败，请检查网路重试`)
          } else {
            dealReturn(type, data);
          }
        } catch (e) {
          console.log(e, resp)
        } finally {
          resolve();
        }
      })
    }else{
      $.post(myRequest, (err, resp, data) => {
        try {
          if (err) {
            if(resp && resp.statusCode && resp.statusCode == 493){
              console.log('此ip已被限制，请过10分钟后再执行脚本\n')
              $.outFlag = true
              console.log(`${$.toStr(err,err)}`)
              console.log(`${type} API请求失败，请检查网路重试`)
            }else if(resp && resp.statusCode && resp.statusCode == 422 && type == "do_assist_task"){
              let res = $.toObj(data,data)
              if(typeof res === 'object' && res && res.message){
                $.toHelpMsg = res.message
              }else if(data){
                console.log(`${$.toStr($.toObj(data,data))}`)
              }
            }else{
              console.log(`${$.toStr(err,err)}`)
              console.log(`${type} API请求失败，请检查网路重试`)
            }
          } else {
            dealReturn(type, data);
          }
        } catch (e) {
          console.log(e, resp)
        } finally {
          resolve();
        }
      })
    }
  })
}

async function dealReturn(type, data) {
  let res = ''
  try {
    if(type != 'accessLogWithAD'){
      res = JSON.parse(data);
    }
  } catch (e) {
    console.log(`${type} 执行任务异常`);
    console.log(data);
    $.runFalag = false;
  }
  switch (type) {
    case 'isvObfuscator':
      if(typeof res == 'object' && res.errcode == 0){
        if(typeof res.token != 'undefined') $.Token = res.token
      }else if(typeof res == 'object' && res.message){
        console.log(`isvObfuscator ${res.message || ''}`)
      }else{
        console.log(data)
      }
      break;
    case 'userInfo':
      if(typeof res == 'object' && res && typeof res.access_token != 'undefined'){
        $.Bearer = res.access_token
      }else if(typeof res == 'object' && res.bizMsg){
        console.log(`${type} ${res.bizMsg || ''}`)
      }else{
        console.log(`${type} ${data}`)
      }
      break;
    case 'get_user_info':
      if(typeof res == 'object' && res && typeof res.openid != 'undefined'){
        $.inviter = res.openid
      }else if(typeof res == 'object' && res.bizMsg){
        console.log(`${type} ${res.bizMsg || ''}`)
      }else{
        console.log(`${type} ${data}`)
      }
      break;
    case 'get_task':
      if(typeof res == 'object' && res.result){
        if(typeof res.result && res.result.taskVos != 'undefined') $.taskList = res.result.taskVos
        if(typeof res.result && res.result.userScore != 'undefined') $.userScore = Number(res.result.userScore) || 0
      }else if(typeof res == 'object' && res.bizMsg){
        console.log(`${type} ${res.bizMsg || ''}`)
      }else{
        console.log(`${type} ${data}`)
      }
      break;
    case 'do_assist_task':
    case 'doTask':
      if(typeof res == 'object' && res.score){
        if(type == "do_assist_task") $.toHelpMsg = true
        if(typeof res.score !== 'undefined') console.log(`获得${res.score}金币`)
      }else if(typeof res == 'object' && res.bizMsg){
        if(res.bizMsg == '任务已完成') $.runFalag = false
        console.log(`${type} ${res.bizMsg || ''}`)
      }else{
        console.log(`${type} ${data}`)
      }
      break;
    default:
      console.log(`${type}-> ${data}`);
  }
  if(typeof res == 'object' && res.errorMessage){
    if(res.errorMessage.indexOf('火爆') >-1 ){
      $.hotFlag = true
    }
  }
}

function getPostRequest(url, body, method="POST") {
  let ck = cookie
  let host = ''
  let headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-cn",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded",
    'Cookie': `${ck}`,
    "X-Requested-With": "XMLHttpRequest",
    "User-Agent": `${UA || $.UA}` ,
  }
  if($.Bearer){
    headers["Authorization"] = `Bearer ${$.Bearer}`
  }
  res = {url: url, method: method, headers: headers, timeout:30000}
  if(method == "POST"){
    headers["Accept"] = "application/json"
    res.body = body
  }
  return res;
}

async function getUA(){
  $.UA = `jdapp;iPhone;10.1.4;13.1.2;${randomString(40)};network/wifi;model/iPhone8,1;addressid/2308460611;appBuild/167814;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`
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

