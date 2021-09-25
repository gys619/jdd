/*
东东世界

已支持IOS双京东账号,Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#东东世界
15 3,9 * * * https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_ddworld.js, tag=东东世界, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true

================Loon==============
[Script]
cron "15 3,9 * * *" script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_ddworld.js,tag=东东世界

===============Surge=================
东东世界 = type=cron,cronexp="15 3,9 * * *",wake-system=1,timeout=3600,script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_ddworld.js

============小火箭=========
东东世界 = type=cron,script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_ddworld.js, cronexpr="15 3,9 * * *", timeout=3600, enable=true
*/
const $ = new Env('东东世界');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let jdNotify = true;//是否关闭通知，false打开通知推送，true关闭通知推送
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
const JD_API_HOST = 'https://ddsj-dz.isvjcloud.com/dd-api';
let allMessage = '';
$.shareCodes = []
let tokenInfo = {}, hotInfo = {}
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
      message = '';
      await TotalBean();
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      $.hot = false
      await jdWorld()
      await $.wait(2000)
      tokenInfo[$.UserName] = $.access_token
      hotInfo[$.UserName] = $.hot
    }
  }
  let res = await getAuthorShareCode('https://raw.githubusercontent.com/Aaron-lv/updateTeam/master/shareCodes/ddworld.json')
  if (!res) {
    $.http.get({url: 'https://purge.jsdelivr.net/gh/Aaron-lv/updateTeam@master/shareCodes/ddworld.json'}).then((resp) => {}).catch((e) => console.log('刷新CDN异常', e));
    await $.wait(1000)
    res = await getAuthorShareCode('https://cdn.jsdelivr.net/gh/Aaron-lv/updateTeam@master/shareCodes/ddworld.json')
  }
  $.shareCodes = [...$.shareCodes, ...(res || [])]
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
    $.access_token = tokenInfo[$.UserName]
    $.canHelp = true
    if (hotInfo[$.UserName]) continue
    if ($.shareCodes && $.shareCodes.length) {
      console.log(`\n自己账号内部循环互助\n`);
      for (let j = 0; j < $.shareCodes.length && $.canHelp; j++) {
        console.log(`账号${$.UserName} 去助力 ${$.shareCodes[j].use} 的助力码 ${$.shareCodes[j].code}`)
        if ($.shareCodes[j].num === $.domax) {
          console.log(`助力失败：您的好友助力已满`)
          $.shareCodes.splice(j, 1)
          j--
          continue
        }
        if ($.UserName === $.shareCodes[j].use) {
          console.log(`助力失败：不能助力自己`)
          continue
        }
        $.success = false
        await do_assist_task($.shareCodes[j].taskToken, $.shareCodes[j].code)
        await $.wait(2000)
        if ($.success) $.shareCodes[j].num++
      }
    }
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })

async function jdWorld() {
  await getIsvToken()
  await getIsvToken2()
  await getUserInfo()
  await get_user_info()
  if ($.hot) return
  await get_task()
}

