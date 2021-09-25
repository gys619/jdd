/**
cron=24 0-23/4 * * * jd_work_pigPet.js
new Env('京东金融养猪猪');
 */

let common = require("./function/common");
let $ = new common.env('京东金融养猪猪');
let min = 3,
    help = $.config[$.filename(__filename)] || Math.min(min, $.config.JdMain) || min;
$.setOptions({
    headers: {
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148/application=JDJR-App&deviceId=1423833363730383d273532393d243445364-d224341443d2938333530323445433033353&eufv=1&clientType=ios&iosType=iphone&clientVersion=6.1.70&HiClVersion=6.1.70&isUpdate=0&osVersion=13.7&osName=iOS&platform=iPhone 6s (A1633/A1688/A1691/A1700)&screen=667*375&src=App Store&netWork=1&netWorkType=1&CpayJS=UnionPay/1.0 JDJR&stockSDK=stocksdk-iphone_3.5.0&sPoint=&jdPay=(*#@jdPaySDK*#@jdPayChannel=jdfinance&jdPayChannelVersion=6.1.70&jdPaySdkVersion=3.00.52.00&jdPayClientName=iOS*#@jdPaySDK*#@)',
        'referer': 'https://u1.jr.jd.com/uc-fe-wxgrowing/cloudpig/index/?channel=gry&jrcontainer=h5&jrlogin=true',
    }
});
eval(common.eval.mainEval($));
async function main(id) {
    // 查询状态
    await work('pigPetLogin', {
        "source": 2,
        "channelLV": "juheye",
        "riskDeviceParam": "{}"
    })
    common.assert($.haskey($.source, 'resultData.resultData.hasPig'), "没有小猪猪")
    if ($.haskey($.source, 'resultData.resultData.wishAward')) {
        let reward = $.source.resultData.resultData.wishAward.name;
        console.log("可兑换: ", reward)
        $.notice("可兑换: " + reward)
    }
    await work('pigPetSignIndex', {
        "source": 2,
        "channelLV": "juheye",
        "riskDeviceParam": "{}"
    })
    let day = $.haskey($.source, 'resultData.resultData.today')
    if (!$.haskey($.source, 'resultData.resultData.sign')) {
        await work('pigPetSignOne', {
            "source": 2,
            "channelLV": "juheye",
            "riskDeviceParam": "{}",
            "no": day
        })
    } else {
        console.log(`第${day}天签到`)
    }
    // 获取任务列表
    await work('pigPetMissionList', {
        "source": 2,
        "channelLV": "",
        "riskDeviceParam": "{}"
    })
    let pigPetMissionList = $.source
    for (let z of Array(2)) {
        for (let i of $.haskey($.source, 'resultData.resultData.missions')) {
            if (i.status == 3) {
                console.log("去做任务:", i.missionName)
                let query = i.url ? $.urlparse(i.url).query : {}
                await $.curl({
                    'url': 'https://ms.jr.jd.com/gw/generic/uc/h5/m/pigPetDoMission?_=1625996333719',
                    'form': `reqData={"source":2,"mid":"${i.mid}","channelLV":"","riskDeviceParam":"{}"}`
                })
                if (query.readTime) {
                    await $.curl(`https://ms.jr.jd.com/gw/generic/mission/h5/m/queryMissionReceiveAfterStatus?reqData={"missionId":"${query.missionId}"}`)
                    console.log($.source.resultMsg)
                    await $.wait(query.readTime * 1000)
                    await $.curl(`https://ms.jr.jd.com/gw/generic/mission/h5/m/finishReadMission?reqData={"missionId":"${query.missionId}","readTime":${query.readTime}}`)
                    console.log($.source.resultMsg)
                    await $.wait(2000)
                } else if (query.juid) {
                    await $.curl(`https://ms.jr.jd.com/gw/generic/mission/h5/m/getJumpInfo?reqData={"juid":"${query.juid}"}`)
                    console.log($.source.resultMsg)
                    await $.wait(5000)
                }
            }
        }
        await work('pigPetMissionList', {
            "source": 2,
            "channelLV": "",
            "riskDeviceParam": "{}"
        })
        pigPetMissionList = $.source
    }
    // 延迟处理
    await $.wait(2000)
    console.log("\n领取奖励")
    for (let i of $.haskey(pigPetMissionList, 'resultData.resultData.missions')) {
        if (i.status != 5) {
            await work('pigPetDoMission', {
                "source": 2,
                "mid": i.mid,
                "channelLV": "",
                "riskDeviceParam": "{}"
            })
            console.log(i.missionName, $.source.resultData.resultData)
            await $.wait(2000)
        }
    }
    for (let z of Array(5)) {
        await work('pigPetOpenBox', {
            "source": 0,
            "channelLV": "yqs",
            "riskDeviceParam": "{}",
            "no": 5,
            "category": "1001",
            "t": Date.now()
        })
        if ($.haskey($.source, 'resultData.resultData.award')) {
            console.log(`开宝箱获得${$.source.resultData.resultData.award.content}，数量：${$.source.resultData.resultData.award.count}`);
            await $.wait(2000)
        }
    }
    // 抽奖
    await work('pigPetLotteryIndex', {
        "source": 0,
        "channelLV": "juheye",
        "riskDeviceParam": "{}"
    })
    if ($.haskey($.source, 'resultData.resultData.currentCount')) {
        for (let i of Array($.source.resultData.resultData.currentCount)) {
            console.log("\n开始抽奖")
            await work('pigPetLotteryPlay', {
                "source": 0,
                "channelLV": "juheye",
                "riskDeviceParam": "{}",
                "t": Date.now(),
                "type": 0,
            })
        }
    }
    await work('pigPetUserBag', {
        "source": 0,
        "channelLV": "yqs",
        "riskDeviceParam": "{}",
        "t": Date.now(),
        "skuId": "1001003004",
        "category": "1001"
    })
    if ($.haskey($.source, 'resultData.resultData.goods')) {
        for (let i of $.source.resultData.resultData.goods) {
            if (i.count > 19) {
                console.log("正在喂食:", i.goodsName)
                await work('pigPetAddFood', {
                    "source": 0,
                    "channelLV": "yqs",
                    "riskDeviceParam": "{}",
                    "skuId": i.sku,
                    "category": "1001",
                })
                await $.wait(2000)
            }
        }
    }
}
async function work(functionId, body) {
    await $.curl({
        'url': `https://ms.jr.jd.com/gw/generic/uc/h5/m/${functionId}?_=${Date.now()}`,
        'form': `reqData=${typeof(body)=='object'?JSON.stringify(body):body}`
    })
}
