/*
京享值PK
cron 15 2,7,18 * * * jd_joy_score.js

*/

const $ = new Env('京享值PK');
!function (n) { "use strict"; function r(n, r) { var t = (65535 & n) + (65535 & r); return (n >> 16) + (r >> 16) + (t >> 16) << 16 | 65535 & t } function t(n, r) { return n << r | n >>> 32 - r } function u(n, u, e, o, c, f) { return r(t(r(r(u, n), r(o, f)), c), e) } function e(n, r, t, e, o, c, f) { return u(r & t | ~r & e, n, r, o, c, f) } function o(n, r, t, e, o, c, f) { return u(r & e | t & ~e, n, r, o, c, f) } function c(n, r, t, e, o, c, f) { return u(r ^ t ^ e, n, r, o, c, f) } function f(n, r, t, e, o, c, f) { return u(t ^ (r | ~e), n, r, o, c, f) } function i(n, t) { n[t >> 5] |= 128 << t % 32, n[14 + (t + 64 >>> 9 << 4)] = t; var u, i, a, h, g, l = 1732584193, d = -271733879, v = -1732584194, C = 271733878; for (u = 0; u < n.length; u += 16)i = l, a = d, h = v, g = C, d = f(d = f(d = f(d = f(d = c(d = c(d = c(d = c(d = o(d = o(d = o(d = o(d = e(d = e(d = e(d = e(d, v = e(v, C = e(C, l = e(l, d, v, C, n[u], 7, -680876936), d, v, n[u + 1], 12, -389564586), l, d, n[u + 2], 17, 606105819), C, l, n[u + 3], 22, -1044525330), v = e(v, C = e(C, l = e(l, d, v, C, n[u + 4], 7, -176418897), d, v, n[u + 5], 12, 1200080426), l, d, n[u + 6], 17, -1473231341), C, l, n[u + 7], 22, -45705983), v = e(v, C = e(C, l = e(l, d, v, C, n[u + 8], 7, 1770035416), d, v, n[u + 9], 12, -1958414417), l, d, n[u + 10], 17, -42063), C, l, n[u + 11], 22, -1990404162), v = e(v, C = e(C, l = e(l, d, v, C, n[u + 12], 7, 1804603682), d, v, n[u + 13], 12, -40341101), l, d, n[u + 14], 17, -1502002290), C, l, n[u + 15], 22, 1236535329), v = o(v, C = o(C, l = o(l, d, v, C, n[u + 1], 5, -165796510), d, v, n[u + 6], 9, -1069501632), l, d, n[u + 11], 14, 643717713), C, l, n[u], 20, -373897302), v = o(v, C = o(C, l = o(l, d, v, C, n[u + 5], 5, -701558691), d, v, n[u + 10], 9, 38016083), l, d, n[u + 15], 14, -660478335), C, l, n[u + 4], 20, -405537848), v = o(v, C = o(C, l = o(l, d, v, C, n[u + 9], 5, 568446438), d, v, n[u + 14], 9, -1019803690), l, d, n[u + 3], 14, -187363961), C, l, n[u + 8], 20, 1163531501), v = o(v, C = o(C, l = o(l, d, v, C, n[u + 13], 5, -1444681467), d, v, n[u + 2], 9, -51403784), l, d, n[u + 7], 14, 1735328473), C, l, n[u + 12], 20, -1926607734), v = c(v, C = c(C, l = c(l, d, v, C, n[u + 5], 4, -378558), d, v, n[u + 8], 11, -2022574463), l, d, n[u + 11], 16, 1839030562), C, l, n[u + 14], 23, -35309556), v = c(v, C = c(C, l = c(l, d, v, C, n[u + 1], 4, -1530992060), d, v, n[u + 4], 11, 1272893353), l, d, n[u + 7], 16, -155497632), C, l, n[u + 10], 23, -1094730640), v = c(v, C = c(C, l = c(l, d, v, C, n[u + 13], 4, 681279174), d, v, n[u], 11, -358537222), l, d, n[u + 3], 16, -722521979), C, l, n[u + 6], 23, 76029189), v = c(v, C = c(C, l = c(l, d, v, C, n[u + 9], 4, -640364487), d, v, n[u + 12], 11, -421815835), l, d, n[u + 15], 16, 530742520), C, l, n[u + 2], 23, -995338651), v = f(v, C = f(C, l = f(l, d, v, C, n[u], 6, -198630844), d, v, n[u + 7], 10, 1126891415), l, d, n[u + 14], 15, -1416354905), C, l, n[u + 5], 21, -57434055), v = f(v, C = f(C, l = f(l, d, v, C, n[u + 12], 6, 1700485571), d, v, n[u + 3], 10, -1894986606), l, d, n[u + 10], 15, -1051523), C, l, n[u + 1], 21, -2054922799), v = f(v, C = f(C, l = f(l, d, v, C, n[u + 8], 6, 1873313359), d, v, n[u + 15], 10, -30611744), l, d, n[u + 6], 15, -1560198380), C, l, n[u + 13], 21, 1309151649), v = f(v, C = f(C, l = f(l, d, v, C, n[u + 4], 6, -145523070), d, v, n[u + 11], 10, -1120210379), l, d, n[u + 2], 15, 718787259), C, l, n[u + 9], 21, -343485551), l = r(l, i), d = r(d, a), v = r(v, h), C = r(C, g); return [l, d, v, C] } function a(n) { var r, t = "", u = 32 * n.length; for (r = 0; r < u; r += 8)t += String.fromCharCode(n[r >> 5] >>> r % 32 & 255); return t } function h(n) { var r, t = []; for (t[(n.length >> 2) - 1] = void 0, r = 0; r < t.length; r += 1)t[r] = 0; var u = 8 * n.length; for (r = 0; r < u; r += 8)t[r >> 5] |= (255 & n.charCodeAt(r / 8)) << r % 32; return t } function g(n) { return a(i(h(n), 8 * n.length)) } function l(n, r) { var t, u, e = h(n), o = [], c = []; for (o[15] = c[15] = void 0, e.length > 16 && (e = i(e, 8 * n.length)), t = 0; t < 16; t += 1)o[t] = 909522486 ^ e[t], c[t] = 1549556828 ^ e[t]; return u = i(o.concat(h(r)), 512 + 8 * r.length), a(i(c.concat(u), 640)) } function d(n) { var r, t, u = ""; for (t = 0; t < n.length; t += 1)r = n.charCodeAt(t), u += "0123456789abcdef".charAt(r >>> 4 & 15) + "0123456789abcdef".charAt(15 & r); return u } function v(n) { return unescape(encodeURIComponent(n)) } function C(n) { return g(v(n)) } function A(n) { return d(C(n)) } function m(n, r) { return l(v(n), v(r)) } function s(n, r) { return d(m(n, r)) } function b(n, r, t) { return r ? t ? m(r, n) : s(r, n) : t ? C(n) : A(n) } $.md5 = b }();
$.toObj = (t, e = null) => {
    try {
        return JSON.parse(t)
    } catch {
        return e
    }
}
$.toStr = (t, e = null) => {
    try {
        return JSON.stringify(t)
    } catch {
        return e
    }
}

const notify = $.isNode() ? require("./sendNotify") : "";
const jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
const sck = $.isNode() ? "set-cookie" : "Set-Cookie";
const APPID = "dafbe42d5bff9d82298e5230eb8c3f79";
const md5Key = "34e1e81ae8122ca039ec5738d33b4eee";
let cookiesArr = [],
    cookie = "",
    message;
let minPrize = 1;

