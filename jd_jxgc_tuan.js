/**
京喜工厂开团
cron 10 5,9,15 * * * jd_jxgc_tuan.js
一个账号能参团一次，一个账号一天能开三次团，请根据自己的情况设置需要开团的CK，一般至少5个CK能成团
脚本每执行一次，会领取上一次成团的奖励和新开一次团，每天执行4次能开完3次团和领取3次团的奖励
环境变量：
   OPEN_DREAMFACTORY_TUAN 脚本默认第一个CK开团，例：若OPEN_DREAMFACTORY_TUAN="2,3"  则第2，第3个CK开团，其他账号参加第2，第3个CK开的团
助力规则：
   开团账号开团，其他账号自动参团。 例：有A,B,C账号，A，B账号开团，则B，C会参加A的团，A会参加B的团
   账号1会尝试加入作者团
成团条件：
   成团所需人数根据活动所需人数变化，一般为5-7人，
   若5人成团，则5个CK能成团一次，9个CK能成团两次，13个CK能成团三次
* */

const $ = new Env('京喜工厂开团');
const JD_API_HOST = 'https://m.jingxi.com';
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const openTuanCK = $.isNode() ? (process.env.OPEN_DREAMFACTORY_TUAN ? process.env.OPEN_DREAMFACTORY_TUAN : '1'):'1';
let tuanActiveId = ``;
let cookiesArr = [], cookie = '', message = '';
$.tuanIds = [];
$.appId = 10001;
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [
    $.getdata("CookieJD"),
    $.getdata("CookieJD2"),
    ...$.toObj($.getdata("CookiesJD") || "[]").map((item) => item.cookie)].filter((item) => !!item);
}
!(async () => {
  let openTuanCKList = openTuanCK.split(',');
  $.CryptoJS = $.isNode() ? require('crypto-js') : CryptoJS;
  await requestAlgo();
  await getTuanActiveId();
  if(!tuanActiveId){console.log(`未能获取到有效的团活动ID`);return ;}
  //let nowTime = getCurrDate();
  // let jdFactoryTime = $.getdata('jdFactoryTime');
  // if (!jdFactoryTime || nowTime !== jdFactoryTime) {$.setdata(nowTime, 'jdFactoryTime');$.setdata({}, 'jdFactoryHelpList');}
  // $.jdFactoryHelpList = $.getdata('jdFactoryHelpList');
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  let runFlag = true;
  for (let i = 0; i < cookiesArr.length; i++) {
    if(!openTuanCKList.includes((i+1).toString())){
      continue;
    }
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      $.tuanNum = 0;//成团人数
      await TotalBean();
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
        if ($.isNode()) {await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);}
        runFlag = false;
        continue;
      }
      await jdDreamFactoryTuan();
    }
  }
  if(!runFlag){
    console.log(`需要开团的CK已过期，请更新CK后重新执行脚本`);
    return;
  }
  console.log(`\n===============开始账号内参团===================`);
  console.log('获取到的内部团ID'+`${$.tuanIds}\n`);
  //打乱CK,再进行参团
  if (!Array.prototype.derangedArray) {Array.prototype.derangedArray = function() {for(var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);return this;};}
  cookiesArr.derangedArray();
  for (let i = 0; i < cookiesArr.length && $.tuanIds.length>0; i++) {
    if (cookiesArr[i]) {
      $.index = i + 1;
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
      // if($.jdFactoryHelpList[$.UserName]){
      //   console.log(`${$.UserName},参团次数已用完`)
      //   continue;
      // }
      $.isLogin = true;
      $.canHelp = true;//能否参团
      await TotalBean();
      if (!$.isLogin) {continue;}
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
      if ((cookiesArr && cookiesArr.length >= ($.tuanNum || 5)) && $.canHelp) {
        for (let j = 0; j < $.tuanIds.length; j++) {
          let item = $.tuanIds[j];
          if ($.index == 1) {item = 'Qi3lX9-jBTTNpRSLdOx1Eg=='}
          $.tuanMax = false;
          if (!$.canHelp) break;
          console.log(`账号${$.UserName} 去参加团 ${item}`);
          await JoinTuan(item);
          await $.wait(2000);
          if($.tuanMax){$.tuanIds.shift();j--;}
        }
      }
    }
  }
})().catch((e) => {$.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')}).finally(() => {$.done();});

async function jdDreamFactoryTuan() {try {await userInfo();await tuanActivity();} catch (e) {$.logErr(e);}}

async function getTuanActiveId() {
  const method = `GET`;
  let headers = {};
  let myRequest =  {url: 'https://st.jingxi.com/pingou/dream_factory/index.html', method: method, headers: headers};
  return new Promise(async resolve => {
    $.get(myRequest, (err, resp, data) => {
      try {
        data = data && data.match(/window\._CONFIG = (.*) ;var __getImgUrl/);
        if (data) {
          data = JSON.parse(data[1]);
          const tuanConfigs = (data[0].skinConfig[0].adConfig || []).filter(vo => !!vo && vo['channel'] === 'h5');
          if (tuanConfigs && tuanConfigs.length) {
            for (let item of tuanConfigs) {
              const start = item.start;
              const end = item.end;
              const link = item.link;
              if (new Date(item.end).getTime() > Date.now() && new Date(item.start).getTime() < Date.now()) {
                if (link && link.match(/activeId=(.*),/) && link.match(/activeId=(.*),/)[1]) {
                  console.log(`\n获取团活动ID成功: ${link.match(/activeId=(.*),/)[1]}\n有效时段：${start} - ${end}`);
                  tuanActiveId = link.match(/activeId=(.*),/)[1];
                  break
                }
              } else {
                  tuanActiveId = '';
              }
            }
          }
        }
      } catch (e) {
        console.log(data);$.logErr(e, resp);
      } finally {resolve();}
    })
  })
}


function getAuthorShareCode(url) {
  return new Promise(async resolve => {
    const options = {
      "url": `${url}?${new Date()}`,
      "timeout": 10000,
      "headers": {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      }
    };
    if ($.isNode() && process.env.TG_PROXY_HOST && process.env.TG_PROXY_PORT) {
      const tunnel = require("tunnel");
      const agent = {
        https: tunnel.httpsOverHttp({
          proxy: {
            host: process.env.TG_PROXY_HOST,
            port: process.env.TG_PROXY_PORT * 1
          }
        })
      };
      Object.assign(options, { agent })
    }
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
        } else {
          if (data) data = JSON.parse(data)
        }
      } catch (e) {
        // $.logErr(e, resp)
      } finally {
        resolve(data || []);
      }
    });
    await $.wait(10000);
    resolve();
  })
}
function userInfo() {
  return new Promise(async resolve => {
    $.get(taskurl('userinfo/GetUserInfo', `pin=&sharePin=&shareType=&materialTuanPin=&materialTuanId=&source=`, '_time,materialTuanId,materialTuanPin,pin,sharePin,shareType,source,zone'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              data = data['data'];
              $.unActive = true;//标记是否开启了京喜活动或者选购了商品进行生产
              $.encryptPin = '';
              $.shelvesList = [];
              if (data.factoryList && data.productionList) {
                const factory = data.factoryList[0];
                $.factoryId = factory.factoryId;//工厂ID
                $.encryptPin = data.user.encryptPin;
              } else {
                $.unActive = false;//标记是否开启了京喜活动或者选购了商品进行生产
                if (!data.factoryList) {
                  console.log(`【提示】京东账号${$.index}[${$.nickName}]京喜工厂活动未开始\n请手动去京东APP->游戏与互动->查看更多->京喜工厂 开启活动\n`);
                } else if (data.factoryList && !data.productionList) {
                  console.log(`【提示】京东账号${$.index}[${$.nickName}]京喜工厂未选购商品\n请手动去京东APP->游戏与互动->查看更多->京喜工厂 选购\n`)
                }
              }
            } else {
              console.log(`GetUserInfo异常：${JSON.stringify(data)}`)
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
async function tuanActivity() {
  const tuanConfig = await QueryActiveConfig();
  if (tuanConfig && tuanConfig.ret === 0) {
    const { activeId, surplusOpenTuanNum, tuanId } = tuanConfig['data']['userTuanInfo'];
    console.log(`今日剩余开团次数：${surplusOpenTuanNum}次`);
    $.surplusOpenTuanNum = surplusOpenTuanNum;
    if (!tuanId && surplusOpenTuanNum > 0) {
      //开团
      $.log(`准备开团`)
      await CreateTuan();
    } else if (tuanId) {
      //查询词团信息
      const QueryTuanRes = await QueryTuan(activeId, tuanId);
      if (QueryTuanRes && QueryTuanRes.ret === 0) {
        const { tuanInfo } = QueryTuanRes.data;
        if ((tuanInfo && tuanInfo[0]['endTime']) <= QueryTuanRes['nowTime'] && surplusOpenTuanNum > 0) {
          $.log(`之前的团已过期，准备重新开团\n`)
          await CreateTuan();
        }else{
          for (let item of tuanInfo) {
            const { realTuanNum, tuanNum, userInfo } = item;
            $.tuanNum = tuanNum || 0;
            $.log(`\n开团情况:${realTuanNum}/${tuanNum}\n`);
            if (realTuanNum === tuanNum) {
              for (let user of userInfo) {
                if (user.encryptPin === $.encryptPin) {
                  if (user.receiveElectric && user.receiveElectric > 0) {
                    console.log(`您在${new Date(user.joinTime * 1000).toLocaleString()}开团奖励已经领取成功\n`)
                    if ($.surplusOpenTuanNum > 0) await CreateTuan();
                  } else {
                    $.log(`开始领取开团奖励`);
                    await tuanAward(item.tuanActiveId, item.tuanId);//isTuanLeader
                  }
                }
              }
            } else {
              $.tuanIds.push(tuanId);
              $.log(`\n此团未达领取团奖励人数：${tuanNum}人\n`)
            }
          }
        }
      }
    }
  }
}
function QueryActiveConfig() {
  return new Promise((resolve) => {
    const body = `activeId=${escape(tuanActiveId)}&tuanId=`;
    const options = taskTuanUrl(`QueryActiveConfig`, body, `_time,activeId,tuanId`)
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              const { userTuanInfo } = data['data'];
              console.log(`\n团活动ID  ${userTuanInfo.activeId}`);
              console.log(`团ID  ${userTuanInfo.tuanId}\n`);
            } else {
              console.log(`QueryActiveConfig异常：${JSON.stringify(data)}`);
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
function QueryTuan(activeId, tuanId) {
  return new Promise((resolve) => {
    const body = `activeId=${escape(activeId)}&tuanId=${escape(tuanId)}`;
    const options = taskTuanUrl(`QueryTuan`, body, `_time,activeId,tuanId`)
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              // $.log(`\n开团情况:${data.data.tuanInfo.realTuanNum}/${data.data.tuanInfo.tuanNum}\n`)
            } else {
              console.log(`异常：${JSON.stringify(data)}`);
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
//开团API
function CreateTuan() {
  return new Promise((resolve) => {
    const body =`activeId=${escape(tuanActiveId)}&isOpenApp=1`
    const options = taskTuanUrl(`CreateTuan`, body, '_time,activeId,isOpenApp')
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              console.log(`开团成功tuanId为：${data.data['tuanId']}`);
              $.tuanIds.push(data.data['tuanId']);
            } else {
              console.log(`开团异常：${JSON.stringify(data)}`);
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
function JoinTuan(tuanId, stk = '_time,activeId,tuanId') {
  return new Promise((resolve) => {
    const body = `activeId=${escape(tuanActiveId)}&tuanId=${escape(tuanId)}`;
    const options = taskTuanUrl(`JoinTuan`, body, '_time,activeId,tuanId')
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              console.log(`参团成功：${JSON.stringify(data)}\n`);
              //$.jdFactoryHelpList[$.UserName] = $.UserName;
              //$.setdata($.jdFactoryHelpList, 'jdFactoryHelpList');
              $.canHelp = false;
            } else if (data['ret'] === 10005 || data['ret'] === 10206) {
              //火爆，或者今日参团机会已耗尽
              console.log(`参团失败：${JSON.stringify(data)}\n`);
              //$.jdFactoryHelpList[$.UserName] = $.UserName;
              //$.setdata($.jdFactoryHelpList, 'jdFactoryHelpList');
              $.canHelp = false;
            } else if(data['ret'] === 10209){
              $.tuanMax = true;
              console.log(`参团失败：${JSON.stringify(data)}\n`);
            } else {
              console.log(`参团失败：${JSON.stringify(data)}\n`);
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
function tuanAward(activeId, tuanId, isTuanLeader = true) {
  return new Promise((resolve) => {
    const body = `activeId=${escape(activeId)}&tuanId=${escape(tuanId)}`;
    const options = taskTuanUrl(`Award`, body, '_time,activeId,tuanId')
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              if (isTuanLeader) {
                console.log(`开团奖励(团长)${data.data['electric']}领取成功`);
                message += `【开团(团长)奖励】${data.data['electric']}领取成功\n`;
                if ($.surplusOpenTuanNum > 0) {
                  $.log(`开团奖励(团长)已领取，准备开团`);
                  await CreateTuan();
                }
              } else {
                console.log(`参团奖励${data.data['electric']}领取成功`);
                message += `【参团奖励】${data.data['electric']}领取成功\n`;
              }
            } else if (data['ret'] === 10212) {
              console.log(`${JSON.stringify(data)}`);

              if (isTuanLeader && $.surplusOpenTuanNum > 0) {
                $.log(`团奖励已领取，准备开团`);
                await CreateTuan();
              }
            } else {
              console.log(`异常：${JSON.stringify(data)}`);
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
function TotalBean() {
  return new Promise(async resolve => {
    const options = {"url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,"headers": {"Accept": "application/json,text/plain, */*","Content-Type": "application/x-www-form-urlencoded","Accept-Encoding": "gzip, deflate, br","Accept-Language": "zh-cn","Connection": "keep-alive","Cookie": cookie,"Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2","User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"}};
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {data = JSON.parse(data);if (data['retcode'] === 13) { $.isLogin = false;}if (data['retcode'] === 0) {$.nickName = (data['base'] && data['base'].nickname) || $.UserName;} else {$.nickName = $.UserName;}} else {console.log(`京东服务器返回空数据`)}
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function getRandomArrayElements(arr, count) {var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;while (i-- > min) {index = Math.floor((i + 1) * Math.random());temp = shuffled[index];shuffled[index] = shuffled[i];shuffled[i] = temp;}return shuffled.slice(min);}
function getCurrDate() {let date = new Date();let sep = "-";let year = date.getFullYear();let month = date.getMonth() + 1;let day = date.getDate();if (month <= 9) {month = "0" + month;}if (day <= 9) {day = "0" + day;}return year + sep + month + sep + day;}
function safeGet(data) {try {if (typeof JSON.parse(data) == "object") {return true;}} catch (e) {console.log(e);console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);return false;}}
function taskTuanUrl(functionId, body = '', stk) {let url = `https://m.jingxi.com/dreamfactory/tuan/${functionId}?${body}&_time=${Date.now()}&_=${Date.now() + 2}&sceneval=2&g_login_type=1&_ste=1`;url += `&h5st=${decrypt(Date.now(), stk || '', '', url)}`;if (stk) {url += `&_stk=${encodeURIComponent(stk)}`;}return {url,headers: {"Accept": "*/*","Accept-Encoding": "gzip, deflate, br","Accept-Language": "zh-cn","Connection": "keep-alive","Cookie": cookie,"Host": "m.jingxi.com","Referer": "https://st.jingxi.com/pingou/dream_factory/divide.html","User-Agent": "jdpingou"}}}
function taskurl(functionId, body = '', stk) {let url = `${JD_API_HOST}/dreamfactory/${functionId}?zone=dream_factory&${body}&sceneval=2&g_login_type=1&_time=${Date.now()}&_=${Date.now() + 2}&_ste=1`;url += `&h5st=${decrypt(Date.now(), stk, '', url)}`;if (stk) {url += `&_stk=${encodeURIComponent(stk)}`;}return {url,headers: {'Cookie': cookie,'Host': 'm.jingxi.com','Accept': '*/*','Connection': 'keep-alive','User-Agent': functionId === 'AssistFriend' ? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36" : 'jdpingou','Accept-Language': 'zh-cn','Referer': 'https://wqsd.jd.com/pingou/dream_factory/index.html','Accept-Encoding': 'gzip, deflate, br',}}}
Date.prototype.Format = function (fmt) {var e,n = this, d = fmt, l = {"M+": n.getMonth() + 1,"d+": n.getDate(),"D+": n.getDate(),"h+": n.getHours(),"H+": n.getHours(),"m+": n.getMinutes(),"s+": n.getSeconds(),"w+": n.getDay(),"q+": Math.floor((n.getMonth() + 3) / 3),"S+": n.getMilliseconds()};/(y+)/i.test(d) && (d = d.replace(RegExp.$1, "".concat(n.getFullYear()).substr(4 - RegExp.$1.length)));for (var k in l) {if (new RegExp("(".concat(k, ")")).test(d)) {var t, a = "S+" === k ? "000" : "00";d = d.replace(RegExp.$1, 1 == RegExp.$1.length ? l[k] : ("".concat(a) + l[k]).substr("".concat(l[k]).length));}}return d;};
function jsonParse(str) {if (typeof str == "string") {try {return JSON.parse(str);} catch (e) {console.log(e);$.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie');return [];}}}
async function requestAlgo() {$.fingerprint = await generateFp();const options = {"url": `https://cactus.jd.com/request_algo?g_ty=ajax`,"headers": {'Authority': 'cactus.jd.com','Pragma': 'no-cache','Cache-Control': 'no-cache','Accept': 'application/json','User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1','Content-Type': 'application/json','Origin': 'https://st.jingxi.com','Sec-Fetch-Site': 'cross-site','Sec-Fetch-Mode': 'cors','Sec-Fetch-Dest': 'empty','Referer': 'https://st.jingxi.com/','Accept-Language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8,en;q=0.7'},'body': JSON.stringify({"version": "1.0","fp": $.fingerprint,"appId": $.appId.toString(),"timestamp": Date.now(),"platform": "web","expandParams": ""})};new Promise(async resolve => {$.post(options, (err, resp, data) => {try {if (err) {console.log(`${JSON.stringify(err)}`);console.log(`request_algo 签名参数API请求失败，请检查网路重试`)} else {if (data) {data = JSON.parse(data);if (data['status'] === 200) {$.token = data.data.result.tk;let enCryptMethodJDString = data.data.result.algo;if (enCryptMethodJDString) $.enCryptMethodJD = new Function(`return ${enCryptMethodJDString}`)();} else {console.log('request_algo 签名参数API请求失败:');}} else {console.log(`京东服务器返回空数据`);}}} catch (e) {$.logErr(e, resp);} finally {resolve();}})});}
function decrypt(time, stk, type, url) {stk = stk || (url ? getUrlData(url, '_stk') : '');if (stk) {const timestamp = new Date(time).Format("yyyyMMddhhmmssSSS");let hash1 = '';if ($.fingerprint && $.token && $.enCryptMethodJD) {hash1 = $.enCryptMethodJD($.token, $.fingerprint.toString(), timestamp.toString(), $.appId.toString(), $.CryptoJS).toString($.CryptoJS.enc.Hex);} else {const random = '5gkjB6SpmC9s';$.token = `tk01wcdf61cb3a8nYUtHcmhSUFFCfddDPRvKvYaMjHkxo6Aj7dhzO+GXGFa9nPXfcgT+mULoF1b1YIS1ghvSlbwhE0Xc`;$.fingerprint = 5287160221454703;const str = `${$.token}${$.fingerprint}${timestamp}${$.appId}${random}`;hash1 = $.CryptoJS.SHA512(str, $.token).toString($.CryptoJS.enc.Hex);}let st = '';stk.split(',').map((item, index) => {st += `${item}:${getUrlData(url, item)}${index === stk.split(',').length -1 ? '' : '&'}`;});const hash2 = $.CryptoJS.HmacSHA256(st, hash1.toString()).toString($.CryptoJS.enc.Hex);return encodeURIComponent(["".concat(timestamp.toString()), "".concat($.fingerprint.toString()), "".concat($.appId.toString()), "".concat($.token), "".concat(hash2)].join(";"));} else {return '20210318144213808;8277529360925161;10001;tk01w952a1b73a8nU0luMGtBanZTHCgj0KFVwDa4n5pJ95T/5bxO/m54p4MtgVEwKNev1u/BUjrpWAUMZPW0Kz2RWP8v;86054c036fe3bf0991bd9a9da1a8d44dd130c6508602215e50bb1e385326779d';}}
function getUrlData(url, name) {if (typeof URL !== "undefined") {let urls = new URL(url);let data = urls.searchParams.get(name);return data ? data : '';} else {const query = url.match(/\?.*/)[0].substring(1);const vars = query.split('&');for (let i = 0; i < vars.length; i++) {const pair = vars[i].split('=');if (pair[0] === name) {return vars[i].substr(vars[i].indexOf('=') + 1);}}return '';}}
function generateFp() {let e = "0123456789";let a = 13;let i = '';for (; a--; ) i += e[Math.random() * e.length | 0];return (i + Date.now()).slice(0,16)}
var _0xodT='jsjiami.com.v6',_0x1c2f=[_0xodT,'wpnCon4=','Z8OwE8KCwqPDgMKuwq89SyjCt2Y=','w5kfbw/Dlw==','w5DCqcKUIcOuwrzCgT7CvyPDuMKZw7o=','JcKtwqXCk0HCpw==','w6jDg8KDw6F4','w4bCq8K/w5nDhQ==','LQLCtMOPwqpoG8KGO8O9UsOGKQ==','wr7Cs8K1','w5DCqcKUIcOuwrzCgT7CvzvDuMKYw7o=','w5oNwofDlXc=','OAXCmQ==','w5/CmC06wo9TRMOUeEHCn8K7UQ==','NsOhw7oVAi4=','wrzCuMK3','D8KGwpvCn1Y=','w4PCvQE9wrw=','wrM5A29W','XMOXA8OUwr4=','wpLCo3huw68=','w6rDisKiw5J3','GsOyw5HDviE=','w4TDjC4xKQ==','w5s4wqxyLg==','wrBcCsKPZw==','wq1XVl7Dsw==','w4wrwrVtMQ==','Ny7DkCM1','wrXClkrCqH4=','fcOPOcKiwrc=','fcKCdcOmfA==','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','CTnCp35D','AsOTw50sKg==','A3zDiB0=','wrh2S1rDsw==','woDCvMOow4JAZsOhwqnCpMOnw4IuwoJjXsKkw4p7wrnDh8KzdcK1WnPCkUXDug7CtsKhw5zCuy0CQcKsDcKtY8KNw73CmifDgykrw4XCokt1wqHCqMOgFQEUw7l8JAx0w7hARsOmdsKOT8OKLsKFwpp6BsOFw7/Cg8KEJWLCgcK9wr5cw5jDpg==','wqHDtBYhJMOmLMKsS8KMBsKlasKKw5FBC8Odw7pjw6PDiHDCqEvDpjfDo8ONfcK3MkrCvH/CqMKkZcKHw5PDuCcMKyjDqU/Cq3vDiWF1NA==','w4g8wozDgWcXwo/CoMKUS2rCrkTCm3g2w5o4w4opw5jDh1gnw74uUCEawq4VE8OHw5LDjh4Iwo5Wwrk7VMKhA1rDhlzDvFRmw7dqTMOrSA9GwrbDi3rCmQxsDcOoBMOHwpUWOjzCn3PDicOJw7zCl3AUBik=','wpg1B0dw','wohiBMKKYg==','w47ClcKaw67DmQ==','NBfCmcOswpA=','w67CrnBmwpc=','wqJMJMKSTQ==','OsOrw5oUBDLDu8OTHXs=','w6bCpiECwrxuecOEQ2I=','wpUuAUd+','w73Dpg4JFA==','w7ckwrLDiW0=','UsKkJ17Cqw==','w6rCrxtEwrAydsOpCXLCv8KE','wpEoH1RJwrMVw7rChyrDt8OVLm7Dm8OxwqjCnsKVw4sHYhbCmcK2w6k3wq9Cw7PDvcOqwqYjHw==','fcK9Y8OEbcK+PUzDn8OLdXTCgsKsAsKbw5LCncKBwpjCmjdrC1nCjMO+aXfCmADDvsKF','w6PDq8Kew79cw5DDhkAvw78BwpgAwrDDmADDlFfCjHIbPkcGCcO2w7cWXRYjJynCpcKMwqPCohJGw6bDgV7DisOsw7c9w4gkSsKaWcObw5HChMOAfMOcw6Z8YnvDvwjCnMO5XirClwtpAMOlwprDkRwQw7TCncOaFMOCFsKIKRYOLELDmE3Do1Z+w4vCh8OsQMO+STbDtMKIwoJFwq3CrDonJMOVwoVdw68gw5zDoTTCjMKpCcKrRcKdPMKmw64ew6DCozvDmzXCocKgP8KJYWcROMKDKXfCsMOIcsOWUMKLL8KMHMKxwrMRw45Uw6HCjcOFa0UVMCMeawLDosKbw47DjMKfwrt1ewfDl0bCrnlhw6HDokfClhBGBsKMP8OBfMOIwqQND3TCkMKBwqPCiMOSawzDmg0NwrhgY8KvwoFnwpfDhsOUdyVDcsOIwpl0w53Dl3DCgnReNsOgwooAMsKyfMKEw7Ndw5XChsKMIcKcwplAa8KuJ1vCtD3CsMKFw47Cl2tlw44zw6fClcOROHgFw7rDn8KPwrjDtEZRw78fwo1Pw7rDiV5GwplSw7E7w7HDm8OPw5XCpMKdwr7Dkx7DucKmw5PDnCg0w74uw73Dq8OywofChn1KwqYwCcOeYsOyw67DpSVhX8KmSsK0w4rCmcKkwq0CNsK3EArDg8K9wo5TwpB2w5jDgCPDllsXXsKMRMKUe2wew6zDtTQTwr3Dk8OZaRLDrR0hNMK5w5nCo18XwocCw4vCjioeSyE8YTA6HQFlw7YtVyvCi8O2wpfCnCU2NsO0QXjDpUt2w7rCoFXDqWJrw7nCjsO5Y8KDCcKIw57Ct8KbQMO7HU5SehsMwrnDnMKkFkNxw5bDm2XDgMKJwpMrwqoyw4lRwpJswq3CiRMTO8OGwqbCqcO8cH9TDkHCsRLCuy54LHTCtmZgw786CsKjCWs4X8KiwrbDq0vDrS/Ds14IMcOFd2vDhsO7w4DCicOmKhLCjzfCvzUvw7N5SsOMwqc1Y3TDtXxgwr4lw4xOSFrCsAzCscOEUMOgfS4ARcKbwpXCoMOLOsKSw6DDki5eBSplw7LCqjdFesOSw7PDm8K/wrkXw5zDjMOWZMKnazg3w6Qew6xPG8Orw5rDscKmw4HDlMO/w6nDlcKKwoFWRMOOw7EXL8Ktwq4TH8KQK0ZHFMOobnAnAsK0BD16czt9w4FAP8OKUjBsLUDDqlPCpk/DvcOqw69ndVdnIMO0w7FpXMKcw7LCvsKQV8Ofw556CMKrHMKMWQVLwr3DosK6wohDRsOLKcKKWxrDusKBFF9DRMKBwpcSw4xXLcOVw69zCT0KwoJcDx3CqcOPdl/ClhEVaRIeGD3CuyoRw4gEByFNw5bChiVEWcOewoJ7aSXCkHQiwqLCusKdwpLDq8K8WhBOOsK7wrvCusOx','wofCg3jCjEdzGnsGCcOmw6zCu1/DkmxWEHrCvMKRwr7ChWfCi8KXXnd3w4sqMB3ChwbDoA==','wrPDqE8ycA==','wo5TdsOV','A8Ocw5ErAA==','U13CiMO4wok=','AjjDtcKwaw==','dDZ1Zx0=','wpXCmHldw54=','PnHDiQFG','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','wq7Cp8KCwqBx','w7gGwoHDjXU=','wp/DhQnCrsOy','VMKASsOnZg==','w4fCikVKwr8=','wp7ClUfCnkw=','wpBEw6fDrg==','w7nDncOdw4Iq','wq/DrCoVbg==','w6HCpU9iwrM=','GsO1w4zDggk=','dMO4LcOewrA=','woNFw5jDiMOB','w4nCkMKZw6LDoQ==','O118IcKS','w53DucOGw4Qm','wptfw5cew4nDlg==','LF7CrgXDuzY1fkELw7PCm8OSw4fDt8O9wo8fMCNxZ3wWw7TDvMOZQS/CiMOTVkHDjMOMw4s2wo/Cj8Obw5cuw5xwE2HDmX1Rw5YFNBoiw5fDhcKVwrLCmsOLNy/Cp8OhZBJrWcKnHHnDojtMw7HCuHxzwpvDk8KVUw==','w7UhRMOsw5HCmsO4w6ZkwpN7w78=','w6XCnsKiX8ORw53CswPDjhDDmMKm','NsOiw7kQDCPDv8OuEGclwr8ywo1aWMKsL8OOHyfDu8KYHcKIeyPDhWBRwqnDucON','b0cTKwfCsH9jX3XDiFTDrsOBA0rCh8KQwqQ=','w4jChsKfw73Cvw/CqwvDjlvDtS3CucOfQB1a','dFLCqsOAw77DlDwbS3E=','wqgQw6YowrZAwq8QHzXDicKgejJmwqsew5nDsMKOcMKuwqdYw7gpwrPDscOGw5jDuH4m','wpM4ClRKwrJTwoXCgDXDvMOeZzLCkcK1w6fDjcOFwp9HYU/DhsOhw64mwr4bw7bDq8Kvw6o7G8KdwpLDlsKoXcKzFcOiw5HCuTAgKsKMYxvCjDfDlcKcwodVBx0wFjQdEMO0WcOLcnzCnCg7HBMTwr1IwoZAwrTCtQ8RwphxUmMCwopjSsOLw6FefsKawostBMKvUcOhU8KzKMKceVbCvFjDn8OCNWTDq3cgw7kWZADDnMOKwqbCrsKcQ2/DoUbDvHzDtxIYwp0JFsK3w6zDrsOJw4spwqZPSWlsP8KSwqrDmsKNUsKtw67CosO4w7hoVHrDucKZw7jCuCjCuAHDlHNUQzHDlCrDjhxpw4FJM8OEwqUQeMKpw4UPwrTCglByw7DDiMOew5bDjcOzwrR0McKoFsKzEMOPLMOWw7nDmCs2w6/CmCMMY8KVw6rDgDZkMAbCu8KAw40TO8O+wpEpVcKGw6zDgcKbwq9WwrnDnsKGw5hyw49Ww7l1CcKAORbCsEIbFsKcwqfDoQDDqiZtLsOvOhrCnMKrw6LCusKSUMOew4bDkHIzwq3DhQvDpsOhwqjDosKZGTo=','w68Iw7R6Dg==','w6rCh8OSWio0wq01wrzCrw==','TcO7KsOKwoHDrQ==','w7zCq3Vmwrg=','MQ7CgW1SBA==','w4MMwr7DvUA=','MxrDvMKabw==','wonCm2PCk0Y=','M09hOcKq','wqtVY0DDkg==','wq1qUW7CkMK/','B3HDiApV','w5LDoigXNA==','cy90YT8=','wqhObnjDjMKdGAkvEcKXwpI=','wr9Jw5wMw6o=','wp/DtwcnUg==','V8O9B8ObwrrDrsOCwrTCsgjDu1M=','wpzDrCnCjsO3','PsO8w4sdFyfDv8OzF2Elw7c=','wp1iSV7Clg==','w6LCsTALwq97fcOkSXjCvsKO','c8KsIXbCs2k=','wobCmU7CnUYuVD0HEMOtw6U=','URZGVhcPXMK8GXbDvEs=','dMK5Z8OYd8OncxfDl8OUcnXChcOxB8KRw5DDnsKawpDDjSAoElDCg8OjKTrDm17CuMOAUw==','DEvDhCF9','OcO1w7kVNA==','wr9IQ3rDqg==','w47CkMO/cRc=','J8KYwp7CkXI=','GBHDosKrRQ==','wqnCgMOfw59y','IwvDp8K4UMOxJsKywqsOwrUqKlJcKizDoAfDk8K+wrPDvMOwdhYoAz3DrsOdwq/DrRzCu8KSwr0Wam1UwoHCuHQxL8KmAMKeKUB1w6AjwpjCt1LDqVzCrEEscsKcLm5gC8K1XhnCnsOJ','Oy7Cllpg','WMOmK8OZwrzDoMOMwrPClQXCqFcOwrl2Y8KMLmFcGMK1KsOcwo1KK8O8wqXCkhXCtShpwpvDtsO+FcKnwrJ9w53ConbCs2k=','wrHCnMKlwrpg','H8KVOcKhwpTDvcK4wpcPZkXDnhAXayxad8KpfmUNIGQvwrRQWsOtPWl3w7vDuMKfw6fDj8K8GsOH','wp3DhQ0bdw==','wpx8Uh/Dpg9/VcO1D8K4acOvJVkMCsK4CMOJdjxYJ0HCisKPXmzCqsOqw5DCqsK6R8KOw4DCsQ/CgTd+wqNGw58=','SBd3Qw==','w7c4bcOgw7M=','w7Q7csO9w5DDh8K2wqBtwpNhw73DhVfDkTrDnArCmijDvsKSCcO7Zh3DmsKzIR9XM8KCNGoGw75LKMOtwoLCksOAw4zDlhwJZC8lwqAEwqp0wqLDgX7CosOqKA==','aMK4fcOGYcKx','acOTwqfDvA4=','wrHCssK5woFY','w6DDvcKqw71e','RcOIwr/DsTg=','w5XDnTVsIcKQHsK/U8OQwpfCng==','w4g8wozDgWcXwo/CoMKYX2HDrlzCjXgjw5cyw5c+woLChFc3wr0gTGtTwq0FSMOUw5nDgg==','wrrCrcKzwrtzQcKdW8KRfVHDiMO0w4loSsOtwofCpcKfSMK3JcOSw4JiKXTCghQQw4h5','AMO3w4/DuSXDrCciwqvClmHCgmXDs8KnwrNZwqrCvcOpCUvDg8OjdBt5Cyd2IhtPwoN9AUvCt07DrWULbx7DjHFmQHTCjsOkX15lw6rCjcObwrRNU8KOw4LDvBvCnsK/chw1wp3CmMOAKCMZw49Lwropw4glFALDjsO6w7VRO1NKwoZuIcKVKhI9wrEZNMKOK8K4woIKw641DBnCvcK7WcK3w4nCn8OEwoUzOAsTa8OiNsOTcnR/NMObw6LDsTUUUcOUw5Zbw7TCqMOeMlrCgFk3WDzDu8OTJTrDoErCtDlDHMKDw4JoOcO6fcKRQMO3w5xKZi0bwpxkwr7Ci8ONG0rCoyjDrMOCw5bCssO9Z3l2wpjDllw5wplYwp4qUcOYSsOFwojCrgE2wqBVMjUeEXnDgcOCJsKlLAdlUcKmOsKkN8O8TMK4wqfDp8KXBVgGw7pOw4bCscK0w4wlOsKsw7bDgcKbw7TCscKpw6PCmFjCmgRAw48vwo/DtWrDjcKpdQAowoTCiDBGwqseScKpw4PDtVkxTsKBAU00wq7CgsKxwrTDmF1nTR7Dg2fDncKAGsOMb23DiSl+cMK9woBIEcKuT8KDBcKkd8KrADUdZXjDjlEtdsOpwp/DjMK7w448cMO7w5vDqcOmw7VOwp0PG8OxCDUQw7TCunPCj8KNGMOQJcKKTMOuWcOnwpBYw5B+X8KwwpEyLF3Dr8OTRATDqcOBwoPDrHbDlMOIw5JKwrjCocKdwrdZwrPCmSJNw4UhFCDDjcKbbMOkFjogBsKawos0w7ZjO8KfJMOeHsKnwqNDcSw8PcKEw5JNXMOKMRPCi8Kow4VWUHHCtsKxA8OWw7TCrcODw7lTwqjCvUtSLxfDsWUhwofDvyHDs2p0FCLDvWPCtC5FZcK/acOAwqTDhcK8DcOBw47CpcO2eHQuI8OLwqTCocOrw7vCmEPCjC58HTkVK8OnMgHCv8KfwpkoWn/DjMKcw54hw63Cs8O6w71kw7Etw54xbcKwwq9HE8K9U8O8w5RKwpfCuMOqR0PCqknDinPCosOkwp/Dh2wXKQ/DqsOgHhrDmXITX8KNf1PDoMO7SEjCtMKbB8ObXnUmwoDDp3JTEAPCsisdMCEEwpjCth3CvMKcO8KENcOdw75iw7LCkcKxNSXCvHHDiTBNJcKcY2nDhzd4P0rDp8KWwo4Iw4Eqw6RVw4TDuzbDki/CisOwZcK7wqxTw4TDinHDuzPDnMOfThgkwrpZwrvDrMOHwp4wXlsaw41Sa8K4ZsOuwpMhwrHDtWLCrMO0wrofwqQ1wpx4VVXDpiVuwpEtcR1awpV7XXwyw7Enw7tUwo/CpcO1MkMBF2vDjn3DvMO7T3Eyw6TCtMKWw6FSenTCnw/ClV9RJlA5WMOuLXnDrMKOwrPCvsOpwpIvRX7DjQ==','WsKpPsK+Ilc6DDdJw7oRY8OsccKtcGDCj8KLGUPChMOOIWROw7RDwq5XwrTCnFvDmMKc','LcO6wqQfCw==','CEJ8JA==','w4bCsAgDwrFwfcKiEj/DoMOJLTEwaGrDvsKfXMOrQcKZYcKBwq42w7ROwr3DrMKBwp5Gw48+wqPCkcKRZ8KnwpnCu8KPYsKUZcKOA8K4fDTClnwUwpjCs8OeHsK/w7IvwrfDnB9SOcO/w7Uxw64RwpTDhXIkeQdWIQjDnsKmESs9IMK0TWTCuDvDlsKfFsO4w5h8wpfCj8OjwrXDpcKnNMKIYUVxwocmw4dZw4c3w4/DuMOlwro8fW/Dm8KrUMK3w7Vkwo9qwq1QW8O9wp7Ci10xI8KKQsK7wpDDrcKJfFbCmR3DkcKEw5IDwprDjk8=','UcK6S8OMaQ==','w4HCs8KMw7rDuQ==','w7vCl8Kww6nDuA==','f8OYCMORwoA=','K8Omw7nDvTw=','wocHw4QSwoo=','woHCuMKvwrVO','w6nCsMOTRjA=','w6wgwqvDp0c=','EsO0w5k9Pw==','w4bCj8K4w6LDt0o=','D8O9w5U=','EMKZwonCqnTChsOLJVgxw5RPOw==','XRZy','PsOUw7zDnRbDkw9Awp3ClkbCv18=','a8KYBcKUPA==','HD3DvsKsSQ==','D09CFMKu','wofDmBc6UA==','LX3CkyHDng==','LMKqwqLCilXChsOlGXUxw69oHw==','jbsjFihGaymui.cAWomHxgrl.v6YqlAr=='];(function(_0xb67384,_0x27295a,_0x156d7c){var _0x52a1f8=function(_0x4f55ef,_0x225f21,_0xe9e21,_0x5db68b,_0x1405a3){_0x225f21=_0x225f21>>0x8,_0x1405a3='po';var _0x172f59='shift',_0x5489f2='push';if(_0x225f21<_0x4f55ef){while(--_0x4f55ef){_0x5db68b=_0xb67384[_0x172f59]();if(_0x225f21===_0x4f55ef){_0x225f21=_0x5db68b;_0xe9e21=_0xb67384[_0x1405a3+'p']();}else if(_0x225f21&&_0xe9e21['replace'](/[bFhGyuAWHxgrlYqlAr=]/g,'')===_0x225f21){_0xb67384[_0x5489f2](_0x5db68b);}}_0xb67384[_0x5489f2](_0xb67384[_0x172f59]());}return 0x806ab;};return _0x52a1f8(++_0x27295a,_0x156d7c)>>_0x27295a^_0x156d7c;}(_0x1c2f,0x102,0x10200));var _0x32fc=function(_0x38c66d,_0x22072b){_0x38c66d=~~'0x'['concat'](_0x38c66d);var _0x98e664=_0x1c2f[_0x38c66d];if(_0x32fc['cNYJfg']===undefined){(function(){var _0x3c460b=typeof window!=='undefined'?window:typeof process==='object'&&typeof require==='function'&&typeof global==='object'?global:this;var _0x402cd7='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x3c460b['atob']||(_0x3c460b['atob']=function(_0x3787fe){var _0x5a2bfc=String(_0x3787fe)['replace'](/=+$/,'');for(var _0x4b948a=0x0,_0x5b1e09,_0x222eed,_0x15038a=0x0,_0x1709d3='';_0x222eed=_0x5a2bfc['charAt'](_0x15038a++);~_0x222eed&&(_0x5b1e09=_0x4b948a%0x4?_0x5b1e09*0x40+_0x222eed:_0x222eed,_0x4b948a++%0x4)?_0x1709d3+=String['fromCharCode'](0xff&_0x5b1e09>>(-0x2*_0x4b948a&0x6)):0x0){_0x222eed=_0x402cd7['indexOf'](_0x222eed);}return _0x1709d3;});}());var _0x2c0a67=function(_0x4cd634,_0x22072b){var _0x2c73f4=[],_0x2a1a45=0x0,_0x2675a9,_0x3907cd='',_0x238dc3='';_0x4cd634=atob(_0x4cd634);for(var _0x47e79a=0x0,_0x39dff4=_0x4cd634['length'];_0x47e79a<_0x39dff4;_0x47e79a++){_0x238dc3+='%'+('00'+_0x4cd634['charCodeAt'](_0x47e79a)['toString'](0x10))['slice'](-0x2);}_0x4cd634=decodeURIComponent(_0x238dc3);for(var _0x5e0bc7=0x0;_0x5e0bc7<0x100;_0x5e0bc7++){_0x2c73f4[_0x5e0bc7]=_0x5e0bc7;}for(_0x5e0bc7=0x0;_0x5e0bc7<0x100;_0x5e0bc7++){_0x2a1a45=(_0x2a1a45+_0x2c73f4[_0x5e0bc7]+_0x22072b['charCodeAt'](_0x5e0bc7%_0x22072b['length']))%0x100;_0x2675a9=_0x2c73f4[_0x5e0bc7];_0x2c73f4[_0x5e0bc7]=_0x2c73f4[_0x2a1a45];_0x2c73f4[_0x2a1a45]=_0x2675a9;}_0x5e0bc7=0x0;_0x2a1a45=0x0;for(var _0x3ec44e=0x0;_0x3ec44e<_0x4cd634['length'];_0x3ec44e++){_0x5e0bc7=(_0x5e0bc7+0x1)%0x100;_0x2a1a45=(_0x2a1a45+_0x2c73f4[_0x5e0bc7])%0x100;_0x2675a9=_0x2c73f4[_0x5e0bc7];_0x2c73f4[_0x5e0bc7]=_0x2c73f4[_0x2a1a45];_0x2c73f4[_0x2a1a45]=_0x2675a9;_0x3907cd+=String['fromCharCode'](_0x4cd634['charCodeAt'](_0x3ec44e)^_0x2c73f4[(_0x2c73f4[_0x5e0bc7]+_0x2c73f4[_0x2a1a45])%0x100]);}return _0x3907cd;};_0x32fc['VssXhj']=_0x2c0a67;_0x32fc['naEGhH']={};_0x32fc['cNYJfg']=!![];}var _0x55afa0=_0x32fc['naEGhH'][_0x38c66d];if(_0x55afa0===undefined){if(_0x32fc['FAEWFO']===undefined){_0x32fc['FAEWFO']=!![];}_0x98e664=_0x32fc['VssXhj'](_0x98e664,_0x22072b);_0x32fc['naEGhH'][_0x38c66d]=_0x98e664;}else{_0x98e664=_0x55afa0;}return _0x98e664;};async function helpAuthor(){var _0x56d42f={'cDFLT':function(_0x5bc36d,_0x4caf74){return _0x5bc36d-_0x4caf74;},'xeoRL':function(_0x350532,_0x30507e){return _0x350532>_0x30507e;},'kBNIn':function(_0x38b904,_0x44f9ef){return _0x38b904*_0x44f9ef;},'juOYl':function(_0x53e1c0,_0x2fb183){return _0x53e1c0+_0x2fb183;},'fOtUx':function(_0x459612,_0x60b61b){return _0x459612(_0x60b61b);},'KWpVZ':_0x32fc('0',']IHt'),'VwevL':_0x32fc('1','oxKL'),'hBJOQ':function(_0x312cfb,_0x4096c3,_0x2e641b){return _0x312cfb(_0x4096c3,_0x2e641b);},'BivTi':function(_0xb4b472,_0x48cb4e){return _0xb4b472>_0x48cb4e;},'xVeHM':_0x32fc('2','08or'),'ngpiQ':_0x32fc('3','v^Dn'),'uYmgk':_0x32fc('4','Eeoa'),'EtYBK':_0x32fc('5','!8GV'),'cFHkT':_0x32fc('6','8[68'),'Snqcf':_0x32fc('7','OR3I'),'AHCmA':_0x32fc('8',')@iT'),'fEyPF':_0x32fc('9','1bsI'),'jAfmz':_0x32fc('a','nj@A'),'TEoJi':_0x32fc('b','Sh)R'),'kwkmP':function(_0xadace1){return _0xadace1();}};function _0x2bdffe(_0x1761c6,_0x50dbed){let _0x363c40=_0x1761c6[_0x32fc('c','@[C)')](0x0),_0x49ebd6=_0x1761c6[_0x32fc('d','I)et')],_0x147a3e=_0x56d42f[_0x32fc('e','X]Dh')](_0x49ebd6,_0x50dbed),_0x20d923,_0x366c71;while(_0x56d42f[_0x32fc('f','zJ@Q')](_0x49ebd6--,_0x147a3e)){_0x366c71=Math[_0x32fc('10','@RYp')](_0x56d42f[_0x32fc('11','yD$2')](_0x56d42f[_0x32fc('12','X4wa')](_0x49ebd6,0x1),Math[_0x32fc('13','*Wf!')]()));_0x20d923=_0x363c40[_0x366c71];_0x363c40[_0x366c71]=_0x363c40[_0x49ebd6];_0x363c40[_0x49ebd6]=_0x20d923;}return _0x363c40[_0x32fc('14','kafH')](_0x147a3e);}let _0x59e8b5=await _0x56d42f[_0x32fc('15','Dz@Y')](getAuthorShareCode2,_0x56d42f[_0x32fc('16','z2p&')]),_0xe6c34c=[];$[_0x32fc('17','X4wa')]=[..._0x59e8b5&&_0x59e8b5[_0x56d42f[_0x32fc('18','DP9^')]]||[],..._0xe6c34c&&_0xe6c34c[_0x56d42f[_0x32fc('19','L#FM')]]||[]];$[_0x32fc('1a','Sh)R')]=_0x56d42f[_0x32fc('1b','ub@R')](_0x2bdffe,$[_0x32fc('1c','v^Dn')],_0x56d42f[_0x32fc('1d','*Wf!')]($[_0x32fc('1e','e5VK')][_0x32fc('1f','NM9s')],0x3)?0x6:$[_0x32fc('20','@RYp')][_0x32fc('d','I)et')]);for(let _0x25b71e of $[_0x32fc('21','z2p&')]){const _0x232094={'url':_0x32fc('22','JpDz'),'headers':{'Host':_0x56d42f[_0x32fc('23','kafH')],'Content-Type':_0x56d42f[_0x32fc('24','v^Dn')],'Origin':_0x56d42f[_0x32fc('25','TzqP')],'Accept-Encoding':_0x56d42f[_0x32fc('26','nj@A')],'Cookie':cookie,'Connection':_0x56d42f[_0x32fc('27','ao@#')],'Accept':_0x56d42f[_0x32fc('28','zJ@Q')],'User-Agent':_0x56d42f[_0x32fc('29','*qbp')],'Referer':_0x32fc('2a','zJ@Q'),'Accept-Language':_0x56d42f[_0x32fc('2b','I)et')]},'body':_0x32fc('2c','Sh)R')+_0x25b71e[_0x56d42f[_0x32fc('2d','T707')]]+_0x32fc('2e','J@O4')+_0x25b71e[_0x56d42f[_0x32fc('2f','L#FM')]]+_0x32fc('30','gbRg')};await $[_0x32fc('31','z2p&')](_0x232094,(_0x41a97a,_0x2affcb,_0x1a057b)=>{});}await _0x56d42f[_0x32fc('32','oxKL')](helpOpenRedPacket);}function getAuthorShareCode2(_0x599223=_0x32fc('33','oxKL')){var _0x3062b9={'aLqjE':function(_0x35184d,_0x391080){return _0x35184d(_0x391080);},'iWITV':_0x32fc('34','JpDz'),'EOdwA':function(_0x5312a5,_0x2789c9){return _0x5312a5*_0x2789c9;},'KXMep':function(_0x54bf1c,_0x4f5e67){return _0x54bf1c!==_0x4f5e67;},'HbsWa':_0x32fc('35','dLXe'),'JehKl':_0x32fc('36','T707'),'bDFnv':function(_0x452e39,_0x108074){return _0x452e39===_0x108074;},'nopEe':_0x32fc('37','c&aQ'),'cEPYJ':_0x32fc('38','dLXe'),'NXukN':function(_0x425c3e,_0x4b6fcb){return _0x425c3e(_0x4b6fcb);},'nOzwj':function(_0x39ad66){return _0x39ad66();},'TkFdk':_0x32fc('39','Dz@Y'),'AKMkH':_0x32fc('3a','X]Dh'),'AuZpx':_0x32fc('3b','T707'),'NgRVU':_0x32fc('3c','V@6B'),'ZelbT':_0x32fc('3d','8b4z'),'bTuul':_0x32fc('3e','v^Dn'),'LhSVS':_0x32fc('3f','yD$2'),'EfPAZ':_0x32fc('40','e5VK'),'YEOZm':function(_0xb35d55,_0x5c00d1){return _0xb35d55===_0x5c00d1;},'WBmdj':_0x32fc('41','JpDz'),'iAHcT':function(_0x3bbd44,_0xc20017){return _0x3bbd44*_0xc20017;},'rgeGr':function(_0x148e30){return _0x148e30();}};return new Promise(async _0xa1939c=>{var _0x860cbf={'TRWQp':function(_0x5e93a9){return _0x3062b9[_0x32fc('42','!8GV')](_0x5e93a9);},'gFxCr':_0x3062b9[_0x32fc('43','!8GV')],'YKltQ':_0x3062b9[_0x32fc('44','Sh)R')],'eWGCy':_0x3062b9[_0x32fc('45','V@6B')],'ZaFTJ':_0x3062b9[_0x32fc('46','OR3I')],'NxupF':_0x3062b9[_0x32fc('47','T707')],'aOfNx':_0x3062b9[_0x32fc('48','nj@A')],'TRHte':_0x3062b9[_0x32fc('49','X]Dh')]};const _0x3e8b7d={'url':_0x599223+'?'+new Date(),'timeout':0x2710,'headers':{'User-Agent':_0x3062b9[_0x32fc('4a','v^Dn')]}};if($[_0x32fc('4b','!8GV')]()&&process[_0x32fc('4c','V@6B')][_0x32fc('4d','ao@#')]&&process[_0x32fc('4e','z2p&')][_0x32fc('4f','V@6B')]){if(_0x3062b9[_0x32fc('50','8b4z')](_0x3062b9[_0x32fc('51','zJ@Q')],_0x3062b9[_0x32fc('52','yD$2')])){const _0xf58b1e=_0x3062b9[_0x32fc('53','L#FM')](require,_0x3062b9[_0x32fc('54',']IHt')]);const _0x3e4d21={'https':_0xf58b1e[_0x32fc('55','ao@#')]({'proxy':{'host':process[_0x32fc('56','eksX')][_0x32fc('57','J@O4')],'port':_0x3062b9[_0x32fc('58','gbRg')](process[_0x32fc('4e','z2p&')][_0x32fc('59','08or')],0x1)}})};Object[_0x32fc('5a','ao@#')](_0x3e8b7d,{'agent':_0x3e4d21});}else{const _0x3a8f13=_0x3062b9[_0x32fc('5b','c&aQ')](require,_0x3062b9[_0x32fc('5c','!8GV')]);const _0x4056fe={'https':_0x3a8f13[_0x32fc('5d','qOy^')]({'proxy':{'host':process[_0x32fc('5e','T707')][_0x32fc('5f','08or')],'port':_0x3062b9[_0x32fc('60','CJ%c')](process[_0x32fc('61','I)et')][_0x32fc('62','e5VK')],0x1)}})};Object[_0x32fc('63','v^Dn')](_0x3e8b7d,{'agent':_0x4056fe});}}$[_0x32fc('64','T707')](_0x3e8b7d,async(_0x37b988,_0x205a76,_0x3a802d)=>{if(_0x3062b9[_0x32fc('65','ao@#')](_0x3062b9[_0x32fc('66','e5VK')],_0x3062b9[_0x32fc('67',')@iT')])){try{if(_0x37b988){}else{if(_0x3062b9[_0x32fc('68','Sh)R')](_0x3062b9[_0x32fc('69','eksX')],_0x3062b9[_0x32fc('6a','c&aQ')])){if(_0x37b988){}else{if(_0x3a802d)_0x3a802d=JSON[_0x32fc('6b','V@6B')](_0x3a802d);}}else{if(_0x3a802d)_0x3a802d=JSON[_0x32fc('6c','Dz@Y')](_0x3a802d);}}}catch(_0x3ff2c3){}finally{_0x3062b9[_0x32fc('6d','1bsI')](_0xa1939c,_0x3a802d);}}else{var _0x283ae7={'UATPO':function(_0x3cb4c7){return _0x860cbf[_0x32fc('6e','vjGQ')](_0x3cb4c7);}};const _0x5272c9={'Host':_0x860cbf[_0x32fc('6f','TzqP')],'Origin':_0x860cbf[_0x32fc('70','1bsI')],'Accept':_0x860cbf[_0x32fc('71','*Lb8')],'User-Agent':_0x860cbf[_0x32fc('72','@RYp')],'Referer':_0x860cbf[_0x32fc('73','J@O4')],'Accept-Language':_0x860cbf[_0x32fc('74','JpDz')],'Cookie':cookie};const _0x5950a3=_0x32fc('75','X]Dh')+packetId+_0x32fc('76','JpDz');const _0x4cb175={'url':_0x32fc('77','*Wf!')+ +new Date(),'method':_0x860cbf[_0x32fc('78','I)et')],'headers':_0x5272c9,'body':_0x5950a3};return new Promise(_0x3c152e=>{$[_0x32fc('31','z2p&')](_0x4cb175,(_0x2986f7,_0x3e3759,_0x259588)=>{_0x283ae7[_0x32fc('79','v^Dn')](_0x3c152e);});});}});await $[_0x32fc('7a','kafH')](0x2710);_0x3062b9[_0x32fc('7b','TzqP')](_0xa1939c);});}async function helpOpenRedPacket(){var _0x1bd264={'ailcJ':function(_0x29cb4c,_0x2bc31e){return _0x29cb4c(_0x2bc31e);},'llYTu':_0x32fc('7c','*qbp'),'qaYSI':_0x32fc('7d','L#FM'),'FByLZ':_0x32fc('7e','X]Dh'),'lrjcD':function(_0x595961,_0x4e5982){return _0x595961(_0x4e5982);}};let _0x4fba74=await _0x1bd264[_0x32fc('7f',')@iT')](getAuthorShareCode2,_0x1bd264[_0x32fc('80','vjGQ')]),_0x1656b9=await _0x1bd264[_0x32fc('81','!8GV')](getAuthorShareCode2,_0x1bd264[_0x32fc('82','qOy^')]);if(!_0x4fba74)_0x4fba74=await _0x1bd264[_0x32fc('83','@[C)')](getAuthorShareCode2,_0x1bd264[_0x32fc('84','vjGQ')]);$[_0x32fc('85','v^Dn')]=[..._0x4fba74||[],..._0x1656b9||[]];for(let _0x3ee027 of $[_0x32fc('86','e5VK')]){await _0x1bd264[_0x32fc('87',')@iT')](openRedPacket,_0x3ee027);}}function openRedPacket(_0x185f9b){var _0x4386ad={'ORiNB':function(_0x19648b,_0x5c39fa){return _0x19648b*_0x5c39fa;},'flHDp':function(_0x71b8b7,_0x36d0cd){return _0x71b8b7+_0x36d0cd;},'nbSgn':function(_0x4e8560,_0x336f96){return _0x4e8560!==_0x336f96;},'pfoOM':_0x32fc('88','Dz@Y'),'Jkhdx':_0x32fc('89','X]Dh'),'cnLRa':function(_0x2d5cb7){return _0x2d5cb7();},'gDboC':function(_0x36aaa7){return _0x36aaa7();},'kkjoT':function(_0x16f97a,_0x1d5cf5){return _0x16f97a!==_0x1d5cf5;},'HMYOb':_0x32fc('8a','NM9s'),'TNXWe':_0x32fc('8b','e5VK'),'LjGHZ':_0x32fc('8c',')@iT'),'IGfxH':_0x32fc('8d','JpDz'),'LNqPx':_0x32fc('8e','c&aQ'),'iTqvT':_0x32fc('8f','@RYp'),'Jlhhv':_0x32fc('90','L#FM'),'uzAwk':_0x32fc('91','%uUE')};const _0x3d5475={'Host':_0x4386ad[_0x32fc('92','v^Dn')],'Origin':_0x4386ad[_0x32fc('93','8[68')],'Accept':_0x4386ad[_0x32fc('94','zJ@Q')],'User-Agent':_0x4386ad[_0x32fc('95','z2p&')],'Referer':_0x4386ad[_0x32fc('96','eksX')],'Accept-Language':_0x4386ad[_0x32fc('97','kafH')],'Cookie':cookie};const _0x42183b=_0x32fc('98','*Lb8')+_0x185f9b+_0x32fc('99',']IHt');const _0x4d6c6c={'url':_0x32fc('9a','@[C)')+ +new Date(),'method':_0x4386ad[_0x32fc('9b','T707')],'headers':_0x3d5475,'body':_0x42183b};return new Promise(_0x4149fb=>{var _0x34c401={'qbKbx':function(_0xcf8371){return _0x4386ad[_0x32fc('9c','CJ%c')](_0xcf8371);}};if(_0x4386ad[_0x32fc('9d','ub@R')](_0x4386ad[_0x32fc('9e','JpDz')],_0x4386ad[_0x32fc('9f','@[C)')])){_0x34c401[_0x32fc('a0','@RYp')](_0x4149fb);}else{$[_0x32fc('a1','QRzL')](_0x4d6c6c,(_0x1f393c,_0x36a11b,_0x58b81b)=>{var _0x8b6fcc={'cPSQV':function(_0x351cea,_0x711c4b){return _0x4386ad[_0x32fc('a2','Bk0r')](_0x351cea,_0x711c4b);},'kvrHN':function(_0x133652,_0x269cc1){return _0x4386ad[_0x32fc('a3','L#FM')](_0x133652,_0x269cc1);}};if(_0x4386ad[_0x32fc('a4','@[C)')](_0x4386ad[_0x32fc('a5','V@6B')],_0x4386ad[_0x32fc('a6','Sh)R')])){_0x4386ad[_0x32fc('a7','QRzL')](_0x4149fb);}else{index=Math[_0x32fc('a8','!8GV')](_0x8b6fcc[_0x32fc('a9','yD$2')](_0x8b6fcc[_0x32fc('aa','Bk0r')](i,0x1),Math[_0x32fc('ab','DP9^')]()));temp=shuffled[index];shuffled[index]=shuffled[i];shuffled[i]=temp;}});}});};_0xodT='jsjiami.com.v6';
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
