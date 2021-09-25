#!/usr/bin/env python3
# -*- coding: utf-8 -*
'''
项目名称: JD-Script / jd_cash
Author: Curtin
功能：签到领现金-助力, 仅助力拿cash
Date: 2021/7/4 上午09:35
TG交流 https://t.me/topstyle996
TG频道 https://t.me/TopStyle2021
update 2021.7.17 15:02
'''

#ck 优先读取【JDCookies.txt】 文件内的ck  再到 ENV的 变量 JD_COOKIE='ck1&ck2' 最后才到脚本内 cookies=ck
cookies = ''
# 设置被助力的账号可填用户名 或 pin的值不要; env 设置 export cash_zlzh="用户1&用户N"
cash_zlzh = ['Your JD_User', '买买买']

# Env环境设置 通知服务
# export BARK=''                   # bark服务,苹果商店自行搜索;
# export SCKEY=''                  # Server酱的SCKEY;
# export TG_BOT_TOKEN=''           # tg机器人的TG_BOT_TOKEN;
# export TG_USER_ID=''             # tg机器人的TG_USER_ID;
# export TG_API_HOST=''            # tg 代理api
# export TG_PROXY_IP=''            # tg机器人的TG_PROXY_IP;
# export TG_PROXY_PORT=''          # tg机器人的TG_PROXY_PORT;
# export DD_BOT_ACCESS_TOKEN=''    # 钉钉机器人的DD_BOT_ACCESS_TOKEN;
# export DD_BOT_SECRET=''          # 钉钉机器人的DD_BOT_SECRET;
# export QQ_SKEY=''                # qq机器人的QQ_SKEY;
# export QQ_MODE=''                # qq机器人的QQ_MODE;
# export QYWX_AM=''                # 企业微信；http://note.youdao.com/s/HMiudGkb
# export PUSH_PLUS_TOKEN=''        # 微信推送Plus+ ；

#####

# 建议调整一下的参数
# UA 可自定义你的，注意格式: 【 jdapp;iPhone;10.0.4;14.2;9fb54498b32e17dfc5717744b5eaecda8366223c;network/wifi;ADID/2CF597D0-10D8-4DF8-C5A2-61FD79AC8035;model/iPhone11,1;addressid/7785283669;appBuild/167707;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/null;supportJDSHWK/1 】
UserAgent = ''
# 限制速度 （秒）
sleepNum = 0.1

import os, re, sys
import random
try:
    import requests
except Exception as e:
    print(e, "\n缺少requests 模块，请执行命令安装：pip3 install requests")
    exit(3)
from urllib.parse import unquote, quote
import json
import time
requests.packages.urllib3.disable_warnings()

pwd = os.path.dirname(os.path.abspath(__file__)) + os.sep
t = time.time()
aNum = 0
cashCount = 0
cashCountdict = {}


def getEnvs(label):
    try:
        if label == 'True' or label == 'yes' or label == 'true' or label == 'Yes':
            return True
        elif label == 'False' or label == 'no' or label == 'false' or label == 'No':
            return False
    except Exception as e:
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

