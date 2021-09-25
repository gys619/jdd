/*

30 10 * * * jd_try.js

*/
const $ = new Env('京东试用')

const selfDomain = 'https://https://prodev.m.jd.com/mall/active/G7sQ92vWSBsTHzk4e953qUGWQJ4'
let allGoodList = []
let notifyMsg = ''

// default params
const args = {
	// 是否通知
	jdNotify: false,
	// 每次获取商品数量
	pageSize: 12,
	// 试用商铺类型
	cidsList: ["家用电器", "手机数码", "电脑办公", "家居家装"],
	// 试用类型
	typeList: ["普通试用", "闪电试用"],
	// 商品过滤关键字
	goodFilters: "教程@软件@英语@辅导@培训@表带@皮带@瑜伽垫@水饺@燕窝@高钙奶@纯牛奶@树苗@集体课@现场课@奶粉@看房游@口服液@灸贴@云南旅游@掌之友@金满缘@新兴港隆@拆机@品鉴@试饮@咨询@零基础@直播课@体验@网课@训练营@礼品袋@装修@快狐@疣@包皮@疏通@药@鱼胶@狗狗@幼犬@戒烟@尿垫@浪潮英信@专家@长高课@饲料@代办@美缝剂@体验@遮瑕@洗面奶@洁面乳@抗皱@膏@猫砂@购房@消食@积食@软胶囊@养生茶@驼背@房产@辅食@打印纸@财务管理@进销存@实战@生发液@早泄@阳痿@染发@补血@珍珠粉@玛咖@灰指甲@阿胶@维生素@同仁堂@讲堂@教材@补肾@精品课@开发@疹@疮@疥@软膏@真题@模拟题@专车接送@看海@看房@学员@投资@通关@名师@节课@酵素@滴眼液@全国流量@奶粉@香皂@精油@爱犬@课程@教学@教程@猫人@学车@你拍一@手机壳@益生菌@宠物@会计@考试@职称@漱口水@吊坠@胶原蛋白@鲜花@蛋白粉@降血糖@降血脂@降血压@管理系统@收银系统@体检@检查@减肥@玫瑰花@股票@丰胸@避孕套@保湿@补水@粉底@口红@耳钉@耳环@耳坠@收纳盒@大王卡@管理软件@博仑帅@荧光笔@原子笔@月租@上网卡@不限流量@日租卡@洗车机@热水袋@钥匙扣@饼干@甲醛检测@贴膜@美容器@拖鞋@桨叶@烫发@清洁套装@鼠标垫@数据线@硒鼓@壁纸@防晒霜@护手霜@面霜@添加剂@修复@祛疤@精华液@玻尿酸@挂画@壁画@精华水@润滑油@机油@普洱茶@吸奶器@吸顶灯@爽肤水@面膜@冰箱底座@胶漆@小靓美@洁面扑@内衣@胸罩@文胸@卷尺@种子@档案袋@塑料袋@垃圾袋@癣@脚气@阴道@生殖器@肛门@狐臭@老太太@妇女@私处@孕妇@卫生巾@卫生条@培训@洋娃娃@男孩玩具@女孩玩具@益智@女性内衣@女性内裤@女内裤@女内衣@女孩@三角裤@鱼饵@钓鱼@尿杯@安全座椅@玩具@娃娃@网课@课程@辅导@网校@电商@车载充电器@网络课程@美少女@纸尿裤@英语@俄语@四级@六级@四六级@在线网络@在线@阴道炎@宫颈@糜烂@喷剂@飞机杯@手机膜@钢化膜@水凝膜@手机壳@手机支架@钢化膜@猫粮@狗粮@戒指@手链@项链@手镯@牙刷@加湿器@水垢@喷雾@茶叶@净水壶@眼霜@香水@墨盒@墨水@墨粉@颜料@中性笔@钢笔@马克笔@震动棒@自慰器@延时@触媒".split('@'),
	// 商品最低价格
	minPrice: 70,
	// 商品提供最多的数量
	maxSupplyCount: 10,
	// 商品试用之间的间隔, 单位：毫秒，随机间隔[applyInterval, applyInterval+2000]
	applyInterval: 5000
}

