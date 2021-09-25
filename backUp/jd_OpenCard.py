#!/bin/env python3
# -*- coding: utf-8 -*
'''
项目名称: JD_OpenCard
Author: Curtin
功能：JD入会开卡领取京豆
CreateDate: 2021/5/4 下午1:47
UpdateTime: 2021/6/19
'''
version = 'v1.2.2'
readmes = """
# JD入会领豆小程序
![JD入会领豆小程序](https://raw.githubusercontent.com/curtinlv/JD-Script/main/OpenCrad/resultCount.png)

## 使用方法
#### [手机用户（参考） https://mp.weixin.qq.com/s/ih6aOURXWM-iKrhvMyR3mw](https://mp.weixin.qq.com/s/ih6aOURXWM-iKrhvMyR3mw)
#### [PC用户 （参考） https://mp.weixin.qq.com/s/JmLxAecZAlEc4L2sZWnn1A](https://mp.weixin.qq.com/s/JmLxAecZAlEc4L2sZWnn1A)
#### [v4-bot用户 （参考） https://github.com/curtinlv/JD-Script/pull/12#issue-652134788](https://github.com/curtinlv/JD-Script/pull/12#issue-652134788)

##  目录结构
    JD-Script/                  #仓库
    |-- LICENSE
    |-- OpenCard                # 主目录
    |   |-- jd_OpenCard.py      # 主代码 （必要）
    |   |-- log                 # 临时目录（可删除）
    |   |-- OpenCardConfig.ini  # 只配置文件（必要）
    |   |-- Readme.md           # 说明书
    |   `-- start.sh            # shell脚本（非必要）
    `-- README.md

    log目录结构、临时目录（可删除）：
    log
    ├── memory.json                        # 记忆、统计功能临时存放参数
    ├── shopid-2021-05-23.txt              # 记录所有送豆的shopid
    ├── 入会N豆以上的shopid-2021-05-23.txt   # 记录满足入会条件的shopid
    ├── 入会汇总.txt                        # 记录所有入会店铺送豆的加入、注销链接
    ├── 可退会账号【账号id】.txt              # 记录跑脚本之前已经过入会且目前送豆的注销链接（可优先退会）

### `【兼容环境】`
    1.Python3.3+ 环境
    2.兼容ios设备软件：Pythonista 3、Pyto(已测试正常跑，其他软件自行测试)   
    3.Windows exe 

    安装依赖模块 :
    pip3 install requests
    执行：
    python3 jd_OpenCard.py

    start.sh 脚本运行方法：
    1.适合定时任务或不想依赖ini配置文件。 
    2.支持单号跑多开，如
       cp start.sh start_2.sh
       sh start_2.sh  #只跑里面配置的参数，如cookie
    3.定时任务（参考）：
       0 8 * * * sh /home/curtin/JD-Script/OpenCard/start.sh
       2 8 * * * sh /home/curtin/JD-Script/OpenCard/start_2.sh

## `【更新记录】`
    2021.6.19: (v1.2.2)
        * 修复多线程报错
    2021.6.14: (v1.2.1)
        * 新增单双线程控制
        * 修复一些问题，如腾讯云跑异常报错。
    2021.5.28：（v1.2.0）
        * 新增单或多账号并发
            - Concurrent=yes #开启
        * 新增企业微信、Bark推送
        * 优化一些逻辑
            - 如随机账号查询礼包，仅开启单账号时候
            - 京豆统计
    2021.5.23：(v1.1.1)
        * 修复一些问题及优化一些代码
        * 修复Env环境读取变量问题
        * 新增 start.sh 运行脚本（可Env环境使用）
            - 运行方式 sh start.sh
    2021.5.21：(v1.1.0)
        * 修复一些问题及优化一些代码：
            - 修复最后统计显示为0，新增开卡个数统计
            - 修复记忆功能一些bug
            - 等等一些小问题
        * 新增机器人通知
            - 开启远程shopid、配合crontab 坐等收豆
    2021.5.15：(v1.0.5)
        * 新增远程获取shopid功能
            - isRemoteSid=yes #开启
        * 修改已知Bug

    2021.5.9：(v1.0.4 Beta)
        * 优化代码逻辑
        * 打包exe版本测试

    2021.5.8：(v1.0.3)
        * 优化记忆功能逻辑：
            - cookiek个数检测
            - shopid个数检测
            - 上一次中断最后记录的账号id检测不存在本次ck里面
            - 临时文件log/memory.json是否存在
            - 以上任意一条命中则记忆接力功能不生效。

    2021.5.7：(v1.0.2)
        * 优化代码逻辑
        * 修复已知Bug

    2021.5.5：(v1.0.1)
        * 新增记忆功能，如中断后下次跑会接着力跑（默认开启）
            - memory= True
        * 新增仅记录shopid，不入会功能（默认关闭）
            - onlyRecord = no
        * 修复已知Bug

    2021.5.4：(v1.0.0)
        * 支持多账号
            - JD_COOKIE=pt_key=xxx;pt_pin=xxx;&pt_key=xxx;pt_pin=xxx; #多账号&分隔
        * 限制京豆数量入会，例如只入50豆以上
            - openCardBean = 50
        * 双线程运行
            - 默认开启，且您没得选择。
        * 记录满足条件的shopid 【record= True】默认开启 （./log 目录可删除）
            - log/可销卡汇总.txt #记录开卡送豆的店铺销卡链接
            - log/shopid-yyyy-mm-dd.txt #记录当天所有入会送豆的shopid
            - log/可销卡账号xxx.txt #记录账号可销卡的店铺

### `【账号参数配置说明】`
### 主配置文件[ OpenCardConfig.ini ] 请保持utf-8默认格式

 变量  | 值  | 说明
 ---- | ----- | ------  
 JD_COOKIE  | pt_key=xxx;pt_pin=xxx;  | 必要(多账号&分隔) 
 openCardBean  | 30 | int，入会送豆满足此值，否则不入会 
 record    | False或True | 布尔值，是否记录符合条件的shopid(默认True) 
 onlyRecord  | False或True |布尔值， True:仅记录，不入会(默认False) 
 memory  | False或True | 布尔值，开启记忆功能，接力上一次异常中断位置继续。(默认yes) 
 printlog  | False或True | 布尔值，True：只打印部分日志 False:打印所有日志 
 sleepNum  | False或True | Float，限制速度，单位秒，如果请求过快报错适当调整0.5秒以上 
 isRemoteSid  | False或True | 布尔值，True:使用作者远程仓库更新的id，False：使用本地shopid.txt的id 
#### 兼容Env环境（如有配置则优先使用，适合AC、云服务环境等）    
        export JD_COOKIE='pt_key=xxx;pt_pin=xxx;' (多账号&分隔)
        export openCardBean=30
        export xxx=xxx

#### Ps:您可以到以下途径获取最新的shopid.txt，定期更新：

###### [GitHub仓库 https://github.com/curtinlv/JD-Script](https://github.com/curtinlv/JD-Script) 
###### [Gitee仓库 https://gitee.com/curtinlv/JD-Script](https://gitee.com/curtinlv/JD-Script)
###### [TG频道 https://t.me/TopStyle2021](https://t.me/TopStyle2021)
###### [TG群 https://t.me/topStyle996](https://t.me/topStyle996)
###### 关注公众号【TopStyle】回复：shopid
![TopStyle](https://gitee.com/curtinlv/img/raw/master/gzhcode.jpg)
# 
    @Last Version: %s

    @Last Time: 2021-06-19 13:55

    @Author: Curtin
#### **仅以学习交流为主，请勿商业用途、禁止违反国家法律 ，转载请留个名字，谢谢!** 

# End.
[回到顶部](#readme)
""" % version

