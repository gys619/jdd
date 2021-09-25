/*
8.4-8.12 大牌联合 冰爽一夏 [gua_opencard4.js]
新增开卡脚本
一次性脚本

邀请一人20豆 被邀请也有20豆(有可能没有豆
开2组卡 每组50豆(有可能有抽到空气💨
关注10京豆 (有可能有抽到空气💨
加购5京豆 (默认不加购 如需加购请设置环境变量[guaopencard_addSku4]为"true"

第一个账号助力作者 其他依次助力CK1
第一个CK失效会退出脚本

默认脚本不执行
如需执行脚本请设置环境变量
guaopencard4="true"

入口
https://lzdz1-isv.isvjcloud.com/dingzhi/dz/openCard/activity/832865?activityId=c225ad5922cf4ac8b4a68fd37f486088&shareUuid=8eef88dbbb5e4a11b04f222b78b195c8

============Quantumultx===============
[task_local]
#8.4-8.12 大牌联合 冰爽一夏
36 0,8 4-12 8 * https://raw.githubusercontent.com/smiek2221/scripts/master/gua_opencard4.js, tag=8.4-8.12 大牌联合 冰爽一夏, enabled=true

================Loon==============
[Script]
cron "36 0,8 4-12 8 *" script-path=gua_opencard4.js,tag=8.4-8.12 大牌联合 冰爽一夏

===============Surge=================
8.4-8.12 大牌联合 冰爽一夏 = type=cron,cronexp="36 0,8 4-12 8 *",wake-system=1,timeout=3600,script-path=gua_opencard4.js

============小火箭=========
8.4-8.12 大牌联合 冰爽一夏 = type=cron,script-path=gua_opencard4.js, cronexpr="36 0,8 4-12 8 *", timeout=3600, enable=true
*/
const $ = new Env('8.4-8.12 大牌联合 冰爽一夏');
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
let guaopencard_addSku4 = false
const JD_API_HOST = `https://api.m.jd.com/client.action`;
message = ""
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
      "open-url": "https://bean.m.jd.com/"
    });
    return;
  }
  if ($.isNode()) {
    if (!process.env.guaopencard4 || process.env.guaopencard4 == "false") {
      console.log('如需执行脚本请设置环境变量[guaopencard4]为"true"')
      return
    }
    guaopencard_addSku4 = process.env.guaopencard_addSku4
    if (!process.env.guaopencard_addSku4 || process.env.guaopencard_addSku4 == "false") {
      console.log('如需加购请设置环境变量[guaopencard_addSku4]为"true"')
    }
  }
  $.shareUuid = '8eef88dbbb5e4a11b04f222b78b195c8'
  console.log(`入口:\nhttps://lzdz1-isv.isvjcloud.com/dingzhi/dz/openCard/activity/832865?activityId=c225ad5922cf4ac8b4a68fd37f486088&shareUuid=${$.shareUuid}`)
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    if (cookie) {
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      getUA()
      $.nickName = '';
      console.log(`\n\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
          "open-url": "https://bean.m.jd.com/bean/signIndex.action"
        });
        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      let wxCommonInfoTokenData = await getWxCommonInfoToken();
      $.LZ_TOKEN_KEY = wxCommonInfoTokenData.LZ_TOKEN_KEY
      $.LZ_TOKEN_VALUE = wxCommonInfoTokenData.LZ_TOKEN_VALUE
      $.isvObfuscatorToken = await getIsvObfuscatorToken();
      $.myPingData = await getMyPing()
      if ($.myPingData ==="" || $.myPingData === '400001') {
        $.log("获取活动信息失败！")
        if (i === 0) {
          return
        }
        continue
      }
      await getHtml();
      await adLog();
      await getUserInfo();
      $.attrTouXiang = 'https://img10.360buyimg.com/imgzone/jfs/t1/7020/27/13511/6142/5c5138d8E4df2e764/5a1216a3a5043c5d.png'
      $.actorUuid = '';
      $.actorUuid = await getActorUuid();
      if(!$.actorUuid){
        console.log('获取不到[actorUuid]退出执行，请重新执行')
        if (i === 0) {
          return
        }
        continue
      }
      await drawContent();
      await $.wait(1000)
      let checkOpenCardData = await checkOpenCard();
      $.log("开完卡: " + checkOpenCardData.allOpenCard)
      if (checkOpenCardData && !checkOpenCardData.allOpenCard) {
        let flag = true
        for (let cardList1Element of checkOpenCardData.cardList1) {
          if(cardList1Element.status == 0){
            if(flag) console.log('组1')
            if(flag) flag = false
            await join(cardList1Element.value)
            await $.wait(1000)
            await drawContent();
          }
        }
        flag = true
        for (let cardList1Element of checkOpenCardData.cardList2) {
          if(cardList1Element.status == 0){
            if(flag) console.log('组2')
            if(flag) flag = false
            await join(cardList1Element.value)
            await $.wait(1000)
            await drawContent();
          }
        }
        await $.wait(1000)
        await drawContent();
        checkOpenCardData = await checkOpenCard();
      }
      if(checkOpenCardData && checkOpenCardData.score1 == 1) await startDraw(1)
      if(checkOpenCardData && checkOpenCardData.score2 == 1) await startDraw(2)
      $.log("关注: " + $.followShop)
      if(!$.followShop) await followShop();
      if(!$.followShop) await $.wait(1000)
      $.log("加购: " + $.addSku)
      if(!$.addSku && guaopencard_addSku4) await addSku();
      if(!$.addSku && guaopencard_addSku4) await $.wait(1000)
      await getActorUuid()
      await $.wait(1000)
      await getDrawRecordHasCoupon()
      await $.wait(1000)
      await getShareRecord()
      $.log($.shareUuid)
      if (i === 0) {
        if($.actorUuid){
          $.shareUuid = $.actorUuid;
        }else{
          console.log('账号1获取不到[shareUuid]退出执行，请重新执行')
          return
        }
      }
    }
  }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())


function getDrawRecordHasCoupon() {
  return new Promise(resolve => {
    let body = `activityId=c225ad5922cf4ac8b4a68fd37f486088&actorUuid=${$.actorUuid}&pin=${encodeURIComponent($.myPingData.secretPin)}&num=0&sortSuatus=1`
    $.post(taskPostUrl('/dingzhi/taskact/openCardcommon/getDrawRecordHasCoupon', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          // console.log(data)
          data = JSON.parse(data)
          console.log(`我的奖品：`)
          let num = 0
          for(let i in data.data){
            let item = data.data[i]
            if(item.value == '邀请好友') num++;
            if(item.value != '邀请好友') console.log(`${item.infoType != 10 && item.value +':' || ''}${item.infoName}`)
          }
          if(num > 0) console.log(`邀请好友(${num}):${num*20}京豆`)
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data.data);
      }
    })
  })
}
function getShareRecord() {
  return new Promise(resolve => {
    let body = `activityId=c225ad5922cf4ac8b4a68fd37f486088&actorUuid=${$.actorUuid}&pin=${encodeURIComponent($.myPingData.secretPin)}&num=0&sortSuatus=1`
    $.post(taskPostUrl('/dingzhi/taskact/openCardcommon/getShareRecord', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data)
          $.log(`=========== 你邀请了:${data.data.length}个`)
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data.data);
      }
    })
  })
}

function addSku() {
  return new Promise(resolve => {
    let body = `activityId=c225ad5922cf4ac8b4a68fd37f486088&pin=${encodeURIComponent($.myPingData.secretPin)}&actorUuid=${$.actorUuid}&taskType=2&taskValue=100022672084`
    // https://lzdz1-isv.isvjcloud.com/dingzhi/dz/openCard/saveTask
    $.post(taskPostUrl('/dingzhi/dz/openCard/saveTask', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if(data.errorMessage) console.log(`加购：${data.errorMessage || ''}`)
          if(data.count == 0 && data.result == true){
            let msg = ''
            if(data.data.addBeanNum){
              msg = `${data.data.addBeanNum}京豆`
            }
            console.log(`加购获得：${ msg || '空气💨'}`)
          }else{
            $.log($.toStr(data))
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
    let body = `activityId=c225ad5922cf4ac8b4a68fd37f486088&pin=${encodeURIComponent($.myPingData.secretPin)}&actorUuid=${$.actorUuid}&taskType=23&taskValue=1000002701&shareUuid=${$.shareUuid}`
    // https://lzdz1-isv.isvjcloud.com/dingzhi/dz/openCard/followShop
    $.post(taskPostUrl('/dingzhi/dz/openCard/followShop', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if(data.errorMessage) console.log(`关注：${data.errorMessage || ''}`)
          if(data.count == 0 && data.result == true){
            let msg = ''
            if(data.data.addBeanNum){
              msg = `${data.data.addBeanNum}京豆`
            }
            if(data.data.beanNumMember){
              msg += ` 额外获得:${data.data.beanNumMember}京豆`
            }
            console.log(`关注获得：${ msg || '空气💨'}`)
          }else{
            $.log($.toStr(data))
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
        data = JSON.parse(data);
        if(data.success == true){
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
      'Referer': `https://shopmember.m.jd.com/shopcard/?venderId=${functionId}&shopId=${functionId}&venderType=5&channel=401&returnUrl=https://lzdz1-isv.isvjcloud.com/dingzhi/dz/openCard/activity/832865?activityId=c225ad5922cf4ac8b4a68fd37f486088&shareUuid=${$.shareUuid}`,
      'Cookie': cookie
    }
  }
}
function startDraw(type) {
  return new Promise(resolve => {
    let body = `activityId=c225ad5922cf4ac8b4a68fd37f486088&actorUuid=${$.actorUuid}&pin=${encodeURIComponent($.myPingData.secretPin)}&type=${type}`
    // https://lzdz1-isv.isvjcloud.com/dingzhi/dz/openCard/startDraw
    $.post(taskPostUrl('/dingzhi/dz/openCard/startDraw', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          // $.log($.toStr(data))
          data = $.toObj(data);
          if(data.errorMessage || data.data.errorMessage) console.log(`抽奖：${data.errorMessage || data.data.errorMessage || ''}`)
          if(data.count == 0 && data.result == true){
            console.log(`抽奖获得：${data.data.drawOk && data.data.name || '空气💨'}`)
          }else{
            $.log($.toStr(data))
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data.data);
      }
    })
  })
}
function checkOpenCard() {
  return new Promise(resolve => {
    let body = `activityId=c225ad5922cf4ac8b4a68fd37f486088&pin=${encodeURIComponent($.myPingData.secretPin)}&actorUuid=${$.actorUuid}&shareUuid=${$.shareUuid}`
    $.post(taskPostUrl('/dingzhi/dz/openCard/checkOpenCard', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = $.toObj(data);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data && data.data || '');
      }
    })
  })
}
function join(venderId) {
  return new Promise(async resolve => {
    $.shopactivityId = ''
    await $.wait(1000)
    await getshopactivityId(venderId)
    $.get(ruhui(`${venderId}`), async (err, resp, data) => {
      try {
        // console.log(data)
        data = JSON.parse(data);
        if(data.success == true){
          $.log(data.message)
          if(data.result && data.result.giftInfo){
            for(let i of data.result.giftInfo.giftList){
              console.log(`入会获得:${i.discountString}${i.prizeName}${i.secondLineDesc}`)
            }
          }
        }else if(data.success == false){
          $.log(data.message)
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
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
      'Referer': `https://shopmember.m.jd.com/shopcard/?venderId=${functionId}&shopId=${functionId}&venderType=5&channel=401&returnUrl=https://lzdz1-isv.isvjcloud.com/dingzhi/dz/openCard/activity/832865?activityId=c225ad5922cf4ac8b4a68fd37f486088&shareUuid=${$.shareUuid}`,
      'Cookie': cookie
    }
  }
}


function getWxCommonInfoToken () {
  return new Promise(resolve => {
    $.post({
      url: `https://lzdz1-isv.isvjcloud.com/wxCommonInfo/token`,
      headers: {
        'User-Agent': $.UA,
        'Content-Type':'application/x-www-form-urlencoded',
        'Host':'lzdz1-isv.isvjcloud.com',
        'Origin':'https://lzdz1-isv.isvjcloud.com',
        'Referer':'https://lzdz1-isv.isvjcloud.com/wxCommonInfo/token',
        'Cookie': cookie,
      }
    }, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data.data);
      }
    })
  })
}


function getIsvObfuscatorToken () {
  return new Promise(resolve => {
    $.post({
      url: `https://api.m.jd.com/client.action?functionId=isvObfuscator`,
      body: 'area=16_1315_3486_59648&body=%7B%22url%22%3A%22https%3A%5C/%5C/lzdz1-isv.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&build=167764&client=apple&clientVersion=10.0.10&d_brand=apple&d_model=iPhone12%2C1&eid=eidIeb54812323sf%2BAJEbj5LR0Kf6GUzM9DKXvgCReTpKTRyRwiuxY/uvRHBqebAAKCAXkJFzhWtPj5uoHxNeK3DjTumb%2BrfXOt1w0/dGmOJzfbLuyNo&isBackground=N&joycious=69&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=8a0d1837f803a12eb217fcf5e1f8769cbb3f898d&osVersion=14.3&partner=apple&rfs=0000&scope=11&screen=828%2A1792&sign=26c65494e1732271943c1cec96ced252&st=1628051036003&sv=110&uemps=0-0&uts=0f31TVRjBStX5bTSbfg6pAhO2Wmg5ZK/rd1Af7H%2Bi%2BZ57hF33eg9bjdFRWz2rOIRuVhFImiKmG2vw8nM4uOtRRc9fvdCe13ezfdPVMYhKK7KQSWbxLEJZFKRem1GFn3BfgEQ1DXiPp6fqhwSq6NBqOpTBpN3SC1LQUgnKnZiyXJxrgNb5mAphEpeEzd9qwpoq1BXGls%2Bq8D8EUvPXXr%2B%2BQ%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=796606e8e181aa5865ec20728a27238b',
      headers: {
        'User-Agent': $.UA,
        'Content-Type':'application/x-www-form-urlencoded',
        'Host':'api.m.jd.com',
        'Cookie': cookie,
      }
    }, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data.token);
      }
    })
  })
}

