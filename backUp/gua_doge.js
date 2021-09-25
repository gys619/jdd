/*
8.4-8.15 七夕情报局🐶 [gua_doge.js]
————————————————
一个号10次助力机会
第一次跑会组队 (组了就不能退 到活动结束
组队规则：
第1个号和第2个号组队 第3和第4组队 (如果中间有一个号已经组队了 自动顺延到下一个号
如果没有组队跑了脚本后需要再跑一次才能做地图任务

入口：[8.4-8.15 七夕情报局🐶 (https://xinrui1-isv.isvjcloud.com/jd-seventh/?channel=zjy)]

============Quantumultx===============
[task_local]
#8.4-8.15 七夕情报局🐶
36 0,10,21 4-15 8 * https://raw.githubusercontent.com/smiek2221/scripts/master/gua_doge.js, tag=8.4-8.15 七夕情报局🐶, enabled=true

================Loon==============
[Script]
cron "36 0,10,21 4-15 8 *" script-path=https://raw.githubusercontent.com/smiek2221/scripts/master/gua_doge.js,tag=8.4-8.15 七夕情报局🐶

===============Surge=================
8.4-8.15 七夕情报局🐶 = type=cron,cronexp="36 0,10,21 4-15 8 *",wake-system=1,timeout=3600,script-path=https://raw.githubusercontent.com/smiek2221/scripts/master/gua_doge.js

============小火箭=========
8.4-8.15 七夕情报局🐶 = type=cron,script-path=https://raw.githubusercontent.com/smiek2221/scripts/master/gua_doge.js, cronexpr="36 0,10,21 4-15 8 *", timeout=3600, enable=true
*/
const $ = new Env('8.4-8.15 七夕情报局🐶');
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
const JD_API_HOST = `https://api.m.jd.com/client.action`;
message = ""
$.Authorization = []
$.inviter = []
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
      "open-url": "https://bean.m.jd.com/"
    });
    return;
  }
  console.log(`入口:\nhttps://xinrui1-isv.isvjcloud.com/jd-seventh/?channel=zjy`)
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    if (cookie) {
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      await getUA()
      $.nickName = '';
      console.log(`\n\n******开始【京东账号${$.index}】${$.UserName}*********\n`);
      await run();
    }
  }
  console.log('\n\n==================================================\n助力')
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    if (cookie) {
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      await getUA()
      $.nickName = '';
      console.log(`\n\n******开始【京东账号${$.index}】${$.UserName}*********\n`);
      $.access_token = ''
      $.token_type = ''
      $.inviteError = 0
      $.inviterFlag = 1
      if($.Authorization[i]){
        $.access_token = $.Authorization[i].access_token
        $.token_type = $.Authorization[i].token_type
        for(let n in $.inviter){
          if($.inviter[n]){
            $.inviterFlag = 0
            $.inviteCeil = 0
            console.log(`${$.UserName}助力${$.inviter[n]}`)
            await taskPost(`invite?inviter_id=${$.inviter[n]}&from_type=1`)
            if($.inviteCeil == 1) break
            if($.inviteCeil == 2) $.inviter[n] = ''
          }
        }
        if($.inviterFlag) console.log('无助力码')
        if($.inviterFlag) return
      }else{
        console.log('获取access_token失败！')
      }
    }
  }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())


