const $ = new Env('东东电竞经理');
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let cookiesArr = [];
let Authorization = ``;
$.inviteList = [];
$.authorizationInfo = {};
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
    await esManager();
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    $.cookie = cookiesArr[i];
    $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
    if (!$.authorizationInfo[$.UserName]) {
      continue;
    }
    $.canHelp = true;
    Authorization = $.authorizationInfo[$.UserName]
    for (let j = 0; j < $.inviteList.length && $.canHelp; j++) {
      $.oneInviteInfo = $.inviteList[j];
      if ($.oneInviteInfo.needTime === 0 || $.oneInviteInfo.user === $.UserName) {
        continue;
      }
      console.log(`${$.UserName}去助力${$.oneInviteInfo.user},助力码：${$.oneInviteInfo.token}，用户：${$.oneInviteInfo.openid}`)
      await takePostRequest('do_assist_task');
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

async function esManager() {
  try {
    $.token = '';
    Authorization = '';
    $.userInfo = {};//用户信息
    $.produceStatusInfo = {};//电量信息
    $.taskList = [];//任务列表
    await getToken();
    await $.wait(1000);
    if (!$.token) {
      console.log(`获取Token失败`);
      return;
    }
    await takePostRequest('Authorization');
    if (!Authorization) {
      console.log(`获取Authorization失败`);
      return;
    }
    // console.log(Authorization);
    await $.wait(1000);
    await takeGetRequest('user');
    await $.wait(1000);
    if (JSON.stringify($.userInfo) === '{}') {
      console.log('获取活动信息异常');
      return;
    } else {
      $.authorizationInfo[$.UserName] = Authorization;
      console.log('获取活动信息成功');
    }

    await takeGetRequest('produce_status');
    //console.log(JSON.stringify($.produceStatusInfo));
    console.log(`发电机电力${$.produceStatusInfo.coins}`);
    if (JSON.stringify($.produceStatusInfo) !== '{}' && Number($.produceStatusInfo.coins) > 10) {
      console.log('收取发电机电量');
      await $.wait(2000);
      await takePostRequest('get_produce_coins');
    }
    await $.wait(1000);
    await takeGetRequest('task');
    if ($.taskList.length > 0) {
      await daTask();
    }
    await $.wait(1000);
  } catch (e) {
    $.logErr(e)
  }
}

async function daTask() {
  for (let i = 0; i < $.taskList.length; i++) {
    $.oneTask = $.taskList[i];
    if ($.oneTask.status !== '1') {
      if ($.oneTask.status === '2') {
        console.log(`任务，${$.oneTask.task_name},已完成`)
      }
      continue;
    }
    if ($.oneTask.task_type === '6') {
      console.log(`助力码：${$.oneTask.assist_task_detail_vo.task_token}`);
      let oneInfo = {
        'user': $.UserName,
        'openid': $.userInfo.openid,
        'token': $.oneTask.assist_task_detail_vo.task_token,
        'needTime': Number($.oneTask.max_times) - Number($.oneTask.times),
      };
      $.inviteList.push(oneInfo);
    } else if ($.oneTask.task_type === '13') {
      console.log(`去做任务，${$.oneTask.task_name}`)
      $.onetToken = $.oneTask.simple_record_info_vo;
      await takePostRequest('do_task');
    } else if (
        $.oneTask.task_type === '5' ||
        $.oneTask.task_type === '3' ||
        $.oneTask.task_type === '2' ||
        $.oneTask.task_type === '26' ||
        $.oneTask.task_type === '1'
    ) {
      $.tokenList = $.oneTask.browse_shop_vo || $.oneTask.shopping_activity_vos || $.oneTask.product_info_vos || $.oneTask.follow_shop_vo;
      for (let j = 0; j < $.tokenList.length; j++) {
        $.onetToken = $.tokenList[j];
        if ($.onetToken.status !== '1') {
          continue;
        }
        console.log(`去做任务，${$.oneTask.task_name},${$.onetToken.shop_name || $.onetToken.title || $.onetToken.sku_name}`);
        await takePostRequest('do_task');
        await $.wait(3000);
      }
    }
  }
}

async function takePostRequest(type) {
  let url = ``;
  let body = ``;
  let myRequest = ``;
  switch (type) {
    case 'get_produce_coins':
      url = `https://xinruidddj-isv.isvjcloud.com/api/club/get_produce_coins`;
      myRequest = getGetRequest(url, body);
      break;
    case 'do_task':
      url = `https://xinruidddj-isv.isvjcloud.com/api/task/do_task`;
      body = `token=${$.onetToken.task_token}&task_id=${$.oneTask.task_id}&task_type=${$.oneTask.task_type}`
      myRequest = getPostRequest(url, body);
      break;
    case 'Authorization':
      url = `https://xinruidddj-isv.isvjcloud.com/api/user/jd/auth`;
      body = `token=${$.token}`
      myRequest = getPostRequest(url, body);
      break;
    case 'do_assist_task':
      url = `https://xinruidddj-isv.isvjcloud.com/api/task/do_assist_task`;
      body = `token=${$.oneInviteInfo.token}&inviter=${$.oneInviteInfo.openid}`
      myRequest = getPostRequest(url, body);
      break;
    default:
      console.log(`错误${type}`);
  }
  return new Promise(async resolve => {
    $.post(myRequest, (err, resp, data) => {
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

async function getToken() {
  const url = `https://api.m.jd.com/client.action?functionId=isvObfuscator`;
  const method = `POST`;
  const headers = {
    "Host": "api.m.jd.com",
    "Content-Type": "application/x-www-form-urlencoded",
    "Accept": "*/*",
    "Connection": "keep-alive",
    'Cookie': $.cookie,
    UserAgent: $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
  }
  let body = `body=%7B%22url%22%3A%20%22https%3A//xinruidddj-isv.isvjcloud.com%22%2C%20%22id%22%3A%20%22%22%7D&uuid=1d94feefe44e4ebcba2192421189a52a&client=apple&clientVersion=9.4.0&st=1623830118000&sv=102&sign=9bd23a7b74b59d88d751e21f19455db7`;
  let myRequest = {url: url, method: method, headers: headers, body: body};
  return new Promise(async resolve => {
    $.post(myRequest, (err, resp, data) => {
      try {
        data = JSON.parse(data);
        if (data.code === '0') {
          $.token = data.token;
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
  data = JSON.parse(data);
  switch (type) {
    case 'Authorization':
      if (data.status === '0') {
        Authorization = data.body.access_token;
      } else {
        console.log(`异常：${JSON.stringify(data)}\n`);
      }
      break;
    case 'user':
      if (data.status === '0') {
        $.userInfo = data.body;
      } else {
        console.log(`获取信息异常：${JSON.stringify(data)}\n`);
      }
      break;
    case 'produce_status':
      if (data.status === '0') {
        $.produceStatusInfo = data.body;
      } else {
        console.log(`异常：${JSON.stringify(data)}\n`);
      }
      break;
    case 'get_produce_coins':
      if (data.status === '0') {
        console.log(`收取成功获得：${data.body.coins}`);
      } else {
        console.log(`收取异常：${JSON.stringify(data)}\n`);
      }
      break;
    case 'task':
      if (data.status === '0') {
        $.taskList = data.body.task_vos;
      } else {
        console.log(`异常：${JSON.stringify(data)}\n`);
      }
      break;
    case 'do_task':
      if (data.status === '0') {
        console.log(`任务完成，获得：${data.body.result.score || 0}`);
      } else {
        console.log(`异常：${JSON.stringify(data)}\n`);
      }
      break;
    case 'do_assist_task':
      if (data.status === '0') {
        console.log(`助力成功`);
        $.oneInviteInfo.needTime -= 1;
      } else if (data.status === '108') {
        console.log(JSON.stringify(data));
        console.log(`助力次数已用完`);
        $.canHelp = false;
      } else if (data.status === '108') {
        console.log(JSON.stringify(data));
        console.log(`助力已满`);
        $.oneInviteInfo.needTime = 0;
      } else {
        console.log(JSON.stringify(data));
      }
      break;
    default:
      console.log(JSON.stringify(data));
  }
}

async function takeGetRequest(type) {
  let url = ``;
  let myRequest = ``;
  switch (type) {
    case 'user':
      url = `https://xinruidddj-isv.isvjcloud.com/api/uc/user`;
      myRequest = getGetRequest(url);
      break;
    case 'produce_status':
      url = `https://xinruidddj-isv.isvjcloud.com/api/club/produce_status`;
      myRequest = getGetRequest(url);
      break;
    case 'task':
      url = `https://xinruidddj-isv.isvjcloud.com/api/task/detail`;
      myRequest = getGetRequest(url);
      break;
    case 'Authorization':
      url = `https://xinruidddj-isv.isvjcloud.com/api/task/detail`;
      myRequest = getGetRequest(url);
      break;
    default:
      console.log(`错误${type}`);
  }
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

function getPostRequest(url, body) {
  const method = `POST`;
  const headers = {
    'Accept-Encoding': `gzip, deflate, br`,
    'Cookie': $.cookie,
    'Connection': `keep-alive`,
    'Content-Type': `application/x-www-form-urlencoded`,
    'Accept': `application/json, text/plain, */*`,
    'Host': `xinruidddj-isv.isvjcloud.com`,
    UserAgent: $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
    'Authorization': Authorization,
    'Referer': `https://xinruidddj-isv.isvjcloud.com/exception/`,
    'Accept-Language': `zh-cn`
  };
  return {url: url, method: method, headers: headers, body: body};
}

function getGetRequest(url) {
  const method = `GET`;
  const headers = {
    'Accept-Encoding': `gzip, deflate, br`,
    'Cookie': $.cookie,
    'Connection': `keep-alive`,
    'Content-Type': `application/x-www-form-urlencoded`,
    'Accept': `application/json, text/plain, */*`,
    'Host': `xinruidddj-isv.isvjcloud.com`,
    UserAgent: $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
    'Authorization': Authorization,
    'Referer': `https://xinruidddj-isv.isvjcloud.com/exception/`,
    'Accept-Language': `zh-cn`
  };
  return {url: url, method: method, headers: headers};
}

function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      url: "https://wq.jd.com/user_new/info/GetJDUserInfoUnion?sceneval=2",
      headers: {
        Host: "wq.jd.com",
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
