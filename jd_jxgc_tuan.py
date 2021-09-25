#!/usr/bin/env python3
# -*- coding: utf-8 -*
'''
cron: 0 0,7,10 * * * jd_jxgc_tuan.py
new Env('京喜工厂开团');
'''
#ck 优先读取【JDCookies.txt】 文件内的ck  再到 ENV的 变量 JD_COOKIE='ck1&ck2' 最后才到脚本内 cookies=ck
cookies = ''
# 设置开团的账号可填用户名 或 pin的值不要; env 设置 export jxgc_kaituan="用户1&用户2"
# jxgc_kaituan = ['用户1','用户2']
jxgc_kaituan = []

#京喜UA
UserAgent = ''

import os, re, sys
import random
try:
    import requests
except Exception as e:
    print(e, "\n缺少requests 模块，请执行命令安装：pip3 install requests")
    exit(3)
from urllib.parse import unquote, quote
import json
import time, datetime
requests.packages.urllib3.disable_warnings()
pwd = os.path.dirname(os.path.abspath(__file__)) + os.sep
from hashlib import sha256, sha512, md5
import hmac

appId = 10001
activeId = 'Xj2_3G-hQ4GRLCsLqIxFeQ%3D%3D'

countElectric = {}
def userAgent():
    global iosV
    """
    随机生成一个UA
    :return: ua
    """
    if not UserAgent:
        uuid = ''.join(random.sample('123456789abcdef123456789abcdef123456789abcdef123456789abcdef', 40))
        addressid = ''.join(random.sample('1234567898647', 10))
        iosVer = ''.join(random.sample(["14.5.1", "14.4", "14.3", "14.2", "14.1", "14.0.1", "13.7", "13.1.2", "13.1.1"], 1))
        iosV = iosVer.replace('.', '_')
        iPhone = ''.join(random.sample(["8", "9", "10", "11", "12", "13"], 1))
        ADID = ''.join(random.sample('0987654321ABCDEF', 8)) + '-' + ''.join(random.sample('0987654321ABCDEF', 4)) + '-' + ''.join(random.sample('0987654321ABCDEF', 4)) + '-' + ''.join(random.sample('0987654321ABCDEF', 4)) + '-' + ''.join(random.sample('0987654321ABCDEF', 12))
        return f'jdpingou;iPhone;4.11.0;{iosVer};{uuid};network/wifi;model/iPhone{iPhone},1;appBuild/100591;ADID/{ADID};supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/0;hasOCPay/0;supportBestPay/0;session/8;pap/JA2019_3111789;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS {iosV} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
    else:
        return UserAgent

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
            if sys.platform == 'ios':
                resp = requests.get(url=url, verify=False, headers=headers, timeout=60).json()
            else:
                resp = requests.get(url=url, headers=headers, timeout=60).json()
            if resp['retcode'] == "0":
                nickname = resp['data']['userInfo']['baseInfo']['nickname']
                return ck, nickname
            else:
                context = f"账号{userNum}【{pinName}】Cookie 已失效！请重新获取。"
                print(context)
                return ck, False
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
if os.path.exists(v4f):
    try:
        with open(v4f, 'r', encoding='utf-8') as f:
            curenv = locals()
            for i in f.readlines():
                r = re.compile(r'^export\s(.*?)=[\'\"]?([\w\.\-@#!&=_,\[\]\{\}\(\)]{1,})+[\'\"]{0,1}$', re.M | re.S | re.I)
                r = r.findall(i)
                if len(r) > 0:
                    for i in r:
                        if i[0] != 'JD_COOKIE':
                            curenv[i[0]] = getEnvs(i[1])
    except:
        pass

