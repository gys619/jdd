/*
cron "30 * * * *" jd_CheckCK.js, tag:京东CK检测by-ccwav
*/
//Check Ck Tools by ccwav
//Update : 20210903
//增加变量显示正常CK:  export SHOWSUCCESSCK="true"
//增加变量永远通知CK状态:  export CKALWAYSNOTIFY="true"
//增加变量停用自动启用CK:  export CKAUTOENABLE="false"
//增加变量不显示CK备注:  export CKREMARK="false"
const $ = new Env('京东CK检测');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const got = require('got');
const {
    getEnvs, DisableCk, EnableCk
} = require('./ql');
const api = got.extend({
    retry: {
        limit: 0
    },
    responseType: 'json',
});

let allMessage = '',
    ErrorMessage = '',
    SuccessMessage = '',
    DisableMessage = '',
    EnableMessage = '',
    OErrorMessage = '';
let ShowSuccess = "false",
    CKAlwaysNotify = "false",
    CKAutoEnable = "true",
    CKRemark = "true",
	NoWarnError = "false";
	
if (process.env.SHOWSUCCESSCK) {
    ShowSuccess = process.env.SHOWSUCCESSCK;
}
if (process.env.CKALWAYSNOTIFY) {
    CKAlwaysNotify = process.env.CKALWAYSNOTIFY;
}
if (process.env.CKAUTOENABLE) {
    CKAutoEnable = process.env.CKAUTOENABLE;
}
if (process.env.CKREMARK) {
    CKRemark = process.env.CKREMARK;
}
if (process.env.CKNOWARNERROR) {
    NoWarnError = process.env.CKNOWARNERROR;
}

