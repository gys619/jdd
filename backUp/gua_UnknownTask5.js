/*

https://3.cn/102QN9l-6
跑此脚本需要添加依赖文件[sign_graphics_validate.js]
————————————————
如需开卡请设置环境变量[guaunknownTask_card5]为"true"

如需加购请设置环境变量[guaunknownTask_addSku5]为"true"

27 11 13-23 9 * https://raw.githubusercontent.com/smiek2221/scripts/master/gua_UnknownTask5.js
*/
const $ = new Env('酒水中秋礼盒');
const Faker=require('./sign_graphics_validate.js') 
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
let guaopencard = "false"
guaopencard = $.isNode() ? (process.env.guaunknownTask_card5 ? process.env.guaunknownTask_card5 : `${guaopencard}`) : ($.getdata('guaunknownTask_card5') ? $.getdata('guaunknownTask_card5') : `${guaopencard}`);
guaopencard = $.isNode() ? (process.env.guaunknownTask_card_All ? process.env.guaunknownTask_card_All : `${guaopencard}`) : ($.getdata('guaunknownTask_card_All') ? $.getdata('guaunknownTask_card_All') : `${guaopencard}`);
let guaunknownTask_addSku = "false"
guaunknownTask_addSku = $.isNode() ? (process.env.guaunknownTask_addSku5 ? process.env.guaunknownTask_addSku5 : `${guaunknownTask_addSku}`) : ($.getdata('guaunknownTask_addSku5') ? $.getdata('guaunknownTask_addSku5') : `${guaunknownTask_addSku}`);
guaunknownTask_addSku = $.isNode() ? (process.env.guaunknownTask_addSku_All ? process.env.guaunknownTask_addSku_All : `${guaunknownTask_addSku}`) : ($.getdata('guaunknownTask_addSku_All') ? $.getdata('guaunknownTask_addSku_All') : `${guaunknownTask_addSku}`);
allMessage = ""
message = ""
let UA = ''
let configCode = '3cfe11b8a4c7460aac77c24a32020e75'
let friendPin = '1SxWKHmezsdVriTLjOkqyoVI+useK94bdK5BQ6zjgl4='
let toFriend = 0
$.temp = [];
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
      "open-url": "https://bean.m.jd.com/"
    });
    return;
  }
  $.shareArr = []
  console.log(`入口:\nhttps://3.cn/102QN9l-6`)
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
      if($.index == 1 && !$.pin) break
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
    toFriend = 0
    $.bean = 0
    if(!$.fp || !$.eid){
      message += `获取活动信息失败！\n`
      return
    }
    await getActivity()
    $.taskList = []
    $.pin = ''
    await getMyTask(1)
    let friendCount = 0
    for(let i in $.taskList || []){
      $.oneTask = $.taskList[i]
      let title = ''
      switch ($.oneTask.taskType) {
        case 2:
          title = '关注'
          break;
        case 3:
          title = '浏览'
          break;
        case 4:
          title = '加购'
          break;
        case 8:
          title = '邀请'
          break;
        case 11:
          title = '开通会员'
          break;
      }
      console.log(`${title} ${$.oneTask.finishCount}/${$.oneTask.itemCount}`)
      let num = $.oneTask.itemCount - $.oneTask.finishCount
      if($.oneTask.taskType == 8){
        friendCount = $.oneTask.finishCount
        continue
      }
      if(num <= 0) continue
      if($.oneTask.taskType == 4 && guaopencard+"" != "true") console.log('如需开卡请设置环境变量[guaunknownTask_card5]为"true"')
      if($.oneTask.taskType == 4 && guaopencard+"" != "true") continue
      if($.oneTask.taskType == 11 && guaopencard+"" != "true") console.log('如需开卡请设置环境变量[guaunknownTask_card5]为"true"')
      if($.oneTask.taskType == 11 && guaopencard+"" != "true") continue
      let taskNum = $.oneTask.itemCount - $.oneTask.finishCount
      if([2,3,4,11].includes($.oneTask.taskType)){
        $.itemId = $.oneTask.taskItem.itemId
        let task = []
        let onetask = []
        do{
          taskNum--;
          task = []
          if($.oneTask.taskType == 11) await join($.itemId)
          await $.wait(parseInt(Math.random() * 2000 + 2000, 10))
          await takePostRequest('doTask');
          $.itemId = ''
          await $.wait(parseInt(Math.random() * 2000 + 1000 * $.oneTask.viewTime || 2, 10))
          if($.oneTask.taskType != 3){
            task = await getMyTask(2)
            if(task.length > 0){
              onetask = task.filter((x) => x.taskType == $.oneTask.taskType && x.finishCount < x.itemCount && x.taskItem.itemId != $.oneTask.taskItem.itemId)
              if(onetask.length > 0){
                for(let k of onetask || []){
                  if(k.taskType == $.oneTask.taskType){
                    $.itemId = k.taskItem.itemId
                  }
                }
              }
            }
          }
        }while ((($.itemId != '' && $.oneTask.taskType != 3) || ($.itemId == '' && $.oneTask.taskType == 3))  && taskNum > 0)
      }
    }
    $.remainPoints = 0
    await getActivity()
    
    let count = parseInt($.remainPoints/100, 10)
    console.log(`心动值:${$.remainPoints} 可抽奖次数:${count}`)
    for(j=1;count-- && true;j++){
      console.log(`第${j}次`)
      await draw()
      await $.wait(parseInt(Math.random() * 2000 + 2000, 10))
    }
    $.totalPoints = 0
    $.totalBeans = 0
    await getMyRewards()
    console.log(`当前剩余:${$.totalPoints}心动值 累计获得:${$.totalBeans}京豆`)
    if($.bean > 0){
      allMessage += `【京东账号${$.index}】${$.nickName || $.UserName}\n本次运行获得${$.bean}京豆\n`
    }
    if(false){
      $.log($.pin)
      $.log("当前助力:"+friendPin)
      if($.pin){
        $.shareArr.push({"friendPin":$.pin,"count":friendCount,'index':$.index})
      }else if($.index === 1){
        console.log('账号1获取不到[friendPin]退出执行，请重新执行')
        return
      }
      if(toFriend == 1 && $.index !== 1) updatefriend(friendPin,1)
      if($.index === 1) updatefriend(friendPin,0)
    }
    await $.wait(parseInt(Math.random() * 2000 + 5000, 10))
  } catch (e) {
    console.log(e)
  }
}