const cidsMap = {
	"全部商品": "0",
	"家用电器": "737",
	"手机数码": "652,9987",
	"电脑办公": "670",
	"家居家装": "1620,6728,9847,9855,6196,15248,14065",
	"美妆护肤": "1316",
	"服饰鞋包": "1315,1672,1318,11729",
	"母婴玩具": "1319,6233",
	"生鲜美食": "12218",
	"图书音像": "1713,4051,4052,4053,7191,7192,5272",
	"钟表奢品": "5025,6144",
	"个人护理": "16750",
	"家庭清洁": "15901",
	"食品饮料": "1320,12259",
	"更多惊喜": "4938,13314,6994,9192,12473,6196,5272,12379,13678,15083,15126,15980",
}
const typeMap = {
	"全部试用": "0",
	"普通试用": "1",
	"闪电试用": "3",
	"30天试用": "5",
}

!(async () => {
	await requireConfig()
	if (!$.cookiesArr[0]) {
		$.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
			"open-url": "https://bean.m.jd.com/"
		})
		return
	}
	for (let i = 0; i < $.cookiesArr.length; i++) {
			if ($.cookiesArr[i]) {
			$.cookie = $.cookiesArr[i];
			$.UserName = decodeURIComponent($.cookie.match(/pt_pin=(.+?);/) && $.cookie.match(/pt_pin=(.+?);/)[1])
			$.index = i + 1;
			$.isLogin = true;
			$.nickName = '';
			await totalBean();
			console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
			if (!$.isLogin) {
				$.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
					"open-url": "https://bean.m.jd.com/bean/signIndex.action"
				});
				await $.notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
				continue
			}

			$.goodList = []
			$.successList = []
			if (allGoodList.length == 0) {
				for (let ii=0;ii<5;ii++ ){
                try{await getGoodList()
				filterGoodList()
                await $.wait(Math.floor(Math.random() * 20000 + args.applyInterval))
                break
                } catch (e){
                    if (ii>5){
                    console.log('请在其它时间重试') 
                    break   
                    }
                    console.log('接口TMD不稳定，重试ing')
                }}
			}
			for(let ii=0;ii<5;ii++ ){
            try{await getApplyStateByActivityIds()
                break
            } catch(e){if (ii>5){
                console.log('请在其它时间重试') 
                break   
                }
                console.log('接口TMD不稳定，重试ing')
            }
            }

			$.totalTry = 0
			$.totalGoods = $.goodList.length
			for(let ii=0;ii<5;ii++ ){
			try{await tryGoodList()
				break
			} catch (e) {
				if (ii>5){
					console.log('请在其它时间重试') 
					break   
					}
					console.log('接口TMD不稳定，重试ing')
						} 
			}
			for(let ii=0;ii<5;ii++ ){
			try{
            await getSuccessList()
			break
            } catch(e){
				if (ii>5){
					console.log('请在其它时间重试') 
					break   
					}
					console.log('接口又TMD不稳定，重试ing')
						}   
            }
			
			try{await showMsg()
                } catch(e){console.log('TMD显示结果也不稳定')}
		}
		
	
	}
    try{
	await $.notify.sendNotify(`${$.name}`, notifyMsg);} catch(e){console.log('发个信息而已也失败了。。。')}
})()
	.catch((e) => {
		console.log(`❗️ ${$.name} 运行错误！\n`)
	})