!(async() => {
    const envs = await getEnvs();
    if (!envs[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {
            "open-url": "https://bean.m.jd.com/bean/signIndex.action"
        });
        return;
    }

    for (let i = 0; i < envs.length; i++) {
        if (envs[i].value) {
            cookie = envs[i].value;
            $.UserName = (cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            $.UserName2 = decodeURIComponent($.UserName);
            $.index = i + 1;
            $.isLogin = true;
            $.error = '';
            $.nickName = "";
            $.Remark = '';
            $.CheckTime = 1;
            if (CKRemark == "true") {
                $.Remark = envs[i].remarks || '';
                if ($.Remark) {
                    $.Remark = $.Remark.replace("remark=", "");
                    $.Remark = $.Remark.replace(";", "");
                    $.Remark = "(" + $.Remark + ")";
                }
            }
            console.log(`开始检测【京东账号${$.index}】${$.UserName2} ${$.Remark}....\n`);

            await TotalBean();

            if ($.error) {
                OErrorMessage += $.error;
                continue;
            }
            if ($.isLogin) {
                if (!$.nickName) {
                    console.log(`别名都获取不到你跟我说没过期，我信你个鬼，20秒后再测一遍....\n`);
                    await $.wait(20 * 1000)
                    await TotalBean();
                    $.CheckTime = 2;
                    if ($.isLogin) {
                        if (!$.nickName) {
                            console.log(`还是不信，10秒后更换接口再测一遍....\n`);
                            await $.wait(10 * 1000)
							//更换接口测试
                            await isLoginByX1a0He();
                            $.CheckTime = 3;
                        }
                    }
                }
            }

            if (!$.isLogin) {
                if ($.CheckTime == 2) {
                    console.log(`狗东敢骗老子，继续禁用!\n`);
                }
                if ($.CheckTime == 3) {
                    console.log(`狗东敢骗老子2次，继续禁用!\n`);
                }
                if (envs[i].status == 0) {
                    const DisableCkBody = await DisableCk(envs[i]._id);
                    if (DisableCkBody.code == 200) {
                        console.log(`京东账号${$.index} : ${$.nickName || $.UserName}${$.Remark} 已失效,自动禁用成功!\n`);
                        DisableMessage += `京东账号${$.index} : ${$.nickName || $.UserName}${$.Remark} (自动禁用成功!)\n`;
                        ErrorMessage += `京东账号${$.index} : ${$.nickName || $.UserName}${$.Remark}  已失效,自动禁用成功!\n`;
                    } else {
                        console.log(`京东账号${$.index} : ${$.nickName || $.UserName}${$.Remark} 已失效,自动禁用失败!\n`);
                        DisableMessage += `京东账号${$.index} : ${$.nickName || $.UserName}${$.Remark} (自动禁用失败!)\n`;
                        ErrorMessage += `京东账号${$.index} : ${$.nickName || $.UserName}${$.Remark}  已失效,自动禁用失败!\n`;
                    }
                } else {
                    console.log(`京东账号${$.index} : ${$.nickName || $.UserName}${$.Remark} 已失效,已禁用!\n`);
                    ErrorMessage += `京东账号${$.index} : ${$.nickName || $.UserName}${$.Remark} 已失效,已禁用.\n`;
                }
            } else {

                if ($.CheckTime == 3) {
                    console.log(`我信了，你这账号真的没有别名，通过!\n`);
                } else {
                    console.log(`成功获取到别名: ${$.nickName},Pass!\n`);
                }
                if (envs[i].status == 1) {

                    if (CKAutoEnable == "true") {
                        const EnableCkBody = await EnableCk(envs[i]._id);
                        if (EnableCkBody.code == 200) {
                            console.log(`京东账号${$.index} : ${$.nickName || $.UserName}${$.Remark} 已恢复,自动启用成功!\n`);
                            EnableMessage += `京东账号${$.index} : ${$.nickName || $.UserName}${$.Remark} (自动启用成功!)\n`;
                        } else {
                            console.log(`京东账号${$.index} : ${$.nickName || $.UserName}${$.Remark} 已恢复,自动启用失败!\n`);
                            EnableMessage += `京东账号${$.index} : ${$.nickName || $.UserName}${$.Remark} (自动启用失败!)\n`;
                        }
                    } else {
                        console.log(`京东账号${$.index} : ${$.nickName || $.UserName}${$.Remark} 已恢复，可手动启用!\n`);
                        EnableMessage += `京东账号${$.index} : ${$.nickName || $.UserName}${$.Remark} 已恢复，可手动启用.\n`;
                    }
                } else {
                    console.log(`京东账号${$.index} : ${$.nickName || $.UserName}${$.Remark} 状态正常!\n`);
                    SuccessMessage += `京东账号${$.index} : ${$.nickName || $.UserName}${$.Remark}\n`;
                }
            }
        }
        await $.wait(2 * 1000)
    }

    if ($.isNode()) {
        if (OErrorMessage) {
            allMessage += `👇👇👇👇👇检测出错账号👇👇👇👇👇\n` + OErrorMessage + `\n\n`;
        }
        if (DisableMessage) {
            allMessage += `👇👇👇👇👇自动禁用账号👇👇👇👇👇\n` + DisableMessage + `\n\n`;
        }
        if (EnableMessage) {
            if (CKAutoEnable == "true") {
                allMessage += `👇👇👇👇👇自动启用账号👇👇👇👇👇\n` + EnableMessage + `\n\n`;
            } else {
                allMessage += `👇👇👇👇👇账号已恢复👇👇👇👇👇\n` + EnableMessage + `\n\n`;
            }
        }

        if (ErrorMessage) {
            allMessage += `👇👇👇👇👇失效账号👇👇👇👇👇\n` + ErrorMessage + `\n\n`;
        } else {
            allMessage += `👇👇👇👇👇失效账号👇👇👇👇👇\n 一个失效的都没有呢，羡慕啊...\n\n`;
        }

        console.log(allMessage);

        if (ShowSuccess == "true" && SuccessMessage) {
            allMessage += `👇👇👇👇👇有效账号👇👇👇👇👇\n` + SuccessMessage + `\n`;
        }
		
		if(NoWarnError== "true"){
			OErrorMessage="NoWarn!";
		}
		
        if ($.isNode() && (EnableMessage || DisableMessage || OErrorMessage || CKAlwaysNotify == "true")) {
            await notify.sendNotify(`${$.name}`, `${allMessage}`, {
                url: `https://bean.m.jd.com/beanDetail/index.action?resourceValue=bean`
            })
        }
    }

})()
.catch((e) => $.logErr(e))
    .finally(() => $.done())

function TotalBean() {
    return new Promise(async resolve => {
        const options = {
            url: "https://me-api.jd.com/user_new/info/GetJDUserInfoUnion",
            headers: {
                Host: "me-api.jd.com",
                Accept: "*/*",
                Connection: "keep-alive",
                Cookie: cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
                "Accept-Language": "zh-cn",
                "Referer": "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&",
                "Accept-Encoding": "gzip, deflate, br"
            }
        }
        $.get(options, (err, resp, data) => {
            try {
                if (err) {
                    $.logErr(err)
                    $.error = `${$.name} :` + `${JSON.stringify(err)}\n`;
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data['retcode'] === "1001") {
                            $.isLogin = false; //cookie过期
                            $.nickName = decodeURIComponent($.UserName);
                            return;
                        }
                        if (data['retcode'] === "0" && data.data && data.data.hasOwnProperty("userInfo")) {
                            $.nickName = (data.data.userInfo.baseInfo.nickname);
                        } else {
                            $.nickName = decodeURIComponent($.UserName);
                            console.log("Debug Code:" + data['retcode']);
                            $.error = `${$.nickName} :` + `服务器返回未知状态，不做变动\n`;
                        }
                    } else {
						$.nickName = decodeURIComponent($.UserName);
                        $.log('京东服务器返回空数据');
                        $.error = `${$.nickName} :` + `服务器返回空数据，不做变动\n`;
                    }
                }
            } catch (e) {
                $.logErr(e)
                $.error = `检测出错，不做变动\n`;
            } finally {
                resolve();
            }
        })
    })
}
function isLoginByX1a0He(){
    return new Promise((resolve) => {
        const options = {
            url: 'https://plogin.m.jd.com/cgi-bin/ml/islogin',
            headers: {
                "Cookie": cookie,
                "referer": "https://h5.m.jd.com/",
                "User-Agent": "jdapp;iPhone;10.1.2;15.0;network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
            },
        }
        $.get(options, (err, resp, data) => {
            try{
                if(data){
                    data = JSON.parse(data);
                    if(data.islogin === "1"){
                        console.log(`使用X1a0He写的接口加强检测: Cookie有效\n`)
                    } else if(data.islogin === "0"){
                        $.isLogin = false;
						console.log(`使用X1a0He写的接口加强检测: Cookie无效\n`)
                    } else {
                        console.log(`使用X1a0He写的接口加强检测: 未知返回，不作变更...\n`)
                        $.error= `使用X1a0He写的接口加强检测: 未知返回...\n`
                    }
                }
            } catch(e){
                console.log(e);
            } finally{
                resolve();
            }
        });
    });
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
function Env(t, e) {
    "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);
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
            } catch {
                return e
            }
        }
        toStr(t, e = null) {
            try {
                return JSON.stringify(t)
            } catch {
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