function updatefriend(id,type) {
  let index = 0
  for(let i in $.shareArr){
    if($.shareArr[i] && $.shareArr[i].friendPin == id){
      index = i
      break
    }
  }
  if(type == 1) $.shareArr[index].count++
  if($.shareArr[index].count >= 3 || type == 0){
    console.log(`助力码[${$.shareArr[index].friendPin}] 已邀请${$.shareArr[index].count}`)
    for(let i in $.shareArr){
      if($.shareArr[i] && $.shareArr[i].count < 3){
        friendPin = $.shareArr[i].friendPin
        console.log(`更新助力码[${friendPin}] 账号${$.shareArr[i].index} 已邀请${$.shareArr[i].count}`)
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
    case 'doTask':
      url = `https://jdjoy.jd.com/module/freshgoods/doTask`;
      body = `code=${configCode}&taskType=${$.oneTask.taskType}&taskId=${$.oneTask.taskId}&eid=${$.eid}&fp=${$.fp}${$.itemId && "&itemId="+$.itemId || ""}&friendPin=${encodeURIComponent(friendPin)}`
      break;
    default:
      console.log(`错误${type}`);
  }
  let myRequest = getPostRequest(url, body, method);
  return new Promise(async resolve => {
    $.post(myRequest, (err, resp, data) => {
      try {
        if (err) {
          if(resp && resp.statusCode && resp.statusCode == 493){
            console.log('此ip已被限制，请过10分钟后再执行脚本\n')
            $.outFlag = true
          }
          console.log(`${$.toStr(err,err)}`)
          console.log(`${type} API请求失败，请检查网路重试`)
        } else {
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
    console.log(`${type} 执行任务异常`);
    console.log(data);
    $.runFalag = false;
  }
  switch (type) {
    case 'doTask':
      if(typeof res == 'object' && res.success && res.success === true){
        toFriend = 1
        let msg = ''
        if(res.data && res.data.rewardBeans > 0) msg += res.data.rewardBeans+'京豆'
        if(res.data && res.data.rewardPoints > 0) msg += res.data.rewardPoints+'心动值'
        console.log(`获得: ${msg || data}`)
      }else if(typeof res == 'object' && res.errorMessage){
        if(res.errorMessage == '任务已完成') $.runFalag = false
        console.log(`${type} ${res.errorMessage || ''}`)
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
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-cn",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    'Cookie': `${ck}`,
    "X-Requested-With": "XMLHttpRequest",
    "User-Agent": `${UA || $.UA}` ,
  }
  if(method == "POST"){
    headers["Content-Type"] = "application/x-www-form-urlencoded"
    headers["Accept"] = "application/json"
  }
  // console.log(headers)
  // console.log(headers.Cookie)
  return  {url: url, method: method, headers: headers, body: body, timeout:30000};
}
function join(venderId) {
  return new Promise(async resolve => {
    $.shopactivityId = ''
    await $.wait(1000)
    await getshopactivityId(venderId)
    $.get(ruhui(`${venderId}`), async (err, resp, data) => {
      try {
        // console.log(data)
        res = $.toObj(data);
        if(typeof res == 'object'){
          if(res.success === true){
            console.log(res.message)
            if(res.result && res.result.giftInfo){
              for(let i of res.result.giftInfo.giftList){
                console.log(`入会获得:${i.discountString}${i.prizeName}${i.secondLineDesc}`)
              }
            }
          }else if(typeof res == 'object' && res.message){
            console.log(`${res.message || ''}`)
          }else{
            console.log(data)
          }
        }else{
          console.log(data)
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function ruhui(functionId) {
  let activityId = ``
  if($.shopactivityId) activityId = `,"activityId":${$.shopactivityId}`
  return {
    url: `https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=bindWithVender&body={"venderId":"${functionId}","shopId":"${functionId}","bindByVerifyCodeFlag":1,"registerExtend":{},"writeChildFlag":0${activityId},"channel":401}&client=H5&clientVersion=9.2.0&uuid=88888`,
    headers: {
      'Content-Type': 'text/plain; Charset=UTF-8',
      'Origin': 'https://api.m.jd.com',
      'Host': 'api.m.jd.com',
      'accept': '*/*',
      'User-Agent': $.UA,
      'content-type': 'application/x-www-form-urlencoded',
      'Referer': `https://shopmember.m.jd.com/shopcard/?venderId=${functionId}&shopId=${functionId}&venderType=5&channel=401`,
      'Cookie': cookie
    }
  }
}
function getshopactivityId(venderId) {
  return new Promise(resolve => {
    $.get(shopactivityId(`${venderId}`), async (err, resp, data) => {
      try {
        data = JSON.parse(data);
        if(data.success == true){
          // console.log($.toStr(data.result))
          console.log(`入会:${data.result.shopMemberCardInfo.venderCardName || ''}`)
          $.shopactivityId = data.result.interestsRuleList && data.result.interestsRuleList[0] && data.result.interestsRuleList[0].interestsInfo && data.result.interestsRuleList[0].interestsInfo.activityId || ''
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function shopactivityId(functionId) {
  return {
    url: `https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=getShopOpenCardInfo&body=%7B%22venderId%22%3A%22${functionId}%22%2C%22channel%22%3A401%7D&client=H5&clientVersion=9.2.0&uuid=88888`,
    headers: {
      'Content-Type': 'text/plain; Charset=UTF-8',
      'Origin': 'https://api.m.jd.com',
      'Host': 'api.m.jd.com',
      'accept': '*/*',
      'User-Agent': $.UA,
      'content-type': 'application/x-www-form-urlencoded',
      'Referer': `https://shopmember.m.jd.com/shopcard/?venderId=${functionId}&shopId=${functionId}&venderType=5&channel=401`,
      'Cookie': cookie
    }
  }
}
function getMyTask(type) {
  return new Promise(resolve => {
    let get = {
      url:`https://jdjoy.jd.com/module/freshgoods/getMyTask?code=${configCode}`,
      headers: {
        "Cookie": cookie,
        "User-Agent": $.UA,
      },
      timeout:30000
    }
    $.get(get, async(err, resp, data) => {
      try {
        if (err) {
          if(resp.statusCode && resp.statusCode == 493){
            console.log('此ip已被限制，请过10分钟后再执行脚本\n')
            $.outFlag = true
          }
          console.log(`${$.toStr(err)}`)
          console.log(`${$.name} cookie API请求失败，请检查网路重试`)
        } else {
          // console.log(data)
          let res = $.toObj(data,data)
          if(typeof res == 'object' && res.success && res.success === true){
            if(res.data){
              if(type == 1){
                $.pin = res.data.pin || ''
                $.taskList = res.data.myTasks || []
              }else if(type == 2){
                resolve(res.data.myTasks || [])
              }
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
        resolve([]);
      }
    })
  })
}
function getMyRewards() {
  return new Promise(resolve => {
    let get = {
      url:`https://jdjoy.jd.com/module/freshgoods/getMyRewards?code=${configCode}&friendPin=${encodeURIComponent(friendPin)}`,
      headers: {
        "Cookie": cookie,
        "User-Agent": $.UA,
      },
      timeout:30000
    }
    $.get(get, async(err, resp, data) => {
      try {
        if (err) {
          if(resp.statusCode && resp.statusCode == 493){
            console.log('此ip已被限制，请过10分钟后再执行脚本\n')
            $.outFlag = true
          }
          console.log(`${$.toStr(err)}`)
          console.log(`${$.name} cookie API请求失败，请检查网路重试`)
        } else {
          // console.log(data)
          let res = $.toObj(data,data)
          if(typeof res == 'object' && res.success && res.success === true){
            if(res.data){
              $.totalBeans = res.data.totalBeans
              $.totalPoints = res.data.totalPoints
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
        resolve([]);
      }
    })
  })
}
function getActivity() {
  return new Promise(resolve => {
    let get = {
      url:`https://jdjoy.jd.com/module/freshgoods/getActivityPage?code=${configCode}&friendPin=${encodeURIComponent(friendPin)}`,
      headers: {
        "Cookie": cookie,
        "User-Agent": $.UA,
      },
      timeout:30000
    }
    $.get(get, async(err, resp, data) => {
      try {
        if (err) {
          if(resp.statusCode && resp.statusCode == 493){
            console.log('此ip已被限制，请过10分钟后再执行脚本\n')
            $.outFlag = true
          }
          console.log(`${$.toStr(err)}`)
          console.log(`${$.name} cookie API请求失败，请检查网路重试`)
        } else {
          // console.log(data)
          let res = $.toObj(data,data)
          if(typeof res == 'object' && res.success && res.success === true){
            if(res.data){
              $.remainPoints = res.data.remainPoints
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
        resolve([]);
      }
    })
  })
}
function draw() {
  return new Promise(resolve => {
    let get = {
      url:`https://jdjoy.jd.com/module/freshgoods/draw?code=${configCode}&eid=${$.eid}&fp=${$.fp}`,
      headers: {
        "Cookie": cookie,
        "User-Agent": $.UA,
      },
      timeout:30000
    }
    $.get(get, async(err, resp, data) => {
      try {
        if (err) {
          if(resp.statusCode && resp.statusCode == 493){
            console.log('此ip已被限制，请过10分钟后再执行脚本\n')
            $.outFlag = true
          }
          console.log(`${$.toStr(err)}`)
          console.log(`${$.name} cookie API请求失败，请检查网路重试`)
        } else {
          // console.log(data)
          let res = $.toObj(data,data)
          if(typeof res == 'object' && res.success && res.success === true){
            if(res.data){
              let msg = ''
              msg = res.data.rewardNum || ''
              if(res.data.rewardType == 1){
                msg += '京豆'
                $.bean += Number(res.data.rewardNum)
              }else if(res.data.rewardType == 4){
                msg += '心动值'
              }else{
                msg = res.data.rewardName || data
              }
              console.log(`抽奖获得:${msg || '空气💨'}`)
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
        resolve([]);
      }
    })
  })
}

function getEid(arr) {
  return new Promise(resolve => {
    const options = {
      url: `https://gia.jd.com/fcf.html?a=${arr.a}`,
      body: `d=${arr.d}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "User-Agent": $.UA
      }
    }
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${turnTableId[i].name} 登录: API查询请求失败 ‼️‼️`)
          throw new Error(err);
        } else {
          if (data.indexOf("*_*") > 0) {
            data = data.split("*_*", 2);
            data = JSON.parse(data[1]);
            $.eid = data.eid
          } else {
            console.log(`京豆api返回数据为空，请检查自身原因`)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
async function getUA(){
  $.UA = `jdapp;iPhone;10.1.4;13.1.2;${randomString(40)};network/wifi;model/iPhone8,1;addressid/2308460611;appBuild/167814;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`
  let arr = await Faker.getBody($.UA,`https://h5.m.jd.com/babelDiy/Zeus/42CC2AdvzUnXheP1CmTXrm7vHYSp/index.html?code=${configCode}`)
  $.fp = arr.fp
  await getEid(arr)
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

