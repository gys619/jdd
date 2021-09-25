let common = require("./function/common");
let $ = new common.env('宠汪汪兑换京豆');
let fs = require("fs");
let min = 2,
    help = $.config[$.filename(__filename)] || Math.min(min, $.config.JdMain) || min;
$.setOptions({
    headers: {
        'content-type': 'application/json',
        'user-agent': 'jdapp;iPhone;9.4.6;14.2;965af808880443e4c1306a54afdd5d5ae771de46;network/wifi;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone8,4;addressid/;supportBestPay/0;appBuild/167618;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
        'referer': 'https://happy.m.jd.com/babelDiy/',
    }
});
$.readme = `
0 */8 * * * task ${$.runfile}
`
eval(common.eval.mainEval($));
async function prepare() {
    $.thread = 1;
    $.options.headers.lkt = $.timestamp;
    $.options.headers.lks = $.md5(`${$.config['invokeKey']}${$.timestamp}`)
    console.log('invokeKey', $.config['invokeKey'])
    //await $.timer("00 00 */8",120)
}
async function main(id) {
    let txt = await fs.readFileSync('./jdvalidate.txt', 'utf-8');
    let lists = txt.split("\n");
    let validate = lists[id.index - 1];
    let params = {
        'url': `https://jdjoy.jd.com/common/gift/getBeanConfigs?reqSource=h5&invokeKey=${$.config['invokeKey']}&validate=${validate}`,
        'cookie': id.cookie
    }
    try {
        await $.curl(params)
        if ($.source.data) {
            let h = new Date().getHours();
            if (h >= 0 && h < 8) {
                config = $.source.data['beanConfigs0']
            } else if (h >= 8 && h < 16) {
                config = $.source.data['beanConfigs8']
            } else {
                config = $.source.data['beanConfigs16']
            }
            for (let i of config.reverse()) {
                params = {
                    'url': `https://jdjoy.jd.com/common/gift/new/exchange?reqSource=h5&invokeKey=${$.config['invokeKey']}&validate=${validate}`,
                    'body': `{"buyParam":{"orderSource":"pet","saleInfoId":${i.id}},"deviceInfo":{}}`,
                    'cookie': id.cookie
                }
                await $.curl(params)
                let log = '';
                switch ($.source.errorCode) {
                    case 'stock_empty':
                        log = "库存为空"
                        break
                    case 'insufficient':
                        log = "积分不足"
                        break
                    case 'buy_limit':
                        log = "已兑换过"
                        break;
                    case 'buy_success':
                        log = "兑换成功"
                        break;
                    case 'H0001':
                        log = "刷新验证"
                        break;
                    default:
                        log = $.source.errorCode
                        break
                }
                console.log(id.user, log, i.giftValue, $.source.currentTime)
                $.notices(`${i.giftValue} ${log}`, id.user)
                if (h < 16) {
                    break
                }
            }
        } else {
            console.log(`${$.config['invokeKey']}未获取到数据`)
        }
    } catch (e) {
        console.log(e.message)
    }
}