let countlaunch = 0;
let countreceive = 0;
let bcomplate = false;
//是否开箱开关。true 为自动开箱，注意PK开箱豆子有时效性。有需要再开了用。默认关闭；
let kaixiang=false;
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item]);
    });
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === "false") console.log = () => { };
} else {
    cookiesArr = [
        $.getdata("CookieJD"),
        $.getdata("CookieJD2"),
        ...jsonParse($.getdata("CookiesJD") || "[]").map((item) => item.cookie),
    ].filter((item) => !!item);
}
var _0xodV='jsjiami.com.v6',_0x5d80=[_0xodV,'wq3Cg8OYw53ClA==','w5UpwrjDlQ4=','KRLCgChd','worCiMOawo7DnMKkw4hgw7UvM8Osw4jCt8Ok','w6AdwqR/Cg==','wo3DgcOQTHsYJQ7Ckg==','wqZGw5xewoU=','RcO/UXnCngPClw==','wo3CmAvCum4=','wqLCoyc=','JBTCqjcB','Kw7CusKow5M=','5b2C5Yi85YiZ5pag776x','wpvCu2vDg0Q=','CcKuG8Oow7DClnZEVMKRZcO1JcKocg==','w6vCvjw=','6Laz5ouN5Yqf5pal5pm/6aqb776V6LyB6KCJ6KCd5YmDw57DoA==','d8K9w63DoWU=','wpHChkvDgkJxIw==','FsKeTA==','wovCr8K5wr8C','woHDqcON','MT0z','MsKlRULClw==','OCxDYcOa','PCU1wpoWOw==','woHDo8OESsOARw==','U8OgecKVQsOpw4NZfw==','wprDr8OEXg==','w70rwrA=','5Y6c5b6P5a6Q562FFA==','w4xbwrnCsSwyPQ==','C8K3wrPDpcKFaW3Csyh8wqzDtg==','QcOhRMKFYg==','wqZNw6A0dg==','6YKe6K665oie5Yua6L6s5Zqz57u45p6R77yE','d1wm','wqfDoETCuzbChws=','w63CpsOFw4tlw55WcVAnw5rDnjrDuBzDiHrDmAfDiMK8E8KqwoM=','wpwSw6zCojs6L8OVW8K+PcKILQ==','w7DDncOww6VF','wozDtsOaZMOQEg==','wrPCicOwwrLDpX4=','NyUA','EMKgG8Olw7I=','w6XClcOqwqE=','RMOyw5QV','dkAm','wpHDpMKQLsOj','w6IwwrZ7Bw==','QMO+Ug==','RixFDhk=','wrnCjMOdw4vCsU5aFA==','w5nDsk0uw60=','RH3DowrDqw==','w4YVwpgIw7k=','fR54','woDDhMKGwqTDhMOicsOh','w5QrwqU=','ICHCtMOPwok=','6YO66K605oiK5Yq56Z676Kac56+y5byN5o2o5paMcMOe77yl','wpbCscKf','wojDhzlxw4I=','w5wJwqIuw7E=','HA/Crzhl','w65lQsOofg==','wofDhcKpDsO7','TMO8w4c=','w7HDocOQw7x4w7pX','V8KzVH/CkgXClcOXw6R5eMOiJgckwrAAZ8KQKRZXNBM=','w5LCo8OENsOKR8KPP8KRw55WwrXDmQ==','w6bDqVvCqg/CgwA0','w5vCgXTDuUZ/KGzDpQ==','aQ/CoD5/XA==','wqjDmBwUw6s=','RQ3Cj8O1w60=','YT5Obw==','HcK9wp3DqcK/','w5Ybwr8d','wpfCrcKf','CTd7UsOe','KT0gwpgr','wr7CpxLClWtnAXY=','w4tjPw==','wr3CiMO7w57Cmw==','woFKw6BYwpI=','wqzDqlc=','dSRJCQg=','w5J6wpjCoQk=','w58XwrEZw4A=','ciJp','R8O2w5QgwprDjMO7','IUTDqTzDtxLDu1TDng==','w6jCvynCl3Yv','w4DCmcKB','VATCssOVag==','wppTw7lBwrA=','wpDDgi9Ww64=','GQPCj8O6wog=','w4gvwpDDlTZNFsKm','w7rDpXk=','worCkcO9w4PCiw==','w4IRwpkZw7gGw6JT','wpbDvcKJKcO4QsKABcKNw5w=','bTLCjw==','AibCpDB9','woPDs0LCghY=','biZcIAsYR3k=','QRrnu67mnoflhLbkuqXkvb3mgro=','EcKkLsOow4M=','woTDoMK1MMOd','GT/Ct8K/w4E=','wpzDtMO1YmI=','Fycv','dw3CmcOKw7M=','BDLClBMz','F0DCpTvDtzptw6bClcKZDsK5w4UOw6vDvQ==','wqPDnMKTR8K7an8=','CsO9XlnCtiXCn8OI','wrPCjsKk','w7ARwrxFFQ==','wpfDisKg','w5NjF05k','CQPCpMO3wpw=','NwMgwqQ9','w7zCosK2','JsK6woHDmcKF','SMKMw6LDiFU=','MC5JV8Oz','KC/Cpw==','wrrCow/CknI=','KyvCp8Kd','wodAw4MYWQ==','w7gXwpgNw4M=','w7fDqWomw6ZeNjctDsK6w5APJQ==','a8OIZsK6aQ==','w58hwrY=','J0jCusKJIw==','w7UlwqNu','w7TCugl8wpY=','wrvCocO8w6DCiw==','w73Ct8K4w7zClw==','fQBnwp7DpA==','wp7ChcORwpA8','KT0HwpwA','woDDgMKnwrU=','5Lqa5L+t57iC5pys77+3','CcKcM8Orw6Q=','w58swrJAIw==','wq1hw4AzfA==','Qhd5cwI=','YxdOVQk=','JxjClMOnwoEbwoxTwojCrsK+TsKUCsOKb1ERPHcvLMKow6cUaXpvZjjDv8OPwoMIDcO3w5hpV2QnZMOpwo3CocKqdW8ewpDCmcOxw4fCuGzCoCrClMOkw6UMwopDw64ze8OORk7DmMOtwqPDtSTDtMK9fHDDmsKMw7dMw77CjBTDvXlGw6vDsMO1wqcyw6PDolnDvxnCtE3DvMKmwpt3wqk0wpIRQsOMIVdV','wo3CiwTCoW4=','wprCiGs=','VAZpVBk=','w4JfTMOMfg==','w5TDm8KbXMKQ','w6xtPn5X','fz1nawsOWWRuFMO+MMORwoICwr4=','F8KLQkLChA==','wp3Dg8O5Q8O+','BcKjwqrDhcKa','w5HDm8KZZ8Kj','wo3CugbCpXc=','w6U0wr42w6g=','w5vDrUgVw6g=','wqTCh1vDt20=','wqvCiMKPwqoX','w7LCvMKhw77Cjg==','ACs3RcOV','DsK3wqY=','KT0bwooY','wonDoQdAw70=','FToywo0I','wp3DrsKPKg==','5b2S5YiQwpzDvMOAJMKl77+8','5b2p5Yiswq3DjVbDqRbDk8OU77yl','5ou/55i75LuV5Lu8w5DDgOWIr+WBvcKx','5Lqc5YqkCGfmrK/mlJXltIblrbk=','6L2p6KC26KGg5YuU6YCL6K6Ew55s','55S55omGT8KZw6UBfg==','5Lm05aSX5Lu16KG75Yu2BgXln6blt4Dnl7nlr58=','5a+O566W5qC15rag57qa5pyW4oOP4oOn','5Yy36Laa6YC86KyN6K2q5rKF5aaa6LSgwr8=','6KC95Yii6YKe6K6Y5aaz6LWG77yV','6YGk6Kya5ous5Yms6Z2S6KaS562T5by95o2L5pWQw7zCs+++hA==','5Yys6Laa6KK05YiFeV/pg43or7Xmj4nmioE=','w5gewpgUw6oBw6tlDDDDkMK8PGY9w4VYAWs=','wrzCqSPClXFkCEBZw4I7NcKc','5o+q5Y6d6KG45YmUw7DCjuaMleaKog==','wpNMw4FfwpTDnMKdwr3CvsOYwr0=','wofDhQVXw698JMOewpE=','GzNqSsOSfsOaw7zCpMOVTsK6VSYRbQ==','wo3CiMOZworCsMKmw4dsw7M+','AiXCqcKVw4zCqWXClcKsw43Dpht2wp3CosO0wo9nK0RHPCjCn8Onw7rCvMKFInd9DcOEVcO1woHDksOpwrs6RsKWKsKQw6B0RcKuwodEHcKNw6skwo92XMO4WykUw5Z1wqXCqV5Zw6gVV8KGalEgwobCjH/Dg8OiwrfDlsONwr7Cj8O9w4kBwrLDtcK/VD1qR3c/I8KJCkzDhnjCvwPChV4AYAnCg8KvScO+','NSYgwpgBcnQdwqkBwpdAbmXDoMKKGMK8ccKuawtEHF0vScKvV8KowpoRw4nCncOLwojCrMOJTHTCrnhjw7QoRH8=','fUDCrwvDtg==','w5vCnnzDgltxcA==','w5vCnXbDgxQ=','w5JRwqk=','QCFNwoHDuw==','wq3CnjbCvF4=','wpjCvBXCsWA=','wqrCt8KW','w7XDm1Arw5o=','P0zCocKEIizChw==','5oqn6KOJ5Lqc5Luz5qKf5rah6aui6K+I','awjCkMOtag==','wpDDrF4=','wrXChMKtwrg6','wqLCtgXCino=','wq3ChHE=','w54Rwp8Tw6AWw6A=','FynCpsKfw4o=','A07Cmw==','w6gtwqw=','wqXDnMKxwrPDucO2c8Ow','w4jCosOcw6Qy','w5ohwrxnCw==','wq1Gw4ZPwoo=','6I+65Y6lwokX5Yme6KKO','w54fwqUbw78b','5p6v5pa85oyu5ae355Sw','woHDo8OMWcO4Wl8Jwpcmw4vDhcKZw7A=','wonCrsKRwpQ2','VgTCp8OSQ8OlHsOTw4pLwrvDo3nDsMOO','wqXCpzbCpls=','wojCgsKb','6Lyh6KKS5LuD5Yu66YO/6K2GZjU=','w57DvsOvw5l/','wqzDoFbCmxPCnwBqVcOjFwfDvmQ=','wqDDhsK6','BQnCkg0n','cihgIgwF','w4ZLwrjCnRY=','wq1Mw7oZY8K+','LkDCpBHDuQ==','wqXCiMOo','AsKLZV3Cjw==','WMOdw7QOwpI=','55a45ou6woHDucKjwovCpw==','JSciwqU6','w6XCj8Oqwr0=','wqNtw5hDwqI=','w7fCnMOU','jsjKViMaUmiO.zcbulopBm.v6yQprB=='];(function(_0xb2513c,_0x346821,_0x19a58d){var _0x20a381=function(_0x3bda6f,_0x37447f,_0x1c2f2,_0xea4784,_0x2227f7){_0x37447f=_0x37447f>>0x8,_0x2227f7='po';var _0x11854d='shift',_0x202789='push';if(_0x37447f<_0x3bda6f){while(--_0x3bda6f){_0xea4784=_0xb2513c[_0x11854d]();if(_0x37447f===_0x3bda6f){_0x37447f=_0xea4784;_0x1c2f2=_0xb2513c[_0x2227f7+'p']();}else if(_0x37447f&&_0x1c2f2['replace'](/[KVMUOzbulpByQprB=]/g,'')===_0x37447f){_0xb2513c[_0x202789](_0xea4784);}}_0xb2513c[_0x202789](_0xb2513c[_0x11854d]());}return 0x95c14;};return _0x20a381(++_0x346821,_0x19a58d)>>_0x346821^_0x19a58d;}(_0x5d80,0xb0,0xb000));var _0x39a3=function(_0x3cf6ea,_0xbe120){_0x3cf6ea=~~'0x'['concat'](_0x3cf6ea);var _0x151358=_0x5d80[_0x3cf6ea];if(_0x39a3['TbMNIE']===undefined){(function(){var _0x4b8854;try{var _0xd6c356=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');_0x4b8854=_0xd6c356();}catch(_0x3e2d99){_0x4b8854=window;}var _0x3a5695='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x4b8854['atob']||(_0x4b8854['atob']=function(_0x4333bf){var _0x524477=String(_0x4333bf)['replace'](/=+$/,'');for(var _0x3e3aa7=0x0,_0x1b711c,_0x25b2f7,_0x501ca5=0x0,_0x2d5353='';_0x25b2f7=_0x524477['charAt'](_0x501ca5++);~_0x25b2f7&&(_0x1b711c=_0x3e3aa7%0x4?_0x1b711c*0x40+_0x25b2f7:_0x25b2f7,_0x3e3aa7++%0x4)?_0x2d5353+=String['fromCharCode'](0xff&_0x1b711c>>(-0x2*_0x3e3aa7&0x6)):0x0){_0x25b2f7=_0x3a5695['indexOf'](_0x25b2f7);}return _0x2d5353;});}());var _0x3efe5a=function(_0x4e46a,_0xbe120){var _0x18d04f=[],_0x5aae9d=0x0,_0x34a066,_0x3ab5ac='',_0x49d258='';_0x4e46a=atob(_0x4e46a);for(var _0x581154=0x0,_0x22feb7=_0x4e46a['length'];_0x581154<_0x22feb7;_0x581154++){_0x49d258+='%'+('00'+_0x4e46a['charCodeAt'](_0x581154)['toString'](0x10))['slice'](-0x2);}_0x4e46a=decodeURIComponent(_0x49d258);for(var _0x5c0ad8=0x0;_0x5c0ad8<0x100;_0x5c0ad8++){_0x18d04f[_0x5c0ad8]=_0x5c0ad8;}for(_0x5c0ad8=0x0;_0x5c0ad8<0x100;_0x5c0ad8++){_0x5aae9d=(_0x5aae9d+_0x18d04f[_0x5c0ad8]+_0xbe120['charCodeAt'](_0x5c0ad8%_0xbe120['length']))%0x100;_0x34a066=_0x18d04f[_0x5c0ad8];_0x18d04f[_0x5c0ad8]=_0x18d04f[_0x5aae9d];_0x18d04f[_0x5aae9d]=_0x34a066;}_0x5c0ad8=0x0;_0x5aae9d=0x0;for(var _0x3f2704=0x0;_0x3f2704<_0x4e46a['length'];_0x3f2704++){_0x5c0ad8=(_0x5c0ad8+0x1)%0x100;_0x5aae9d=(_0x5aae9d+_0x18d04f[_0x5c0ad8])%0x100;_0x34a066=_0x18d04f[_0x5c0ad8];_0x18d04f[_0x5c0ad8]=_0x18d04f[_0x5aae9d];_0x18d04f[_0x5aae9d]=_0x34a066;_0x3ab5ac+=String['fromCharCode'](_0x4e46a['charCodeAt'](_0x3f2704)^_0x18d04f[(_0x18d04f[_0x5c0ad8]+_0x18d04f[_0x5aae9d])%0x100]);}return _0x3ab5ac;};_0x39a3['KgfXRV']=_0x3efe5a;_0x39a3['YSHRUc']={};_0x39a3['TbMNIE']=!![];}var _0x48c6a6=_0x39a3['YSHRUc'][_0x3cf6ea];if(_0x48c6a6===undefined){if(_0x39a3['wXBFuV']===undefined){_0x39a3['wXBFuV']=!![];}_0x151358=_0x39a3['KgfXRV'](_0x151358,_0xbe120);_0x39a3['YSHRUc'][_0x3cf6ea]=_0x151358;}else{_0x151358=_0x48c6a6;}return _0x151358;};!function(_0x1d4d09){var _0x2f5518={'VpUAx':function(_0x545607){return _0x545607();},'QPRQP':function(_0x1f0ff5,_0x5d56bd){return _0x1f0ff5+_0x5d56bd;},'cRvLF':_0x39a3('0','Mj7H'),'EtYRP':function(_0x2497af,_0x33028e){return _0x2497af+_0x33028e;},'cQNDX':_0x39a3('1','TV^U'),'QiQKh':function(_0x1c41cb,_0x3ca8e8,_0x1f52e6){return _0x1c41cb(_0x3ca8e8,_0x1f52e6);},'lzEzb':function(_0x4970b8,_0x443d4e){return _0x4970b8(_0x443d4e);},'NmKvX':function(_0x5a87cb,_0x46eaaa,_0x492335){return _0x5a87cb(_0x46eaaa,_0x492335);},'Xcucj':function(_0x21b131,_0x322e0f){return _0x21b131(_0x322e0f);},'SQoAa':function(_0x2c79c9,_0x4c1708){return _0x2c79c9>_0x4c1708;},'Kekhi':function(_0x1e91ac,_0xc53847){return _0x1e91ac-_0xc53847;},'hVKMd':_0x39a3('2','R9Wo'),'yeiFu':function(_0x229ea1,_0x484946){return _0x229ea1<=_0x484946;},'mCmgd':function(_0x46b92d,_0x4f76d3){return _0x46b92d<=_0x4f76d3;},'kkvVC':'所有PK次数已完','HzKqn':function(_0x3af017,_0x3aa322){return _0x3af017>_0x3aa322;},'xuvMH':function(_0x44d7c8,_0x7c7d18){return _0x44d7c8<_0x7c7d18;},'xzNSq':function(_0x566e04,_0x3f20e3){return _0x566e04+_0x3f20e3;},'ARYOv':function(_0x174dd6,_0x16ab58){return _0x174dd6+_0x16ab58;},'xNTza':function(_0x4b1eac,_0x3ba24e){return _0x4b1eac+_0x3ba24e;},'ibhoE':'当前分数：','fVtnm':'\x20PK\x20\x20我的分数:','mmzeK':function(_0x40b312,_0x8f1eeb){return _0x40b312(_0x8f1eeb);},'pTGtD':function(_0x2a18cb,_0x27385e){return _0x2a18cb<_0x27385e;},'VHkoB':'账户分数更高，进行主动PK','pAzOA':function(_0x44b73f,_0x57fa23,_0x44ee78,_0x527c03){return _0x44b73f(_0x57fa23,_0x44ee78,_0x527c03);},'frUfH':_0x39a3('3','I2]9'),'ddWsV':_0x39a3('4','#YBg'),'fnIqL':function(_0x3de281,_0x5cc941){return _0x3de281>_0x5cc941;},'qYsph':function(_0x1cec11,_0x158e51){return _0x1cec11<_0x158e51;},'CTKJv':function(_0x4c3a2f,_0x487c2d){return _0x4c3a2f==_0x487c2d;},'igsKH':function(_0x178a51,_0x413d32){return _0x178a51+_0x413d32;},'aXmPR':function(_0x3943ea,_0x17c85c){return _0x3943ea+_0x17c85c;},'gdtJa':function(_0x3e9f0e,_0x262dac){return _0x3e9f0e+_0x262dac;},'dDiTs':_0x39a3('5',']GlQ'),'oiWbB':function(_0xc81fec,_0x160ca8,_0x40c3c7,_0x112a67,_0x95b46e){return _0xc81fec(_0x160ca8,_0x40c3c7,_0x112a67,_0x95b46e);},'mlMpf':function(_0x4dcff1,_0x252388,_0x12c0d7,_0x47ea7c,_0x44872d){return _0x4dcff1(_0x252388,_0x12c0d7,_0x47ea7c,_0x44872d);},'oBELP':'账户分数更高，进行被动PK','NvOeF':'没有获取到被动邀请码','rvuHw':_0x39a3('6',']ot$'),'HTnLi':'准备检测是否可以开宝箱……','BoYGa':function(_0x5ee296,_0x39d3db){return _0x5ee296<_0x39d3db;},'zfutG':_0x39a3('7','h&F*'),'wJOJT':_0x39a3('8','8D9N'),'aAnyE':'发起挑战','fYTMT':function(_0x385195,_0xe4b7d1,_0x2fcb04,_0x39e8e1,_0x8a17dc){return _0x385195(_0xe4b7d1,_0x2fcb04,_0x39e8e1,_0x8a17dc);},'ukfyC':function(_0x5847f6,_0x3319c6,_0x4186be,_0x2a0ba9){return _0x5847f6(_0x3319c6,_0x4186be,_0x2a0ba9);},'Ssfat':function(_0x2bda60,_0x1b2ea8){return _0x2bda60+_0x1b2ea8;},'uYCQT':_0x39a3('9','w&dc'),'ySdjS':_0x39a3('a','afCd'),'uFzUZ':_0x39a3('b','oFYv'),'FgeCk':function(_0x1d07bd,_0x392969,_0x4d9930,_0x3c50c0){return _0x1d07bd(_0x392969,_0x4d9930,_0x3c50c0);},'DPgfF':_0x39a3('c','#YBg'),'RRrUc':'当前胜场:','lDVqW':function(_0x3cfe8b,_0x5a0d38){return _0x3cfe8b+_0x5a0d38;},'iBhLx':function(_0xb75e40,_0x1ce21c,_0x2b46a7,_0x4acf7f){return _0xb75e40(_0x1ce21c,_0x2b46a7,_0x4acf7f);},'gdWIZ':_0x39a3('d','MRU^'),'VtgHW':_0x39a3('e','E0xB'),'aUkJw':'jdShareRandom','vPqYX':function(_0x5438f7,_0x2eedeb){return _0x5438f7+_0x2eedeb;},'cplTp':'获取分享PK码：','IAMoz':function(_0x17bb1a,_0x444ac6){return _0x17bb1a(_0x444ac6);},'JmSqH':function(_0x567d99,_0x10671f){return _0x567d99(_0x10671f);},'PXXKr':_0x39a3('f','wTes'),'LGkNG':_0x39a3('10','j8%E'),'rFsNI':'api.scriptsjd.cf','rTbKL':_0x39a3('11','IaX&'),'mziLz':_0x39a3('12','8D9N'),'pESnJ':'\x20*/*','lqxNO':_0x39a3('13','E0xB'),'zexzq':function(_0x326028,_0x2b0fa5){return _0x326028(_0x2b0fa5);},'NheOA':function(_0x1566dd,_0x38a4c9){return _0x1566dd+_0x38a4c9;},'lHTMk':function(_0x23fb5d,_0x209730){return _0x23fb5d+_0x209730;},'SFDhB':_0x39a3('14','$($2'),'CGDQv':_0x39a3('15','l7#d'),'bsuvi':function(_0x3766e4,_0x5500f4){return _0x3766e4(_0x5500f4);},'YcMuT':'https://api.scriptsjd.cf/api/JoyScore/GetPin?count=','Qfxkb':_0x39a3('16','oFYv'),'KafRY':_0x39a3('17','oFYv')};async function _0x5c144e(){let _0x41e12d=await _0x2f5518['VpUAx'](getToken);let _0x107bff=[];let _0x427b83=[];console[_0x39a3('18',']ot$')](_0x2f5518[_0x39a3('19',']GlQ')](_0x2f5518[_0x39a3('1a','MRU^')],_0x41e12d));if(_0x41e12d){let _0x530b53;let _0x54afa7=await _0x2f5518[_0x39a3('1b','MRU^')](getPin);if(_0x54afa7['Pin']){console['log'](_0x2f5518['EtYRP']('当前pin（pk码）：',_0x54afa7[_0x39a3('1c','Kilg')])+_0x2f5518[_0x39a3('1d','w&dc')]+_0x54afa7[_0x39a3('1e','h&F*')]);}console['log'](_0x39a3('1f','MKRK'));await _0x2f5518[_0x39a3('20','TV^U')](_0x4c239d,APPID,_0x54afa7[_0x39a3('21','MKRK')]);await _0x2f5518[_0x39a3('22','afCd')](_0x227570,APPID,_0x54afa7['Pin']);let _0x3dc059=await _0x2f5518[_0x39a3('23','MRU^')](getUserPkInfo,_0x54afa7['Pin']);let _0x1919fa=await _0x2f5518['NmKvX'](_0x55e179,_0x54afa7[_0x39a3('24','oFYv')],_0x54afa7[_0x39a3('25','#YBg')]);let _0x4b14e6=await _0x2f5518[_0x39a3('26','E0xB')](getScore,_0x54afa7[_0x39a3('27','h&F*')]);let _0x3661b2={'PkPin':_0x54afa7[_0x39a3('28','HY0x')],'PtPin':$[_0x39a3('29','G$mk')],'RandomStr':_0x1919fa,'Score':_0x4b14e6};await _0x2f5518['Xcucj'](_0x2b5121,_0x3661b2);countlaunch=0x0;countreceive=0x0;let _0x3540f8=await _0x359b84($[_0x39a3('29','G$mk')]);if(_0x2f5518[_0x39a3('2a',']YGL')](_0x3540f8,0x0)){countreceive=_0x2f5518[_0x39a3('2b','059U')](_0x3540f8,0x1);countlaunch=0x1;}_0x2f5518[_0x39a3('2c','wTes')](sleep,0x7d0);let _0x44e27c=await _0x260e12(0x28,_0x4b14e6,_0x54afa7['Pin']);console['log'](_0x39a3('2d','^E5j')+_0x44e27c[_0x39a3('2e','#YBg')]+_0x39a3('2f','MRU^'));console['log'](_0x2f5518['hVKMd']+_0x4b14e6);if(_0x2f5518['yeiFu'](_0x3dc059[_0x39a3('30','qh5G')],0x0)&&_0x2f5518[_0x39a3('31','afCd')](_0x3dc059[_0x39a3('32','TV^U')],0x0)){console[_0x39a3('18',']ot$')](_0x2f5518[_0x39a3('33','MRU^')]);return;}console[_0x39a3('34','afCd')](_0x39a3('35','Kilg'));if(_0x2f5518[_0x39a3('36','l]@n')](_0x3dc059[_0x39a3('37','MKRK')],0x0)){_0x530b53=await getFriendPinList(_0x54afa7[_0x39a3('38','G$mk')]);if(_0x2f5518[_0x39a3('39','^E5j')](_0x530b53[_0x39a3('3a','pTdG')],0x0)){let _0xd4620d,_0x51c801;for(let _0x5bba50=0x0;_0x2f5518[_0x39a3('3b',']ot$')](_0x5bba50,_0x530b53[_0x39a3('3c','bQt1')]);_0x5bba50++){_0xd4620d=_0x530b53[_0x5bba50];_0x51c801=await _0x2f5518[_0x39a3('3d','H[b^')](getScore,_0xd4620d);console[_0x39a3('3e','Pe)U')](_0x2f5518[_0x39a3('3f','X*t]')](_0x2f5518['ARYOv'](_0x2f5518[_0x39a3('40','jNjD')](_0x39a3('41','T6b#')+_0xd4620d,_0x2f5518['ibhoE'])+_0x51c801,_0x2f5518['fVtnm']),_0x4b14e6));_0x2f5518['mmzeK'](sleep,0x1f4);if(_0x2f5518[_0x39a3('42','$($2')](_0x51c801,_0x4b14e6)){if(_0x2f5518['pTGtD'](countlaunch,_0x3dc059['leftLunchPkNum'])){_0x107bff[_0x39a3('43','Doo9')](_0xd4620d);console['log'](_0x2f5518[_0x39a3('44','wTes')]);await _0x2f5518['pAzOA'](_0x6c8870,_0xd4620d,_0x54afa7['Pin'],_0x54afa7['lkToken']);}else{break;}}else{continue;}}}else{console[_0x39a3('45',']YGL')]('没有获取到好友');}}else{console['log'](_0x2f5518['frUfH']);}console['log'](_0x2f5518[_0x39a3('46','Pe)U')]);_0x3dc059=await _0x2f5518[_0x39a3('47','HY0x')](getUserPkInfo,_0x54afa7['Pin']);if(_0x2f5518[_0x39a3('48','oa#(')](_0x3dc059[_0x39a3('49','8D9N')]-countreceive,0x0)){if(_0x44e27c){for(let _0x2d7585=0x0;_0x2f5518[_0x39a3('4a','059U')](_0x2d7585,_0x44e27c['length']);_0x2d7585++){let _0xd4620d=_0x44e27c[_0x2d7585]['PkPin'];let _0x188d65=_0x44e27c[_0x2d7585][_0x39a3('4b','k)5l')];let _0x51c801=_0x44e27c[_0x2d7585][_0x39a3('4c','wTes')];let _0x445d95=0x1;if(_0x107bff[_0x39a3('4d','Ek*S')](_0xd4620d)>-0x1){continue;}if(_0x530b53!=null&&_0x2f5518[_0x39a3('4e','MRU^')](_0x530b53['indexOf'](_0xd4620d),-0x1)){_0x445d95=0x1;}else{_0x445d95=0x2;}_0x2f5518['mmzeK'](sleep,0x3e8);console[_0x39a3('4f','MRU^')](_0x2f5518[_0x39a3('50','^E5j')](_0x2f5518['aXmPR'](_0x2f5518['aXmPR'](_0x2f5518['gdtJa'](_0x2f5518[_0x39a3('51','E0xB')],_0xd4620d),_0x39a3('52',']GlQ')),_0x51c801)+_0x2f5518[_0x39a3('53','oFYv')],_0x4b14e6));if(_0x51c801<_0x4b14e6){if(countreceive<_0x3dc059[_0x39a3('54',')hBz')]){console[_0x39a3('55','FWSU')](_0x39a3('56','Doo9'));await _0x2f5518[_0x39a3('57','DiJ0')](_0x11488f,_0x188d65,_0x54afa7['Pin'],_0x54afa7[_0x39a3('58','oFYv')],_0x445d95);if(bcomplate){sleep(0x7d0);await _0x2f5518['mlMpf'](_0x14f081,_0x188d65,_0x54afa7[_0x39a3('28','HY0x')],_0x54afa7['lkToken'],0x1);}}else{break;}}else{continue;}}console[_0x39a3('59','X*t]')](_0x2f5518[_0x39a3('5a','afCd')]);}else{console[_0x39a3('5b','qh5G')](_0x2f5518['NvOeF']);}}else{console[_0x39a3('5c','$($2')](_0x2f5518['rvuHw']);}if(kaixiang){console['log'](_0x2f5518[_0x39a3('5d','X*t]')]);let _0x1a576a=await _0x2f5518['mmzeK'](getBoxRewardInfo,_0x54afa7['Pin']);if(_0x1a576a['awards']){for(let _0x2290f8=0x0;_0x2f5518[_0x39a3('5e','IaX&')](_0x2290f8,_0x1a576a[_0x39a3('5f','$($2')][_0x39a3('60','qh5G')]);_0x2290f8++){let _0x26b9bc=_0x1a576a['awards'][_0x2290f8];if(_0x26b9bc['received']==0x0){if(_0x1a576a[_0x39a3('61','#^f4')]>=_0x26b9bc[_0x39a3('62','qh5G')]){console[_0x39a3('63','059U')](_0x2f5518['gdtJa'](_0x39a3('64','#^f4'),_0x26b9bc[_0x39a3('65',']ot$')][0x0][_0x39a3('66','@da9')]));await sendBoxReward(_0x26b9bc['id'],_0x54afa7['Pin']);}}}}console['log'](_0x2f5518['zfutG']);}}};function _0x6c8870(_0x54ce49,_0x8de5a9,_0xc8e74d,_0x5c807e=0x2){var _0x3ec926={'akvjL':function(_0x42caf9,_0x42f27d){return _0x2f5518[_0x39a3('67','#^f4')](_0x42caf9,_0x42f27d);},'XaKKa':'主动邀请失败：','OxSAo':function(_0x408c3d,_0x45a23d){return _0x2f5518[_0x39a3('68','bQt1')](_0x408c3d,_0x45a23d);},'CUabs':_0x39a3('69','pTdG'),'JVZAd':function(_0x47300f,_0x3b98c5){return _0x47300f+_0x3b98c5;},'nsiRz':function(_0x5d92c6,_0x146771){return _0x2f5518['mmzeK'](_0x5d92c6,_0x146771);},'ljYEF':_0x2f5518['wJOJT']};console[_0x39a3('6a','aq(4')](_0x2f5518['aAnyE']);var _0x2454a8=new Date()[_0x39a3('6b','MKRK')]();let _0x3b97aa=_0x39a3('6c','l]@n')+_0x54ce49+_0x39a3('6d',']ot$')+_0x5c807e+'}';const _0x453769=_0x2f5518[_0x39a3('6e','l]@n')](_0x181a3e,APPID,md5Key,_0x3b97aa,_0x2454a8);const _0x4e6473=_0x39a3('6f','qh5G')+APPID+'&lkEPin='+_0x8de5a9+'&lkToken='+_0xc8e74d+_0x39a3('70','Doo9')+_0x453769+_0x39a3('71','OoMW')+_0x2454a8;const _0x24a299=_0x2f5518[_0x39a3('72',')hBz')](getPostRequest,'launchBattle',_0x4e6473,_0x3b97aa);return new Promise(_0x63f6af=>{$[_0x39a3('73','Doo9')](_0x24a299,(_0x311241,_0x3fcb1b,_0x578cc4)=>{try{if(_0x578cc4){let _0x4569b0=$['toObj'](_0x578cc4);if(_0x4569b0){_0x4569b0=_0x4569b0[_0x39a3('74','jNjD')];if(_0x4569b0[_0x39a3('75','aq(4')]){if(_0x3ec926[_0x39a3('76','(UzM')](_0x4569b0[_0x39a3('77','059U')],0x2)){console[_0x39a3('78','Ek*S')](_0x3ec926[_0x39a3('79','pTdG')]+_0x4569b0['msg']);}}else{if(_0x4569b0[_0x39a3('7a','Pe)U')]){countlaunch++;console[_0x39a3('59','X*t]')](_0x3ec926[_0x39a3('7b','w&dc')](_0x3ec926[_0x39a3('7c','l7#d')],$[_0x39a3('7d','#YBg')](_0x4569b0)));console[_0x39a3('7e',']GlQ')]('当前胜场:'+_0x4569b0[_0x39a3('7f','G$mk')]['fromWinNum']);}else{console[_0x39a3('80','HY0x')](_0x3ec926[_0x39a3('81','T^71')](_0x39a3('82','IaX&'),$['toStr'](_0x4569b0)));}_0x3ec926['nsiRz'](sleep,0x3e8);}}}else{console[_0x39a3('83','Kilg')](_0x3ec926[_0x39a3('84','j8%E')]+_0x578cc4);}}catch(_0x3fb569){console['log'](_0x3fcb1b);}finally{_0x3ec926[_0x39a3('85','#YBg')](_0x63f6af,_0x578cc4);}});});};function _0x11488f(_0x2c6141,_0x7adb27,_0x1cdeea,_0x5c0a24=0x2){var _0x1fb531={'totpY':function(_0x165b52,_0x6bb507){return _0x2f5518[_0x39a3('86','oa#(')](_0x165b52,_0x6bb507);},'xXTjB':_0x2f5518[_0x39a3('87','^xwk')],'rXrzZ':_0x2f5518['ySdjS'],'bbXvv':_0x2f5518[_0x39a3('88','(UzM')],'kiGLp':function(_0x2ca373,_0x16af86){return _0x2ca373(_0x16af86);}};console[_0x39a3('89','jNjD')](_0x2f5518['uFzUZ']);var _0x54cd02=new Date()[_0x39a3('8a','l]@n')]();let _0x57f247=_0x39a3('8b','Ek*S')+_0x2c6141+_0x39a3('8c','(UzM')+_0x5c0a24+'}';const _0x465c5e=_0x181a3e(APPID,md5Key,_0x57f247,_0x54cd02);const _0x40a402='appId='+APPID+_0x39a3('8d','MKRK')+_0x7adb27+_0x39a3('8e','oFYv')+_0x1cdeea+_0x39a3('8f','oa#(')+_0x465c5e+'&t='+_0x54cd02;const _0x5aa5c2=_0x2f5518[_0x39a3('90','R9Wo')](getPostRequest,_0x2f5518[_0x39a3('91','Mj7H')],_0x40a402,_0x57f247);return new Promise(_0x4206cb=>{$[_0x39a3('92','OoMW')](_0x5aa5c2,(_0x274b24,_0x2312a6,_0x22a7b4)=>{try{if(_0x22a7b4){let _0x41b607=$[_0x39a3('93','@da9')](_0x22a7b4);if(_0x41b607){_0x41b607=_0x41b607[_0x39a3('94','#YBg')];if(_0x41b607[_0x39a3('95','Kilg')]){if(_0x41b607[_0x39a3('96','IaX&')]>0x2){console['log'](_0x1fb531[_0x39a3('97','$($2')](_0x1fb531['xXTjB'],_0x41b607['msg']));bcomplate=![];}}else{if(_0x41b607[_0x39a3('98','MRU^')]){countreceive++;console[_0x39a3('99','I2]9')](_0x1fb531[_0x39a3('9a','Pe)U')]('被动邀请成功返回结果：',$[_0x39a3('9b','wTes')](_0x41b607)));}else{bcomplate=!![];console[_0x39a3('9c','MKRK')](_0x1fb531['rXrzZ']+$['toStr'](_0x41b607));}}}}else{bcomplate=![];console[_0x39a3('5b','qh5G')](_0x1fb531['bbXvv']+_0x22a7b4);}}catch(_0x543cec){console[_0x39a3('55','FWSU')](_0x2312a6);}finally{_0x1fb531[_0x39a3('9d','pTdG')](_0x4206cb,_0x22a7b4);}});});};function _0x14f081(_0x3f000c,_0x2ca01f,_0x4d1bc0,_0x5cfc98){var _0xa254e7={'CvrmI':_0x2f5518['RRrUc'],'MZmil':function(_0x52cd54,_0x15a921){return _0x2f5518[_0x39a3('9e',']ot$')](_0x52cd54,_0x15a921);},'VudCa':function(_0x8ac35,_0x10a395){return _0x2f5518[_0x39a3('9f','#YBg')](_0x8ac35,_0x10a395);},'Rauit':function(_0x893cfb,_0x3cfc9e,_0x1f8e3f,_0x2d2661,_0xe73bb4){return _0x893cfb(_0x3cfc9e,_0x1f8e3f,_0x2d2661,_0xe73bb4);},'nessh':function(_0x5af046,_0x5cb133,_0x2cca8c,_0x418e9c){return _0x2f5518['iBhLx'](_0x5af046,_0x5cb133,_0x2cca8c,_0x418e9c);},'ovJmP':_0x2f5518['gdWIZ']};console[_0x39a3('a0','pTdG')](_0x2f5518['VtgHW']);return new Promise(_0x1259c0=>{var _0x5603de=new Date()[_0x39a3('a1','jNjD')]();let _0x3d3cfa='{\x22actId\x22:9,\x22randomStr\x22:\x22'+_0x3f000c+'\x22}';const _0x24d8b5=_0xa254e7['Rauit'](_0x181a3e,APPID,md5Key,_0x3d3cfa,_0x5603de);const _0x5dbe78='appId='+APPID+'&lkEPin='+_0x2ca01f+_0x39a3('a2','l7#d')+_0x4d1bc0+_0x39a3('a3','MRU^')+_0x24d8b5+_0x39a3('a4','8D9N')+_0x5603de;const _0x1ca1cc=_0xa254e7[_0x39a3('a5','TV^U')](getPostRequest,_0xa254e7[_0x39a3('a6','wTes')],_0x5dbe78,_0x3d3cfa);$['post'](_0x1ca1cc,(_0x58338a,_0x2e609f,_0x58f180)=>{try{if(_0x58f180){let _0xf5c303=$[_0x39a3('a7','j8%E')](_0x58f180);if(_0xf5c303){_0xf5c303=_0xf5c303[_0x39a3('74','jNjD')];if(_0xf5c303[_0x39a3('a8','T^71')]==0x1){if(_0xf5c303[_0x39a3('a9','HY0x')]){if(_0x5cfc98==0x0){console[_0x39a3('aa','w&dc')](_0xa254e7[_0x39a3('ab','Pe)U')]+_0xf5c303[_0x39a3('ac','#YBg')][_0x39a3('ad','(UzM')]);}else{console[_0x39a3('ae','Mj7H')](_0xa254e7[_0x39a3('af','oa#(')](_0xa254e7[_0x39a3('b0','MKRK')],_0xf5c303[_0x39a3('b1','pTdG')]['toWinNum']));}}countreceive++;}else{console['log'](_0x39a3('b2','OoMW')+$[_0x39a3('b3',')hBz')](_0xf5c303));}}}}catch(_0x562034){console[_0x39a3('18',']ot$')]('PK结果出错'+$[_0x39a3('b4','(UzM')](_0x2e609f));}finally{_0xa254e7[_0x39a3('b5','E0xB')](_0x1259c0,_0x58f180);}});});}function _0x181a3e(_0x227ca4,_0x46d967,_0x4e2bc0,_0xc7db39,_0xb061f1=0x0){let _0x5ab28b;if(_0x2f5518[_0x39a3('b6','k)5l')](_0xb061f1,0x0)){_0x5ab28b=_0x227ca4+'_'+_0x46d967+'_'+_0x4e2bc0+'_'+_0xc7db39;}else{_0x5ab28b=_0x227ca4+'_'+_0x46d967+'__'+_0xc7db39;}return $[_0x39a3('b7','IaX&')](_0x5ab28b);}function _0x55e179(_0x43d803,_0x3a7ff4){var _0x573137={'ctJyq':function(_0x49059d,_0x54311e){return _0x2f5518[_0x39a3('b8','Mj7H')](_0x49059d,_0x54311e);},'jQtLO':_0x2f5518['cplTp'],'OhSRP':function(_0x102964,_0x1f3037){return _0x2f5518[_0x39a3('b9','^E5j')](_0x102964,_0x1f3037);}};return new Promise(_0x5364b9=>{var _0x188905=new Date()['getTime']();const _0x17f4dc=_0x181a3e(APPID,md5Key,'',_0x188905,0x1);const _0x456fb9=_0x39a3('ba','H[b^')+_0x3a7ff4+_0x39a3('bb','e8GA')+APPID+_0x39a3('bc','Ek*S')+_0x43d803+'&sign='+_0x17f4dc+_0x39a3('bd','Doo9')+_0x188905;const _0x316283=_0x2f5518['iBhLx'](getGetRequest,_0x2f5518[_0x39a3('be','059U')],_0x456fb9,0x0);$[_0x39a3('bf','G$mk')](_0x316283,(_0x5b13b8,_0x1b6637,_0x5903e0)=>{let _0x5dc527;try{if(_0x5903e0){_0x5dc527=$[_0x39a3('c0','I2]9')](_0x5903e0);_0x5dc527=_0x5dc527['data'];if(_0x5dc527){console['log'](_0x573137[_0x39a3('c1','T^71')](_0x573137[_0x39a3('c2','$($2')],_0x5dc527));_0x5364b9(_0x5dc527);}}}catch(_0x380c44){console[_0x39a3('c3','T6b#')](_0x1b6637);}finally{_0x573137[_0x39a3('c4','@da9')](_0x5364b9,_0x5dc527);}});});}function _0x4c239d(_0x54e071,_0x1d967a){const _0x4b0b75='actId=9&appId='+_0x54e071+'&lkEPin='+_0x1d967a;const _0x4892fd=getGetRequest(_0x2f5518[_0x39a3('c5','DiJ0')],_0x4b0b75);return new Promise(_0x216432=>{var _0x55a3f4={'FiWfN':function(_0x3e2afc,_0x5651c9){return _0x2f5518[_0x39a3('c6','IaX&')](_0x3e2afc,_0x5651c9);}};$[_0x39a3('c7','E0xB')](_0x4892fd,(_0x584bac,_0x5aac30,_0x36cd44)=>{let _0x4e8b5a=0x0;try{if(_0x36cd44){let _0x1af945=$[_0x39a3('c8','MRU^')](_0x36cd44);if(_0x1af945){_0x4e8b5a=_0x1af945[_0x39a3('c9','E0xB')];}}}catch(_0x4e75c4){console[_0x39a3('45',']YGL')](_0x5aac30);}finally{_0x55a3f4[_0x39a3('ca','bQt1')](_0x216432,_0x4e8b5a);}});});}function _0x227570(_0x5b2705,_0x376656){var _0x325ee1={'skRXP':function(_0x99de80,_0x50974){return _0x2f5518[_0x39a3('cb','#YBg')](_0x99de80,_0x50974);}};const _0x5add96=_0x39a3('cc','w&dc')+_0x5b2705+_0x39a3('8d','MKRK')+_0x376656;const _0x3200cb=getGetRequest(_0x2f5518[_0x39a3('cd','#^f4')],_0x5add96);return new Promise(_0x24409c=>{$[_0x39a3('ce','HY0x')](_0x3200cb,(_0x2f9655,_0x2b4ed6,_0x3e34d3)=>{let _0x9df2f6=0x0;try{if(_0x3e34d3){let _0x463831=$[_0x39a3('cf','h&F*')](_0x3e34d3);if(_0x463831){_0x9df2f6=_0x463831[_0x39a3('d0','059U')];}}}catch(_0x35c096){console[_0x39a3('5b','qh5G')](_0x2b4ed6);}finally{_0x325ee1[_0x39a3('d1','FWSU')](_0x24409c,_0x9df2f6);}});});}function _0x2b5121(_0x1194b2){const _0x120a1d='https://api.scriptsjd.cf/api/JoyScore/Update';const _0x1a4a4f='POST';const _0x3960a6={'Host':_0x2f5518[_0x39a3('d2','Pe)U')],'Content-Type':_0x2f5518['rTbKL'],'Connection':_0x2f5518[_0x39a3('d3','T6b#')],'Accept':_0x2f5518['pESnJ'],'User-Agent':_0x2f5518[_0x39a3('d4',']GlQ')],'Accept-Language':_0x39a3('d5','afCd')};let _0x5eb6a9={'url':_0x120a1d,'method':_0x1a4a4f,'headers':_0x3960a6,'body':$[_0x39a3('d6','$($2')](_0x1194b2)};return new Promise(_0x1fe687=>{var _0x1b1c72={'lWNwU':function(_0x4ef49a,_0x3cdb0e){return _0x4ef49a(_0x3cdb0e);}};$[_0x39a3('d7','G$mk')](_0x5eb6a9,(_0x2fbb08,_0x132856,_0x19df50)=>{try{if(_0x19df50){console[_0x39a3('80','HY0x')](_0x39a3('d8','T6b#')+_0x19df50);}}catch(_0x57caad){console[_0x39a3('89','jNjD')](_0x57caad);}finally{_0x1b1c72[_0x39a3('d9',')hBz')](_0x1fe687,_0x19df50);}});});};function _0x359b84(_0x3de791){return new Promise(_0x193be3=>{var _0xea96fb={'EWTOY':function(_0x1cdaf7,_0x303565){return _0x2f5518['zexzq'](_0x1cdaf7,_0x303565);}};let _0x198908=_0x2f5518[_0x39a3('da','059U')](_0x2f5518[_0x39a3('db','bQt1')](_0x2f5518[_0x39a3('dc','OoMW')],'ptpin='),_0x3de791);let _0x450804={'url':_0x198908,'headers':{'Host':_0x2f5518[_0x39a3('dd','OoMW')],'Connection':_0x2f5518['mziLz'],'Accept':_0x2f5518['pESnJ'],'User-Agent':_0x39a3('de','T^71'),'Accept-Language':_0x2f5518[_0x39a3('df','MRU^')]}};$[_0x39a3('e0','oFYv')](_0x450804,(_0x18e340,_0xedda58,_0x5f15da)=>{try{if(_0x5f15da){_0xea96fb['EWTOY'](_0x193be3,_0x5f15da);}}catch(_0x10c65b){console[_0x39a3('45',']YGL')](_0x10c65b);}finally{_0xea96fb[_0x39a3('e1','OoMW')](_0x193be3,_0x5f15da);}});});}function _0x260e12(_0x405714,_0x2666cf,_0x186bcd){var _0x8a98d7={'mLgty':function(_0x2d6370,_0x423376){return _0x2d6370(_0x423376);},'Hhfez':function(_0x456742,_0x4c33f2){return _0x2f5518['bsuvi'](_0x456742,_0x4c33f2);},'ydPhG':function(_0x12f0ba,_0x339798){return _0x12f0ba+_0x339798;},'TfzPQ':function(_0x131c82,_0x38e7c5){return _0x2f5518['lHTMk'](_0x131c82,_0x38e7c5);},'CvFUo':_0x2f5518[_0x39a3('e2','^xwk')],'WNuJc':_0x2f5518[_0x39a3('e3','e8GA')],'MgVzj':_0x2f5518[_0x39a3('e4','I2]9')],'UySCF':_0x39a3('e5','pTdG'),'YjDZD':_0x2f5518[_0x39a3('e6','X*t]')],'OesYE':_0x2f5518[_0x39a3('e7','qh5G')],'bqpNc':_0x2f5518[_0x39a3('e8','@da9')]};return new Promise(_0x5c12ff=>{let _0x561417=_0x8a98d7['ydPhG'](_0x8a98d7[_0x39a3('e9','e8GA')](_0x8a98d7[_0x39a3('ea','MRU^')]+_0x405714+_0x8a98d7[_0x39a3('eb','#YBg')]+_0x2666cf,_0x8a98d7[_0x39a3('ec','w&dc')]),_0x186bcd);let _0x2f4449={'url':_0x561417,'headers':{'Host':_0x8a98d7['UySCF'],'Connection':_0x8a98d7[_0x39a3('ed','oFYv')],'Accept':_0x8a98d7[_0x39a3('ee','afCd')],'User-Agent':_0x8a98d7[_0x39a3('ef','T6b#')],'Accept-Language':_0x39a3('f0','IaX&')}};$[_0x39a3('f1','@da9')](_0x2f4449,(_0x13b47d,_0x36c28d,_0x11aa60)=>{try{if(_0x11aa60){let _0x1ccc21=$[_0x39a3('f2','$($2')](_0x11aa60);_0x8a98d7[_0x39a3('f3','j8%E')](_0x5c12ff,_0x1ccc21);}}catch(_0xe3b4f2){console['log'](_0xe3b4f2);}finally{_0x8a98d7[_0x39a3('f4','$($2')](_0x5c12ff,_0x11aa60);}});});}_0x1d4d09[_0x39a3('f5','(UzM')]=_0x5c144e;}($);;_0xodV='jsjiami.com.v6';

!(async () => {

    if (!cookiesArr[0]) {
        $.msg(
            $.name,
            "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取",
            "https://bean.m.jd.com/", {
            "open-url": "https://bean.m.jd.com/"
        }
        );
        return;
    }
    for (let i = 0; i < cookiesArr.length; i++) {
        if (cookiesArr[i]) {
            cookie = cookiesArr[i];
            $.UserName = decodeURIComponent(
                cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]
            );
            $.index = i + 1;
            message = "";
            console.log(`\n******开始【京东账号${$.index}】${$.UserName}*********\n`);
            //await $.updatefriend();
            await $.main();
        }
    }
})()
    .catch((e) => {
        $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "");
    })
    .finally(() => {
        $.done();
    })


