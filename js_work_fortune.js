let common = require("./function/common");
let $ = new common.env('京喜财富岛');
let min = 5,
    help = $.config[$.filename(__filename)] || Math.min(min, $.config.JdMain) || min;
$.setOptions({
    headers: {
        'content-type': 'application/json',
        'user-agent': 'jdapp;iPhone;10.0.8;13.7;7b01d4690ef13716984dcfcf96068f36b41f6c51;network/wifi;model/iPhone8,1;addressid/4666062376;appBuild/167741;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
        'referer': 'https://st.jingxi.com/fortune_island/index2.html',
    }
});
eval(common.eval.mainEval($));
async function prepare() {
    jxAlgo.set({
        'appId': 10032
    })
}
async function main() {
    $.ptag = `${$.rand(1001,9999)}.${$.rand(1,0)}.${$.rand(101,999)}`
    $.token = jxAlgo.token($.user)
    await work(`https://m.jingxi.com/jxbfd/user/QueryUserInfo?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=1627057509785&ptag=7155.9.47&ddwTaskId=&strShareId=&strMarkList=guider_step%2Ccollect_coin_auth%2Cguider_medal%2Cguider_over_flag%2Cbuild_food_full%2Cbuild_sea_full%2Cbuild_shop_full%2Cbuild_fun_full%2Cmedal_guider_show%2Cguide_guider_show%2Cguide_receive_vistor%2Cdaily_task%2Cguider_daily_task&strPgtimestamp=${$.token.strPgtimestamp}&strPhoneID=${$.token.strPhoneID}&strPgUUNum=${$.token.strPgUUNum}&strVersion=1.0.1&_stk=_cfd_t%2CbizCode%2CddwTaskId%2CdwEnv%2Cptag%2Csource%2CstrMarkList%2CstrPgUUNum%2CstrPgtimestamp%2CstrPhoneID%2CstrShareId%2CstrVersion%2CstrZone&_ste=1`, 'QueryUserInfo')
    if ($.haskey($.source, 'Fund.dwIsGetGift', 0) && $.source.Fund.dwIsGetGift < $.source.Fund.dwIsShowFund) {
        // 领取百元奖励
        await work(`https://m.jingxi.com/jxbfd/user/drawpackprize?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&_stk=_cfd_t%2CbizCode%2CdwEnv%2Cptag%2Csource%2CstrZone&_ste=1`)
        console.log("领取百元奖励:", $.source.sErrMsg)
    }
    // 签到
    await GetTakeAggrPage()
    // 找导游
    await EmployTourGuide()
    // 捡破烂 珍珠
    await pickshell()
    // 卖贝壳
    // await CollectorOper()
    // 倒垃圾
    await RubbishOper()
    for (let z in $.QueryUserInfo) {
        data = $.QueryUserInfo[z]
        switch (z) {
            case 'buildInfo':
                console.log("\n获取门店金币")
                for (let i of $.haskey(data, 'buildList')) {
                    await work(`https://m.jingxi.com/jxbfd/user/CollectCoin?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=&strBuildIndex=${i.strBuildIndex}&dwType=1&_stk=_cfd_t%2CbizCode%2CdwEnv%2CdwType%2Cptag%2Csource%2CstrBuildIndex%2CstrZone&_ste=1`)
                    console.log(`获取 ${i.strBuildIndex} 金币: ${$.source.ddwCoin}`)
                    if (i.dwCanLvlUp) {
                        if (i.dwLvl == 0) {
                            // 空地建房
                            await work(`https://m.jingxi.com/jxbfd/user/createbuilding?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&strBuildIndex=${i.strBuildIndex}&_stk=_cfd_t%2CbizCode%2CdwEnv%2Cptag%2Csource%2CstrBuildIndex%2CstrZone&_ste=1`)
                            console.log("拓荒:", i.strBuildIndex)
                        }
                        // 查询状态
                        await work(`https://m.jingxi.com/jxbfd/user/GetBuildInfo?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&strBuildIndex=${i.strBuildIndex}&dwType=1&_stk=_cfd_t%2CbizCode%2CdwEnv%2CdwType%2Cptag%2Csource%2CstrBuildIndex%2CstrZone&_ste=1`)
                        let build = $.source
                        h = await $.curl('https://m.jingxi.com/active/getfunction?_=${$.timestamp}&sceneval=2&g_login_type=1&callback=GetFunctionQ&g_ty=ls')
                        eval(h.replace("GetFunctionQ", 'GetFunctionQ=').replace('JD', 'return val; JD'))
                        promotejs = GetFunctionQ.function(GetFunctionQ.TOKEN)
                        cookie = `promotejs=${promotejs};${$.cookie}`
                        $.setCookie(cookie);
                        // 升级
                        await work(`https://m.jingxi.com/jxbfd/user/BuildLvlUp?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&strBuildIndex=${i.strBuildIndex}&ddwCostCoin=${build.ddwNextLvlCostCoin}&_stk=_cfd_t%2CbizCode%2CddwCostCoin%2CdwEnv%2Cptag%2Csource%2CstrBuildIndex%2CstrZone&_ste=1`)
                        console.log("升级:", i.strBuildIndex)
                        $.setCookie($.cookie)
                        await $.wait(1000)
                    }
                }
                console.log("\n热气球旅客邀请")
                for (let i of Array(data.dwTourGuideComTm)) {
                    await work(`https://m.jingxi.com/jxbfd/user/SpeedUp?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&strBuildIndex=fun&_stk=_cfd_t%2CbizCode%2CdwEnv%2Cptag%2Csource%2CstrBuildIndex%2CstrZone&_ste=1`)
                    if ($.haskey($.source, 'iRet', 1003)) {
                        console.log("暂停接客")
                        console.log($.source)
                        break
                    }
                    console.log("接待旅客", $.source.dwTodaySpeedPeople)
                    await $.wait(300)
                }
                break;
            case 'StoryInfo':
                if (data.Mermaid != null && data.Mermaid.strStoryId) {
                    await work(`https://m.jingxi.com/jxbfd/story/MermaidOper?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&strStoryId=${data.Mermaid.strStoryId}&dwType=2&ddwTriggerDay=${data.Mermaid.ddwTriggerDay}&_stk=_cfd_t%2CbizCode%2CddwTriggerDay%2CdwEnv%2CdwType%2Cptag%2Csource%2CstrStoryId%2CstrZone&_ste=1`)
                    console.log("约会获得:", $.haskey($.source, 'Data.ddwCoin'))
                }
                for (let k of $.haskey(data, 'StoryList') || []) {
                    if (k.Mermaid) {
                        console.log("\n遇到美人鱼")
                        // 获取昨日奖励
                        await work(`https://m.jingxi.com/jxbfd/story/MermaidOper?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&strStoryId=${k.strStoryId}&dwType=4&ddwTriggerDay=${k.ddwTriggerDay}&_stk=_cfd_t%2CbizCode%2CddwTriggerDay%2CdwEnv%2CdwType%2Cptag%2Csource%2CstrStoryId%2CstrZone&_ste=1`)
                        console.log("昨天约了:", $.source.sErrMsg)
                        // 做今日任务
                        await work(`https://m.jingxi.com/jxbfd/story/MermaidOper?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&strStoryId=${k.strStoryId}&dwType=1&ddwTriggerDay=${k.ddwTriggerDay}&_stk=_cfd_t%2CbizCode%2CddwTriggerDay%2CdwEnv%2CdwType%2Cptag%2Csource%2CstrStoryId%2CstrZone&_ste=1`)
                        console.log("今天请客:", $.source.sErrMsg)
                        await work(`https://m.jingxi.com/jxbfd/story/MermaidOper?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&strStoryId=${k.strStoryId}&dwType=3&ddwTriggerDay=${k.ddwTriggerDay}&_stk=_cfd_t%2CbizCode%2CddwTriggerDay%2CdwEnv%2CdwType%2Cptag%2Csource%2CstrStoryId%2CstrZone&_ste=1`)
                        console.log("今天约了:", $.source.sErrMsg)
                    }
                    if (k.Collector) {
                        console.log("\n遇到奸商")
                        await work(`https://m.jingxi.com/jxbfd/story/CollectorOper?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&strStoryId=${k.strStoryId}&dwType=2&ddwTriggerDay=${k.ddwTriggerDay}&_stk=_cfd_t%2CbizCode%2CddwTriggerDay%2CdwEnv%2CdwType%2Cptag%2Csource%2CstrStoryId%2CstrZone&_ste=1`)
                        await work(`https://m.jingxi.com/jxbfd/story/queryshell?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&_stk=_cfd_t%2CbizCode%2CdwEnv%2Cptag%2Csource%2CstrZone&_ste=1`)
                        await work(`https://m.jingxi.com/jxbfd/story/QueryMedalList?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&_stk=_cfd_t%2CbizCode%2CdwEnv%2Cptag%2Csource%2CstrZone&_ste=1`)
                        await work(`https://m.jingxi.com/jxbfd/story/querystorageroom?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&_stk=_cfd_t%2CbizCode%2CdwEnv%2Cptag%2Csource%2CstrZone&_ste=1`)
                        await work(`https://m.jingxi.com/jxbfd/story/sellgoods?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&strTypeCnt=1%3A1%7C2%3A4%7C3%3A4%7C4%3A2&dwSceneId=2&_stk=_cfd_t%2CbizCode%2CdwEnv%2CdwSceneId%2Cptag%2Csource%2CstrTypeCnt%2CstrZone&_ste=1`)
                        await work(`https://m.jingxi.com/jxbfd/story/CollectorOper?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&strStoryId=${k.strStoryId}&dwType=4&ddwTriggerDay=${k.ddwTriggerDay}&_stk=_cfd_t%2CbizCode%2CddwTriggerDay%2CdwEnv%2CdwType%2Cptag%2Csource%2CstrStoryId%2CstrZone&_ste=1`)
                        console.log("含泪贱卖:", $.source.sErrMsg)
                    }
                    if (k.Special) {
                        console.log("\n情景任务:", k.Special.strName)
                        await work(`https://m.jingxi.com/jxbfd/story/SpecialUserOper?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&strStoryId=${k.strStoryId}&dwType=2&triggerType=0&ddwTriggerDay=${k.ddwTriggerDay}&_stk=_cfd_t%2CbizCode%2CddwTriggerDay%2CdwEnv%2CdwType%2Cptag%2Csource%2CstrStoryId%2CstrZone%2CtriggerType&_ste=1`)
                        console.log($.source.sErrMsg)
                        await $.wait(31000)
                        await work(`https://m.jingxi.com/jxbfd/story/SpecialUserOper?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&strStoryId=${k.strStoryId}&dwType=3&triggerType=0&ddwTriggerDay=${k.ddwTriggerDay}&_stk=_cfd_t%2CbizCode%2CddwTriggerDay%2CdwEnv%2CdwType%2Cptag%2Csource%2CstrStoryId%2CstrZone%2CtriggerType&_ste=1`)
                        console.log($.source.sErrMsg)
                    }
                }
                break;
        }
    }
    // 任务列表
    await GetUserTask()
    // 提现
    // await UserCashOut()
    // 宝箱
    await GetActTask()
    // 珍珠任务
    await ComposeGame()
}
async function UserCashOut() {
    await work(`https://m.jingxi.com/jxbfd/user/UserCashOutState?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=1627230478007&ptag=7155.9.47&_stk=_cfd_t%2CbizCode%2CdwEnv%2Cptag%2Csource%2CstrZone&_ste=1`, 'UserCashOutState')
    if ($.haskey($.UserCashOutState, 'UsrCurrCashList') && $.UserCashOutState.UsrCurrCashList.length > 0 && $.UserCashOutState.dwTodayIsCashOut == 0) {
        for (let i of $.UserCashOutState.UsrCurrCashList) {
            if (i.dwDefault == 1) {
                await work(`https://m.jingxi.com/jxbfd/user/CashOut?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=1627230762800&ptag=7155.9.47&ddwMoney=${i.ddwMoney}&ddwPaperMoney=${i.ddwPaperMoney}&strPgtimestamp=${$.token.strPgtimestamp}&strPhoneID=${$.token.strPhoneID}&strPgUUNum=${$.token.strPgUUNum}&_stk=_cfd_t%2CbizCode%2CddwMoney%2CddwPaperMoney%2CdwEnv%2Cptag%2Csource%2CstrPgUUNum%2CstrPgtimestamp%2CstrPhoneID%2CstrZone&_ste=1`)
                console.log("兑换:", i.ddwMoney / 100)
            }
        }
    }
}
async function GetTakeAggrPage() {
    await work(`https://m.jingxi.com/jxbfd/story/GetTakeAggrPage?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&_stk=_cfd_t%2CbizCode%2CdwEnv%2Cptag%2Csource%2CstrZone&_ste=1`, 'GetTakeAggrPage')
    // 签到
    if ($.haskey($.GetTakeAggrPage, 'Data.Sign.SignList')) {
        SignList = $.GetTakeAggrPage.Data.Sign.SignList
        getSign = SignList[$.GetTakeAggrPage.Data.Sign.dwTodayId - 1]
        if (getSign.dwStatus == 0) {
            await work(`https://m.jingxi.com/jxbfd/story/RewardSign?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&ddwCoin=${getSign.ddwCoin}&ddwMoney=${getSign.ddwMoney}&dwPrizeType=${getSign.dwPrizeType}&strPrizePool=${getSign.strPrizePool}&dwPrizeLv=${getSign.dwBingoLevel}&_stk=_cfd_t%2CbizCode%2CddwCoin%2CddwMoney%2CdwEnv%2CdwPrizeLv%2CdwPrizeType%2Cptag%2Csource%2CstrPrizePool%2CstrZone&_ste=1`)
            console.log("签到", $.source.sErrMsg)
        }
    }
    // 获取助力奖励
    if ($.haskey($.GetTakeAggrPage, 'Data.Employee.EmployeeList')) {
        for (let i of $.GetTakeAggrPage.Data.Employee.EmployeeList) {
            if (i.dwStatus == 0) {
                await work(`https://m.jingxi.com/jxbfd/story/helpdraw?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&dwUserId=${i.dwId}&_stk=_cfd_t%2CbizCode%2CdwEnv%2CdwUserId%2Cptag%2Csource%2CstrZone&_ste=1`)
                console.log("朋友赞助:", $.source.sErrMsg)
            }
        }
    }
}
async function GetUserTask() {
    // 任务列表
    await work(`https://m.jingxi.com/newtasksys/newtasksys_front/GetUserTaskStatusList?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&taskId=0&_stk=_cfd_t%2CbizCode%2CdwEnv%2Cptag%2Csource%2CstrZone%2CtaskId&_ste=1`, 'GetUserTaskStatusList')
    for (i of $.haskey($.GetUserTaskStatusList, 'data.userTaskStatusList') || []) {
        switch (i.taskType) {
            case 11:
                if (i.targetTimes == i.completedTimes && i.awardStatus == 2) {
                    console.log("领取奖励:", i.taskName)
                    await work(`https://m.jingxi.com/newtasksys/newtasksys_front/Award?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${i.ptag}&taskId=${i.taskId}&_stk=_cfd_t%2CbizCode%2CdwEnv%2Cptag%2Csource%2CstrZone%2CtaskId&_ste=1`)
                }
                break;
            default:
                for (let j of Array(i.targetTimes - i.realCompletedTimes)) {
                    if (i.taskConfigExtra) {
                        taskUrl = i.taskConfigExtra.split("##")[1]
                        await $.curl(taskUrl)
                        sleep = $.match(/\@(\d+)/, i.taskConfigExtra)
                        await $.wait(sleep * 1000)
                    }
                    url = `https://m.jingxi.com/newtasksys/newtasksys_front/DoTask?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${i.ptag}&taskId=${i.taskId}&configExtra=&_stk=_cfd_t%2CbizCode%2CconfigExtra%2CdwEnv%2Cptag%2Csource%2CstrZone%2CtaskId`
                    await work(url)
                    await $.wait(2000)
                }
                if (i.awardStatus == 2) {
                    console.log("领取奖励:", i.taskName)
                    await work(`https://m.jingxi.com/newtasksys/newtasksys_front/Award?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${i.ptag}&taskId=${i.taskId}&_stk=_cfd_t%2CbizCode%2CdwEnv%2Cptag%2Csource%2CstrZone%2CtaskId&_ste=1`)
                }
                break
        }
    }
}
async function GetActTask() {
    // 宝箱
    await work(`https://m.jingxi.com/jxbfd/story/GetActTask?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&_stk=_cfd_t%2CbizCode%2CdwEnv%2Cptag%2Csource%2CstrZone&_ste=1`, 'GetActTask')
    if ($.haskey($.GetActTask, 'Data.dwStatus') != 4) {
        for (let i of $.haskey($.GetActTask, 'Data.TaskList') || []) {
            if (i.dwAwardStatus == 2) {
                console.log(i.strTaskName)
                if (i.strJumpUrl) {
                    jumpUrl = i.strJumpUrl.split("##")[1]
                    await $.curl(jumpUrl)
                    await $.wait(i.dwLookTime * 1000)
                    await work(`https://m.jingxi.com/newtasksys/newtasksys_front/DoTask?strZone=jxbfd&bizCode=jxbfddch&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&taskId=${i.ddwTaskId}&configExtra=&_stk=_cfd_t%2CbizCode%2CconfigExtra%2CdwEnv%2Cptag%2Csource%2CstrZone%2CtaskId&_ste=1`)
                }
                await work(`https://m.jingxi.com/newtasksys/newtasksys_front/Award?strZone=jxbfd&bizCode=jxbfddch&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&taskId=${i.ddwTaskId}&_stk=_cfd_t%2CbizCode%2CdwEnv%2Cptag%2Csource%2CstrZone%2CtaskId&_ste=1`)
            }
        }
        await work(`https://m.jingxi.com/jxbfd/story/ActTaskAward?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&_stk=_cfd_t%2CbizCode%2CdwEnv%2Cptag%2Csource%2CstrZone&_ste=1`)
        console.log("完成所有任务奖励")
    }
}
async function RubbishOper() {
    // 倒垃圾
    await work(`https://m.jingxi.com/jxbfd/story/QueryRubbishInfo?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&_stk=_cfd_t%2CbizCode%2CdwEnv%2Cptag%2Csource%2CstrZone&_ste=1`, 'QueryRubbishInfo')
    for (let i of $.QueryRubbishInfo.Data.StoryInfo.StoryList || []) {
        await work(`https://m.jingxi.com/jxbfd/story/RubbishOper?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&dwType=1&dwRewardType=0&_stk=_cfd_t%2CbizCode%2CdwEnv%2CdwRewardType%2CdwType%2Cptag%2Csource%2CstrZone&_ste=1`)
        for (let j = 1; j < 9; j++) {
            await work(`https://m.jingxi.com/jxbfd/story/RubbishOper?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&dwType=2&dwRewardType=0&dwRubbishId=${j}&_stk=_cfd_t%2CbizCode%2CdwEnv%2CdwRewardType%2CdwRubbishId%2CdwType%2Cptag%2Csource%2CstrZone&_ste=1`)
            console.log("倒垃圾:", $.source.sErrMsg)
        }
    }
}
async function pickshell() {
    // 捡破烂
    await work(`https://m.jingxi.com/jxbfd/story/queryshell?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&_stk=_cfd_t%2CbizCode%2CdwEnv%2Cptag%2Csource%2CstrZone&_ste=1`, 'queryshell')
    if ($.haskey($.queryshell, 'Data.NormShell')) {
        for (let i in $.queryshell.Data.NormShell) {
            for (let j of Array($.queryshell.Data.NormShell[i].dwNum)) {
                console.log("正在捡:", $.queryshell.Data.ShellKind[i].strName)
                await work(`https://m.jingxi.com/jxbfd/story/pickshell?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&dwType=${$.queryshell.Data.ShellKind[i].dwType}&_stk=_cfd_t%2CbizCode%2CdwEnv%2CdwType%2Cptag%2Csource%2CstrZone&_ste=1`)
                if ($.haskey($.source, 'iRet', 5403)) {
                    await CollectorOper()
                }
            }
        }
    }
}
async function EmployTourGuide() {
    // 找导游小姐
    await work(`https://m.jingxi.com/jxbfd/user/EmployTourGuideInfo?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&_stk=_cfd_t%2CbizCode%2CdwEnv%2Cptag%2Csource%2CstrZone&_ste=1`, 'EmployTourGuideInfo')
    let n = 0
    if ($.EmployTourGuideInfo.dwRemainGuideCnt) {
        for (let i of $.EmployTourGuideInfo.TourGuideList) {
            if (i.ddwRemainTm == 0) {
                await work(`https://m.jingxi.com/jxbfd/user/EmployTourGuide?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&strBuildIndex=${i.strBuildIndex}&dwIsFree=${i.dwFreeMin?1:0}&ddwConsumeCoin=${i.ddwCostCoin}&_stk=_cfd_t%2CbizCode%2CddwConsumeCoin%2CdwEnv%2CdwIsFree%2Cptag%2Csource%2CstrBuildIndex%2CstrZone&_ste=1`)
                n++;
                console.log("找导游", i.strGuideName, $.source.sErrMsg)
                if (n == $.EmployTourGuideInfo.dwRemainGuideCnt) {
                    break
                }
                await $.wait(2000)
            }
        }
    }
}
async function CollectorOper() {
    // 卖破烂
    await work(`https://m.jingxi.com/jxbfd/story/querystorageroom?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&_stk=_cfd_t%2CbizCode%2CdwEnv%2Cptag%2Csource%2CstrZone&_ste=1`, 'querystorageroom')
    let array = ['小珍珠', '小海螺', '大海螺', '海星']
    shellData = $.querystorageroom.Data
    shell = []
    for (let i in shellData.ShellKind) {
        // if (array.includes(shellData.ShellKind[i].strName)) {
        if (shellData.Office[i] && shellData.Office[i].dwCount > 0) {
            shell.push(`${shellData.Office[i].dwType}:${shellData.Office[i].dwCount}`)
        }
        // }
    }
    if (shell.length > 0) {
        strTypeCnt = shell.join('|')
        // 卖给商人
        await work(`https://m.jingxi.com/jxbfd/story/sellgoods?strZone=jxbfd&bizCode=jxbfd&source=jxbfd&dwEnv=7&_cfd_t=${$.timestamp}&ptag=${$.ptag}&strTypeCnt=${strTypeCnt}&dwSceneId=1&_stk=_cfd_t%2CbizCode%2CdwEnv%2CdwSceneId%2Cptag%2Csource%2CstrTypeCnt%2CstrZone&_ste=1`)
        console.log("卖破烂换钱:", $.haskey($.source, 'Data.ddwCoin'))
    }
}
async function ComposeGame() {
    // 撸珍珠
    await work(`https://m.jingxi.com/jxbfd/user/ComposeGameState?__t=${$.timestamp}&strZone=jxbfd&dwFirst=1&_=${$.timestamp}&sceneval=2&g_login_type=1&callback=jsonpCBKA&g_ty=ls`, 'ComposeGameState')
    if ($.ComposeGameState.dwCurProgress < 8) {
        console.log("珍珠任务")
        for (let i of Array(10 - $.ComposeGameState.dwCurProgress)) {
            console.log("等待上报")
            await $.wait($.rand(5000, 9999))
            await work(`https://m.jingxi.com/jxbfd/user/RealTmReport?__t=${$.timestamp}&dwIdentityType=0&strBussKey=composegame&strMyShareId=${$.ComposeGameState.strMyShareId}&ddwCount=5&_=${$.timestamp}&sceneval=2&g_login_type=1&callback=jsonpCBKC&g_ty=ls`)
            console.log("随机等待")
            await $.wait($.rand(10001, 25000))
            console.log("合成珍珠")
            await work(`https://m.jingxi.com/jxbfd/user/ComposeGameAddProcess?__t=${$.timestamp}&strZone=jxbfd&strBT=${$.ComposeGameState.strDT}&_stk=__t%2CstrBT%2CstrZone&_ste=1`)
            console.log($.source)
        }
    }
    for (let i of $.ComposeGameState.stagelist) {
        if (i.dwIsAward == 0) {
            console.log("珍珠领奖")
            await work(`https://m.jingxi.com/jxbfd/user/ComposeGameAward?__t=${$.timestamp}&strZone=jxbfd&dwCurStageEndCnt=${i.dwCurStageEndCnt}&_stk=__t%2CdwCurStageEndCnt%2CstrZone&_ste=1`)
            await $.wait(2000)
        }
    }
}
async function work(url, source = '') {
    let dec = await jxAlgo.dec(url)
    await $.curl(dec)
    if (source) {
        $[source] = $.source
    }
}
