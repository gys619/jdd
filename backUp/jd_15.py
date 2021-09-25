#!/bin/env python3
# -*- coding: utf-8 -*

'''
cron: 0 59 23 * * 0 jd_15.py
new Env('Faker群友家电15周年助力');
'''

# cron 
#不做浏览，只做助力 建议先运行jd_appliances.js 在运行此脚本
# export jd15_pins=["pt_pin1","pt_pin2"]

from urllib.parse import unquote, quote
import time, datetime, os, sys
import requests, json, re, random
import threading

UserAgent = ''
script_name = '家电15周年助力'


def printT(msg):
    print("[{}]: {}".format(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), msg))
    sys.stdout.flush()


def delEnvs(label):
    try:
        if label == 'True' or label == 'yes' or label == 'true' or label == 'Yes':
            return True
        elif label == 'False' or label == 'no' or label == 'false' or label == 'No':
            return False
    except:
        pass
    try:
        if '.' in label:
            return float(label)
        elif '&' in label:
            return label.split('&')
        elif '@' in label:
            return label.split('@')
        else:
            return int(label)
    except:
        return label


class getJDCookie():
    # 适配青龙平台环境ck
    def getckfile(self):
        ql_new = '/ql/config/env.sh'
        ql_old = '/ql/config/cookie.sh'
        if os.path.exists(ql_new):
            printT("当前环境青龙面板新版")
            return ql_new
        elif os.path.exists(ql_old):
            printT("当前环境青龙面板旧版")
            return ql_old

    # 获取cookie
    def getallCookie(self):
        cookies = ''
        ckfile = self.getckfile()
        try:
            if os.path.exists(ckfile):
                with open(ckfile, "r", encoding="utf-8") as f:
                    cks_text = f.read()
                if 'pt_key=' in cks_text and 'pt_pin=' in cks_text:
                    r = re.compile(r"pt_key=.*?pt_pin=.*?;", re.M | re.S | re.I)
                    cks_list = r.findall(cks_text)
                    if len(cks_list) > 0:
                        for ck in cks_list:
                            cookies += ck
            return cookies
        except Exception as e:
            printT(f"【getCookie Error】{e}")

    # 检测cookie格式是否正确
    def getUserInfo(self, ck, user_order, pinName):
        url = 'https://me-api.jd.com/user_new/info/GetJDUserInfoUnion?orgFlag=JD_PinGou_New&callSource=mainorder&channel=4&isHomewhite=0&sceneval=2&sceneval=2&callback='
        headers = {
            'Cookie': ck,
            'Accept': '*/*',
            'Connection': 'close',
            'Referer': 'https://home.m.jd.com/myJd/home.action',
            'Accept-Encoding': 'gzip, deflate, br',
            'Host': 'me-api.jd.com',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1',
            'Accept-Language': 'zh-cn'
        }
        try:
            resp = requests.get(url=url, headers=headers, timeout=60).json()
            if resp['retcode'] == "0":
                nickname = resp['data']['userInfo']['baseInfo']['nickname']
                return ck, nickname
            else:
                context = f"账号{user_order}【{pinName}】Cookie 已失效！请重新获取。"
                print(context)
                return ck, False
        except Exception:
            context = f"账号{user_order}【{pinName}】Cookie 已失效！请重新获取。"
            print(context)
            return ck, False

    def getcookies(self):
        """
        :return: cookiesList,userNameList,pinNameList
        """
        cookiesList = []
        pinNameList = []
        nickNameList = []
        cookies = self.getallCookie()
        if 'pt_key=' in cookies and 'pt_pin=' in cookies:
            r = re.compile(r"pt_key=.*?pt_pin=.*?;", re.M | re.S | re.I)
            result = r.findall(cookies)
            if len(result) >= 1:
                printT("您已配置{}个账号".format(len(result)))
                user_order = 1
                for ck in result:
                    r = re.compile(r"pt_pin=(.*?);")
                    pinName = r.findall(ck)
                    pinName = unquote(pinName[0])
                    # 获取账号名
                    ck, nickname = self.getUserInfo(ck, user_order, pinName)
                    if nickname != False:
                        cookiesList.append(ck)
                        pinNameList.append(pinName)
                        nickNameList.append(nickname)
                        user_order += 1
                    else:
                        user_order += 1
                        continue
                if len(cookiesList) > 0:
                    return cookiesList, pinNameList, nickNameList
                else:
                    printT("没有可用Cookie，已退出")
                    exit(4)
        else:
            printT("没有可用Cookie，已退出")
            exit(4)


def getPinEnvs():
    if "jd15_pins" in os.environ:
        if len(os.environ["jd15_pins"]) != 0:
            jd15_pins = os.environ["jd15_pins"]
            jd15_pins = jd15_pins.replace('[', '').replace(']', '').replace('\'', '').replace(' ', '').split(',')
            printT(f"已获取并使用Env环境 jd15_pins:{jd15_pins}")
            return jd15_pins
        else:
            printT('请先配置export jd15_pins=["pt_pin1","pt_pin2"]')
            exit(4)
    printT('请先配置export jd15_pins=["pt_pin1","pt_pin2"]')
    exit(4)