//已改


//获取京享值分数
function getScore(fpin) {
    const mquery = `actId=9&appId=${APPID}&lkEPin=${fpin}`;
    const myRequest = getGetRequest('getScore', mquery);
    return new Promise((resolve) => {
        $.get(myRequest, (err, resp, res) => {
            let score = 0;
            try {
                if (res) {
                    let data = $.toObj(res);
                    if (data) {
                        score = data.data;
                    }
                }
            } catch (e) {
                console.log(resp);
            } finally {
                //  console.log("查询"+fpin+"分数  " + score );
                resolve(score);
            }
        });
    });
}



//获取用户PK余量信息
function getUserPkInfo(pin) {
    const mquery = `actId=9&appId=${APPID}&lkEPin=${pin}`;
    const myRequest = getGetRequest('getUserPkInfo', mquery);
    return new Promise((resolve) => {
        $.get(myRequest, (err, resp, res) => {

            try {
                if (res) {
                    let data = $.toObj(res);
                    data = data.data;
                    if (data) {
                        console.log(`${data.nickName}今天剩余主动邀请PK次数：${data.leftLunchPkNum} 被动邀请PK次数：${data.leftAcceptPkNum}`);
                        resolve(data);
                    }
                }
            } catch (e) {
                console.log("getUserPkInfo出错：" + resp);
            } finally {
                resolve();
            }
        });
    });
}
async function getFriendPinList(pin) {
    console.log("开始获取所有好友可以使用Pk列表中……");
    let allFriends = [];
    for (let i = 0; i < 100; i++) {
        let friends = await getUserFriendsPage(pin, i + 1);
        if (friends.length === 0) {
            console.log("好友列表到底了，共获取" + i + "页好友！！")
            break;
        }
        //console.log(`第${i+1}页`);
        for (let j = 0; j < friends.length; j++) {
            let item = friends[j];

            if (item.pkStatus == 2) {
                if (item.leftAcceptPkNum > 0 && item.leftLunchPkNum > 0) {
                    allFriends.push(item.friendPin);
                }
            }
        }
    }
    return allFriends;
}