function getMyPing() {
  //await $.wait(20)
  return new Promise(resolve => {
    $.post({
      url: `https://lzdz1-isv.isvjcloud.com/customer/getMyPing`,
      body: `userId=1000002701&token=${$.isvObfuscatorToken}&fromType=APP`,
      headers: {
        'User-Agent': $.UA,
        'Content-Type':'application/x-www-form-urlencoded',
        'Host':'lzdz1-isv.isvjcloud.com',
        'Referer':'https://lzdz1-isv.isvjcloud.com/customer/getMyPing',
        'Cookie': `LZ_TOKEN_KEY=${$.LZ_TOKEN_KEY}; LZ_TOKEN_VALUE=${$.LZ_TOKEN_VALUE};`,
      }
    }, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          let setcookies = resp['headers']['set-cookie'] || resp['headers']['Set-Cookie'] || ''
          let setcookie = ''
          if(setcookies){
            if(typeof setcookies != 'object'){
              setcookie = setcookies.split(',')
            }else setcookie = setcookies
            let lz_jdpin_token = setcookie.filter(row => row.indexOf("lz_jdpin_token") !== -1)[0]
            $.lz_jdpin_token = ''
            if(lz_jdpin_token && lz_jdpin_token.indexOf("lz_jdpin_token=") > -1){
              $.lz_jdpin_token = lz_jdpin_token.split(';') && (lz_jdpin_token.split(';')[0] + ';') || ''
            }
            let LZ_TOKEN_VALUE = setcookie.filter(row => row.indexOf("LZ_TOKEN_VALUE") !== -1)[0]
            if(LZ_TOKEN_VALUE && LZ_TOKEN_VALUE.indexOf("LZ_TOKEN_VALUE=") > -1){
              $.LZ_TOKEN_VALUE = LZ_TOKEN_VALUE.split(';') && (LZ_TOKEN_VALUE.split(';')[0]) || ''
              $.LZ_TOKEN_VALUE = $.LZ_TOKEN_VALUE.replace('LZ_TOKEN_VALUE=','')
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data.data);
      }
    })
  })
}

