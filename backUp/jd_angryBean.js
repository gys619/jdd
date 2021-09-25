/*
真·抢京豆
更新时间：2021-7-25
备注：高速并发抢京豆，专治偷助力。设置环境变量angryBeanPins为指定账号助力，默认不助力。环境变量angryBeanMode可选值priority(优先模式)、smart(智能模式)和speed(极速模式)，默认speed模式。默认推送通知，如要屏蔽通知需将环境变量enableAngryBeanNotify的值设为false。
TG学习交流群：https://t.me/cdles
0 0 * * * https://raw.githubusercontent.com/cdle/jd_study/main/jd_angryBean.js
*/
const $ = new Env("真·抢京豆")
const ua = `jdltapp;iPhone;3.1.0;${Math.ceil(Math.random()*4+10)}.${Math.ceil(Math.random()*4)};${randomString(40)}`
const speed = "speed"
const smart = "smart"
var pins = $.isNode() ? (process.env.angryBeanPins ? process.env.angryBeanPins : "") : "";
let cookiesArr = [];
var helps = [];
var tools = [];
var maxTimes = 3;
var finished = new Set();
var init = [];
var mode = $.isNode() ? (process.env.angryBeanMode ? process.env.angryBeanMode : "speed") : "priority";

!(async () => {
     if ($.isNode() && !pins) {
          console.log("请在环境变量中填写需要助力的账号")
          return
     }
     console.log(`开启${mode}模式`)
     requireConfig()
     for (let i in cookiesArr) {
          i = +i
          cookie = cookiesArr[i]
          var tool = {
               id: i,
               cookie: cookie,
               helps: new Set(),
               times: 0,
               timeout: 0,
          }
          var address = pins.indexOf(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
          if (!$.isNode() || address != -1) {
               var data = await requestApi('signGroupHit', cookie, {
                    activeType: 2
               });
               if (data && data.data && data.data.respCode) {
                    if (data.data.respCode != "SG100") {
                         data = await getTuanInfo(cookie)
                         if (data && data.data && data.data.shareCode) {
                              console.log(`账号${toChinesNum(i+1)}，准备抢京豆`)
                              var help = {
                                   id: i,
                                   cookie: cookie,
                                   groupCode: data.data.groupCode,
                                   shareCode: data.data.shareCode,
                                   activityId: data.data.activityMsg.activityId,
                                   success: false,
                                   address: address,
                                   notYet: data.data.beanCountProgress.progressNotYet,
                              }
                              helps.push(help)
                              if (mode == speed) {
                                   tool.helps.add(i)
                              }
                              init.push(i)
                         } else {
                              console.log(`账号${toChinesNum(i+1)}，异常`)
                         }
                    } else {
                         console.log(`账号${toChinesNum(i+1)}是黑号，快去怼客服吧`)
                    }
               } else {
                    console.log(`账号${toChinesNum(i+1)}，登录信息过期了`)
               }

          }
          tools.push(tool)
     }
     helps.sort((i, j) => {
          return i.address > j.address ? 1 : -1
     })
     for (var k = 0; k < (mode == smart ? 50 : 1); k++) {
          for (let help of helps) {
               if (k != 0) {
                    if (help.success) break
                    cookie = help.cookie
                    data = await getTuanInfo(cookie)
                    if (data && data.data && data.data.shareCode) {
                         help.notYet = data.data.beanCountProgress.progressNotYet
                    }
                    if (!help.notYet) break
               }
               await open(help)
          }
     }
     if (mode == speed) {
          while (finished.size != init.length)
               await $.wait(100)
     }
     var beanCount = 0
     var msg = ""
     for (let help of helps) {
          data = await getTuanInfo(help.cookie)
          if (data) {
               var sumBeanNum = +data.data.sumBeanNumStr
               beanCount += sumBeanNum
               out = `账号${toChinesNum(help.id+1)}，已抢京豆：${sumBeanNum}`
               console.log(out)
               msg += out + "\n"
          }
     }
     out = `今日累计获得${beanCount}京豆`
     console.log(out)
     msg += out + "\n"
     if (($.isNode() ? (process.env.enableAngryBeanNotify == "false" ? "false" : "true") : "false") == "true") {
          require('./sendNotify').sendNotify(`真·抢京豆`, msg);
     }
})().catch((e) => {
          $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
     })
     .finally(() => {
          $.done();
     })

async function getTuanInfo(cookie) {
     return await requestApi('signBeanGroupStageIndex', cookie, {
          rnVersion: "3.9",
          fp: "-1",
          shshshfp: "-1",
          shshshfpa: "-1",
          referUrl: "-1",
          userAgent: "-1",
          jda: "-1",
          monitor_source: "bean_m_bean_index"
     });
}

async function open(help) {
     var tool = tools.pop()
     if (!tool) {
          finished.add(help.id)
          return
     }
     if (mode == smart && !help.notYet) {
          return
     }
     if (mode == speed) {
          tool.timeout++
          ecpt = new Set(tool.helps, finished)
          diff = new Set(init.filter(hid => !ecpt.has(hid)))
          if (tool.timeout > maxTimes * 2) { //超时处理
               open(help)
               return
          }
          if (diff.size == 0) { //助力完成
               open(help)
               return
          } else {
               if (tool.helps.has(help.id)) { //阻止自己给自己助力
                    tools.unshift(tool)
                    open(help)
                    return
               }
               //ok
          }
     } else {
          if (tool.helps.has(help.id)) {
               tool.helps.add(help.id)
               tools.unshift(tool)
               finished.add(help.id)
               return
          }
          if (tool.id == help.id) {
               tool.helps.add(help.id)
               tools.unshift(tool)
               await open(help)
               return
          }
     }
     async function handle(data) {
          var helpToast = undefined
          if (data && data.data && data.data.helpToast) {
               tool.helps.add(help.id)
               helpToast = data.data.helpToast
               if (helpToast.indexOf("助力成功") != -1) { //助力成功
                    tool.times++
                    help.notYet--
               }
               if (helpToast.indexOf("满") != -1) { //该团已经满啦~去帮别人助力吧~
                    help.success = true
               }
               if (helpToast.indexOf("今日助力次数已达上限") != -1) { //您今日助力次数已达上限~
                    tool.times = maxTimes
               }
               if (helpToast.indexOf("火爆") != -1) { //活动太火爆啦~请稍后再试~
                    tool.times = maxTimes
               }
               if (tool.times < maxTimes) {
                    tools.unshift(tool)
               }
          } else {
               if (data && data.errorMessage == "用户未登录") {
                    helpToast = "用户未登录"
               } else {
                    tools.unshift(tool)
                    helpToast = "异常"
               }
          }
          console.log(`${tool.id+1}->${help.id+1} ${helpToast}`)
          if (!help.success) {
               await open(help)
          } else {
               finished.add(help.id)
          }
     }
     var params = {
          activeType: 2,
          groupCode: help.groupCode,
          shareCode: help.shareCode,
          activeId: help.activityId + "",
          source: "guest",
     }
     if (mode != "speed") {
          data = await requestApi('signGroupHelp', tool.cookie, params)
          await handle(data)
     } else {
          requestApi('signGroupHelp', tool.cookie, params).then(handle)
     }
}

function requestApi(functionId, cookie, body = {}, time = 0) {
     var url = `https://api.m.jd.com/client.action?functionId=${functionId}&body=${JSON.stringify(body)}&appid=ld&client=apple&clientVersion=10.0.4&networkType=wifi&osVersion=13.7&uuid=&openudid=`
     return new Promise(resolve => {
          $.get({
               url: url,
               headers: {
                    "Cookie": cookie,
                    "Accept": '*/*',
                    "Connection": 'keep-alive',
                    'Referer': 'https://h5.m.jd.com/rn/3MQXMdRUTeat9xqBSZDSCCAE9Eqz/index.html?has_native=0',
                    "origin": "https://h5.m.jd.com",
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "X-Requested-With": "com.jingdong.app.mall",
                    "User-Agent": ua,
                    "Host": "api.m.jd.com",
               },
               timeout: 2500,
          }, (_, resp, data) => {
               if (data) {
                    data = JSON.parse(data)
                    resolve(data)
               } else {
                    if (time == 5) {
                         resolve(0)
                    } else {
                         requestApi(functionId, cookie, body, time + 1).then(function (data) {
                              resolve(data)
                         })
                    }
               }
          })
     })
}

let toChinesNum = (num) => {
     let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
     let unit = ["", "十", "百", "千", "万"];
     num = parseInt(num);
     let getWan = (temp) => {
          let strArr = temp.toString().split("").reverse();
          let newNum = "";
          for (var i = 0; i < strArr.length; i++) {
               newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
          }
          return newNum;
     }
     let overWan = Math.floor(num / 10000);
     let noWan = num % 10000;
     if (noWan.toString().length < 4) {
          noWan = "0" + noWan;
     }
     return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
}

function requireConfig() {
     return new Promise(resolve => {
          const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
          if ($.isNode()) {
               Object.keys(jdCookieNode).forEach((item) => {
                    if (jdCookieNode[item]) {
                         cookiesArr.push(jdCookieNode[item])
                    }
               })
               if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
          } else {
               cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
          }
          console.log(`共${cookiesArr.length}个京东账号\n`)
          resolve()
     })
}

function randomString(e) {
     e = e || 32;
     let t = "abcdefhijkmnprstwxyz2345678",
          a = t.length,
          n = "";
     for (i = 0; i < e; i++)
          n += t.charAt(Math.floor(Math.random() * a));
     return n
}

function Env(t, e) {
     "undefined" != typeof process && JSON.stringify(process.env).indexOf("GIT_HUB") > -1 && process.exit(0);
     class s {
          constructor(t) {
               this.env = t
          }
          send(t, e = "GET") {
               t = "string" == typeof t ? {
                    url: t
               } : t;
               let s = this.get;
               return "POST" === e && (s = this.post), new Promise((e, i) => {
                    s.call(this, t, (t, s, r) => {
                         t ? i(t) : e(s)
                    })
               })
          }
          get(t) {
               return this.send.call(this.env, t)
          }
          post(t) {
               return this.send.call(this.env, t, "POST")
          }
     }
     return new class {
          constructor(t, e) {
               this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`)
          }
          isNode() {
               return "undefined" != typeof module && !!module.exports
          }
          isQuanX() {
               return "undefined" != typeof $task
          }
          isSurge() {
               return "undefined" != typeof $httpClient && "undefined" == typeof $loon
          }
          isLoon() {
               return "undefined" != typeof $loon
          }
          toObj(t, e = null) {
               try {
                    return JSON.parse(t)
               } catch (e) {
                    return e
               }
          }
          toStr(t, e = null) {
               try {
                    return JSON.stringify(t)
               } catch (e) {
                    return e
               }
          }
          getjson(t, e) {
               let s = e;
               const i = this.getdata(t);
               if (i) try {
                    s = JSON.parse(this.getdata(t))
               } catch {}
               return s
          }
          setjson(t, e) {
               try {
                    return this.setdata(JSON.stringify(t), e)
               } catch {
                    return !1
               }
          }
          getScript(t) {
               return new Promise(e => {
                    this.get({
                         url: t
                    }, (t, s, i) => e(i))
               })
          }
          runScript(t, e) {
               return new Promise(s => {
                    let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
                    i = i ? i.replace(/\n/g, "").trim() : i;
                    let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
                    r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
                    const [o, h] = i.split("@"), n = {
                         url: `http://${h}/v1/scripting/evaluate`,
                         body: {
                              script_text: t,
                              mock_type: "cron",
                              timeout: r
                         },
                         headers: {
                              "X-Key": o,
                              Accept: "*/*"
                         }
                    };
                    this.post(n, (t, e, i) => s(i))
               }).catch(t => this.logErr(t))
          }
          loaddata() {
               if (!this.isNode()) return {}; {
                    this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                    const t = this.path.resolve(this.dataFile),
                         e = this.path.resolve(process.cwd(), this.dataFile),
                         s = this.fs.existsSync(t),
                         i = !s && this.fs.existsSync(e);
                    if (!s && !i) return {}; {
                         const i = s ? t : e;
                         try {
                              return JSON.parse(this.fs.readFileSync(i))
                         } catch (t) {
                              return {}
                         }
                    }
               }
          }
          writedata() {
               if (this.isNode()) {
                    this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                    const t = this.path.resolve(this.dataFile),
                         e = this.path.resolve(process.cwd(), this.dataFile),
                         s = this.fs.existsSync(t),
                         i = !s && this.fs.existsSync(e),
                         r = JSON.stringify(this.data);
                    s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
               }
          }
          lodash_get(t, e, s) {
               const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
               let r = t;
               for (const t of i)
                    if (r = Object(r)[t], void 0 === r) return s;
               return r
          }
          lodash_set(t, e, s) {
               return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t)
          }
          getdata(t) {
               let e = this.getval(t);
               if (/^@/.test(t)) {
                    const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
                    if (r) try {
                         const t = JSON.parse(r);
                         e = t ? this.lodash_get(t, i, "") : e
                    } catch (t) {
                         e = ""
                    }
               }
               return e
          }
          setdata(t, e) {
               let s = !1;
               if (/^@/.test(e)) {
                    const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}";
                    try {
                         const e = JSON.parse(h);
                         this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
                    } catch (e) {
                         const o = {};
                         this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
                    }
               } else s = this.setval(t, e);
               return s
          }
          getval(t) {
               return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null
          }
          setval(t, e) {
               return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null
          }
          initGotEnv(t) {
               this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
          }
          get(t, e = (() => {})) {
               t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
                    "X-Surge-Skip-Scripting": !1
               })), $httpClient.get(t, (t, s, i) => {
                    !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
               })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
                    hints: !1
               })), $task.fetch(t).then(t => {
                    const {
                         statusCode: s,
                         statusCode: i,
                         headers: r,
                         body: o
                    } = t;
                    e(null, {
                         status: s,
                         statusCode: i,
                         headers: r,
                         body: o
                    }, o)
               }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
                    try {
                         if (t.headers["set-cookie"]) {
                              const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
                              s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
                         }
                    } catch (t) {
                         this.logErr(t)
                    }
               }).then(t => {
                    const {
                         statusCode: s,
                         statusCode: i,
                         headers: r,
                         body: o
                    } = t;
                    e(null, {
                         status: s,
                         statusCode: i,
                         headers: r,
                         body: o
                    }, o)
               }, t => {
                    const {
                         message: s,
                         response: i
                    } = t;
                    e(s, i, i && i.body)
               }))
          }
          post(t, e = (() => {})) {
               if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
                    "X-Surge-Skip-Scripting": !1
               })), $httpClient.post(t, (t, s, i) => {
                    !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
               });
               else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
                    hints: !1
               })), $task.fetch(t).then(t => {
                    const {
                         statusCode: s,
                         statusCode: i,
                         headers: r,
                         body: o
                    } = t;
                    e(null, {
                         status: s,
                         statusCode: i,
                         headers: r,
                         body: o
                    }, o)
               }, t => e(t));
               else if (this.isNode()) {
                    this.initGotEnv(t);
                    const {
                         url: s,
                         ...i
                    } = t;
                    this.got.post(s, i).then(t => {
                         const {
                              statusCode: s,
                              statusCode: i,
                              headers: r,
                              body: o
                         } = t;
                         e(null, {
                              status: s,
                              statusCode: i,
                              headers: r,
                              body: o
                         }, o)
                    }, t => {
                         const {
                              message: s,
                              response: i
                         } = t;
                         e(s, i, i && i.body)
                    })
               }
          }
          time(t, e = null) {
               const s = e ? new Date(e) : new Date;
               let i = {
                    "M+": s.getMonth() + 1,
                    "d+": s.getDate(),
                    "H+": s.getHours(),
                    "m+": s.getMinutes(),
                    "s+": s.getSeconds(),
                    "q+": Math.floor((s.getMonth() + 3) / 3),
                    S: s.getMilliseconds()
               };
               /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length)));
               for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length)));
               return t
          }
          msg(e = t, s = "", i = "", r) {
               const o = t => {
                    if (!t) return t;
                    if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {
                         "open-url": t
                    } : this.isSurge() ? {
                         url: t
                    } : void 0;
                    if ("object" == typeof t) {
                         if (this.isLoon()) {
                              let e = t.openUrl || t.url || t["open-url"],
                                   s = t.mediaUrl || t["media-url"];
                              return {
                                   openUrl: e,
                                   mediaUrl: s
                              }
                         }
                         if (this.isQuanX()) {
                              let e = t["open-url"] || t.url || t.openUrl,
                                   s = t["media-url"] || t.mediaUrl;
                              return {
                                   "open-url": e,
                                   "media-url": s
                              }
                         }
                         if (this.isSurge()) {
                              let e = t.url || t.openUrl || t["open-url"];
                              return {
                                   url: e
                              }
                         }
                    }
               };
               if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) {
                    let t = ["", "==============📣系统通知📣=============="];
                    t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t)
               }
          }
          log(...t) {
               t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
          }
          logErr(t, e) {
               const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
               s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t)
          }
          wait(t) {
               return new Promise(e => setTimeout(e, t))
          }
          done(t = {}) {
               const e = (new Date).getTime(),
                    s = (e - this.startTime) / 1e3;
               this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
          }
     }(t, e)
}