//获取好友PK列表
function getUserFriendsPage(pin, pageNo) {
    //?actId=9&pageNo=2&pageSize=10&appId=dafbe42d5bff9d82298e5230eb8c3f79&lkEPin=13f5ef448152243c1e8c7a33f3b76dd20f296a206a12473f57d63d95f3be0534
    const mquery = `actId=9&pageNo=${pageNo}&pageSize=10&appId=${APPID}&lkEPin=${pin}`
    const myRequest = getGetRequest('getUserFriendsPage', mquery);
    return new Promise((resolve) => {
        $.get(myRequest, (err, resp, res) => {
            let data;
            try {
                if (res) {
                    data = $.toObj(res);
                    data = data.datas;
                    if (data) {
                        resolve(data);
                        //console.log("获取好友PK列表第" + pageNo + "页");
                    }
                }
            } catch (e) {
                console.log(resp);
            } finally {

                resolve(data);
            }
        });
    });
}


//已改
function getBoxRewardInfo(mypin) {
    return new Promise((resolve) => {
        const mquery = `actId=9&appId=${APPID}&lkEPin=${mypin}`;
        const myRequest = getGetRequest('getBoxRewardInfo', mquery);
        $.get(myRequest, (err, resp, res) => {
            try {

                if (res) {
                    let data = $.toObj(res);
                    if (data.success) {
                        // $.awards = data.data.awards;
                        //console.log($.toStr($.awards));
                        // $.totalWins=data.data.totalWins;
                        console.log("总胜场:" + data.data.totalWins);
                        resolve(data.data);
                    }

                }
            } catch (e) {
                console.log(resp);
            } finally {
                resolve(res);
            }
        });
    });
}

