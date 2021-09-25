/*
 * 如需运行请自行添加环境变量：JD_TRY，值填 true 即可运行
 * 脚本兼容: Node.js
 * X1a0He留
 * 脚本是否耗时只看args_xh.maxLength的大小
 * 上一作者说了每天最多300个商店，总上限为500个，jd_unsubscribe.js我已更新为批量取关版
 * 请提前取关至少250个商店确保京东试用脚本正常运行
 *
 * @Address: https://github.com/X1a0He/jd_scripts_fixed/blob/main/jd_try_xh.js
 * @LastEditors: X1a0He
 */
const $ = new Env('京东试用')
const URL = 'https://api.m.jd.com/client.action'
let trialActivityIdList = []
let trialActivityTitleList = []
let notifyMsg = ''
let size = 1;
$.isPush = true;
$.isLimit = false;
$.isForbidden = false;
$.wrong = false;
$.totalPages = 0;
$.giveupNum = 0;
$.successNum = 0;
$.completeNum = 0;
$.getNum = 0;
$.try = true;
$.sentNum = 0;
$.cookiesArr = []
$.innerKeyWords =
    [
        "幼儿园", "教程", "英语", "辅导", "培训",
        "孩子", "小学", "成人用品", "套套", "情趣",
        "自慰", "阳具", "飞机杯", "男士用品", "女士用品",
        "内衣", "高潮", "避孕", "乳腺", "肛塞", "肛门",
        "宝宝", "玩具", "芭比", "娃娃", "男用",
        "女用", "神油", "足力健", "老年", "老人",
        "宠物", "饲料", "丝袜", "黑丝", "磨脚",
        "脚皮", "除臭", "性感", "内裤", "跳蛋",
        "安全套", "龟头", "阴道", "阴部"
    ]