class getJDCookie(object):
    # 适配各种平台环境ck

    def getckfile(self):
        global v4f
        curf = pwd + 'JDCookies.txt'
        v4f = '/jd/config/config.sh'
        ql_new = '/ql/config/env.sh'
        ql_old = '/ql/config/cookie.sh'
        if os.path.exists(curf):
            with open(curf, "r", encoding="utf-8") as f:
                cks = f.read()
                f.close()
            r = re.compile(r"pt_key=.*?pt_pin=.*?;", re.M | re.S | re.I)
            cks = r.findall(cks)
            if len(cks) > 0:
                return curf
            else:
                pass
        if os.path.exists(ql_new):
            print("当前环境青龙面板新版")
            return ql_new
        elif os.path.exists(ql_old):
            print("当前环境青龙面板旧版")
            return ql_old
        elif os.path.exists(v4f):
            print("当前环境V4")
            return v4f
        return curf

    # 获取cookie
    def getCookie(self):
        global cookies
        ckfile = self.getckfile()
        try:
            if os.path.exists(ckfile):
                with open(ckfile, "r", encoding="utf-8") as f:
                    cks = f.read()
                    f.close()
                if 'pt_key=' in cks and 'pt_pin=' in cks:
                    r = re.compile(r"pt_key=.*?pt_pin=.*?;", re.M | re.S | re.I)
                    cks = r.findall(cks)
                    if len(cks) > 0:
                        if 'JDCookies.txt' in ckfile:
                            print("当前获取使用 JDCookies.txt 的cookie")
                        cookies = ''
                        for i in cks:
                            if 'pt_key=xxxx' in i:
                                pass
                            else:
                                cookies += i
                        return
            else:
                with open(pwd + 'JDCookies.txt', "w", encoding="utf-8") as f:
                    cks = "#多账号换行，以下示例：（通过正则获取此文件的ck，理论上可以自定义名字标记ck，也可以随意摆放ck）\n账号1【Curtinlv】cookie1;\n账号2【TopStyle】cookie2;"
                    f.write(cks)
                    f.close()
            if "JD_COOKIE" in os.environ:
                if len(os.environ["JD_COOKIE"]) > 10:
                    cookies = os.environ["JD_COOKIE"]
                    print("已获取并使用Env环境 Cookie")
        except Exception as e:
            print(f"【getCookie Error】{e}")

    # 检测cookie格式是否正确
    def getUserInfo(self, ck, pinName, userNum):
        url = 'https://me-api.jd.com/user_new/info/GetJDUserInfoUnion?orgFlag=JD_PinGou_New&callSource=mainorder&channel=4&isHomewhite=0&sceneval=2&sceneval=2&callback=GetJDUserInfoUnion'
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
            resp = requests.get(url=url, verify=False, headers=headers, timeout=60).text
            r = re.compile(r'GetJDUserInfoUnion.*?\((.*?)\)')
            result = r.findall(resp)
            userInfo = json.loads(result[0])
            nickname = userInfo['data']['userInfo']['baseInfo']['nickname']
            return ck, nickname
        except Exception:
            context = f"账号{userNum}【{pinName}】Cookie 已失效！请重新获取。"
            print(context)
            return ck, False

    def iscookie(self):
        """
        :return: cookiesList,userNameList,pinNameList
        """
        cookiesList = []
        userNameList = []
        pinNameList = []
        if 'pt_key=' in cookies and 'pt_pin=' in cookies:
            r = re.compile(r"pt_key=.*?pt_pin=.*?;", re.M | re.S | re.I)
            result = r.findall(cookies)
            if len(result) >= 1:
                print("您已配置{}个账号".format(len(result)))
                u = 1
                for i in result:
                    r = re.compile(r"pt_pin=(.*?);")
                    pinName = r.findall(i)
                    pinName = unquote(pinName[0])
                    # 获取账号名
                    ck, nickname = self.getUserInfo(i, pinName, u)
                    if nickname != False:
                        cookiesList.append(ck)
                        userNameList.append(nickname)
                        pinNameList.append(pinName)
                    else:
                        u += 1
                        continue
                    u += 1
                if len(cookiesList) > 0 and len(userNameList) > 0:
                    return cookiesList, userNameList, pinNameList
                else:
                    print("没有可用Cookie，已退出")
                    exit(3)
            else:
                print("cookie 格式错误！...本次操作已退出")
                exit(4)
        else:
            print("cookie 格式错误！...本次操作已退出")
            exit(4)
getCk = getJDCookie()
getCk.getCookie()

# 获取v4环境 特殊处理
try:
    with open(v4f, 'r', encoding='utf-8') as v4f:
        v4Env = v4f.read()
    r = re.compile(r'^export\s(.*?)=[\'\"]?([\w\.\-@#&=_,\[\]\{\}\(\)]{1,})+[\'\"]{0,1}$',
                   re.M | re.S | re.I)
    r = r.findall(v4Env)
    curenv = locals()
    for i in r:
        if i[0] != 'JD_COOKIE':
            curenv[i[0]] = getEnvs(i[1])
except:
    pass

if "cash_zlzh" in os.environ:
    if len(os.environ["cash_zlzh"]) > 1:
        cash_zlzh = os.environ["cash_zlzh"]
        cash_zlzh = cash_zlzh.replace('[', '').replace(']', '').replace('\'', '').replace(' ', '').split(',')
        print("已获取并使用Env环境 cash_zlzh:", cash_zlzh)



