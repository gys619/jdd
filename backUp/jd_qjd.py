#!/usr/bin/env python3
# -*- coding: utf-8 -*
# 全民抢京豆（8.6-8.16)
'''
项目名称: JD-Script / jd_qjd
Author: Curtin
功能：全民抢京豆（8.6-8.16）：https://h5.m.jd.com/rn/3MQXMdRUTeat9xqBSZDSCCAE9Eqz/index.html?has_native=0
    满160豆需要20人助力，每个用户目前只能助力2次不同的用户。
Date: 2021/7/3 上午10:02
TG交流 https://t.me/topstyle996
TG频道 https://t.me/TopStyle2021
update: 2021.7.24 14:21
建议cron: 0 0 6-16 8 *  python3 jd_qjd.py
new Env('全民抢京豆 8.6-8.16');
* 修复了助力活动不存在、增加了随机UA（如果未定义ua则启用随机UA）
* 新增推送
* 修复0点不能开团
* 兼容pin为中文转码编码
'''
# print("全民抢京豆(7.22-7.31）--活动已结束\nTG交流 https://t.me/topstyle996\nTG频道 https://t.me/TopStyle2021")
# exit(0)
# ck 优先读取【JDCookies.txt】 文件内的ck  再到 ENV的 变量 JD_COOKIE='ck1&ck2' 最后才到脚本内 cookies=ck
import sys
import re
import string
import random
import os
import time
import json
from urllib.parse import unquote
cookies = ''
qjd_zlzh = ['Your JD_User', '买买买']

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
# UA 可自定义你的，注意格式: jdapp;iPhone;10.0.4;13.1.1;93b4243eeb1af72d142991d85cba75c66873dca5;network/wifi;ADID/8679C062-A41A-4A25-88F1-50A7A3EEF34A;model/iPhone13,1;addressid/3723896896;appBuild/167707;jdSupportDarkMode/0
UserAgent = ''
# 限制速度 （秒）
sleepNum = 0.1

try:
    import requests
except Exception as e:
    print(e, "\n缺少requests 模块，请执行命令安装：python3 -m pip install requests")
    exit(3)
requests.packages.urllib3.disable_warnings()

pwd = os.path.dirname(os.path.abspath(__file__)) + os.sep
t = time.time()
aNum = 0
beanCount = 0
userCount = {}
# 获取通知服务


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
                    r = re.compile(r"pt_key=.*?pt_pin=.*?;",
                                   re.M | re.S | re.I)
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
        url = 'https://me-api.jd.com/user_new/info/GetJDUserInfoUnion'
        headers = {
            'Cookie': ck,
            'Accept': '*/*',
            'Referer': 'https://home.m.jd.com/myJd/home.action',
            'Accept-Encoding': 'gzip, deflate, br',
            'Host': 'me-api.jd.com',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Mobile/15E148 Safari/604.1',
            'Accept-Language': 'zh-cn'
        }
        try:
            # resp = requests.get(url=url,
            #                     headers=headers, timeout=60).json()
            # print(resp)
            # r = re.compile(r'GetJDUserInfoUnion.*?\((.*?)\)')
            # result = r.findall(resp)
            # userInfo = json.loads(result[0])
            # nickname = userInfo['data']['userInfo']['baseInfo']['nickname']
            # return ck, nickname
            return ck, ck
        except Exception as e:
            print(e)
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
if os.path.exists(v4f):
    try:
        with open(v4f, 'r', encoding='utf-8') as f:
            curenv = locals()
            for i in f.readlines():
                r = re.compile(
                    r'^export\s(.*?)=[\'\"]?([\w\.\-@#!&=_,\[\]\{\}\(\)]{1,})+[\'\"]{0,1}$', re.M | re.S | re.I)
                r = r.findall(i)
                if len(r) > 0:
                    for i in r:
                        if i[0] != 'JD_COOKIE':
                            curenv[i[0]] = getEnvs(i[1])
    except:
        pass

