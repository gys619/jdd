/*
Last Modified time: 2021-06-06 21:22:37
宠汪汪积分兑换奖品脚本, 目前脚本只兑换京豆，兑换京豆成功，才会发出通知提示，其他情况不通知。
活动入口：京东APP我的-更多工具-宠汪汪
兑换规则：一个账号一天只能兑换一次京豆。
兑换奖品成功后才会有系统弹窗通知
每日京豆库存会在0:00、8:00、16:00更新。
脚本兼容: Quantumult X, Surge, Loon, JSBox, Node.js
==============Quantumult X==============
[task_local]
#宠汪汪积分兑换奖品
59 7,15,23 * * * jd_joy_reward.js, tag=宠汪汪积分兑换奖品, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jdcww.png, enabled=true

==============Loon==============
[Script]
cron "59 7,15,23 * * *" script-path=jd_joy_reward.js,tag=宠汪汪积分兑换奖品

================Surge===============
宠汪汪积分兑换奖品 = type=cron,cronexp="59 7,15,23 * * *",wake-system=1,timeout=3600,script-path=jd_joy_reward.js

===============小火箭==========
宠汪汪积分兑换奖品 = type=cron,script-path=jd_joy_reward.js, cronexpr="59 7,15,23 * * *", timeout=3600, enable=true
 */
