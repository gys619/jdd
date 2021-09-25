/**
 * 京喜牧场-新手任务（开木板）
 * 代码核心来源于hw，喝水不忘挖井人，再次感谢hw
 * 
 */

import axios from 'axios';
import {requireConfig, TotalBean, getBeanShareCode, getFarmShareCode, wait, requestAlgo, decrypt, getJxToken} from './TS_USER_AGENTS';
//import {Md5} from "ts-md5";
import {accessSync} from "fs";

const notify = require('./sendNotify')

let A: any = require('./utils/jd_jxmcToken')
let cookie: string = '', res: any = '', shareCodes: string[] = [], homePageInfo: any, activeid: string = '', jxToken: any, UserName: string, index: number;


!(async () => {
  await requestAlgo();
  let cookiesArr: any = await requireConfig();


  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    index = i + 1;
    let {isLogin, nickName}: any = await TotalBean(cookie)
    if (!isLogin) {
      notify.sendNotify(__filename.split('/').pop(), `cookie已失效\n京东账号${index}:${nickName || UserName}`)
      continue
    }
    console.log(`\n开始【京东账号${index}】${nickName || UserName}\n`);

    jxToken = getJxToken(cookie)
    homePageInfo = await api('queryservice/GetHomePageInfo', 'activeid,activekey,channel,isgift,isquerypicksite,sceneid', {isgift: 0, isquerypicksite: 0})
    activeid = homePageInfo.data.activeid
    let lastgettime: number
    if (homePageInfo.data?.cow?.lastgettime) {
      lastgettime = homePageInfo.data.cow.lastgettime
       } else {
     // continue
     lastgettime=0
        }

    let food: number = 0
    try {
      food = homePageInfo.data.materialinfo[0].value;
    } catch (e) {
      console.log('jxmc未开通？黑号？')
      continue
    }
    let petid: number = homePageInfo.data.petinfo[0].petid;
    let coins = homePageInfo.data.coins;

    console.log('助力码:', homePageInfo.data.sharekey);
    console.log('现有草:', food);
    console.log('金币:', coins);
    console.log('此CK开通Jxmc获得验证')

    // 新手任务1
    res = await api1('operservice/DoMainTask', 'activeid,activekey,channel,step,jxmc_jstoken,phoneid,sceneid,timestamp')
    //if (res.ret === 0)
    console.log('开板第一式。。。。效果不知道，需要事后进入jxmc查看')

    // 新手任务2
    res = await api2('operservice/DoMainTask', 'activeid,activekey,channel,step,jxmc_jstoken,phoneid,sceneid,timestamp')
    //if (res.ret === 0)
    console.log('开板第二式。。。效果不知道，需要事后进入jxmc查看')

    // 新手任务3
    res = await api3('operservice/DoMainTask', 'activeid,activekey,channel,step,jxmc_jstoken,phoneid,sceneid,timestamp')
    //if (res.ret === 0)
    console.log('开板第三式。。。效果不知道，需要事后进入jxmc查看')

    // 签到
    res = await api('queryservice/GetSignInfo', 'activeid,activekey,channel,sceneid')
    if (res.data.signlist) {
      for (let day of res.data.signlist) {
        if (day.fortoday && !day.hasdone) {
          res = await api('operservice/GetSignReward', 'channel,currdate,sceneid', {currdate: res.data.currdate})
          if (res.ret === 0) {
            console.log('签到成功!说明CK有效')
          } else {
            console.log(res)
          }
          break
        }
      }
    } else {
      console.log('没有获取到签到信息！')
    }

    let taskRetCode: number = 0;
    }
  
  
})()

interface Params {
  isgift?: number,
  isquerypicksite?: number,
  petid?: number,
  type?: string,
  taskId?: number
  configExtra?: string,
  sharekey?: string,
  currdate?: string,
  token?: string
}