function requireConfig() {
	return new Promise(resolve => {
		console.log('开始获取配置文件\n')
		$.notify = $.isNode() ? require('./sendNotify') : { sendNotify: async () => { } }

		//获取 Cookies
		$.cookiesArr = []
		if ($.isNode()) {
			//Node.js用户请在jdCookie.js处填写京东ck;
			const jdCookieNode = require('./jdCookie.js');
			Object.keys(jdCookieNode).forEach((item) => {
				if (jdCookieNode[item]) {
					$.cookiesArr.push(jdCookieNode[item])
				}
			})
			if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
		} else {
			//IOS等用户直接用NobyDa的jd $.cookie
			$.cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
		}
		console.log(`共${$.cookiesArr.length}个京东账号\n`)

		if ($.isNode()) {
			if (process.env.JD_TRY_CIDS_KEYS) {
				args.cidsList = process.env.JD_TRY_CIDS_KEYS.split('@').filter(key => {
					return Object.keys(cidsMap).includes(key)
				})
			}
			if (process.env.JD_TRY_TYPE_KEYS) {
				args.typeList = process.env.JD_TRY_TYPE_KEYS.split('@').filter(key => {
					return Object.keys(typeMap).includes(key)
				})
			}
			if (process.env.JD_TRY_GOOD_FILTERS) {
				args.goodFilters = process.env.JD_TRY_GOOD_FILTERS.split('@')
			}
			if (process.env.JD_TRY_MIN_PRICE) {
				args.minPrice = process.env.JD_TRY_MIN_PRICE * 1
			}
			if (process.env.JD_TRY_PAGE_SIZE) {
				args.pageSize = process.env.JD_TRY_PAGE_SIZE * 1
			}
			if (process.env.JD_TRY_MAX_SUPPLY_COUNT) {
				args.maxSupplyCount = process.env.JD_TRY_MAX_SUPPLY_COUNT * 1
			}
		} else {
			let qxCidsList = []
			let qxTypeList = []
			const cidsKeys = Object.keys(cidsMap)
			const typeKeys = Object.keys(typeMap)
			for (let key of cidsKeys) {
				const open = $.getdata(key)
				if (open == 'true') qxCidsList.push(key)
			}
			for (let key of typeKeys) {
				const open = $.getdata(key)
				if (open == 'true') qxTypeList.push(key)
			}
			if (qxCidsList.length != 0) args.cidsList = qxCidsList
			if (qxTypeList.length != 0) args.typeList = qxTypeList
			if ($.getdata('filter')) args.goodFilters = $.getdata('filter').split('@')
			if ($.getdata('min_price')) args.minPrice = Number($.getdata('min_price'))
			if ($.getdata('page_size')) args.pageSize = Number($.getdata('page_size'))
			if ($.getdata('max_supply_count')) args.maxSupplyCount = Number($.getdata('max_supply_count'))
			if (args.pageSize == 0) args.pageSize = 12
		}
		resolve()
	})
}

function getGoodListByCond(cids, page, pageSize, type, state) {
	return new Promise((resolve, reject) => {
		let option = taskurl(`${selfDomain}/activity/list?pb=1&cids=${cids}&page=${page}&pageSize=${pageSize}&type=${type}&state=${state}`)
		delete option.headers['Cookie']
		$.get(option, (err, resp, data) => {
			try {
				if (err) {
					console.log(`🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(err)}`)
				} else {
					data = JSON.parse(data)
					if (data.success) {
						$.totalPages = data.data.pages
						allGoodList = allGoodList.concat(data.data.data)
					} else {
						console.log(`💩 获得 ${cids} ${page} 列表失败: ${data.message}`)
					}
				}
			} catch (e) {
				console.log('接口神经病发作了')
				reject(`⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(data)}`)
			} finally {
				resolve()
			}
		})
	})
}

async function getGoodList() {
	if (args.cidsList.length === 0) args.cidsList.push("全部商品")
	if (args.typeList.length === 0) args.typeList.push("全部试用")
	for (let cidsKey of args.cidsList) {
		for (let typeKey of args.typeList) {
			if (!cidsMap.hasOwnProperty(cidsKey) || !typeMap.hasOwnProperty(typeKey)) continue
			console.log(`⏰ 获取 ${cidsKey} ${typeKey} 商品列表`)
			$.totalPages = 1
			for (let page = 1; page <= $.totalPages; page++) {
				await getGoodListByCond(cidsMap[cidsKey], page, args.pageSize, typeMap[typeKey], '0')
				
			}
		}
	}
}