################################ 【Main】################################
import time, os, sys, datetime
import requests
import random, string
import re, json, base64
from urllib.parse import unquote, quote_plus
from threading import Thread
from configparser import RawConfigParser

# 定义一些要用到参数
requests.packages.urllib3.disable_warnings()
scriptHeader = """
════════════════════════════════════════
║                                      ║
║      JD   入   会   领   豆           ║
║                                      ║
════════════════════════════════════════
@Version: {}""".format(version)
remarks = '\n\n\tTG交流 : https://t.me/topstyle996\n\n\tTG频道 : https://t.me/TopStyle2021\n\n\t公众号 : TopStyle\n\n\t\t\t--By Curtin\n'

timestamp = int(round(time.time() * 1000))
today = datetime.datetime.now().strftime('%Y-%m-%d')
# 获取当前工作目录
pwd = os.path.dirname(os.path.abspath(__file__)) + os.sep

######
openCardBean = 0
sleepNum = 0.0
record = True
onlyRecord = False
memory = True
printlog = True
isRemoteSid = True
Concurrent = True
TG_BOT_TOKEN = ''
TG_USER_ID = ''
PUSH_PLUS_TOKEN = ''
TG_PROXY_IP = ''
TG_PROXY_PORT = ''
TG_API_HOST = ''
QYWX_AM = ''
BARK = ''
DoubleThread = True

# 获取账号参数
try:
    configinfo = RawConfigParser()
    try:
        configinfo.read(pwd + "OpenCardConfig.ini", encoding="UTF-8")
    except Exception as e:
        with open(pwd + "OpenCardConfig.ini", "r", encoding="UTF-8") as config:
            getConfig = config.read().encode('utf-8').decode('utf-8-sig')
        with open(pwd + "OpenCardConfig.ini", "w", encoding="UTF-8") as config:
            config.write(getConfig)
        try:
            configinfo.read(pwd + "OpenCardConfig.ini", encoding="UTF-8")
        except:
            configinfo.read(pwd + "OpenCardConfig.ini", encoding="gbk")
    cookies = configinfo.get('main', 'JD_COOKIE')
    openCardBean = configinfo.getint('main', 'openCardBean')
    sleepNum = configinfo.getfloat('main', 'sleepNum')
    record = configinfo.getboolean('main', 'record')
    onlyRecord = configinfo.getboolean('main', 'onlyRecord')
    memory = configinfo.getboolean('main', 'memory')
    printlog = configinfo.getboolean('main', 'printlog')
    isRemoteSid = configinfo.getboolean('main', 'isRemoteSid')
    TG_BOT_TOKEN = configinfo.get('main', 'TG_BOT_TOKEN')
    TG_USER_ID = configinfo.get('main', 'TG_USER_ID')
    PUSH_PLUS_TOKEN = configinfo.get('main', 'PUSH_PLUS_TOKEN')
    TG_PROXY_IP = configinfo.get('main', 'TG_PROXY_IP')
    TG_PROXY_PORT = configinfo.get('main', 'TG_PROXY_PORT')
    TG_API_HOST = configinfo.get('main', 'TG_API_HOST')
    QYWX_AM = configinfo.get('main', 'QYWX_AM')
    Concurrent = configinfo.getboolean('main', 'Concurrent')
    DoubleThread = configinfo.getboolean('main', 'DoubleThread')
    BARK = configinfo.get('main', 'BARK')
except Exception as e:
    OpenCardConfigLabel = 1
    print("参数配置有误，请检查OpenCardConfig.ini\nError:", e)
    print("尝试从Env环境获取！")

def getBool(label):
    try:
        if label == 'True' or label == 'yes' or label == 'true' or label == 'Yes':
            return True
        elif label == 'False' or label == 'no' or label == 'false' or label == 'No':
            return False
        else:
            return True
    except Exception as e:
        print(e)

# 获取系统ENV环境参数优先使用 适合Ac、云服务等环境
# JD_COOKIE=cookie （多账号&分隔）
if "JD_COOKIE" in os.environ:
    if len(os.environ["JD_COOKIE"]) > 10:
        cookies = os.environ["JD_COOKIE"]
        print("已获取并使用Env环境 Cookie")
# 只入送豆数量大于此值
if "openCardBean" in os.environ:
    if len(os.environ["openCardBean"]) > 0:
        openCardBean = int(os.environ["openCardBean"])
        print("已获取并使用Env环境 openCardBean:", openCardBean)
    elif not openCardBean:
        openCardBean = 0
# 是否开启双线程
if "DoubleThread" in os.environ:
    if len(os.environ["DoubleThread"]) > 1:
        DoubleThread = getBool(os.environ["DoubleThread"])
        print("已获取并使用Env环境 DoubleThread", DoubleThread)
# 多账号并发
if "Concurrent" in os.environ:
    if len(os.environ["Concurrent"]) > 1:
        Concurrent = getBool(os.environ["Concurrent"])
        print("已获取并使用Env环境 Concurrent", Concurrent)
    elif not Concurrent:
        Concurrent = True
