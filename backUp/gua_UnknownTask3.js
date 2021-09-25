/*

https://prodev.m.jd.com/mall/active/2y1S9xVYdTud2VmFqhHbkcoAYhJT/index.html

27 8,18 * 9 * https://raw.githubusercontent.com/smiek2221/scripts/master/gua_UnknownTask3.js
*/
const $ = new Env('寻找内容鉴赏官');
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
$.outFlag = 0
$.list = [
  {
    "type": 5,
    "projectId":"rfhKVBToUL4RGuaEo7NtSEUw2bA",
    "assignmentId":"2PbAu1BAT79RxrM5V7c2VAPUQDSd",
    "name":"签到",
  },
  {
    "type": 9,
    "projectId":"rfhKVBToUL4RGuaEo7NtSEUw2bA",
    "assignmentId":"XTXNrKoUP5QK1LSU8LbTJpFwtbj",
    "name":"逛发现内容",
  },
  {
    "type": 1,
    "projectId":"rfhKVBToUL4RGuaEo7NtSEUw2bA",
    "assignmentId":"3dw9N5yB18RaN9T1p5dKHLrWrsX",
    "name":"看大咖种草秀赢京豆",
  },
  {
    "type": 1,
    "projectId":"rfhKVBToUL4RGuaEo7NtSEUw2bA",
    "assignmentId":"Hys8nCmAaqKmv1G3Y3a5LJEk36Y",
    "name":"看精选视频赢京豆",
  },
  {
    "type": 1,
    "projectId":"rfhKVBToUL4RGuaEo7NtSEUw2bA",
    "assignmentId":"2gWnJADG8JXMpp1WXiNHgSy4xUSv",
    "name":"逛运动部落赢大奖",
  },
  {
    "type": 1,
    "projectId":"rfhKVBToUL4RGuaEo7NtSEUw2bA",
    "assignmentId":"CtXTxzkh4ExFCrGf8si3ePxGnPy",
    "name":"看三星新品晒单内容赢京豆",
  },
  {
    "type": 1,
    "projectId":"rfhKVBToUL4RGuaEo7NtSEUw2bA",
    "assignmentId":"26KhtkXmoaj6f37bE43W5kF8a9EL",
    "name":"一起潮有品，焕新家",
  },
  {
    "type": 1,
    "projectId":"rfhKVBToUL4RGuaEo7NtSEUw2bA",
    "assignmentId":"bWE8RTJm5XnooFr4wwdDM5EYcKP",
    "name":"玩转3c开学季",
  },
]
$.temp = [];
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
      "open-url": "https://bean.m.jd.com/"
    });
    return;
  }
  console.log(`入口:\nhttps://prodev.m.jd.com/mall/active/2VyRHGE7jM1igBJcrjoB6ak1JJWV/index.html`)
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
    }
    if($.outFlag != 0) break
  }
  $.projectId = "rfhKVBToUL4RGuaEo7NtSEUw2bA"
  $.assignmentId = "3PX8SPeYoQMgo1aJBZYVkeC7QzD3"
  $.helpType = 2
  $.type = 2
  for (let i = 0; i < cookiesArr.length && true; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.canHelp = true;//能否助力
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      if ((cookiesArr && cookiesArr.length >= 1) && $.canHelp) {
        for (let t in $.temp) {
          let item = $.temp[t]
          if (!item) continue;
          console.log(`\n${$.UserName} 去助力 ${item}`);
          $.toHelp = ''
          $.itemId = item
          await takePostRequest('help');
          await $.wait(parseInt(Math.random() * 1000 + 1000, 10))
          if($.toHelpMsg.indexOf('可助力') > -1){
            await takePostRequest('interactive_done');
            await $.wait(parseInt(Math.random() * 1000 + 1000, 10))
          }else if($.toHelpMsg.indexOf('任务已完成') > -1){
            $.temp[t] = ''
            break;
          }else if($.toHelpMsg.indexOf('最多助力') > -1) break;
        }
      }
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
    $.earn = 0
    $.signTask = ''
    $.total = ''
    await takePostRequest('interactive_rewardInfo');
    $.helpType = 1
    $.itemId = ''
    await takePostRequest('help');
    if($.total === ''){
      console.log('账号异常')
      allMessage += `【京东账号${$.index}】${$.nickName || $.UserName}\n账号异常\n`
      return
    }
    for(let i in $.list || []){
      if($.list[i]){
        $.type = $.list[i].type
        $.projectId = $.list[i].projectId
        $.assignmentId = $.list[i].assignmentId
        $.Task = ''
        await takePostRequest('interactive_info');
        // console.log($.Task)
        if($.Task){
          if($.type == 5) console.log(`签到天数${$.Task.current || 0}/${$.Task.signDays || 0}`)
          $.projectId = $.Task.projectId
          $.assignmentId = $.Task.assignmentId
          $.itemId = $.Task.itemId || ''
          let title = $.Task.title || $.list[i].name
          if($.Task.status+"" === "0"){
            console.log(`${title}`)
            await $.wait(parseInt(Math.random() * 1000 + 1000, 10))
            if($.Task.waitDuration > 0){
              await takePostRequest('interactive_accept');
              console.log(parseInt($.Task.waitDuration > 0 && $.Task.waitDuration*1000, 10) || 10000)
              await $.wait(parseInt($.Task.waitDuration > 0 && $.Task.waitDuration*1000, 10) || 10000)
              UA = 'JD4iPhone/167814 (iPhone; iOS 13.1.2; Scale/2.00)'
              await takePostRequest('qryViewkitCallbackResult');
              UA = ''
            }else{
              if($.type == 9) UA = 'JD4iPhone/167814 (iPhone; iOS 13.1.2; Scale/2.00)'
              await takePostRequest('interactive_done');
              if($.type == 9){
                UA = ''
                await $.wait(parseInt(Math.random() * 1000 + 1000, 10))
                await takePostRequest('interactive_reward');
              }
            }
            await $.wait(parseInt(Math.random() * 1000 + 2000, 10))

          }else if($.Task.status+"" === "1" && $.type == 9){
            await takePostRequest('interactive_reward');
            await $.wait(parseInt(Math.random() * 1000 + 2000, 10))
          }else if($.Task.status+"" === "2"){
            console.log(`${title} 已完成`)
          }else{
            console.log(`${title}-未知 ${$.Task.status}`)
          }
        }else{
          console.log(`${$.list[i].name} 获取失败`)
        }
      }
    }
    await takePostRequest('interactive_rewardInfo');
    if($.earn > 0) allMessage += `【京东账号${$.index}】${$.nickName || $.UserName}\n本次运行获得${$.earn}京豆，共计${$.total}京豆\n`
    await $.wait(parseInt(Math.random() * 1000 + 3000, 10))
  } catch (e) {
    console.log(e)
  }
}