function api(fn: string, stk: string, params: Params = {}) {
    return new Promise(async (resolve, reject) => {
      let url = `https://m.jingxi.com/jxmc/${fn}?channel=7&sceneid=1001&activeid=${activeid}&activekey=null&jxmc_jstoken=${jxToken.strPgUUNum}&timestamp=${Date.now()}&phoneid=${jxToken.strPhoneID}&_stk=${encodeURIComponent(stk)}&_ste=1&_=${Date.now()}&sceneval=2`
      if (Object.keys(params).length !== 0) {
        let key: (keyof Params)
        for (key in params) {
          if (params.hasOwnProperty(key))
            url += `&${key}=${params[key]}`
        }
      }
      url += '&h5st=' + decrypt(stk, url)
      try {
        let {data} = await axios.get(url, {
          headers: {
            'Cookie': cookie,
            'Host': 'm.jingxi.com',
            'User-Agent': 'jdpingou;iPhone;4.11.0;12.4.1;52cf225f0c463b69e1e36b11783074f9a7d9cbf0;network/wifi;model/iPhone11,6;appBuild/100591;ADID/C51FD279-5C69-4F94-B1C5-890BC8EB501F;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/0;hasOCPay/0;supportBestPay/0;session/503;pap/JA2019_3111789;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
            'Referer': 'https://st.jingxi.com/',
          }
        })
        resolve(data)
      } catch (e) {
        reject(401)
      }
    })
  }
function api1(fn: string, stk: string, params: Params = {}) {
    return new Promise(async (resolve, reject) => {
      let url = `https://m.jingxi.com/jxmc/${fn}?channel=7&sceneid=1001&activeid=${activeid}&activekey=null&step=B-1&jxmc_jstoken=${jxToken.strPgUUNum}&timestamp=${Date.now()}&phoneid=${jxToken.strPhoneID}&_stk=${encodeURIComponent(stk)}&_ste=1&_=${Date.now()}&sceneval=2&g_login_type=1&callback=jsonpCBKS&g_ty=ls`
      if (Object.keys(params).length !== 0) {
        let key: (keyof Params)
        for (key in params) {
          if (params.hasOwnProperty(key))
            url += `&${key}=${params[key]}`
        }
      }
      url += '&h5st=' + decrypt(stk, url)
      try {
        let {data} = await axios.get(url, {
          headers: {
            'Cookie': cookie,
            'Host': 'm.jingxi.com',
            'User-Agent': 'jdpingou;android;5.3.0;11;9caf6ce67c094856;network/wifi;model/PCCM00;appBuild/18113;partner/oppo01;;session/116;aid/9caf6ce67c094856;oaid/;pap/JA2019_3111789;brand/OPPO;eu/9336166663365663;fv/7336039343835363;Mozilla/5.0 (Linux; Android 11; PCCM00 Build/RKQ1.200928.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/92.0.4515.159 Mobile Safari/537.36',
            'Referer': 'https://st.jingxi.com/',
          }
        })
        resolve(data)
      } catch (e) {
        reject(401)
      }
    })
  }
  function api2(fn: string, stk: string, params: Params = {}) {
    return new Promise(async (resolve, reject) => {
      let url = `https://m.jingxi.com/jxmc/${fn}?channel=7&sceneid=1001&activeid=${activeid}&activekey=null&step=C-1&jxmc_jstoken=${jxToken.strPgUUNum}&timestamp=${Date.now()}&phoneid=${jxToken.strPhoneID}&_stk=${encodeURIComponent(stk)}&_ste=1&_=${Date.now()}&sceneval=2&g_login_type=1&callback=jsonpCBKS&g_ty=ls`
      if (Object.keys(params).length !== 0) {
        let key: (keyof Params)
        for (key in params) {
          if (params.hasOwnProperty(key))
            url += `&${key}=${params[key]}`
        }
      }
      url += '&h5st=' + decrypt(stk, url)
      try {
        let {data} = await axios.get(url, {
          headers: {
            'Cookie': cookie,
            'Host': 'm.jingxi.com',
            'User-Agent': 'jdpingou;android;5.3.0;11;9caf6ce67c094856;network/wifi;model/PCCM00;appBuild/18113;partner/oppo01;;session/116;aid/9caf6ce67c094856;oaid/;pap/JA2019_3111789;brand/OPPO;eu/9336166663365663;fv/7336039343835363;Mozilla/5.0 (Linux; Android 11; PCCM00 Build/RKQ1.200928.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/92.0.4515.159 Mobile Safari/537.36',
            'Referer': 'https://st.jingxi.com/',
          }
        })
        resolve(data)
      } catch (e) {
        reject(401)
      }
    })
  }
  
  function api3(fn: string, stk: string, params: Params = {}) {
    return new Promise(async (resolve, reject) => {
      let url = `https://m.jingxi.com/jxmc/${fn}?channel=7&sceneid=1001&activeid=${activeid}&activekey=null&step=C-1&jxmc_jstoken=${jxToken.strPgUUNum}&timestamp=${Date.now()}&phoneid=${jxToken.strPhoneID}&_stk=${encodeURIComponent(stk)}&_ste=1&_=${Date.now()}&sceneval=2&g_login_type=1&callback=jsonpCBKS&g_ty=ls`
      if (Object.keys(params).length !== 0) {
        let key: (keyof Params)
        for (key in params) {
          if (params.hasOwnProperty(key))
            url += `&${key}=${params[key]}`
        }
      }
      url += '&h5st=' + decrypt(stk, url)
      try {
        let {data} = await axios.get(url, {
          headers: {
            'Cookie': cookie,
            'Host': 'm.jingxi.com',
            'User-Agent': 'jdpingou;android;5.3.0;11;9caf6ce67c094856;network/wifi;model/PCCM00;appBuild/18113;partner/oppo01;;session/116;aid/9caf6ce67c094856;oaid/;pap/JA2019_3111789;brand/OPPO;eu/9336166663365663;fv/7336039343835363;Mozilla/5.0 (Linux; Android 11; PCCM00 Build/RKQ1.200928.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/92.0.4515.159 Mobile Safari/537.36',
            'Referer': 'https://st.jingxi.com/',
          }
        })
        resolve(data)
      } catch (e) {
        reject(401)
      }
    })
  }
  