if "jxgc_kaituan" in os.environ:
    if len(os.environ["jxgc_kaituan"]) > 1:
        jxgc_kaituan = os.environ["jxgc_kaituan"]
        if '&' in jxgc_kaituan:
            jxgc_kaituan = jxgc_kaituan.replace('[', '').replace(']', '').replace('\'', '').replace(' ', '').split('&')
        elif ',' in jxgc_kaituan:
            jxgc_kaituan = jxgc_kaituan.replace('[', '').replace(']', '').replace('\'', '').replace(' ', '').split(',')
        elif '@' in jxgc_kaituan:
            jxgc_kaituan = jxgc_kaituan.replace('[', '').replace(']', '').replace('\'', '').replace(' ', '').split('@')
        print("已获取并使用Env环境 jxgc_kaituan:", jxgc_kaituan)
if not isinstance(jxgc_kaituan, list):
    jxgc_kaituan = jxgc_kaituan.split(" ")

def getactiveId():
    global activeId
    url = 'https://wqsd.jd.com/pingou/dream_factory/index.html'
    headers = {
        "Upgrade-Insecure-Requests": 1,
        "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Mobile Safari/537.36"
    }
    result = requests.get(url, headers, timeout=30).text
    r = re.compile(r'activeId=(Xj2_.*?),')
    r = r.findall(result)
    if len(r) > 0:
        activeId = r[0]
        print(f"当前最新activeId【{activeId}】")


def get_sign(algo, data, key):
    key = key.encode('utf-8')
    message = data.encode('utf-8')
    if algo == 'HmacSHA256':
        algo = sha256
    elif algo == 'HmacSHA512':
        algo = sha512
    elif algo == 'HmacMD5':
        algo = md5
    elif algo == 'SHA256':
        data_sha = sha256(data.encode('utf-8')).hexdigest()
        return data_sha
    elif algo == 'SHA512':
        data_sha = sha512(data.encode('utf-8')).hexdigest()
        return data_sha
    elif algo == 'MD5':
        data_sha = md5(data.encode('utf-8')).hexdigest()
        return data_sha
    else:
        print("加密方式有误！")
        return None
    sign = hmac.new(key, message, digestmod=algo).hexdigest()
    return sign

def stimestamp():
    return round(time.time() * 1000)

def snowtime():
    dateNow = datetime.datetime.now().strftime('%Y%m%d%H%M%s')
    return dateNow[:17]

def createFingerprint():
    a = ''.join(random.sample('0123456789578', 13)) + '{}'.format(stimestamp())
    return a[:16]

def requestAlgo(st, time):
    try:
        fingerprint = createFingerprint()
        timestamp = snowtime()
        url = 'https://cactus.jd.com/request_algo?g_ty=ajax'
        headers = {
            'Authority': 'cactus.jd.com',
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache',
            'Accept': 'application/json',
            'User-Agent': f'Mozilla/5.0 (iPhone; CPU iPhone OS {iosV} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
            'Content-Type': 'application/json',
            'Origin': 'https://st.jingxi.com',
            'Sec-Fetch-Site': 'cross-site',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Referer': 'https://st.jingxi.com/',
            'Accept-Language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8,en;q=0.7'
        }
        body = {
                "version": "1.0",
                "fp": '{}'.format(fingerprint),
                "appId": '10001',
                "timestamp": stimestamp(),
                "platform": "web",
                "expandParams": ""
        }
        r = requests.post(url, headers=headers, data=json.dumps(body)).json()
        if r['status'] == 200:
            tk = r['data']['result']['tk']
            algo = r['data']['result']['algo']
            digestmod = re.findall(r'algo\.(\w+)\(', algo)
            random = re.findall(r'random=\'(.*?)\';', algo)
            if len(digestmod) > 0 and len(random) > 0:
                str1 = tk + fingerprint + timestamp + str(appId) + random[0]
                sign_1 = get_sign(digestmod[0], str1, tk)
                sign_2 = get_sign('HmacSHA256', st, sign_1)
                h5st = f'{timestamp};{fingerprint};{appId};{tk};{sign_2}'
                return quote(h5st)
        else:
            return '20210719013616266;9380516527487162;10001;tk01wab221c7aa8nd3BUZVQ1WGtaMK+sxvDXNfSVujUpKaI09IAqtgAh5cX7cO7FGnxH0v1PkRxW+jTezknjx/gtPt6E;2eb7d74f89e12f1348f939909eaf509061bfe1ce25f5d138d0d1481438d79a31'
    except Exception as e:
        print(e)
        return '20210719013616266;5462077388591162;10001;tk01wb2d81c27a8nQWdpRkR2Y3RaL3gQ/jH3eRdiIuTP9vzGiTKpzoHDDPonzXICHw4Lln9KXEa89nFvp4B3WygX4M7y;9e96e2f52fb8db4cb0c555866b123cf00e00a941241a43843e2bd0fd9c2eb144'