//下面很重要，遇到问题请把下面注释看一遍再来问
let args_xh = {
    /*
     * 商品原价，低于这个价格都不会试用，意思是
     * A商品原价49元，试用价1元，如果下面设置为50，那么A商品不会被加入到待提交的试用组
     * B商品原价99元，试用价0元，如果下面设置为50，那么B商品将会被加入到待提交的试用组
     * C商品原价99元，试用价1元，如果下面设置为50，那么C商品将会被加入到待提交的试用组
     * 默认为0
     * */
    jdPrice: process.env.JD_TRY_PRICE * 1 || 0,
    /*
     * 获取试用商品类型，默认为1，原来不是数组形式，我以为就只有几个tab，结果后面还有我服了
     * 1 - 精选
     * 2 - 闪电试
     * 3 - 家用电器(可能会有变化)
     * 4 - 手机数码(可能会有变化)
     * 5 - 电脑办公(可能会有变化)
     * ...
     * 下面有一个function是可以获取所有tabId的，名为try_tabList
     * 2021-09-06 12:32:00时获取到 tabId 16个
     * 可设置环境变量：JD_TRY_TABID，用@进行分隔
     * 默认为 1 到 5
     * */
    tabId: process.env.JD_TRY_TABID && process.env.JD_TRY_TABID.split('@').map(Number) || [1,2,3,4,5,6,7,8,9,10],
    /*
     * 试用商品标题过滤，黑名单，当标题存在关键词时，则不加入试用组
     * 当白名单和黑名单共存时，黑名单会自动失效，优先匹配白名单，匹配完白名单后不会再匹配黑名单，望周知
     * 例如A商品的名称为『旺仔牛奶48瓶特价』，设置了匹配白名单，白名单关键词为『牛奶』，但黑名单关键词存在『旺仔』
     * 这时，A商品还是会被添加到待提交试用组，白名单优先于黑名单
     * 已内置对应的 成人类 幼儿类 宠物 老年人类关键词，请勿重复添加
     * 可设置环境变量：JD_TRY_TITLEFILTERS，关键词与关键词之间用@分隔
     * */
    titleFilters: process.env.JD_TRY_TITLEFILTERS && process.env.JD_TRY_TITLEFILTERS.split('@') || [],
    /*
     * 试用价格(中了要花多少钱)，高于这个价格都不会试用，小于等于才会试用，意思就是
     * A商品原价49元，现在试用价1元，如果下面设置为10，那A商品将会被添加到待提交试用组，因为1 < 10
     * B商品原价49元，现在试用价2元，如果下面设置为1，那B商品将不会被添加到待提交试用组，因为2 > 1
     * C商品原价49元，现在试用价1元，如果下面设置为1，那C商品也会被添加到带提交试用组，因为1 = 1
     * 可设置环境变量：JD_TRY_TRIALPRICE，默认为0
     * */
    trialPrice: process.env.JD_TRY_TRIALPRICE * 1 || 0,
    /*
     * 最小提供数量，例如试用商品只提供2份试用资格，当前设置为1，则会进行申请
     * 若只提供5分试用资格，当前设置为10，则不会申请
     * 可设置环境变量：JD_TRY_MINSUPPLYNUM
     * */
    minSupplyNum: process.env.JD_TRY_MINSUPPLYNUM * 1 || 1,
    /*
     * 过滤大于设定值的已申请人数，例如下面设置的1000，A商品已经有1001人申请了，则A商品不会进行申请，会被跳过
     * 可设置环境变量：JD_TRY_APPLYNUMFILTER
     * */
    applyNumFilter: process.env.JD_TRY_APPLYNUMFILTER * 1 || 10000,
    /*
     * 商品试用之间和获取商品之间的间隔, 单位：毫秒(1秒=1000毫秒)
     * 可设置环境变量：JD_TRY_APPLYINTERVAL
     * 默认为3000，也就是3秒
     * */
    applyInterval: process.env.JD_TRY_APPLYINTERVAL * 1 || 5000,
    /*
     * 商品数组的最大长度，通俗来说就是即将申请的商品队列长度
     * 例如设置为20，当第一次获取后获得12件，过滤后剩下5件，将会进行第二次获取，过滤后加上第一次剩余件数
     * 例如是18件，将会进行第三次获取，直到过滤完毕后为20件才会停止，不建议设置太大
     * 可设置环境变量：JD_TRY_MAXLENGTH
     * */
    maxLength: process.env.JD_TRY_MAXLENGTH * 1 || 100,
    /*
     * 过滤种草官类试用，某些试用商品是专属官专属，考虑到部分账号不是种草官账号
     * 例如A商品是种草官专属试用商品，下面设置为true，而你又不是种草官账号，那A商品将不会被添加到待提交试用组
     * 例如B商品是种草官专属试用商品，下面设置为false，而你是种草官账号，那A商品将会被添加到待提交试用组
     * 例如B商品是种草官专属试用商品，下面设置为true，即使你是种草官账号，A商品也不会被添加到待提交试用组
     * 可设置环境变量：JD_TRY_PASSZC，默认为true
     * */
    passZhongCao: process.env.JD_TRY_PASSZC || true,
    /*
     * 是否打印输出到日志，考虑到如果试用组长度过大，例如100以上，如果每个商品检测都打印一遍，日志长度会非常长
     * 打印的优点：清晰知道每个商品为什么会被过滤，哪个商品被添加到了待提交试用组
     * 打印的缺点：会使日志变得很长
     *
     * 不打印的优点：简短日志长度
     * 不打印的缺点：无法清晰知道每个商品为什么会被过滤，哪个商品被添加到了待提交试用组
     * 可设置环境变量：JD_TRY_PLOG，默认为true
     * */
    printLog: process.env.JD_TRY_PLOG || true,
    /*
     * 白名单，是否打开，如果下面为true，那么黑名单会自动失效
     * 白名单和黑名单无法共存，白名单永远优先于黑名单
     * 可通过环境变量控制：JD_TRY_WHITELIST，默认为false
     * */
    whiteList: process.env.JD_TRY_WHITELIST || false,
    /*
     * 白名单关键词，当标题存在关键词时，加入到试用组
     * 例如A商品的名字为『旺仔牛奶48瓶特价』，白名单其中一个关键词是『牛奶』，那么A将会直接被添加到待提交试用组，不再进行另外判断
     * 就算设置了黑名单也不会判断，希望这种写得那么清楚的脑瘫问题就别提issues了
     * 可通过环境变量控制：JD_TRY_WHITELIST，用@分隔
     * */
    whiteListKeywords: process.env.JD_TRY_WHITELISTKEYWORDS && process.env.JD_TRY_WHITELISTKEYWORDS.split('@') || [],
    /*
     * 每多少个账号发送一次通知，默认为4
     * 可通过环境变量控制 JD_TRY_SENDNUM
     * */
    sendNum: process.env.JD_TRY_SENDNUM * 1 || 4,
}
//上面很重要，遇到问题请把上面注释看一遍再来问
!(async() => {
    console.log('X1a0He留：遇到问题请把脚本内的注释看一遍再来问，谢谢')
    console.log('X1a0He留：遇到问题请把脚本内的注释看一遍再来问，谢谢')
    console.log('X1a0He留：遇到问题请把脚本内的注释看一遍再来问，谢谢')
    await $.wait(500)
    // 如果你要运行京东试用这个脚本，麻烦你把环境变量 JD_TRY 设置为 true
    if(process.env.JD_TRY && process.env.JD_TRY === 'true'){
        await requireConfig()
        if(!$.cookiesArr[0]){
            $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
                "open-url": "https://bean.m.jd.com/"
            })
            return
        }
        for(let i = 0; i < $.cookiesArr.length; i++){
            if($.cookiesArr[i]){
                $.cookie = $.cookiesArr[i];
                $.UserName = decodeURIComponent($.cookie.match(/pt_pin=(.+?);/) && $.cookie.match(/pt_pin=(.+?);/)[1])
                $.index = i + 1;
                $.isLogin = true;
                $.nickName = '';
                await totalBean();
                console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
                if(!$.isLogin){
                    $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
                        "open-url": "https://bean.m.jd.com/bean/signIndex.action"
                    });
                    await $.notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                    continue
                }
                $.totalTry = 0
                $.totalSuccess = 0
                $.nowTabIdIndex = 0;
                $.nowPage = 1;
                $.nowItem = 1;
                trialActivityIdList = []
                trialActivityTitleList = []
                $.isLimit = false;
                // 获取tabList的，不知道有哪些的把这里的注释解开跑一遍就行了
                // await try_tabList();
                // return;
                $.isForbidden = false
                $.wrong = false
                size = 1
                while(trialActivityIdList.length < args_xh.maxLength && $.isForbidden === false){
                    if($.nowTabIdIndex === args_xh.tabId.length){
                        console.log(`tabId组已遍历完毕，不在获取商品\n`);
                        break;
                    } else {
                        await try_feedsList(args_xh.tabId[$.nowTabIdIndex], $.nowPage)  //获取对应tabId的试用页面
                    }
                    if(trialActivityIdList.length < args_xh.maxLength){
                        console.log(`间隔等待中，请等待 2 秒\n`)
                        await $.wait(2000);
                    }
                }
                if($.isForbidden === false && $.isLimit === false){
                    console.log(`稍后将执行试用申请，请等待 2 秒\n`)
                    await $.wait(2000);
                    for(let i = 0; i < trialActivityIdList.length && $.isLimit === false; i++){
                        if($.isLimit){
                            console.log("试用上限")
                            break
                        }
                        await try_apply(trialActivityTitleList[i], trialActivityIdList[i])
                        console.log(`间隔等待中，请等待 ${args_xh.applyInterval} ms\n`)
                        await $.wait(args_xh.applyInterval);
                    }
                    console.log("试用申请执行完毕...")
                    // await try_MyTrials(1, 1)    //申请中的商品
                    $.giveupNum = 0;
                    $.successNum = 0;
                    $.getNum = 0;
                    $.completeNum = 0;
                    await try_MyTrials(1, 2)    //申请成功的商品
                    // await try_MyTrials(1, 3)    //申请失败的商品
                    await showMsg()
                }
            }
            if($.isNode()){
                if($.index % args_xh.sendNum === 0){
                    $.sentNum++;
                    console.log(`正在进行第 ${$.sentNum} 次发送通知，发送数量：${args_xh.sendNum}`)
                    await $.notify.sendNotify(`${$.name}`, `${notifyMsg}`)
                    notifyMsg = "";
                }
            }
        }
        if($.isNode()){
            if(($.cookiesArr.length - ($.sentNum * args_xh.sendNum)) < args_xh.sendNum){
                console.log(`正在进行最后一次发送通知，发送数量：${($.cookiesArr.length - ($.sentNum * args_xh.sendNum))}`)
                await $.notify.sendNotify(`${$.name}`, `${notifyMsg}`)
                notifyMsg = "";
            }
        }
    } else {
        console.log(`\n您未设置运行【京东试用】脚本，结束运行！\n`)
    }
})().catch((e) => {
    console.error(`❗️ ${$.name} 运行错误！\n${e}`)
}).finally(() => $.done())