def res_post(cookie, body):
    url = "https://api.m.jd.com/api"
    headers = {
        "Host": "api.m.jd.com",
        "content-length": "146",
        "accept": "application/json, text/plain, */*",
        "origin": "https://welfare.m.jd.com",
        "user-agent": "jdapp;android;10.1.0;10;4636532323835366-1683336356836626;network/UNKNOWN;model/MI 8;addressid/4608453733;aid/dc52285fa836e8fb;oaid/a28cc4ac8bda0bf6;osVer/29;appBuild/89568;partner/xiaomi001;eufv/1;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045715 Mobile Safari/537.36",
        "sec-fetch-mode": "cors",
        "content-type": "application/x-www-form-urlencoded",
        "x-requested-with": "com.jingdong.app.mall",
        "sec-fetch-site": "same-site",
        "referer": "https://welfare.m.jd.com/",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "zh-CN,zh;q\u003d0.9,en-US;q\u003d0.8,en;q\u003d0.7",
        "cookie": cookie
    }
    body = json.dumps(body)
    t = str(int(time.time() * 1000))
    data = {
        'appid': 'anniversary-celebra',
        'functionId': 'jd_interaction_prod',
        'body': body,
        't': t,
        'loginType': 2
    }
    res = requests.post(url=url, headers=headers, data=data).json()
    return res


def get_share5(cookie):
    body = {"type": "99", "apiMapping": "/api/supportTask/getShareId"}
    res = res_post(cookie, body)
    # print(res)
    if '成功' in res['msg']:
        return res['data']


def get_share50(cookie):
    body = {"type": "100", "apiMapping": "/api/supportTask/getShareId"}
    res = res_post(cookie, body)
    # print(res)

    if '成功' in res['msg']:
        return res['data']


def getprize1(cookie,nickname):
    body = {"apiMapping": "/api/prize/getCoupon"}
    res = res_post(cookie, body)
    # print(res)
    if res['code'] == 200:
        print('------【账号：' + nickname + '】------' + res['data']['name'])
    else:
        print('------【账号：' + nickname + '】------优惠券领过了')


def getprize2(cookie,nickname):
    body = {"apiMapping": "/api/prize/doLottery"}
    res = res_post(cookie, body)
    # print(res)
    if res['code'] == 5011:
        print('------【账号：' + nickname + '】------未中奖e卡')
    else:
        print('------【账号：' + nickname + '】------不确定，手动确认')


def help(mycookie, nickname, cookiesList, nickNameList):
    shareId5 = get_share5(mycookie)
    if shareId5 != None:
        # print('获取5助力码成功：', shareId5)
        # print('--------------------------------------开始5个助力-------------')
        body1 = {"shareId": shareId5, "apiMapping": "/api/supportTask/doSupport"}
        for i in range(len(cookiesList)):
            res = res_post(cookiesList[i], body1)
            # print(res)
            try:
                if res['code'] == 200 and res['data']['status'] == 7:
                    print(nickNameList[i] + '助力' + nickname + '：' + '5助力成功')
                elif res['code'] == 200 and res['data']['status'] == 4:
                    print(nickNameList[i]+'助力'+nickname+'：'+'5个助力完成啦----')
                    getprize1(mycookie,nickname)
                    getprize2(mycookie,nickname)
                    break
                elif res['code'] == 200 and res['data']['status'] == 3:
                    print(nickNameList[i]+'助力'+nickname+'：'+'5已经助力过了')
            except:
                pass
    else:
        print('【账号：' + nickname + '】请先手动执行下浏览任务')

    shareId50 = get_share50(mycookie)
    if shareId50 != None:
        # print('获取50助力码成功：', shareId50)
        # print('-------------------------------开始50个助力-------------')
        body2 = {"shareId": shareId50, "apiMapping": "/api/supportTask/doSupport"}
        for ck in mycookie:
            res = res_post(ck, body2)
            # print(res)
            try:
                if res['code'] == 200 and res['data']['status'] == 7:
                    print(nickNameList[i] + '助力' + nickname + '：' + '50助力成功')
                elif res['code'] == 200 and res['data']['status'] == 4:
                    print(nickNameList[i] + '助力' + nickname + '：' + '50个助力完成啦----')
                    getprize1(mycookie, nickname)
                    getprize2(mycookie, nickname)
                    break
                elif res['code'] == 200 and res['data']['status'] == 3:
                    print(nickNameList[i] + '助力' + nickname + '：' + '50已经助力过了')
            except:
                pass
    else:
        print('【账号' + nickname + '】请先手动执行下浏览任务')


def use_thread(jd15_cookies, nicks, cookiesList, nickNameList):
    threads = []
    for i in range(len(jd15_cookies)):
        threads.append(
            threading.Thread(target=help, args=(jd15_cookies[i], nicks[i], cookiesList, nickNameList))
        )
    for t in threads:
        t.start()
    for t in threads:
        t.join()


def start():
    printT("############{}##########".format(script_name))
    jd15_pins = getPinEnvs()
    get_jd_cookie = getJDCookie()
    cookiesList, pinNameList, nickNameList = get_jd_cookie.getcookies()
    jd15_cookies = []
    nicks = []
    for ckname in jd15_pins:
        try:
            ckNum = pinNameList.index(ckname)
            jd15_cookies.append(cookiesList[ckNum])
            nicks.append(nickNameList[ckNum])
        except Exception as e:
            try:
                ckNum = pinNameList.index(unquote(ckname))
                jd15_cookies.append(cookiesList[ckNum])
                nicks.append(nickNameList[ckNum])
            except:
                print(f"请检查被助力账号【{ckname}】名称是否正确？ck是否存在？提示：助力名字可填pt_pin的值、也可以填账号名。")
                continue
    if len(jd15_cookies) == 0:
        exit(4)
    use_thread(jd15_cookies, nicks, cookiesList, nickNameList)


if __name__ == '__main__':
    start()