function filterGoodList() {
	console.log(`⏰ 过滤商品列表，当前共有${allGoodList.length}个商品`)
	const now = Date.now()
	const oneMoreDay = now + 2 * 24 * 60 * 60 * 1000
	allGoodList = allGoodList.filter(good => {
		// 1. good 有问题
		// 2. good 距离结束不到10min
		// 3. good 的结束时间大于两天
		// 4. good 的价格小于最小的限制
		// 5. good 的试用数量大于 maxSupplyCount, 视为垃圾商品
		if (!good || good.endTime < now + 10 * 60 * 1000 || good.endTime > oneMoreDay || good.jdPrice < args.minPrice) {
			return false
		}
		for (let item of args.goodFilters) {
			if (good.trialName.indexOf(item) != -1) return false
		}
		if (good.supplyCount > args.maxSupplyCount) {
			return false
		}
		return true
	})
	allGoodList = allGoodList.sort((a, b) => {
		let endDayA = Math.trunc(a.endTime / (1000 * 3600 * 24))
		let endDayB = Math.trunc(b.endTime / (1000 * 3600 * 24))
		if (endDayA != endDayB) {
			return endDayB - endDayA
		}
		if (a.activityType != b.activityType) {
			return b.activityType - a.activityType
		}
		return b.jdPrice - a.jdPrice
	})
}

async function getApplyStateByActivityIds() {
	function opt(list) {
		let ids = []
		list.forEach(good => ids.push(good.id))
		return new Promise((resolve, reject) => {
			$.get(taskurl(`${selfDomain}/getApplyStateByActivityIds?activityIds=${ids.join(',')}`), (err, resp, data) => {
				try {
					if (err) {
						console.log(`🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(err)}`)
					} else {
						data = JSON.parse(data)
						ids.length = 0
						for (let apply of data) ids.push(apply.activityId)
					}
				} catch (e) {
					reject(`⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(data)}`)
				} finally {
					resolve(ids)
				}
			})
		})
	}

	$.goodList = []
	for (let start = 0, end = args.pageSize; start < allGoodList.length; start = end, end += args.pageSize) {
		let list = allGoodList.slice(start, end)
		let applied = await opt(list)
		$.goodList = $.goodList.concat(list.filter(good => {
			for (let id of applied) {
				if (id == good.id) {
					return false
				}
			}
			return true
		}))
		if ($.goodList.length >= 350) break
	}
}

function canTry(good) {
	return new Promise((resolve, reject) => {
		let ret = false
		$.get(taskurl(`${selfDomain}/activity?id=${good.id}`), (err, resp, data) => {
			try {
				if (err) {
					console.log(`🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(err)}`)
				} else {
					ret = data.indexOf('trySku') != -1
					let result = data.match(/"shopId":(\d+)/)
					if (result) {
						good.shopId = eval(result[1])
					}
				}
			} catch (e) {
				reject(`⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(data)}`)
			} finally {
				resolve(ret)
			}
		})
	})
}

function isFollowed(good) {
	return new Promise((resolve, reject) => {
		$.get(taskurl(`${selfDomain}/isFollowed?id=${good.shopId}`, good.id), (err, resp, data) => {
			try {
				if (err) {
					console.log(`🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(err)}`)
				} else {
					data = JSON.parse(data)
					resolve(data.success && data.data)
				}
			} catch (e) {
				reject(`⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(data)}`)
			} finally {
				resolve(false)
			}
		})
	})
}

function followShop(good) {
	return new Promise((resolve, reject) => {
		$.get(taskurl(`${selfDomain}/followShop?id=${good.shopId}`, good.id), (err, resp, data) => {
			try {
				if (err) {
					console.log(`🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(err)}`)
				} else {
					data = JSON.parse(data)
					if (data.code == 'F0410') {
						$.running = false
						$.stopMsg = data.msg || "关注数超过上限了哦~先清理下关注列表吧"
					}
					resolve(data.success && data.data)
				}
			} catch (e) {
				reject(`⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(data)}`)
			} finally {
				resolve(false)
			}
		})
	})
}