async function takePostRequest(type) {
  let url = '';
  let body = ``;
  switch (type) {
    case 'interactive_rewardInfo':
      url = `https://api.m.jd.com/interactive_rewardInfo?functionId=interactive_rewardInfo&appid=contenth5_common&body={"encryptProjectPoolId":"DhFbbuoB65uR33ntszFgY8raqPQ"}&client=wh5`;
      body = ``;
      break;
    case 'interactive_info':
      url = `https://api.m.jd.com/interactive_info?functionId=interactive_info&appid=contenth5_common&body=[{"type":"${$.type}","projectId":"${$.projectId}","assignmentId":"${$.assignmentId}","doneHide":false}]&client=wh5`;
      body = ``;
      break;
    case 'help':
      url = `https://api.m.jd.com/interactive_info?functionId=interactive_info&appid=contenth5_common&body=[{"type":"2","projectId":"rfhKVBToUL4RGuaEo7NtSEUw2bA","assignmentId":"3PX8SPeYoQMgo1aJBZYVkeC7QzD3","doneHide":false,"helpType":"${$.helpType}","itemId":"${$.itemId}"}]&client=wh5`;
      body = ``;
      break;
    case 'interactive_done':
    case 'interactive_accept':
      let bodys = ''
      if($.type == 5) bodys = ',"agid":["05804754","05822013"]'
      if($.type == 2) bodys = ',"agid":["05804754","05804886"]'
      url = `https://api.m.jd.com/${type}?functionId=${type}&appid=contenth5_common&body={"projectId":"${$.projectId}","assignmentId":"${$.assignmentId}","type":"${$.type}","itemId":"${$.itemId}"${bodys}}&client=wh5`;
      body = ``;
      if($.type == 9){
        url = `https://api.m.jd.com/client.action?functionId=interactive_done`;
        body = `area=16_1315_1316_53522&body=%7B%22assignmentId%22%3A%22XTXNrKoUP5QK1LSU8LbTJpFwtbj%22%2C%22type%22%3A%229%22%2C%22projectId%22%3A%22rfhKVBToUL4RGuaEo7NtSEUw2bA%22%7D&build=167814&client=apple&clientVersion=10.1.4&d_brand=apple&d_model=iPhone8%2C1&eid=eidId10b812191seBCFGmtbeTX2vXF3lbgDAVwQhSA8wKqj6OA9J4foPQm3UzRwrrLdO23B3E2wCUY/bODH01VnxiEnAUvoM6SiEnmP3IPqRuO%2By/%2BZo&isBackground=N&joycious=63&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=2f7578cb634065f9beae94d013f172e197d62283&osVersion=13.1.2&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=0533863111d0e0d69410f56a7ef58fb9&st=1631296373128&sv=111&uemps=0-1&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJgF04TMIkjbf0gVLusgIW5EdhotCsxFSHKJprkovrIgyVo4dZUGgBgL/RiEhL2bvOAuOce/8hqhTGUuEXz1rwspF1DPZ87zyLDiuE0/Yr8VmOUCLV2yp05R1%2BHqoEl280hhlwUaSLrG/h7tEBMu6dCrOsOEd5oQX6H74r9en/aKB2N59xTeMu4Q%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=796606e8e181aa5865ec20728a27238b`;
      }
      break;
    case 'interactive_reward':
      url = `https://api.m.jd.com/interactive_reward?functionId=interactive_reward&appid=contenth5_common&body={"projectId":"${$.projectId}","assignmentId":"${$.assignmentId}","type":"${$.type}"}&client=wh5`;
      body = ``;
      break;
    case 'qryViewkitCallbackResult':
      url = `https://api.m.jd.com/client.action?functionId=qryViewkitCallbackResult`;
      body = `area=16_1315_1316_53522&body=%7B%22dataSource%22%3A%22babelInteractive%22%2C%22method%22%3A%22customDoInteractiveAssignmentForBabel%22%2C%22reqParams%22%3A%22%7B%5C%22itemId%5C%22%3A%5C%225001549779%5C%22%2C%5C%22encryptProjectId%5C%22%3A%5C%22rfhKVBToUL4RGuaEo7NtSEUw2bA%5C%22%2C%5C%22encryptAssignmentId%5C%22%3A%5C%22Hys8nCmAaqKmv1G3Y3a5LJEk36Y%5C%22%7D%22%7D&build=167814&client=apple&clientVersion=10.1.4&d_brand=apple&d_model=iPhone8%2C1&eid=eidId10b812191seBCFGmtbeTX2vXF3lbgDAVwQhSA8wKqj6OA9J4foPQm3UzRwrrLdO23B3E2wCUY/bODH01VnxiEnAUvoM6SiEnmP3IPqRuO%2By/%2BZo&isBackground=N&joycious=63&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=2f7578cb634065f9beae94d013f172e197d62283&osVersion=13.1.2&partner=apple&rfs=0000&scope=01&screen=750%2A1334&sign=66ef1835f9cf7a6c3173196637e1cbdb&st=1631300134703&sv=100&uemps=0-1&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJgF04TMIkjbf0gVLusgIW5EdhotCsxFSHKJprkovrIgyVo4dZUGgBgL/RiEhL2bvOAuOce/8hqhTGUuEXz1rwspF1DPZ87zyLDiuE0/Yr8VmOUCLV2yp05R1%2BHqoEl280hhlwUaSLrG/h7tEBMu6dCrOsOEd5oQX6H74r9en/aKB2N59xTeMu4Q%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=796606e8e181aa5865ec20728a27238b`;
      break;
    default:
      console.log(`错误${type}`);
  }
  let myRequest = getPostRequest(url, body);
  return new Promise(async resolve => {
    $.post(myRequest, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.toStr(err,err)}`)
          console.log(`${type} API请求失败，请检查网路重试`)
        } else {
          // setActivityCookie(resp)
          dealReturn(type, data);
        }
      } catch (e) {
        // console.log(data);
        console.log(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

async function dealReturn(type, data) {
  let res = ''
  try {
    res = JSON.parse(data);
  } catch (e) {
    console.log(`执行任务异常`);
    // console.log(data);
    $.runFalag = false;
  }
  switch (type) {
    case 'interactive_rewardInfo':
      if (res.data && res.success && res.code+"" === "0" && res.data) {
        if($.total === ''){
          $.total = parseInt(res.data,10) > 0 && parseInt(res.data,10) || 0
          console.log(`当前累计${res.data || 0}京豆`)
        }else{
          $.earn = parseInt(res.data,10) > 0 && (parseInt(res.data,10) - $.total) || 0
          $.total = parseInt(res.data,10) > 0 && parseInt(res.data,10) || 0
          console.log(`本次运行获得${$.earn}京豆`)
        }
      } else {
        console.log(`${type}-> ${data}`);
      }
      break;
    case 'interactive_info':
      if (res.data && res.success && res.code+"" === "0" && res.data) {
        $.Task = res.data[0] || res.data || {};
      } else {
        console.log(`${type}-> ${data}`);
      }
      break;
    case 'interactive_done':
    case 'interactive_reward':
      if (res.data && res.success && res.code+"" === "0" && res.data) {
        console.log(`${res.data && (res.data.rewardMsg || res.data.msg || '') || data}`)
      } else {
        console.log(`${type}-> ${data}`);
      }
      break;
    case 'help':
      if (res.data && res.success && res.code+"" === "0" && res.data) {
        let arr = res.data[0] || res.data || {}
        if($.helpType == 1){
          console.log(`助力码:${arr.itemId || '获取失败'}`)
          if(arr.itemId){
            $.temp.push(arr.itemId);
          }
        }else if($.helpType == 2){
          $.toHelp = arr.remainAssistTime
          $.toHelpMsg = arr.msg
          console.log(arr.msg)
        }
      } else {
        console.log(`${type}-> ${data}`);
      }
      break;
    default:
      console.log(`${type}-> ${data}`);
  }
}

function getPostRequest(url,body) {
  let headers =  {
    "Accept": "application/json",
    "Accept-Language": "zh-cn",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded",
    'Cookie': `${cookie}`,
    "Origin": `https://prodev.m.jd.com`,
    "X-Requested-With": "XMLHttpRequest",
    "Referer": `https://prodev.m.jd.com/mall/active/2y1S9xVYdTud2VmFqhHbkcoAYhJT/index.html`,
    "User-Agent": `${UA || $.UA}` ,
  }
  // console.log(headers)
  // console.log(headers.Cookie)
  return  {url: url, method: `POST`, headers: headers, body: body};
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