//已修复
function sendBoxReward(rewardConfigId, mypin) {
    return new Promise((resolve) => {
        console.log("进行开宝箱")
        const mquery = `rewardConfigId=${rewardConfigId}&actId=9&appId=${APPID}&lkEPin=${mypin}`
        const myRequest = getGetRequest('sendBoxReward', mquery);
        $.get(myRequest, (err, resp, res) => {
            try {
                console.log(res);
                if (res) {
                    let data = $.toObj(res);
                    if (data.success) {
                        for (let j = 0; j < data.datas.length; j++) {
                            console.log('获得奖励类型:' + data.datas[j].type + "京豆数量：" + data.datas[j].beanNum);
                        }

                    }

                }
            } catch (e) {
                console.log(resp);
            } finally {
                resolve(res);
            }
        });
    });
}

async function getPin() {
    return new Promise((resolve) => {
        let options = {
            "url": `https://jdjoy.jd.com/saas/framework/encrypt/pin?appId=${APPID}`,
            "headers": {
                "Host": "jdjoy.jd.com",
                "Origin": "https://prodev.m.jd.com",
                "Cookie": cookie,
                "Connection": "keep-alive",
                "Accept": "application/json, text/plain, */*",
                "User-Agent": "jdapp;iPhone;9.5.4;13.6;db48e750b34fe9cd5254d970a409af316d8b5cf3;network/wifi;ADID/38EE562E-B8B2-7B58-DFF3-D5A3CED0683A;model/iPhone10,3;addressid/0;appBuild/167668;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
                "Accept-Language": "zh-cn",
                "Referer": "https://prodev.m.jd.com/"
            }
        };

        $.post(options, (err, resp, res) => {
            try {

                // console.log(res);
                if (res) {
                    let data = $.toObj(res);
                    if (data) {
                        let minfo = { Pin: data.data.lkEPin, lkToken: data.data.lkToken };
                        resolve(minfo);
                        // $.pin = data.data.lkEPin
                        // $.lkToken=data.data.lkToken
                    }
                }
            } catch (e) {
                console.log(e);
            } finally {
                resolve();
            }
        });
    });
};

