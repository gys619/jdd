/*
Last Modified time: 2021-6-6 21:22:37
宠汪汪邀请助力与赛跑助力脚本，感谢github@Zero-S1提供帮助
活动入口：京东APP我的-更多工具-宠汪汪
token时效很短，几个小时就失效了,闲麻烦的放弃就行
每天拿到token后，可一次性运行完毕即可。
互助码friendPin是京东用户名，不是昵称（可在京东APP->我的->设置 查看获得）
token获取途径：
1、微信搜索'来客有礼'小程序,登陆京东账号，点击底部的'我的'或者'发现'两处地方,即可获取Token，脚本运行提示token失效后，继续按此方法获取即可
2、或者每天去'来客有礼'小程序->宠汪汪里面，领狗粮->签到领京豆 也可获取Token(此方法每天只能获取一次)
脚本里面有内置提供的friendPin，如果你没有修改脚本或者BoxJs处填写自己的互助码，会默认给脚本内置的助力。

docker 设置环境变量 JOY_RUN_HELP_MYSELF 为true,则开启账号内部互助.默认关闭(即给脚本作者内置的助力).

[MITM]
hostname = draw.jdfcloud.com

===========Surge=================
[Script]
宠汪汪邀请助力与赛跑助力 = type=cron,cronexp="15 10 * * *",wake-system=1,timeout=3600,script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_joy_run.js
宠汪汪助力更新Token = type=http-response,pattern=^https:\/\/draw\.jdfcloud\.com(\/mirror)?\/\/api\/user\/addUser\?code=, requires-body=1, max-size=0, script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_joy_run.js
宠汪汪助力获取Token = type=http-request,pattern=^https:\/\/draw\.jdfcloud\.com(\/mirror)?\/\/api\/user\/user\/detail\?openId=, max-size=0, script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_joy_run.js

===================Quantumult X=====================
[task_local]
# 宠汪汪邀请助力与赛跑助力
15 10 * * * https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_joy_run.js, tag=宠汪汪邀请助力与赛跑助力, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jdcww.png, enabled=true
[rewrite_local]
# 宠汪汪助力更新Token
^https:\/\/draw\.jdfcloud\.com(\/mirror)?\/\/api\/user\/addUser\?code= url script-response-body https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_joy_run.js
# 宠汪汪助力获取Token
^https:\/\/draw\.jdfcloud\.com(\/mirror)?\/\/api\/user\/user\/detail\?openId= url script-request-header https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_joy_run.js

=====================Loon=====================
[Script]
cron "15 10 * * *" script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_joy_run.js, tag=宠汪汪邀请助力与赛跑助力
http-response ^https:\/\/draw\.jdfcloud\.com(\/mirror)?\/\/api\/user\/addUser\?code= script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_joy_run.js, requires-body=true, timeout=10, tag=宠汪汪助力更新Token
http-request ^https:\/\/draw\.jdfcloud\.com(\/mirror)?\/\/api\/user\/user\/detail\?openId= script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_joy_run.js, timeout=3600, tag=宠汪汪助力获取Token
*/
const $ = new Env('宠汪汪赛跑');
const zooFaker = require('./utils/JDJRValidator_Pure');
$.get = zooFaker.injectToRequest2($.get.bind($));
$.post = zooFaker.injectToRequest2($.post.bind($));
//宠汪汪赛跑所需token，默认读取作者服务器的
//需自行抓包，宠汪汪小程序获取token，点击`发现`或`我的`，寻找`^https:\/\/draw\.jdfcloud\.com(\/mirror)?\/\/api\/user\/user\/detail\?openId=`获取token
let jdJoyRunToken = '';