##
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

def getResult(text):
    try:
        r = re.compile(r'try\s{jsonp.*?\((.*?)\)', re.M | re.S | re.I)
        r = r.findall(text)
        if len(r) > 0:
            return json.loads(r[0])
        else:
            return text
    except Exception as e:
        print(e)
        return text
def buildURL(ck, url):
    headers = {
        'Cookie': ck,
        'Accept': '*/*',
        'Connection': 'keep-alive',
        'Referer': 'https://st.jingxi.com/pingou/dream_factory/divide.html',
        'Accept-Encoding': 'gzip, deflate, br',
        'Host': 'm.jingxi.com',
        'User-Agent': userAgent(),
        'Accept-Language': 'zh-cn'
    }
    try:
        url = unquote(url)
        time = re.findall(r'_time=(.*?)&', url)[0]
        _stk = re.findall(r'_stk=(.*?)&', url)[0]
        _stklist = _stk.split(',')
        oh5st = re.findall(r'h5st=(.*?)&', url)[0]
        names = locals()
        st = ''
        s = 0
        for i in range(len(_stklist)):
            names[_stklist[i]] = re.findall(r"{0}=(.*?)&".format(_stklist[i]), url)[0]
            if s == len(_stklist)-1:
                st = st + str(_stklist[i]) + ':' + names[_stklist[i]]
            else:
                st = st + str(_stklist[i]) + ':' + names[_stklist[i]] + "&"
            s += 1
        h5st = requestAlgo(st, time)
        url = url.replace(oh5st, h5st)
        # url1 = re.findall(r'(.*?\?)', url)[0]
        # url2 = re.findall(r'https://m.jingxi.com/dreamfactory.*?\?(.*)', url)[0]
        return headers, url

    except Exception as e:
        print("buildURL Error", e)
        return headers, url

def QueryAllTuan(ck):
    try:
        AllTuan = []
        _time = stimestamp()
        url = f'https://m.jingxi.com/dreamfactory/tuan/QueryAllTuan?activeId={activeId}&pageNo=1&pageSize=10&_time={_time}&_stk=_time%2CactiveId%2CpageNo%2CpageSize&_ste=1&h5st=20210724105729296%3B2467674280075162%3B10001%3Btk01wd39c1d7da8nL1htbzNBcHNnmnd2bEuQS%2FQohlxJNFyOR90QddNilWUQmE0YQnLVcpFrNUjse9fV6hmDawaHelzp%3Be247245ec2f99f76e05cdc80187dc718c90d3ae409ad9dee55dd412e350a64f6&_={int(_time)+12}&sceneval=2&g_login_type=1&callback=jsonpCBKF&g_ty=ls'
        headers, url = buildURL(ck, url)
        r = requests.get(url, headers=headers, timeout=30, verify=False).text
        data = getResult(r)
        for i in data['tuanInfo']:
            AllTuan.append(i['tuanId'])
        if len(AllTuan) > 0:
            return AllTuan
        else:
            return False
    except Exception as e:
        print(e)
        return False
