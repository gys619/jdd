/*
#京东零食街

后续添加自动兑换功能 如入会失败 自行去入会
入口 京东 频道 美食馆
零食街自动兑换变量 
export lsjdh="jdAward1" ##兑换5豆
export lsjdh="jdAward2" ##兑换10豆
export lsjdh="jdAward3" ##兑换100豆
export lsjdh="jdAward4" ##兑换牛奶
[task_local]
0 11 * * * jd_lsj.js
*/
const $ = new Env('柠檬京东零食街');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let useInfo = {};

//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;
let newShareCodes = [];
let lsjdh = '';
if (process.env.lsjdh) {
  lsjdh = process.env.lsjdh;
}
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
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
      await star()

    }
  }
  console.log(`\n开始账号内互助\n`);
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
    if(!useInfo[$.UserName]) continue;
    $.canHelp = true;
    for (let j = 0; j < newShareCodes.length && $.canHelp; j++) {
      $.oneCodeInfo = newShareCodes[j];
      if($.UserName === newShareCodes[j].usr || $.oneCodeInfo.max){
        continue;
      }
      console.log(`${$.UserName}去助力${newShareCodes[j].usr}`)
      nick = useInfo[$.UserName];
      await dohelp(newShareCodes[j].code);
      await $.wait(3000)
    }
  }



})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })
async function star() {
await gettoken()

$.log("开始领取首页水滴")
await dotree(1)
await $.wait(3000)
await dotree(2)
await $.wait(3000)
await dotree(3)
await $.wait(3000)
$.log("开始浏览会场")
await doliulan(1)
await $.wait(3000)
await doliulan(2)
await $.wait(3000)
await doliulan(3)
//await gettask()  

$.log("开始浏览会场")
await doshop(1000014803)
await $.wait(3000)
await doshop(10299171)
await $.wait(3000)
await doshop(1000077335)
await $.wait(3000)
await doshop(1000008814)
await $.wait(3000)
await doshop(1000101562)
$.log("开始浏览推荐食品商品")
await doGoods(1)
await $.wait(3000)
await doGoods(2)
await $.wait(3000)
await doGoods(3)
await $.wait(3000)
await doGoods(4)
$.log("开始加购商品")
await doadd(1)
await $.wait(3000)
await doadd(2)
await $.wait(3000)
await doadd(3)
await $.wait(3000)
await doadd(4)
$.log("开始游戏刷分")
await playgame()
$.log("开始兑换")
await duihuan()
}

