/*
tgchannel：https://t.me/Ariszy8028
github：https://github.com/Ariszy/Private-Script
boxjs：https://raw.githubusercontent.com/Ariszy/Private-Script/master/Ariszy.boxjs.json
[task_local]
#东东玩家
20 0 * * * https://raw.githubusercontent.com/Ariszy/Private-Script/master/JD/zy_ddwj.js, tag= 东东玩家
================Loon==============
[Script]
cron "20 0 * * *" script-path= https://raw.githubusercontent.com/Ariszy/Private-Script/master/JD/zy_ddwj.js,tag= 东东玩家
===============Surge=================
东东玩家 = type=cron,cronexp="20 0 * * *",wake-system=1,timeout=3600,script-path= https://raw.githubusercontent.com/Ariszy/Private-Script/master/JD/zy_ddwj.js
============小火箭=========
东东玩家 = type=cron,script-path= https://raw.githubusercontent.com/Ariszy/Private-Script/master/JD/zy_ddwj.js, cronexpr="20 0 * * *", timeout=3600, enable=true
*/
const $ = new Env('东东玩家')
const notify = $.isNode() ?require('./sendNotify') : '';
cookiesArr = []
CodeArr = []
cookie = ''
var list2tokenArr = [],list4tokenArr = [],list6tokenArr = [],list5tokenArr = [],list4tokenArr = [],list3tokenArr = [],list1tokenArr = [],list2tokenArr = [],listtokenArr = [],list0tokenArr = [],list1tokenArr = []
var taskid,token,helpcode,secretp,userUnlockedPlaceNum;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
let tz = ($.getval('tz') || '1');//0关闭通知，1默认开启
const invite=1;//新用户自动邀请，0关闭，1默认开启
const logs =0;//0为关闭日志，1为开启
var hour=''
var minute=''
if ($.isNode()) {
   hour = new Date( new Date().getTime() + 8 * 60 * 60 * 1000 ).getHours();
   minute = new Date( new Date().getTime() + 8 * 60 * 60 * 1000 ).getMinutes();
}else{
   hour = (new Date()).getHours();
   minute = (new Date()).getMinutes();
}
//CK运行
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
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i =0; i < cookiesArr.length; i++) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      message = ''
      $.isLogin = true;
      $.index = i + 1;
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
       await gethelpcode()
       await getlist()
       await getsecretp()
       await getfeedtoken()
       await Ariszy()
       await zy()
       //await userScore()
   }
for(let i = 0; i < cookiesArr.length; i++){
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      message = ''
      $.isLogin = true;
      $.index = i + 1;
       console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}助力模块*********\n`);
      await getsecretp()
      await control()
      await userScore()
}

})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())
    

function PostRequest(uri,body) {
  const url = `https://api.m.jd.com/client.action?${uri}`;
  const method = `POST`;
  const headers = {"Accept": "application/json",
"Accept-Encoding": "gzip, deflate, br",
"Accept-Language": "zh-cn",
"Connection": "keep-alive",
"Content-Type": "application/x-www-form-urlencoded",
"Origin": "https://h5.m.jd.com",
"Cookie": cookie,
"Host": "api.m.jd.com",
"User-Agent": "jdapp;iPhone;10.0.6;14.4;0bcbcdb2a68f16cf9c9ad7c9b944fd141646a849;network/4g;model/iPhone12,1;addressid/2377723269;appBuild/167724;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"
}
  return {url: url, method: method, headers: headers, body: body};
}