# 限制速度，单位秒，如果请求过快报错适当调整0.5秒以上
if "sleepNum" in os.environ:
    if len(os.environ["sleepNum"]) > 0:
        sleepNum = float(os.environ["sleepNum"])
        print("已获取并使用Env环境 sleepNum:", sleepNum)
    elif not sleepNum:
        sleepNum = 0
if "printlog" in os.environ:
    if len(os.environ["printlog"]) > 1:
        printlog = getBool(os.environ["printlog"])
        print("已获取并使用Env环境 printlog:", printlog)
    elif not printlog:
        printlog = True
    # 是否记录符合条件的shopid，输出文件【OpenCardlog/yes_shopid.txt】 False|True
if "record" in os.environ:
    if len(os.environ["record"]) > 1:
        record = getBool(os.environ["record"])
        print("已获取并使用Env环境 record:", record)
    elif not record:
        record = True
# 仅记录，不入会。入会有豆的shopid输出文件
if "onlyRecord" in os.environ:
    if len(os.environ["onlyRecord"]) > 1:
        onlyRecord = getBool(os.environ["onlyRecord"])
        print("已获取并使用Env环境 onlyRecord:", onlyRecord)
    elif not onlyRecord:
        onlyRecord = False
# 开启记忆， 需要record=True且 memory= True 才生效
if "memory" in os.environ:
    if len(os.environ["memory"]) > 1:
        memory = getBool(os.environ["memory"])
        print("已获取并使用Env环境 memory:", memory)
    elif not memory:
        memory = True
# 是否启用远程shopid
if "isRemoteSid" in os.environ:
    if len(os.environ["isRemoteSid"]) > 1:
        isRemoteSid = getBool(os.environ["isRemoteSid"])
        print("已获取并使用Env环境 isRemoteSid:", isRemoteSid)
    elif not isRemoteSid:
        isRemoteSid = True
# 获取TG_BOT_TOKEN
if "TG_BOT_TOKEN" in os.environ:
    if len(os.environ["TG_BOT_TOKEN"]) > 1:
        TG_BOT_TOKEN = os.environ["TG_BOT_TOKEN"]
        print("已获取并使用Env环境 TG_BOT_TOKEN")
# 获取TG_USER_ID
if "TG_USER_ID" in os.environ:
    if len(os.environ["TG_USER_ID"]) > 1:
        TG_USER_ID = os.environ["TG_USER_ID"]
        print("已获取并使用Env环境 TG_USER_ID")
# 获取代理ip
if "TG_PROXY_IP" in os.environ:
    if len(os.environ["TG_PROXY_IP"]) > 1:
        TG_PROXY_IP = os.environ["TG_PROXY_IP"]
        print("已获取并使用Env环境 TG_PROXY_IP")
# 获取TG 代理端口
if "TG_PROXY_PORT" in os.environ:
    if len(os.environ["TG_PROXY_PORT"]) > 1:
        TG_PROXY_PORT = os.environ["TG_PROXY_PORT"]
        print("已获取并使用Env环境 TG_PROXY_PORT")
    elif not TG_PROXY_PORT:
        TG_PROXY_PORT = ''
# 获取TG TG_API_HOST
if "TG_API_HOST" in os.environ:
    if len(os.environ["TG_API_HOST"]) > 1:
        TG_API_HOST = os.environ["TG_API_HOST"]
        print("已获取并使用Env环境 TG_API_HOST")
# 获取pushplus+ PUSH_PLUS_TOKEN
if "PUSH_PLUS_TOKEN" in os.environ:
    if len(os.environ["PUSH_PLUS_TOKEN"]) > 1:
        PUSH_PLUS_TOKEN = os.environ["PUSH_PLUS_TOKEN"]
        print("已获取并使用Env环境 PUSH_PLUS_TOKEN")
# 获取企业微信应用推送 QYWX_AM
if "QYWX_AM" in os.environ:
    if len(os.environ["QYWX_AM"]) > 1:
        QYWX_AM = os.environ["QYWX_AM"]
        print("已获取并使用Env环境 QYWX_AM")
# 获取企业微信应用推送 QYWX_AM
if "BARK" in os.environ:
    if len(os.environ["BARK"]) > 1:
        BARK = os.environ["BARK"]
        print("已获取并使用Env环境 BARK")
# 判断参数是否存在
try:
    cookies
except NameError as e:
    var_exists = False
    print("[OpenCardConfig.ini] 和 [Env环境] 都无法获取到您的cookies，请配置!\nError:", e)
    time.sleep(60)
    exit(1)
else:
    var_exists = True

# 创建临时目录
if not os.path.exists(pwd + "log"):
    os.mkdir(pwd + "log")
# 记录功能json
memoryJson = {}
message_info = ''
notify_mode = []

################################### Function ################################
class TaskThread(Thread):
    """
    处理task相关的线程类
    """

    def __init__(self, func, args=()):
        super(TaskThread, self).__init__()
        self.func = func  # 要执行的task类型
        self.args = args  # 要传入的参数

    def run(self):
        self.result = self.func(*self.args)  # 将任务执行结果赋值给self.result变量

    def get_result(self):
        # 改方法返回task函数的执行结果,方法名不是非要get_result
        try:
            return self.result
        except Exception as ex:
            print(ex)
            return "ERROR"

def nowtime():
    return datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')


def printinfo(context, label: bool):
    if label == False:
        print(context)

def exitCodeFun(code):
    try:
        if sys.platform == 'win32' or sys.platform == 'cygwin':
            print("连按回车键即可退出窗口！")
            exitCode = input()
        exit(code)
    except:
        time.sleep(3)
        exit(code)

def message(str_msg):
    global message_info
    print(str_msg)
    message_info = "{}\n{}".format(message_info, str_msg)
    sys.stdout.flush()

# 获取通知，
if PUSH_PLUS_TOKEN:
    notify_mode.append('pushplus')
if TG_BOT_TOKEN and TG_USER_ID:
    notify_mode.append('telegram_bot')
if QYWX_AM:
    notify_mode.append('wecom_app')
if BARK:
    notify_mode.append('bark')