def QueryActiveConfig(ck):
    try:
        _time = stimestamp()
        url = f'https://m.jingxi.com/dreamfactory/tuan/QueryActiveConfig?activeId={activeId}&tuanId=&_time={_time}&_stk=_time%2CactiveId%2CtuanId&_ste=1&h5st=20210717213423401%3B4316088645437162%3B10001%3Btk01w692e1a35a8nelBVM0N0NEliPUhE8RRHmMdPdJCfVENO%2FE71ZoMM98S4V67ihTo7hDW75aJaU5V2XpU99JrsLPEF%3Bfd20eeaf2e88c127d898c14c6c941e80097a01c7d235c405316a08ab70709e20&_={int(_time) + 4}&sceneval=2&g_login_type=1&callback=jsonpCBKF&g_ty=ls'
        headers, url = buildURL(ck, url)
        r = requests.get(url, headers=headers, timeout=30, verify=False).text
        data = getResult(r)
        tuanId = data['data']['userTuanInfo']['tuanId']
        isOpenTuan = data['data']['userTuanInfo']['isOpenTuan']
        surplusOpenTuanNum = data['data']['userTuanInfo']['surplusOpenTuanNum']
        encryptPin = data['data']['userInfo']['encryptPin']
        return tuanId, isOpenTuan, surplusOpenTuanNum, encryptPin
    except Exception as e:
        print(data)
        print("QueryActiveConfig Errpr", e)

def Award(ck, tuanId):
    global countElectric
    try:
        _time = stimestamp()
        tuanIdList = QueryAllTuan(ck)
        if tuanIdList:
            for i in tuanIdList:
                url = f'https://m.jingxi.com/dreamfactory/tuan/Award?activeId={activeId}&tuanId={i}&_time={_time}&_stk=_time%2CactiveId%2CtuanId&_ste=1&h5st=20210718191447407%3B7117923136170161%3B10001%3Btk01wbabf1c6fa8nVWEzUnhGbkVXu%2BU5JvIH0sBY5KdtN%2FeUVwp%2FzPwCL7k9379OjujqfoLqoyJBK57podKunhi70f1O%3B434f9d888ab5f727dc6bae9fd0122d18165bc800f3de4ce70b0fd9b4bc23561d&_={int(_time)+12}&sceneval=2&g_login_type=1&callback=jsonpCBKF&g_ty=ls'
                headers, url = buildURL(ck, url)
                r = requests.get(url, headers=headers, timeout=30, verify=False).text
                data = getResult(r)
                if data['msg'] == 'OK':
                    electric = data['data']['electric']
                    print(f"账号【{userNameList[ckNum]}】:获取电力 :{electric}")
                    try:
                        countElectric['{0}'.format(userNameList[ckNum])] += electric
                    except:
                        countElectric['{0}'.format(userNameList[ckNum])] = electric
                else:
                    print(f"账号【{userNameList[ckNum]}】:{data['msg']}")
    except Exception as e:
        print("Award Error ", e)
def CreateTuan(ck):
    try:
        tuanId, isOpenTuan, surplusOpenTuanNum, encryptPin = QueryActiveConfig(ck)
        if surplusOpenTuanNum != 0:
            _time = stimestamp()
            url = f'https://m.jingxi.com/dreamfactory/tuan/CreateTuan?activeId={activeId}&isOpenApp=1&_time={_time}&_stk=_time%2CactiveId%2CisOpenApp&_ste=1&h5st=20210717213421615%3B4316088645437162%3B10001%3Btk01w692e1a35a8nelBVM0N0NEliPUhE8RRHmMdPdJCfVENO%2FE71ZoMM98S4V67ihTo7hDW75aJaU5V2XpU99JrsLPEF%3Bfe30749da12b4aab179b7fa95c4f7c20f46fda2cc50228293a47a337f1b3b734&_={int(_time) + 4}&sceneval=2&g_login_type=1&callback=jsonpCBKE&g_ty=ls'
            headers, url = buildURL(ck, url)
            r = requests.get(url, headers=headers, timeout=30, verify=False).text
            getResult(r)
            return tuanId, surplusOpenTuanNum
        else:
            return tuanId, surplusOpenTuanNum
    except Exception as e:
        print("CreateTuan Error", e)

