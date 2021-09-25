/*
Last Modified time: 2021-6-6 10:22:37
活动入口：京东APP我的-更多工具-宠汪汪
最近经常出现给偷好友积分与狗粮失败的情况，故建议cron设置为多次
jd宠汪汪偷好友积分与狗粮,及给好友喂食
偷好友积分上限是20个好友(即获得100积分)，帮好友喂食上限是20个好友(即获得200积分)，偷好友狗粮上限也是20个好友(最多获得120g狗粮)
IOS用户支持京东双账号,NodeJs用户支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
如果开启了给好友喂食功能，建议先凌晨0点运行jd_joy.js脚本获取狗粮后，再运行此脚本(jd_joy_steal.js)可偷好友积分，6点运行可偷好友狗粮
==========Quantumult X==========
[task_local]
#宠汪汪偷好友积分与狗粮
10 0-21/3 * * * jd_joy_steal.js, tag=宠汪汪偷好友积分与狗粮, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jdcww.png, enabled=true

=======Loon========
[Script]
cron "10 0-21/3 * * *" script-path=jd_joy_steal.js,tag=宠汪汪偷好友积分与狗粮

========Surge==========
宠汪汪偷好友积分与狗粮 = type=cron,cronexp="10 0-21/3 * * *",wake-system=1,timeout=3600,script-path=jd_joy_steal.js

=======小火箭=====
宠汪汪偷好友积分与狗粮 = type=cron,script-path=jd_joy_steal.js, cronexpr="10 0-21/3 * * *", timeout=3600, enable=true
*/
const $ = new Env('宠汪汪偷好友积分与狗粮');
const zooFaker = require('./utils/JDJRValidator_Pure');
$.get = zooFaker.injectToRequest2($.get.bind($));
$.post = zooFaker.injectToRequest2($.post.bind($));
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let nowTimes = new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000);
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
let message = '', subTitle = '';