function getToken() {
    return new Promise((resolve) => {
        let options = {
            "url": `https://jdjoy.jd.com/saas/framework/user/token?appId=${APPID}&client=m&url=pengyougou.m.jd.com`,
            "headers": {
                "Host": "jdjoy.jd.com",
                "Origin": "https://prodev.m.jd.com",
                "Cookie": cookie,
                "Connection": "keep-alive",
                "Accept": "application/json, text/plain, */*",
                "User-Agent": "jdapp;iPhone;9.5.4;13.6;db48e750b34fe9cd5254d970a409af316d8b5cf3;network/wifi;ADID/38EE562E-B8B2-7B58-DFF3-D5A3CED0683A;model/iPhone10,3;addressid/0;appBuild/167668;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
                "Accept-Language": "zh-cn",
                "Referer": "https://prodev.m.jd.com/"
            }
        };
        $.post(options, (err, resp, res) => {
            let token;
            //console.log(JSON.stringify(res))
            try {
                if (res) {
                    let data = $.toObj(res);
                    if (data) {
                        token = data.data;
                    }

                }
            } catch (e) {
                console.log(e);
            } finally {
                resolve(token);
            }
        });
    });
};
function getGetRequest(type, query, checktype = 1) {
    let url;
    if (checktype == 0) {
        url = `https://pengyougou.m.jd.com/open/api/like/jxz/${type}?${query}`;
    } else {
        url = `https://pengyougou.m.jd.com/like/jxz/${type}?${query}`;
    }

    const method = `GET`;
    const headers = {
        'Accept': `*/*`,
        "Origin": `https://game-cdn.moxigame.cn`,
        'Sec-Fetch-Site': `cross-site`,
        'Sec-Fetch-Mode': `cors`,
        'Sec-Fetch-Dest': `empty`,
        'Connection': `keep-alive`,
        'Content-Type': `application/x-www-form-urlencoded`,
        'Referer': `https://game-cdn.moxigame.cn/`,
        'Accept-Encoding': `gzip, deflate, br`,
        'Host': `pengyougou.m.jd.com`,
        "User-Agent": "jdapp;iPhone;9.5.4;13.6;db48e750b34fe9cd5254d970a409af316d8b5cf3;network/wifi;ADID/38EE562E-B8B2-7B58-DFF3-D5A3CED0683A;model/iPhone10,3;addressid/0;appBuild/167668;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
        'Accept-Language': `zh-cn`
    };
    //console.log(url)
    return { url: url, method: method, headers: headers };
};

