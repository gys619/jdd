/*


 [task_local]
 #柠檬东东泡泡大战
 1 0 * * * https://raw.githubusercontent.com/panghu999/panghu/master/jd_ppdz.js, tag=柠檬东东泡泡大战, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true
*/

const $ = new Env('柠檬东东泡泡大战');
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';

const randomCount = $.isNode() ? 20 : 5;
const notify = $.isNode() ? require('./sendNotify') : '';
let merge = {}
let codeList = []
const logs =0;
let allMessage = '';
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
!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
            "open-url": "https://bean.m.jd.com/"
        });
        return;
    }

    for (let i = 0; i < cookiesArr.length; i++) {
        cookie = cookiesArr[i];
        if (cookie) {
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = '';
            $.beans = 0
            message = ''

           //await TotalBean();
            console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
            if (!$.isLogin) {
                $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
                    "open-url": "https://bean.m.jd.com/bean/signIndex.action"
                });

                if ($.isNode()) {
                    await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                }
                continue
            }

     await star()
     await rank()
        }
    }

if ($.isNode() && allMessage) {
        await notify.sendNotify(`${$.name}`, `${allMessage}` )
    }
})()
    .catch((e) => {
        $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
        $.done();
  })

async function star(){
for(let i = 0; i < 5; i ++){
no1 = i;

await fx5()
await shop()
await shop1()
await shop2()
await shop3()
}
} 