const isRequest = typeof $request != "undefined"
const JD_BASE_API = `https://draw.jdfcloud.com//pet`;
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : {};
//下面给出好友邀请助力的示例填写规则
let invite_pins = ['zhaosen2580,jd_47ee22449e303,jd_6c5e39478ec3b,jd_4346918b58d6e,liuz9988,88489948,jd_61f1269fd3236,jaysherlock'];
//下面给出好友赛跑助力的示例填写规则
let run_pins = ['zhaosen2580,jd_47ee22449e303,jd_6c5e39478ec3b,jd_4346918b58d6e,liuz9988,88489948,jd_61f1269fd3236,jaysherlock'];
//friendsArr内置太多会导致IOS端部分软件重启,可PR过来(此处目的:帮别人助力可得30g狗粮)
let friendsArr = ["zhaosen2580", "jd_47ee22449e303", "jd_6c5e39478ec3b", "jd_4346918b58d6e", "liuz9988", "88489948", "jd_61f1269fd3236", "jaysherlock"]


//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '';
let nowTimes = new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000);
const headers = {
  'Connection' : 'keep-alive',
  'Accept-Encoding' : 'gzip, deflate, br',
  'App-Id' : '',
  'Lottery-Access-Signature' : '',
  'Content-Type' : 'application/json',
  'reqSource' : 'weapp',
  // 'User-Agent' : $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
  'User-Agent' : "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
  'Cookie' : '',
  'openId' : '',
  'Host' : 'draw.jdfcloud.com',
  'Referer' : 'https://servicewechat.com/wxccb5c536b0ecd1bf/633/page-frame.html',
  'Accept-Language' : 'zh-cn',
  'Accept' : '*/*',
  'LKYLToken' : ''
}
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
} else {
  //支持 "京东多账号 Ck 管理"的cookie
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
  if ($.getdata('jd_joy_invite_pin')) {
    invite_pins = [];
    invite_pins.push($.getdata('jd_joy_invite_pin'));
  }
  if ($.getdata('jd2_joy_invite_pin')) {
    if (invite_pins.length > 0) {
      invite_pins.push($.getdata('jd2_joy_invite_pin'))
    } else {
      invite_pins = [];
      invite_pins.push($.getdata('jd2_joy_invite_pin'));
    }
  }
  if ($.getdata('jd_joy_run_pin')) {
    run_pins = []
    run_pins.push($.getdata('jd_joy_run_pin'));
  }
  if ($.getdata('jd2_joy_run_pin')) {
    if (run_pins.length > 0) {
      run_pins.push($.getdata('jd2_joy_run_pin'))
    } else {
      run_pins = [];
      run_pins.push($.getdata('jd2_joy_run_pin'));
    }
  }
}
async function main() {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  const readTokenRes = await readToken();
  if (readTokenRes && readTokenRes.code === 200) {
    $.LKYLToken = readTokenRes.data[0] || ($.isNode() ? (process.env.JOY_RUN_TOKEN ? process.env.JOY_RUN_TOKEN : jdJoyRunToken) : ($.getdata('jdJoyRunToken') || jdJoyRunToken));
  } else {
    $.LKYLToken = $.isNode() ? (process.env.JOY_RUN_TOKEN ? process.env.JOY_RUN_TOKEN : jdJoyRunToken) : ($.getdata('jdJoyRunToken') || jdJoyRunToken);
  }
  console.log(`打印token：${$.LKYLToken ? $.LKYLToken : '暂无token'}\n`)
  if (!$.LKYLToken) {
    $.msg($.name, '【提示】请先获取来客有礼宠汪汪token', "iOS用户微信搜索'来客有礼'小程序\n点击底部的'发现'Tab\n即可获取Token");
    // return;
  }
  await getFriendPins();
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      $.validate = '';
      // const zooFaker = require('./utils/JDJRValidator_Pure');
      // $.validate = await zooFaker.injectToRequest()
      if ($.isNode()) {
        if (process.env.JOY_RUN_HELP_MYSELF) {
          console.log(`\n赛跑会先给账号内部助力,如您当前账户有剩下助力机会则为lx0301作者助力\n`)
          let my_run_pins = [];
          Object.values(jdCookieNode).filter(item => item.match(/pt_pin=([^; ]+)(?=;?)/)).map(item => my_run_pins.push(decodeURIComponent(item.match(/pt_pin=([^; ]+)(?=;?)/)[1])))
          run_pins = [...new Set(my_run_pins), [...getRandomArrayElements([...run_pins[0].split(',')], [...run_pins[0].split(',')].length)]];
          run_pins = [[...run_pins].join(',')];
          invite_pins = run_pins;
        } else {
          console.log(`\n赛跑先给作者两个固定的pin进行助力,然后从账号内部与剩下的固定位置合并后随机抽取进行助力\n如需自己账号内部互助,设置环境变量 JOY_RUN_HELP_MYSELF 为true,则开启账号内部互助\n`)
          run_pins = run_pins[0].split(',')
          Object.values(jdCookieNode).filter(item => item.match(/pt_pin=([^; ]+)(?=;?)/)).map(item => run_pins.push(decodeURIComponent(item.match(/pt_pin=([^; ]+)(?=;?)/)[1])))
          run_pins = [...new Set(run_pins)];
          let fixPins = run_pins.splice(run_pins.indexOf('zhaosen2580'), 1);
          // fixPins.push(...run_pins.splice(run_pins.indexOf('jd_61f1269fd3236'), 1));
          const randomPins = getRandomArrayElements(run_pins, run_pins.length);
          run_pins = [[...fixPins, ...randomPins].join(',')];
          invite_pins = run_pins;
        }
      }
      cookie = cookiesArr[i];
      UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.inviteReward = 0;
      $.runReward = 0;
      console.log(`\n开始【京东账号${$.index}】${UserName}\n`);
      $.jdLogin = true;
      $.LKYLLogin = true;
      console.log(`=============【开始邀请助力】===============`)
      const inviteIndex = $.index > invite_pins.length ? (invite_pins.length - 1) : ($.index - 1);
      let new_invite_pins = invite_pins[inviteIndex].split(',');
      new_invite_pins = [...new_invite_pins, ...getRandomArrayElements(friendsArr, friendsArr.length >= 18 ? 18 : friendsArr.length)];
      await invite(new_invite_pins);
      if ($.jdLogin && $.LKYLLogin) {
        if (nowTimes.getHours() >= 9 && nowTimes.getHours() < 21) {
          console.log(`===========【开始助力好友赛跑】===========`)
          const runIndex = $.index > run_pins.length ? (run_pins.length - 1) : ($.index - 1);
          let new_run_pins = run_pins[runIndex].split(',');
          await run(new_run_pins);
        } else {
          console.log(`非赛跑时间\n`)
        }
      }
      await showMsg();
    }
  }
  $.done()
}
//获取来客有礼Token
let count = 0;
async function getToken() {
  const url = $request.url;
  $.log(`${$.name}url\n${url}\n`)
  if (isURL(url, /^https:\/\/draw\.jdfcloud\.com(\/mirror)?\/\/api\/user\/addUser\?code=/)) {
    const body = JSON.parse($response.body);
    const LKYLToken = body.data && body.data.token;
    if (LKYLToken) {
      $.log(`${$.name} token\n${LKYLToken}\n`);
      $.msg($.name, '更新Token: 成功🎉', ``);
      console.log(`\nToken，${LKYLToken}\n`)
      $.http.post({
        url: `http://share.turinglabs.net/api/v3/create/sharecode/`,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "activity_name": "joy",
          "share_code": LKYLToken,
        }),
        timeout: 30000
      }).then((resp) => {
        if (resp.statusCode === 200) {
          try {
            let { body } = resp;
            console.log(`Token提交结果:${body}\n`)
            body = JSON.parse(body);
            console.log(`${body.message}`)
          } catch (e) {
            console.log(`提交Token异常:${e}`)
          }
        }
      }).catch((e) => console.log(`catch 宠汪汪TOKEN提交异常:${e}`));
      // count = $.getdata('countFlag') ? $.getdata('countFlag') * 1 : 0;
      // count ++;
      // console.log(`count: ${count}`)
      // $.setdata(`${count}`, 'countFlag');
      // if ($.getdata('countFlag') * 1 === 2) {
      //   count = 0;
      //   $.setdata(`${count}`, 'countFlag');
      //   $.msg($.name, '更新Token: 成功🎉', ``);
      //   console.log(`开始上传Token，${LKYLToken}\n`)
      //   await $.http.get({url: `http://jd.turinglabs.net/api/v2/jd/joy/create/${LKYLToken}/`}).then((resp) => {
      //     if (resp.statusCode === 200) {
      //       let { body } = resp;
      //       console.log(`Token提交结果:${body}\n`)
      //       body = JSON.parse(body);
      //       console.log(`${body.message}`)
      //     }
      //   });
      // }
      $.setdata(LKYLToken, 'jdJoyRunToken');
    }
    $.done({ body: JSON.stringify(body) })
  } else if (isURL(url, /^https:\/\/draw\.jdfcloud\.com(\/mirror)?\/\/api\/user\/user\/detail\?openId=/)){
    if ($request && $request.method !== 'OPTIONS') {
      const LKYLToken = $request.headers['LKYLToken'];
      //if ($.getdata('jdJoyRunToken')) {
      //if ($.getdata('jdJoyRunToken') !== LKYLToken) {

      //}
      //$.msg($.name, '更新获取Token: 成功🎉', `\n${LKYLToken}\n`);
      //} else {
      //$.msg($.name, '获取Token: 成功🎉', `\n${LKYLToken}\n`);
      //}
      $.setdata(LKYLToken, 'jdJoyRunToken');

      $.msg($.name, '获取Token: 成功🎉', ``);

      // $.done({ body: JSON.stringify(body) })
      $.done({ url: url })
    }
  } else {
    $.done()
  }
}
function readToken() {
  return new Promise(resolve => {
    $.get({
      url: `https://cdn.nz.lu/gettoken`,
      headers: {
        'Host': 'jdsign.cf',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88'
      },
      timeout: 30 * 1000
    }, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // if ($.isNode() && !run_pins[0].includes("被折叠的记忆33")) resolve(null);
            console.log(`\n\n搬运我脚本修改我内置互助码的，请不要盗取我服务器token\n\n\n`)
            data = JSON.parse(data);
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

function showMsg() {
  return new Promise(async resolve => {
    if ($.inviteReward || $.runReward) {
      let message = '';
      if ($.inviteReward > 0) {
        message += `给${$.inviteReward / 30}人邀请助力成功,获得${$.inviteReward}积分\n`;
      }
      if ($.runReward > 0) {
        message += `给${$.runReward / 5}人赛跑助力成功,获得狗粮${$.runReward}g`;
      }
      if (message) {
        $.msg($.name, '', `京东账号${$.index} ${UserName}\n${message}`);
      }
    }
    resolve();
  })
}
//邀请助力
async function invite(invite_pins) {
  console.log(`账号${$.index} [${UserName}] 给下面名单的人进行邀请助力\n${invite_pins.map(item => item.trim())}\n`);
  for (let item of invite_pins.map(item => item.trim())) {
    console.log(`\n账号${$.index} [${UserName}] 开始给好友 [${item}] 进行邀请助力`)
    if (UserName === item) {
      console.log(`自己账号，跳过`);
      continue
    }
    const data = await enterRoom(item);
    if (data) {
      if (data.success) {
        const { helpStatus } = data.data;
        console.log(`helpStatus ${helpStatus}`)
        if (helpStatus=== 'help_full') {
          console.log(`您的邀请助力机会已耗尽\n`)
          break;
        } else if (helpStatus=== 'cannot_help') {
          console.log(`已给该好友 ${item} 助力过或者此friendPin是你自己\n`)
        } else if (helpStatus=== 'invite_full') {
          console.log(`助力失败，该好友 ${item} 已经满3人给他助力了,无需您再次助力\n`)
        } else if (helpStatus=== 'can_help') {
          console.log(`开始给好友 ${item} 助力\n`)
          const LKYL_DATA = await helpInviteFriend(item);
          if (LKYL_DATA.errorCode === 'L0001' && !LKYL_DATA.success) {
            console.log('来客有礼宠汪汪token失效');
            $.setdata('', 'jdJoyRunToken');
            $.msg($.name, '【提示】来客有礼token失效，请重新获取', "iOS用户微信搜索'来客有礼'小程序\n点击底部的'发现'Tab\n即可获取Token")
            $.LKYLLogin = false;
            break
          } else {
            $.LKYLLogin = true;
          }
        }
        $.jdLogin = true;
      } else {
        if (data.errorCode === 'B0001') {
          console.log('京东Cookie失效');
          $.msg($.name, `【提示】京东cookie已失效`, `京东账号${$.index} ${UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
          $.jdLogin = false;
          break
        }
      }
    }
  }
  // if ($.inviteReward > 0) {
  //   $.msg($.name, ``, `账号${$.index} [${UserName}]\n给${$.inviteReward/5}人邀请助力成功\n获得${$.inviteReward}积分`)
  // }
}
function enterRoom(invitePin) {
  return new Promise(resolve => {
    let lkt = new Date().getTime()
    let lks = $.md5('' + 'JL1VTNRadM68cIMQ' + lkt).toString()
    headers['lkt'] = lkt;
    headers['lks'] = lks;
    headers.Cookie = cookie;
    headers.LKYLToken = $.LKYLToken;
    headers['Content-Type'] = "application/json";
    let opt = {
      // url: "//jdjoy.jd.com/common/pet/getPetTaskConfig?reqSource=h5",
      url: `//draw.jdfcloud.com/common/pet/enterRoom/h5?reqSource=h5&invitePin=${encodeURI(invitePin)}&inviteSource=task_invite&shareSource=weapp&inviteTimeStamp=${Date.now()}&invokeKey=JL1VTNRadM68cIMQ`,
      method: "GET",
      data: {},
      credentials: "include",
      header: {"content-type": "application/json"}
    }
    const url = "https:"+ taroRequest(opt)['url'] + $.validate;
    const options = {
      url,
      body: '{}',
      headers
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          $.log(`${$.name} API请求失败`)
          $.log(JSON.stringify(err))
        } else {
          // console.log('进入房间', data)
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    });
  })
}
function helpInviteFriend(friendPin) {
  return new Promise((resolve) => {
    let lkt = new Date().getTime()
    let lks = $.md5('' + 'JL1VTNRadM68cIMQ' + lkt).toString()
    headers['lkt'] = lkt;
    headers['lks'] = lks;
    headers.Cookie = cookie;
    headers.LKYLToken = $.LKYLToken;
    let opt = {
      // url: "//jdjoy.jd.com/common/pet/getPetTaskConfig?reqSource=h5",
      url: `//draw.jdfcloud.com/common/pet/helpFriend?friendPin=${encodeURI(friendPin)}&reqSource=h5&invokeKey=JL1VTNRadM68cIMQ`,
      method: "GET",
      data: {},
      credentials: "include",
      header: {"content-type": "application/json"}
    }
    const url = "https:"+ taroRequest(opt)['url'] + $.validate;
    const options = {
      url,
      headers
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          $.log('API请求失败')
          $.logErr(JSON.stringify(err));
        } else {
          $.log(`邀请助力结果：${data}`);
          data = JSON.parse(data);
          // {"errorCode":"help_ok","errorMessage":null,"currentTime":1600254297789,"data":29466,"success":true}
          if (data.success && data.errorCode === 'help_ok') {
            $.inviteReward += 30;
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    });
  })
}
//赛跑助力
async function run(run_pins) {
  console.log(`账号${$.index} [${UserName}] 给下面名单的人进行赛跑助力\n${(run_pins.map(item => item.trim()))}\n`);
  for (let item of run_pins.map(item => item.trim())) {
    console.log(`\n账号${$.index} [${UserName}] 开始给好友 [${item}] 进行赛跑助力`)
    if (UserName === item) {
      console.log(`自己账号，跳过`);
      continue
    }
    const combatDetailRes = await combatDetail(item);
    const { petRaceResult } = combatDetailRes.data;
    console.log(`petRaceResult ${petRaceResult}`);
    if (petRaceResult === 'help_full') {
      console.log('您的赛跑助力机会已耗尽');
      break;
    } else if (petRaceResult === 'can_help') {
      console.log(`开始赛跑助力好友 ${item}`)
      const LKYL_DATA = await combatHelp(item);
      if (LKYL_DATA.errorCode === 'L0001' && !LKYL_DATA.success) {
        console.log('来客有礼宠汪汪token失效');
        $.setdata('', 'jdJoyRunToken');
        $.msg($.name, '【提示】来客有礼token失效，请重新获取', "iOS用户微信搜索'来客有礼'小程序\n点击底部的'发现'Tab\n即可获取Token")
        $.LKYLLogin = false;
        break
      } else {
        $.LKYLLogin = true;
      }
    }
  }
  // if ($.runReward > 0) {
  //   $.msg($.name, ``, `账号${$.index} [${UserName}]\n给${$.runReward/5}人赛跑助力成功\n获得狗粮${$.runReward}g`)
  // }
}
function combatHelp(friendPin) {
  return new Promise(resolve => {
    let lkt = new Date().getTime()
    let lks = $.md5('' + 'JL1VTNRadM68cIMQ' + lkt).toString()
    headers['lkt'] = lkt;
    headers['lks'] = lks;
    headers.Cookie = cookie;
    headers.LKYLToken = $.LKYLToken;
    let opt = {
      // url: "//jdjoy.jd.com/common/pet/getPetTaskConfig?reqSource=h5",
      url: `//draw.jdfcloud.com//common/pet/combat/help?friendPin=${encodeURI(friendPin)}&invokeKey=JL1VTNRadM68cIMQ`,
      method: "GET",
      data: {},
      credentials: "include",
      header: {"content-type": "application/json"}
    }
    const url = "https:"+ taroRequest(opt)['url'] + $.validate;
    const options = {
      url,
      headers
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          $.log('API请求失败')
          $.logErr(JSON.stringify(err));
        } else {
          $.log(`赛跑助力结果${data}`);
          data = JSON.parse(data);
          // {"errorCode":"help_ok","errorMessage":null,"currentTime":1600479266133,"data":{"rewardNum":5,"helpStatus":"help_ok","newUser":false},"success":true}
          if (data.errorCode === 'help_ok' && data.data.helpStatus === 'help_ok') {
            console.log(`助力${friendPin}成功\n获得狗粮${data.data.rewardNum}g\n`);
            $.runReward += data.data.rewardNum;
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    });
  })
}
function combatDetail(invitePin) {
  return new Promise(resolve => {
    let lkt = new Date().getTime()
    let lks = $.md5('' + 'JL1VTNRadM68cIMQ' + lkt).toString()
    headers['lkt'] = lkt;
    headers['lks'] = lks;
    headers.Cookie = cookie;
    headers.LKYLToken = $.LKYLToken;
    let opt = {
      // url: "//jdjoy.jd.com/common/pet/getPetTaskConfig?reqSource=h5",
      url: `//draw.jdfcloud.com/common/pet/combat/detail/v2?help=true&inviterPin=${encodeURI(invitePin)}&reqSource=h5&invokeKey=JL1VTNRadM68cIMQ`,
      method: "GET",
      data: {},
      credentials: "include",
      header: {"content-type": "application/json"}
    }
    const url = "https:"+ taroRequest(opt)['url'] + $.validate;
    const options = {
      url,
      headers
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          $.log('API请求失败')
          $.logErr(JSON.stringify(err));
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    });
  })
}
function isURL(domain, reg) {
  // const name = reg;
  return reg.test(domain);
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
function getRandomArrayElements(arr, count) {
  let shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}
function getFriendPins() {
  return new Promise(resolve => {
    $.get({
      url: "https://cdn.jsdelivr.net/gh/gitupdate/friendPin@main/friendPins.json",
      headers:{
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      },
      timeout: 100000}, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`getFriendPins::${JSON.stringify(err)}`);
        } else {
          $.friendPins = data && JSON.parse(data);
          if ($.friendPins && $.friendPins['friendsArr']) {
            friendsArr = $.friendPins['friendsArr'];
            console.log(`\n共提供 ${friendsArr.length}个好友供来进行邀请助力\n`)
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
isRequest ? getToken() : main();


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