# tg通知
def telegram_bot(title, content):
    try:
        print("\n")
        bot_token = TG_BOT_TOKEN
        user_id = TG_USER_ID
        if not bot_token or not user_id:
            print("tg服务的bot_token或者user_id未设置!!\n取消推送")
            return
        print("tg服务启动")
        if TG_API_HOST:
            if 'http' in TG_API_HOST:
                url = f"{TG_API_HOST}/bot{TG_BOT_TOKEN}/sendMessage"
            else:
                url = f"https://{TG_API_HOST}/bot{TG_BOT_TOKEN}/sendMessage"
        else:
            url = f"https://api.telegram.org/bot{TG_BOT_TOKEN}/sendMessage"

        headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        payload = {'chat_id': str(TG_USER_ID), 'text': f'{title}\n\n{content}', 'disable_web_page_preview': 'true'}
        proxies = None
        if TG_PROXY_IP and TG_PROXY_PORT:
            proxyStr = "http://{}:{}".format(TG_PROXY_IP, TG_PROXY_PORT)
            proxies = {"http": proxyStr, "https": proxyStr}
        try:
            response = requests.post(url=url, headers=headers, params=payload, proxies=proxies).json()
        except:
            print('推送失败！')
        if response['ok']:
            print('推送成功！')
        else:
            print('推送失败！')
    except Exception as e:
        print(e)

# push推送
def pushplus_bot(title, content):
    try:
        print("\n")
        if not PUSH_PLUS_TOKEN:
            print("PUSHPLUS服务的token未设置!!\n取消推送")
            return
        print("PUSHPLUS服务启动")
        url = 'http://www.pushplus.plus/send'
        data = {
            "token": PUSH_PLUS_TOKEN,
            "title": title,
            "content": content
        }
        body = json.dumps(data).encode(encoding='utf-8')
        headers = {'Content-Type': 'application/json'}
        response = requests.post(url=url, data=body, headers=headers).json()
        if response['code'] == 200:
            print('推送成功！')
        else:
            print('推送失败！')
    except Exception as e:
        print(e)

# BARK
def bark_push(title, content):
    print("\n")
    if not BARK:
        print("bark服务的bark_token未设置!!\n取消推送")
        return
    print("bark服务启动")
    try:
        response = requests.get('''https://api.day.app/{0}/{1}/{2}'''.format(BARK, title, quote_plus(content))).json()
        if response['code'] == 200:
            print('推送成功！')
        else:
            print('推送失败！')
    except Exception as e:
        print(e)
        print('Bark推送失败！')

def send(title, content):
    """
    使用 bark, telegram bot, dingding bot, serverJ 发送手机推送
    :param title:
    :param content:
    :return:
    """
    content = content + "\n\n" + footer
    for i in notify_mode:

        if i == 'telegram_bot':
            if TG_BOT_TOKEN and TG_USER_ID:
                telegram_bot(title=title, content=content)
            else:
                print('未启用 telegram机器人')
            continue
        elif i == 'pushplus':
            if PUSH_PLUS_TOKEN:
                pushplus_bot(title=title, content=content)
            else:
                print('未启用 PUSHPLUS机器人')
            continue
        elif i == 'wecom_app':
            if QYWX_AM:
                wecom_app(title=title, content=content)
            else:
                print('未启用企业微信应用消息推送')
            continue
        elif i == 'bark':
            if BARK:
                bark_push(title=title, content=content)
            else:
                print('未启用Bark APP应用消息推送')
            continue
        else:
            print('此类推送方式不存在')

# 企业微信 APP 推送
def wecom_app(title, content):
    try:
        if not QYWX_AM:
            print("QYWX_AM 并未设置！！\n取消推送")
            return
        QYWX_AM_AY = re.split(',', QYWX_AM)
        if 4 < len(QYWX_AM_AY) > 5:
            print("QYWX_AM 设置错误！！\n取消推送")
            return
        corpid = QYWX_AM_AY[0]
        corpsecret = QYWX_AM_AY[1]
        touser = QYWX_AM_AY[2]
        agentid = QYWX_AM_AY[3]
        try:
            media_id = QYWX_AM_AY[4]
        except:
            media_id = ''
        wx = WeCom(corpid, corpsecret, agentid)
        # 如果没有配置 media_id 默认就以 text 方式发送
        if not media_id:
            message = title + '\n\n' + content
            response = wx.send_text(message, touser)
        else:
            response = wx.send_mpnews(title, content, media_id, touser)
        if response == 'ok':
            print('推送成功！')
        else:
            print('推送失败！错误信息如下：\n', response)
    except Exception as e:
        print(e)

class WeCom:
    def __init__(self, corpid, corpsecret, agentid):
        self.CORPID = corpid
        self.CORPSECRET = corpsecret
        self.AGENTID = agentid

    def get_access_token(self):
        url = 'https://qyapi.weixin.qq.com/cgi-bin/gettoken'
        values = {'corpid': self.CORPID,
                  'corpsecret': self.CORPSECRET,
                  }
        req = requests.post(url, params=values)
        data = json.loads(req.text)
        return data["access_token"]

    def send_text(self, message, touser="@all"):
        send_url = 'https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=' + self.get_access_token()
        send_values = {
            "touser": touser,
            "msgtype": "text",
            "agentid": self.AGENTID,
            "text": {
                "content": message
            },
            "safe": "0"
        }
        send_msges = (bytes(json.dumps(send_values), 'utf-8'))
        respone = requests.post(send_url, send_msges)
        respone = respone.json()
        return respone["errmsg"]

    def send_mpnews(self, title, message, media_id, touser="@all"):
        send_url = 'https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=' + self.get_access_token()
        send_values = {
            "touser": touser,
            "msgtype": "mpnews",
            "agentid": self.AGENTID,
            "mpnews": {
                "articles": [
                    {
                        "title": title,
                        "thumb_media_id": media_id,
                        "author": "Author",
                        "content_source_url": "",
                        "content": message.replace('\n', '<br/>'),
                        "digest": message
                    }
                ]
            }
        }
        send_msges = (bytes(json.dumps(send_values), 'utf-8'))
        respone = requests.post(send_url, send_msges)
        respone = respone.json()
        return respone["errmsg"]

# 检测cookie格式是否正确
def iscookie():
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
            message("您已配置{}个账号".format(len(result)))
            u = 1
            for i in result:
                r = re.compile(r"pt_pin=(.*?);")
                pinName = r.findall(i)
                pinName = unquote(pinName[0])
                # 获取账号名
                ck, nickname = getUserInfo(i, pinName, u)
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
                message("没有可用Cookie，已退出")
                exitCodeFun(3)
        else:
            message("cookie 格式错误！...本次操作已退出")
            exitCodeFun(4)
    else:
        message("cookie 格式错误！...本次操作已退出")
        exitCodeFun(4)