function gettoken() {
  return new Promise(async (resolve) => {
    let options = {
      url: `https://api.m.jd.com/client.action?functionId=isvObfuscator&clientVersion=10.0.4&build=88641&client=android&d_brand=OPPO&d_model=PCAM00&osVersion=10&screen=2208*1080&partner=oppo&oaid=&openudid=7049442d7e41523&eid=eidAfb0d81231cs3I4yd3GgLRjqcx9qFEcJEmyOMn1BwD8wvLt%2FpM7ENipVIQXuRiDyQ0FYw2aud9%20AhtGqo1Zhp0TsLEgoKZvAWkaXhApgim9hlEyRB&sdkVersion=29&lang=zh_CN&uuid=7049442d7e415232&aid=7049442d7e415232&area=4_48201_54794_0&networkType=4g&wifiBssid=unknown&uts=0f31TVRjBSsqndu4%2FjgUPz6uymy50MQJs2X%2FHz8dwQrKfrmFvPGJYcIhgT3KrbJ2slvZoaufp78QzL4RqQVUgaKH%2Fq7EntlwV7J5l6acE2Wlj2%2Bu6Thwe90cWmtV80fH0yhpOV%2FhYIwvD5N6W1zo3LCVXTcuOw%2BARC%2F6K3bndzn3KzMw%2FpkYzhE2JcXeXiD44r%2BkUMawpn%2Bk7XqSVytdBg%3D%3D&uemps=0-0&st=1624988916642&sign=6a25b389996897b263c70516fc3c71e1&sv=122`,
      body: `body=%7B%22id%22%3A%22%22%2C%22url%22%3A%22https%3A%2F%2Fjinggengjcq-isv.isvjcloud.com%2Fpaoku%2Findex.html%3Fsid%3D75b413510cb227103e928769818a74ew%26un_area%3D4_48201_54794_0%22%7D&`,
      headers: {
        "Host": "api.m.jd.com",
        "User-Agent": "okhttp/3.12.1;jdmall;android;version/10.0.4;build/88641;screen/1080x2208;os/10;network/4g;",
        "Cookie": cookie,
      }
    }

    $.post(options, async (err, resp, data) => {
      try {
        const reust = JSON.parse(data)
        if(reust.errcode == 0){
          token = reust.token
          $.log(token)
          await getnick()
        }else {

          $.log(data)
        }

      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}

function getnick() {
  return new Promise(async (resolve) => {
    let options = {
      url: `https://jinggengjcq-isv.isvjcloud.com//dm/front/foodRunning/setMixNick?open_id=&mix_nick=&bizExtString=&user_id=10299171`,

      body: `{"jsonRpc":"2.0","params":{"commonParameter":{"appkey":"51B59BB805903DA4CE513D29EC448375","m":"POST","sign":"ae549c4ddea76787995f262fcedf9fcf","timestamp":1624988916869,"userId":"10299171"},"admJson":{"source":"01","strTMMixNick":"${token}","method":"/foodRunning/setMixNick","actId":"jd_food_running","buyerNick":"","pushWay":1,"userId":"10299171"}}}`,
      headers: {
        "Origin": "https://jinggengjcq-isv.isvjcloud.com",
        "Content-Type": "application/json; charset=UTF-8",
        "Sec-Fetch-Site": "same-origin",
        "Host": "jinggengjcq-isv.isvjcloud.com",
        "Referer": "https://jinggengjcq-isv.isvjcloud.com/paoku/index.html?sid=75b413510cb227103e928769818a74ew&un_area=4_48201_54794_0",
        "User-Agent": "jdapp;android;10.0.4;10;7303439343432346-7356431353233323;network/4g;model/PCAM00;addressid/4228801336;aid/7049442d7e415232;oaid/;osVer/29;appBuild/88641;partner/oppo;eufv/1;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 10; PCAM00 Build/QKQ1.190918.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045227 Mobile Safari/537.36",
      }}
    $.post(options, async (err, resp, data) => {
      try {

        const reust = JSON.parse(data)

        if(reust.errorCode == 200){
          nick = reust.data.data.msg
          $.log("邀请码: "+nick)
          useInfo[$.UserName] = nick;
          newShareCodes.push({'usr':$.UserName, 'code':nick, 'max':false});
        }else if(reust.errorCode == 500) {

          $.log(reust.errorMessage)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}
function doshop(goodsNumId) {
    return new Promise(async (resolve) => {
let options = {
    url: `https://jinggengjcq-isv.isvjcloud.com/dm/front/foodRunning/complete/mission?open_id=&mix_nick=&bizExtString=&user_id=10299171`,

    body: `{"jsonRpc":"2.0","params":{"commonParameter":{"appkey":"51B59BB805903DA4CE513D29EC448375","m":"POST","sign":"c80a9253cc1558cbf7f54639198ee751","timestamp":1625029740517,"userId":10299171},"admJson":{"goodsNumId":${goodsNumId},"missionType":"viewShop","method":"/foodRunning/complete/mission","actId":"jd_food_running","buyerNick":"${nick}","pushWay":1,"userId":10299171}}}`,
headers: {
"Origin": "https://jinggengjcq-isv.isvjcloud.com",
"Content-Type": "application/json; charset=UTF-8",
"X-Requested-With": "XMLHttpRequest",
"Host": "jinggengjcq-isv.isvjcloud.com",
"Referer": "https://jinggengjcq-isv.isvjcloud.com/paoku/index.html?sid=75b413510cb227103e928769818a74ew&un_area=4_48201_54794_0",
"User-Agent": "jdapp;iPhone;9.5.2;14.3;6898c30638c55142969304c8e2167997fa59eb53;network/4g;ADID/F108E1B6-8E30-477C-BE54-87CF23435488;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone9,2;addressid/390536540;supportBestPay/0;appBuild/167650;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
}}
 $.post(options, async (err, resp, data) => {
            try {

                    const reust = JSON.parse(data)
                 
                    if(reust.errorCode == 200){
                   
                    $.log(`${reust.data.data.remark}\n获得${reust.data.data.sendNum}`)
                    }else if(reust.errorCode == 500) {
                    
                        $.log("今日已领取完毕,请明日再来！"+reust.errorMessage)
                    }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}
function doliulan(goodsNumId) {
  return new Promise(async (resolve) => {
    let options = {
      url: `https://jinggengjcq-isv.isvjcloud.com/dm/front/foodRunning/complete/mission?open_id=&mix_nick=&bizExtString=&user_id=10299171`,

      body: `{"jsonRpc":"2.0","params":{"commonParameter":{"appkey":"51B59BB805903DA4CE513D29EC448375","m":"POST","sign":"c80a9253cc1558cbf7f54639198ee751","timestamp":1625029740517,"userId":10299171},"admJson":{"goodsNumId":${goodsNumId},"missionType":"viewBanner","method":"/foodRunning/complete/mission","actId":"jd_food_running","buyerNick":"${nick}","pushWay":1,"userId":10299171}}}`,
      headers: {
        "Origin": "https://jinggengjcq-isv.isvjcloud.com",
        "Content-Type": "application/json; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        "Host": "jinggengjcq-isv.isvjcloud.com",
        "Referer": "https://jinggengjcq-isv.isvjcloud.com/paoku/index.html?sid=75b413510cb227103e928769818a74ew&un_area=4_48201_54794_0",
        "User-Agent": "jdapp;iPhone;9.5.2;14.3;6898c30638c55142969304c8e2167997fa59eb53;network/4g;ADID/F108E1B6-8E30-477C-BE54-87CF23435488;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone9,2;addressid/390536540;supportBestPay/0;appBuild/167650;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      }}
    $.post(options, async (err, resp, data) => {
      try {

        const reust = JSON.parse(data)

        if(reust.errorCode == 200){

          $.log(`${reust.data.data.remark}\n获得${reust.data.data.sendNum}`)
        }else if(reust.errorCode == 500) {

          $.log("今日已领取完毕,请明日再来！"+reust.errorMessage)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}

function doGoods(goodsNumId) {
  return new Promise(async (resolve) => {
    let options = {
      url: `https://jinggengjcq-isv.isvjcloud.com/dm/front/foodRunning/complete/mission?open_id=&mix_nick=&bizExtString=&user_id=10299171`,

      body: `{"jsonRpc":"2.0","params":{"commonParameter":{"appkey":"51B59BB805903DA4CE513D29EC448375","m":"POST","sign":"c80a9253cc1558cbf7f54639198ee751","timestamp":1625029740517,"userId":10299171},"admJson":{"goodsNumId":${goodsNumId},"missionType":"viewGoods","method":"/foodRunning/complete/mission","actId":"jd_food_running","buyerNick":"${nick}","pushWay":1,"userId":10299171}}}`,
      headers: {
        "Origin": "https://jinggengjcq-isv.isvjcloud.com",
        "Content-Type": "application/json; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        "Host": "jinggengjcq-isv.isvjcloud.com",
        "Referer": "https://jinggengjcq-isv.isvjcloud.com/paoku/index.html?sid=75b413510cb227103e928769818a74ew&un_area=4_48201_54794_0",
        "User-Agent": "jdapp;iPhone;9.5.2;14.3;6898c30638c55142969304c8e2167997fa59eb53;network/4g;ADID/F108E1B6-8E30-477C-BE54-87CF23435488;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone9,2;addressid/390536540;supportBestPay/0;appBuild/167650;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      }}
    $.post(options, async (err, resp, data) => {
      try {

        const reust = JSON.parse(data)

        if(reust.errorCode == 200){

          $.log(`${reust.data.data.remark}\n获得${reust.data.data.sendNum}`)
        }else if(reust.errorCode == 500) {

          $.log("今日已领取完毕,请明日再来！"+reust.errorMessage)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}
function doadd(goodsNumId) {
  return new Promise(async (resolve) => {
    let options = {
      url: `https://jinggengjcq-isv.isvjcloud.com/dm/front/foodRunning/complete/mission?open_id=&mix_nick=&bizExtString=&user_id=10299171`,

      body: `{"jsonRpc":"2.0","params":{"commonParameter":{"appkey":"51B59BB805903DA4CE513D29EC448375","m":"POST","sign":"c80a9253cc1558cbf7f54639198ee751","timestamp":1625029740517,"userId":10299171},"admJson":{"goodsNumId":${goodsNumId},"missionType":"addCart","method":"/foodRunning/complete/mission","actId":"jd_food_running","buyerNick":"${nick}","pushWay":1,"userId":10299171}}}`,
      headers: {
        "Origin": "https://jinggengjcq-isv.isvjcloud.com",
        "Content-Type": "application/json; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        "Host": "jinggengjcq-isv.isvjcloud.com",
        "Referer": "https://jinggengjcq-isv.isvjcloud.com/paoku/index.html?sid=75b413510cb227103e928769818a74ew&un_area=4_48201_54794_0",
        "User-Agent": "jdapp;iPhone;9.5.2;14.3;6898c30638c55142969304c8e2167997fa59eb53;network/4g;ADID/F108E1B6-8E30-477C-BE54-87CF23435488;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone9,2;addressid/390536540;supportBestPay/0;appBuild/167650;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      }}
    $.post(options, async (err, resp, data) => {
      try {

        const reust = JSON.parse(data)

        if(reust.errorCode == 200){

          $.log(`${reust.data.data.remark}\n获得${reust.data.data.sendNum}`)
        }else if(reust.errorCode == 500) {

          $.log("今日已领取完毕,请明日再来！"+reust.errorMessage)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}
function dotree(goodsNumId) {
  return new Promise(async (resolve) => {
    let options = {
      url: `https://jinggengjcq-isv.isvjcloud.com/dm/front/foodRunning/complete/mission?open_id=&mix_nick=&bizExtString=&user_id=10299171`,

      body: `{"jsonRpc":"2.0","params":{"commonParameter":{"appkey":"51B59BB805903DA4CE513D29EC448375","m":"POST","sign":"c80a9253cc1558cbf7f54639198ee751","timestamp":1625029740517,"userId":10299171},"admJson":{"goodsNumId":${goodsNumId},"missionType":"treeCoin","method":"/foodRunning/complete/mission","actId":"jd_food_running","buyerNick":"${nick}","pushWay":1,"userId":10299171}}}`,
      headers: {
        "Origin": "https://jinggengjcq-isv.isvjcloud.com",
        "Content-Type": "application/json; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        "Host": "jinggengjcq-isv.isvjcloud.com",
        "Referer": "https://jinggengjcq-isv.isvjcloud.com/paoku/index.html?sid=75b413510cb227103e928769818a74ew&un_area=4_48201_54794_0",
        "User-Agent": "jdapp;iPhone;9.5.2;14.3;6898c30638c55142969304c8e2167997fa59eb53;network/4g;ADID/F108E1B6-8E30-477C-BE54-87CF23435488;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone9,2;addressid/390536540;supportBestPay/0;appBuild/167650;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      }}
    $.post(options, async (err, resp, data) => {
      try {

        const reust = JSON.parse(data)

        if(reust.errorCode == 200){

          $.log(`${reust.data.data.remark}\n获得${reust.data.data.sendNum}`)
        }else if(reust.errorCode == 500) {

          $.log("今日已领取完毕,请明日再来！"+reust.errorMessage)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}
function dohelp(inviterNick) {
  return new Promise(async (resolve) => {
    let options = {
      url: `https://jinggengjcq-isv.isvjcloud.com/dm/front/foodRunning/complete/mission?open_id=&mix_nick=&bizExtString=&user_id=10299171`,

      body: `{"jsonRpc":"2.0","params":{"commonParameter":{"appkey":"51B59BB805903DA4CE513D29EC448375","m":"POST","sign":"61082e10fc24d61235301cd899e4ec5e","timestamp":1625033802865,"userId":10299171},"admJson":{"inviterNick":"${inviterNick}","missionType":"inviteFriend","method":"/foodRunning/complete/mission","actId":"jd_food_running","buyerNick":"${nick}","pushWay":1,"userId":10299171}}}`,
      headers: {
        "Origin": "https://jinggengjcq-isv.isvjcloud.com",
        "Content-Type": "application/json; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        "Host": "jinggengjcq-isv.isvjcloud.com",
        "Referer": "https://jinggengjcq-isv.isvjcloud.com/paoku/index.html?sid=75b413510cb227103e928769818a74ew&un_area=4_48201_54794_0",
        "User-Agent": "jdapp;iPhone;9.5.2;14.3;6898c30638c55142969304c8e2167997fa59eb53;network/4g;ADID/F108E1B6-8E30-477C-BE54-87CF23435488;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone9,2;addressid/390536540;supportBestPay/0;appBuild/167650;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      }}
    $.post(options, async (err, resp, data) => {
      try {
        console.log(data);
        const reust = JSON.parse(data)
        if(reust.errorCode == 200){
          if(reust.data.data.remark === `好友助力数量已达上限，无法为好友助力！`){
            $.oneCodeInfo.max = true;
          }else{
            $.canHelp = false;
          }
          $.log(`${reust.data.data.remark}`)
        }else if(reust.errorCode == 500) {
          $.log(reust.errorMessage)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}
function dojoinMember(id) {
  return new Promise(async (resolve) => {
    let options = {
      url: `https://jinggengjcq-isv.isvjcloud.com/dm/front/foodRunning/complete/mission?open_id=&mix_nick=&bizExtString=&user_id=10299171`,

      body: `{"jsonRpc":"2.0","params":{"commonParameter":{"appkey":"51B59BB805903DA4CE513D29EC448375","m":"POST","sign":"b0cf8f20b85bca9b2698848ac1c573a5","timestamp":1625034782254,"userId":10299171},"admJson":{"goodsNumId":"${id}","missionType":"joinMember","method":"/foodRunning/complete/mission","actId":"jd_food_running","buyerNick":"${nick}","pushWay":1,"userId":10299171}}}`,
      headers: {
        "Origin": "https://jinggengjcq-isv.isvjcloud.com",
        "Content-Type": "application/json; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        "Host": "jinggengjcq-isv.isvjcloud.com",
        "Referer": "https://jinggengjcq-isv.isvjcloud.com/paoku/index.html?sid=75b413510cb227103e928769818a74ew&un_area=4_48201_54794_0",
        "User-Agent": "jdapp;iPhone;9.5.2;14.3;6898c30638c55142969304c8e2167997fa59eb53;network/4g;ADID/F108E1B6-8E30-477C-BE54-87CF23435488;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone9,2;addressid/390536540;supportBestPay/0;appBuild/167650;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      }}
    $.post(options, async (err, resp, data) => {
      try {

        const reust = JSON.parse(data)

        if(reust.errorCode == 200){
          $.log(`\n如果入会失败 请手动去入会\n`)
          $.log(`${reust.data.data.remark}`)
        }else if(reust.errorCode == 500) {

          $.log(reust.errorMessage)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}
function playgame() {
  return new Promise(async (resolve) => {
    let options = {
      url: `https://jinggengjcq-isv.isvjcloud.com/dm/front/foodRunning/SendCoin?open_id=&mix_nick=&bizExtString=&user_id=10299171`,

      body: `{"jsonRpc":"2.0","params":{"commonParameter":{"appkey":"51B59BB805903DA4CE513D29EC448375","m":"POST","sign":"3a4b12fe8d85b42c2f5defb8d642f043","timestamp":1625035211650,"userId":10299171},"admJson":{"coin":5000,"point":5000,"method":"/foodRunning/SendCoin","actId":"jd_food_running","buyerNick":"${nick}","pushWay":1,"userId":10299171}}}`,
      headers: {
        "Origin": "https://jinggengjcq-isv.isvjcloud.com",
        "Content-Type": "application/json; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        "Host": "jinggengjcq-isv.isvjcloud.com",
        "Referer": "https://jinggengjcq-isv.isvjcloud.com/paoku/index.html?sid=75b413510cb227103e928769818a74ew&un_area=4_48201_54794_0",
        "User-Agent": "jdapp;iPhone;9.5.2;14.3;6898c30638c55142969304c8e2167997fa59eb53;network/4g;ADID/F108E1B6-8E30-477C-BE54-87CF23435488;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone9,2;addressid/390536540;supportBestPay/0;appBuild/167650;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      }}
    $.post(options, async (err, resp, data) => {
      try {

        const reust = JSON.parse(data)

        if(reust.errorCode == 200){
          if(reust.data.data.enoughCoin == true){
            $.log(`刷分成功 刷金币成功${reust.data.data.point} 正在前往领取京豆`)
            await ljd("jdRunningBox1")
            await $.wait(3000)
            await ljd("jdRunningBox2")
            await $.wait(3000)
            await ljd("jdRunningBox3")
          }else if(reust.data.data.enoughCoin == false){
            $.log(`${reust.data.data.msg}`)

          }

        }else if(reust.errorCode == 500) {

          $.log(reust.errorMessage)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}
function ljd(awardId) {
  return new Promise(async (resolve) => {
    let options = {
      url: `https://jinggengjcq-isv.isvjcloud.com/dm/front/foodRunning/OpenBox?open_id=&mix_nick=&bizExtString=&user_id=10299171`,

      body: `{"jsonRpc":"2.0","params":{"commonParameter":{"appkey":"51B59BB805903DA4CE513D29EC448375","m":"POST","sign":"24068838e03a8c538424a146d0c49a27","timestamp":1625035590002,"userId":10299171},"admJson":{"awardId":"${awardId}","method":"/foodRunning/OpenBox","actId":"jd_food_running","buyerNick":"${nick}","pushWay":1,"userId":10299171}}}`,
      headers: {
        "Origin": "https://jinggengjcq-isv.isvjcloud.com",
        "Content-Type": "application/json; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        "Host": "jinggengjcq-isv.isvjcloud.com",
        "Referer": "https://jinggengjcq-isv.isvjcloud.com/paoku/index.html?sid=75b413510cb227103e928769818a74ew&un_area=4_48201_54794_0",
        "User-Agent": "jdapp;iPhone;9.5.2;14.3;6898c30638c55142969304c8e2167997fa59eb53;network/4g;ADID/F108E1B6-8E30-477C-BE54-87CF23435488;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone9,2;addressid/390536540;supportBestPay/0;appBuild/167650;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      }}
    $.post(options, async (err, resp, data) => {
      try {

        const reust = JSON.parse(data)

        if(reust.errorCode == 200){
          jdbean = reust.data.data.msg
          $.log(`${reust.data.data.msg}`)
          await showMsg()

        }else if(reust.errorCode == 500) {

          $.log(reust.errorMessage)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}
function showMsg() {
  return new Promise(resolve => {
    message += `\n${jdbean}\n`;
    $.msg($.name, '', `京东账号${$.index}${$.nickName}\n${message}`);
    resolve()
  })
}
function duihuan() {
  return new Promise(async (resolve) => {
    let options = {
      url: `https://jinggengjcq-isv.isvjcloud.com/dm/front/foodRunning/exchangeGoods?open_id=&mix_nick=&bizExtString=&user_id=10299171`,

      body: `{"jsonRpc":"2.0","params":{"commonParameter":{"appkey":"51B59BB805903DA4CE513D29EC448375","m":"POST","sign":"8bf72ff9ded8cc22cd9ec407165342e7","timestamp":1625093423768,"userId":10299171},"admJson":{"awardId":"${lsjdh}","method":"/foodRunning/exchangeGoods","actId":"jd_food_running","buyerNick":"${nick}","pushWay":1,"userId":10299171}}}`,
      headers: {
        "Origin": "https://jinggengjcq-isv.isvjcloud.com",
        "Content-Type": "application/json; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        "Host": "jinggengjcq-isv.isvjcloud.com",
        "Referer": "https://jinggengjcq-isv.isvjcloud.com/paoku/index.html?lng=106.286832&lat=29.969274&sid=1c98c3013bd5808a5977e0f9d5f5272w&un_area=17_1458_1463_43894",
        "User-Agent": "jdapp;iPhone;9.5.2;14.3;6898c30638c55142969304c8e2167997fa59eb53;network/4g;ADID/F108E1B6-8E30-477C-BE54-87CF23435488;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone9,2;addressid/390536540;supportBestPay/0;appBuild/167650;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      }}
    $.post(options, async (err, resp, data) => {
      try {

        const reust = JSON.parse(data)

        if(reust.errorCode == 200){

          $.log(`${reust.data.data.msg}`)
        }else if(reust.errorCode == 500) {

          $.log("今日已领取完毕,请明日再来！"+reust.errorMessage)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}

async function TotalBean() {
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
            if (data["retcode"] === 13) {
              $.isLogin = false; //cookie过期
              return;
            }
            if (data["retcode"] === 0) {
              $.nickName = (data["base"] && data["base"].nickname) || $.UserName;
            } else {
              $.nickName = $.UserName;
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
