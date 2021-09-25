/*

https://prodev.m.jd.com/mall/active/2VyRHGE7jM1igBJcrjoB6ak1JJWV/index.html


如需加购请设置环境变量[guaunknownTask_addSku1]为"true"

27 14 * 9 * https://raw.githubusercontent.com/smiek2221/scripts/master/gua_UnknownTask1.js
*/
const $ = new Env('电脑配件');
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

let guaunknownTask_addSku = "false"
guaunknownTask_addSku = $.isNode() ? (process.env.guaunknownTask_addSku1 ? process.env.guaunknownTask_addSku1 : `${guaunknownTask_addSku}`) : ($.getdata('guaunknownTask_addSku1') ? $.getdata('guaunknownTask_addSku1') : `${guaunknownTask_addSku}`);
guaunknownTask_addSku = $.isNode() ? (process.env.guaunknownTask_addSku_All ? process.env.guaunknownTask_addSku_All : `${guaunknownTask_addSku}`) : ($.getdata('guaunknownTask_addSku_All') ? $.getdata('guaunknownTask_addSku_All') : `${guaunknownTask_addSku}`);
allMessage = ""
message = ""
$.hotFlag = false
$.outFlag = 0
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
      "open-url": "https://bean.m.jd.com/"
    });
    return;
  }
  MD5()
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
      if($.bean > 0 || message) {
        let msg = `【京东账号${$.index}】${$.nickName || $.UserName}\n${$.bean > 0 && "获得"+$.bean+"京豆\n" || ""}${message}\n`
        $.msg($.name, ``, msg);
        allMessage += msg
      }
    }
    if($.outFlag != 0) break
  }
  if(allMessage){
    $.msg($.name, ``, `${allMessage}\n`);
    if ($.isNode()){
      await notify.sendNotify(`${$.name}`, `${allMessage}\n`);
    }
  }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())


async function run() {
  try {
    $.list = ''
    await indexInfo();
    if($.hotFlag) message += `活动太火爆\n`
    if($.hotFlag) return
    if($.list){
      for(let i in $.list || []){
        $.oneTask = $.list[i]
        if(guaunknownTask_addSku+"" != "true" && $.oneTask.taskName.indexOf('加购') > -1) console.log('\n如需加购请设置环境变量[guaunknownTask_addSku1]为"true"\n');
        if(guaunknownTask_addSku+"" != "true" && $.oneTask.taskName.indexOf('加购') > -1) continue;
        for(let j in $.oneTask.taskList || []){
          $.task = $.oneTask.taskList[j]
          console.log(`[${$.oneTask.taskName}] ${$.task.name} ${$.task.status == 4 && '已完成' || $.task.status == 3 && '未领取' || '未完成'}`)
          if($.task.status != 4) await doTask('doTask', $.task.id, $.oneTask.taskId);
          if($.oneTask.taskId == 3 && $.task.status != 4){
            await $.wait(parseInt(Math.random() * 1000 + 6000, 10))
            await doTask('getPrize', $.task.id, $.oneTask.taskId);
          }
          if($.outFlag != 0) {
            message += "\n京豆库存已空，退出脚本\n"
            return
          }
          if($.task.status != 4) await $.wait(parseInt(Math.random() * 1000 + 3000, 10))
        }
      }
    }else{
      console.log('获取不到任务')
    }
    await indexInfo();
    await $.wait(parseInt(Math.random() * 1000 + 2000, 10))
    if($.extraTaskStatus == 3 && $.outFlag == 0) await extraTaskPrize();
    await $.wait(parseInt(Math.random() * 1000 + 3000, 10))
  } catch (e) {
    console.log(e)
  }
}