// prettier-ignore
const $ = new Env('宠汪汪积分兑换奖品');
const zooFaker = require('./utils/JDJRValidator_Pure');
// $.get = zooFaker.injectToRequest2($.get.bind($));
// $.post = zooFaker.injectToRequest2($.post.bind($));
let allMessage = '';
let joyRewardName = 0;//是否兑换京豆，默认0不兑换京豆，其中20为兑换20京豆,500为兑换500京豆，0为不兑换京豆.数量有限先到先得
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';
let jdNotify = false;//是否开启静默运行，默认false关闭(即:奖品兑换成功后会发出通知提示)
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
const JD_API_HOST = 'https://jdjoy.jd.com';
Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
!(async () => {
  if (!cookiesArr[0]) {
    $.msg('【京东账号一】宠汪汪积分兑换奖品失败', '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '' || $.UserName;
      await TotalBean();
      console.log(`\n*****开始【京东账号${$.index}】${$.nickName || $.UserName}****\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      // console.log(`本地时间与京东服务器时间差(毫秒)：${await get_diff_time()}`);
      $.validate = '';
      $.validate = await zooFaker.injectToRequest()
      console.log(`脚本开始请求时间 ${(new Date()).Format("yyyy-MM-dd hh:mm:ss | S")}`);
      await joyReward();
    }
  }
  if ($.isNode() && allMessage && $.ctrTemp) {
    await notify.sendNotify(`${$.name}`, `${allMessage}`)
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })

async function joyReward() {
  try {
    if (new Date().getMinutes() === 59) {
      let nowtime = new Date().Format("s.S")
      let starttime = process.env.JOY_STARTTIME ? process.env.JOY_STARTTIME : 60;
      if(nowtime < 59) {
        let sleeptime = (starttime - nowtime) * 1000;
        console.log(`等待时间 ${sleeptime / 1000}`);
        await zooFaker.sleep(sleeptime)
      }
    }
    for (let j = 0; j <= 10; j++) {
      await getExchangeRewards();
      if ($.getExchangeRewardsRes && $.getExchangeRewardsRes.success) {
        // console.log('success', $.getExchangeRewardsRes);
        const data = $.getExchangeRewardsRes.data;
        // const levelSaleInfos = data.levelSaleInfos;
        // const giftSaleInfos = levelSaleInfos.giftSaleInfos;
        // console.log(`当前积分 ${data.coin}\n`);
        // console.log(`宠物等级 ${data.level}\n`);
        let saleInfoId = '', giftValue = '', extInfo = '', leftStock = 0, salePrice = 0;
        let rewardNum = 0;
        if ($.isNode() && process.env.JD_JOY_REWARD_NAME) {
          rewardNum = process.env.JD_JOY_REWARD_NAME * 1;
        } else if ($.getdata('joyRewardName')) {
          if ($.getdata('joyRewardName') * 1 === 1) {
            //兼容之前的BoxJs设置
            rewardNum = 20;
          } else {
            rewardNum = $.getdata('joyRewardName') * 1;
          }
        } else {
          rewardNum = joyRewardName;
        }
        let giftSaleInfos = 'beanConfigs0';
        let time = new Date($.getExchangeRewardsRes['currentTime']).getHours();
        if (time >= 0 && time < 8) {
          giftSaleInfos = 'beanConfigs0';
        }
        if (time >= 8 && time < 16) {
          giftSaleInfos = 'beanConfigs8';
        }
        if (time >= 16 && time < 24) {
          giftSaleInfos = 'beanConfigs16';
        }
        console.log(`\ndebug场次:${giftSaleInfos}\n`)
        for (let item of data[giftSaleInfos]) {
          console.log(`${item['giftName']}当前库存:${item['leftStock']}，id：${item.id}`)
          if (item.giftType === 'jd_bean' && item['giftValue'] === rewardNum) {
            saleInfoId = item.id;
            leftStock = item.leftStock;
            salePrice = item.salePrice;
            giftValue = item.giftValue;
          }
        }
        // console.log(`${giftValue}京豆当前京豆库存:${leftStock}`)
        // console.log(`saleInfoId:${saleInfoId}`)
        // 兼容之前BoxJs兑换设置的数据
        if (rewardNum && (rewardNum === 1 || rewardNum === 20 || rewardNum === 50 || rewardNum === 100 || rewardNum === 500 || rewardNum === 1000)) {
          //开始兑换
          if (salePrice) {
            if (leftStock) {
              if (!saleInfoId) return
              // console.log(`当前账户积分:${data.coin}\n当前京豆库存:${leftStock}\n满足兑换条件,开始为您兑换京豆\n`);
              console.log(`\n您设置的兑换${giftValue}京豆库存充足,开始为您兑换${giftValue}京豆\n`);
              console.log(`脚本开始兑换${rewardNum}京豆时间 ${(new Date()).Format("yyyy-MM-dd hh:mm:ss | S")}`);
              await exchange(saleInfoId, 'pet');
              console.log(`请求兑换API后时间 ${(new Date()).Format("yyyy-MM-dd hh:mm:ss | S")}`);
              if ($.exchangeRes && $.exchangeRes.success) {
                if ($.exchangeRes.errorCode === 'buy_success') {
                  // console.log(`兑换${giftValue}成功,【宠物等级】${data.level}\n【消耗积分】${salePrice}个\n【剩余积分】${data.coin - salePrice}个\n`)
                  console.log(`\n兑换${giftValue}成功,【消耗积分】${salePrice}个\n`)
                  if ($.isNode() && process.env.JD_JOY_REWARD_NOTIFY) {
                    $.ctrTemp = `${process.env.JD_JOY_REWARD_NOTIFY}` === 'false';
                  } else if ($.getdata('jdJoyRewardNotify')) {
                    $.ctrTemp = $.getdata('jdJoyRewardNotify') === 'false';
                  } else {
                    $.ctrTemp = `${jdNotify}` === 'false';
                  }
                  if ($.ctrTemp) {
                    $.msg($.name, ``, `【京东账号${$.index}】${$.nickName}\n【${giftValue}京豆】兑换成功🎉\n【积分详情】消耗积分 ${salePrice}`);
                    if ($.isNode()) {
                      allMessage += `【京东账号${$.index}】 ${$.nickName}\n【${giftValue}京豆】兑换成功🎉\n【积分详情】消耗积分 ${salePrice}${$.index !== cookiesArr.length ? '\n\n' : ''}`
                      // await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}`, `【京东账号${$.index}】 ${$.nickName}\n【${giftValue}京豆】兑换成功\n【宠物等级】${data.level}\n【积分详情】消耗积分 ${salePrice}, 剩余积分 ${data.coin - salePrice}`);
                    }
                    break
                  }
                  // if ($.isNode()) {
                  //   await notify.BarkNotify(`${$.name}`, `【京东账号${$.index}】 ${$.nickName}\n【兑换${giftName}】成功\n【宠物等级】${data.level}\n【消耗积分】${salePrice}分\n【当前剩余】${data.coin - salePrice}积分`);
                  // }
                } else if ($.exchangeRes && $.exchangeRes.errorCode === 'buy_limit') {
                  console.log(`\n兑换${rewardNum}京豆失败，原因：兑换京豆已达上限，请把机会留给更多的小伙伴~\n`)
                  //$.msg($.name, `兑换${giftName}失败`, `【京东账号${$.index}】${$.nickName}\n兑换京豆已达上限\n请把机会留给更多的小伙伴~\n`)
                  break
                } else if ($.exchangeRes && $.exchangeRes.errorCode === 'stock_empty') {
                  console.log(`\n兑换${rewardNum}京豆失败，原因：当前京豆库存为空\n`)
                } else if ($.exchangeRes && $.exchangeRes.errorCode === 'insufficient') {
                  console.log(`\n兑换${rewardNum}京豆失败，原因：当前账号积分不足兑换${giftValue}京豆所需的${salePrice}积分\n`)
                  break
                } else {
                  console.log(`\n兑奖失败:${JSON.stringify($.exchangeRes)}`)
                }
              } else {
                console.log(`\n兑换京豆异常:${JSON.stringify($.exchangeRes)}`)
              }
            } else {
              console.log(`\n按您设置的兑换${rewardNum}京豆失败，原因：京豆库存不足，已抢完，请下一场再兑换\n`);
            }
          } else {
            // console.log(`兑换${rewardNum}京豆失败，原因：您目前只有${data.coin}积分，已不足兑换${giftValue}京豆所需的${salePrice}积分\n`)
            //$.msg($.name, `兑换${giftName}失败`, `【京东账号${$.index}】${$.nickName}\n目前只有${data.coin}积分\n已不足兑换${giftName}所需的${salePrice}积分\n`)
          }
        } else {
          console.log(`\n您设置了不兑换京豆,如需兑换京豆，请去BoxJs处设置或修改joyRewardName代码或设置环境变量 JD_JOY_REWARD_NAME`)
        }
      } else {
        console.log(`${$.name}getExchangeRewards异常,${JSON.stringify($.getExchangeRewardsRes)}`)
      }
    }
  } catch (e) {
    $.logErr(e)
  }
}
function getExchangeRewards() {
  let opt = {
    url: "//jdjoy.jd.com/common/gift/getBeanConfigs?reqSource=h5&invokeKey=JL1VTNRadM68cIMQ",
    method: "GET",
    data: {},
    credentials: "include",
    header: {"content-type": "application/json"}
  }
  return new Promise((resolve) => {
    let lkt = new Date().getTime()
    let lks = $.md5('' + 'JL1VTNRadM68cIMQ' + lkt).toString()
    const option = {
      url: "https:" + taroRequest(opt)['url'] + $.validate,
      headers: {
        "Host": "jdjoy.jd.com",
        "Content-Type": "application/json",
        "Cookie": cookie,
        "reqSource": "h5",
        "Connection": "keep-alive",
        "Accept": "*/*",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        "Referer": "https://jdjoy.jd.com/pet/index",
        "Accept-Language": "zh-cn",
        "Accept-Encoding": "gzip, deflate, br",
        'lkt': lkt,
        'lks': lks
      },
    }
    $.get(option, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          $.getExchangeRewardsRes = {};
          if (safeGet(data)) {
            $.getExchangeRewardsRes = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  })
}
function exchange(saleInfoId, orderSource) {
  let body = {"buyParam":{"orderSource":orderSource,"saleInfoId":saleInfoId},"deviceInfo":{}}
  let opt = {
    "url": "//jdjoy.jd.com/common/gift/new/exchange?reqSource=h5&invokeKey=JL1VTNRadM68cIMQ",
    "data":body,
    "credentials":"include","method":"POST","header":{"content-type":"application/json"}
  }
  return new Promise((resolve) => {
    let lkt = new Date().getTime()
    let lks = $.md5('' + 'JL1VTNRadM68cIMQ' + lkt).toString()
    const option = {
      url: "https:" + taroRequest(opt)['url'] + $.validate,
      body: `${JSON.stringify(body)}`,
      headers: {
        "Host": "jdjoy.jd.com",
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Content-Type": "application/json",
        "Origin": "https://jdjoy.jd.com",
        "reqSource": "h5",
        "Connection": "keep-alive",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        "Referer": "https://jdjoy.jd.com/pet/index",
        "Content-Length": "10",
        "Cookie": cookie,
        'lkt': lkt,
        'lks': lks
      },
    }
    $.post(option, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          console.log(`兑换结果:${data}`);
          $.exchangeRes = {};
          if (safeGet(data)) {
            $.exchangeRes = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
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
function getJDServerTime() {
  return new Promise(resolve => {
    // console.log(Date.now())
    $.get({url: "https://a.jd.com//ajax/queryServerData.html",headers:{
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      }}, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} 获取京东服务器时间失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          $.jdTime = data['serverTime'];
          // console.log(data['serverTime']);
          // console.log(data['serverTime'] - Date.now())
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve($.jdTime);
      }
    })
  })
}
async function get_diff_time() {
  // console.log(`本机时间戳 ${Date.now()}`)
  // console.log(`京东服务器时间戳 ${await getJDServerTime()}`)
  return Date.now() - await getJDServerTime();
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