if "qjd_zlzh" in os.environ:
    if len(os.environ["qjd_zlzh"]) > 1:
        qjd_zlzh = os.environ["qjd_zlzh"]
        qjd_zlzh = qjd_zlzh.replace('[', '').replace(']', '').replace(
            '\'', '').replace(' ', '').split(',')
        print("已获取并使用Env环境 qjd_zlzh:", qjd_zlzh)


def userAgent():
    """
    随机生成一个UA
    :return:
    """
    if not UserAgent:
        uuid = ''.join(random.sample(
            '123456789abcdef123456789abcdef123456789abcdef123456789abcdef', 40))
        iosVer = ''.join(random.sample(
            ["14.5.1", "14.4", "14.3", "14.2", "14.1", "14.0.1", "13.7", "13.1.2", "13.1.1"], 1))
        iPhone = ''.join(random.sample(["8", "9", "10", "11", "12", "13"], 1))
        return f'jdapp;iPhone;10.0.4;{iosVer};{uuid};network/wifi;ADID/8679C062-A41A-4A25-88F1-50A7A3EEF34A;model/iPhone{iPhone},1;addressid/3723896896;appBuild/167707;jdSupportDarkMode/0'
    else:
        return UserAgent


def getShareCode(ck):
    global aNum
    try:
        # uuid = ''.join(random.sample('123456789abcdef123456789abcdef123456789abcdef123456789abcdef', 40))
        v_num1 = ''.join(random.sample(
            ["1", "2", "3", "4", "5", "6", "7", "8", "9"], 1)) + ''.join(random.sample(string.digits, 4))
        url1 = f'https://api.m.jd.com/client.action?functionId=signGroupHit&body=%7B%22activeType%22%3A2%7D&appid=ld&client=apple&clientVersion=10.0.6&networkType=wifi&osVersion=14.3&uuid=&jsonp=jsonp_' + \
            str(int(round(t * 1000))) + '_' + v_num1
        url = 'https://api.m.jd.com/client.action?functionId=signBeanGroupStageIndex&body=%7B%22monitor_refer%22%3A%22%22%2C%22rnVersion%22%3A%223.9%22%2C%22fp%22%3A%22-1%22%2C%22shshshfp%22%3A%22-1%22%2C%22shshshfpa%22%3A%22-1%22%2C%22referUrl%22%3A%22-1%22%2C%22userAgent%22%3A%22-1%22%2C%22jda%22%3A%22-1%22%2C%22monitor_source%22%3A%22bean_m_bean_index%22%7D&appid=ld&client=apple&clientVersion=&networkType=&osVersion=&uuid=&jsonp=jsonp_' + \
            str(int(round(t * 1000))) + '_' + v_num1
        head = {
            'Cookie': ck,
            'Accept': '*/*',
            'Connection': 'keep-alive',
            'Referer': 'https://h5.m.jd.com/rn/3MQXMdRUTeat9xqBSZDSCCAE9Eqz/index.html?has_native=0',
            'Accept-Encoding': 'gzip, deflate, br',
            'Host': 'api.m.jd.com',
            # 'User-Agent': 'Mozilla/5.0 (iPhone CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1',
            'User-Agent': userAgent(),
            'Accept-Language': 'zh-cn'
        }
        requests.get(url1,  headers=head, verify=False, timeout=30)
        resp = requests.get(url=url, headers=head,
                            verify=False, timeout=30).text
        r = re.compile(r'jsonp_.*?\((.*?)\)\;', re.M | re.S | re.I)
        result = r.findall(resp)
        jsonp = json.loads(result[0])
        try:
            groupCode = jsonp['data']['groupCode']
            shareCode = jsonp['data']['shareCode']
            activityId = jsonp['data']['activityMsg']['activityId']
            sumBeanNumStr = int(jsonp['data']['sumBeanNumStr'])
        except:
            if aNum < 5:
                aNum += 1
                return getShareCode(ck)
            else:
                groupCode = 0
                shareCode = 0
                sumBeanNumStr = 0
                aNum = 0
                activityId = 0
        aNum = 0
        return groupCode, shareCode, sumBeanNumStr, activityId
    except Exception as e:
        print(f"getShareCode Error", e)