def JoinTuan(ck, tuanId, u, suser, user):
    global cookiesList
    try:
        _time = stimestamp()
        url = f'https://m.jingxi.com/dreamfactory/tuan/JoinTuan?activeId={activeId}&tuanId={tuanId}&_time={_time}&_stk=_time%2CactiveId%2CtuanId&_ste=1&h5st=20210717213558108%3B7117923136170161%3B10001%3Btk01wbabf1c6fa8nVWEzUnhGbkVXu%2BU5JvIH0sBY5KdtN%2FeUVwp%2FzPwCL7k9379OjujqfoLqoyJBK57podKunhi70f1O%3B81b27455ee7e75153e85c3ebb3bb4ada876200faa31d0e792037390b79ce5eff&_={int(_time) + 103}&sceneval=2&g_login_type=1&callback=jsonpCBKF&g_ty=ls'
        headers, url = buildURL(ck, url)
        r = requests.get(url, headers=headers, timeout=30, verify=False).text
        data = getResult(r)
        ret = data['ret']
        if ret == 0:
            print(f"用户{u}【{user}】=>【{suser}】:{data['msg']}  加团成功谢谢你~")
            cookiesList.remove(ck)
            return False
        elif ret == 10209:
            print(f"【{suser}】:{data['msg']}")
            return True
        elif ret == 10005:
            print(f"用户{u}【{user}】=>【{suser}】:{data['msg']}")
            return False
        else:
            print(f"用户{u}【{user}】=>【{suser}】:{data['msg']}")
            return False
    except Exception as e:
        print("JoinTuan Error", e)



def start():
    scriptName = '### 京喜工厂-开团 ###'
    print(scriptName)
    global cookiesList, userNameList, pinNameList, ckNum
    cookiesList, userNameList, pinNameList = getCk.iscookie()
    setUserNum = len(jxgc_kaituan)
    if setUserNum > 0:
        pass
    else:
        print("提示：你还没设置开团的账号，变量：export jxgc_kaituan=\"用户1&用户2\"")
        print(f"本次默认给【账号1】{userNameList[0]}开团")
        jxgc_kaituan.append(userNameList[0])
    getactiveId()
    for ckname in jxgc_kaituan:
        try:
            ckNum = userNameList.index(ckname)
        except Exception as e:
            try:
                ckNum = pinNameList.index(unquote(ckname))
            except:
                print(f"请检查被助力账号【{ckname}】名称是否正确？提示：助力名字可填pt_pin的值、也可以填账号名。")
                continue
        userName = userNameList[ckNum]
        s = 1
        for i in range(3):
            print(f"【{userNameList[ckNum]}】开始第{i+1}次开团")
            tuanId, surplusOpenTuanNum = CreateTuan(cookiesList[ckNum])
            if i+1 == 1:
                s_label = surplusOpenTuanNum
            else:
                if surplusOpenTuanNum == s_label:
                    print(f'好友没有助力机会了')
                    break
            if tuanId:
                u = 1
                for i in cookiesList:
                    if i == cookiesList[ckNum]:
                        u += 1
                        continue
                    if JoinTuan(i, tuanId, u, suser=userName, user=userNameList[cookiesList.index(i)]):
                        Award(cookiesList[ckNum], tuanId)
                        break
                    u += 1
            else:
                print(f'用户【{userName}】，今天已完成所有团。')
                break
            s += 1
        Award(cookiesList[ckNum], "")
    try:
        u = 1
        for name in countElectric.keys():
            if u == 1:
                msg("\n###【本次统计 {}】###\n".format(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
            msg(f"账号【{name}】\n\t└成功领取电力:{countElectric[name]}")
            u += 1
        if '成功领取电力' in msg_info:
            send(scriptName, msg_info)
    except:
        pass
if __name__ == '__main__':
    start()