function requireConfig(){
    return new Promise(resolve => {
        console.log('开始获取配置文件\n')
        $.notify = $.isNode() ? require('./sendNotify') : { sendNotify: async() => { } }
        //获取 Cookies
        $.cookiesArr = []
        if($.isNode()){
            //Node.js用户请在jdCookie.js处填写京东ck;
            const jdCookieNode = require('./jdCookie.js');
            Object.keys(jdCookieNode).forEach((item) => {
                if(jdCookieNode[item]) $.cookiesArr.push(jdCookieNode[item])
            })
            if(process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
        } else {
            //IOS等用户直接用NobyDa的jd $.cookie
            $.cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
        }
        if(typeof process.env.JD_TRY_WHITELIST === "undefined") args_xh.whiteList = false;
        else args_xh.whiteList = process.env.JD_TRY_WHITELIST === 'true';
        if(typeof process.env.JD_TRY_PLOG === "undefined") args_xh.printLog = true;
        else args_xh.printLog = process.env.JD_TRY_PLOG === 'true';
        if(typeof process.env.JD_TRY_PASSZC === "undefined") args_xh.passZhongCao = true;
        else args_xh.passZhongCao = process.env.JD_TRY_PASSZC === 'true';
        for(let keyWord of $.innerKeyWords) args_xh.titleFilters.push(keyWord)
        console.log(`共${$.cookiesArr.length}个京东账号\n`)
        console.log('=====环境变量配置如下=====')
        console.log(`jdPrice: ${typeof args_xh.jdPrice}, ${args_xh.jdPrice}`)
        console.log(`tabId: ${typeof args_xh.tabId}, ${args_xh.tabId}`)
        console.log(`titleFilters: ${typeof args_xh.titleFilters}, ${args_xh.titleFilters}`)
        console.log(`trialPrice: ${typeof args_xh.trialPrice}, ${args_xh.trialPrice}`)
        console.log(`minSupplyNum: ${typeof args_xh.minSupplyNum}, ${args_xh.minSupplyNum}`)
        console.log(`applyNumFilter: ${typeof args_xh.applyNumFilter}, ${args_xh.applyNumFilter}`)
        console.log(`applyInterval: ${typeof args_xh.applyInterval}, ${args_xh.applyInterval}`)
        console.log(`maxLength: ${typeof args_xh.maxLength}, ${args_xh.maxLength}`)
        console.log(`passZhongCao: ${typeof args_xh.passZhongCao}, ${args_xh.passZhongCao}`)
        console.log(`printLog: ${typeof args_xh.printLog}, ${args_xh.printLog}`)
        console.log(`whiteList: ${typeof args_xh.whiteList}, ${args_xh.whiteList}`)
        console.log(`whiteListKeywords: ${typeof args_xh.whiteListKeywords}, ${args_xh.whiteListKeywords}`)
        console.log('=======================')
        resolve()
    })
}

//获取tabList的，如果不知道tabList有哪些，跑一遍这个function就行了
function try_tabList(){
    return new Promise((resolve, reject) => {
        console.log(`获取tabList中...`)
        const body = JSON.stringify({
            "previewTime": ""
        });
        let option = taskurl_xh('newtry', 'try_tabList', body)
        $.get(option, (err, resp, data) => {
            try{
                if(err){
                    if(JSON.stringify(err) === `\"Response code 403 (Forbidden)\"`){
                        $.isForbidden = true
                        console.log('账号被京东服务器风控，不再请求该帐号')
                    } else {
                        console.log(JSON.stringify(err))
                        console.log(`${$.name} API请求失败，请检查网路重试`)
                    }
                } else {
                    data = JSON.parse(data)
                    if(data.success){
                        for(let tabId of data.data.tabList) console.log(`${tabId.tabName} - ${tabId.tabId}`)
                    } else {
                        console.log("获取失败", data)
                    }
                }
            } catch(e){
                reject(`⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(data)}`)
            } finally{
                resolve()
            }
        })
    })
}

//获取商品列表并且过滤 By X1a0He
function try_feedsList(tabId, page){
    return new Promise((resolve, reject) => {
        const body = JSON.stringify({
            "tabId": `${tabId}`,
            "page": page,
            "previewTime": ""
        });
        let option = taskurl_xh('newtry', 'try_feedsList', body)
        $.get(option, (err, resp, data) => {
            try{
                if(err){
                    if(JSON.stringify(err) === `\"Response code 403 (Forbidden)\"`){
                        $.isForbidden = true
                        console.log('账号被京东服务器风控，不再请求该帐号')
                    } else {
                        console.log(JSON.stringify(err))
                        console.log(`${$.name} API请求失败，请检查网路重试`)
                    }
                } else {
                    data = JSON.parse(data)
                    let tempKeyword = ``;
                    if(data.success){
                        $.totalPages = data.data.pages
                        $.nowPage === $.totalPages ? $.nowPage = 1 : $.nowPage++;
                        console.log(`第 ${size++} 次获取试用商品成功，tabId:${args_xh.tabId[$.nowTabIdIndex]} 的 第 ${page}/${$.totalPages} 页`)
                        console.log(`获取到商品 ${data.data.feedList.length} 条`)
                        for(let item of data.data.feedList){
                            if(item.applyNum === null){
                                args_xh.printLog ? console.log(`商品未到申请时间：${item.skuTitle}\n`) : ''
                                continue
                            }
                            if(trialActivityIdList.length >= args_xh.maxLength){
                                console.log('商品列表长度已满.结束获取')
                                break
                            }
                            if(item.applyState === 1){
                                args_xh.printLog ? console.log(`商品已申请试用：${item.skuTitle}\n`) : ''
                                continue
                            }
                            if(item.applyState !== null){
                                args_xh.printLog ? console.log(`商品状态异常，未找到skuTitle\n`) : ''
                                continue
                            }
                            if(args_xh.passZhongCao){
                                $.isPush = true;
                                if(item.tagList.length !== 0){
                                    for(let itemTag of item.tagList){
                                        if(itemTag.tagType === 3){
                                            args_xh.printLog ? console.log('商品被过滤，该商品是种草官专属') : ''
                                            $.isPush = false;
                                            break;
                                        }
                                    }
                                }
                            }
                            if(item.skuTitle && $.isPush){
                                args_xh.printLog ? console.log(`检测 tabId:${args_xh.tabId[$.nowTabIdIndex]} 的 第 ${page}/${$.totalPages} 页 第 ${$.nowItem++ + 1} 个商品\n${item.skuTitle}`) : ''
                                if(args_xh.whiteList){
                                    if(args_xh.whiteListKeywords.some(fileter_word => item.skuTitle.includes(fileter_word))){
                                        args_xh.printLog ? console.log(`商品白名单通过，将加入试用组，trialActivityId为${item.trialActivityId}\n`) : ''
                                        trialActivityIdList.push(item.trialActivityId)
                                        trialActivityTitleList.push(item.skuTitle)
                                    }
                                } else {
                                    tempKeyword = ``;
                                    if(parseFloat(item.jdPrice) <= args_xh.jdPrice){
                                        args_xh.printLog ? console.log(`商品被过滤，${item.jdPrice} < ${args_xh.jdPrice} \n`) : ''
                                    } else if(parseFloat(item.supplyNum) < args_xh.minSupplyNum && item.supplyNum !== null){
                                        args_xh.printLog ? console.log(`商品被过滤，提供申请的份数小于预设申请的份数 \n`) : ''
                                    } else if(parseFloat(item.applyNum) > args_xh.applyNumFilter && item.applyNum !== null){
                                        args_xh.printLog ? console.log(`商品被过滤，已申请试用人数大于预设人数 \n`) : ''
                                    } else if(parseFloat(item.jdPrice) < args_xh.jdPrice){
                                        args_xh.printLog ? console.log(`商品被过滤，商品原价低于预设商品原价 \n`) : ''
                                    } else if(args_xh.titleFilters.some(fileter_word => item.skuTitle.includes(fileter_word) ? tempKeyword = fileter_word : '')){
                                        args_xh.printLog ? console.log(`商品被过滤，含有关键词 ${tempKeyword}\n`) : ''
                                    } else {
                                        args_xh.printLog ? console.log(`商品通过，将加入试用组，trialActivityId为${item.trialActivityId}\n`) : ''
                                        trialActivityIdList.push(item.trialActivityId)
                                        trialActivityTitleList.push(item.skuTitle)
                                    }
                                }
                            } else if($.isPush !== false){
                                console.error('skuTitle解析异常')
                                return
                            }
                        }
                        console.log(`当前试用组长度为：${trialActivityIdList.length}`)
                        args_xh.printLog ? console.log(`${trialActivityIdList}`) : ''
                        if(page === $.totalPages && $.nowTabIdIndex < args_xh.tabId.length){
                            //这个是因为每一个tab都会有对应的页数，获取完如果还不够的话，就获取下一个tab
                            $.nowTabIdIndex++;
                            $.nowPage = 1;
                            $.nowItem = 1;
                        }
                    } else {
                        console.log(`💩 获得试用列表失败: ${data.message}`)
                    }
                }
            } catch(e){
                reject(`⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(data)}`)
            } finally{
                resolve()
            }
        })
    })
}

function try_apply(title, activityId){
    return new Promise((resolve, reject) => {
        console.log(`申请试用商品提交中...`)
        args_xh.printLog ? console.log(`商品：${title}`) : ''
        args_xh.printLog ? console.log(`id为：${activityId}`) : ''
        const body = JSON.stringify({
            "activityId": activityId,
            "previewTime": ""
        });
        let option = taskurl_xh('newtry', 'try_apply', body)
        $.get(option, (err, resp, data) => {
            try{
                if(err){
                    if(JSON.stringify(err) === `\"Response code 403 (Forbidden)\"`){
                        $.isForbidden = true
                        console.log('账号被京东服务器风控，不再请求该帐号')
                    } else {
                        console.log(JSON.stringify(err))
                        console.log(`${$.name} API请求失败，请检查网路重试`)
                    }
                } else {
                    $.totalTry++
                    data = JSON.parse(data)
                    if(data.success && data.code === "1"){  // 申请成功
                        console.log("申请提交成功")
                        $.totalSuccess++
                    } else if(data.code === "-106"){
                        console.log(data.message)   // 未在申请时间内！
                    } else if(data.code === "-110"){
                        console.log(data.message)   // 您的申请已成功提交，请勿重复申请…
                    } else if(data.code === "-120"){
                        console.log(data.message)   // 您还不是会员，本品只限会员申请试用，请注册会员后申请！
                    } else if(data.code === "-167"){
                        console.log(data.message)   // 抱歉，此试用需为种草官才能申请。查看下方详情了解更多。
                    } else if(data.code === "-131"){
                        console.log(data.message)   // 申请次数上限。
                        $.isLimit = true;
                    } else if(data.code === "-113"){
                        console.log(data.message)   // 操作不要太快哦！
                    } else {
                        console.log("申请失败", data)
                    }
                }
            } catch(e){
                reject(`⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(data)}`)
            } finally{
                resolve()
            }
        })
    })
}

function try_MyTrials(page, selected){
    return new Promise((resolve, reject) => {
        switch(selected){
            case 1:
                console.log('正在获取已申请的商品...')
                break;
            case 2:
                console.log('正在获取申请成功的商品...')
                break;
            case 3:
                console.log('正在获取申请失败的商品...')
                break;
            default:
                console.log('selected错误')
        }
        const body = JSON.stringify({
            "page": page,
            "selected": selected,   // 1 - 已申请 2 - 成功列表，3 - 失败列表
            "previewTime": ""
        });
        let option = taskurl_xh('newtry', 'try_MyTrials', body)
        option.headers.Referer = 'https://pro.m.jd.com/'
        $.get(option, (err, resp, data) => {
            try{
                if(err){
                    console.log(`🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(err)}`)
                } else {
                    data = JSON.parse(data)
                    if(data.success){
                        //temp adjustment
                        if(selected === 2){
                            if(data.success && data.data){
                                for(let item of data.data.list){
                                    item.status === 4 || item.text.text.includes('已放弃') ? $.giveupNum += 1 : ''
                                    item.status === 2 && item.text.text.includes('试用资格将保留') ? $.successNum += 1 : ''
                                    item.status === 2 && item.text.text.includes('请收货后尽快提交报告') ? $.getNum += 1 : ''
                                    item.status === 2 && item.text.text.includes('试用已完成') ? $.completeNum += 1 : ''
                                }
                                console.log(`待领取 | 已领取 | 已完成 | 已放弃：${$.successNum} | ${$.getNum} | ${$.completeNum} | ${$.giveupNum}`)
                            } else {
                                console.log(`获得成功列表失败: ${data.message}`)
                            }
                        }
                    } else {
                        console.error(`ERROR:try_MyTrials`)
                    }
                }
            } catch(e){
                reject(`⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(data)}`)
            } finally{
                resolve()
            }
        })
    })
}

function taskurl_xh(appid, functionId, body = JSON.stringify({})){
    return {
        "url": `${URL}?appid=${appid}&functionId=${functionId}&clientVersion=10.1.2&client=wh5&body=${encodeURIComponent(body)}`,
        'headers': {
            'Host': 'api.m.jd.com',
            'Accept-Encoding': 'gzip, deflate, br',
            'Cookie': $.cookie,
            'Connection': 'keep-alive',
            'UserAgent': 'jdapp;iPhone;10.1.2;15.0;ff2caa92a8529e4788a34b3d8d4df66d9573f499;network/wifi;model/iPhone13,4;addressid/2074196292;appBuild/167802;jdSupportDarkMode/1;Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
            'Accept-Language': 'zh-cn',
            'Referer': 'https://prodev.m.jd.com/'
        },
    }
}

async function showMsg(){
    let message = ``;
    message += `👤 京东账号${$.index} ${$.nickName || $.UserName}\n`;
    if($.totalSuccess !== 0 && $.totalTry !== 0){
        message += `🎉 本次提交申请：${$.totalSuccess}/${$.totalTry}个商品🛒\n`;
        message += `🎉 ${$.successNum}个商品待领取\n`;
        message += `🎉 ${$.getNum}个商品已领取\n`;
        message += `🎉 ${$.completeNum}个商品已完成\n`;
        message += `🗑 ${$.giveupNum}个商品已放弃\n\n`;
    } else {
        message += `⚠️ 本次执行没有申请试用商品\n`;
        message += `🎉 ${$.successNum}个商品待领取\n`;
        message += `🎉 ${$.getNum}个商品已领取\n`;
        message += `🎉 ${$.completeNum}个商品已完成\n`;
        message += `🗑 ${$.giveupNum}个商品已放弃\n\n`;
    }
    if(!args_xh.jdNotify || args_xh.jdNotify === 'false'){
        $.msg($.name, ``, message, {
            "open-url": 'https://try.m.jd.com/user'
        })
        if($.isNode())
            notifyMsg += `${message}`
    } else {
        console.log(message)
    }
}

function totalBean(){
    return new Promise(async resolve => {
        const options = {
            "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
            "headers": {
                "Accept": "application/json,text/plain, */*",
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-cn",
                "Connection": "keep-alive",
                "Cookie": $.cookie,
                "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            },
            "timeout": 10000,
        }
        $.post(options, (err, resp, data) => {
            try{
                if(err){
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if(data){
                        data = JSON.parse(data);
                        if(data['retcode'] === 13){
                            $.isLogin = false; //cookie过期
                            return
                        }
                        if(data['retcode'] === 0){
                            $.nickName = (data['base'] && data['base'].nickname) || $.UserName;
                        } else {
                            $.nickName = $.UserName
                        }
                    } else {
                        console.log(`京东服务器返回空数据`)
                    }
                }
            } catch(e){
                $.logErr(e, resp)
            } finally{
                resolve();
            }
        })
    })
}

function jsonParse(str){
    if(typeof str == "string"){
        try{
            return JSON.parse(str);
        } catch(e){
            console.log(e);
            $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
            return [];
        }
    }
}

function Env(name, opts){
    class Http{
        constructor(env){
            this.env = env
        }

        send(opts, method = 'GET'){
            opts = typeof opts === 'string' ? {
                url: opts
            } : opts
            let sender = this.get
            if(method === 'POST'){
                sender = this.post
            }
            return new Promise((resolve, reject) => {
                sender.call(this, opts, (err, resp, body) => {
                    if(err) reject(err)
                    else resolve(resp)
                })
            })
        }

        get(opts){
            return this.send.call(this.env, opts)
        }

        post(opts){
            return this.send.call(this.env, opts, 'POST')
        }
    }

    return new (class{
        constructor(name, opts){
            this.name = name
            this.http = new Http(this)
            this.data = null
            this.dataFile = 'box.dat'
            this.logs = []
            this.isMute = false
            this.isNeedRewrite = false
            this.logSeparator = '\n'
            this.startTime = new Date().getTime()
            Object.assign(this, opts)
            this.log('', `🔔${this.name}, 开始!`)
        }

        isNode(){
            return 'undefined' !== typeof module && !!module.exports
        }

        isQuanX(){
            return 'undefined' !== typeof $task
        }

        isSurge(){
            return 'undefined' !== typeof $httpClient && 'undefined' === typeof $loon
        }

        isLoon(){
            return 'undefined' !== typeof $loon
        }

        toObj(str, defaultValue = null){
            try{
                return JSON.parse(str)
            } catch{
                return defaultValue
            }
        }

        toStr(obj, defaultValue = null){
            try{
                return JSON.stringify(obj)
            } catch{
                return defaultValue
            }
        }

        getjson(key, defaultValue){
            let json = defaultValue
            const val = this.getdata(key)
            if(val){
                try{
                    json = JSON.parse(this.getdata(key))
                } catch{ }
            }
            return json
        }

        setjson(val, key){
            try{
                return this.setdata(JSON.stringify(val), key)
            } catch{
                return false
            }
        }

        getScript(url){
            return new Promise((resolve) => {
                this.get({
                    url
                }, (err, resp, body) => resolve(body))
            })
        }

        runScript(script, runOpts){
            return new Promise((resolve) => {
                let httpapi = this.getdata('@chavy_boxjs_userCfgs.httpapi')
                httpapi = httpapi ? httpapi.replace(/\n/g, '').trim() : httpapi
                let httpapi_timeout = this.getdata('@chavy_boxjs_userCfgs.httpapi_timeout')
                httpapi_timeout = httpapi_timeout ? httpapi_timeout * 1 : 20
                httpapi_timeout = runOpts && runOpts.timeout ? runOpts.timeout : httpapi_timeout
                const [key, addr] = httpapi.split('@')
                const opts = {
                    url: `http://${addr}/v1/scripting/evaluate`,
                    body: {
                        script_text: script,
                        mock_type: 'cron',
                        timeout: httpapi_timeout
                    },
                    headers: {
                        'X-Key': key,
                        'Accept': '*/*'
                    }
                }
                this.post(opts, (err, resp, body) => resolve(body))
            }).catch((e) => this.logErr(e))
        }

        loaddata(){
            if(this.isNode()){
                this.fs = this.fs ? this.fs : require('fs')
                this.path = this.path ? this.path : require('path')
                const curDirDataFilePath = this.path.resolve(this.dataFile)
                const rootDirDataFilePath = this.path.resolve(process.cwd(), this.dataFile)
                const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
                const isRootDirDataFile = !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
                if(isCurDirDataFile || isRootDirDataFile){
                    const datPath = isCurDirDataFile ? curDirDataFilePath : rootDirDataFilePath
                    try{
                        return JSON.parse(this.fs.readFileSync(datPath))
                    } catch(e){
                        return {}
                    }
                } else return {}
            } else return {}
        }

        writedata(){
            if(this.isNode()){
                this.fs = this.fs ? this.fs : require('fs')
                this.path = this.path ? this.path : require('path')
                const curDirDataFilePath = this.path.resolve(this.dataFile)
                const rootDirDataFilePath = this.path.resolve(process.cwd(), this.dataFile)
                const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
                const isRootDirDataFile = !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
                const jsondata = JSON.stringify(this.data)
                if(isCurDirDataFile){
                    this.fs.writeFileSync(curDirDataFilePath, jsondata)
                } else if(isRootDirDataFile){
                    this.fs.writeFileSync(rootDirDataFilePath, jsondata)
                } else {
                    this.fs.writeFileSync(curDirDataFilePath, jsondata)
                }
            }
        }

        lodash_get(source, path, defaultValue = undefined){
            const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.')
            let result = source
            for(const p of paths){
                result = Object(result)[p]
                if(result === undefined){
                    return defaultValue
                }
            }
            return result
        }

        lodash_set(obj, path, value){
            if(Object(obj) !== obj) return obj
            if(!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || []
            path.slice(0, -1).reduce((a, c, i) => (Object(a[c]) === a[c] ? a[c] : (a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1] ? [] : {})), obj)[
                path[path.length - 1]
                ] = value
            return obj
        }

        getdata(key){
            let val = this.getval(key)
            // 如果以 @
            if(/^@/.test(key)){
                const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key)
                const objval = objkey ? this.getval(objkey) : ''
                if(objval){
                    try{
                        const objedval = JSON.parse(objval)
                        val = objedval ? this.lodash_get(objedval, paths, '') : val
                    } catch(e){
                        val = ''
                    }
                }
            }
            return val
        }

        setdata(val, key){
            let issuc = false
            if(/^@/.test(key)){
                const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key)
                const objdat = this.getval(objkey)
                const objval = objkey ? (objdat === 'null' ? null : objdat || '{}') : '{}'
                try{
                    const objedval = JSON.parse(objval)
                    this.lodash_set(objedval, paths, val)
                    issuc = this.setval(JSON.stringify(objedval), objkey)
                } catch(e){
                    const objedval = {}
                    this.lodash_set(objedval, paths, val)
                    issuc = this.setval(JSON.stringify(objedval), objkey)
                }
            } else {
                issuc = this.setval(val, key)
            }
            return issuc
        }

        getval(key){
            if(this.isSurge() || this.isLoon()){
                return $persistentStore.read(key)
            } else if(this.isQuanX()){
                return $prefs.valueForKey(key)
            } else if(this.isNode()){
                this.data = this.loaddata()
                return this.data[key]
            } else {
                return (this.data && this.data[key]) || null
            }
        }

        setval(val, key){
            if(this.isSurge() || this.isLoon()){
                return $persistentStore.write(val, key)
            } else if(this.isQuanX()){
                return $prefs.setValueForKey(val, key)
            } else if(this.isNode()){
                this.data = this.loaddata()
                this.data[key] = val
                this.writedata()
                return true
            } else {
                return (this.data && this.data[key]) || null
            }
        }

        initGotEnv(opts){
            this.got = this.got ? this.got : require('got')
            this.cktough = this.cktough ? this.cktough : require('tough-cookie')
            this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()
            if(opts){
                opts.headers = opts.headers ? opts.headers : {}
                if(undefined === opts.headers.Cookie && undefined === opts.cookieJar){
                    opts.cookieJar = this.ckjar
                }
            }
        }

        get(opts, callback = () => { }){
            if(opts.headers){
                delete opts.headers['Content-Type']
                delete opts.headers['Content-Length']
            }
            if(this.isSurge() || this.isLoon()){
                if(this.isSurge() && this.isNeedRewrite){
                    opts.headers = opts.headers || {}
                    Object.assign(opts.headers, {
                        'X-Surge-Skip-Scripting': false
                    })
                }
                $httpClient.get(opts, (err, resp, body) => {
                    if(!err && resp){
                        resp.body = body
                        resp.statusCode = resp.status
                    }
                    callback(err, resp, body)
                })
            } else if(this.isQuanX()){
                if(this.isNeedRewrite){
                    opts.opts = opts.opts || {}
                    Object.assign(opts.opts, {
                        hints: false
                    })
                }
                $task.fetch(opts).then(
                    (resp) => {
                        const {
                            statusCode: status,
                            statusCode,
                            headers,
                            body
                        } = resp
                        callback(null, {
                            status,
                            statusCode,
                            headers,
                            body
                        }, body)
                    },
                    (err) => callback(err)
                )
            } else if(this.isNode()){
                this.initGotEnv(opts)
                this.got(opts).on('redirect', (resp, nextOpts) => {
                    try{
                        if(resp.headers['set-cookie']){
                            const ck = resp.headers['set-cookie'].map(this.cktough.Cookie.parse).toString()
                            if(ck){
                                this.ckjar.setCookieSync(ck, null)
                            }
                            nextOpts.cookieJar = this.ckjar
                        }
                    } catch(e){
                        this.logErr(e)
                    }
                    // this.ckjar.setCookieSync(resp.headers['set-cookie'].map(Cookie.parse).toString())
                }).then(
                    (resp) => {
                        const {
                            statusCode: status,
                            statusCode,
                            headers,
                            body
                        } = resp
                        callback(null, {
                            status,
                            statusCode,
                            headers,
                            body
                        }, body)
                    },
                    (err) => {
                        const {
                            message: error,
                            response: resp
                        } = err
                        callback(error, resp, resp && resp.body)
                    }
                )
            }
        }

        post(opts, callback = () => { }){
            // 如果指定了请求体, 但没指定`Content-Type`, 则自动生成
            if(opts.body && opts.headers && !opts.headers['Content-Type']){
                opts.headers['Content-Type'] = 'application/x-www-form-urlencoded'
            }
            if(opts.headers) delete opts.headers['Content-Length']
            if(this.isSurge() || this.isLoon()){
                if(this.isSurge() && this.isNeedRewrite){
                    opts.headers = opts.headers || {}
                    Object.assign(opts.headers, {
                        'X-Surge-Skip-Scripting': false
                    })
                }
                $httpClient.post(opts, (err, resp, body) => {
                    if(!err && resp){
                        resp.body = body
                        resp.statusCode = resp.status
                    }
                    callback(err, resp, body)
                })
            } else if(this.isQuanX()){
                opts.method = 'POST'
                if(this.isNeedRewrite){
                    opts.opts = opts.opts || {}
                    Object.assign(opts.opts, {
                        hints: false
                    })
                }
                $task.fetch(opts).then(
                    (resp) => {
                        const {
                            statusCode: status,
                            statusCode,
                            headers,
                            body
                        } = resp
                        callback(null, {
                            status,
                            statusCode,
                            headers,
                            body
                        }, body)
                    },
                    (err) => callback(err)
                )
            } else if(this.isNode()){
                this.initGotEnv(opts)
                const {
                    url,
                    ..._opts
                } = opts
                this.got.post(url, _opts).then(
                    (resp) => {
                        const {
                            statusCode: status,
                            statusCode,
                            headers,
                            body
                        } = resp
                        callback(null, {
                            status,
                            statusCode,
                            headers,
                            body
                        }, body)
                    },
                    (err) => {
                        const {
                            message: error,
                            response: resp
                        } = err
                        callback(error, resp, resp && resp.body)
                    }
                )
            }
        }

        /**
         *
         * 示例:$.time('yyyy-MM-dd qq HH:mm:ss.S')
         *    :$.time('yyyyMMddHHmmssS')
         *    y:年 M:月 d:日 q:季 H:时 m:分 s:秒 S:毫秒
         *    其中y可选0-4位占位符、S可选0-1位占位符，其余可选0-2位占位符
         * @param {*} fmt 格式化参数
         *
         */
        time(fmt){
            let o = {
                'M+': new Date().getMonth() + 1,
                'd+': new Date().getDate(),
                'H+': new Date().getHours(),
                'm+': new Date().getMinutes(),
                's+': new Date().getSeconds(),
                'q+': Math.floor((new Date().getMonth() + 3) / 3),
                'S': new Date().getMilliseconds()
            }
            if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (new Date().getFullYear() + '').substr(4 - RegExp.$1.length))
            for(let k in o)
                if(new RegExp('(' + k + ')').test(fmt))
                    fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
            return fmt
        }

        /**
         * 系统通知
         *
         * > 通知参数: 同时支持 QuanX 和 Loon 两种格式, EnvJs根据运行环境自动转换, Surge 环境不支持多媒体通知
         *
         * 示例:
         * $.msg(title, subt, desc, 'twitter://')
         * $.msg(title, subt, desc, { 'open-url': 'twitter://', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
         * $.msg(title, subt, desc, { 'open-url': 'https://bing.com', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
         *
         * @param {*} title 标题
         * @param {*} subt 副标题
         * @param {*} desc 通知详情
         * @param {*} opts 通知参数
         *
         */
        msg(title = name, subt = '', desc = '', opts){
            const toEnvOpts = (rawopts) => {
                if(!rawopts) return rawopts
                if(typeof rawopts === 'string'){
                    if(this.isLoon()) return rawopts
                    else if(this.isQuanX()) return {
                        'open-url': rawopts
                    }
                    else if(this.isSurge()) return {
                        url: rawopts
                    }
                    else return undefined
                } else if(typeof rawopts === 'object'){
                    if(this.isLoon()){
                        let openUrl = rawopts.openUrl || rawopts.url || rawopts['open-url']
                        let mediaUrl = rawopts.mediaUrl || rawopts['media-url']
                        return {
                            openUrl,
                            mediaUrl
                        }
                    } else if(this.isQuanX()){
                        let openUrl = rawopts['open-url'] || rawopts.url || rawopts.openUrl
                        let mediaUrl = rawopts['media-url'] || rawopts.mediaUrl
                        return {
                            'open-url': openUrl,
                            'media-url': mediaUrl
                        }
                    } else if(this.isSurge()){
                        let openUrl = rawopts.url || rawopts.openUrl || rawopts['open-url']
                        return {
                            url: openUrl
                        }
                    }
                } else {
                    return undefined
                }
            }
            if(!this.isMute){
                if(this.isSurge() || this.isLoon()){
                    $notification.post(title, subt, desc, toEnvOpts(opts))
                } else if(this.isQuanX()){
                    $notify(title, subt, desc, toEnvOpts(opts))
                }
            }
            if(!this.isMuteLog){
                let logs = ['', '==============📣系统通知📣==============']
                logs.push(title)
                subt ? logs.push(subt) : ''
                desc ? logs.push(desc) : ''
                console.log(logs.join('\n'))
                this.logs = this.logs.concat(logs)
            }
        }

        log(...logs){
            if(logs.length > 0){
                this.logs = [...this.logs, ...logs]
            }
            console.log(logs.join(this.logSeparator))
        }

        logErr(err, msg){
            const isPrintSack = !this.isSurge() && !this.isQuanX() && !this.isLoon()
            if(!isPrintSack){
                this.log('', `❗️${this.name}, 错误!`, err)
            } else {
                this.log('', `❗️${this.name}, 错误!`, err.stack)
            }
        }

        wait(time){
            return new Promise((resolve) => setTimeout(resolve, time))
        }

        done(val = {}){
            const endTime = new Date().getTime()
            const costTime = (endTime - this.startTime) / 1000
            this.log('', `🔔${this.name}, 结束! 🕛 ${costTime} 秒`)
            this.log()
            if(this.isSurge() || this.isQuanX() || this.isLoon()){
                $done(val)
            }
        }
    })(name, opts)
}