# 检查是否有更新版本

def gettext(url):
    try:
        resp = requests.get(url, timeout=60).text
        if '该内容无法显示' in resp:
            return gettext(url)
        return resp
    except Exception as e:
        print(e)

def isUpdate():
    global footer, readme1, readme2, readme3, uPversion
    url = base64.decodebytes(
        b"aHR0cHM6Ly9naXRlZS5jb20vY3VydGlubHYvUHVibGljL3Jhdy9tYXN0ZXIvT3BlbkNhcmQvdXBkYXRlLmpzb24=")
    try:
        result = gettext(url)
        result = json.loads(result)
        isEnable = result['isEnable']
        uPversion = result['version']
        info = result['info']
        readme1 = result['readme1']
        readme2 = result['readme2']
        readme3 = result['readme3']
        pError = result['m']
        footer = result['footer']
        getWait = result['s']
        if isEnable > 50 and isEnable < 150:
            if version != uPversion:
                print(f"\n当前最新版本：【{uPversion}】\n\n{info}\n")
                message(f"{readme1}{readme2}{readme3}")
                time.sleep(getWait)
            else:
                message(f"{readme1}{readme2}{readme3}")
                time.sleep(getWait)
        else:
            print(pError)
            time.sleep(300)
            exit(666)

    except:
        message("请检查您的环境/版本是否正常！")
        time.sleep(10)
        exit(666)

def getUserInfo(ck, pinName, userNum):
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
        message(context)
        send("【JD入会领豆】Cookie 已失效！", context)
        return ck, False

# 设置Headers
def setHeaders(cookie, intype):
    if intype == 'mall':
        headers = {

            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Host": "mall.jd.com",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Safari/605.1.15",
            "Accept-Language": "zh-cn",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "close"
        }
        return headers
    elif intype == 'JDApp':
        headers = {
            'Cookie': cookie,
            'Accept': "*/*",
            'Connection': "close",
            'Referer': "https://shopmember.m.jd.com/shopcard/?",
            'Accept-Encoding': "gzip, deflate, br",
            'Host': "api.m.jd.com",
            'User-Agent': "jdapp;iPhone;9.4.8;14.3;809409cbd5bb8a0fa8fff41378c1afe91b8075ad;network/wifi;ADID/201EDE7F-5111-49E8-9F0D-CCF9677CD6FE;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone13,4;addressid/;supportBestPay/0;appBuild/167629;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
            'Accept-Language': "zh-cn"
        }
        return headers
    elif intype == 'mh5':
        headers = {
            'Cookie': cookie,
            'Accept': "*/*",
            'Connection': "close",
            'Referer': "https://shopmember.m.jd.com/shopcard/?",
            'Accept-Encoding': "gzip, deflate, br",
            'Host': "api.m.jd.com",
            'User-Agent': "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
            'Accept-Language': "zh-cn"

        }
        return headers

# 记录符合件的shopid到本地文件保存 当前目录：OpenCardlog/shopid-yyyy-mm-dd.txt 或 log-yyyy-mm-dd.txt
def outfile(filename, context, iscover):
    """
    :param filename: 文件名 默认txt格式
    :param context: 写入内容
    :param iscover: 是否覆盖 False or True
    :return:
    """
    if record == True:
        try:
            if iscover == False:
                with open(pwd + "log/{0}".format(filename), "a+", encoding="utf-8") as f1:
                    f1.write("{}\n".format(context))
                    f1.close()
            elif iscover == True:
                with open(pwd + "{0}".format(filename), "w+", encoding="utf-8") as f1:
                    f1.write("{}".format(context))
                    f1.close()
        except Exception as e:
            print(e)

# 记忆功能 默认双线程
def memoryFun(startNum, threadNum, usernameLabel, username, getallbean, userCount):
    global memoryJson
    if memory == True:
        if usernameLabel == True:
            memoryJson['allShopidNum'] = endShopidNum
            memoryJson['currUser{}'.format(threadNum)] = username
            memoryJson['t{}_startNum'.format(threadNum)] = startNum
            memoryJson['allUserCount'] = userCount
    if usernameLabel == False:
        try:

            memoryJson['{}'.format(username)]
            memoryJson['{}'.format(username)] += getallbean
        except:
            memoryJson['{}'.format(username)] = getallbean
        try:
            memoryJson['{}_ok'.format(username)]
            memoryJson['{}_ok'.format(username)] += 1
        except:
            memoryJson['{}_ok'.format(username)] = 1

    try:
        if os.path.exists(pwd + "log"):
            with open(pwd + "log/memory.json", "w+", encoding="utf-8") as f:
                json.dump(memoryJson, f, indent=4)
        else:
            pass
    except Exception as e:
        print(e)


# 修复记忆功能一些问题，如记录累计京豆统计显示为0等
def isMemoryEnable():
    global memoryJson
    memoryJson = getMemory()

# 获取记忆配置
def getMemory():
    """
    :return: memoryJson
    """
    if os.path.exists(pwd + "log/memory.json"):
        with open(pwd + "log/memory.json", "r", encoding="utf-8") as f:
            memoryJson = json.load(f)
            if len(memoryJson) > 0:
                return memoryJson
    else:
        pass


def rmCount():
    if os.path.exists(pwd + "log/入会汇总.txt"):
        os.remove(pwd + "log/入会汇总.txt")
    if os.path.exists(pwd + "log/memory.json"):
        os.remove(pwd + "log/memory.json")

