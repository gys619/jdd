/*
入口：23.0复制整段话 http:/JZUpL5s2BpdFdT 美妆好礼，示爱七夕，快来和我一起收情书抽乐园门票！#yDrnMBbu7a%买买买，→亰咚
入口：美妆馆- 右边- 抽取免费门票
acttime 8.4-8.15瓜分京豆
[task_local]
#柠檬七夕情报局
0 1,12,17 * * * jd_qixi.js, tag=柠檬七夕情报局, img-url=http://nm66.top/1.jpg, enabled=true
*/ 

const $ = new Env('柠檬七夕情报局');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';

//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;

 if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
const JD_API_HOST = 'https://api.m.jd.com/client.action';

!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
$.temp = [];
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
      
      $.log("如发现账号过多 运行失败报错 隔断时间再运行")
      await $.wait(2000)
       await isvObfuscator()
      
       await getinfo()
       await chat()

       for (let i = 15; i < 34; i++) {   
       await dotask("follow_shop",i)
           
       }
for (let i = 13; i < 27; i++) {   
       await dotask("add_product",i)
           
       }
for (let i = 12; i < 23; i++) {   
       await dotask("meeting_view",i)
         
       }
$.log("开卡默认不开")
       await $.wait(1000)
       await isvObfuscator()
      
       await getinfo()
    }
  }
    for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
    
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      if ((cookiesArr && cookiesArr.length >= 1)) {
        console.log(`\n账号内部相互邀请助力\n`);
        for (let item of $.temp) {
          console.log(`\n${$.UserName} 去参助力 ${item}`);
          const helpRes = await inviteteam("map_team_invite?inviter_id=",item,'');
          const helpRes1 = await inviteteam("invite?inviter_id=",item,"&from_type=1");


        }
      }
    }
    }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })


function isvObfuscator() {
    return new Promise(async (resolve) => {

                let options = {
    url: `https://api.m.jd.com/client.action?functionId=isvObfuscator`,
    body:"area=17_1458_1463_43894&body=%7B%22url%22%3A%22https%3A%5C/%5C/xinrui1-isv.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&build=167764&client=apple&clientVersion=10.0.10&d_brand=apple&d_model=iPhone9%2C2&eid=eidIe2798122d1s4GEix/uspRjy92JqJ273YghhIs3JZdi/4JjftGCWZOLgY3glC5gGXsTY1vGLRKckMeHq2opKqTBNLiayOHJtx2EhExIqlbarZpTFa&isBackground=N&joycious=35&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=6898c30638c55142969304c8e2167997fa59eb53&osVersion=14.3&partner=apple&rfs=0000&scope=01&screen=1242%2A2208&sign=d498ae62e38c880b43fc19e2804315b3&st=1628571194379&sv=110&uemps=0-0&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJp50CWXKpVTRAM5ixaZVeR4UC5ZkNHju%2Br/F8d4PikLsOYPSDFme89DXOmtwRkFe8HqqCrlQw4SgcxD6PNrngAHJ1QxbLssRnSG%2B8sIjnikCNQ2RKJXoDx1Jlf/rzJWwC6MLb9nJVtDBXDDW7j23vsoRek2ljMg0Tz%2B2wWsKFAM0IvZEhKAJfnA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=774de7601b5cddf9aad1ae30f3a3dfc0",

headers: {

"Host": "api.m.jd.com",

"User-Agent": "Mozilla/5.0 (Linux; Android 8.0.0; SM-N9500 Build/R16NW; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/63.0.3239.83 Mobile Safari/537.36 T7/10.13 baiduboxapp/10.13.0.11 (Baidu; P1 8.0.0)",
      "Cookie": cookie,
      }
                }
      
        $.post(options, async (err, resp, data) => {
            try {

                    const reust = JSON.parse(data)
if(reust.code==0){
  tk = reust.token  
  //$.log(tk)
   await info()
}else if(reust.code !=0){
    $.log("黑号"+data)
}
                    
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}



function info() {
    return new Promise(async (resolve) => {

                let options = {
    url: `https://xinrui1-isv.isvjcloud.com/sapi/jd-user-info`,
    body: `{"token":"${tk}","source":"01"}`,

headers: {
"Host": "xinrui1-isv.isvjcloud.com",

"Origin": "https://xinrui1-isv.isvjcloud.com",

"User-Agent": "Mozilla/5.0 (Linux; Android 8.1.0; PACM00 Build/O11019; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/63.0.3239.83 Mobile Safari/537.36 T7/10.13 baiduboxapp/10.13.0.11 (Baidu; P1 8.1.0)",
"Sec-Fetch-Mode": "cors",
"Content-Type":" application/json;charset=UTF-8",
"X-Requested-With": "com.jingdong.app.mall",
"Sec-Fetch-Site": "same-origin",


      }
                }
      
        $.post(options, async (err, resp, data) => {
            //console.log(`${JSON.stringify(options)}`)
            //$.log(data)
            try {

                    const reust = JSON.parse(data)
if(reust.access_token){
  accesstk = reust.access_token 
  //$.log(accesstk)
}else {
    $.log("accesstoken获取失败")
}
                    
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

function getinfo() {
    return new Promise(async (resolve) => {

                let options = {
    url: `https://xinrui1-isv.isvjcloud.com/sapi/get_user_info`,
   //body:`{"token":"${tk}","source":"01"}`,

headers: {

"Host": "xinrui1-isv.isvjcloud.com",

"Origin": "https://xinrui1-isv.isvjcloud.com",

"User-Agent": "Mozilla/5.0 (Linux; Android 8.0.0; SM-N9500 Build/R16NW; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/63.0.3239.83 Mobile Safari/537.36 T7/10.13 baiduboxapp/10.13.0.11 (Baidu; P1 8.0.0)",
"Sec-Fetch-Mode": "cors",
"Content-Type":" application/json;charset=UTF-8",
"X-Requested-With": "com.jingdong.app.mall",
"Sec-Fetch-Site": "same-origin",
      "Authorization": `bearer ${accesstk}`,
      }
                }
      
        $.get(options, async (err, resp, data) => {
           // $.log(data)
            try {

                    data = JSON.parse(data)
                    if(data.nickname){
                    $.log(`亲爱的叼毛：${data.nickname}\n剩余情书：${data.coins}\n邀请码：${data.id}`)
                    $.temp.push(data.id);
                    cj = data.coins/10
                    cj = cj.toFixed(1)
if(cj > 1){
 for (let i = 0; i < cj; i++) {   
    await upgrade()}
}}else {$.log("数据获取失败")}
                    
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

//add_product
//add_product
//meeting_view
function dotask(type,id) {
    return new Promise(async (resolve) => {

                let options = {
    url: `https://xinrui1-isv.isvjcloud.com/sapi/${type}?id=${id}`,
    body:``,

headers: {

"Host": "xinrui1-isv.isvjcloud.com",

"Origin": "https://xinrui1-isv.isvjcloud.com",

"User-Agent": "Mozilla/5.0 (Linux; Android 8.0.0; SM-N9500 Build/R16NW; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/63.0.3239.83 Mobile Safari/537.36 T7/10.13 baiduboxapp/10.13.0.11 (Baidu; P1 8.0.0)",
"Sec-Fetch-Mode": "cors",
"Content-Type":" application/json;charset=UTF-8",
"X-Requested-With": "com.jingdong.app.mall",
"Sec-Fetch-Site": "same-origin",
     "Authorization": `bearer ${accesstk}`,
      }
                }
      
        $.post(options, async (err, resp, data) => {
            try {
data = JSON.parse(data)
if(data.coins){
 $.log(data.coins)   
}else {
 $.log(data.message)   
}

                    
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}


function chat() {
    return new Promise(async (resolve) => {

                let options = {
    url: `https://xinrui1-isv.isvjcloud.com/sapi/chat`,
    body:``,

headers: {

"Host": "xinrui1-isv.isvjcloud.com",
"Content-Type": "application/json;charset=utf-8",
"Accept": "application/json, text/plain, */*",
"Authorization": "bearer undefined",
"Origin": "https://xinrui1-isv.isvjcloud.com",

"User-Agent": "Mozilla/5.0 (Linux; Android 8.0.0; SM-N9500 Build/R16NW; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/63.0.3239.83 Mobile Safari/537.36 T7/10.13 baiduboxapp/10.13.0.11 (Baidu; P1 8.0.0)",
    "Authorization": `bearer ${accesstk}`,
      }
                }
      
        $.post(options, async (err, resp, data) => {
            try {
data = JSON.parse(data)
if(data.content){
$.log(data.content+" 情书："+data.coins)
}else {$.log(data.message)}
                    
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

function upgrade() {
    return new Promise(async (resolve) => {

                let options = {
    url: `https://xinrui1-isv.isvjcloud.com/sapi/user_level_upgrade`,
    body:``,

headers: {

"Host": "xinrui1-isv.isvjcloud.com",

"Origin": "https://xinrui1-isv.isvjcloud.com",

"User-Agent": "Mozilla/5.0 (Linux; Android 8.0.0; SM-N9500 Build/R16NW; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/63.0.3239.83 Mobile Safari/537.36 T7/10.13 baiduboxapp/10.13.0.11 (Baidu; P1 8.0.0)",
"Sec-Fetch-Mode": "cors",
"Content-Type":" application/json;charset=UTF-8",
"X-Requested-With": "com.jingdong.app.mall",
"Sec-Fetch-Site": "same-origin",
     "Authorization": `bearer ${accesstk}`,
      }
                }
      
        $.post(options, async (err, resp, data) => {
            //$.log(data)
            try {

data = JSON.parse(data)
if(data['letter_info']){
$.log(data['letter_info']['content']+" \n"+data['letter_info']['peroration'])
    
}else {$.log(data.message)}
                    
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

function inviteteam(invitetype,code,from_type) {
    return new Promise(async (resolve) => {
//invite?inviter_id=   //&from_type=1
//map_team_invite?inviter_id=
                let options = {
    url: `https://xinrui1-isv.isvjcloud.com/sapi/${invitetype}${code}${from_type}`,
    //url: `https://xinrui1-isv.isvjcloud.com/sapi/map_team_invite?inviter_id=${code}`,
    body:``,

headers: {

"Host": "xinrui1-isv.isvjcloud.com",

"Origin": "https://xinrui1-isv.isvjcloud.com",

"User-Agent": "Mozilla/5.0 (Linux; Android 8.0.0; SM-N9500 Build/R16NW; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/63.0.3239.83 Mobile Safari/537.36 T7/10.13 baiduboxapp/10.13.0.11 (Baidu; P1 8.0.0)",
"Sec-Fetch-Mode": "cors",
"Content-Type":" application/json;charset=UTF-8",
"X-Requested-With": "com.jingdong.app.mall",
"Sec-Fetch-Site": "same-origin",
     "Authorization": `bearer ${accesstk}`,
      }
                }
      
        $.post(options, async (err, resp, data) => {
            try {
data = JSON.parse(data)
$.log(data.message)
                    
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}


async function taskPostUrl(functionId,body) {
  return {
    url: `${JD_API_HOST}`,
    body: `functionId=${functionId}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=1.0.0&appid=content_ecology&uuid=6898c30638c55142969304c8e2167997fa59eb54&t=1622588448365`,
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Accept-Language': 'zh-cn',
      'Accept-Encoding': 'gzip, deflate, br',
    }
  }
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
async function safeGet(data) {
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
// prettier-ignore

function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