def helpCode(ck, groupCode, shareCode, u, unum, user, activityId):
    try:
        v_num1 = ''.join(random.sample(
            ["1", "2", "3", "4", "5", "6", "7", "8", "9"], 1)) + ''.join(random.sample(string.digits, 4))
        headers = {
            'Cookie': ck,
            'Accept': '*/*',
            'Connection': 'keep-alive',
            'Referer': f'https://h5.m.jd.com/rn/42yjy8na6pFsq1cx9MJQ5aTgu3kX/index.html?jklActivityId=115&source=SignSuccess&jklGroupCode={groupCode}&ad_od=1&jklShareCode={shareCode}',
            'Accept-Encoding': 'gzip, deflate, br',
            'Host': 'api.m.jd.com',
            'User-Agent': userAgent(),
            'Accept-Language': 'zh-cn'
        }
        url = 'https://api.m.jd.com/client.action?functionId=signGroupHelp&body=%7B%22activeType%22%3A2%2C%22groupCode%22%3A%22' + \
            str(groupCode) + '%22%2C%22shareCode%22%3A%22' + shareCode + \
            f'%22%2C%22activeId%22%3A%22{activityId}%22%2C%22source%22%3A%22guest%22%7D&appid=ld&client=apple&clientVersion=10.0.4&networkType=wifi&osVersion=13.7&uuid=&openudid=&jsonp=jsonp_{int(round(t * 1000))}_{v_num1}'
        resp = requests.get(url=url, headers=headers,
                            verify=False, timeout=30).text
        r = re.compile(r'jsonp_.*?\((.*?)\)\;', re.M | re.S | re.I)
        result = r.findall(resp)
        jsonp = json.loads(result[0])
        helpToast = jsonp['data']['helpToast']
        pageFlag = jsonp['data']['pageFlag']
        if pageFlag == 0:
            print(f"账号{unum}【{u}】助力失败! 原因：{helpToast}")
            if '满' in helpToast:
                print(f"## 恭喜账号【{user}】团已满，今日累计获得160豆")
                return True
            return False
        else:
            if '火' in helpToast:
                print(f"账号{unum}【{u}】助力失败! 原因：{helpToast}")
            else:
                print(f"账号{unum}【{u}】{helpToast} , 您也获得1豆哦~")
            return False
    except Exception as e:
        print(f"helpCode Error ", e)


def start():
    scriptName = '### 全民抢京豆-助力 ###'
    print(scriptName)
    global cookiesList, userNameList, pinNameList, ckNum, beanCount, userCount
    cookiesList, userNameList, pinNameList = getCk.iscookie()
    for ckname in qjd_zlzh:
        try:
            ckNum = userNameList.index(ckname)
        except Exception as e:
            try:
                ckNum = pinNameList.index(unquote(ckname))
            except:
                print(f"请检查被助力账号【{ckname}】名称是否正确？提示：助力名字可填pt_pin的值、也可以填账号名。")
                continue

        print(f"### 开始助力账号【{userNameList[int(ckNum)]}】###")
        groupCode, shareCode, sumBeanNumStr, activityId = getShareCode(
            cookiesList[ckNum])
        if groupCode == 0:
            msg(f"## {userNameList[int(ckNum)]}  获取互助码失败。请手动分享后再试~ 或建议早上再跑。")
            continue
        u = 0
        for i in cookiesList:
            if i == cookiesList[ckNum]:
                u += 1
                continue
            result = helpCode(
                i, groupCode, shareCode, userNameList[u], u+1, userNameList[int(ckNum)], activityId)
            time.sleep(sleepNum)
            if result:
                break
            u += 1
        groupCode, shareCode, sumBeanNumStr, activityId = getShareCode(
            cookiesList[ckNum])
        userCount[f'{userNameList[ckNum]}'] = sumBeanNumStr
        beanCount += sumBeanNumStr
    print("\n-------------------------")
    for i in userCount.keys():
        msg(f"账号【{i}】已抢京豆: {userCount[i]}")
    msg(f"## 今日累计获得 {beanCount} 京豆")
    try:
        send(scriptName, msg_info)
    except:
        pass


if __name__ == '__main__':
    start()
