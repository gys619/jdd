#!/usr/bin/env python3
# -*- coding: utf-8 -*
'''
项目名称: JD-Script / jd_zjd 
Author: Curtin
功能：微信小程序-赚京豆-瓜分10亿京豆自动助力，默认给账号1助力，多账号才能玩~
Date: 2021/6/25 下午9:16
TG交流 https://t.me/topstyle996
TG频道 https://t.me/TopStyle2021
updateTime: 2021.6.26 20:09
'''

#####
#ck 优先读取ENV的 变量 JD_COOKIE='ck1&ck2'  再到 【JDCookies.txt】 文件内的ck 最后才到脚本内 cookies=ck
cookies=''
#助力账号，如给账号1 2 10助力，则填 zlzh = [1,2,10] ,支持ENV export zlzh=[1,2,10]
zlzh = [1, ]
#####



import os, re
import requests
from urllib.parse import unquote
import json
import time
requests.packages.urllib3.disable_warnings()
pwd = os.path.dirname(os.path.abspath(__file__)) + os.sep
t = time.time()
aNum = 0

class getJDCookie(object):
    # 适配各种平台环境ck
    def getckfile(self):
        if os.path.exists('/ql/config/env.sh'):
            print("当前环境青龙面板新版")
            return '/ql/config/env.sh'
        elif os.path.exists('/ql/config/cookie.sh'):
            print("当前环境青龙面板旧版")
            return '/ql/config/env.sh'
        elif os.path.exists('/jd/config/config.sh'):
            print("当前环境V4")
            return '/jd/config/config.sh'
        elif os.path.exists(pwd + 'JDCookies.txt'):
            return pwd + 'JDCookies.txt'
        else:
            return pwd + 'JDCookies.txt'
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
                        cookies = ''
                        for i in cks:
                            cookies += i
            else:
                with open(pwd + 'JDCookies.txt', "w", encoding="utf-8") as f:
                    cks = "#多账号换行，以下示例：（通过正则获取此文件的ck，理论上可以自定义名字标记ck，也可以随意摆放ck）\n账号1【Curtinlv】cookie1;\n账号2【TopStyle】cookie2;"
                    f.write(cks)
                    f.close()
                pass
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


# 获取系统ENV环境参数优先使用 适合Ac、云服务等环境
# JD_COOKIE=cookie （多账号&分隔）
if "JD_COOKIE" in os.environ:
    if len(os.environ["JD_COOKIE"]) > 10:
        cookies = os.environ["JD_COOKIE"]
        print("已获取并使用Env环境 Cookie")
if "zlzh" in os.environ:
    if len(os.environ["zlzh"]) > 1:
        zlzh = os.environ["zlzh"]
        zlzh = zlzh.replace('[', '').replace(']', '').split(',')
        print("已获取并使用Env环境 zlzh")



# 开启助力任务
def starAssist(sid, headers):
    global aNum
    try:
        timestamp = int(round(t * 1000))
        url = 'https://api.m.jd.com/api?functionId=vvipclub_distributeBean_startAssist&body={%22activityIdEncrypted%22:%22' + sid + '%22,%22channel%22:%22FISSION_BEAN%22}&appid=swat_miniprogram&client=tjj_m&screen=1920*1080&osVersion=5.0.0&networkType=wifi&sdkName=orderDetail&sdkVersion=1.0.0&clientVersion=3.1.3&area=11&fromType=wxapp&timestamp=' + str(timestamp)
        resp = requests.get(url=url, headers=headers, verify=False, timeout=30).json()
        # if resp['success']:
        #     print(resp)
        aNum = 0
    except Exception as e:
        if aNum < 5:
            aNum += 1
            return starAssist(sid, headers)
        else:
            print("starAssist Error", e)
            exit(1)


#获取助力码
def getShareCode(headers):
    global assistStartRecordId, encPin, sid, aNum
    try:
        url = f'https://api.m.jd.com/api?functionId=distributeBeanActivityInfo&fromType=wxapp&timestamp={int(round(t * 1000))}'
        body = 'body=%7B%22paramData%22%3A%7B%22channel%22%3A%22FISSION_BEAN%22%7D%7D&appid=swat_miniprogram&client=tjj_m&screen=1920*1080&osVersion=5.0.0&networkType=wifi&sdkName=orderDetail&sdkVersion=1.0.0&clientVersion=3.1.3&area=11'
        responses = requests.post(url, headers=headers, data=body, verify=False, timeout=30).json()
        if responses['success']:
            data = responses['data']
            assistStartRecordId = data['assistStartRecordId']
            encPin = data['encPin']
            sid = data['id']
            aNum = 0
            return assistStartRecordId, encPin, sid
    except Exception as e:
        if aNum < 5:
            aNum += 1
            return getShareCode(headers)
        else:
            print("getShareCode Error", e)
            exit(2)

#设置请求头
def setHeaders(cookie):
    headers = {
        'Cookie': cookie,
        'content-type': 'application/x-www-form-urlencoded',
        'Connection': 'keep-alive',
        'Accept-Encoding': 'gzip,compress,br,deflate',
        'Referer': 'https://servicewechat.com/wxa5bf5ee667d91626/148/page-frame.html',
        'Host': 'api.m.jd.com',
        'User-Agent': 'Mozilla/5.0 (iPhone CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.7(0x1800072d) NetType/WIFI Language/zh_CN'
    }

    return headers

def assist(ck, sid, eid, aid, user, name, a):
    timestamp = int(round(t * 1000))
    headers = {
        'Cookie': ck + 'wxclient=gxhwx;ie_ai=1;',
        'Accept': '*/*',
        'Connection': 'keep-alive',
        'Referer': 'https://servicewechat.com/wxa5bf5ee667d91626/148/page-frame.html',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Host': 'api.m.jd.com',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.1(0x1800012a) NetType/WIFI Language/zh_CN',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-cn'
    }
    url = 'https://api.m.jd.com/api?functionId=vvipclub_distributeBean_assist&body=%7B%22activityIdEncrypted%22:%22' + sid + '%5Cn%22,%22assistStartRecordId%22:%22' + str(aid) + '%22,%22assistedPinEncrypted%22:%22' + eid + '%5Cn%22,%22channel%22:%22FISSION_BEAN%22%7D&appid=swat_miniprogram&client=tjj_m&screen=1920*1080&osVersion=5.0.0&networkType=wifi&sdkName=orderDetail&sdkVersion=1.0.0&clientVersion=3.1.3&area=1_72_4137_0&fromType=wxapp&timestamp=' + str(timestamp)
    resp = requests.get(url, headers=headers, verify=False, timeout=30).json()
    if resp['success']:
        print(f"用户{a}【{user}】助力【{name}】成功~")
        if resp['data']['assistedNum'] == 4:
            print("开启下一轮助力")
            starAssist(sid, header)
            getShareCode(header)
    else:
        print(f"用户{a}【{user}】助力【{name}】失败！！！")



#开始互助
def start():
    global header
    print("微信小程序-赚京豆-瓜分助力")
    cookiesList, userNameList, pinNameList = getCk.iscookie()
    for ckNum in zlzh:
        print(f"### 开始助力账号【{userNameList[int(ckNum)-1]}】###")
        header = setHeaders(cookiesList[int(ckNum)-1])
        getShareCode(header)
        starAssist(sid, header)
        getShareCode(header)
        a = 1
        for i, name in zip(cookiesList, userNameList):
            if a == ckNum:
                a += 1
            else:
                assist(i, sid, encPin, assistStartRecordId, name, userNameList[int(ckNum)-1], a)
                a += 1

if __name__ == '__main__':
    start()