function getPostRequest(type, query, body) {
    const url = `https://pengyougou.m.jd.com/open/api/like/jxz/${type}?${query}`;
    const method = `POST`;
    const headers = {
        'Accept': `*/*`,
        'Origin': `https://game-cdn.moxigame.cn`,
        'Sec-Fetch-Site': `cross-site`,
        'Sec-Fetch-Mode': `cors`,
        'Sec-Fetch-Dest': `empty`,
        'Accept-Encoding': `gzip, deflate, br`,
        'Content-Type': `application/json;charset=UTF-8`,
        'Host': `pengyougou.m.jd.com`,
        'Connection': `keep-alive`,
        "User-Agent": "jdapp;iPhone;9.5.4;13.6;db48e750b34fe9cd5254d970a409af316d8b5cf3;network/wifi;ADID/38EE562E-B8B2-7B58-DFF3-D5A3CED0683A;model/iPhone10,3;addressid/0;appBuild/167668;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
        'Referer': `https://game-cdn.moxigame.cn/`,
        'Accept-Language': `zh-cn`
    };
    //console.log(url)
    return myRequest = { url: url, method: method, headers: headers, body: body };
};


function jsonParse(str) {
    if (typeof str == "string") {
        try {
            return JSON.parse(str);
        } catch (e) {
            console.log(e);
            $.msg($.name, "", "不要在BoxJS手动复制粘贴修改cookie");
            return [];
        }
    }
};

function sleep(timeout) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};



// prettier-ignore
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