async function run() {
  try {
    $.isvObfuscator = $.access_token = $.token_type = $.taskList = $.userInfo = $.resTask = $.homeInfo = ''
    await isvObfuscator()
    if($.isvObfuscator == ''){
      console.log('获取token失败！')
      return
    }
    await userInfo()
    if($.access_token == '' || $.token_type == ''){
      console.log('获取access_token失败！')
      return
    }
    await task('get_user_info')
    if($.userInfo){
      // console.log($.toStr($.userInfo))
      console.log(`当前有${$.userInfo.coins}枝玫瑰🌹 等级${$.userInfo.level} ${$.userInfo.id} ${$.userInfo.is_join_team == 1 && '已组成特工小队' || '未组特工小队'}`)
      $.inviter.push($.userInfo.id)
      if($.userInfo.is_join_team === 0){
        if($.joinTeamId){
          console.log(`特工小队:与${$.joinTeamId}组队`)
          $.resTask = ''
          await taskPost(`map_team_invite?inviter_id=${$.joinTeamId}`)
        }else{
          $.joinTeamId = $.userInfo.id
        }
      }
    }
    await task('home_task_info')
    if($.taskList == ''){
      console.log('获取任务失败！')
      // return
    }else{
      $.Authorization[$.index-1] = {
        "access_token":$.access_token,
        "token_type":$.token_type
      }
      console.log(`每日打卡地图(${$.taskList.light_maps_num}/${$.taskList.maps_num})`)
      if($.taskList.light_maps_num < $.taskList.maps_num){
        $.mapList = ''
        await task('get_map_list')
        if($.mapList != '' && $.mapList.data){
          for (let i = 0; i < $.mapList.data.length; i++) {
            $.oneTask = $.mapList.data[i];
            if($.oneTask.is_light != 0 || $.oneTask.is_join_team != 1) continue;
            console.log(`打卡地图 ${$.oneTask.id}`)
            $.resTask = ''
            await taskPost(`map_light?id=${$.oneTask.id}`)
          }
        }
      }
      console.log(`邀请好友助力(${$.taskList.today_invites_num}/5)`)
      for(let i of $.taskList.invites_list){
        console.log(`助力人员:${i.nickname}`)
      }
      console.log(`浏览并关注店铺(${$.taskList.task_shops_num}/${$.taskList.shops_num})`)
      if($.taskList.task_shops_num < $.taskList.shops_num){
        $.shopList = ''
        await task('get_follow_shop_list')
        if($.shopList != '' && $.shopList.data){
          for (let i = 0; i < $.shopList.data.length; i++) {
            $.oneTask = $.shopList.data[i];
            if($.oneTask.is_follow != 0 && $.oneTask.is_task != 0) continue;
            console.log(`关注店铺 ${$.oneTask.name} ${$.oneTask.is_follow} ${$.oneTask.is_task}`)
            $.resTask = ''
            if($.oneTask.is_follow == 0){
              await taskPost(`follow_shop?id=${$.oneTask.id}`)
            }else if($.oneTask.is_task == 0){
              await taskPost(`view_shop?id=${$.oneTask.id}`)
            }
          }
        }
      }
      console.log(`浏览并加购商品(${$.taskList.task_products_num}/${$.taskList.products_num})`)
      if($.taskList.task_products_num < $.taskList.products_num){
        $.productList = ''
        await task('get_add_product_list')
        if($.productList != '' && $.productList.data){
          for (let i = 0; i < $.productList.data.length; i++) {
            $.oneTask = $.productList.data[i];
            if($.oneTask.is_add != 0 && $.oneTask.is_task != 0) continue;
            console.log(`加购商品 ${$.oneTask.name}`)
            $.resTask = ''
            if($.oneTask.is_add == 0){
              await taskPost(`add_product?id=${$.oneTask.id}`)
            }else if($.oneTask.is_task == 0){
              await taskPost(`view_product?id=${$.oneTask.id}`)
            }
          }
        }
      }
      console.log(`浏览会场(${$.taskList.view_meeting_num}/${$.taskList.meeting_num})`)
      if($.taskList.view_meeting_num < $.taskList.meeting_num){
        $.meetingList = ''
        await task('get_meeting_view_list')
        if($.meetingList != '' && $.meetingList.data){
          for (let i = 0; i < $.meetingList.data.length; i++) {
            $.oneTask = $.meetingList.data[i];
            if($.oneTask.is_view != 0) continue;
            console.log(`浏览会场 ${$.oneTask.name}`)
            $.resTask = ''
            await taskPost(`meeting_view?id=${$.oneTask.id}`)
          }
        }
      }
      console.log(`店铺会员开卡(${$.taskList.open_card_num}/${$.taskList.card_num})`)
      console.log(`说情话(${$.taskList.is_chat && '已完成' || '待完成'})`)
      if($.taskList.is_chat == 0){
        $.resTask = ''
        await taskPost(`chat`)
      }
    }

    do{
      $.levelUpgrade = false
      await task('get_home_info')
      if($.homeInfo && $.homeInfo.is_coins_enough){
        
        $.levelUpgrade = true
        await taskPost(`user_level_upgrade`)
        if($.resTask && $.resTask.letter_info){
          console.log('------------------------------\n情书')
          let msg = ''
          let info = $.resTask.letter_info
          if(info.is_win){
            if(info.type == 1){
              msg += `${info.prize}京豆🥔`
            }else if(info.type == 4){
              msg += `${info.prize.name} 满${info.prize.setting.quota}减${info.prize.setting.discount}`
            }else if(info.type != 0){
              msg += `${$.toStr(info.prize)}`
            }
          }
          console.log(`${$.resTask.letter_info.peroration}\n${$.resTask.letter_info.content}\n收情书获得:${msg || '空气💨'}`)
        }else{
          console.log(`收情书:失败${$.toStr($.resTask)}`)
        }
        $.homeInfo = ''
      }else{
        console.log(`------------------------------\n${$.homeInfo && $.homeInfo.coins || $.userInfo && $.userInfo.coins || 0}枝玫瑰🌹 ${$.homeInfo && '需要'+$.homeInfo.need_coins+'枝玫瑰🌹才能兑换[情书]' || '不满足兑换[情书]'}`)
      }
    }while ($.levelUpgrade)
    await $.wait(parseInt(Math.random() * 1000 + 2000, 10))
  } catch (e) {
    console.log(e)
  }
}