# 判断是否启用记忆功能
def isMemory(memorylabel, startNum1, startNum2, midNum, endNum, pinNameList):
    """
    :param memorylabel: 记忆标签
    :param startNum1: 线程1默认开始位置
    :param startNum2: 线程2默认开始位置
    :param midNum:  线程1默认结束位置
    :param endNum: 线程2默认结束位置
    :return: startNum1, startNum2, memorylabel
    """
    if memory == True and memorylabel == 0:
        try:
            memoryJson = getMemory()
            if memoryJson['allShopidNum'] == endNum:
                currUserLabel = 0

                if memoryJson['allUserCount'] == allUserCount:
                    for u in pinNameList:
                        if memoryJson['currUser1'] == u:
                            currUserLabel += 1
                        elif memoryJson['currUser2'] == u:
                            currUserLabel += 1
                    if memoryJson['currUser1'] == memoryJson['currUser2']:
                        currUserLabel = 2
                    if currUserLabel < 2:
                        print("通知：检测到您配置的CK有变更，本次记忆功能不生效。")
                        rmCount()
                        return startNum1, startNum2, memorylabel
                    if memoryJson['t1_startNum'] + 1 == midNum and memoryJson['t2_startNum'] + 1 == endNum:
                        print(
                            f"\n上次已完成所有shopid，\n\nPs:您可以关注公众号或TG频道获取最新shopid。\n公众号: TopStyle\n电报TG:https://t.me/TopStyle2021\n\n请输入 0 或 1\n0 : 退出。\n1 : 重新跑一次，以防有漏")
                        try:
                            getyourNum = int(input("正在等待您的选择："))
                            if getyourNum == 1:
                                print("Ok,那就重新跑一次~")
                                rmCount()
                                memorylabel = 1
                                return startNum1, startNum2, memorylabel
                            elif getyourNum == 0:
                                print("Ok,已退出~")
                                time.sleep(10)
                                exit(0)
                        except:
                            # print("Error: 您的输入有误！已退出。")
                            exitCodeFun(3)
                    else:
                        isMemoryEnable()
                        if memoryJson['t1_startNum']:
                            startNum1 = memoryJson['t1_startNum']
                            message(f"已启用记忆功能 memory= True，线程1从第【{startNum1}】店铺开始")
                        if memoryJson['t2_startNum']:
                            startNum2 = memoryJson['t2_startNum']
                            message(f"已启用记忆功能 memory= True，线程2从第【{startNum2}】店铺开始")
                        memorylabel = 1
                        return startNum1, startNum2, memorylabel
                else:
                    message("通知：检测到您配置的CK有变更，本次记忆功能不生效。")
                    rmCount()
                    return startNum1, startNum2, memorylabel
            else:
                message("通知：检测到shopid有更新，本次记忆功能不生效。")
                rmCount()
                memorylabel = 1
                return startNum1, startNum2, memorylabel
        except Exception as e:
            memorylabel = 1
            return startNum1, startNum2, memorylabel
    else:
        rmCount()
        memorylabel = 1
        return startNum1, startNum2, memorylabel

# 获取VenderId
def getVenderId(shopId, headers):
    """
    :param shopId:
    :param headers
    :return: venderId
    """
    url = 'https://mall.jd.com/index-{0}.html'.format(shopId)
    resp = requests.get(url=url, verify=False, headers=headers, timeout=60)
    resulttext = resp.text
    r = re.compile(r'shopId=\d+&id=(\d+)"')
    venderId = r.findall(resulttext)
    return venderId[0]

# 查询礼包
def getShopOpenCardInfo(venderId, headers, shopid, userName, user_num):
    """
    :param venderId:
    :param headers:
    :return: activityId,getBean 或 返回 0:没豆 1:有豆已是会员 2:记录模式（不入会）
    """
    num1 = string.digits
    v_num1 = ''.join(random.sample(["1", "2", "3", "4", "5", "6", "7", "8", "9"], 1)) + ''.join(
        random.sample(num1, 4))  # 随机生成一窜4位数字
    url = 'https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=getShopOpenCardInfo&body=%7B%22venderId%22%3A%22{2}%22%2C%22channel%22%3A406%7D&client=H5&clientVersion=9.2.0&uuid=&jsonp=jsonp_{0}_{1}'.format(
        timestamp, v_num1, venderId)
    resp = requests.get(url=url, verify=False, headers=headers, timeout=60)
    time.sleep(sleepNum)
    resulttxt = resp.text
    r = re.compile(r'jsonp_.*?\((.*?)\)\;', re.M | re.S | re.I)
    result = r.findall(resulttxt)
    cardInfo = json.loads(result[0])
    venderCardName = cardInfo['result']['shopMemberCardInfo']['venderCardName']  # 店铺名称
    if user_num == 1:
        printinfo(f"\t└查询入会礼包【{venderCardName}】", printlog)
    openCardStatus = cardInfo['result']['userInfo']['openCardStatus']  # 是否会员
    interestsRuleList = cardInfo['result']['interestsRuleList']
    if interestsRuleList == None:
        if user_num == 1:
            printinfo("\t\t└查询该店入会没有送豆，不入会", printlog)
        return 0, 0
    try:
        if len(interestsRuleList) > 0:
            for i in interestsRuleList:
                if "京豆" in i['prizeName']:
                    getBean = int(i['discountString'])
                    activityId = i['interestsInfo']['activityId']
                    context = "{0}".format(shopid)
                    outfile(f"shopid-{today}.txt", context, False)  # 记录所有送豆的shopid
                    in_url = 'https://shop.m.jd.com/?shopId={}'.format(shopid)
                    url = 'https://shopmember.m.jd.com/member/memberCloseAccount?venderId={}'.format(venderId)
                    context = "[{0}]:入会{2}豆店铺【{1}】\n\t加入会员:{4}\n\t解绑会员:{3}".format(nowtime(), venderCardName, getBean,
                                                                                   url, in_url)  # 记录
                    if user_num == 1:
                        outfile("入会汇总.txt", context, False)
                    if getBean >= openCardBean:  # 判断豆是否符合您的需求
                        print(f"\t└账号{user_num}【{userName}】{venderCardName}:入会赠送【{getBean}豆】，可入会")
                        context = "{0}".format(shopid)
                        outfile(f"入会{openCardBean}豆以上的shopid-{today}.txt", context, False)
                        if onlyRecord == True:
                            if user_num == 1:
                                print("已开启仅记录，不入会。")
                            return 2, 2
                        if openCardStatus == 1:
                            url = 'https://shopmember.m.jd.com/member/memberCloseAccount?venderId={}'.format(venderId)
                            print("\t\t└[账号：{0}]:您已经是本店会员，请注销会员卡24小时后再来~\n注销链接:{1}".format(userName, url))
                            context = "[{3}]:入会{1}豆，{0}销卡：{2}".format(venderCardName, getBean, url, nowtime())
                            outfile("可退会账号【{0}】.txt".format(userName), context, False)
                            return 1, 1
                        return activityId, getBean
                    else:
                        if user_num == 1:
                            print(f'\t\t└{venderCardName}:入会送【{getBean}】豆少于【{openCardBean}豆】,不入...')
                        if onlyRecord == True:
                            if user_num == 1:
                                print("已开启仅记录，不入会。")
                            return 2, 2
                        return 0, openCardStatus

                else:
                    pass
            if user_num == 1:
                printinfo("\t\t└查询该店入会没有送豆，不入会", printlog)
            return 0, 0
        else:
            return 0, 0
    except Exception as e:
        print(e)

