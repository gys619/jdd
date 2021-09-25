/*
9.1-9.6 联合开卡 [gua_opencard21.js]
新增开卡脚本
一次性脚本

邀请一人有机会获得20豆(有可能没有豆
开14张卡 每张有机会获得5京豆(有可能是空气💨
开完卡获得抽奖1次
关注获得抽奖1次 有机会获得10京豆 (有可能是空气💨
加购获得抽奖1次 有机会获得5京豆 (有可能是空气💨 默认不加购 如需加购请设置环境变量[guaopencard_addSku21]为"true"
抽奖有机会获得京豆(有可能是空气💨

第一个账号助力作者 其他依次助力CK1
第一个CK失效会退出脚本

默认脚本不执行
如需执行脚本请设置环境变量
guaopencard21="true"
————————————————
入口
复制👇：
27.0 9.1-9.6 联合开卡 ￥C5EiV3cGhjjuAG%/
或者打开京东APP 扫描二维码👇：
https://raw.githubusercontent.com/smiek2221/scripts/master/images/gua_opencard21.png
============Quantumultx===============
[task_local]
#9.1-9.6 联合开卡
28 9,22 1-6 9 * https://raw.githubusercontent.com/smiek2221/scripts/master/gua_opencard21.js, tag=9.1-9.6 联合开卡, enabled=true

================Loon==============
[Script]
cron "28 9,22 1-6 9 *" script-path=https://raw.githubusercontent.com/smiek2221/scripts/master/gua_opencard21.js,tag=9.1-9.6 联合开卡

===============Surge=================
9.1-9.6 联合开卡 = type=cron,cronexp="28 9,22 1-6 9 *",wake-system=1,timeout=3600,script-path=https://raw.githubusercontent.com/smiek2221/scripts/master/gua_opencard21.js

============小火箭=========
9.1-9.6 联合开卡 = type=cron,script-path=https://raw.githubusercontent.com/smiek2221/scripts/master/gua_opencard21.js, cronexpr="28 9,22 1-6 9 *", timeout=3600, enable=true
*/
const $ = new Env('9.1-9.6 联合开卡');
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
let guaopencard_addSku = "false"
guaopencard_addSku = $.isNode() ? (process.env.guaopencard_addSku21 ? process.env.guaopencard_addSku21 : `${guaopencard_addSku}`) : ($.getdata('guaopencard_addSku21') ? $.getdata('guaopencard_addSku21') : `${guaopencard_addSku}`);
let guaopencard = "false"
guaopencard = $.isNode() ? (process.env.guaopencard21 ? process.env.guaopencard21 : guaopencard) : ($.getdata('guaopencard21') ? $.getdata('guaopencard21') : guaopencard);
message = ""
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
      "open-url": "https://bean.m.jd.com/"
    });
    return;
  }
  if ($.isNode()) {
    if(guaopencard+"" != "true"){
      console.log('如需执行脚本请设置环境变量[guaopencard21]为"true"')
    }
    if(guaopencard+"" != "true"){
      return
    }
  }
  $.appkey = '51B59BB805903DA4CE513D29EC448375'
  $.userId = '10299171'
  $.actId = 'a8fbe2b74b864b1_901'
  $.inviteNick = '4A55C1C0869C75061D11CDDC9F19631A331A03F763BD4352E7FC99787B30FBD349336DE54E26AA8F2834B248E6398CB7A755DF4FDAE585EC3E1ABE26F3DD3CFFC956D12974FF00A045D8E31A84FE84C18A8357DE96A1F617B8AC4D64BC24B689'
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    if (cookie) {
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      getUA()
      $.nickName = '';
      console.log(`\n\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      await run();
      if(i == 0 && !$.MixNick) return
    }
  }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())

async function run(){
  try{
    $.isvObfuscatorToken = $.MixNick = ''
    $.howManyOpenCard = -1
    await getIsvObfuscatorToken();
    if($.isvObfuscatorToken == ''){
      console.log('获取[token]失败！')
      return
    }
    await setMixNick();
    if($.MixNick == ''){
      console.log('获取[MixNick]失败！')
      return
    }
    await loadUniteOpenCard({"inviteNick": $.inviteNick});
    if($.howManyOpenCard == -1) return
    console.log(`开卡(${$.isOpenCard}/${$.howManyOpenCard})`)
    await shopList();
    if ($.OpenCardList && $.howManyOpenCard - $.isOpenCard > 0) {
      for (let card of $.OpenCardList) {
        if(card.open == false){
          console.log(card.shopTitle)
          let msg = await uniteOpenCardOne(card.userId);
          if(msg === ''){
            await uniteOpenCardStats();
            await join(card.userId)
            await $.wait(parseInt(Math.random() * 1000 + 3000, 10))
            await loadUniteOpenCard({"shopId": card.userId});
          }
          await $.wait(parseInt(Math.random() * 1000 + 3000, 10))
        }
      }
    }
    // if($.isFocusAward == 0){
      // console.log('未关注')
      await followShop();
    // }else console.log('已关注')
    // if($.isCartAward == 0){
      // console.log('未加购')
      if(guaopencard_addSku+"" != "true"){
        console.log('如需加购请设置环境变量[guaopencard_addSku21]为"true"');
      }else await addCart();
      
    // }else console.log('已加购')
    await loadUniteOpenCard();
    console.log(`抽奖次数${$.usedChance}`)
    for(j=1;$.usedChance-- && true;j++){
      console.log(`第${j}次`)
      await draw()
      await $.wait(parseInt(Math.random() * 1000 + 3000, 10))
      if(j >= 20) console.log('抽奖太多次了，请重新执行')
      if(j >= 20) break
      if($.usedChance <= 0) break
    }
    await myAward();
    await missionInviteList();
    if ($.index === 1) {
      if($.MixNick){
        $.inviteNick = $.MixNick;
        console.log(`后面的号都会助力:${$.inviteNick}`)
      }else{
        console.log('账号1获取不到[MixNick]退出执行，请重新执行')
        return
      }
    }
    await $.wait(parseInt(Math.random() * 1000 + 2000, 10))
  }catch(e){
    console.log(e)
  }
}

function myAward() {
  return new Promise(resolve => {
    const options = taskPostUrl("/openCard/myAward", {"actId": $.actId});
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.toStr(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          // console.log(data)
          let res = $.toObj(data);
          if(typeof res == 'object' && res.errorCode == 200){
            res = res.data
            if(res.status == 200){
              if(res.msg || res.data.msg) console.log(`${res.msg || "我的奖品:"+res.data.msg || ''}`)
              console.log(`我的奖品：`)
              let num = 0
              let sum = 0
              for(let i in res.data.list){
                let item = res.data.list[i]
                if(item.awardTitle == '20个京豆') {
                  // console.log(item.shopId)
                  num++;
                }else{
                  if(item.awardTitle.indexOf('个京豆') == -1){
                    console.log(`${item.remark || ''}`)
                  }else{
                    // console.log(`${item.awardTitle || ''}`)
                    sum += parseInt(item.awardTitle.replace('个京豆',''),10)
                  }
                }
              }
              if(num > 0) console.log(`邀请好友(${num}):${num*20}京豆`)
              console.log(`共获得${sum+num*20}京豆`)
            }else if(res.msg){
              console.log(`我的奖品 ${res.msg || ''}`)
            }else{
              console.log(`我的奖品 ${data}`)
            }
          }else if(typeof res == 'object' && res.errorMessage){
            console.log(`我的奖品 ${res.errorMessage || ''}`)
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
function missionInviteList() {
  return new Promise(resolve => {
    const options = taskPostUrl("/openCard/missionInviteList", {"actId": $.actId});
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.toStr(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          // console.log(data)
          let res = $.toObj(data);
          if(typeof res == 'object' && res.errorCode == 200){
            res = res.data
            if(res.status == 200){
              if(res.msg || res.data.msg) console.log(`${res.msg || "我的邀请:"+res.data.msg || ''}`)
              $.log(`=========== 你邀请了:${res.data.total}个`)
            }else if(res.msg){
              console.log(`我的邀请 ${res.msg || ''}`)
            }else{
              console.log(`我的邀请 ${data}`)
            }
          }else if(typeof res == 'object' && res.errorMessage){
            console.log(`我的邀请 ${res.errorMessage || ''}`)
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
function draw() {
  return new Promise(resolve => {
    const options = taskPostUrl("/openCard/draw", {"actId": $.actId});
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.toStr(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          // console.log(data)
          let res = $.toObj(data);
          if(typeof res == 'object' && res.errorCode == 200){
            res = res.data
            if(res.status == 200){
              let msg = res.msg|| res.data.msg.length > 3 && res.data.msg || res.data.jdAwardLog && res.data.jdAwardLog.remark   || '空气💨'
              console.log(`抽奖: ${msg}`)
              if(msg.indexOf('实物') > -1) console.log($.toStr(res))
            }else if(res.msg){
              console.log(`抽奖 ${res.msg || '空气💨'}`)
            }else{
              console.log(`抽奖 ${data}`)
            }
          }else if(typeof res == 'object' && res.errorMessage){
            console.log(`抽奖 ${res.errorMessage || ''}`)
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
function addCart() {
  return new Promise(resolve => {
    const options = taskPostUrl("/openCard/addCart", {"actId": $.actId, "missionType": "addCart"});
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.toStr(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          // console.log(data)
          let res = $.toObj(data);
          if(typeof res == 'object' && res.errorCode == 200){
            res = res.data
            if(res.status == 200){
              if(res.msg || res.data.msg) console.log(`加购:${res.msg || res.data.msg || '空气💨'}`)

            }else if(res.msg){
              console.log(`加购 ${res.msg || '空气💨'}`)
            }else{
              console.log(`加购 ${data}`)
            }
          }else if(typeof res == 'object' && res.errorMessage){
            console.log(`加购 ${res.errorMessage || ''}`)
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
function followShop() {
  return new Promise(resolve => {
    const options = taskPostUrl("/openCard/followShop", {"actId": $.actId, "missionType": "collectShop"});
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.toStr(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          // console.log(data)
          let res = $.toObj(data);
          if(typeof res == 'object' && res.errorCode == 200){
            res = res.data
            if(res.status == 200){
              if(res.msg || res.data.msg) console.log(`关注:${res.msg || res.data.msg || '空气💨'}`)

            }else if(res.msg){
              console.log(`关注 ${res.msg || '空气💨'}`)
            }else{
              console.log(`关注 ${data}`)
            }
          }else if(typeof res == 'object' && res.errorMessage){
            console.log(`关注 ${res.errorMessage || ''}`)
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
function uniteOpenCardStats() {
  return new Promise(resolve => {
    const options = taskPostUrl("/openCard/uniteOpenCardStats", {"actId": $.actId, "pushWay": 1, "missionType": "pv"});
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.toStr(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          // console.log(data)
          let res = $.toObj(data);
          if(typeof res == 'object' && res.errorCode == 200){
            res = res.data
            if(res.status == 200){
              if(res.msg || res.data.msg) console.log(`${res.msg || res.data.msg || ''}`)

            }else if(res.msg){
              console.log(`uniteOpenCardStats ${res.msg || ''}`)
            }else{
              console.log(`uniteOpenCardStats ${data}`)
            }
          }else if(typeof res == 'object' && res.errorMessage){
            console.log(`uniteOpenCardStats ${res.errorMessage || ''}`)
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
function uniteOpenCardOne(shopId) {
  return new Promise(resolve => {
    const options = taskPostUrl("/openCard/uniteOpenCardOne", {"actId": $.actId, "shopId": shopId});
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.toStr(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          // console.log(data)
          let res = $.toObj(data);
          if(typeof res == 'object' && res.errorCode == 200){
            res = res.data
            if(res.status == 200){
              if(res.msg || res.data.msg) console.log(`${res.msg || res.data.msg || ''}`)
              resolve(res.msg || res.data.msg || '')
            }else if(res.msg){
              console.log(`uniteOpenCardOne ${res.msg || ''}`)
            }else{
              console.log(`uniteOpenCardOne ${data}`)
            }
          }else if(typeof res == 'object' && res.errorMessage){
            console.log(`uniteOpenCardOne ${res.errorMessage || ''}`)
          }else{
            console.log(data)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve('');
      }
    })
  })
}
function shopList() {
  return new Promise(resolve => {
    const options = taskPostUrl("/openCard/shopList", {"actId": $.actId});
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.toStr(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          // console.log(data)
          let res = $.toObj(data);
          if(typeof res == 'object' && res.errorCode == 200){
            res = res.data
            if(res.status == 200){
              if(res.msg || res.data.msg) console.log(`${res.msg || res.data.msg || ''}`)
              if(res.data && typeof res.data != 'undefined') $.OpenCardList = res.data || []

            }else if(res.msg){
              console.log(`shopList ${res.msg || ''}`)
            }else{
              console.log(`shopList ${data}`)
            }
          }else if(typeof res == 'object' && res.errorMessage){
            console.log(`shopList ${res.errorMessage || ''}`)
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
function loadUniteOpenCard(body = {}) {
  return new Promise(resolve => {
    const options = taskPostUrl("/openCard/loadUniteOpenCard", {"actId": $.actId, ...body});
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.toStr(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          // console.log(data)
          let res = $.toObj(data);
          if(typeof res == 'object' && res.errorCode == 200){
            res = res.data
            if(res.status == 200){
              if(res.msg || res.data.msg) console.log(`${res.msg || res.data.msg || ''}`)
              if(res.data && res.data.succ === true && typeof res.data.customer.isOpenCard != 'undefined') $.isOpenCard = res.data.customer.isOpenCard || 0
              if(res.data && res.data.succ === true && typeof res.data.customer.isFocusAward != 'undefined') $.isFocusAward = res.data.customer.isFocusAward || 0
              if(res.data && res.data.succ === true && typeof res.data.customer.isCartAward != 'undefined') $.isCartAward = res.data.customer.isCartAward || 0
              if(res.data && res.data.succ === true && typeof res.data.customer.usedChance != 'undefined') $.usedChance = res.data.customer.usedChance || 0
              if(res.data && res.data.succ === true && typeof res.data.jdActivitySetting.howManyOpenCard != 'undefined') $.howManyOpenCard = res.data.jdActivitySetting.howManyOpenCard || 17

            }else if(res.msg){
              console.log(`loadUniteOpenCard ${res.msg || ''}`)
            }else{
              console.log(`loadUniteOpenCard ${data}`)
            }
          }else if(typeof res == 'object' && res.errorMessage){
            console.log(`loadUniteOpenCard ${res.errorMessage || ''}`)
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
function setMixNick() {
  return new Promise(resolve => {
    const options = taskPostUrl("/openCard/setMixNick", {"strTMMixNick":$.isvObfuscatorToken,"source": "01"});
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.toStr(err)}`)
          console.log(`${$.name} setMixNick API请求失败，请检查网路重试`)
        } else {
          // console.log(data)
          let res = $.toObj(data);
          if(typeof res == 'object' && res.errorCode == 200){
            res = res.data
            if(res.status == 200){
              if(res.data && res.data.succ === true && typeof res.data.msg != 'undefined') $.MixNick = res.data.msg || ""
            }else if(res.msg){
              console.log(`setMixNick ${res.msg || ''}`)
            }else{
              console.log(`setMixNick ${data}`)
            }
          }else if(typeof res == 'object' && res.errorMessage){
            console.log(`setMixNick ${res.errorMessage || ''}`)
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
function getshopactivityId(venderId) {
  return new Promise(resolve => {
    $.get(shopactivityId(`${venderId}`), async (err, resp, data) => {
      try {
        let res = $.toObj(data);
        if(res.success == true){
          // console.log($.toStr(res.result))
          // console.log(`入会:${res.result.shopMemberCardInfo.venderCardName || ''}`)
          $.shopactivityId = res.result.interestsRuleList && res.result.interestsRuleList[0] && res.result.interestsRuleList[0].interestsInfo && res.result.interestsRuleList[0].interestsInfo.activityId || ''
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
      'Cookie': cookie
    }
  }
}
function join(venderId) {
  return new Promise(async resolve => {
    $.shopactivityId = ''
    await $.wait(1000)
    await getshopactivityId(venderId)
    $.get(ruhui(`${venderId}`), async (err, resp, data) => {
      try {
        // console.log(data)
        let res = $.toObj(data);
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
      'Cookie': cookie
    }
  }
}
function getIsvObfuscatorToken () {
  return new Promise(resolve => {
    $.post({
      url: `https://api.m.jd.com/client.action?functionId=isvObfuscator`,
      body: 'area=16_1332_42932_43102&body=%7B%22url%22%3A%22https%3A%5C/%5C/jinggengjcq-isv.isvjcloud.com%5C/fronth5%5C/?lng%3D118.144789%26lat%3D24.494393%26sid%3D72eb6b136d16475a514d9c8097ae72fw%26un_area%3D16_1332_42932_43102%23%5C/pages%5C/unitedCard20210815%5C/unitedCard20210815?actId%3D67796e7ec3834aff9fa_815%26pushWay%3Dundefined%26bizExtString%3Dc2hhcmVOaWNrOjRBNTVDMUMwODY5Qzc1MDYxRDExQ0REQzlGMTk2MzFBMzMxQTAzRjc2M0JENDM1MkU3RkM5OTc4N0IzMEZCRDM0OTMzNkRFNTRFMjZBQThGMjgzNEIyNDhFNjM5OENCN0E3NTVERjRGREFFNTg1RUMzRTFBQkUyNkYzREQzQ0ZGQzk1NkQxMjk3NEZGMDBBMDQ1RDhFMzFBODRGRTg0QzE4QTgzNTdERTk2QTFGNjE3QjhBQzRENjRCQzI0QjY4OQ%253D%253D%22%2C%22id%22%3A%22%22%7D&build=167774&client=apple&clientVersion=10.1.0&d_brand=apple&d_model=iPhone12%2C1&eid=eidI0faa812328s1AvGqBpW%2BSouJeXiZIORi9gLxq36FvXhk6SQPmtUFPglIaTIxGXnVzVAwHm/QEwj14SR2vxSgH5tw4rWGdLJtHzSh8bloRLoX8mFY&isBackground=N&joycious=57&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=ebf4ce8ecbb641054b00c00483b1cee85660d196&osVersion=14.3&partner=apple&rfs=0000&scope=11&screen=828%2A1792&sign=62d9cc171d062009f112aabb0876aa29&st=1629007912659&sv=120&uemps=0-1&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJIboQ2/wBVQ9RdTaqwLZhLvDd5KOzOlCYHfIbrLMSFTq87x9FnB0euUOEOhvrlJDrP3DE1ad21cGUvWyBMoPHKiwpASKsio6Z0vEGHKtf1%2B/Ko6B3PdH%2BA%2B1ETmLny0aU0b82Cy/TDIKiXKZdj7IUhg69Y2%2BmmzxFGZo%2BKgCJMof7F5DA%2BtlNug%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=796606e8e181aa5865ec20728a27238b',
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
          let res = $.toObj(data);
          if(typeof res == 'object'){
            if(typeof res.token != 'undefined') $.isvObfuscatorToken = res.token
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

function taskPostUrl(url, t) {
  const b = $.toStr({
    "jsonRpc": "2.0",
    "params": {
      "commonParameter": {
        "appkey": "51B59BB805903DA4CE513D29EC448375",
        "m": "POST",
        "timestamp": Date.now(),
        "userId": $.userId
      },
      "admJson": {
        ...t,
        "method": url,
        "userId": $.userId,
        "buyerNick": $.MixNick || "",
      }
    }
  })
  return {
    url: `https://jinggengjcq-isv.isvjcloud.com/dm/front${url}?mix_nick=${$.MixNick || ""}`,
    body: b,
    headers: {
      "Accept": "application/json",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      "Connection": "keep-alive",
      "Content-Type": "application/json; charset=utf-8",
      "Host": "jinggengjcq-isv.isvjcloud.com",
      "Origin": "https://jinggengjcq-isv.isvjcloud.com",
      "User-Agent": $.UA,
      "X-Requested-With": "XMLHttpRequest"
    }
  }
}

function getUA(){
  $.UA = `jdapp;iPhone;10.1.0;14.3;${randomString(40)};network/wifi;model/iPhone12,1;addressid/4199175193;appBuild/167774;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`
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