let jdNotify = false;//是否开启静默运行，false关闭静默运行(即通知)，true打开静默运行(即不通知)
let jdJoyHelpFeed = true;//是否给好友喂食，false为不给喂食，true为给好友喂食，默认给好友喂食
let jdJoyStealCoin = true;//是否偷好友积分与狗粮，false为否，true为是，默认是偷
const JD_API_HOST = 'https://jdjoy.jd.com/pet';
//是否给好友喂食
let ctrTemp;
if ($.isNode() && process.env.JOY_HELP_FEED) {
  ctrTemp = `${process.env.JOY_HELP_FEED}` === 'true';
} else if ($.getdata('jdJoyHelpFeed')) {
  ctrTemp = $.getdata('jdJoyHelpFeed') === 'true';
} else {
  ctrTemp = `${jdJoyHelpFeed}` === 'true';
}
//是否偷好友狗粮
let jdJoyStealCoinTemp;
if ($.isNode() && process.env.jdJoyStealCoin) {
  jdJoyStealCoinTemp = `${process.env.jdJoyStealCoin}` === 'true';
} else if ($.getdata('jdJoyStealCoin')) {
  jdJoyStealCoinTemp = $.getdata('jdJoyStealCoin') === 'true';
} else {
  jdJoyStealCoinTemp = `${jdJoyStealCoin}` === 'true';
}
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
      $.HelpFeedFlag = ctrTemp;
      if (!ctrTemp) $.HelpFeedFlag = true
      await TotalBean();
      console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      message = '';
      subTitle = '';
      $.validate = '';
      // const zooFaker = require('./utils/JDJRValidator_Pure');
      // $.validate = await zooFaker.injectToRequest()
      await jdJoySteal();
      await showMsg();
    }
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })
async function jdJoySteal() {
  try {
    $.helpFood = 0;
    $.stealFriendCoin = 0;
    $.stealFood = 0;
    $.stealStatus = null;
    $.helpFeedStatus = null;
    message += `【京东账号${$.index}】${$.nickName}\n`;
    await enterRoom()
    await $.wait(2000)
    await getFriends();//查询是否有好友
    await $.wait(2000)
    await getCoinChanges();//查询喂食好友和偷好友积分是否已达上限
    if ($.getFriendsData && $.getFriendsData.success) {
      if (!$.getFriendsData.datas) {
        console.log(`\n京东返回宠汪汪好友列表数据为空\n`)
        return
      }
      if ($.getFriendsData && $.getFriendsData.datas && $.getFriendsData.datas.length  > 0) {
        const { lastPage } = $.getFriendsData.page;
        // console.log('lastPage', lastPage)
        console.log(`\n共 ${lastPage * 20 - 1} 个好友\n`);
        $.allFriends = [];
        for (let i = 1; i <= new Array(lastPage).fill('').length; i++) {
          if ($.visit_friend >= 100 || $.stealFriendCoin * 1 >= 100) {
            console.log('偷好友积分已达上限(已获得100积分) 跳出\n')
            $.stealFriendCoin = `已达上限(已获得100积分)`;
            break
          }
          console.log(`偷好友积分 开始查询第${i}页好友\n`);
          await getFriends(i);
          $.allFriends = $.getFriendsData.datas;
          if ($.allFriends) await stealFriendCoinFun();
        }
        for (let i = 1; i <= new Array(lastPage).fill('').length; i++) {
          if ($.stealStatus === 'chance_full') {
            console.log('偷好友狗粮已达上限 跳出\n')
            if (!$.stealFood) {
              $.stealFood = `已达上限`;
            }
            break
          }
          if (nowTimes.getHours() < 6 && nowTimes.getHours() >= 0) {
            $.log('未到早餐时间, 暂不能偷好友狗粮\n')
            break
          }
          if (nowTimes.getHours() === 10 ? (nowTimes.getMinutes() > 30) : (nowTimes.getHours() === 11 && nowTimes.getMinutes() < 30)) {
            $.log('未到中餐时间, 暂不能偷好友狗粮\n')
            break
          }
          if ((nowTimes.getHours() >= 15 && nowTimes.getMinutes() > 0) && (nowTimes.getHours() < 17 && nowTimes.getMinutes() <= 59)) {
            $.log('未到晚餐时间, 暂不能偷好友狗粮\n')
            break
          }
          if (nowTimes.getHours() >= 21 && nowTimes.getMinutes() > 0 && nowTimes.getHours() <= 23 && nowTimes.getMinutes() <= 59) {
            $.log('已过晚餐时间, 暂不能偷好友狗粮\n')
            break
          }
          console.log(`偷好友狗粮 开始查询第${i}页好友\n`);
          await getFriends(i);
          $.allFriends = $.getFriendsData.datas;
          if ($.allFriends) await stealFriendsFood();
        }
        for (let i = 1; i <= new Array(lastPage).fill('').length; i++) {
          if ($.help_feed >= 200 || ($.helpFeedStatus && $.helpFeedStatus === 'chance_full')) {
            console.log('帮好友喂食已达上限(已帮喂20个好友获得200积分) 跳出\n');
            $.helpFood = '已达上限(已帮喂20个好友获得200积分)'
            break
          }
          if ($.helpFeedStatus && $.helpFeedStatus === 'food_insufficient') {
            console.log('帮好友喂食失败，狗粮不足10g 跳出\n');
            break
          }
          if ($.help_feed >= 10) $.HelpFeedFlag = ctrTemp;//修复每次运行都会给好友喂食一次的bug
          if (!$.HelpFeedFlag) {
            console.log('您已设置不为好友喂食，现在跳过喂食，如需为好友喂食请在BoxJs打开喂食开关或者更改脚本 jdJoyHelpFeed 处');
            break
          }
          console.log(`帮好友喂食 开始查询第${i}页好友\n`);
          await getFriends(i);
          $.allFriends = $.getFriendsData.datas;
          if ($.allFriends) await helpFriendsFeed();
        }
      }
    } else {
      message += `${$.getFriendsData && $.getFriendsData.errorMessage}\n`;
    }
  } catch (e) {
    $.logErr(e)
  }
}
async function stealFriendsFood() {
  console.log(`开始偷好友狗粮`);
  for (let friends of $.allFriends) {
    const { friendPin, status, stealStatus } = friends;
    $.stealStatus = stealStatus;
    console.log(`stealFriendsFood---好友【${friendPin}】--偷食状态：${stealStatus}\n`);
    // console.log(`stealFriendsFood---好友【${friendPin}】--喂食状态：${status}\n`);
    if (stealStatus === 'can_steal') {
      //可偷狗粮
      //偷好友狗粮
      console.log(`发现好友【${friendPin}】可偷狗粮\n`)
      await enterFriendRoom(friendPin);
      await doubleRandomFood(friendPin);
      const getRandomFoodRes = await getRandomFood(friendPin);
      console.log(`偷好友狗粮结果：${JSON.stringify(getRandomFoodRes)}`)
      if (getRandomFoodRes && getRandomFoodRes.success) {
        if (getRandomFoodRes.errorCode === 'steal_ok') {
          $.stealFood += getRandomFoodRes.data;
        } else if (getRandomFoodRes.errorCode === 'chance_full') {
          console.log('偷好友狗粮已达上限，跳出循环');
          break;
        }
      }
    } else if (stealStatus === 'chance_full') {
      console.log('偷好友狗粮已达上限，跳出循环');
      break;
    }
  }
}
//偷好友积分
async function stealFriendCoinFun() {
  if (jdJoyStealCoinTemp) {
    if ($.visit_friend !== 100) {
      console.log('开始偷好友积分')
      for (let friends of $.allFriends) {
        const { friendPin } = friends;
        if (friendPin === $.UserName) continue
        await stealFriendCoin(friendPin);//领好友积分
        if ($.stealFriendCoin * 1 === 100) {
          console.log(`偷好友积分已达上限${$.stealFriendCoin}个，现跳出循环`)
          break
        }
      }
    } else {
      console.log('偷好友积分已达上限(已获得100积分)')
      $.stealFriendCoin = `已达上限(已获得100积分)`
    }
  }
}
//给好友喂食
async function helpFriendsFeed() {
  if ($.help_feed !== 200) {
    if ($.HelpFeedFlag) {
      console.log(`\n开始给好友喂食`);
      for (let friends of $.allFriends) {
        const { friendPin, status, stealStatus } = friends;
        console.log(`\nhelpFriendsFeed---好友【${friendPin}】--喂食状态：${status}`);
        if (status === 'not_feed') {
          const helpFeedRes = await helpFeed(friendPin);
          // console.log(`帮忙喂食结果--${JSON.stringify(helpFeedRes)}`)
          $.helpFeedStatus = helpFeedRes.errorCode;
          if (helpFeedRes && helpFeedRes.errorCode === 'help_ok' && helpFeedRes.success) {
            console.log(`帮好友[${friendPin}]喂食10g狗粮成功,你获得10积分\n`);
            if (!ctrTemp) {
              $.log('为完成为好友单独喂食一次的任务，故此处进行喂食一次')
              $.HelpFeedFlag = false;
              break
            }
            $.helpFood += 10;
          } else if (helpFeedRes && helpFeedRes.errorCode === 'chance_full') {
            console.log('喂食已达上限,不再喂食\n')
            break
          } else if (helpFeedRes && helpFeedRes.errorCode === 'food_insufficient') {
            console.log('帮好友喂食失败，您的狗粮不足10g\n')
            break
          } else {
            console.log(JSON.stringify(helpFeedRes))
          }
        } else if (status === 'time_error') {
          console.log(`帮好友喂食失败,好友[${friendPin}]的汪汪正在食用\n`)
        }
      }
    } else {
      console.log('您已设置不为好友喂食，现在跳过喂食，如需为好友喂食请在BoxJs打开喂食开关或者更改脚本 jdJoyHelpFeed 处')
    }
  } else {
    console.log('帮好友喂食已达上限(已帮喂20个好友获得200积分)')
    $.helpFood = '已达上限(已帮喂20个好友获得200积分)'
  }
}
function enterRoom() {
  return new Promise(resolve => {
    // const url = `${weAppUrl}/enterRoom/h5?reqSource=weapp&invitePin=&openId=`;
    const host = `draw.jdfcloud.com`;
    const reqSource = 'weapp';
    let opt = {
      url: `//draw.jdfcloud.com/common/pet/enterRoom/h5?invitePin=&openId=&invokeKey=JL1VTNRadM68cIMQ`,
      method: "GET",
      data: {},
      credentials: "include",
      header: {"content-type": "application/json"}
    }
    const url = "https:"+ taroRequest(opt)['url'] + $.validate;
    $.post({...taskPostUrl(url.replace(/reqSource=h5/, 'reqSource=weapp'), host, reqSource),body:'{}'}, (err, resp, data) => {
      try {
        if (err) {
          console.log('\n京东宠汪汪: API查询请求失败 ‼️‼️')
        } else {
          // console.log('JSON.parse(data)', JSON.parse(data))
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
function getFriends(currentPage = '1') {
  return new Promise(resolve => {
    let opt = {
      url: `//draw.jdfcloud.com//common/pet/api/getFriends?itemsPerPage=20&currentPage=${currentPage * 1}&invokeKey=JL1VTNRadM68cIMQ`,
      // url: `//draw.jdfcloud.com/common/pet/getPetTaskConfig?reqSource=h5&invokeKey=JL1VTNRadM68cIMQ`,
      method: "GET",
      data: {},
      credentials: "include",
      header: {"content-type": "application/json"}
    }
    const url = "https:"+ taroRequest(opt)['url'] + $.validate;
    let lkt = new Date().getTime()
    let lks = $.md5('' + 'JL1VTNRadM68cIMQ' + lkt).toString()
    const options = {
      url: url.replace(/reqSource=h5/, 'reqSource=weapp'),
      headers: {
        'Cookie': cookie,
        // 'reqSource': 'h5',
        'Host': 'draw.jdfcloud.com',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json',
        'Referer': 'https://jdjoy.jd.com/pet/index',
        'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        'Accept-Language': 'zh-cn',
        'Accept-Encoding': 'gzip, deflate, br',
        'lkt': lkt,
        'lks': lks
      },
      timeout: 10000
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log('\n京东宠汪汪: API查询请求失败 ‼️‼️')
          throw new Error(err);
        } else {
          // console.log('JSON.parse(data)', JSON.parse(data))
          if (data) {
            $.getFriendsData = JSON.parse(data);
          } else {
            console.log(`京豆api返回数据为空，请检查自身原因`)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}

async function stealFriendCoin(friendPin) {
  // console.log(`进入好友 ${friendPin}的房间`)
  const enterFriendRoomRes = await enterFriendRoom(friendPin);
  if (enterFriendRoomRes) {
    const { friendHomeCoin } =  enterFriendRoomRes.data;
    if (friendHomeCoin > 0) {
      //领取好友积分
      console.log(`好友 ${friendPin}的房间可领取积分${friendHomeCoin}个\n`)
      const getFriendCoinRes = await getFriendCoin(friendPin);
      console.log(`偷好友积分结果：${JSON.stringify(getFriendCoinRes)}\n`)
      if (getFriendCoinRes && getFriendCoinRes.errorCode === 'coin_took_ok') {
        $.stealFriendCoin += getFriendCoinRes.data;
      }
    } else {
      console.log(`好友 ${friendPin}的房间暂无可领取积分\n`)
    }
  }
}
//进入好友房间
function enterFriendRoom(friendPin) {
  console.log(`\nfriendPin:: ${friendPin}\n`);
  return new Promise(async resolve => {
    $.get(taskUrl('enterFriendRoom', (friendPin)), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n京东宠汪汪: API查询请求失败 ‼️‼️')
          console.log(`\n${JSON.stringify(err)}`)
          console.log(`\n${err}\n`)
          throw new Error(err);
        } else {
          // console.log('进入好友房间', JSON.parse(data))
          if (data) {
            data = JSON.parse(data);
            console.log(`可偷狗粮：${data.data.stealFood}`)
            console.log(`可偷积分：${data.data.friendHomeCoin}`)
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
//收集好友金币
function getFriendCoin(friendPin) {
  return new Promise(resolve => {
    $.get(taskUrl('getFriendCoin', friendPin), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n京东宠汪汪: API查询请求失败 ‼️‼️')
          throw new Error(err);
        } else {
          if (data) {
            data = JSON.parse(data);
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
//帮好友喂食
function helpFeed(friendPin) {
  return new Promise(resolve => {
    $.get(taskUrl('helpFeed', friendPin), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n京东宠汪汪: API查询请求失败 ‼️‼️')
          throw new Error(err);
        } else {
          if (data) {
            data = JSON.parse(data);
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
//收集好友狗粮,已实现分享可得双倍狗粮功能
//①分享
function doubleRandomFood(friendPin) {
  return new Promise(resolve => {
    $.get(taskUrl('doubleRandomFood', friendPin), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n京东宠汪汪: API查询请求失败 ‼️‼️')
          throw new Error(err);
        } else {
          // console.log('分享', JSON.parse(data))
          // $.appGetPetTaskConfigRes = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
//②领取双倍狗粮
function getRandomFood(friendPin) {
  return new Promise(resolve => {
    $.get(taskUrl('getRandomFood', friendPin), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n京东宠汪汪: API查询请求失败 ‼️‼️')
          throw new Error(err);
        } else {
          if (data) {
            console.log(`领取双倍狗粮结果--${data}`)
            data = JSON.parse(data);
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
function getCoinChanges() {
  return new Promise(resolve => {
    let opt = {
      url: `//jdjoy.jd.com/common/pet/getCoinChanges?changeDate=${Date.now()}&invokeKey=JL1VTNRadM68cIMQ`,
      // url: "//draw.jdfcloud.com/common/pet/getPetTaskConfig?reqSource=h5",
      method: "GET",
      data: {},
      credentials: "include",
      header: {"content-type": "application/json"}
    }
    const url = "https:"+ taroRequest(opt)['url'] + $.validate;
    let lkt = new Date().getTime()
    let lks = $.md5('' + 'JL1VTNRadM68cIMQ' + lkt).toString()
    const options = {
      url,
      headers: {
        'Cookie': cookie,
        // 'reqSource': 'h5',
        'Host': 'jdjoy.jd.com',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json',
        'Referer': 'https://jdjoy.jd.com/pet/index',
        'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        'Accept-Language': 'zh-cn',
        'Accept-Encoding': 'gzip, deflate, br',
        'lkt': lkt,
        'lks': lks
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log('\n京东宠汪汪: API查询请求失败 ‼️‼️')
          throw new Error(err);
        } else {
          // console.log('getCoinChanges', JSON.parse(data))
          if (data) {
            data = JSON.parse(data);
            if (data.datas && data.datas.length > 0) {
              $.help_feed = 0;
              $.visit_friend = 0;
              for (let item of data.datas) {
                if ($.time('yyyy-MM-dd') === timeFormat(item.createdDate) && item.changeEvent === 'help_feed'){
                  $.help_feed = item.changeCoin;
                }
                if ($.time('yyyy-MM-dd') === timeFormat(item.createdDate) && item.changeEvent === 'visit_friend') {
                  $.visit_friend = item.changeCoin;
                }
              }
              console.log(`$.help_feed给好友喂食获得积分：${$.help_feed}`);
              console.log(`$.visit_friend领取好友积分：${$.visit_friend}`);
            }
          } else {
            console.log(`京豆api返回数据为空，请检查自身原因`)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
function showMsg() {
  return new Promise(resolve => {
    $.stealFood = $.stealFood >= 0 ? `【偷好友狗粮】获取${$.stealFood}g狗粮\n` : `【偷好友狗粮】${$.stealFood}\n`;
    $.stealFriendCoin = $.stealFriendCoin >= 0 ? `【领取好友积分】获得${$.stealFriendCoin}个\n` : `【领取好友积分】${$.stealFriendCoin}\n`;
    $.helpFood = $.helpFood >= 0 ? `【给好友喂食】消耗${$.helpFood}g狗粮,获得积分${$.helpFood}个\n` : `【给好友喂食】${$.helpFood}\n`;
    message += $.stealFriendCoin;
    message += $.stealFood;
    message += $.helpFood;
    let flag;
    if ($.getdata('jdJoyStealNotify')) {
      flag = `${$.getdata('jdJoyStealNotify')}` === 'false';
    } else {
      flag = `${jdNotify}` === 'false';
    }
    if (flag) {
      $.msg($.name, '', message);
    } else {
      $.log(`\n${message}\n`);
    }
    resolve()
  })
}
function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
              return
            }
            if (data['retcode'] === 0) {
              $.nickName = (data['base'] && data['base'].nickname) || $.UserName;
            } else {
              $.nickName = $.UserName
            }
          } else {
            console.log(`京东服务器返回空数据`)
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
function taskPostUrl(url, Host, reqSource) {
  let lkt = new Date().getTime()
  let lks = $.md5('' + 'JL1VTNRadM68cIMQ' + lkt).toString()
  return {
    url: url,
    headers: {
      'Cookie': cookie,
      // 'reqSource': reqSource,
      'Host': Host,
      'Connection': 'keep-alive',
      'Content-Type': 'application/json',
      'Referer': 'https://jdjoy.jd.com/pet/index',
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Accept-Language': 'zh-cn',
      'Accept-Encoding': 'gzip, deflate, br',
      'lkt': lkt,
      'lks': lks
    }
  }
}
function taskUrl(functionId, friendPin) {
  let opt = {
    url: `//jdjoy.jd.com/common/pet/${functionId}?friendPin=${encodeURI(friendPin)}&invokeKey=JL1VTNRadM68cIMQ`,
    // url: `//draw.jdfcloud.com/common/pet/getPetTaskConfig?reqSource=h5`,
    method: "GET",
    data: {},
    credentials: "include",
    header: {"content-type": "application/json"}
  }
  const url = "https:"+ taroRequest(opt)['url'] + $.validate;
  let lkt = new Date().getTime()
  let lks = $.md5('' + 'JL1VTNRadM68cIMQ' + lkt).toString()
  return {
    url,
    headers: {
      'Cookie': cookie,
      // 'reqSource': 'h5',
      'Host': 'jdjoy.jd.com',
      'Connection': 'keep-alive',
      'Content-Type': 'application/json',
      'Referer': 'https://jdjoy.jd.com/pet/index',
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Accept-Language': 'zh-cn',
      'Accept-Encoding': 'gzip, deflate, br',
      'lkt': lkt,
      'lks': lks
    }
  }
}
function timeFormat(time) {
  let date;
  if (time) {
    date = new Date(time)
  } else {
    date = new Date();
  }
  return date.getFullYear() + '-' + ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '-' + (date.getDate() >= 10 ? date.getDate() : '0' + date.getDate());
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
function taroRequest(e) {
  const a = $.isNode() ? require('crypto-js') : CryptoJS;
  const i = "98c14c997fde50cc18bdefecfd48ceb7"
  const o = a.enc.Utf8.parse(i)
  const r = a.enc.Utf8.parse("ea653f4f3c5eda12");
  let _o = {
    "AesEncrypt": function AesEncrypt(e) {
      var n = a.enc.Utf8.parse(e);
      return a.AES.encrypt(n, o, {
        "iv": r,
        "mode": a.mode.CBC,
        "padding": a.pad.Pkcs7
      }).ciphertext.toString()
    },
    "AesDecrypt": function AesDecrypt(e) {
      var n = a.enc.Hex.parse(e)
          , t = a.enc.Base64.stringify(n);
      return a.AES.decrypt(t, o, {
        "iv": r,
        "mode": a.mode.CBC,
        "padding": a.pad.Pkcs7
      }).toString(a.enc.Utf8).toString()
    },
    "Base64Encode": function Base64Encode(e) {
      var n = a.enc.Utf8.parse(e);
      return a.enc.Base64.stringify(n)
    },
    "Base64Decode": function Base64Decode(e) {
      return a.enc.Base64.parse(e).toString(a.enc.Utf8)
    },
    "Md5encode": function Md5encode(e) {
      return a.MD5(e).toString()
    },
    "keyCode": "98c14c997fde50cc18bdefecfd48ceb7"
  }

  const c = function sortByLetter(e, n) {
    if (e instanceof Array) {
      n = n || [];
      for (var t = 0; t < e.length; t++)
        n[t] = sortByLetter(e[t], n[t])
    } else
      !(e instanceof Array) && e instanceof Object ? (n = n || {},
          Object.keys(e).sort().map(function(t) {
            n[t] = sortByLetter(e[t], n[t])
          })) : n = e;
    return n
  }
  const s = function isInWhiteAPI(e) {
    for (var n =  ["gift", "pet"], t = !1, a = 0; a < n.length; a++) {
      var i = n[a];
      e.includes(i) && !t && (t = !0)
    }
    return t
  }

  const d = function addQueryToPath(e, n) {
    if (n && Object.keys(n).length > 0) {
      var t = Object.keys(n).map(function(e) {
        return e + "=" + n[e]
      }).join("&");
      return e.indexOf("?") >= 0 ? e + "&" + t : e + "?" + t
    }
    return e
  }
  const l = function apiConvert(e) {
    for (var n = r, t = 0; t < n.length; t++) {
      var a = n[t];
      e.includes(a) && !e.includes("common/" + a) && (e = e.replace(a, "common/" + a))
    }
    return e
  }

  var n = e
      , t = (n.header,
      n.url);
  t += (t.indexOf("?") > -1 ? "&" : "?") + "reqSource=h5";
  var _a = function getTimeSign(e) {
    var n = e.url
        , t = e.method
        , a = void 0 === t ? "GET" : t
        , i = e.data
        , r = e.header
        , m = void 0 === r ? {} : r
        , p = a.toLowerCase()
        , g = _o.keyCode
        , f = m["content-type"] || m["Content-Type"] || ""
        , h = ""
        , u = +new Date();
    return h = "get" !== p &&
    ("post" !== p || "application/x-www-form-urlencoded" !== f.toLowerCase() && i && Object.keys(i).length) ?
        _o.Md5encode(_o.Base64Encode(_o.AesEncrypt("" + JSON.stringify(c(i)))) + "_" + g + "_" + u) :
        _o.Md5encode("_" + g + "_" + u),
    s(n) && (n = d(n, {
      "lks": h,
      "lkt": u
    }),
        n = l(n)),
        Object.assign(e, {
          "url": n
        })
  }(e = Object.assign(e, {
    "url": t
  }));
  return _a
}
// md5
!function(n){function t(n,t){var r=(65535&n)+(65535&t);return(n>>16)+(t>>16)+(r>>16)<<16|65535&r}function r(n,t){return n<<t|n>>>32-t}function e(n,e,o,u,c,f){return t(r(t(t(e,n),t(u,f)),c),o)}function o(n,t,r,o,u,c,f){return e(t&r|~t&o,n,t,u,c,f)}function u(n,t,r,o,u,c,f){return e(t&o|r&~o,n,t,u,c,f)}function c(n,t,r,o,u,c,f){return e(t^r^o,n,t,u,c,f)}function f(n,t,r,o,u,c,f){return e(r^(t|~o),n,t,u,c,f)}function i(n,r){n[r>>5]|=128<<r%32,n[14+(r+64>>>9<<4)]=r;var e,i,a,d,h,l=1732584193,g=-271733879,v=-1732584194,m=271733878;for(e=0;e<n.length;e+=16){i=l,a=g,d=v,h=m,g=f(g=f(g=f(g=f(g=c(g=c(g=c(g=c(g=u(g=u(g=u(g=u(g=o(g=o(g=o(g=o(g,v=o(v,m=o(m,l=o(l,g,v,m,n[e],7,-680876936),g,v,n[e+1],12,-389564586),l,g,n[e+2],17,606105819),m,l,n[e+3],22,-1044525330),v=o(v,m=o(m,l=o(l,g,v,m,n[e+4],7,-176418897),g,v,n[e+5],12,1200080426),l,g,n[e+6],17,-1473231341),m,l,n[e+7],22,-45705983),v=o(v,m=o(m,l=o(l,g,v,m,n[e+8],7,1770035416),g,v,n[e+9],12,-1958414417),l,g,n[e+10],17,-42063),m,l,n[e+11],22,-1990404162),v=o(v,m=o(m,l=o(l,g,v,m,n[e+12],7,1804603682),g,v,n[e+13],12,-40341101),l,g,n[e+14],17,-1502002290),m,l,n[e+15],22,1236535329),v=u(v,m=u(m,l=u(l,g,v,m,n[e+1],5,-165796510),g,v,n[e+6],9,-1069501632),l,g,n[e+11],14,643717713),m,l,n[e],20,-373897302),v=u(v,m=u(m,l=u(l,g,v,m,n[e+5],5,-701558691),g,v,n[e+10],9,38016083),l,g,n[e+15],14,-660478335),m,l,n[e+4],20,-405537848),v=u(v,m=u(m,l=u(l,g,v,m,n[e+9],5,568446438),g,v,n[e+14],9,-1019803690),l,g,n[e+3],14,-187363961),m,l,n[e+8],20,1163531501),v=u(v,m=u(m,l=u(l,g,v,m,n[e+13],5,-1444681467),g,v,n[e+2],9,-51403784),l,g,n[e+7],14,1735328473),m,l,n[e+12],20,-1926607734),v=c(v,m=c(m,l=c(l,g,v,m,n[e+5],4,-378558),g,v,n[e+8],11,-2022574463),l,g,n[e+11],16,1839030562),m,l,n[e+14],23,-35309556),v=c(v,m=c(m,l=c(l,g,v,m,n[e+1],4,-1530992060),g,v,n[e+4],11,1272893353),l,g,n[e+7],16,-155497632),m,l,n[e+10],23,-1094730640),v=c(v,m=c(m,l=c(l,g,v,m,n[e+13],4,681279174),g,v,n[e],11,-358537222),l,g,n[e+3],16,-722521979),m,l,n[e+6],23,76029189),v=c(v,m=c(m,l=c(l,g,v,m,n[e+9],4,-640364487),g,v,n[e+12],11,-421815835),l,g,n[e+15],16,530742520),m,l,n[e+2],23,-995338651),v=f(v,m=f(m,l=f(l,g,v,m,n[e],6,-198630844),g,v,n[e+7],10,1126891415),l,g,n[e+14],15,-1416354905),m,l,n[e+5],21,-57434055),v=f(v,m=f(m,l=f(l,g,v,m,n[e+12],6,1700485571),g,v,n[e+3],10,-1894986606),l,g,n[e+10],15,-1051523),m,l,n[e+1],21,-2054922799),v=f(v,m=f(m,l=f(l,g,v,m,n[e+8],6,1873313359),g,v,n[e+15],10,-30611744),l,g,n[e+6],15,-1560198380),m,l,n[e+13],21,1309151649),v=f(v,m=f(m,l=f(l,g,v,m,n[e+4],6,-145523070),g,v,n[e+11],10,-1120210379),l,g,n[e+2],15,718787259),m,l,n[e+9],21,-343485551),l=t(l,i),g=t(g,a),v=t(v,d),m=t(m,h)}return[l,g,v,m]}function a(n){var t,r="",e=32*n.length;for(t=0;t<e;t+=8){r+=String.fromCharCode(n[t>>5]>>>t%32&255)}return r}function d(n){var t,r=[];for(r[(n.length>>2)-1]=void 0,t=0;t<r.length;t+=1){r[t]=0}var e=8*n.length;for(t=0;t<e;t+=8){r[t>>5]|=(255&n.charCodeAt(t/8))<<t%32}return r}function h(n){return a(i(d(n),8*n.length))}function l(n,t){var r,e,o=d(n),u=[],c=[];for(u[15]=c[15]=void 0,o.length>16&&(o=i(o,8*n.length)),r=0;r<16;r+=1){u[r]=909522486^o[r],c[r]=1549556828^o[r]}return e=i(u.concat(d(t)),512+8*t.length),a(i(c.concat(e),640))}function g(n){var t,r,e="";for(r=0;r<n.length;r+=1){t=n.charCodeAt(r),e+="0123456789abcdef".charAt(t>>>4&15)+"0123456789abcdef".charAt(15&t)}return e}function v(n){return unescape(encodeURIComponent(n))}function m(n){return h(v(n))}function p(n){return g(m(n))}function s(n,t){return l(v(n),v(t))}function C(n,t){return g(s(n,t))}function A(n,t,r){return t?r?s(t,n):C(t,n):r?m(n):p(n)}$.md5=A}(this);
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