function indexInfo() {
  return new Promise(async resolve => {
    let sign = getSign("/tzh/combination/indexInfo",{"activityId": 11})
    $.get({
      url: `https://combination.m.jd.com/tzh/combination/indexInfo?activityId=11&t=${sign.timestamp}`,
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json;charset=utf-8',
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        'Cookie': cookie,
        'User-Agent': $.UA,
        'sign': sign.sign,
        'timestamp': sign.timestamp
      }
    }, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.toStr(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          // console.log(data)
          let res = $.toObj(data)
          if(typeof res == 'object'){
            if(res.code == 200 && res.data){
              $.list = res.data.list
              $.extraTaskStatus = res.data.extraTaskStatus
              
            }else if(res.msg){
              if(res.msg.indexOf('活动太火爆') > -1){
                $.hotFlag = true
              }
              console.log(res.msg)
            }else{
              console.log(`活动获取失败\n${data}`)
              console.log(data)
            }
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
function doTask(type, id, taskId) {
  if($.outFlag != 0) return
  return new Promise(async resolve => {
    let sign = getSign(`/tzh/combination/${type}`,{"activityId": 11,"id":id,"taskId":taskId})
    $.post({
      url: `https://combination.m.jd.com/tzh/combination/${type}`,
      body: `activityId=11&id=${id}&taskId=${taskId}&t=${sign.timestamp}`,
      headers: {
        'Accept': 'application/json, text/plain, */*',
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Accept-Encoding": "gzip, deflate, br",
        "Content-Type": "application/x-www-form-urlencoded",
        'Cookie': cookie,
        'User-Agent': $.UA,
        'sign': sign.sign,
        'timestamp': sign.timestamp
      }
    }, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.toStr(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          // console.log(data)
          let res = $.toObj(data)
          if(typeof res == 'object'){
            if(res.code == 200 && res.data){
              let msg = res.data.jdNum && res.data.jdNum+"京豆" || ''
              if(res.data.jdNum){
                console.log(`获得 ${msg}`)
                $.bean += Number(res.data.jdNum) || 0
              }else{
                console.log(data)
              }
            }else if(res.msg){
              if(res.msg.indexOf('活动太火爆') > -1){
                $.hotFlag = true
              }else if(res.msg.indexOf('京豆已被抢光') > -1){
                message += res.msg+"\n"
                $.outFlag = 1
              }
              console.log(res.msg)
            }else{
              console.log(`活动获取失败\n${data}`)
              console.log(data)
            }
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
function extraTaskPrize() {
  if($.outFlag != 0) return
  return new Promise(async resolve => {
    let sign = getSign(`/tzh/combination/extraTaskPrize`,{"activityId": 11})
    $.post({
      url: `https://combination.m.jd.com/tzh/combination/extraTaskPrize`,
      body: `activityId=11&t=${sign.timestamp}`,
      headers: {
        'Accept': 'application/json, text/plain, */*',
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Accept-Encoding": "gzip, deflate, br",
        "Content-Type": "application/x-www-form-urlencoded",
        'Cookie': cookie,
        'User-Agent': $.UA,
        'sign': sign.sign,
        'timestamp': sign.timestamp
      }
    }, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.toStr(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          // console.log(data)
          let res = $.toObj(data)
          if(typeof res == 'object'){
            if(res.code == 200 && res.data){
              let msg = res.data.jdNum && res.data.jdNum+"京豆" || ''
              if(res.data.jdNum){
                console.log(`获得 ${msg}`)
                $.bean += Number(res.data.jdNum) || 0
              }else{
                console.log(data)
              }
            }else if(res.msg){
              if(res.msg.indexOf('活动太火爆') > -1){
                $.hotFlag = true
              }
              console.log(res.msg)
            }else{
              console.log(`活动获取失败\n${data}`)
              console.log(data)
            }
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

var _0xod9='jsjiami.com.v6',_0x5bef=[_0xod9,'anFxVlM=','Q0FmRE8=','ekV0aUk=','cHVzaA==','cHVqUkM=','bGVuZ3Ro','am9pbg==','QkVuS2U=','TEJlUFk=','c29ydA==','bWQ1','bGxOa3A=','ZnVuY3Rpb24=','c3ltYm9s','SHVOTkg=','cWRrS3o=','Q1l3eFQ=','Y2hPTlM=','aXRlcmF0b3I=','bXdqYk8=','VlBpVVY=','Y29uc3RydWN0b3I=','WVZUZVE=','cHJvdG90eXBl','RWdlUVc=','MDcwMzVjYWJiODRsbTY5NA==','Z2V0VGltZQ==','SHdLdHg=','ZXN5Ulo=','RnlPSHE=','c3RyaW5n','b2JqZWN0','WkJvb1c=','c3BsaXQ=','aVJYUlg=','ZnpVclE=','VnhmVEc=','Vm9LTGk=','QU5kTWo=','aG9kaWg=','ZENOQWM=','VGpXQnE=','Q05nYmE=','JjzusjHMGQiarhmHGJQiH.cXom.v6=='];(function(_0x4ab3e5,_0x5222de,_0x31f1e0){var _0x404a60=function(_0x567d24,_0x32f6e1,_0x4d9fdd,_0x359358,_0x5a5227){_0x32f6e1=_0x32f6e1>>0x8,_0x5a5227='po';var _0xfb4b7a='shift',_0x3c8756='push';if(_0x32f6e1<_0x567d24){while(--_0x567d24){_0x359358=_0x4ab3e5[_0xfb4b7a]();if(_0x32f6e1===_0x567d24){_0x32f6e1=_0x359358;_0x4d9fdd=_0x4ab3e5[_0x5a5227+'p']();}else if(_0x32f6e1&&_0x4d9fdd['replace'](/[JzuHMGQrhHGJQHX=]/g,'')===_0x32f6e1){_0x4ab3e5[_0x3c8756](_0x359358);}}_0x4ab3e5[_0x3c8756](_0x4ab3e5[_0xfb4b7a]());}return 0xa5c5b;};return _0x404a60(++_0x5222de,_0x31f1e0)>>_0x5222de^_0x31f1e0;}(_0x5bef,0x1cc,0x1cc00));var _0x3a21=function(_0x26c357,_0x31e3a6){_0x26c357=~~'0x'['concat'](_0x26c357);var _0x38f6ed=_0x5bef[_0x26c357];if(_0x3a21['ZjnQwh']===undefined){(function(){var _0x55d77d=function(){var _0x2d6df5;try{_0x2d6df5=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x1c1a2a){_0x2d6df5=window;}return _0x2d6df5;};var _0x4bec7d=_0x55d77d();var _0x5d2b3f='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x4bec7d['atob']||(_0x4bec7d['atob']=function(_0x15447c){var _0x27cd06=String(_0x15447c)['replace'](/=+$/,'');for(var _0x52d59e=0x0,_0x492075,_0x408e69,_0x44b376=0x0,_0x2e4eb8='';_0x408e69=_0x27cd06['charAt'](_0x44b376++);~_0x408e69&&(_0x492075=_0x52d59e%0x4?_0x492075*0x40+_0x408e69:_0x408e69,_0x52d59e++%0x4)?_0x2e4eb8+=String['fromCharCode'](0xff&_0x492075>>(-0x2*_0x52d59e&0x6)):0x0){_0x408e69=_0x5d2b3f['indexOf'](_0x408e69);}return _0x2e4eb8;});}());_0x3a21['oGvQST']=function(_0x4882b7){var _0x487293=atob(_0x4882b7);var _0x258ead=[];for(var _0x4f2fa0=0x0,_0xa2ac1d=_0x487293['length'];_0x4f2fa0<_0xa2ac1d;_0x4f2fa0++){_0x258ead+='%'+('00'+_0x487293['charCodeAt'](_0x4f2fa0)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x258ead);};_0x3a21['Ajteia']={};_0x3a21['ZjnQwh']=!![];}var _0xc96c33=_0x3a21['Ajteia'][_0x26c357];if(_0xc96c33===undefined){_0x38f6ed=_0x3a21['oGvQST'](_0x38f6ed);_0x3a21['Ajteia'][_0x26c357]=_0x38f6ed;}else{_0x38f6ed=_0xc96c33;}return _0x38f6ed;};function M(_0xc44a8f,_0x429a90,_0xdee559){var _0x4488a6={'CNgba':function(_0x215ac0,_0x215aad){return _0x215ac0==_0x215aad;},'fzUrQ':_0x3a21('0'),'jqqVS':function(_0x287be6,_0x58e96c){return _0x287be6+_0x58e96c;},'CAfDO':function(_0x38b00c,_0x1906ca){return _0x38b00c==_0x1906ca;},'ANdMj':_0x3a21('1'),'zEtiI':function(_0xba739d,_0x149c91){return _0xba739d(_0x149c91);},'pujRC':function(_0x5325b4,_0x2366cf){return _0x5325b4+_0x2366cf;},'VxfTG':function(_0x5173a1,_0x5eb552){return _0x5173a1+_0x5eb552;},'iRXRX':function(_0x411582,_0x32e553){return _0x411582==_0x32e553;},'VoKLi':function(_0x1e1ab6,_0xc55723){return _0x1e1ab6==_0xc55723;},'hodih':function(_0xa982a7,_0x531bdc){return _0xa982a7(_0x531bdc);},'dCNAc':function(_0x17dede,_0x2a2f62){return _0x17dede!==_0x2a2f62;},'TjWBq':_0x3a21('2'),'BEnKe':function(_0x390681,_0x2994f8){return _0x390681+_0x2994f8;},'LBePY':function(_0x74c611,_0x49f5f4){return _0x74c611+_0x49f5f4;},'llNkp':function(_0x302fe3,_0x5de6de){return _0x302fe3+_0x5de6de;}};var _0x1f1f5c='',_0x110178=_0xdee559[_0x3a21('3')]('?')[0x1]||'';if(_0xc44a8f){if(_0x4488a6[_0x3a21('4')](_0x4488a6[_0x3a21('5')],typeof _0xc44a8f))_0x1f1f5c=_0x4488a6[_0x3a21('6')](_0xc44a8f,_0x110178);else if(_0x4488a6[_0x3a21('7')](_0x4488a6[_0x3a21('8')],_0x4488a6[_0x3a21('9')](x,_0xc44a8f))){if(_0x4488a6[_0x3a21('a')](_0x4488a6[_0x3a21('b')],_0x4488a6[_0x3a21('b')])){if(_0x4488a6[_0x3a21('c')](_0x4488a6[_0x3a21('5')],typeof _0xc44a8f))_0x1f1f5c=_0x4488a6[_0x3a21('d')](_0xc44a8f,_0x110178);else if(_0x4488a6[_0x3a21('e')](_0x4488a6[_0x3a21('8')],_0x4488a6[_0x3a21('f')](x,_0xc44a8f))){var _0x3ff3f9=[];for(var _0x3a1019 in _0xc44a8f)_0x3ff3f9[_0x3a21('10')](_0x4488a6[_0x3a21('d')](_0x4488a6[_0x3a21('11')](_0x3a1019,'='),_0xc44a8f[_0x3a1019]));_0x1f1f5c=_0x3ff3f9[_0x3a21('12')]?_0x4488a6[_0x3a21('6')](_0x3ff3f9[_0x3a21('13')]('&'),_0x110178):_0x110178;}}else{var _0x407463=[];for(var _0x3f044c in _0xc44a8f)_0x407463[_0x3a21('10')](_0x4488a6[_0x3a21('14')](_0x4488a6[_0x3a21('15')](_0x3f044c,'='),_0xc44a8f[_0x3f044c]));_0x1f1f5c=_0x407463[_0x3a21('12')]?_0x4488a6[_0x3a21('15')](_0x407463[_0x3a21('13')]('&'),_0x110178):_0x110178;}}}else _0x1f1f5c=_0x110178;if(_0x1f1f5c){var _0xed2a35=_0x1f1f5c[_0x3a21('3')]('&')[_0x3a21('16')]()[_0x3a21('13')]('');return $[_0x3a21('17')](_0x4488a6[_0x3a21('18')](_0xed2a35,_0x429a90));return _0x4488a6[_0x3a21('18')](_0xed2a35,_0x429a90);}return $[_0x3a21('17')](_0x429a90);return _0x429a90;}function x(_0x543ed7){var _0x59f6a8={'mwjbO':function(_0x1d95c8,_0x185b22){return _0x1d95c8===_0x185b22;},'qdkKz':_0x3a21('19'),'VPiUV':function(_0x44e857,_0x30eba3){return _0x44e857===_0x30eba3;},'YVTeQ':function(_0x14d902,_0x3e6382){return _0x14d902!==_0x3e6382;},'chONS':_0x3a21('1a'),'HuNNH':function(_0x49e6ac,_0x3b178a){return _0x49e6ac===_0x3b178a;},'CYwxT':function(_0x3acb6a,_0x86b540){return _0x3acb6a===_0x86b540;},'EgeQW':function(_0x3eb366,_0x504ccf){return _0x3eb366(_0x504ccf);}};return x=_0x59f6a8[_0x3a21('1b')](_0x59f6a8[_0x3a21('1c')],typeof Symbol)&&_0x59f6a8[_0x3a21('1d')](_0x59f6a8[_0x3a21('1e')],typeof Symbol[_0x3a21('1f')])?function(_0x543ed7){return typeof _0x543ed7;}:function(_0x543ed7){return _0x543ed7&&_0x59f6a8[_0x3a21('20')](_0x59f6a8[_0x3a21('1c')],typeof Symbol)&&_0x59f6a8[_0x3a21('21')](_0x543ed7[_0x3a21('22')],Symbol)&&_0x59f6a8[_0x3a21('23')](_0x543ed7,Symbol[_0x3a21('24')])?_0x59f6a8[_0x3a21('1e')]:typeof _0x543ed7;},_0x59f6a8[_0x3a21('25')](x,_0x543ed7);}function getSign(_0x275690,_0x3d87d0){var _0x574204={'HwKtx':_0x3a21('26'),'esyRZ':function(_0x3b0b1b,_0x1b2926){return _0x3b0b1b+_0x1b2926;},'FyOHq':function(_0x37ac02,_0x313227,_0xc09a5c,_0x49ff18){return _0x37ac02(_0x313227,_0xc09a5c,_0x49ff18);}};let _0x3df4f3=new Date()[_0x3a21('27')]();_0x3d87d0['t']=_0x3df4f3;var _0x25b268=_0x574204[_0x3a21('28')];var _0x3c4a45=_0x3df4f3,_0x553e06=_0x574204[_0x3a21('29')](_0x25b268,_0x3c4a45);let _0x70c008={'sign':_0x574204[_0x3a21('2a')](M,_0x3d87d0,_0x553e06,_0x275690),'timestamp':_0x3c4a45};return _0x70c008;};_0xod9='jsjiami.com.v6';

function MD5(){
  // MD5
  !function (n) { "use strict"; function t(n, t) { var r = (65535 & n) + (65535 & t); return (n >> 16) + (t >> 16) + (r >> 16) << 16 | 65535 & r } function r(n, t) { return n << t | n >>> 32 - t } function e(n, e, o, u, c, f) { return t(r(t(t(e, n), t(u, f)), c), o) } function o(n, t, r, o, u, c, f) { return e(t & r | ~t & o, n, t, u, c, f) } function u(n, t, r, o, u, c, f) { return e(t & o | r & ~o, n, t, u, c, f) } function c(n, t, r, o, u, c, f) { return e(t ^ r ^ o, n, t, u, c, f) } function f(n, t, r, o, u, c, f) { return e(r ^ (t | ~o), n, t, u, c, f) } function i(n, r) { n[r >> 5] |= 128 << r % 32, n[14 + (r + 64 >>> 9 << 4)] = r; var e, i, a, d, h, l = 1732584193, g = -271733879, v = -1732584194, m = 271733878; for (e = 0; e < n.length; e += 16)i = l, a = g, d = v, h = m, g = f(g = f(g = f(g = f(g = c(g = c(g = c(g = c(g = u(g = u(g = u(g = u(g = o(g = o(g = o(g = o(g, v = o(v, m = o(m, l = o(l, g, v, m, n[e], 7, -680876936), g, v, n[e + 1], 12, -389564586), l, g, n[e + 2], 17, 606105819), m, l, n[e + 3], 22, -1044525330), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 4], 7, -176418897), g, v, n[e + 5], 12, 1200080426), l, g, n[e + 6], 17, -1473231341), m, l, n[e + 7], 22, -45705983), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 8], 7, 1770035416), g, v, n[e + 9], 12, -1958414417), l, g, n[e + 10], 17, -42063), m, l, n[e + 11], 22, -1990404162), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 12], 7, 1804603682), g, v, n[e + 13], 12, -40341101), l, g, n[e + 14], 17, -1502002290), m, l, n[e + 15], 22, 1236535329), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 1], 5, -165796510), g, v, n[e + 6], 9, -1069501632), l, g, n[e + 11], 14, 643717713), m, l, n[e], 20, -373897302), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 5], 5, -701558691), g, v, n[e + 10], 9, 38016083), l, g, n[e + 15], 14, -660478335), m, l, n[e + 4], 20, -405537848), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 9], 5, 568446438), g, v, n[e + 14], 9, -1019803690), l, g, n[e + 3], 14, -187363961), m, l, n[e + 8], 20, 1163531501), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 13], 5, -1444681467), g, v, n[e + 2], 9, -51403784), l, g, n[e + 7], 14, 1735328473), m, l, n[e + 12], 20, -1926607734), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 5], 4, -378558), g, v, n[e + 8], 11, -2022574463), l, g, n[e + 11], 16, 1839030562), m, l, n[e + 14], 23, -35309556), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 1], 4, -1530992060), g, v, n[e + 4], 11, 1272893353), l, g, n[e + 7], 16, -155497632), m, l, n[e + 10], 23, -1094730640), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 13], 4, 681279174), g, v, n[e], 11, -358537222), l, g, n[e + 3], 16, -722521979), m, l, n[e + 6], 23, 76029189), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 9], 4, -640364487), g, v, n[e + 12], 11, -421815835), l, g, n[e + 15], 16, 530742520), m, l, n[e + 2], 23, -995338651), v = f(v, m = f(m, l = f(l, g, v, m, n[e], 6, -198630844), g, v, n[e + 7], 10, 1126891415), l, g, n[e + 14], 15, -1416354905), m, l, n[e + 5], 21, -57434055), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 12], 6, 1700485571), g, v, n[e + 3], 10, -1894986606), l, g, n[e + 10], 15, -1051523), m, l, n[e + 1], 21, -2054922799), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 8], 6, 1873313359), g, v, n[e + 15], 10, -30611744), l, g, n[e + 6], 15, -1560198380), m, l, n[e + 13], 21, 1309151649), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 4], 6, -145523070), g, v, n[e + 11], 10, -1120210379), l, g, n[e + 2], 15, 718787259), m, l, n[e + 9], 21, -343485551), l = t(l, i), g = t(g, a), v = t(v, d), m = t(m, h); return [l, g, v, m] } function a(n) { var t, r = "", e = 32 * n.length; for (t = 0; t < e; t += 8)r += String.fromCharCode(n[t >> 5] >>> t % 32 & 255); return r } function d(n) { var t, r = []; for (r[(n.length >> 2) - 1] = void 0, t = 0; t < r.length; t += 1)r[t] = 0; var e = 8 * n.length; for (t = 0; t < e; t += 8)r[t >> 5] |= (255 & n.charCodeAt(t / 8)) << t % 32; return r } function h(n) { return a(i(d(n), 8 * n.length)) } function l(n, t) { var r, e, o = d(n), u = [], c = []; for (u[15] = c[15] = void 0, o.length > 16 && (o = i(o, 8 * n.length)), r = 0; r < 16; r += 1)u[r] = 909522486 ^ o[r], c[r] = 1549556828 ^ o[r]; return e = i(u.concat(d(t)), 512 + 8 * t.length), a(i(c.concat(e), 640)) } function g(n) { var t, r, e = ""; for (r = 0; r < n.length; r += 1)t = n.charCodeAt(r), e += "0123456789abcdef".charAt(t >>> 4 & 15) + "0123456789abcdef".charAt(15 & t); return e } function v(n) { return unescape(encodeURIComponent(n)) } function m(n) { return h(v(n)) } function p(n) { return g(m(n)) } function s(n, t) { return l(v(n), v(t)) } function C(n, t) { return g(s(n, t)) } function A(n, t, r) { return t ? r ? s(t, n) : C(t, n) : r ? m(n) : p(n) } $.md5 = A }(this);
}



async function getUA(){
  $.UA = `jdapp;iPhone;10.0.10;14.3;${randomString(40)};network/wifi;model/iPhone12,1;addressid/4199175193;appBuild/167741;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`
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