async function tryGoodList() {
	console.log(`⏰ 即将申请 ${$.goodList.length} 个商品`)
	$.running = true
	$.stopMsg = '申请完毕'
	for (let i = 0; i < $.goodList.length && $.running; i++) {
		let good = $.goodList[i]
		if (!await canTry(good)) continue
		// 如果没有关注且关注失败
		if (good.shopId && !await isFollowed(good) && !await followShop(good)) continue
		// 两个申请间隔不能太短，放在下面有利于确保 follwShop 完成
		await $.wait(Math.floor(Math.random() * 2000 + args.applyInterval))
		// 关注完毕，即将试用
		await doTry(good)
	}
}

async function doTry(good) {
	return new Promise((resolve, reject) => {
		$.get(taskurl(`${selfDomain}/migrate/apply?activityId=${good.id}&source=1&_s=m`, good.id), (err, resp, data) => {
			try {
				if (err) {
					console.log(`🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(err)}`)
				} else {
					data = JSON.parse(data)
					if (data.success) {
						$.totalTry += 1
						console.log(`🥳 ${good.id} 🛒${good.trialName.substr(0, 15)}🛒 ${data.message}`)
					} else if (data.code == '-131') { // 每日300个商品
						$.stopMsg = data.message
						$.running = false
					} else {
						console.log(`🤬 ${good.id} 🛒${good.trialName.substr(0, 15)}🛒 ${JSON.stringify(data)}`)
					}
				}
			} catch (e) {
				reject(`⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(data)}`)
			} finally {
				resolve()
			}
		})
	})
}

async function getSuccessList() {
	// 一页12个商品，不会吧不会吧，不会有人一次性中奖12个商品吧？！🤔
	return new Promise((resolve, reject) => {
		const option = {
			url: `https://prodev.m.jd.com/mall/active/G7sQ92vWSBsTHzk4e953qUGWQJ4/my/tryList?selected=2&page=1&tryVersion=2&_s=m`,
			headers: {
				'Host': 'prodev.m.jd.com/mall/active/G7sQ92vWSBsTHzk4e953qUGWQJ4',
				'Connection': 'keep-alive',
				'UserAgent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
				'Accept': '*/*',
				'Referer': 'https://https://prodev.m.jd.com/mall/active/G7sQ92vWSBsTHzk4e953qUGWQJ4/',
				'Accept-Encoding': 'gzip, deflate, br',
				'Accept-Language': 'zh,zh-CN;q=0.9,en;q=0.8',
				'Cookie': $.cookie
			}
		}
		$.get(option, (err, resp, data) => {
			try {
				if (err) {
					console.log(`🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(err)}`)
				} else {
					data = JSON.parse(data)
					if (data.success && data.data) {
						$.successList = data.data.data.filter(item => {
							return item.text.text.indexOf('请尽快领取') != -1
						})
					} else {
						console.log(`💩 获得成功列表失败: ${data.message}`)
					}
				}
			} catch (e) {
				reject(`⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(data)}`)
			} finally {
				resolve()
			}
		})
	})
}

async function showMsg() {
	let message = `京东账号${$.index} ${$.nickName || $.UserName}\n🎉 本次申请：${$.totalTry}/${$.totalGoods}个商品🛒\n🎉 ${$.successList.length}个商品待领取🤩\n🎉 结束原因：${$.stopMsg}`
	if (!args.jdNotify || args.jdNotify === 'false') {
		$.msg($.name, ``, message, {
			"open-url": 'https://https://prodev.m.jd.com/mall/active/G7sQ92vWSBsTHzk4e953qUGWQJ4/user'
		})
		if ($.isNode())
			notifyMsg += `${message}\n\n`
	} else {
		console.log(message)
	}
}

function taskurl(url, goodId) {
	return {
		'url': url,
		'headers': {
			'Host': 'https://prodev.m.jd.com/mall/active/G7sQ92vWSBsTHzk4e953qUGWQJ4',
			'Accept-Encoding': 'gzip, deflate, br',
			'Cookie': $.cookie,
			'Connection': 'keep-alive',
			'Accept': '*/*',
			'UserAgent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
			'Accept-Language': 'zh-cn',
			'Referer': goodId ? `https://https://prodev.m.jd.com/mall/active/G7sQ92vWSBsTHzk4e953qUGWQJ4/activity/?id=${goodId}` : undefined
		},
	}
}