# 开卡
def bindWithVender(venderId, shopId, activityId, channel, headers):
    """
    :param venderId:
    :param shopId:
    :param activityId:
    :param channel:
    :param headers:
    :return: result : 开卡结果
    """
    num = string.ascii_letters + string.digits
    v_name = ''.join(random.sample(num, 10))
    num1 = string.digits
    v_num1 = ''.join(random.sample(["1", "2", "3", "4", "5", "6", "7", "8", "9"], 1)) + ''.join(random.sample(num1, 4))
    qq_num = ''.join(random.sample(["1", "2", "3", "4", "5", "6", "7", "8", "9"], 1)) + ''.join(
        random.sample(num1, 8)) + "@qq.com"
    url = 'https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=bindWithVender&body=%7B%22venderId%22%3A%22{4}%22%2C%22shopId%22%3A%22{7}%22%2C%22bindByVerifyCodeFlag%22%3A1%2C%22registerExtend%22%3A%7B%22v_sex%22%3A%22%E6%9C%AA%E7%9F%A5%22%2C%22v_name%22%3A%22{0}%22%2C%22v_birthday%22%3A%221990-03-18%22%2C%22v_email%22%3A%22{6}%22%7D%2C%22writeChildFlag%22%3A0%2C%22activityId%22%3A{5}%2C%22channel%22%3A{3}%7D&client=H5&clientVersion=9.2.0&uuid=&jsonp=jsonp_{1}_{2}'.format(
        v_name, timestamp, v_num1, channel, venderId, activityId, qq_num, shopId)
    try:
        respon = requests.get(url=url, verify=False, headers=headers, timeout=60)
        result = respon.text
        return result
    except Exception as e:
        print(e)

# 获取开卡结果
def getResult(resulttxt, userName, user_num):
    r = re.compile(r'jsonp_.*?\((.*?)\)\;', re.M | re.S | re.I)
    result = r.findall(resulttxt)
    for i in result:
        result_data = json.loads(i)
        busiCode = result_data['busiCode']
        if busiCode == '0':
            message = result_data['message']
            try:
                result = result_data['result']['giftInfo']['giftList']
                print(f"\t\t└账号{user_num}【{userName}】:{message}")
                for i in result:
                    print("\t\t\t└{0}:{1} ".format(i['prizeTypeName'], i['discount']))
            except:
                print(f'\t\t└账号{user_num}【{userName}】:{message}')
            return busiCode
        else:
            print("\t\t└账号{0}【{1}】:{2}".format(user_num, userName, result_data['message']))
            return busiCode


def getRemoteShopid():
    global shopidList, venderidList
    shopidList = []
    venderidList = []
    url = base64.decodebytes(
        b"aHR0cHM6Ly9naXRlZS5jb20vY3VydGlubHYvUHVibGljL3Jhdy9tYXN0ZXIvT3BlbkNhcmQvc2hvcGlkLnR4dA==")
    try:
        rShopid = gettext(url)
        rShopid = rShopid.split("\n")
        for i in rShopid:
            if len(i) > 0:
                shopidList.append(i.split(':')[0])
                venderidList.append(i.split(':')[1])
        return shopidList, venderidList
    except:
        print("无法从远程获取shopid")
        exitCodeFun(999)


# 读取shopid.txt
def getShopID():
    shopid_path = pwd + "shopid.txt"
    try:
        with open(shopid_path, "r", encoding="utf-8") as f:
            shopid = f.read()
            if len(shopid) > 0:
                shopid = shopid.split("\n")
                return shopid
            else:
                print("Error:请检查shopid.txt文件是否正常！\n")
                exitCodeFun(2)
    except Exception as e:
        print("Error:请检查shopid.txt文件是否正常！\n", e)
        exitCodeFun(2)

# 进度条
def progress_bar(start, end, threadNum):
    print("\r", end="")
    if threadNum == 2:
        start2 = start - midNum
        end2 = end - midNum
        print("\n###[{1}]:线程{2}【当前进度: {0}%】\n".format(round(start2 / end2 * 100, 2), nowtime(), threadNum))
    elif threadNum == 1:
        print("\n###[{1}]:线程{2}【当前进度: {0}%】\n".format(round(start / end * 100, 2), nowtime(), threadNum))
    sys.stdout.flush()

## 多账号并发
def sss(ii, ck, userName, pinName, endNum, user_num, shopids, threadNum):
    if ii % 10 == 0 and ii != 0 and user_num == 1:
        progress_bar(ii, endNum, threadNum)
    try:
        if len(shopids[ii]) > 0:
            headers_b = setHeaders(ck, "mall")  # 获取请求头
            if isRemoteSid:
                venderId = venderidList[shopidList.index(shopids[ii])]
            else:
                venderId = getVenderId(shopids[ii], headers_b)  # 获取venderId
            time.sleep(sleepNum)  # 根据您需求是否限制请求速度
            # 新增记忆功能
            memoryFun(ii, threadNum, True, pinName, 0, allUserCount)
            headers_a = setHeaders(ck, "mh5")
            activityId, getBean = getShopOpenCardInfo(venderId, headers_a, shopids[ii], userName, user_num)  # 获取入会礼包结果
            #  activityId,getBean 或 返回 0:没豆 1:有豆已是会员 2:记录模式（不入会）
            time.sleep(sleepNum)  # 根据账号需求是否限制请求速度
            if activityId == 0 or activityId == 2:
                pass
            elif activityId > 10:
                headers = setHeaders(ck, "JDApp")
                result = bindWithVender(venderId, shopids[ii], activityId, 208, headers)
                busiCode = getResult(result, userName, user_num)
                if busiCode == '0':
                    memoryFun(ii, threadNum, False, pinName, getBean, allUserCount)
                    memoryJson = getMemory()
                    print(f"账号{user_num}:【{userName}】累计获得：{memoryJson['{}'.format(pinName)]} 京豆")
                    time.sleep(sleepNum)

        else:
            pass
    except Exception as e:
        if user_num == 1:
            print(f"【Error】：多账号并发报错，请求过快建议适当调整 sleepNum 参数限制速度 \n{e}")