async function doTask(){
 const body = `functionId=funny_collectScore&body=%7B%22taskId%22%3A${taskid}%2C%22taskToken%22%3A%22${token}%22%2C%22ss%22%3A%22%7B%5C%22extraData%5C%22%3A%7B%5C%22log%5C%22%3A%5C%22%5C%22%2C%5C%22sceneid%5C%22%3A%5C%22HWJhPageh5%5C%22%7D%2C%5C%22secretp%5C%22%3A%5C%22${secretp}%5C%22%2C%5C%22random%5C%22%3A%5C%2243136926%5C%22%7D%22%2C%22actionType%22%3A1%7D&client=wh5&clientVersion=1.0.0&uuid=0bcbcdb2a68f16cf9c9ad7c9b944fd141646a849&appid=o2_act`
 const MyRequest = PostRequest(`advId=funny_collectScore`,body)
//$.log(JSON.stringify(MyRequest))
 return new Promise((resolve) => {
   $.post(MyRequest,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 0){
           console.log("\n"+result.data.bizMsg+"\n")
   await $.wait(8000)
        }else{
           $.log(result.msg+"\n")
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }
async function DoTask(){
 const body = `functionId=funny_collectScore&body=%7B%22taskId%22%3A${taskid}%2C%22taskToken%22%3A%22${token}%22%2C%22ss%22%3A%22%7B%5C%22extraData%5C%22%3A%7B%5C%22log%5C%22%3A%5C%22%5C%22%2C%5C%22sceneid%5C%22%3A%5C%22HWJhPageh5%5C%22%7D%2C%5C%22secretp%5C%22%3A%5C%22${secretp}%5C%22%2C%5C%22random%5C%22%3A%5C%2243136926%5C%22%7D%22%2C%22actionType%22%3A0%7D&client=wh5&clientVersion=1.0.0&uuid=0bcbcdb2a68f16cf9c9ad7c9b944fd141646a849&appid=o2_act`
 const MyRequest = PostRequest(`advId=funny_collectScore`,body)
 return new Promise((resolve) => {
   $.post(MyRequest,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.data.bizCode == 0){
           console.log(result.data.result.successToast+"\n")
   await $.wait(4000) 
        }else{
           console.log(result.data.bizMsg+"\n")
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }
async function unlock(){
 const body = `functionId=funny_raise&body=%7B%22id%22%3A${userUnlockedPlaceNum}%2C%22ss%22%3A%22%7B%5C%22extraData%5C%22%3A%7B%5C%22log%5C%22%3A%5C%22%5C%22%2C%5C%22sceneid%5C%22%3A%5C%22HWJhPageh5%5C%22%7D%2C%5C%22secretp%5C%22%3A%5C%22${secretp}%5C%22%2C%5C%22random%5C%22%3A%5C%2276834380%5C%22%7D%22%7D&client=wh5&clientVersion=1.0.0&uuid=0bcbcdb2a68f16cf9c9ad7c9b944fd141646a849&appid=o2_act`
//$.log(secretp)
 const MyRequest = PostRequest(`advId=funny_raise`,body)
 return new Promise((resolve) => {
   $.post(MyRequest,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.data.bizCode == 0){
           console.log("\n获得"+result.data.result.levelUpAward.pieceRedpacket.value+result.data.result.levelUpAward.pieceRedpacket.name+"\n")
   await $.wait(4000)
        }else{
           $.log("解锁失败，好玩币不足"+result.data.bizMsg+"\n")
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }
async function getsecretp(){
 const body = `functionId=funny_getHomeData&body=%7B%22isNeedPop%22%3A%221%22%2C%22currentEarth%22%3A3%7D&client=wh5&clientVersion=1.0.0&appid=o2_act`
 const MyRequest = PostRequest(`advId=funny_getHomeData`,body)
 return new Promise((resolve) => {
   $.post(MyRequest,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        secretp = result.data.result.homeMainInfo.secretp
        userUnlockedPlaceNum = result.data.result.homeMainInfo.raiseInfo.userEarthInfo.userUnlockedPlaceNum
        //$.log(userUnlockedPlaceNum)
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }
async function Ariszy(){
  for(let j = 0; j < listtokenArr.length; j++){
    token = list2tokenArr[j]
    taskid = listtokenArr[j].match(/\d+/)
    $.log("TaskId："+taskid)
    $.log("Token："+token)
    if(taskid == 2 ||taskid == 4 || taskid == 8 || taskid ==14){
    await doTask()
    await DoTask()
   }else{
    await doTask()
}
  }
    
}
async function scans(){
  for(let j = 0; j < list0tokenArr.length; j++){
    token = list1tokenArr[j];
    taskid = list0tokenArr[j].match(/\d+/)
    $.log("TaskId："+taskid)
    $.log("Token："+token)
    await doTask()
    await DoTask()
}
}
async function zy(){
   listtokenArr.splice(0,listtokenArr.length);
   list2tokenArr.splice(0,list2tokenArr.length);
   //list0tokenArr.splice(0,list0tokenArr.length);
   //list1tokenArr.splice(0,list1tokenArr.length);
}
async function Zy(){
   for(let i = 0; i < 7; i ++){
       await scan()
       await scans()
            list0tokenArr.splice(0,list0tokenArr.length);
   list1tokenArr.splice(0,list1tokenArr.length);
      }
}
async function control(){
     for(let i = 0; i < list1tokenArr.distinct().length; i++){
   helpcode = list1tokenArr[i]
   await dosupport()
   await $.wait(4000)
}
}
async function dosupport(){
   const body = `functionId=funny_collectScore&body=%7B%22ss%22%3A%22%7B%5C%22extraData%5C%22%3A%7B%5C%22log%5C%22%3A%5C%22%5C%22%2C%5C%22sceneid%5C%22%3A%5C%22HWJhPageh5%5C%22%7D%2C%5C%22secretp%5C%22%3A%5C%22${secretp}%5C%22%2C%5C%22random%5C%22%3A%5C%2269009870%5C%22%7D%22%2C%22inviteId%22%3A%22${helpcode}%22%2C%22isCommonDealError%22%3Atrue%7D&client=wh5&clientVersion=1.0.0&uuid=0bcbcdb2a68f16cf9c9ad7c9b944fd141646a849&appid=o2_act`
 const MyRequest = PostRequest(`advId=funny_collectScore`,body)
 return new Promise((resolve) => {
   $.post(MyRequest,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.data.bizCode == 0){
           console.log(result.data.bizMsg+"获得"+result.data.result.score+"好玩豆\n")
   await $.wait(4000)
        }else{
           console.log(result.data.bizMsg+"\n")
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }
async function getlist(){
 const MyRequest = PostRequest(`?advId=funny_getTaskDetail`,`functionId=funny_getTaskDetail&body=%7B%22taskId%22%3A%22%22%2C%22appSign%22%3A%221%22%7D&client=wh5&clientVersion=1.0.0&uuid=0bcbcdb2a68f16cf9c9ad7c9b944fd141646a849&appid=o2_act`)
 return new Promise((resolve) => {
    $.post(MyRequest,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 0){
       console.log("查看任务列表\n")
       
       
       
       let list2 = result.data.result.taskVos.find(item => item.taskId == 2)
       let maxTimes2 = list2.maxTimes
       for(let i = 0; i < maxTimes2; i ++){
       listtokenArr.push(2+list2.shoppingActivityVos[i].taskToken)
list2tokenArr.push(list2.shoppingActivityVos[i].taskToken)

       }
       
       let list3 = result.data.result.taskVos.find(item => item.taskId == 3)
       let maxTimes3 = list3.maxTimes
       for(let i = 0; i < maxTimes3; i ++){
       listtokenArr.push(3+list3.shoppingActivityVos[i].taskToken)
list2tokenArr.push(list3.shoppingActivityVos[i].taskToken)
       }
       
       let list4 = result.data.result.taskVos.find(item => item.taskId == 4)
       let maxTimes4 = list4.maxTimes
       for(let i = 0; i < maxTimes4; i ++){
       listtokenArr.push(4+list4.browseShopVo[i].taskToken)
list2tokenArr.push(list4.browseShopVo[i].taskToken)
//$.log(list4.productInfoVos[i].taskToken)
       }
    
       let list6 = result.data.result.taskVos.find(item => item.taskId == 6)
       let maxTimes6 = list6.maxTimes
       for(let i = 0; i < maxTimes6; i ++){listtokenArr.push(6+list6.brandMemberVos[i].taskToken)
list2tokenArr.push(list6.brandMemberVos[i].taskToken)
//$.log(list5.followShopVo[i].taskToken)
       }
       
       let list7 = result.data.result.taskVos.find(item => item.taskId == 7)
       let maxTimes7 = list7.maxTimes
       for(let i = 0; i < maxTimes7; i ++){listtokenArr.push(7+list7.shoppingActivityVos[i].taskToken)
list2tokenArr.push(list7.shoppingActivityVos[i].taskToken)
//$.log(list5.followShopVo[i].taskToken)
       }
       let list8 = result.data.result.taskVos.find(item => item.taskId == 8)
       let maxTimes8 = list8.maxTimes
       for(let i = 0; i < maxTimes8; i ++){listtokenArr.push(8+list8.shoppingActivityVos[i].taskToken)
list2tokenArr.push(list8.shoppingActivityVos[i].taskToken)
//$.log(list5.followShopVo[i].taskToken)
       }
       //$.log(JSON.stringify(listtokenArr))
      let list13 = result.data.result.taskVos.find(item => item.taskId == 13)
       let maxTimes13 = list13.maxTimes
       for(let i = 0; i < maxTimes13; i ++){listtokenArr.push(13+list13.followShopVo[i].taskToken)
list2tokenArr.push(list13.followShopVo[i].taskToken)
//$.log(list5.followShopVo[i].taskToken)
       }
       let list14 = result.data.result.taskVos.find(item => item.taskId == 14)
       let maxTimes14 = list14.maxTimes
       for(let i = 0; i < maxTimes14; i ++){listtokenArr.push(14+list14.shoppingActivityVos[i].taskToken)
list2tokenArr.push(list14.shoppingActivityVos[i].taskToken)
//$.log(list5.followShopVo[i].taskToken)
       }
       let list15 = result.data.result.taskVos.find(item => item.taskId == 15)
       let maxTimes15 = list15.maxTimes
       for(let i = 0; i < maxTimes15; i ++){listtokenArr.push(15+list15.shoppingActivityVos[i].taskToken)
list2tokenArr.push(list15.shoppingActivityVos[i].taskToken)
//$.log(list5.followShopVo[i].taskToken)
       }
       let list16 = result.data.result.taskVos.find(item => item.taskId == 16)
       let maxTimes16 = list16.maxTimes
       for(let i = 0; i < maxTimes16; i ++){listtokenArr.push(16+list16.shoppingActivityVos[i].taskToken)
list2tokenArr.push(list16.shoppingActivityVos[i].taskToken)
//$.log(list5.followShopVo[i].taskToken)
       }
       }else{
           $.log(result.data.bizMsg+"\n")
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }
async function scan(){
 const MyRequest = PostRequest(``,`functionId=healthyDay_getHomeData&body=%7B%22appId%22:%221ElBTx6o%22,%22taskToken%22:%22%22,%22channelId%22:1%7D&client=wh5&clientVersion=1.0.0`)
 return new Promise((resolve) => {
    $.post(MyRequest,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 0){

let list6 = result.data.result.taskVos.find(item => item.taskId == 6)
       for(let i = 0; i < list4.productInfoVos.length; i ++){
list0tokenArr.push(6+list6.productInfoVos[i].taskToken)
list1tokenArr.push(list4.productInfoVos[i].taskToken)
}
        
        }else{
           $.log(result.data.bizMsg+"\n")
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }
async function getfeedtoken(){
for(let i = 9; i < 13;i++){
  await getfeedlist(i)
}
}
async function getfeedlist(Taskid){
 const Body = `functionId=funny_getFeedDetail&body=%7B%22taskId%22%3A%22${Taskid}%22%7D&client=wh5&clientVersion=1.0.0&appid=o2_act`
 const MyRequest = PostRequest(`?advId=funny_getFeedDetail`,Body)
 return new Promise((resolve) => {
    $.post(MyRequest,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.data.bizCode == 0){
let lists = result.data.result.addProductVos.find(item => item.taskId == Taskid)
       let maxTimes = lists.maxTimes
       for(let i = 0; i < maxTimes; i++){
listtokenArr.push(Taskid+lists.productInfoVos[i].taskToken)
list2tokenArr.push(lists.productInfoVos[i].taskToken)
//$.log(JSON.stringify((list2tokenArr)))
       }
        //await zy()
        }else{
           $.log(result.data.bizMsg+"\n")
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }
async function gethelpcode(){
 const MyRequest = PostRequest(`?advId=funny_getTaskDetail`,`functionId=funny_getTaskDetail&body=%7B%22taskId%22%3A%22%22%2C%22appSign%22%3A%221%22%7D&client=wh5&clientVersion=1.0.0&uuid=0bcbcdb2a68f16cf9c9ad7c9b944fd141646a849&appid=o2_act`)
 return new Promise((resolve) => {
    $.post(MyRequest,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 0){

let list5 = result.data.result.taskVos.find(item => item.taskId == 5)
       list0tokenArr.push(5+list5.assistTaskDetailVo.taskToken)
list1tokenArr.push(list5.assistTaskDetailVo.taskToken)
//$.log(list5.assistTaskDetailVo.taskToken)
       
        
        }else{
           $.log(result.data.bizMsg+"\n")
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }

async function userScore(){
 const body = `functionId=funny_getHomeData&body=%7B%22isNeedPop%22%3A%221%22%2C%22currentEarth%22%3A3%7D&client=wh5&clientVersion=1.0.0&appid=o2_act`
 const MyRequest = PostRequest(`advId=funny_getHomeData`,body)
 return new Promise((resolve) => {
    $.post(MyRequest,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 0){
        let userScore = result.data.result.homeMainInfo.raiseInfo.remainScore
        let turn = Math.floor(userScore / (result.data.result.homeMainInfo.raiseInfo.nextLevelScore - result.data.result.homeMainInfo.raiseInfo.curLevelStartScore))
        if(turn > 0){
        $.log("共有好玩币："+userScore+";开始解锁🔓"+turn+"次\n")
        for(let i = 0; i < turn; i++){
        await unlock()
        }
}else
        $.log("好玩币不够,不解锁\n")
        }else{
           $.log(result.data.bizMsg+"\n")
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }
//showmsg
//boxjs设置tz=1，在12点<=20和23点>=40时间段通知，其余时间打印日志

async function showmsg() {
    if (tz == 1) {
      if ($.isNode()) {
        if ((hour == 12 && minute <= 20) || (hour == 23 && minute >= 40)) {
          await notify.sendNotify($.name, message)
        } else {
          $.log(message)
        }
      } else {
        if ((hour == 12 && minute <= 20) || (hour == 23 && minute >= 40)) {
          $.msg(zhiyi, '', message)
        } else {
          $.log(message)
        }
      }
    } else {
      $.log(message)
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
}
Array.prototype.distinct = function (){
 var arr = this,
  result = [],
  len = arr.length;
 arr.forEach(function(v, i ,arr){  //这里利用map，filter方法也可以实现
  var bool = arr.indexOf(v,i+1);  //从传入参数的下一个索引值开始寻找是否存在重复
  if(bool === -1){
   result.push(v);
  }
 })
 return result;
};
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