function getHtml() {
  //await $.wait(20)
  return new Promise(resolve => {
    $.get({
      url: `https://lzdz1-isv.isvjcloud.com/dingzhi/dz/openCard/activity/832865?activityId=c225ad5922cf4ac8b4a68fd37f486088&shareUuid=${$.shareUuid}`,
      headers: {
        'User-Agent': $.UA,
        'Host':'lzdz1-isv.isvjcloud.com',
        'X-Requested-With': 'com.jingdong.app.mall',
        'Cookie': `IsvToken=${$.isvObfuscatorToken}; LZ_TOKEN_KEY=${$.LZ_TOKEN_KEY}; LZ_TOKEN_VALUE=${$.LZ_TOKEN_VALUE}; AUTH_C_USER=${$.secretPin}; ${$.lz_jdpin_token}`,
  }
    }, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

function adLog() {
  return new Promise(resolve => {
    let pageurl = `https://lzdz1-isv.isvjcloud.com/dingzhi/dz/openCard/activity/832865?activityId=c225ad5922cf4ac8b4a68fd37f486088&shareUuid=${$.shareUuid}`
    $.post({
      url: `https://lzdz1-isv.isvjcloud.com/common/accessLogWithAD`,
      body: `venderId=1000002701&code=99&pin=${encodeURIComponent($.myPingData.secretPin)}&activityId=c225ad5922cf4ac8b4a68fd37f486088&pageUrl=${encodeURIComponent(pageurl)}&subType=APP&adSource=null`,
      headers: {
        'User-Agent': $.UA,
        'Host':'lzdz1-isv.isvjcloud.com',
        'Content-Type': 'application/x-www-form-urlencoded; Charset=UTF-8',
        'Cookie': `LZ_TOKEN_KEY=${$.LZ_TOKEN_KEY}; LZ_TOKEN_VALUE=${$.LZ_TOKEN_VALUE}; AUTH_C_USER=${$.myPingData.secretPin}; ${$.lz_jdpin_token}`,
      }
    }, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          //  data = JSON.parse(data);
          let setcookies = resp['headers']['set-cookie'] || resp['headers']['Set-Cookie'] || ''
          let setcookie = ''
          if(setcookies){
            if(typeof setcookies != 'object'){
              setcookie = setcookies.split(',')
            }else setcookie = setcookies
            let LZ_TOKEN_KEY = setcookie.filter(row => row.indexOf("LZ_TOKEN_KEY") !== -1)[0]
            if(LZ_TOKEN_KEY && LZ_TOKEN_KEY.indexOf("LZ_TOKEN_KEY=") > -1){
              $.LZ_TOKEN_KEY = LZ_TOKEN_KEY.split(';') && (LZ_TOKEN_KEY.split(';')[0]) || ''
              $.LZ_TOKEN_KEY = $.LZ_TOKEN_KEY.replace('LZ_TOKEN_KEY=','')
            }
            let LZ_TOKEN_VALUE = setcookie.filter(row => row.indexOf("LZ_TOKEN_VALUE") !== -1)[0]
            if(LZ_TOKEN_VALUE && LZ_TOKEN_VALUE.indexOf("LZ_TOKEN_VALUE=") > -1){
              $.LZ_TOKEN_VALUE = LZ_TOKEN_VALUE.split(';') && (LZ_TOKEN_VALUE.split(';')[0]) || ''
              $.LZ_TOKEN_VALUE = $.LZ_TOKEN_VALUE.replace('LZ_TOKEN_VALUE=','')
            }
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

function drawContent() {
  return new Promise(resolve => {
    $.post({
      url: `https://lzdz1-isv.isvjcloud.com/dingzhi/taskact/openCardcommon/drawContent`,
      body: `activityId=c225ad5922cf4ac8b4a68fd37f486088&pin=${encodeURIComponent($.myPingData.secretPin)}`,
      headers: {
        'User-Agent': $.UA,
        'Host':'lzdz1-isv.isvjcloud.com',
        'Content-Type': 'application/x-www-form-urlencoded; Charset=UTF-8',
        'Referer':`https://lzdz1-isv.isvjcloud.com/dingzhi/dz/openCard/activity/832865?activityId=c225ad5922cf4ac8b4a68fd37f486088&shareUuid=${$.shareUuid}`,
        'Cookie': `LZ_TOKEN_KEY=${$.LZ_TOKEN_KEY}; LZ_TOKEN_VALUE=${$.LZ_TOKEN_VALUE}; AUTH_C_USER=${$.myPingData.secretPin}; ${$.lz_jdpin_token}`,
      }
    }, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function getUserInfo() {
  return new Promise(resolve => {
    $.post({
      url: `https://lzdz1-isv.isvjcloud.com/wxActionCommon/getUserInfo`,
      body: `pin=${encodeURIComponent($.myPingData.secretPin)}`,
      headers: {
        'User-Agent': $.UA,
        'Host':'lzdz1-isv.isvjcloud.com',
        'Content-Type': 'application/x-www-form-urlencoded; Charset=UTF-8',
        'Referer':`https://lzdz1-isv.isvjcloud.com/dingzhi/dz/openCard/activity/832865?activityId=c225ad5922cf4ac8b4a68fd37f486088&shareUuid=${$.shareUuid}`,
        'Cookie': `LZ_TOKEN_KEY=${$.LZ_TOKEN_KEY}; LZ_TOKEN_VALUE=${$.LZ_TOKEN_VALUE}; AUTH_C_USER=${$.myPingData.secretPin}; ${$.lz_jdpin_token}`,
      }
    }, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if(data.count === 0 && data.result){
            $.attrTouXiang = data.data.yunMidImageUrl
            != data.data.yunMidImageUrl ? $.attrTouXiang = data.data.yunMidImageUrl : $.attrTouXiang = "https://img10.360buyimg.com/imgzone/jfs/t1/7020/27/13511/6142/5c5138d8E4df2e764/5a1216a3a5043c5d.png"
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

function getActorUuid() {
  return new Promise(resolve => {
    $.post({
      url: `https://lzdz1-isv.isvjcloud.com/dingzhi/dz/openCard/activityContent`,
      body: `activityId=c225ad5922cf4ac8b4a68fd37f486088&pin=${encodeURIComponent($.myPingData.secretPin)}&pinImg=${encodeURIComponent($.attrTouXiang)}&nick=${encodeURIComponent($.myPingData.nickname)}&cjyxPin=&cjhyPin=&shareUuid=${$.shareUuid}`,
      headers: {
        'User-Agent': $.UA,
        'Host':'lzdz1-isv.isvjcloud.com',
        'Content-Type': 'application/x-www-form-urlencoded; Charset=UTF-8',
        "Referer": `https://lzdz1-isv.isvjcloud.com/dingzhi/dz/openCard/activity/832865?activityId=c225ad5922cf4ac8b4a68fd37f486088&shareUuid=${$.shareUuid}`,
        'Cookie': `LZ_TOKEN_KEY=${$.LZ_TOKEN_KEY}; LZ_TOKEN_VALUE=${$.LZ_TOKEN_VALUE}; AUTH_C_USER=${$.myPingData.secretPin}; ${$.lz_jdpin_token}`,
      }
    }, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          // console.log(data)
          data = JSON.parse(data);
          $.followShop = data.data.followShop.allStatus
          $.addSku = data.data.addSku.allStatus
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data.data.actorUuid);
      }
    })
  })
}


function taskPostUrl(url, body) {
  return {
    url: `https://lzdz1-isv.isvjcloud.com${url}`,
    body: body,
    headers: {
      "Host": "lzdz1-isv.isvjcloud.com",
      "Accept": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "Accept-Language": "zh-cn",
      "Accept-Encoding": "gzip, deflate, br",
      "Content-Type": "application/x-www-form-urlencoded",
      "Origin": "https://lzdz1-isv.isvjcloud.com",
      "Connection": "keep-alive",
      "Referer": `https://lzdz1-isv.isvjcloud.com/dingzhi/dz/openCard/activity/832865?activityId=c225ad5922cf4ac8b4a68fd37f486088&shareUuid=${$.shareUuid}`,
      "User-Agent": $.UA ,
      'Cookie': `${cookie} LZ_TOKEN_KEY=${$.LZ_TOKEN_KEY}; LZ_TOKEN_VALUE=${$.LZ_TOKEN_VALUE}; AUTH_C_USER=${$.myPingData.secretPin}; ${$.lz_jdpin_token}`,
    }
  }
}

function getUA(){
  $.UA = `jdapp;iPhone;10.0.10;14.3;${randomString(40)};network/wifi;model/iPhone12,1;addressid/4199175193;appBuild/167741;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`
}
function randomString(e) {
  e = e || 32;
  let t = "abcdefhijkmnprstwxyz2345678", a = t.length, n = "";
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