# 为多线程准备
def OpenVipCard(startNum: int, endNum: int, shopids, cookies, userNames, pinNameList, threadNum):
    sssLabel = 0
    for i in range(startNum, endNum):
        user_num = 1
        if Concurrent:
            if sssLabel == 0 and threadNum == 1:
                if DoubleThread:
                    message("当前模式: 双线程，多账号并发运行")
                else:
                    message("当前模式: 单线程，多账号并发运行")
                sssLabel = 1
            threads = []
            for ck, userName, pinName in zip(cookies, userNames, pinNameList):
                tt = TaskThread(sss, args=(i, ck, userName, pinName, endNum, user_num, shopids, threadNum))
                threads.append(tt)
                tt.start()
                user_num += 1
                time.sleep(sleepNum)
            for t in threads:
                t.join()
                time.sleep(sleepNum)
        else:
            if sssLabel == 0 and threadNum == 1:
                if DoubleThread:
                    message("当前模式: 双线程，单账号运行")
                else:
                    message("当前模式: 单线程，单账号运行")
                sssLabel = 1
            activityIdLabel = 0
            for ck, userName, pinName in zip(cookies, userNames, pinNameList):
                if i % 10 == 0 and i != 0:
                    progress_bar(i, endNum, threadNum)
                try:
                    if len(shopids[i]) > 0:
                        headers_b = setHeaders(ck, "mall")  # 获取请求头
                        venderId = getVenderId(shopids[i], headers_b)  # 获取venderId
                        time.sleep(sleepNum)  # 根据账号需求是否限制请求速度
                        # 新增记忆功能
                        memoryFun(i, threadNum, True, pinName, 0, allUserCount)
                        if activityIdLabel == 0:
                            s = random.randint(0, allUserCount - 1)
                            headers_a = setHeaders(cookies[s], "mh5")
                            activityId, getBean = getShopOpenCardInfo(venderId, headers_a, shopids[i], userName,
                                                                      user_num)  # 获取入会礼包结果
                        #  activityId,getBean 或 返回 0:没豆 1:有豆已是会员 2:记录模式（不入会）
                        time.sleep(sleepNum)  # 根据账号需求是否限制请求速度
                        if activityId == 0 or activityId == 2:
                            break
                        elif activityId == 1:
                            user_num += 1
                            continue
                        elif activityId > 10:
                            activityIdLabel = 1
                            headers = setHeaders(ck, "JDApp")
                            result = bindWithVender(venderId, shopids[i], activityId, 208, headers)
                            busiCode = getResult(result, userName, user_num)
                            if busiCode == '0':
                                memoryFun(i, threadNum, False, pinName, getBean, allUserCount)
                                memoryJson = getMemory()
                                print(f"账号{user_num}:【{userName}】累计获得：{memoryJson['{}'.format(pinName)]} 京豆")
                                time.sleep(sleepNum)
                        else:
                            break
                except Exception as e:
                    user_num += 1
                    print(e)
                    continue
                user_num += 1
# start
def start():
    global allUserCount
    print(scriptHeader)
    outfile("Readme.md", readmes, True)
    isUpdate()
    global endShopidNum, midNum, allUserCount
    if isRemoteSid:
        message("已启用远程获取shopid")
        allShopid, venderidList = getRemoteShopid()
    else:
        message("从本地shopid.txt获取shopid")
        allShopid = getShopID()
    allShopid = list(set(allShopid))
    endShopidNum = len(allShopid)
    midNum = int(endShopidNum / 2)
    message("获取到店铺数量: {}".format(endShopidNum))
    message(f"您已设置入会条件：{openCardBean} 京豆")
    print("获取账号...")
    cookies, userNames, pinNameList = iscookie()
    allUserCount = len(cookies)
    message("共{}个有效账号".format(allUserCount))
    memorylabel = 0
    startNum1 = 0
    startNum2 = midNum
    starttime = time.perf_counter()  # 记录时间开始
    if endShopidNum > 1 and DoubleThread:
        # 如果启用记忆功能，则获取上一次记忆位置
        startNum1, startNum2, memorylabel = isMemory(memorylabel, startNum1, startNum2, midNum, endShopidNum,
                                                     pinNameList)
        # 多线程部分
        threads = []
        t1 = Thread(target=OpenVipCard, args=(startNum1, midNum, allShopid, cookies, userNames, pinNameList, 1))
        threads.append(t1)
        t2 = Thread(target=OpenVipCard, args=(startNum2, endShopidNum, allShopid, cookies, userNames, pinNameList, 2))
        threads.append(t2)
        try:
            for t in threads:
                t.setDaemon(True)
                t.start()
            for t in threads:
                t.join()
            isSuccess = True
            progress_bar(1, 1, 1)
            progress_bar(1, 1, 2)
        except:
            isSuccess = False
    elif endShopidNum == 1 or not DoubleThread:
        startNum1, startNum2, memorylabel = isMemory(memorylabel, startNum1, startNum2, midNum, endShopidNum,
                                                     pinNameList)
        OpenVipCard(startNum1, endShopidNum, allShopid, cookies, userNames, pinNameList, 1)
        isSuccess = True
    else:
        message("获取到shopid数量为0")
        exitCodeFun(9)
    endtime = time.perf_counter()  # 记录时间结束
    if os.path.exists(pwd + "log/memory.json"):
        memoryJson = getMemory()
        n = 1
        message("\n###【本次统计 {}】###\n".format(nowtime()))
        all_get_bean = 0
        for name, pinname in zip(userNames, pinNameList):
            try:
                userCountBean = memoryJson['{}'.format(pinname)]
                successJoin = memoryJson['{}_ok'.format(pinname)]
                message(f"账号{n}:【{name}】\n\t└成功入会【{successJoin}】个，收获【{userCountBean}】京豆")
                all_get_bean += userCountBean
            except Exception as e:
                message(f"账号{n}:【{name}】\n\t└成功入会【0】个，收获【0】京豆")
            n += 1
        message(f"\n本次总累计获得：{all_get_bean} 京豆")
    time.sleep(1)
    message("\n------- 入会总耗时 : %.03f 秒 seconds -------" % (endtime - starttime))
    print("{0}\n{1}\n{2}".format("*" * 30, scriptHeader, remarks))
    send("【JD入会领豆】", message_info)
    exitCodeFun(0)
if __name__ == '__main__':
    start()