function taskPost(type) {
  return new Promise(async resolve => {
    $.post({
      url: `https://xinrui1-isv.isvjcloud.com/sapi/${type}`,
      headers: {
        'Accept': 'application/json, text/plain, */*',
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Authorization": `${$.token_type} ${$.access_token}`,
        'Content-Type':'application/json;charset=utf-8',
        "Connection": "keep-alive",
        'Cookie': cookie,
        'User-Agent': $.UA,
      }
    }, async (err, resp, data) => {
      try {
        res = $.toObj(data)
        if(typeof res == 'object'){
          if(res.status_code){
            console.log(res.message + "|" +res.status_code)
            if(res.message.indexOf('助力已达') > -1 && res.message.indexOf('上限') > -1){
              $.inviteCeil = 1
            }else if(res.message.indexOf('今日邀请次数') > -1){
              $.inviteCeil = 2
            }
          }else if(type.indexOf('follow_shop?id') == 0 ||
              type.indexOf('view_shop?id') == 0 ||
              type.indexOf('add_product?id') == 0 ||
              type.indexOf('view_product?id') == 0 ||
              type.indexOf('meeting_view?id') == 0 ||
              type.indexOf('chat') == 0 ||
              type.indexOf('map_light') == 0 ||
              type.indexOf('map_team_invite?inviter_id=') == 0
            ){
            $.resTask = res
            if($.resTask && $.resTask.add_coins >= 0){
              if(type.indexOf('map_team_invite?inviter_id=') == 0) $.joinTeamId = ''
              let msg = ''
              if($.resTask.beans){
                msg += `${$.resTask.beans}京豆🥔`
              }
              if($.resTask.add_coins){
                if(msg) msg += '|'
                msg += `${$.resTask.add_coins}枝玫瑰🌹`
              }
              console.log(`获得:${msg || '空气💨'} 当前有${$.resTask.coins || 0}枝玫瑰🌹`)
            }
            await $.wait(parseInt(Math.random() * 1000 + 500, 10))
          }else if(type.indexOf('user_level_upgrade') == 0){
            await $.wait(parseInt(Math.random() * 1000 + 1000, 10))
            $.resTask = res
          }else if(type.indexOf('invite?inviter_id=') == 0){
            console.log(data)
            await $.wait(parseInt(Math.random() * 1000 + 1000, 10))
          }else{
            console.log(data)
          }
        }else{
          if (err) {
            console.log(`${$.toStr(err)}`)
            console.log(`${$.name} userInfo API请求失败，请检查网路重试`)
          }else{
            console.log(data)
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
function task(type) {
  return new Promise(async resolve => {
    $.get({
      url: `https://xinrui1-isv.isvjcloud.com/sapi/${type}`,
      headers: {
        'Accept': 'application/json, text/plain, */*',
        "Accept-Encoding": "gzip, deflate, br",
        'Content-Type':'application/json;charset=utf-8',
        "Accept-Language": "zh-cn",
        "Authorization": `${$.token_type} ${$.access_token}`,
        "Connection": "keep-alive",
        'Cookie': cookie,
        'User-Agent': $.UA,
      }
    }, async (err, resp, data) => {
      try {
        res = $.toObj(data)
        if(typeof res == 'object'){
          if(res.status_code){
            console.log(res.message + "|" +res.status_code)
          }else if(type == 'home_task_info'){
            $.taskList = res
          }else if(type == 'get_user_info'){
            $.userInfo = res
          }else if(type == 'get_follow_shop_list'){
            $.shopList = res
          }else if(type == 'get_add_product_list'){
            $.productList = res
          }else if(type == 'get_meeting_view_list'){
            $.meetingList = res
          }else if(type == 'get_home_info'){
            $.homeInfo = res
          }else if(type == 'get_map_list'){
            $.mapList = res
          // }else if(type == ''){

          }else{
            console.log(data)
          }
        }else{
          if (err) {
            console.log(`${$.toStr(err)}`)
            console.log(`${$.name} userInfo API请求失败，请检查网路重试`)
          }else{
            console.log(data)
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


function userInfo() {
  return new Promise(async resolve => {
    $.post({
      url: `https://xinrui1-isv.isvjcloud.com/sapi/jd-user-info`,
      body:`{"token":"${$.isvObfuscator}","source":"01"}`,
      headers: {
        'Accept': 'application/json, text/plain, */*',
        "Accept-Language": "zh-cn",
        "Authorization": "bearer undefined",
        "Connection": "keep-alive",
        'Content-Type':'application/json;charset=utf-8',
        'Cookie': cookie,
        'User-Agent': $.UA,
      }
    }, async (err, resp, data) => {
      try {
        res = $.toObj(data)
        if(typeof res == 'object'){
          if(res.status_code){
            console.log(res.message + "|" +res.status_code)
          }else{
            if(res.access_token) $.access_token = res.access_token
            if(res.token_type) $.token_type = res.token_type
          }
        }else{
          if (err) {
            console.log(`${$.toStr(err)}`)
            console.log(`${$.name} userInfo API请求失败，请检查网路重试`)
          }else{
            console.log(data)
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

function isvObfuscator() {
  return new Promise(resolve => {
    $.post({
      url: `https://api.m.jd.com/client.action?functionId=isvObfuscator`,
      body: 'area=16_1315_3486_59648&body=%7B%22url%22%3A%22https%3A%5C/%5C/xinrui1-isv.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&build=167764&client=apple&clientVersion=10.0.10&d_brand=apple&d_model=iPhone12%2C1&eid=eidIde27812210seewuOJWEnRZ6u7X5cB/JIQnsLj51RJEe7PtlRG/yNSbeUMf%2BbNdgjQzFxhZsU4m5/PLZOhi87ebHQ0wPc9qd82Bh%2BVoPAhwbhRqFY&isBackground=N&joycious=54&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=ebf4ce8ecbb641054b00c00483b1cee85660d196&osVersion=14.3&partner=apple&rfs=0000&scope=11&screen=828%2A1792&sign=3090b2b2997d877191d0aef083b8d985&st=1628230407213&sv=102&uemps=0-0&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJtgH/sOkA5ELPGCiuUXbsrWcAq%2B0c83LNknkzBXgDXlQ3pq2eMY2enviS/%2BJ6TGkfqBEbO/bQ5%2BKGVjit9RrmNU/D2OwTZ2Bqi/idA2EqDmsJuNS3bvh8kCV4sO4DAHDETkc3g6r8ZeDy72mlQ1hCUss2YaXalY%2BbnkC07OlzyjC8/fuhehBm0g%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=796606e8e181aa5865ec20728a27238b',
      headers: {
        'User-Agent': $.UA,
        'Content-Type':'application/x-www-form-urlencoded',
        'Host':'api.m.jd.com',
        'Cookie': cookie,
      }
    }, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.toStr(err)}`)
          console.log(`${$.name} isvObfuscator API请求失败，请检查网路重试`)
        } else {
          res = $.toObj(data)
          if(typeof res == 'object'){
            if(res.token) $.isvObfuscator = res.token
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data.token);
      }
    })
  })
}




async function getUA(){
  $.UA = `jdapp;iPhone;10.0.10;14.3;${randomString(40)};network/wifi;model/iPhone12,1;addressid/3364463029;appBuild/167764;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`
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