function totalBean() {
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
			try {
				if (err) {
					console.log(`${JSON.stringify(err)}`)
					console.log(`${$.name} API请求失败，请检查网路重试`)
				} else {
					if (data) {
						data = JSON.parse(data);
						if (data['retcode'] === 13) {
							$.isLogin = false; //cookie过期
							return
						}
						if (data['retcode'] === 0) {
							$.nickName = (data['base'] && data['base'].nickname) || $.UserName;
						} else {
							$.nickName = $.UserName
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

// 来自 @chavyleung 大佬
// https://raw.githubusercontent.com/chavyleung/scripts/master/Env.js
function Env(name, opts) {
	class Http {
		constructor(env) {
			this.env = env
		}

		send(opts, method = 'GET') {
			opts = typeof opts === 'string' ? {
				url: opts
			} : opts
			let sender = this.get
			if (method === 'POST') {
				sender = this.post
			}
			return new Promise((resolve, reject) => {
				sender.call(this, opts, (err, resp, body) => {
					if (err) reject(err)
					else resolve(resp)
				})
			})
		}

		get(opts) {
			return this.send.call(this.env, opts)
		}

		post(opts) {
			return this.send.call(this.env, opts, 'POST')
		}
	}

	return new (class {
		constructor(name, opts) {
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

		isNode() {
			return 'undefined' !== typeof module && !!module.exports
		}

		isQuanX() {
			return 'undefined' !== typeof $task
		}

		isSurge() {
			return 'undefined' !== typeof $httpClient && 'undefined' === typeof $loon
		}

		isLoon() {
			return 'undefined' !== typeof $loon
		}

		toObj(str, defaultValue = null) {
			try {
				return JSON.parse(str)
			} catch {
				return defaultValue
			}
		}

		toStr(obj, defaultValue = null) {
			try {
				return JSON.stringify(obj)
			} catch {
				return defaultValue
			}
		}

		getjson(key, defaultValue) {
			let json = defaultValue
			const val = this.getdata(key)
			if (val) {
				try {
					json = JSON.parse(this.getdata(key))
				} catch { }
			}
			return json
		}

		setjson(val, key) {
			try {
				return this.setdata(JSON.stringify(val), key)
			} catch {
				return false
			}
		}

		getScript(url) {
			return new Promise((resolve) => {
				this.get({
					url
				}, (err, resp, body) => resolve(body))
			})
		}

		runScript(script, runOpts) {
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

		loaddata() {
			if (this.isNode()) {
				this.fs = this.fs ? this.fs : require('fs')
				this.path = this.path ? this.path : require('path')
				const curDirDataFilePath = this.path.resolve(this.dataFile)
				const rootDirDataFilePath = this.path.resolve(process.cwd(), this.dataFile)
				const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
				const isRootDirDataFile = !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
				if (isCurDirDataFile || isRootDirDataFile) {
					const datPath = isCurDirDataFile ? curDirDataFilePath : rootDirDataFilePath
					try {
						return JSON.parse(this.fs.readFileSync(datPath))
					} catch (e) {
						return {}
					}
				} else return {}
			} else return {}
		}

		writedata() {
			if (this.isNode()) {
				this.fs = this.fs ? this.fs : require('fs')
				this.path = this.path ? this.path : require('path')
				const curDirDataFilePath = this.path.resolve(this.dataFile)
				const rootDirDataFilePath = this.path.resolve(process.cwd(), this.dataFile)
				const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
				const isRootDirDataFile = !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
				const jsondata = JSON.stringify(this.data)
				if (isCurDirDataFile) {
					this.fs.writeFileSync(curDirDataFilePath, jsondata)
				} else if (isRootDirDataFile) {
					this.fs.writeFileSync(rootDirDataFilePath, jsondata)
				} else {
					this.fs.writeFileSync(curDirDataFilePath, jsondata)
				}
			}
		}

		lodash_get(source, path, defaultValue = undefined) {
			const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.')
			let result = source
			for (const p of paths) {
				result = Object(result)[p]
				if (result === undefined) {
					return defaultValue
				}
			}
			return result
		}

		lodash_set(obj, path, value) {
			if (Object(obj) !== obj) return obj
			if (!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || []
			path
				.slice(0, -1)
				.reduce((a, c, i) => (Object(a[c]) === a[c] ? a[c] : (a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1] ? [] : {})), obj)[
				path[path.length - 1]
			] = value
			return obj
		}

		getdata(key) {
			let val = this.getval(key)
			// 如果以 @
			if (/^@/.test(key)) {
				const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key)
				const objval = objkey ? this.getval(objkey) : ''
				if (objval) {
					try {
						const objedval = JSON.parse(objval)
						val = objedval ? this.lodash_get(objedval, paths, '') : val
					} catch (e) {
						val = ''
					}
				}
			}
			return val
		}

		setdata(val, key) {
			let issuc = false
			if (/^@/.test(key)) {
				const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key)
				const objdat = this.getval(objkey)
				const objval = objkey ? (objdat === 'null' ? null : objdat || '{}') : '{}'
				try {
					const objedval = JSON.parse(objval)
					this.lodash_set(objedval, paths, val)
					issuc = this.setval(JSON.stringify(objedval), objkey)
				} catch (e) {
					const objedval = {}
					this.lodash_set(objedval, paths, val)
					issuc = this.setval(JSON.stringify(objedval), objkey)
				}
			} else {
				issuc = this.setval(val, key)
			}
			return issuc
		}

		getval(key) {
			if (this.isSurge() || this.isLoon()) {
				return $persistentStore.read(key)
			} else if (this.isQuanX()) {
				return $prefs.valueForKey(key)
			} else if (this.isNode()) {
				this.data = this.loaddata()
				return this.data[key]
			} else {
				return (this.data && this.data[key]) || null
			}
		}

		setval(val, key) {
			if (this.isSurge() || this.isLoon()) {
				return $persistentStore.write(val, key)
			} else if (this.isQuanX()) {
				return $prefs.setValueForKey(val, key)
			} else if (this.isNode()) {
				this.data = this.loaddata()
				this.data[key] = val
				this.writedata()
				return true
			} else {
				return (this.data && this.data[key]) || null
			}
		}

		initGotEnv(opts) {
			this.got = this.got ? this.got : require('got')
			this.cktough = this.cktough ? this.cktough : require('tough-cookie')
			this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()
			if (opts) {
				opts.headers = opts.headers ? opts.headers : {}
				if (undefined === opts.headers.Cookie && undefined === opts.cookieJar) {
					opts.cookieJar = this.ckjar
				}
			}
		}

		get(opts, callback = () => { }) {
			if (opts.headers) {
				delete opts.headers['Content-Type']
				delete opts.headers['Content-Length']
			}
			if (this.isSurge() || this.isLoon()) {
				if (this.isSurge() && this.isNeedRewrite) {
					opts.headers = opts.headers || {}
					Object.assign(opts.headers, {
						'X-Surge-Skip-Scripting': false
					})
				}
				$httpClient.get(opts, (err, resp, body) => {
					if (!err && resp) {
						resp.body = body
						resp.statusCode = resp.status
					}
					callback(err, resp, body)
				})
			} else if (this.isQuanX()) {
				if (this.isNeedRewrite) {
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
			} else if (this.isNode()) {
				this.initGotEnv(opts)
				this.got(opts)
					.on('redirect', (resp, nextOpts) => {
						try {
							if (resp.headers['set-cookie']) {
								const ck = resp.headers['set-cookie'].map(this.cktough.Cookie.parse).toString()
								if (ck) {
									this.ckjar.setCookieSync(ck, null)
								}
								nextOpts.cookieJar = this.ckjar
							}
						} catch (e) {
							this.logErr(e)
						}
						// this.ckjar.setCookieSync(resp.headers['set-cookie'].map(Cookie.parse).toString())
					})
					.then(
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

		post(opts, callback = () => { }) {
			// 如果指定了请求体, 但没指定`Content-Type`, 则自动生成
			if (opts.body && opts.headers && !opts.headers['Content-Type']) {
				opts.headers['Content-Type'] = 'application/x-www-form-urlencoded'
			}
			if (opts.headers) delete opts.headers['Content-Length']
			if (this.isSurge() || this.isLoon()) {
				if (this.isSurge() && this.isNeedRewrite) {
					opts.headers = opts.headers || {}
					Object.assign(opts.headers, {
						'X-Surge-Skip-Scripting': false
					})
				}
				$httpClient.post(opts, (err, resp, body) => {
					if (!err && resp) {
						resp.body = body
						resp.statusCode = resp.status
					}
					callback(err, resp, body)
				})
			} else if (this.isQuanX()) {
				opts.method = 'POST'
				if (this.isNeedRewrite) {
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
			} else if (this.isNode()) {
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
		time(fmt) {
			let o = {
				'M+': new Date().getMonth() + 1,
				'd+': new Date().getDate(),
				'H+': new Date().getHours(),
				'm+': new Date().getMinutes(),
				's+': new Date().getSeconds(),
				'q+': Math.floor((new Date().getMonth() + 3) / 3),
				'S': new Date().getMilliseconds()
			}
			if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (new Date().getFullYear() + '').substr(4 - RegExp.$1.length))
			for (let k in o)
				if (new RegExp('(' + k + ')').test(fmt))
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
		msg(title = name, subt = '', desc = '', opts) {
			const toEnvOpts = (rawopts) => {
				if (!rawopts) return rawopts
				if (typeof rawopts === 'string') {
					if (this.isLoon()) return rawopts
					else if (this.isQuanX()) return {
						'open-url': rawopts
					}
					else if (this.isSurge()) return {
						url: rawopts
					}
					else return undefined
				} else if (typeof rawopts === 'object') {
					if (this.isLoon()) {
						let openUrl = rawopts.openUrl || rawopts.url || rawopts['open-url']
						let mediaUrl = rawopts.mediaUrl || rawopts['media-url']
						return {
							openUrl,
							mediaUrl
						}
					} else if (this.isQuanX()) {
						let openUrl = rawopts['open-url'] || rawopts.url || rawopts.openUrl
						let mediaUrl = rawopts['media-url'] || rawopts.mediaUrl
						return {
							'open-url': openUrl,
							'media-url': mediaUrl
						}
					} else if (this.isSurge()) {
						let openUrl = rawopts.url || rawopts.openUrl || rawopts['open-url']
						return {
							url: openUrl
						}
					}
				} else {
					return undefined
				}
			}
			if (!this.isMute) {
				if (this.isSurge() || this.isLoon()) {
					$notification.post(title, subt, desc, toEnvOpts(opts))
				} else if (this.isQuanX()) {
					$notify(title, subt, desc, toEnvOpts(opts))
				}
			}
			if (!this.isMuteLog) {
				let logs = ['', '==============📣系统通知📣==============']
				logs.push(title)
				subt ? logs.push(subt) : ''
				desc ? logs.push(desc) : ''
				console.log(logs.join('\n'))
				this.logs = this.logs.concat(logs)
			}
		}

		log(...logs) {
			if (logs.length > 0) {
				this.logs = [...this.logs, ...logs]
			}
			console.log(logs.join(this.logSeparator))
		}

		logErr(err, msg) {
			const isPrintSack = !this.isSurge() && !this.isQuanX() && !this.isLoon()
			if (!isPrintSack) {
				this.log('', `❗️${this.name}, 错误!`, err)
			} else {
				this.log('', `❗️${this.name}, 错误!`, err.stack)
			}
		}

		wait(time) {
			return new Promise((resolve) => setTimeout(resolve, time))
		}

		done(val = {}) {
			const endTime = new Date().getTime()
			const costTime = (endTime - this.startTime) / 1000
			this.log('', `🔔${this.name}, 结束! 🕛 ${costTime} 秒`)
			this.log()
			if (this.isSurge() || this.isQuanX() || this.isLoon()) {
				$done(val)
			}
		}
	})(name, opts)
}