// 获得IsvToken
async function getIsvToken() {
  let body = `body=%7B%22to%22%3A%22https%3A%2F%2Fddsj-dz.isvjcloud.com%2Fdd-world%2Fload_app%2Fload_app.html%22%2C%22action%22%3A%22to%22%7D&client=apple&clientVersion=10.1.0&uuid=yzv1eikjigs4sg8v&st=1631949498731&sign=8733ea1f0244a2346af129512294fa09&sv=111`
  return new Promise(async resolve => {
    $.post(jdUrl('genToken', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.name} genToken API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            $.isvToken = data['tokenKey']
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
// 获得对应游戏的访问Token
async function getIsvToken2() {
  let body = `body=%7B%22id%22%3A%22%22%2C%22url%22%3A%22https%3A%2F%2Fddsj-dz.isvjcloud.com%22%7D&client=apple&clientVersion=10.1.0&uuid=b56r0is60bfo0x9n&st=1631949499685&sign=950339fc057b93ca9b9976d052f733a2&sv=111`
  return new Promise(async resolve => {
    $.post(jdUrl('isvObfuscator', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.name} isvObfuscator API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            $.token2 = data['token']
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
async function getUserInfo() {
  return new Promise(async resolve => {
    $.post(taskPostUrl(`jd-user-info`, `token=${$.token2}&source=01`, `IsvToken=${$.isvToken}`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} getUserInfo API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data)
            $.access_token = data.access_token
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

function get_task() {
  return new Promise(async resolve => {
    $.get(taskUrl(`get_task`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} get_task API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data)
            for (let key of Object.keys(data.result.taskVos)) {
              let vo = data.result.taskVos[key]
              if (vo.status === 1) {
                if (!vo.assistTaskDetailVo) console.log(`去做【${vo.taskName}】`)
                if (vo.simpleRecordInfoVo) {
                  await do_task(vo.simpleRecordInfoVo.taskToken, vo.taskId, vo.taskType)
                  await $.wait(2000)
                } else if (vo.assistTaskDetailVo) {
                  $.domax = vo.maxTimes
                  $.shareCodes.push({
                    'use': $.UserName,
                    'taskToken': vo.assistTaskDetailVo.taskToken,
                    'code': $.openid,
                    'num': vo.times
                  })
                } else {
                  let Vos = vo.browseShopVo || vo.shoppingActivityVos || vo.productInfoVos || []
                  for (let key of Object.keys(Vos)) {
                    let taskVo = Vos[key]
                    taskName = taskVo.shopName || taskVo.title || taskVo.skuName
                    if (taskVo.status === 1) {
                      await do_task(taskVo.taskToken, vo.taskId, vo.taskType, taskName)
                      await $.wait(2000)
                    } else {
                      console.log(`【${taskName}】已完成`)
                    }
                  }
                }
              } else {
                console.log(`【${vo.taskName}】已完成`)
              }
            }
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
function do_task(taskToken, task_id, task_type, task_name = '') {
  let body = `taskToken=${taskToken}&task_id=${task_id}&task_type=${task_type}`
  if (task_name) body = `${body}&task_name=${escape(task_name)}`
  return new Promise(resolve => {
    $.post(taskPostUrl(`do_task`, body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} do_task API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data)
            console.log(`完成成功：获得${data.score}金币`)
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
function get_user_info() {
  return new Promise(resolve => {
    $.get(taskUrl(`get_user_info`), (err, resp, data) => {
      try {
        if (data) {
          data = JSON.parse(data)
          if (!data.status_code) {
            console.log(`【京东账号${$.index}（${$.UserName}）的东东世界好友互助码】${data.openid}`)
            $.openid = data.openid
          } else if (data.status_code === 403) {
            $.hot = true
            console.log(`活动太火爆了，还是去买买买吧！`)
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
function do_assist_task(taskToken, code) {
  let body = `taskToken=${taskToken}&inviter_id=${code}`
  return new Promise(resolve => {
    $.post(taskPostUrl(`do_assist_task`, body), (err, resp, data) => {
      try {
        if (data) {
          data = JSON.parse(data)
          if (!data.status_code) {
            console.log(`助力成功：获得${data.score}金币`)
            $.success = true
          } else if (data.status_code === 422) {
            console.log(`助力失败：无助力次数`)
            $.canHelp = false
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

function showMsg() {
  return new Promise(resolve => {
    if (!jdNotify) {
      $.msg($.name, '', `${message}`);
    } else {
      $.log(`京东账号${$.index}${$.nickName}\n${message}`);
    }
    resolve()
  })
}

function jdUrl(functionId, body) {
  return {
    url: `https://api.m.jd.com/client.action?functionId=${functionId}`,
    body: body,
    headers: {
      'Host': 'api.m.jd.com',
      'accept': '*/*',
      'user-agent': 'JD4iPhone/167490 (iPhone; iOS 14.2; Scale/3.00)',
      'accept-language': 'zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6',
      'content-type': 'application/x-www-form-urlencoded',
      'Cookie': cookie
    }
  }
}
function taskUrl(functionId) {
  return {
    url: `${JD_API_HOST}/${functionId}`,
    headers: {
      "Host": "ddsj-dz.isvjcloud.com",
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept-Encoding": "gzip, deflate, br",
      "Cookie": $.access_token ? `dd-world=${$.access_token}` : '',
      "Authorization": $.access_token ? `Bearer ${$.access_token}` : '',
      "Connection": "keep-alive",
      "Accept": "application/json, text/plain, */*",
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      "Referer": "https://ddsj-dz.isvjcloud.com/dd-world/",
      "Accept-Language": "zh-cn",
    }
  }
}
function taskPostUrl(functionId, body = '', IsvToken = '') {
  return {
    url: `${JD_API_HOST}/${functionId}`,
    body,
    headers: {
      "Host": "ddsj-dz.isvjcloud.com",
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept-Encoding": "gzip, deflate, br",
      "Cookie": IsvToken ? IsvToken : $.access_token ? `dd-world=${$.access_token}` : '',
      "Authorization": $.access_token ? `Bearer ${$.access_token}` : '',
      "Connection": "keep-alive",
      "Accept": "application/json, text/plain, */*",
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      "Referer": "https://ddsj-dz.isvjcloud.com/dd-world/",
      "Accept-Language": "zh-cn",
    }
  }
}

function getAuthorShareCode(url) {
  return new Promise(async resolve => {
    const options = {
      url: `${url}?${new Date()}`, "timeout": 10000, headers: {
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
        resolve(JSON.parse(data))
      } catch (e) {
        // $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
    await $.wait(10000)
    resolve();
  })
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
function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
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