function fx5(timeout = 0) {
message = `【京东账号${$.index}】${$.nickName}\n`;
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://api.m.jd.com/api?body=&clientVersion=8.8.8&uuid=86763302131156838bc92874434&client=H5&appid=zuma-web&functionId=activity_shareTask`,
      headers: {
        "Host": "api.m.jd.com",
        "Origin": "https://jingqih5.m.jd.com",
        "Cookie": cookie,
        "User-Agent": "jdapp;iPhone;9.5.2;14.3;6898c30638c55142969304c8e2167997fa59eb53;network/4g;ADID/F108E1B6-8E30-477C-BE54-87CF23435488;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone9,2;addressid/4585826605;supportBestPay/0;appBuild/167650;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      }
       
      }

      $.get(url, async (err, resp, data) => {
        try {
          //console.log(url.url)
          //console.log(data)
          data = JSON.parse(data);
          console.log(data)
          //await notify.sendNotify(`${$.name} - 柠檬jxgc`, `京东账号${$.index} ${$.nickName}`+"电动车制造："+data)
         if (data.code === 0) {
            // console.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
          //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆:2000步\n"+data.msg)
            } else {
               //console.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
               //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆2000步\n步数不足或今日你已经兑换")
            }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

function shop(timeout = 0) {

  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://api.m.jd.com/api?body={"shopId":"1000000127"}&clientVersion=8.8.8&uuid=86763302131156838bc92874435&client=H5&appid=zuma-web&functionId=activity_followShop`,
      headers: {
        "Host": "api.m.jd.com",
        "Origin": "https://jingqih5.m.jd.com",
        "Cookie": cookie,
        "User-Agent": "jdapp;iPhone;9.5.2;14.3;6898c30638c55142969304c8e2167997fa59eb53;network/4g;ADID/F108E1B6-8E30-477C-BE54-87CF23435488;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone9,2;addressid/4585826605;supportBestPay/0;appBuild/167650;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      }
       
      }

      $.get(url, async (err, resp, data) => {
        try {
          //console.log(url.url)
          //console.log(data)
          data  = JSON.parse(data);
        // url = data.taskInfo.allValues.value
          console.log(url)
          //await notify.sendNotify(`${$.name} - 柠檬jxgc`, `京东账号${$.index} ${$.nickName}`+"电动车制造："+data)
         if (data.code === 0) {
            // console.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
          //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆:2000步\n"+data.msg)
            } else {
               //console.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
               //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆2000步\n步数不足或今日你已经兑换")
            }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}
function shop1(timeout = 0) {

  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://api.m.jd.com/api?body={"hallId":"https://pro.m.jd.com/mall/active/Y9FVe619hMoajzqpxky1CQQJAkk/index.html?babelChannel=ttt10"}&clientVersion=8.8.8&uuid=86763302131156838bc92874434&client=H5&appid=zuma-web&functionId=activity_stroll`,
      headers: {
        "Host": "api.m.jd.com",
        "Origin": "https://jingqih5.m.jd.com",
        "Cookie": cookie,
        "User-Agent": "jdapp;iPhone;9.5.2;14.3;6898c30638c55142969304c8e2167997fa59eb53;network/4g;ADID/F108E1B6-8E30-477C-BE54-87CF23435488;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone9,2;addressid/4585826605;supportBestPay/0;appBuild/167650;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      }
       
      }

      $.get(url, async (err, resp, data) => {
        try {
          //console.log(url.url)
          //console.log(data)
          data  = JSON.parse(data);
        // url = data.taskInfo.allValues.value
          console.log(url)
          //await notify.sendNotify(`${$.name} - 柠檬jxgc`, `京东账号${$.index} ${$.nickName}`+"电动车制造："+data)
         if (data.code === 0) {
            // console.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
          //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆:2000步\n"+data.msg)
            } else {
               //console.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
               //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆2000步\n步数不足或今日你已经兑换")
            }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

function shop2(timeout = 0) {

  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://api.m.jd.com/api?body={"goodId":"100009255069"}&clientVersion=8.8.8&uuid=86763302131156838bc92874434&client=H5&appid=zuma-web&functionId=activity_followGood`,
      headers: {
        "Host": "api.m.jd.com",
        "Origin": "https://jingqih5.m.jd.com",
        "Cookie": cookie,
        "User-Agent": "jdapp;iPhone;9.5.2;14.3;6898c30638c55142969304c8e2167997fa59eb53;network/4g;ADID/F108E1B6-8E30-477C-BE54-87CF23435488;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone9,2;addressid/4585826605;supportBestPay/0;appBuild/167650;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      }
       
      }

      $.get(url, async (err, resp, data) => {
        try {
          //console.log(url.url)
          //console.log(data)
         data  = JSON.parse(data);
        // url = data.taskInfo.allValues.value
          console.log(url)
          //await notify.sendNotify(`${$.name} - 柠檬jxgc`, `京东账号${$.index} ${$.nickName}`+"电动车制造："+data)
         if (data.code === 0) {
            // console.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
          //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆:2000步\n"+data.msg)
            } else {
               //console.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
               //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆2000步\n步数不足或今日你已经兑换")
            }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}
function shop3(timeout = 0) {

  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://api.m.jd.com/api?body={"goodId":"100010338198"}&clientVersion=8.8.8&uuid=86763302131156838bc92874434&client=H5&appid=zuma-web&functionId=activity_followGood`,
      headers: {
        "Host": "api.m.jd.com",
        "Origin": "https://jingqih5.m.jd.com",
        "Cookie": cookie,
        "User-Agent": "jdapp;iPhone;9.5.2;14.3;6898c30638c55142969304c8e2167997fa59eb53;network/4g;ADID/F108E1B6-8E30-477C-BE54-87CF23435488;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone9,2;addressid/4585826605;supportBestPay/0;appBuild/167650;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      }
       
      }

      $.get(url, async (err, resp, data) => {
        try {
          //console.log(url.url)
          //console.log(data)
          data  = JSON.parse(data);
        // url = data.taskInfo.allValues.value
          console.log(url)
          //await notify.sendNotify(`${$.name} - 柠檬jxgc`, `京东账号${$.index} ${$.nickName}`+"电动车制造："+data)
         if (data.code === 0) {
            // console.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
          //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆:2000步\n"+data.msg)
            } else {
               //console.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
               //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆2000步\n步数不足或今日你已经兑换")
            }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}
function task(timeout = 0) {

  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://api.m.jd.com/api?body=&clientVersion=8.8.8&uuid=86763302131156838bc92874434&client=H5&appid=zuma-web&functionId=activity_taskInfo`,
      headers: {
        "Host": "api.m.jd.com",
        "Origin": "https://jingqih5.m.jd.com",
        "Cookie": cookie,
        "User-Agent": "jdapp;iPhone;9.5.2;14.3;6898c30638c55142969304c8e2167997fa59eb53;network/4g;ADID/F108E1B6-8E30-477C-BE54-87CF23435488;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone9,2;addressid/4585826605;supportBestPay/0;appBuild/167650;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      }
       
      }

      $.get(url, async (err, resp, data) => {
        try {
          //console.log(url.url)
          //console.log(data)
          data  = JSON.parse(data);
        // url = data.taskInfo.allValues.value
          console.log(url)
          //await notify.sendNotify(`${$.name} - 柠檬jxgc`, `京东账号${$.index} ${$.nickName}`+"电动车制造："+data)
         if (data.code === 0) {
            // console.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
          //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆:2000步\n"+data.msg)
            } else {
               //console.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
               //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆2000步\n步数不足或今日你已经兑换")
            }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}





function rank(timeout = 0) {

  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://api.m.jd.com/api?body=&clientVersion=8.8.8&uuid=86763302131156838bc92874434&client=H5&appid=zuma-web&functionId=activity_info`,
      headers: {
        "Host": "api.m.jd.com",
        "Origin": "https://jingqih5.m.jd.com",
        "Cookie": cookie,
        "User-Agent": "jdapp;iPhone;9.5.2;14.3;6898c30638c55142969304c8e2167997fa59eb53;network/4g;ADID/F108E1B6-8E30-477C-BE54-87CF23435488;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone9,2;addressid/4585826605;supportBestPay/0;appBuild/167650;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      }
       
      }

      $.get(url, async (err, resp, data) => {
        try {
          //console.log(url.url)
          //console.log(data) startTime":"2021-05-31 00:00:00","
         const result = JSON.parse(data);
         score = data.match(/"score":(.*?),/)[1]
         pm = data.match(/rank":"(.*?)","/)[1]
         kssj = data.match(/startTime":"(.*?)","/)[1]
         jssj = data.match(/endTime":"(.*?)","/)[1]
          //$.log(result)
          //$.log(result.score)
          //await notify.sendNotify(`${$.name} - 柠檬jxgc`, `京东账号${$.index} ${$.nickName}`+"电动车制造："+data)
         if (result.errorCode === 0) {
             $.log("\n柠檬东东泡泡大战,今日任务已完成\n")
             $.log("\n当前个人积分："+score+"\n当前个人排名："+pm)
             $.log("\n开始时间："+kssj+"\n结束时间："+jssj)
          //allMessage += `${$.name} - 柠檬东东泡泡大战`, `京东账号${$.index} ${$.nickName}`+`\n柠檬东东泡泡大战,今日任务已完成\n`+`\n当前个人积分：`+score+`\n当前个人排名：`+pm+`\n开始时间：`+kssj+`\n结束时间：`+jssj
   //allMessage += `京东账号${$.index}-${$.nickName || $.UserName}\n柠檬东东泡泡大战,今日任务已完成\n当前个人积分:score\n当前个人排名：pm\n开始时间：kssj\n结束时间：jssj${$.index !== cookiesArr.length ? '\n\n' : '\n\n'}`;
} else {         
          
               //console.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
               //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆2000步\n步数不足或今日你已经兑换")
            }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}



function sf(timeout = 0) {
shuju = `{"ts":+ts,"token":+token,"maxRound":1,"eggRoundCount":0,"roundStars":{"1":4}}`

  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://api.m.jd.com/api?appid=orderCenter&functionId=picker_submitResult&clientVersion=8.0.0&client=m&body=`+a(shuju),
      headers: {
        "referer": "https://jingqih5.m.jd.com",
        "Origin": "https://jingqih5.m.jd.com",
        "Cookie": cookie,
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36 Edg/89.0.774.68",
      }
       
      }

      $.get(url, async (err, resp, data) => {
        try {
          //console.log(url.url)
          console.log(data) 
         //startTime":"2021-05-31 00:00:00","
         const result = JSON.parse(data);
         //token = data.match(/token":"(.*?)"/)[1]
         //ts = data.match(/ts":(.*?)}/)[1]
         //kssj = data.match(/startTime":"(.*?)","/)[1]
         //jssj = data.match(/endTime":"(.*?)","/)[1]
          //$.log(result)
          //$.log(result.score)
          //await notify.sendNotify(`${$.name} - 柠檬jxgc`, `京东账号${$.index} ${$.nickName}`+"电动车制造："+data)
         if (result.status === 0) {
             //$.log(token);
          $.log(ts);
             //$.log("\n当前个人积分："+score+"\n当前个人排名："+pm)
            // $.log("\n开始时间："+kssj+"\n结束时间："+jssj)
          //await notify.sendNotify(`${$.name} - 柠檬东东泡泡大战`, `京东账号${$.index} ${$.nickName}`+`\n柠檬东东泡泡大战,今日任务已完成\n`+`\n当前个人积分：`+score+`\n当前个人排名：`+pm+`\n开始时间：`+kssj+`\n结束时间：`+jssj)
            } else {
               //console.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
               //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆2000步\n步数不足或今日你已经兑换")
            }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}
function info(timeout = 0) {

  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://api.m.jd.com/api?appid=orderCenter&functionId=picker_getUserInfo&clientVersion=8.0.0&client=m&body=5GlOj7xTF%2Fw%3D`,
      headers: {
        "referer": "https://jingqih5.m.jd.com",
        "Origin": "https://jingqih5.m.jd.com",
        "Cookie": cookie,
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36 Edg/89.0.774.68",
      }
       
      }

      $.get(url, async (err, resp, data) => {
        try {
          //console.log(url.url)
          //console.log(data) startTime":"2021-05-31 00:00:00","
         const result = JSON.parse(data);
         token = data.match(/token":"(.*?)"/)[1]
         ts = data.match(/ts":(.*?)}/)[1]
         //kssj = data.match(/startTime":"(.*?)","/)[1]
         //jssj = data.match(/endTime":"(.*?)","/)[1]
          //$.log(result)
          //$.log(result.score)
          //await notify.sendNotify(`${$.name} - 柠檬jxgc`, `京东账号${$.index} ${$.nickName}`+"电动车制造："+data)
         if (result.status === 0) {
             //$.log(token);
          $.log(ts);
             //$.log("\n当前个人积分："+score+"\n当前个人排名："+pm)
            // $.log("\n开始时间："+kssj+"\n结束时间："+jssj)
          //await notify.sendNotify(`${$.name} - 柠檬东东泡泡大战`, `京东账号${$.index} ${$.nickName}`+`\n柠檬东东泡泡大战,今日任务已完成\n`+`\n当前个人积分：`+score+`\n当前个人排名：`+pm+`\n开始时间：`+kssj+`\n结束时间：`+jssj)
            } else {
               //console.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
               //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆2000步\n步数不足或今日你已经兑换")
            }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
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


function CryptoJSs(){var t=t||function(t,e){var i=Object.create||function(){function t(){}
return function(e){var i;return t.prototype=e,i=new t,t.prototype=null,i}}(),n={},r=n.lib={},c=r.Base=function(){return{extend:function(t){var e=i(this);return t&&e.mixIn(t),e.hasOwnProperty("init")&&this.init!==e.init||(e.init=function(){e.$super.init.apply(this,arguments)}),e.init.prototype=e,e.$super=this,e},create:function(){var t=this.extend();return t.init.apply(t,arguments),t},init:function(){},mixIn:function(t){for(var e in t)
t.hasOwnProperty(e)&&(this[e]=t[e]);t.hasOwnProperty("toString")&&(this.toString=t.toString)},clone:function(){return this.init.prototype.extend(this)}}}(),o=r.WordArray=c.extend({init:function(t,e){t=this.words=t||[],this.sigBytes=void 0!=e?e:4*t.length},toString:function(t){return(t||s).stringify(this)},concat:function(t){var e=this.words,i=t.words,n=this.sigBytes,r=t.sigBytes;if(this.clamp(),n%4)
for(var c=0;c<r;c++){var o=i[c>>>2]>>>24-c%4*8&255;e[n+c>>>2]|=o<<24-(n+c)%4*8}else
for(var c=0;c<r;c+=4)
e[n+c>>>2]=i[c>>>2];return this.sigBytes+=r,this},clamp:function(){var e=this.words,i=this.sigBytes;e[i>>>2]&=4294967295<<32-i%4*8,e.length=t.ceil(i/4)},clone:function(){var t=c.clone.call(this);return t.words=this.words.slice(0),t},random:function(e){for(var i,n=[],r=0;r<e;r+=4){var c=function(e){var e=e,i=987654321,n=4294967295;return function(){i=36969*(65535&i)+(i>>16)&n,e=18e3*(65535&e)+(e>>16)&n;var r=(i<<16)+e&n;return r/=4294967296,(r+=.5)*(t.random()>.5?1:-1)}}(4294967296*(i||t.random()));i=987654071*c(),n.push(4294967296*c()|0)}
return new o.init(n,e)}}),a=n.enc={},s=a.Hex={stringify:function(t){for(var e=t.words,i=t.sigBytes,n=[],r=0;r<i;r++){var c=e[r>>>2]>>>24-r%4*8&255;n.push((c>>>4).toString(16)),n.push((15&c).toString(16))}
return n.join("")},parse:function(t){for(var e=t.length,i=[],n=0;n<e;n+=2)
i[n>>>3]|=parseInt(t.substr(n,2),16)<<24-n%8*4;return new o.init(i,e/2)}},l=a.Latin1={stringify:function(t){for(var e=t.words,i=t.sigBytes,n=[],r=0;r<i;r++){var c=e[r>>>2]>>>24-r%4*8&255;n.push(String.fromCharCode(c))}
return n.join("")},parse:function(t){for(var e=t.length,i=[],n=0;n<e;n++)
i[n>>>2]|=(255&t.charCodeAt(n))<<24-n%4*8;return new o.init(i,e)}},h=a.Utf8={stringify:function(t){try{return decodeURIComponent(escape(l.stringify(t)))}catch(t){throw new Error("Malformed UTF-8 data")}},parse:function(t){return l.parse(unescape(encodeURIComponent(t)))}},u=r.BufferedBlockAlgorithm=c.extend({reset:function(){this._data=new o.init,this._nDataBytes=0},_append:function(t){"string"==typeof t&&(t=h.parse(t)),this._data.concat(t),this._nDataBytes+=t.sigBytes},_process:function(e){var i=this._data,n=i.words,r=i.sigBytes,c=this.blockSize,a=4*c,s=r/a;s=e?t.ceil(s):t.max((0|s)-this._minBufferSize,0);var l=s*c,h=t.min(4*l,r);if(l){for(var u=0;u<l;u+=c)
this._doProcessBlock(n,u);var d=n.splice(0,l);i.sigBytes-=h}
return new o.init(d,h)},clone:function(){var t=c.clone.call(this);return t._data=this._data.clone(),t},_minBufferSize:0}),d=(r.Hasher=u.extend({cfg:c.extend(),init:function(t){this.cfg=this.cfg.extend(t),this.reset()},reset:function(){u.reset.call(this),this._doReset()},update:function(t){return this._append(t),this._process(),this},finalize:function(t){return t&&this._append(t),this._doFinalize()},blockSize:16,_createHelper:function(t){return function(e,i){return new t.init(i).finalize(e)}},_createHmacHelper:function(t){return function(e,i){return new d.HMAC.init(t,i).finalize(e)}}}),n.algo={});return n}(Math);return function(){function e(t,e,i){for(var n=[],c=0,o=0;o<e;o++)
if(o%4){var a=i[t.charCodeAt(o-1)]<<o%4*2,s=i[t.charCodeAt(o)]>>>6-o%4*2;n[c>>>2]|=(a|s)<<24-c%4*8,c++}
return r.create(n,c)}
var i=t,n=i.lib,r=n.WordArray;i.enc.Base64={stringify:function(t){var e=t.words,i=t.sigBytes,n=this._map;t.clamp();for(var r=[],c=0;c<i;c+=3)
for(var o=e[c>>>2]>>>24-c%4*8&255,a=e[c+1>>>2]>>>24-(c+1)%4*8&255,s=e[c+2>>>2]>>>24-(c+2)%4*8&255,l=o<<16|a<<8|s,h=0;h<4&&c+.75*h<i;h++)
r.push(n.charAt(l>>>6*(3-h)&63));var u=n.charAt(64);if(u)
for(;r.length%4;)
r.push(u);return r.join("")},parse:function(t){var i=t.length,n=this._map,r=this._reverseMap;if(!r){r=this._reverseMap=[];for(var c=0;c<n.length;c++)
r[n.charCodeAt(c)]=c}
var o=n.charAt(64);if(o){var a=t.indexOf(o);-1!==a&&(i=a)}
return e(t,i,r)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}}(),function(e){function i(t,e,i,n,r,c,o){var a=t+(e&i|~e&n)+r+o;return(a<<c|a>>>32-c)+e}
function n(t,e,i,n,r,c,o){var a=t+(e&n|i&~n)+r+o;return(a<<c|a>>>32-c)+e}
function r(t,e,i,n,r,c,o){var a=t+(e^i^n)+r+o;return(a<<c|a>>>32-c)+e}
function c(t,e,i,n,r,c,o){var a=t+(i^(e|~n))+r+o;return(a<<c|a>>>32-c)+e}
var o=t,a=o.lib,s=a.WordArray,l=a.Hasher,h=o.algo,u=[];!function(){for(var t=0;t<64;t++)
u[t]=4294967296*e.abs(e.sin(t+1))|0}();var d=h.MD5=l.extend({_doReset:function(){this._hash=new s.init([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(t,e){for(var o=0;o<16;o++){var a=e+o,s=t[a];t[a]=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8)}
var l=this._hash.words,h=t[e+0],d=t[e+1],_=t[e+2],p=t[e+3],f=t[e+4],g=t[e+5],m=t[e+6],T=t[e+7],v=t[e+8],y=t[e+9],S=t[e+10],C=t[e+11],E=t[e+12],P=t[e+13],A=t[e+14],x=t[e+15],I=l[0],R=l[1],b=l[2],O=l[3];I=i(I,R,b,O,h,7,u[0]),O=i(O,I,R,b,d,12,u[1]),b=i(b,O,I,R,_,17,u[2]),R=i(R,b,O,I,p,22,u[3]),I=i(I,R,b,O,f,7,u[4]),O=i(O,I,R,b,g,12,u[5]),b=i(b,O,I,R,m,17,u[6]),R=i(R,b,O,I,T,22,u[7]),I=i(I,R,b,O,v,7,u[8]),O=i(O,I,R,b,y,12,u[9]),b=i(b,O,I,R,S,17,u[10]),R=i(R,b,O,I,C,22,u[11]),I=i(I,R,b,O,E,7,u[12]),O=i(O,I,R,b,P,12,u[13]),b=i(b,O,I,R,A,17,u[14]),R=i(R,b,O,I,x,22,u[15]),I=n(I,R,b,O,d,5,u[16]),O=n(O,I,R,b,m,9,u[17]),b=n(b,O,I,R,C,14,u[18]),R=n(R,b,O,I,h,20,u[19]),I=n(I,R,b,O,g,5,u[20]),O=n(O,I,R,b,S,9,u[21]),b=n(b,O,I,R,x,14,u[22]),R=n(R,b,O,I,f,20,u[23]),I=n(I,R,b,O,y,5,u[24]),O=n(O,I,R,b,A,9,u[25]),b=n(b,O,I,R,p,14,u[26]),R=n(R,b,O,I,v,20,u[27]),I=n(I,R,b,O,P,5,u[28]),O=n(O,I,R,b,_,9,u[29]),b=n(b,O,I,R,T,14,u[30]),R=n(R,b,O,I,E,20,u[31]),I=r(I,R,b,O,g,4,u[32]),O=r(O,I,R,b,v,11,u[33]),b=r(b,O,I,R,C,16,u[34]),R=r(R,b,O,I,A,23,u[35]),I=r(I,R,b,O,d,4,u[36]),O=r(O,I,R,b,f,11,u[37]),b=r(b,O,I,R,T,16,u[38]),R=r(R,b,O,I,S,23,u[39]),I=r(I,R,b,O,P,4,u[40]),O=r(O,I,R,b,h,11,u[41]),b=r(b,O,I,R,p,16,u[42]),R=r(R,b,O,I,m,23,u[43]),I=r(I,R,b,O,y,4,u[44]),O=r(O,I,R,b,E,11,u[45]),b=r(b,O,I,R,x,16,u[46]),R=r(R,b,O,I,_,23,u[47]),I=c(I,R,b,O,h,6,u[48]),O=c(O,I,R,b,T,10,u[49]),b=c(b,O,I,R,A,15,u[50]),R=c(R,b,O,I,g,21,u[51]),I=c(I,R,b,O,E,6,u[52]),O=c(O,I,R,b,p,10,u[53]),b=c(b,O,I,R,S,15,u[54]),R=c(R,b,O,I,d,21,u[55]),I=c(I,R,b,O,v,6,u[56]),O=c(O,I,R,b,x,10,u[57]),b=c(b,O,I,R,m,15,u[58]),R=c(R,b,O,I,P,21,u[59]),I=c(I,R,b,O,f,6,u[60]),O=c(O,I,R,b,C,10,u[61]),b=c(b,O,I,R,_,15,u[62]),R=c(R,b,O,I,y,21,u[63]),l[0]=l[0]+I|0,l[1]=l[1]+R|0,l[2]=l[2]+b|0,l[3]=l[3]+O|0},_doFinalize:function(){var t=this._data,i=t.words,n=8*this._nDataBytes,r=8*t.sigBytes;i[r>>>5]|=128<<24-r%32;var c=e.floor(n/4294967296),o=n;i[15+(r+64>>>9<<4)]=16711935&(c<<8|c>>>24)|4278255360&(c<<24|c>>>8),i[14+(r+64>>>9<<4)]=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8),t.sigBytes=4*(i.length+1),this._process();for(var a=this._hash,s=a.words,l=0;l<4;l++){var h=s[l];s[l]=16711935&(h<<8|h>>>24)|4278255360&(h<<24|h>>>8)}
return a},clone:function(){var t=l.clone.call(this);return t._hash=this._hash.clone(),t}});o.MD5=l._createHelper(d),o.HmacMD5=l._createHmacHelper(d)}(Math),function(){var e=t,i=e.lib,n=i.WordArray,r=i.Hasher,c=e.algo,o=[],a=c.SHA1=r.extend({_doReset:function(){this._hash=new n.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(t,e){for(var i=this._hash.words,n=i[0],r=i[1],c=i[2],a=i[3],s=i[4],l=0;l<80;l++){if(l<16)
o[l]=0|t[e+l];else{var h=o[l-3]^o[l-8]^o[l-14]^o[l-16];o[l]=h<<1|h>>>31}
var u=(n<<5|n>>>27)+s+o[l];u+=l<20?1518500249+(r&c|~r&a):l<40?1859775393+(r^c^a):l<60?(r&c|r&a|c&a)-1894007588:(r^c^a)-899497514,s=a,a=c,c=r<<30|r>>>2,r=n,n=u}
i[0]=i[0]+n|0,i[1]=i[1]+r|0,i[2]=i[2]+c|0,i[3]=i[3]+a|0,i[4]=i[4]+s|0},_doFinalize:function(){var t=this._data,e=t.words,i=8*this._nDataBytes,n=8*t.sigBytes;return e[n>>>5]|=128<<24-n%32,e[14+(n+64>>>9<<4)]=Math.floor(i/4294967296),e[15+(n+64>>>9<<4)]=i,t.sigBytes=4*e.length,this._process(),this._hash},clone:function(){var t=r.clone.call(this);return t._hash=this._hash.clone(),t}});e.SHA1=r._createHelper(a),e.HmacSHA1=r._createHmacHelper(a)}(),function(e){var i=t,n=i.lib,r=n.WordArray,c=n.Hasher,o=i.algo,a=[],s=[];!function(){function t(t){return 4294967296*(t-(0|t))|0}
for(var i=2,n=0;n<64;)
(function(t){for(var i=e.sqrt(t),n=2;n<=i;n++)
if(!(t%n))
return!1;return!0})(i)&&(n<8&&(a[n]=t(e.pow(i,.5))),s[n]=t(e.pow(i,1/3)),n++),i++}();var l=[],h=o.SHA256=c.extend({_doReset:function(){this._hash=new r.init(a.slice(0))},_doProcessBlock:function(t,e){for(var i=this._hash.words,n=i[0],r=i[1],c=i[2],o=i[3],a=i[4],h=i[5],u=i[6],d=i[7],_=0;_<64;_++){if(_<16)
l[_]=0|t[e+_];else{var p=l[_-15],f=(p<<25|p>>>7)^(p<<14|p>>>18)^p>>>3,g=l[_-2],m=(g<<15|g>>>17)^(g<<13|g>>>19)^g>>>10;l[_]=f+l[_-7]+m+l[_-16]}
var T=a&h^~a&u,v=n&r^n&c^r&c,y=(n<<30|n>>>2)^(n<<19|n>>>13)^(n<<10|n>>>22),S=(a<<26|a>>>6)^(a<<21|a>>>11)^(a<<7|a>>>25),C=d+S+T+s[_]+l[_],E=y+v;d=u,u=h,h=a,a=o+C|0,o=c,c=r,r=n,n=C+E|0}
i[0]=i[0]+n|0,i[1]=i[1]+r|0,i[2]=i[2]+c|0,i[3]=i[3]+o|0,i[4]=i[4]+a|0,i[5]=i[5]+h|0,i[6]=i[6]+u|0,i[7]=i[7]+d|0},_doFinalize:function(){var t=this._data,i=t.words,n=8*this._nDataBytes,r=8*t.sigBytes;return i[r>>>5]|=128<<24-r%32,i[14+(r+64>>>9<<4)]=e.floor(n/4294967296),i[15+(r+64>>>9<<4)]=n,t.sigBytes=4*i.length,this._process(),this._hash},clone:function(){var t=c.clone.call(this);return t._hash=this._hash.clone(),t}});i.SHA256=c._createHelper(h),i.HmacSHA256=c._createHmacHelper(h)}(Math),function(){function e(t){return t<<8&4278255360|t>>>8&16711935}
var i=t,n=i.lib,r=n.WordArray,c=i.enc;c.Utf16=c.Utf16BE={stringify:function(t){for(var e=t.words,i=t.sigBytes,n=[],r=0;r<i;r+=2){var c=e[r>>>2]>>>16-r%4*8&65535;n.push(String.fromCharCode(c))}
return n.join("")},parse:function(t){for(var e=t.length,i=[],n=0;n<e;n++)
i[n>>>1]|=t.charCodeAt(n)<<16-n%2*16;return r.create(i,2*e)}},c.Utf16LE={stringify:function(t){for(var i=t.words,n=t.sigBytes,r=[],c=0;c<n;c+=2){var o=e(i[c>>>2]>>>16-c%4*8&65535);r.push(String.fromCharCode(o))}
return r.join("")},parse:function(t){for(var i=t.length,n=[],c=0;c<i;c++)
n[c>>>1]|=e(t.charCodeAt(c)<<16-c%2*16);return r.create(n,2*i)}}}(),function(){if("function"==typeof ArrayBuffer){var e=t,i=e.lib,n=i.WordArray,r=n.init;(n.init=function(t){if(t instanceof ArrayBuffer&&(t=new Uint8Array(t)),(t instanceof Int8Array||"undefined"!=typeof Uint8ClampedArray&&t instanceof Uint8ClampedArray||t instanceof Int16Array||t instanceof Uint16Array||t instanceof Int32Array||t instanceof Uint32Array||t instanceof Float32Array||t instanceof Float64Array)&&(t=new Uint8Array(t.buffer,t.byteOffset,t.byteLength)),t instanceof Uint8Array){for(var e=t.byteLength,i=[],n=0;n<e;n++)
i[n>>>2]|=t[n]<<24-n%4*8;r.call(this,i,e)}else
r.apply(this,arguments)}).prototype=n}}(),function(e){function i(t,e,i){return t^e^i}
function n(t,e,i){return t&e|~t&i}
function r(t,e,i){return(t|~e)^i}
function c(t,e,i){return t&i|e&~i}
function o(t,e,i){return t^(e|~i)}
function a(t,e){return t<<e|t>>>32-e}
var s=t,l=s.lib,h=l.WordArray,u=l.Hasher,d=s.algo,_=h.create([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13]),p=h.create([5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11]),f=h.create([11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6]),g=h.create([8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11]),m=h.create([0,1518500249,1859775393,2400959708,2840853838]),T=h.create([1352829926,1548603684,1836072691,2053994217,0]),v=d.RIPEMD160=u.extend({_doReset:function(){this._hash=h.create([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(t,e){for(var s=0;s<16;s++){var l=e+s,h=t[l];t[l]=16711935&(h<<8|h>>>24)|4278255360&(h<<24|h>>>8)}
var u,d,v,y,S,C,E,P,A,x,I=this._hash.words,R=m.words,b=T.words,O=_.words,w=p.words,L=f.words,F=g.words;C=u=I[0],E=d=I[1],P=v=I[2],A=y=I[3],x=S=I[4];for(var N,s=0;s<80;s+=1)
N=u+t[e+O[s]]|0,N+=s<16?i(d,v,y)+R[0]:s<32?n(d,v,y)+R[1]:s<48?r(d,v,y)+R[2]:s<64?c(d,v,y)+R[3]:o(d,v,y)+R[4],N|=0,N=a(N,L[s]),N=N+S|0,u=S,S=y,y=a(v,10),v=d,d=N,N=C+t[e+w[s]]|0,N+=s<16?o(E,P,A)+b[0]:s<32?c(E,P,A)+b[1]:s<48?r(E,P,A)+b[2]:s<64?n(E,P,A)+b[3]:i(E,P,A)+b[4],N|=0,N=a(N,F[s]),N=N+x|0,C=x,x=A,A=a(P,10),P=E,E=N;N=I[1]+v+A|0,I[1]=I[2]+y+x|0,I[2]=I[3]+S+C|0,I[3]=I[4]+u+E|0,I[4]=I[0]+d+P|0,I[0]=N},_doFinalize:function(){var t=this._data,e=t.words,i=8*this._nDataBytes,n=8*t.sigBytes;e[n>>>5]|=128<<24-n%32,e[14+(n+64>>>9<<4)]=16711935&(i<<8|i>>>24)|4278255360&(i<<24|i>>>8),t.sigBytes=4*(e.length+1),this._process();for(var r=this._hash,c=r.words,o=0;o<5;o++){var a=c[o];c[o]=16711935&(a<<8|a>>>24)|4278255360&(a<<24|a>>>8)}
return r},clone:function(){var t=u.clone.call(this);return t._hash=this._hash.clone(),t}});s.RIPEMD160=u._createHelper(v),s.HmacRIPEMD160=u._createHmacHelper(v)}(Math),function(){var e=t,i=e.lib,n=i.Base,r=e.enc,c=r.Utf8;e.algo.HMAC=n.extend({init:function(t,e){t=this._hasher=new t.init,"string"==typeof e&&(e=c.parse(e));var i=t.blockSize,n=4*i;e.sigBytes>n&&(e=t.finalize(e)),e.clamp();for(var r=this._oKey=e.clone(),o=this._iKey=e.clone(),a=r.words,s=o.words,l=0;l<i;l++)
a[l]^=1549556828,s[l]^=909522486;r.sigBytes=o.sigBytes=n,this.reset()},reset:function(){var t=this._hasher;t.reset(),t.update(this._iKey)},update:function(t){return this._hasher.update(t),this},finalize:function(t){var e=this._hasher,i=e.finalize(t);return e.reset(),e.finalize(this._oKey.clone().concat(i))}})}(),function(){var e=t,i=e.lib,n=i.Base,r=i.WordArray,c=e.algo,o=c.SHA1,a=c.HMAC,s=c.PBKDF2=n.extend({cfg:n.extend({keySize:4,hasher:o,iterations:1}),init:function(t){this.cfg=this.cfg.extend(t)},compute:function(t,e){for(var i=this.cfg,n=a.create(i.hasher,t),c=r.create(),o=r.create([1]),s=c.words,l=o.words,h=i.keySize,u=i.iterations;s.length<h;){var d=n.update(e).finalize(o);n.reset();for(var _=d.words,p=_.length,f=d,g=1;g<u;g++){f=n.finalize(f),n.reset();for(var m=f.words,T=0;T<p;T++)
_[T]^=m[T]}
c.concat(d),l[0]++}
return c.sigBytes=4*h,c}});e.PBKDF2=function(t,e,i){return s.create(i).compute(t,e)}}(),function(){var e=t,i=e.lib,n=i.Base,r=i.WordArray,c=e.algo,o=c.MD5,a=c.EvpKDF=n.extend({cfg:n.extend({keySize:4,hasher:o,iterations:1}),init:function(t){this.cfg=this.cfg.extend(t)},compute:function(t,e){for(var i=this.cfg,n=i.hasher.create(),c=r.create(),o=c.words,a=i.keySize,s=i.iterations;o.length<a;){l&&n.update(l);var l=n.update(t).finalize(e);n.reset();for(var h=1;h<s;h++)
l=n.finalize(l),n.reset();c.concat(l)}
return c.sigBytes=4*a,c}});e.EvpKDF=function(t,e,i){return a.create(i).compute(t,e)}}(),function(){var e=t,i=e.lib,n=i.WordArray,r=e.algo,c=r.SHA256,o=r.SHA224=c.extend({_doReset:function(){this._hash=new n.init([3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428])},_doFinalize:function(){var t=c._doFinalize.call(this);return t.sigBytes-=4,t}});e.SHA224=c._createHelper(o),e.HmacSHA224=c._createHmacHelper(o)}(),function(e){var i=t,n=i.lib,r=n.Base,c=n.WordArray,o=i.x64={};o.Word=r.extend({init:function(t,e){this.high=t,this.low=e}}),o.WordArray=r.extend({init:function(t,e){t=this.words=t||[],this.sigBytes=void 0!=e?e:8*t.length},toX32:function(){for(var t=this.words,e=t.length,i=[],n=0;n<e;n++){var r=t[n];i.push(r.high),i.push(r.low)}
return c.create(i,this.sigBytes)},clone:function(){for(var t=r.clone.call(this),e=t.words=this.words.slice(0),i=e.length,n=0;n<i;n++)
e[n]=e[n].clone();return t}})}(),function(e){var i=t,n=i.lib,r=n.WordArray,c=n.Hasher,o=i.x64,a=o.Word,s=i.algo,l=[],h=[],u=[];!function(){for(var t=1,e=0,i=0;i<24;i++){l[t+5*e]=(i+1)*(i+2)/2%64;var n=e%5,r=(2*t+3*e)%5;t=n,e=r}
for(var t=0;t<5;t++)
for(var e=0;e<5;e++)
h[t+5*e]=e+(2*t+3*e)%5*5;for(var c=1,o=0;o<24;o++){for(var s=0,d=0,_=0;_<7;_++){if(1&c){var p=(1<<_)-1;p<32?d^=1<<p:s^=1<<p-32}
128&c?c=c<<1^113:c<<=1}
u[o]=a.create(s,d)}}();var d=[];!function(){for(var t=0;t<25;t++)
d[t]=a.create()}();var _=s.SHA3=c.extend({cfg:c.cfg.extend({outputLength:512}),_doReset:function(){for(var t=this._state=[],e=0;e<25;e++)
t[e]=new a.init;this.blockSize=(1600-2*this.cfg.outputLength)/32},_doProcessBlock:function(t,e){for(var i=this._state,n=this.blockSize/2,r=0;r<n;r++){var c=t[e+2*r],o=t[e+2*r+1];c=16711935&(c<<8|c>>>24)|4278255360&(c<<24|c>>>8),o=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8);var a=i[r];a.high^=o,a.low^=c}
for(var s=0;s<24;s++){for(var _=0;_<5;_++){for(var p=0,f=0,g=0;g<5;g++){var a=i[_+5*g];p^=a.high,f^=a.low}
var m=d[_];m.high=p,m.low=f}
for(var _=0;_<5;_++)
for(var T=d[(_+4)%5],v=d[(_+1)%5],y=v.high,S=v.low,p=T.high^(y<<1|S>>>31),f=T.low^(S<<1|y>>>31),g=0;g<5;g++){var a=i[_+5*g];a.high^=p,a.low^=f}
for(var C=1;C<25;C++){var a=i[C],E=a.high,P=a.low,A=l[C];if(A<32)
var p=E<<A|P>>>32-A,f=P<<A|E>>>32-A;else
var p=P<<A-32|E>>>64-A,f=E<<A-32|P>>>64-A;var x=d[h[C]];x.high=p,x.low=f}
var I=d[0],R=i[0];I.high=R.high,I.low=R.low;for(var _=0;_<5;_++)
for(var g=0;g<5;g++){var C=_+5*g,a=i[C],b=d[C],O=d[(_+1)%5+5*g],w=d[(_+2)%5+5*g];a.high=b.high^~O.high&w.high,a.low=b.low^~O.low&w.low}
var a=i[0],L=u[s];a.high^=L.high,a.low^=L.low}},_doFinalize:function(){var t=this._data,i=t.words,n=(this._nDataBytes,8*t.sigBytes),c=32*this.blockSize;i[n>>>5]|=1<<24-n%32,i[(e.ceil((n+1)/c)*c>>>5)-1]|=128,t.sigBytes=4*i.length,this._process();for(var o=this._state,a=this.cfg.outputLength/8,s=a/8,l=[],h=0;h<s;h++){var u=o[h],d=u.high,_=u.low;d=16711935&(d<<8|d>>>24)|4278255360&(d<<24|d>>>8),_=16711935&(_<<8|_>>>24)|4278255360&(_<<24|_>>>8),l.push(_),l.push(d)}
return new r.init(l,a)},clone:function(){for(var t=c.clone.call(this),e=t._state=this._state.slice(0),i=0;i<25;i++)
e[i]=e[i].clone();return t}});i.SHA3=c._createHelper(_),i.HmacSHA3=c._createHmacHelper(_)}(Math),function(){function e(){return o.create.apply(o,arguments)}
var i=t,n=i.lib,r=n.Hasher,c=i.x64,o=c.Word,a=c.WordArray,s=i.algo,l=[e(1116352408,3609767458),e(1899447441,602891725),e(3049323471,3964484399),e(3921009573,2173295548),e(961987163,4081628472),e(1508970993,3053834265),e(2453635748,2937671579),e(2870763221,3664609560),e(3624381080,2734883394),e(310598401,1164996542),e(607225278,1323610764),e(1426881987,3590304994),e(1925078388,4068182383),e(2162078206,991336113),e(2614888103,633803317),e(3248222580,3479774868),e(3835390401,2666613458),e(4022224774,944711139),e(264347078,2341262773),e(604807628,2007800933),e(770255983,1495990901),e(1249150122,1856431235),e(1555081692,3175218132),e(1996064986,2198950837),e(2554220882,3999719339),e(2821834349,766784016),e(2952996808,2566594879),e(3210313671,3203337956),e(3336571891,1034457026),e(3584528711,2466948901),e(113926993,3758326383),e(338241895,168717936),e(666307205,1188179964),e(773529912,1546045734),e(1294757372,1522805485),e(1396182291,2643833823),e(1695183700,2343527390),e(1986661051,1014477480),e(2177026350,1206759142),e(2456956037,344077627),e(2730485921,1290863460),e(2820302411,3158454273),e(3259730800,3505952657),e(3345764771,106217008),e(3516065817,3606008344),e(3600352804,1432725776),e(4094571909,1467031594),e(275423344,851169720),e(430227734,3100823752),e(506948616,1363258195),e(659060556,3750685593),e(883997877,3785050280),e(958139571,3318307427),e(1322822218,3812723403),e(1537002063,2003034995),e(1747873779,3602036899),e(1955562222,1575990012),e(2024104815,1125592928),e(2227730452,2716904306),e(2361852424,442776044),e(2428436474,593698344),e(2756734187,3733110249),e(3204031479,2999351573),e(3329325298,3815920427),e(3391569614,3928383900),e(3515267271,566280711),e(3940187606,3454069534),e(4118630271,4000239992),e(116418474,1914138554),e(174292421,2731055270),e(289380356,3203993006),e(460393269,320620315),e(685471733,587496836),e(852142971,1086792851),e(1017036298,365543100),e(1126000580,2618297676),e(1288033470,3409855158),e(1501505948,4234509866),e(1607167915,987167468),e(1816402316,1246189591)],h=[];!function(){for(var t=0;t<80;t++)
h[t]=e()}();var u=s.SHA512=r.extend({_doReset:function(){this._hash=new a.init([new o.init(1779033703,4089235720),new o.init(3144134277,2227873595),new o.init(1013904242,4271175723),new o.init(2773480762,1595750129),new o.init(1359893119,2917565137),new o.init(2600822924,725511199),new o.init(528734635,4215389547),new o.init(1541459225,327033209)])},_doProcessBlock:function(t,e){for(var i=this._hash.words,n=i[0],r=i[1],c=i[2],o=i[3],a=i[4],s=i[5],u=i[6],d=i[7],_=n.high,p=n.low,f=r.high,g=r.low,m=c.high,T=c.low,v=o.high,y=o.low,S=a.high,C=a.low,E=s.high,P=s.low,A=u.high,x=u.low,I=d.high,R=d.low,b=_,O=p,w=f,L=g,F=m,N=T,B=v,D=y,M=S,k=C,V=E,W=P,G=A,z=x,U=I,Y=R,H=0;H<80;H++){var X=h[H];if(H<16)
var j=X.high=0|t[e+2*H],q=X.low=0|t[e+2*H+1];else{var Q=h[H-15],Z=Q.high,K=Q.low,J=(Z>>>1|K<<31)^(Z>>>8|K<<24)^Z>>>7,$=(K>>>1|Z<<31)^(K>>>8|Z<<24)^(K>>>7|Z<<25),tt=h[H-2],et=tt.high,it=tt.low,nt=(et>>>19|it<<13)^(et<<3|it>>>29)^et>>>6,rt=(it>>>19|et<<13)^(it<<3|et>>>29)^(it>>>6|et<<26),ct=h[H-7],ot=ct.high,at=ct.low,st=h[H-16],lt=st.high,ht=st.low,q=$+at,j=J+ot+(q>>>0<$>>>0?1:0),q=q+rt,j=j+nt+(q>>>0<rt>>>0?1:0),q=q+ht,j=j+lt+(q>>>0<ht>>>0?1:0);X.high=j,X.low=q}
var ut=M&V^~M&G,dt=k&W^~k&z,_t=b&w^b&F^w&F,pt=O&L^O&N^L&N,ft=(b>>>28|O<<4)^(b<<30|O>>>2)^(b<<25|O>>>7),gt=(O>>>28|b<<4)^(O<<30|b>>>2)^(O<<25|b>>>7),mt=(M>>>14|k<<18)^(M>>>18|k<<14)^(M<<23|k>>>9),Tt=(k>>>14|M<<18)^(k>>>18|M<<14)^(k<<23|M>>>9),vt=l[H],yt=vt.high,St=vt.low,Ct=Y+Tt,Et=U+mt+(Ct>>>0<Y>>>0?1:0),Ct=Ct+dt,Et=Et+ut+(Ct>>>0<dt>>>0?1:0),Ct=Ct+St,Et=Et+yt+(Ct>>>0<St>>>0?1:0),Ct=Ct+q,Et=Et+j+(Ct>>>0<q>>>0?1:0),Pt=gt+pt,At=ft+_t+(Pt>>>0<gt>>>0?1:0);U=G,Y=z,G=V,z=W,V=M,W=k,k=D+Ct|0,M=B+Et+(k>>>0<D>>>0?1:0)|0,B=F,D=N,F=w,N=L,w=b,L=O,O=Ct+Pt|0,b=Et+At+(O>>>0<Ct>>>0?1:0)|0}
p=n.low=p+O,n.high=_+b+(p>>>0<O>>>0?1:0),g=r.low=g+L,r.high=f+w+(g>>>0<L>>>0?1:0),T=c.low=T+N,c.high=m+F+(T>>>0<N>>>0?1:0),y=o.low=y+D,o.high=v+B+(y>>>0<D>>>0?1:0),C=a.low=C+k,a.high=S+M+(C>>>0<k>>>0?1:0),P=s.low=P+W,s.high=E+V+(P>>>0<W>>>0?1:0),x=u.low=x+z,u.high=A+G+(x>>>0<z>>>0?1:0),R=d.low=R+Y,d.high=I+U+(R>>>0<Y>>>0?1:0)},_doFinalize:function(){var t=this._data,e=t.words,i=8*this._nDataBytes,n=8*t.sigBytes;return e[n>>>5]|=128<<24-n%32,e[30+(n+128>>>10<<5)]=Math.floor(i/4294967296),e[31+(n+128>>>10<<5)]=i,t.sigBytes=4*e.length,this._process(),this._hash.toX32()},clone:function(){var t=r.clone.call(this);return t._hash=this._hash.clone(),t},blockSize:32});i.SHA512=r._createHelper(u),i.HmacSHA512=r._createHmacHelper(u)}(),function(){var e=t,i=e.x64,n=i.Word,r=i.WordArray,c=e.algo,o=c.SHA512,a=c.SHA384=o.extend({_doReset:function(){this._hash=new r.init([new n.init(3418070365,3238371032),new n.init(1654270250,914150663),new n.init(2438529370,812702999),new n.init(355462360,4144912697),new n.init(1731405415,4290775857),new n.init(2394180231,1750603025),new n.init(3675008525,1694076839),new n.init(1203062813,3204075428)])},_doFinalize:function(){var t=o._doFinalize.call(this);return t.sigBytes-=16,t}});e.SHA384=o._createHelper(a),e.HmacSHA384=o._createHmacHelper(a)}(),t.lib.Cipher||function(e){var i=t,n=i.lib,r=n.Base,c=n.WordArray,o=n.BufferedBlockAlgorithm,a=i.enc,s=(a.Utf8,a.Base64),l=i.algo,h=l.EvpKDF,u=n.Cipher=o.extend({cfg:r.extend(),createEncryptor:function(t,e){return this.create(this._ENC_XFORM_MODE,t,e)},createDecryptor:function(t,e){return this.create(this._DEC_XFORM_MODE,t,e)},init:function(t,e,i){this.cfg=this.cfg.extend(i),this._xformMode=t,this._key=e,this.reset()},reset:function(){o.reset.call(this),this._doReset()},process:function(t){return this._append(t),this._process()},finalize:function(t){return t&&this._append(t),this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(){function t(t){return"string"==typeof t?E:y}
return function(e){return{encrypt:function(i,n,r){return t(n).encrypt(e,i,n,r)},decrypt:function(i,n,r){return t(n).decrypt(e,i,n,r)}}}}()}),d=(n.StreamCipher=u.extend({_doFinalize:function(){return this._process(!0)},blockSize:1}),i.mode={}),_=n.BlockCipherMode=r.extend({createEncryptor:function(t,e){return this.Encryptor.create(t,e)},createDecryptor:function(t,e){return this.Decryptor.create(t,e)},init:function(t,e){this._cipher=t,this._iv=e}}),p=d.CBC=function(){function t(t,i,n){var r=this._iv;if(r){var c=r;this._iv=e}else
var c=this._prevBlock;for(var o=0;o<n;o++)
t[i+o]^=c[o]}
var i=_.extend();return i.Encryptor=i.extend({processBlock:function(e,i){var n=this._cipher,r=n.blockSize;t.call(this,e,i,r),n.encryptBlock(e,i),this._prevBlock=e.slice(i,i+r)}}),i.Decryptor=i.extend({processBlock:function(e,i){var n=this._cipher,r=n.blockSize,c=e.slice(i,i+r);n.decryptBlock(e,i),t.call(this,e,i,r),this._prevBlock=c}}),i}(),f=i.pad={},g=f.Pkcs7={pad:function(t,e){for(var i=4*e,n=i-t.sigBytes%i,r=n<<24|n<<16|n<<8|n,o=[],a=0;a<n;a+=4)
o.push(r);var s=c.create(o,n);t.concat(s)},unpad:function(t){var e=255&t.words[t.sigBytes-1>>>2];t.sigBytes-=e}},m=(n.BlockCipher=u.extend({cfg:u.cfg.extend({mode:p,padding:g}),reset:function(){u.reset.call(this);var t=this.cfg,e=t.iv,i=t.mode;if(this._xformMode==this._ENC_XFORM_MODE)
var n=i.createEncryptor;else{var n=i.createDecryptor;this._minBufferSize=1}
this._mode&&this._mode.__creator==n?this._mode.init(this,e&&e.words):(this._mode=n.call(i,this,e&&e.words),this._mode.__creator=n)},_doProcessBlock:function(t,e){this._mode.processBlock(t,e)},_doFinalize:function(){var t=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){t.pad(this._data,this.blockSize);var e=this._process(!0)}else{var e=this._process(!0);t.unpad(e)}
return e},blockSize:4}),n.CipherParams=r.extend({init:function(t){this.mixIn(t)},toString:function(t){return(t||this.formatter).stringify(this)}})),T=i.format={},v=T.OpenSSL={stringify:function(t){var e=t.ciphertext,i=t.salt;if(i)
var n=c.create([1398893684,1701076831]).concat(i).concat(e);else
var n=e;return n.toString(s)},parse:function(t){var e=s.parse(t),i=e.words;if(1398893684==i[0]&&1701076831==i[1]){var n=c.create(i.slice(2,4));i.splice(0,4),e.sigBytes-=16}
return m.create({ciphertext:e,salt:n})}},y=n.SerializableCipher=r.extend({cfg:r.extend({format:v}),encrypt:function(t,e,i,n){n=this.cfg.extend(n);var r=t.createEncryptor(i,n),c=r.finalize(e),o=r.cfg;return m.create({ciphertext:c,key:i,iv:o.iv,algorithm:t,mode:o.mode,padding:o.padding,blockSize:t.blockSize,formatter:n.format})},decrypt:function(t,e,i,n){return n=this.cfg.extend(n),e=this._parse(e,n.format),t.createDecryptor(i,n).finalize(e.ciphertext)},_parse:function(t,e){return"string"==typeof t?e.parse(t,this):t}}),S=i.kdf={},C=S.OpenSSL={execute:function(t,e,i,n){n||(n=c.random(8));var r=h.create({keySize:e+i}).compute(t,n),o=c.create(r.words.slice(e),4*i);return r.sigBytes=4*e,m.create({key:r,iv:o,salt:n})}},E=n.PasswordBasedCipher=y.extend({cfg:y.cfg.extend({kdf:C}),encrypt:function(t,e,i,n){n=this.cfg.extend(n);var r=n.kdf.execute(i,t.keySize,t.ivSize);n.iv=r.iv;var c=y.encrypt.call(this,t,e,r.key,n);return c.mixIn(r),c},decrypt:function(t,e,i,n){n=this.cfg.extend(n),e=this._parse(e,n.format);var r=n.kdf.execute(i,t.keySize,t.ivSize,e.salt);return n.iv=r.iv,y.decrypt.call(this,t,e,r.key,n)}})}(),t.mode.CFB=function(){function e(t,e,i,n){var r=this._iv;if(r){var c=r.slice(0);this._iv=void 0}else
var c=this._prevBlock;n.encryptBlock(c,0);for(var o=0;o<i;o++)
t[e+o]^=c[o]}
var i=t.lib.BlockCipherMode.extend();return i.Encryptor=i.extend({processBlock:function(t,i){var n=this._cipher,r=n.blockSize;e.call(this,t,i,r,n),this._prevBlock=t.slice(i,i+r)}}),i.Decryptor=i.extend({processBlock:function(t,i){var n=this._cipher,r=n.blockSize,c=t.slice(i,i+r);e.call(this,t,i,r,n),this._prevBlock=c}}),i}(),t.mode.ECB=function(){var e=t.lib.BlockCipherMode.extend();return e.Encryptor=e.extend({processBlock:function(t,e){this._cipher.encryptBlock(t,e)}}),e.Decryptor=e.extend({processBlock:function(t,e){this._cipher.decryptBlock(t,e)}}),e}(),t.pad.AnsiX923={pad:function(t,e){var i=t.sigBytes,n=4*e,r=n-i%n,c=i+r-1;t.clamp(),t.words[c>>>2]|=r<<24-c%4*8,t.sigBytes+=r},unpad:function(t){var e=255&t.words[t.sigBytes-1>>>2];t.sigBytes-=e}},t.pad.Iso10126={pad:function(e,i){var n=4*i,r=n-e.sigBytes%n;e.concat(t.lib.WordArray.random(r-1)).concat(t.lib.WordArray.create([r<<24],1))},unpad:function(t){var e=255&t.words[t.sigBytes-1>>>2];t.sigBytes-=e}},t.pad.Iso97971={pad:function(e,i){e.concat(t.lib.WordArray.create([2147483648],1)),t.pad.ZeroPadding.pad(e,i)},unpad:function(e){t.pad.ZeroPadding.unpad(e),e.sigBytes--}},t.mode.OFB=function(){var e=t.lib.BlockCipherMode.extend(),i=e.Encryptor=e.extend({processBlock:function(t,e){var i=this._cipher,n=i.blockSize,r=this._iv,c=this._keystream;r&&(c=this._keystream=r.slice(0),this._iv=void 0),i.encryptBlock(c,0);for(var o=0;o<n;o++)
t[e+o]^=c[o]}});return e.Decryptor=i,e}(),t.pad.NoPadding={pad:function(){},unpad:function(){}},function(e){var i=t,n=i.lib,r=n.CipherParams,c=i.enc,o=c.Hex;i.format.Hex={stringify:function(t){return t.ciphertext.toString(o)},parse:function(t){var e=o.parse(t);return r.create({ciphertext:e})}}}(),function(){var e=t,i=e.lib,n=i.BlockCipher,r=e.algo,c=[],o=[],a=[],s=[],l=[],h=[],u=[],d=[],_=[],p=[];!function(){for(var t=[],e=0;e<256;e++)
t[e]=e<128?e<<1:e<<1^283;for(var i=0,n=0,e=0;e<256;e++){var r=n^n<<1^n<<2^n<<3^n<<4;r=r>>>8^255&r^99,c[i]=r,o[r]=i;var f=t[i],g=t[f],m=t[g],T=257*t[r]^16843008*r;a[i]=T<<24|T>>>8,s[i]=T<<16|T>>>16,l[i]=T<<8|T>>>24,h[i]=T;var T=16843009*m^65537*g^257*f^16843008*i;u[r]=T<<24|T>>>8,d[r]=T<<16|T>>>16,_[r]=T<<8|T>>>24,p[r]=T,i?(i=f^t[t[t[m^f]]],n^=t[t[n]]):i=n=1}}();var f=[0,1,2,4,8,16,32,64,128,27,54],g=r.AES=n.extend({_doReset:function(){if(!this._nRounds||this._keyPriorReset!==this._key){for(var t=this._keyPriorReset=this._key,e=t.words,i=t.sigBytes/4,n=this._nRounds=i+6,r=4*(n+1),o=this._keySchedule=[],a=0;a<r;a++)
if(a<i)
o[a]=e[a];else{var s=o[a-1];a%i?i>6&&a%i==4&&(s=c[s>>>24]<<24|c[s>>>16&255]<<16|c[s>>>8&255]<<8|c[255&s]):(s=s<<8|s>>>24,s=c[s>>>24]<<24|c[s>>>16&255]<<16|c[s>>>8&255]<<8|c[255&s],s^=f[a/i|0]<<24),o[a]=o[a-i]^s}
for(var l=this._invKeySchedule=[],h=0;h<r;h++){var a=r-h;if(h%4)
var s=o[a];else
var s=o[a-4];l[h]=h<4||a<=4?s:u[c[s>>>24]]^d[c[s>>>16&255]]^_[c[s>>>8&255]]^p[c[255&s]]}}},encryptBlock:function(t,e){this._doCryptBlock(t,e,this._keySchedule,a,s,l,h,c)},decryptBlock:function(t,e){var i=t[e+1];t[e+1]=t[e+3],t[e+3]=i,this._doCryptBlock(t,e,this._invKeySchedule,u,d,_,p,o);var i=t[e+1];t[e+1]=t[e+3],t[e+3]=i},_doCryptBlock:function(t,e,i,n,r,c,o,a){for(var s=this._nRounds,l=t[e]^i[0],h=t[e+1]^i[1],u=t[e+2]^i[2],d=t[e+3]^i[3],_=4,p=1;p<s;p++){var f=n[l>>>24]^r[h>>>16&255]^c[u>>>8&255]^o[255&d]^i[_++],g=n[h>>>24]^r[u>>>16&255]^c[d>>>8&255]^o[255&l]^i[_++],m=n[u>>>24]^r[d>>>16&255]^c[l>>>8&255]^o[255&h]^i[_++],T=n[d>>>24]^r[l>>>16&255]^c[h>>>8&255]^o[255&u]^i[_++];l=f,h=g,u=m,d=T}
var f=(a[l>>>24]<<24|a[h>>>16&255]<<16|a[u>>>8&255]<<8|a[255&d])^i[_++],g=(a[h>>>24]<<24|a[u>>>16&255]<<16|a[d>>>8&255]<<8|a[255&l])^i[_++],m=(a[u>>>24]<<24|a[d>>>16&255]<<16|a[l>>>8&255]<<8|a[255&h])^i[_++],T=(a[d>>>24]<<24|a[l>>>16&255]<<16|a[h>>>8&255]<<8|a[255&u])^i[_++];t[e]=f,t[e+1]=g,t[e+2]=m,t[e+3]=T},keySize:8});e.AES=n._createHelper(g)}(),function(){function e(t,e){var i=(this._lBlock>>>t^this._rBlock)&e;this._rBlock^=i,this._lBlock^=i<<t}
function i(t,e){var i=(this._rBlock>>>t^this._lBlock)&e;this._lBlock^=i,this._rBlock^=i<<t}
var n=t,r=n.lib,c=r.WordArray,o=r.BlockCipher,a=n.algo,s=[57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4],l=[14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32],h=[1,2,4,6,8,10,12,14,15,17,19,21,23,25,27,28],u=[{0:8421888,268435456:32768,536870912:8421378,805306368:2,1073741824:512,1342177280:8421890,1610612736:8389122,1879048192:8388608,2147483648:514,2415919104:8389120,2684354560:33280,2952790016:8421376,3221225472:32770,3489660928:8388610,3758096384:0,4026531840:33282,134217728:0,402653184:8421890,671088640:33282,939524096:32768,1207959552:8421888,1476395008:512,1744830464:8421378,2013265920:2,2281701376:8389120,2550136832:33280,2818572288:8421376,3087007744:8389122,3355443200:8388610,3623878656:32770,3892314112:514,4160749568:8388608,1:32768,268435457:2,536870913:8421888,805306369:8388608,1073741825:8421378,1342177281:33280,1610612737:512,1879048193:8389122,2147483649:8421890,2415919105:8421376,2684354561:8388610,2952790017:33282,3221225473:514,3489660929:8389120,3758096385:32770,4026531841:0,134217729:8421890,402653185:8421376,671088641:8388608,939524097:512,1207959553:32768,1476395009:8388610,1744830465:2,2013265921:33282,2281701377:32770,2550136833:8389122,2818572289:514,3087007745:8421888,3355443201:8389120,3623878657:0,3892314113:33280,4160749569:8421378},{0:1074282512,16777216:16384,33554432:524288,50331648:1074266128,67108864:1073741840,83886080:1074282496,100663296:1073758208,117440512:16,134217728:540672,150994944:1073758224,167772160:1073741824,184549376:540688,201326592:524304,218103808:0,234881024:16400,251658240:1074266112,8388608:1073758208,25165824:540688,41943040:16,58720256:1073758224,75497472:1074282512,92274688:1073741824,109051904:524288,125829120:1074266128,142606336:524304,159383552:0,176160768:16384,192937984:1074266112,209715200:1073741840,226492416:540672,243269632:1074282496,260046848:16400,268435456:0,285212672:1074266128,301989888:1073758224,318767104:1074282496,335544320:1074266112,352321536:16,369098752:540688,385875968:16384,402653184:16400,419430400:524288,436207616:524304,452984832:1073741840,469762048:540672,486539264:1073758208,503316480:1073741824,520093696:1074282512,276824064:540688,293601280:524288,310378496:1074266112,327155712:16384,343932928:1073758208,360710144:1074282512,377487360:16,394264576:1073741824,411041792:1074282496,427819008:1073741840,444596224:1073758224,461373440:524304,478150656:0,494927872:16400,511705088:1074266128,528482304:540672},{0:260,1048576:0,2097152:67109120,3145728:65796,4194304:65540,5242880:67108868,6291456:67174660,7340032:67174400,8388608:67108864,9437184:67174656,10485760:65792,11534336:67174404,12582912:67109124,13631488:65536,14680064:4,15728640:256,524288:67174656,1572864:67174404,2621440:0,3670016:67109120,4718592:67108868,5767168:65536,6815744:65540,7864320:260,8912896:4,9961472:256,11010048:67174400,12058624:65796,13107200:65792,14155776:67109124,15204352:67174660,16252928:67108864,16777216:67174656,17825792:65540,18874368:65536,19922944:67109120,20971520:256,22020096:67174660,23068672:67108868,24117248:0,25165824:67109124,26214400:67108864,27262976:4,28311552:65792,29360128:67174400,30408704:260,31457280:65796,32505856:67174404,17301504:67108864,18350080:260,19398656:67174656,20447232:0,21495808:65540,22544384:67109120,23592960:256,24641536:67174404,25690112:65536,26738688:67174660,27787264:65796,28835840:67108868,29884416:67109124,30932992:67174400,31981568:4,33030144:65792},{0:2151682048,65536:2147487808,131072:4198464,196608:2151677952,262144:0,327680:4198400,393216:2147483712,458752:4194368,524288:2147483648,589824:4194304,655360:64,720896:2147487744,786432:2151678016,851968:4160,917504:4096,983040:2151682112,32768:2147487808,98304:64,163840:2151678016,229376:2147487744,294912:4198400,360448:2151682112,425984:0,491520:2151677952,557056:4096,622592:2151682048,688128:4194304,753664:4160,819200:2147483648,884736:4194368,950272:4198464,1015808:2147483712,1048576:4194368,1114112:4198400,1179648:2147483712,1245184:0,1310720:4160,1376256:2151678016,1441792:2151682048,1507328:2147487808,1572864:2151682112,1638400:2147483648,1703936:2151677952,1769472:4198464,1835008:2147487744,1900544:4194304,1966080:64,2031616:4096,1081344:2151677952,1146880:2151682112,1212416:0,1277952:4198400,1343488:4194368,1409024:2147483648,1474560:2147487808,1540096:64,1605632:2147483712,1671168:4096,1736704:2147487744,1802240:2151678016,1867776:4160,1933312:2151682048,1998848:4194304,2064384:4198464},{0:128,4096:17039360,8192:262144,12288:536870912,16384:537133184,20480:16777344,24576:553648256,28672:262272,32768:16777216,36864:537133056,40960:536871040,45056:553910400,49152:553910272,53248:0,57344:17039488,61440:553648128,2048:17039488,6144:553648256,10240:128,14336:17039360,18432:262144,22528:537133184,26624:553910272,30720:536870912,34816:537133056,38912:0,43008:553910400,47104:16777344,51200:536871040,55296:553648128,59392:16777216,63488:262272,65536:262144,69632:128,73728:536870912,77824:553648256,81920:16777344,86016:553910272,90112:537133184,94208:16777216,98304:553910400,102400:553648128,106496:17039360,110592:537133056,114688:262272,118784:536871040,122880:0,126976:17039488,67584:553648256,71680:16777216,75776:17039360,79872:537133184,83968:536870912,88064:17039488,92160:128,96256:553910272,100352:262272,104448:553910400,108544:0,112640:553648128,116736:16777344,120832:262144,124928:537133056,129024:536871040},{0:268435464,256:8192,512:270532608,768:270540808,1024:268443648,1280:2097152,1536:2097160,1792:268435456,2048:0,2304:268443656,2560:2105344,2816:8,3072:270532616,3328:2105352,3584:8200,3840:270540800,128:270532608,384:270540808,640:8,896:2097152,1152:2105352,1408:268435464,1664:268443648,1920:8200,2176:2097160,2432:8192,2688:268443656,2944:270532616,3200:0,3456:270540800,3712:2105344,3968:268435456,4096:268443648,4352:270532616,4608:270540808,4864:8200,5120:2097152,5376:268435456,5632:268435464,5888:2105344,6144:2105352,6400:0,6656:8,6912:270532608,7168:8192,7424:268443656,7680:270540800,7936:2097160,4224:8,4480:2105344,4736:2097152,4992:268435464,5248:268443648,5504:8200,5760:270540808,6016:270532608,6272:270540800,6528:270532616,6784:8192,7040:2105352,7296:2097160,7552:0,7808:268435456,8064:268443656},{0:1048576,16:33555457,32:1024,48:1049601,64:34604033,80:0,96:1,112:34603009,128:33555456,144:1048577,160:33554433,176:34604032,192:34603008,208:1025,224:1049600,240:33554432,8:34603009,24:0,40:33555457,56:34604032,72:1048576,88:33554433,104:33554432,120:1025,136:1049601,152:33555456,168:34603008,184:1048577,200:1024,216:34604033,232:1,248:1049600,256:33554432,272:1048576,288:33555457,304:34603009,320:1048577,336:33555456,352:34604032,368:1049601,384:1025,400:34604033,416:1049600,432:1,448:0,464:34603008,480:33554433,496:1024,264:1049600,280:33555457,296:34603009,312:1,328:33554432,344:1048576,360:1025,376:34604032,392:33554433,408:34603008,424:0,440:34604033,456:1049601,472:1024,488:33555456,504:1048577},{0:134219808,1:131072,2:134217728,3:32,4:131104,5:134350880,6:134350848,7:2048,8:134348800,9:134219776,10:133120,11:134348832,12:2080,13:0,14:134217760,15:133152,2147483648:2048,2147483649:134350880,2147483650:134219808,2147483651:134217728,2147483652:134348800,2147483653:133120,2147483654:133152,2147483655:32,2147483656:134217760,2147483657:2080,2147483658:131104,2147483659:134350848,2147483660:0,2147483661:134348832,2147483662:134219776,2147483663:131072,16:133152,17:134350848,18:32,19:2048,20:134219776,21:134217760,22:134348832,23:131072,24:0,25:131104,26:134348800,27:134219808,28:134350880,29:133120,30:2080,31:134217728,2147483664:131072,2147483665:2048,2147483666:134348832,2147483667:133152,2147483668:32,2147483669:134348800,2147483670:134217728,2147483671:134219808,2147483672:134350880,2147483673:134217760,2147483674:134219776,2147483675:0,2147483676:133120,2147483677:2080,2147483678:131104,2147483679:134350848}],d=[4160749569,528482304,33030144,2064384,129024,8064,504,2147483679],_=a.DES=o.extend({_doReset:function(){for(var t=this._key,e=t.words,i=[],n=0;n<56;n++){var r=s[n]-1;i[n]=e[r>>>5]>>>31-r%32&1}
for(var c=this._subKeys=[],o=0;o<16;o++){for(var a=c[o]=[],u=h[o],n=0;n<24;n++)
a[n/6|0]|=i[(l[n]-1+u)%28]<<31-n%6,a[4+(n/6|0)]|=i[28+(l[n+24]-1+u)%28]<<31-n%6;a[0]=a[0]<<1|a[0]>>>31;for(var n=1;n<7;n++)
a[n]=a[n]>>>4*(n-1)+3;a[7]=a[7]<<5|a[7]>>>27}
for(var d=this._invSubKeys=[],n=0;n<16;n++)
d[n]=c[15-n]},encryptBlock:function(t,e){this._doCryptBlock(t,e,this._subKeys)},decryptBlock:function(t,e){this._doCryptBlock(t,e,this._invSubKeys)},_doCryptBlock:function(t,n,r){this._lBlock=t[n],this._rBlock=t[n+1],e.call(this,4,252645135),e.call(this,16,65535),i.call(this,2,858993459),i.call(this,8,16711935),e.call(this,1,1431655765);for(var c=0;c<16;c++){for(var o=r[c],a=this._lBlock,s=this._rBlock,l=0,h=0;h<8;h++)
l|=u[h][((s^o[h])&d[h])>>>0];this._lBlock=s,this._rBlock=a^l}
var _=this._lBlock;this._lBlock=this._rBlock,this._rBlock=_,e.call(this,1,1431655765),i.call(this,8,16711935),i.call(this,2,858993459),e.call(this,16,65535),e.call(this,4,252645135),t[n]=this._lBlock,t[n+1]=this._rBlock},keySize:2,ivSize:2,blockSize:2});n.DES=o._createHelper(_);var p=a.TripleDES=o.extend({_doReset:function(){var t=this._key,e=t.words;this._des1=_.createEncryptor(c.create(e.slice(0,2))),this._des2=_.createEncryptor(c.create(e.slice(2,4))),this._des3=_.createEncryptor(c.create(e.slice(4,6)))},encryptBlock:function(t,e){this._des1.encryptBlock(t,e),this._des2.decryptBlock(t,e),this._des3.encryptBlock(t,e)},decryptBlock:function(t,e){this._des3.decryptBlock(t,e),this._des2.encryptBlock(t,e),this._des1.decryptBlock(t,e)},keySize:6,ivSize:2,blockSize:2});n.TripleDES=o._createHelper(p)}(),function(){function e(){for(var t=this._S,e=this._i,i=this._j,n=0,r=0;r<4;r++){e=(e+1)%256,i=(i+t[e])%256;var c=t[e];t[e]=t[i],t[i]=c,n|=t[(t[e]+t[i])%256]<<24-8*r}
return this._i=e,this._j=i,n}
var i=t,n=i.lib,r=n.StreamCipher,c=i.algo,o=c.RC4=r.extend({_doReset:function(){for(var t=this._key,e=t.words,i=t.sigBytes,n=this._S=[],r=0;r<256;r++)
n[r]=r;for(var r=0,c=0;r<256;r++){var o=r%i,a=e[o>>>2]>>>24-o%4*8&255;c=(c+n[r]+a)%256;var s=n[r];n[r]=n[c],n[c]=s}
this._i=this._j=0},_doProcessBlock:function(t,i){t[i]^=e.call(this)},keySize:8,ivSize:0});i.RC4=r._createHelper(o);var a=c.RC4Drop=o.extend({cfg:o.cfg.extend({drop:192}),_doReset:function(){o._doReset.call(this);for(var t=this.cfg.drop;t>0;t--)
e.call(this)}});i.RC4Drop=r._createHelper(a)}(),t.mode.CTRGladman=function(){function e(t){if(255==(t>>24&255)){var e=t>>16&255,i=t>>8&255,n=255&t;255===e?(e=0,255===i?(i=0,255===n?n=0:++n):++i):++e,t=0,t+=e<<16,t+=i<<8,t+=n}else
t+=1<<24;return t}
function i(t){return 0===(t[0]=e(t[0]))&&(t[1]=e(t[1])),t}
var n=t.lib.BlockCipherMode.extend(),r=n.Encryptor=n.extend({processBlock:function(t,e){var n=this._cipher,r=n.blockSize,c=this._iv,o=this._counter;c&&(o=this._counter=c.slice(0),this._iv=void 0),i(o);var a=o.slice(0);n.encryptBlock(a,0);for(var s=0;s<r;s++)
t[e+s]^=a[s]}});return n.Decryptor=r,n}(),function(){function e(){for(var t=this._X,e=this._C,i=0;i<8;i++)
a[i]=e[i];e[0]=e[0]+1295307597+this._b|0,e[1]=e[1]+3545052371+(e[0]>>>0<a[0]>>>0?1:0)|0,e[2]=e[2]+886263092+(e[1]>>>0<a[1]>>>0?1:0)|0,e[3]=e[3]+1295307597+(e[2]>>>0<a[2]>>>0?1:0)|0,e[4]=e[4]+3545052371+(e[3]>>>0<a[3]>>>0?1:0)|0,e[5]=e[5]+886263092+(e[4]>>>0<a[4]>>>0?1:0)|0,e[6]=e[6]+1295307597+(e[5]>>>0<a[5]>>>0?1:0)|0,e[7]=e[7]+3545052371+(e[6]>>>0<a[6]>>>0?1:0)|0,this._b=e[7]>>>0<a[7]>>>0?1:0;for(var i=0;i<8;i++){var n=t[i]+e[i],r=65535&n,c=n>>>16,o=((r*r>>>17)+r*c>>>15)+c*c,l=((4294901760&n)*n|0)+((65535&n)*n|0);s[i]=o^l}
t[0]=s[0]+(s[7]<<16|s[7]>>>16)+(s[6]<<16|s[6]>>>16)|0,t[1]=s[1]+(s[0]<<8|s[0]>>>24)+s[7]|0,t[2]=s[2]+(s[1]<<16|s[1]>>>16)+(s[0]<<16|s[0]>>>16)|0,t[3]=s[3]+(s[2]<<8|s[2]>>>24)+s[1]|0,t[4]=s[4]+(s[3]<<16|s[3]>>>16)+(s[2]<<16|s[2]>>>16)|0,t[5]=s[5]+(s[4]<<8|s[4]>>>24)+s[3]|0,t[6]=s[6]+(s[5]<<16|s[5]>>>16)+(s[4]<<16|s[4]>>>16)|0,t[7]=s[7]+(s[6]<<8|s[6]>>>24)+s[5]|0}
var i=t,n=i.lib,r=n.StreamCipher,c=i.algo,o=[],a=[],s=[],l=c.Rabbit=r.extend({_doReset:function(){for(var t=this._key.words,i=this.cfg.iv,n=0;n<4;n++)
t[n]=16711935&(t[n]<<8|t[n]>>>24)|4278255360&(t[n]<<24|t[n]>>>8);var r=this._X=[t[0],t[3]<<16|t[2]>>>16,t[1],t[0]<<16|t[3]>>>16,t[2],t[1]<<16|t[0]>>>16,t[3],t[2]<<16|t[1]>>>16],c=this._C=[t[2]<<16|t[2]>>>16,4294901760&t[0]|65535&t[1],t[3]<<16|t[3]>>>16,4294901760&t[1]|65535&t[2],t[0]<<16|t[0]>>>16,4294901760&t[2]|65535&t[3],t[1]<<16|t[1]>>>16,4294901760&t[3]|65535&t[0]];this._b=0;for(var n=0;n<4;n++)
e.call(this);for(var n=0;n<8;n++)
c[n]^=r[n+4&7];if(i){var o=i.words,a=o[0],s=o[1],l=16711935&(a<<8|a>>>24)|4278255360&(a<<24|a>>>8),h=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8),u=l>>>16|4294901760&h,d=h<<16|65535&l;c[0]^=l,c[1]^=u,c[2]^=h,c[3]^=d,c[4]^=l,c[5]^=u,c[6]^=h,c[7]^=d;for(var n=0;n<4;n++)
e.call(this)}},_doProcessBlock:function(t,i){var n=this._X;e.call(this),o[0]=n[0]^n[5]>>>16^n[3]<<16,o[1]=n[2]^n[7]>>>16^n[5]<<16,o[2]=n[4]^n[1]>>>16^n[7]<<16,o[3]=n[6]^n[3]>>>16^n[1]<<16;for(var r=0;r<4;r++)
o[r]=16711935&(o[r]<<8|o[r]>>>24)|4278255360&(o[r]<<24|o[r]>>>8),t[i+r]^=o[r]},blockSize:4,ivSize:2});i.Rabbit=r._createHelper(l)}(),t.mode.CTR=function(){var e=t.lib.BlockCipherMode.extend(),i=e.Encryptor=e.extend({processBlock:function(t,e){var i=this._cipher,n=i.blockSize,r=this._iv,c=this._counter;r&&(c=this._counter=r.slice(0),this._iv=void 0);var o=c.slice(0);i.encryptBlock(o,0),c[n-1]=c[n-1]+1|0;for(var a=0;a<n;a++)
t[e+a]^=o[a]}});return e.Decryptor=i,e}(),function(){function e(){for(var t=this._X,e=this._C,i=0;i<8;i++)
a[i]=e[i];e[0]=e[0]+1295307597+this._b|0,e[1]=e[1]+3545052371+(e[0]>>>0<a[0]>>>0?1:0)|0,e[2]=e[2]+886263092+(e[1]>>>0<a[1]>>>0?1:0)|0,e[3]=e[3]+1295307597+(e[2]>>>0<a[2]>>>0?1:0)|0,e[4]=e[4]+3545052371+(e[3]>>>0<a[3]>>>0?1:0)|0,e[5]=e[5]+886263092+(e[4]>>>0<a[4]>>>0?1:0)|0,e[6]=e[6]+1295307597+(e[5]>>>0<a[5]>>>0?1:0)|0,e[7]=e[7]+3545052371+(e[6]>>>0<a[6]>>>0?1:0)|0,this._b=e[7]>>>0<a[7]>>>0?1:0;for(var i=0;i<8;i++){var n=t[i]+e[i],r=65535&n,c=n>>>16,o=((r*r>>>17)+r*c>>>15)+c*c,l=((4294901760&n)*n|0)+((65535&n)*n|0);s[i]=o^l}
t[0]=s[0]+(s[7]<<16|s[7]>>>16)+(s[6]<<16|s[6]>>>16)|0,t[1]=s[1]+(s[0]<<8|s[0]>>>24)+s[7]|0,t[2]=s[2]+(s[1]<<16|s[1]>>>16)+(s[0]<<16|s[0]>>>16)|0,t[3]=s[3]+(s[2]<<8|s[2]>>>24)+s[1]|0,t[4]=s[4]+(s[3]<<16|s[3]>>>16)+(s[2]<<16|s[2]>>>16)|0,t[5]=s[5]+(s[4]<<8|s[4]>>>24)+s[3]|0,t[6]=s[6]+(s[5]<<16|s[5]>>>16)+(s[4]<<16|s[4]>>>16)|0,t[7]=s[7]+(s[6]<<8|s[6]>>>24)+s[5]|0}
var i=t,n=i.lib,r=n.StreamCipher,c=i.algo,o=[],a=[],s=[],l=c.RabbitLegacy=r.extend({_doReset:function(){var t=this._key.words,i=this.cfg.iv,n=this._X=[t[0],t[3]<<16|t[2]>>>16,t[1],t[0]<<16|t[3]>>>16,t[2],t[1]<<16|t[0]>>>16,t[3],t[2]<<16|t[1]>>>16],r=this._C=[t[2]<<16|t[2]>>>16,4294901760&t[0]|65535&t[1],t[3]<<16|t[3]>>>16,4294901760&t[1]|65535&t[2],t[0]<<16|t[0]>>>16,4294901760&t[2]|65535&t[3],t[1]<<16|t[1]>>>16,4294901760&t[3]|65535&t[0]];this._b=0;for(var c=0;c<4;c++)
e.call(this);for(var c=0;c<8;c++)
r[c]^=n[c+4&7];if(i){var o=i.words,a=o[0],s=o[1],l=16711935&(a<<8|a>>>24)|4278255360&(a<<24|a>>>8),h=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8),u=l>>>16|4294901760&h,d=h<<16|65535&l;r[0]^=l,r[1]^=u,r[2]^=h,r[3]^=d,r[4]^=l,r[5]^=u,r[6]^=h,r[7]^=d;for(var c=0;c<4;c++)
e.call(this)}},_doProcessBlock:function(t,i){var n=this._X;e.call(this),o[0]=n[0]^n[5]>>>16^n[3]<<16,o[1]=n[2]^n[7]>>>16^n[5]<<16,o[2]=n[4]^n[1]>>>16^n[7]<<16,o[3]=n[6]^n[3]>>>16^n[1]<<16;for(var r=0;r<4;r++)
o[r]=16711935&(o[r]<<8|o[r]>>>24)|4278255360&(o[r]<<24|o[r]>>>8),t[i+r]^=o[r]},blockSize:4,ivSize:2});i.RabbitLegacy=r._createHelper(l)}(),t.pad.ZeroPadding={pad:function(t,e){var i=4*e;t.clamp(),t.sigBytes+=i-(t.sigBytes%i||i)},unpad:function(t){for(var e=t.words,i=t.sigBytes-1;!(e[i>>>2]>>>24-i%4*8&255);)
i--;t.sigBytes=i+1}},CryptoJSs=t;}
function a(t){var CryptoJS=new CryptoJSs;var e=CryptoJS.enc.Utf8.parse("fn0chlrwxspujttbg9feqfatelupq0q1qc9ukx1ykifkco9rfqepqd4tk4ymshn0"),i=CryptoJS.enc.Utf8.parse(t),n=CryptoJS.enc.Hex.parse("00000000"),r=CryptoJS.TripleDES.encrypt(i,e,{iv:n});return encodeURIComponent(r.toString())}
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