function getTask() {
  return new Promise<number>(async resolve => {
    let tasks: any = await taskAPI('GetUserTaskStatusList', 'bizCode,dateType,source')
    let doTaskRes: any = {ret: 1};
    for (let t of tasks.data.userTaskStatusList) {
      if ((t.dateType === 1 || t.dateType === 2) && t.completedTimes == t.targetTimes && t.awardStatus === 2) {
        // 成就任务
        t.dateType === 1
          ?
          console.log('成就任务可领取:', t.taskName, t.completedTimes, t.targetTimes)
          :
          console.log('每日任务可领取:', t.taskName, t.completedTimes, t.targetTimes)

        doTaskRes = await taskAPI('Award', 'bizCode,source,taskId', {taskId: t.taskId})
        await wait(4000)
        if (doTaskRes.ret === 0) {
          let awardCoin = doTaskRes['data']['prizeInfo'].match(/:(.*)}/)![1] * 1
          console.log('领奖成功:', awardCoin)
        }
      }
      if (t.dateType === 2 && t.completedTimes < t.targetTimes && t.awardStatus === 2 && t.taskType === 2) {
        console.log('可做每日任务:', t.taskName, t.taskId)
        doTaskRes = await taskAPI('DoTask', 'bizCode,configExtra,source,taskId', {taskId: t.taskId, configExtra: ''})
        if (doTaskRes.ret === 0) {
          console.log('任务完成')
          await wait(5000)
        }
      }
    }
    resolve(doTaskRes.ret)
  })
}

function taskAPI(fn: string, stk: string, params: Params = {}) {
  return new Promise(async resolve => {
    let url = `https://m.jingxi.com/newtasksys/newtasksys_front/${fn}?_=${Date.now()}&source=jxmc&bizCode=jxmc&_ste=1&sceneval=2&_stk=${encodeURIComponent(stk)}&g_login_type=1&g_ty=ajax`
    if (Object.keys(params).length !== 0) {
      let key: (keyof Params)
      for (key in params) {
        if (params.hasOwnProperty(key))
          url += `&${key}=${params[key]}`
      }
    }
    url += '&h5st=' + decrypt(stk, url)
    let {data} = await axios.get(url, {
      headers: {
        'Origin': 'https://st.jingxi.com',
        'Accept-Language': 'zh-cn',
        'Connection': 'keep-alive',
        'Host': 'm.jingxi.com',
        'Referer': 'https://st.jingxi.com/pingou/jxmc/index.html?nativeConfig=%7B%22immersion%22%3A1%2C%22toColor%22%3A%22%23e62e0f%22%7D&__mcwvt=sjcp&PTAG=139279.13.31&jxsid=16257474246337594063',
        'Accept': 'application/json',
        'User-Agent': 'jdpingou;iPhone;4.11.0;12.4.1;52cf225f0c463b69e1e36b11783074f9a7d9cbf0;network/wifi;model/iPhone11,6;appBuild/100591;ADID/C51FD279-5C69-4F94-B1C5-890BC8EB501F;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/0;hasOCPay/0;supportBestPay/0;session/503;pap/JA2019_3111789;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Cookie': cookie
      }
    })
    resolve(data)
  })
}