## 获取通知服务
class msg(object):
    def __init__(self, m):
        self.str_msg = m
        self.message()
    def message(self):
        global msg_info
        print(self.str_msg)
        try:
            msg_info = "{}\n{}".format(msg_info, self.str_msg)
        except:
            msg_info = "{}".format(self.str_msg)
        sys.stdout.flush()
    def getsendNotify(self, a=0):
        if a == 0:
            a += 1
        try:
            url = 'https://gitee.com/curtinlv/Public/raw/master/sendNotify.py'
            response = requests.get(url)
            if 'curtinlv' in response.text:
                with open('sendNotify.py', "w+", encoding="utf-8") as f:
                    f.write(response.text)
            else:
                if a < 5:
                    a += 1
                    return self.getsendNotify(a)
                else:
                    pass
        except:
            if a < 5:
                a += 1
                return self.getsendNotify(a)
            else:
                pass
    def main(self):
        global send
        cur_path = os.path.abspath(os.path.dirname(__file__))
        sys.path.append(cur_path)
        if os.path.exists(cur_path + "/sendNotify.py"):
            try:
                from sendNotify import send
            except:
                self.getsendNotify()
                try:
                    from sendNotify import send
                except:
                    print("加载通知服务失败~")
        else:
            self.getsendNotify()
            try:
                from sendNotify import send
            except:
                print("加载通知服务失败~")
        ###################
msg("").main()
##############

def userAgent():
    """
    随机生成一个UA
    jdapp;iPhone;10.0.4;14.2;9fb54498b32e17dfc5717744b5eaecda8366223c;network/wifi;ADID/2CF597D0-10D8-4DF8-C5A2-61FD79AC8035;model/iPhone11,1;addressid/7785283669;appBuild/167707;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/null;supportJDSHWK/1
    :return: ua
    """
    if not UserAgent:
        uuid = ''.join(random.sample('123456789abcdef123456789abcdef123456789abcdef123456789abcdef', 40))
        addressid = ''.join(random.sample('1234567898647', 10))
        iosVer = ''.join(random.sample(["14.5.1", "14.4", "14.3", "14.2", "14.1", "14.0.1", "13.7", "13.1.2", "13.1.1"], 1))
        iosV = iosVer.replace('.', '_')
        iPhone = ''.join(random.sample(["8", "9", "10", "11", "12", "13"], 1))
        ADID = ''.join(random.sample('0987654321ABCDEF', 8)) + '-' + ''.join(random.sample('0987654321ABCDEF', 4)) + '-' + ''.join(random.sample('0987654321ABCDEF', 4)) + '-' + ''.join(random.sample('0987654321ABCDEF', 4)) + '-' + ''.join(random.sample('0987654321ABCDEF', 12))
        return f'jdapp;iPhone;10.0.4;{iosVer};{uuid};network/wifi;ADID/{ADID};model/iPhone{iPhone},1;addressid/{addressid};appBuild/167707;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS {iosV} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/null;supportJDSHWK/1'
    else:
        return UserAgent

def buildHeader(ck):
    headers = {
        'Origin': 'https://h5.m.jd.com',
        'Cookie': ck,
        'Connection': 'keep-alive',
        'Accept': 'application/json, text/plain, */*',
        'Referer': f'https://h5.m.jd.com/babelDiy/Zeus/GzY6gTjVg1zqnQRnmWfMKC4PsT1/index.html?lng=&lat=&sid=&un_area=',
        'Host': 'api.m.jd.com',
        'User-Agent': userAgent(),
        'Accept-Language': 'zh-cn',
        'Accept-Encoding': 'gzip, deflate, br'
    }
    return headers

def getShareCode(header):
    global aNum
    try:
        url = 'https://api.m.jd.com/client.action?functionId=cash_getJDMobShareInfo&body=%7B%22source%22%3A2%7D&appid=CashReward&client=m&clientVersion=9.2.8'
        resp = requests.post(url=url, headers=header,  verify=False, timeout=30).json()
        if resp['data']['bizMsg'] == 'success' and resp['data']['success']:
            inviteCode = resp['data']['result']['inviteCode']
            shareDate = resp['data']['result']['shareDate']
            aNum = 0
            return inviteCode, shareDate
        else:
            print("获取互助码失败！")
            return 0, 0
    except Exception as e:
        if aNum < 5:
            aNum += 1
            return getShareCode(header)
        else:
            aNum = 0
            print("获取互助码失败！", e)
            return 0, 0

def helpCode(header, inviteCode, shareDate, uNUm, user, name):
    try:
        url = f'https://api.m.jd.com/client.action?functionId=cash_mob_assist&body=%7B%22source%22%3A3%2C%22inviteCode%22%3A%22{inviteCode}%22%2C%22shareDate%22%3A%22{shareDate}%22%7D&appid=CashReward&client=m&clientVersion=9.2.8'
        resp = requests.post(url=url, headers=header,  verify=False, timeout=30).json()
        if resp['data']['success']:
            print(f'用户{uNUm}【{user}】助力【{name}】{resp["data"]["bizMsg"]} -> 您也获得{resp["data"]["result"]["cashStr"]}现金')
            return False
        else:
            print(f'用户{uNUm}【{user}】助力【{name}】{resp["data"]["bizMsg"]}')
            if '晚' in resp["data"]["bizMsg"]:
                return True
            else:
                return False

    except Exception as e:
        print("helpCode Error", e)
        print(f'用户{uNUm}【{user}】助力【{name}】报错了！')
        return False

def cash_exchangePage(ck):
    try:
        iosVer = ''.join(random.sample(["14.5.1", "14.4", "14.3", "14.2", "14.1", "14.0.1", "13.7", "13.1.2", "13.1.1"], 1))
        url = 'https://api.m.jd.com/client.action?functionId=cash_exchangePage'
        header = {
            'Accept-Encoding': 'gzip, deflate, br',
            'Cookie': ck,
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': '*/*',
            'Host': 'api.m.jd.com',
            'User-Agent': f'JD4iPhone/167724 (iPhone; iOS {iosVer}; Scale/3.00)',
            'Referer': '',
            'Accept-Language': 'zh-Hans-CN;q=1'
        }
        body = f'body=%7B%7D&build=167724&client=apple&clientVersion=10.0.6&d_brand=apple&d_model=iPhone13%2C4&eid=&isBackground=N&joycious=82&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=809409cbd5bb8a0fa8fff41378c1afe91b8075ad&osVersion={iosVer}&partner=apple&rfs=0000&scope=10&screen=1125%2A2436&sign=5b8aa440653bb1fcbad0f0ff71671cae&st=1625368739358&sv=122&uemps=0-0&uts=&uuid=&wifiBssid=unknown'
        response = requests.post(url=url, headers=header, data=body, verify=False, timeout=30).json()
        return response['data']['result']['totalMoney']
    except Exception as e:
        print("cash_exchangePage Error", e)
        return 0

def start():
    scriptName = '### 签到领现金-助力 ###'
    print(scriptName)
    global cookiesList, userNameList, pinNameList, ckNum, cashCount, cashCountdict
    cookiesList, userNameList, pinNameList = getCk.iscookie()
    for ckname in cash_zlzh:
        try:
            ckNum = userNameList.index(ckname)
        except Exception as e:
            try:
                ckNum = pinNameList.index(unquote(ckname))
            except:
                print(f"请检查被助力账号【{ckname}】名称是否正确？提示：助力名字可填pt_pin的值、也可以填账号名。")
                continue

        print(f"### 开始助力账号【{userNameList[int(ckNum)]}】###")
        inviteCode, shareDate = getShareCode(buildHeader(cookiesList[ckNum]))
        if inviteCode == 0:
            print(f"## {userNameList[int(ckNum)]}  获取互助码失败。请稍后再试！")
            continue
        u = 0
        for i in cookiesList:
            if i == cookiesList[ckNum]:
                u += 1
                continue
            result = helpCode(buildHeader(i), inviteCode, shareDate, u+1, userNameList[u], userNameList[ckNum])
            if result:
                break
            time.sleep(sleepNum)
            u += 1
        totalMoney = cash_exchangePage(cookiesList[ckNum])
        cashCount += totalMoney
        cashCountdict[userNameList[ckNum]] = totalMoney

    print("\n-------------------------")
    for i in cashCountdict.keys():
        msg(f"账号【{i}】当前现金: ￥{cashCountdict[i]}")
    msg("## 总累计获得 ￥%.2f" % cashCount)
    try:
        send(scriptName, msg_info)
    except:
        pass


if __name__ == '__main__':
    start()
