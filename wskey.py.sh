# -*- coding: utf-8 -*
'''
cron: 15 */8 * * * wskey.py
new Env('wskey转换');
'''

import socket
import base64
import http.client
import json
import os
import sys
import logging
import time
import urllib.parse



logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)
try:
    import requests
except Exception as e:
    logger.info(str(e) + "\n缺少requests模块, 请执行命令：pip3 install requests\n")
    sys.exit(1)
os.environ['no_proxy'] = '*'
requests.packages.urllib3.disable_warnings()
try:
    from notify import send
except:
    logger.info("无推送文件")

ver = 916

# 返回值 Token
def ql_login():
    path = '/ql/config/auth.json'
    if os.path.isfile(path):
        with open(path, "r") as file:
            auth = file.read()
            file.close()
        auth = json.loads(auth)
        username = auth["username"]
        password = auth["password"]
        token = auth["token"]
        if token == '':
            url = "http://127.0.0.1:{0}/api/login".format(port)
            payload = {
                "username": username,
                "password": password
            }
            headers = {
                'Content-Type': 'application/json'
            }
            try:
                res = requests.post(url=url, headers=headers, data=payload, verify=False)
                token = json.loads(res.text)['token']
            except:
                logger.info("青龙登录失败, 请检查面板状态!")
                sys.exit(1)
            else:
                return token
        else:
            return token
    else:
        logger.info("没有发现auth文件, 你这是青龙吗???")
        sys.exit(0)


# 返回值 list[wskey]
def get_wskey():
    if "JD_WSCK" in os.environ:
        wskey_list = os.environ['JD_WSCK'].split('&')
        if len(wskey_list) > 0:
            return wskey_list
        else:
            logger.info("JD_WSCK变量未启用")
            sys.exit(1)
    else:
        logger.info("未添加JD_WSCK变量")
        sys.exit(0)


# 返回值 list[jd_cookie]
def get_ck():
    if "JD_COOKIE" in os.environ:
        ck_list = os.environ['JD_COOKIE'].split('&')
        if len(ck_list) > 0:
            return ck_list
        else:
            logger.info("JD_COOKIE变量未启用")
            sys.exit(1)
    else:
        logger.info("未添加JD_COOKIE变量")
        sys.exit(0)


# 返回值 bool
def check_ck(ck):
    if "QL_WSCK" in os.environ:
        logger.info("不检查账号有效性\n--------------------\n")
        return False
    else:
        url = 'https://wq.jd.com/user_new/info/GetJDUserInfoUnion?orgFlag=JD_PinGou_New&callSource=mainorder'
        headers = {
            'Cookie': ck,
            'Referer': 'https://home.m.jd.com/myJd/home.action',
            'User-Agent': ua,
        }
        try:
            res = requests.get(url=url, headers=headers, verify=False, timeout=10)
            if res.status_code == 200:
                code = int(json.loads(res.text)['retcode'])
                pin = ck.split(";")[1]
                if code == 0:
                    logger.info(str(pin) + ";状态正常\n")
                    return True
                else:
                    logger.info(str(pin) + ";状态失效\n")
                    return False
            else:
                logger.info("JD接口错误, 切换第二接口")
                url = 'https://me-api.jd.com/user_new/info/GetJDUserInfoUnion'
                headers = {
                    'Cookie': ck,
                    'User-Agent': ua,
                }
                res = requests.get(url=url, headers=headers, verify=False, timeout=30)
                if res.status_code == 200:
                    code = int(json.loads(res.text)['retcode'])
                    pin = ck.split(";")[1]
                    if code == 0:
                        logger.info(str(pin) + ";状态正常\n")
                        return True
                    else:
                        logger.info(str(pin) + ";状态失效\n")
                        return False
        except:
            logger.info("\nJD接口错误! ")
            logger.info("脚本退出")
            sys.exit(1)


# 返回值 bool jd_ck
def getToken(wskey):
    headers = {
        'cookie': wskey,
        'User-Agent': ua,
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'charset': 'UTF-8',
        'accept-encoding': 'br,gzip,deflate'
    }
    params = {
        'functionId': 'genToken',
        'clientVersion': '10.1.2',
        'client': 'android',
        'uuid': uuid,
        'st': st,
        'sign': sign,
        'sv': sv
    }
    url = 'https://api.m.jd.com/client.action'
    data = 'body=%7B%22action%22%3A%22to%22%2C%22to%22%3A%22https%253A%252F%252Fplogin.m.jd.com%252Fcgi-bin%252Fm%252Fthirdapp_auth_page%253Ftoken%253DAAEAIEijIw6wxF2s3bNKF0bmGsI8xfw6hkQT6Ui2QVP7z1Xg%2526client_type%253Dandroid%2526appid%253D879%2526appup_type%253D1%22%7D&'
    try:
        res = requests.post(url=url, params=params, headers=headers, data=data, verify=False, timeout=10)
        res_json = json.loads(res.text)
        # logger.info(res_json)
        tokenKey = res_json['tokenKey']
        # logger.info("Token:", tokenKey)
    except:
        try:
            res = requests.post(url=url, params=params, headers=headers, data=data, verify=False, timeout=20)
            res_json = json.loads(res.text)
            # logger.info(res_json)
            tokenKey = res_json['tokenKey']
            # logger.info("Token:", tokenKey)
            return appjmp(wskey, tokenKey)
        except:
            logger.info("WSKEY转换接口出错, 请稍后尝试, 脚本退出")
            sys.exit(1)
    else:
        return appjmp(wskey, tokenKey)


# 返回值 bool jd_ck
def appjmp(wskey, tokenKey):
    headers = {
        'User-Agent': ua,
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
    }
    params = {
        'tokenKey': tokenKey,
        'to': 'https://plogin.m.jd.com/cgi-bin/m/thirdapp_auth_page?token=AAEAIEijIw6wxF2s3bNKF0bmGsI8xfw6hkQT6Ui2QVP7z1Xg',
        'client_type': 'android',
        'appid': 879,
        'appup_type': 1,
    }
    url = 'https://un.m.jd.com/cgi-bin/app/appjmp'
    try:
        res = requests.get(url=url, headers=headers, params=params, verify=False, allow_redirects=False, timeout=20)
        res_set = res.cookies.get_dict()
        pt_key = 'pt_key=' + res_set['pt_key']
        pt_pin = 'pt_pin=' + res_set['pt_pin']
        jd_ck = str(pt_key) + ';' + str(pt_pin) + ';'
        wskey = wskey.split(";")[0]
        if 'fake' in pt_key:
            logger.info(str(wskey) + ";wskey状态失效\n")
            return False, jd_ck
        else:
            logger.info(str(wskey) + ";wskey状态正常\n")
            return True, jd_ck
    except:
        logger.info("接口转换失败, 默认wskey失效\n")
        wskey = "pt_" + str(wskey.split(";")[0])
        return False, wskey


# 返回值 svv, stt, suid, jign
def get_sign():
    url = str(base64.b64decode(
        'aHR0cHM6Ly9oZWxsb2Rucy5jb2RpbmcubmV0L3Avc2lnbi9kL2pzaWduL2dpdC9yYXcvbWFzdGVyL3NpZ24=').decode())
    for i in range(3):
        try:
            res = requests.get(url=url, verify=False, timeout=20)
        except requests.exceptions.ConnectTimeout:
            logger.info("\n获取Sign超时, 正在重试!" + str(i))
            time.sleep(1)
        except requests.exceptions.ReadTimeout:
            logger.info("\n获取Sign超时, 正在重试!" + str(i))
            time.sleep(1)
        except Exception as err:
            logger.info(str(err) + "\n未知错误, 退出脚本!")
            sys.exit(1)
        else:
            try:
                sign_list = json.loads(res.text)
            except:
                logger.info("Sign Json错误")
                sys.exit(1)
            else:
                svv = sign_list['sv']
                stt = sign_list['st']
                suid = sign_list['uuid']
                jign = sign_list['sign']
                return svv, stt, suid, jign


# 返回值 None
def boom():
    ex = int(cloud_arg['code'])
    if ex != 200:
        logger.info("Check Failure")
        logger.info("--------------------\n")
        sys.exit(0)
    else:
        logger.info("Verification passed")
        logger.info("--------------------\n")


def update():
    up_ver = int(cloud_arg['update'])
    if ver >= up_ver:
        logger.info("当前脚本版本: " + str(ver))
        logger.info("--------------------\n")
    else:
        logger.info("当前脚本版本: " + str(ver) + "新版本: " + str(up_ver))
        logger.info("存在新版本, 请更新脚本后执行")
        logger.info("--------------------\n")
        text = '当前脚本版本: {0}新版本: {1}, 请更新脚本~!'.format(ver, up_ver)
        send('WSKEY转换', text)
        # sys.exit(0)


def ql_check(port):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(2)
    try:
        sock.connect(('127.0.0.1', port))
    except:
        # logger.info(port, "端口检测失败")
        sock.close()
        return False
    else:
        sock.close()
        return True


# 返回值 bool, key, eid
def serch_ck(pin):
    if all('\u4e00' <= char <= '\u9fff' for char in pin):
        pin1 = urllib.parse.quote(pin)
        pin2 = pin1.replace('%', '%5C%25')
        logger.info(str(pin) + "-->" + str(pin1))
    else:
        pin2 = pin.replace('%', '%5C%25')
    # TMD 中文!
    # url = "http://127.0.0.1:5700/api/envs?searchValue={0}".format(pin)
    # res = json.loads(s.get(url, verify=False).text)
    conn = http.client.HTTPConnection("127.0.0.1", port)
    payload = ''
    headers = {
        'Authorization': 'Bearer ' + token
    }
    url = '/api/envs?searchValue={0}'.format(pin2)
    conn.request("GET", url, payload, headers)
    res = json.loads(conn.getresponse().read())
    if len(res['data']) == 0:
        logger.info(str(pin) + "检索失败\n")
        return False, 1
    elif len(res['data']) > 1:
        logger.info(str(pin) + "存在重复, 取第一条, 请删除多余变量\n")
        key = res['data'][0]['value']
        eid = res['data'][0]['_id']
        return True, key, eid
    else:
        logger.info(str(pin) + "检索成功\n")
        key = res['data'][0]['value']
        eid = res['data'][0]['_id']
        return True, key, eid


def ql_update(eid, n_ck):
    url = 'http://127.0.0.1:{0}/api/envs'.format(port)
    data = {
        "name": "JD_COOKIE",
        "value": n_ck,
        "_id": eid
    }
    data = json.dumps(data)
    res = json.loads(s.put(url=url, data=data).text)
    # logger.info(res)
    if res['data']['status'] == 1:
        ql_enable(eid)


def ql_enable(eid):
    url = 'http://127.0.0.1:{0}/api/envs/enable'.format(port)
    data = '["{0}"]'.format(eid)
    res = json.loads(s.put(url=url, data=data).text)
    if res['code'] == 200:
        logger.info("\n账号启用\n--------------------\n")
        return True
    else:
        logger.info("\n账号启用失败\n--------------------\n")
        return False


def ql_disable(eid):
    url = 'http://127.0.0.1:{0}/api/envs/disable'.format(port)
    data = '["{0}"]'.format(eid)
    res = json.loads(s.put(url=url, data=data).text)
    if res['code'] == 200:
        logger.info("\n账号禁用成功\n--------------------\n")
        return True
    else:
        logger.info("\n账号禁用失败\n--------------------\n")
        return False


def ql_insert(i_ck):
    data = [{"value": i_ck, "name": "JD_COOKIE"}]
    data = json.dumps(data)
    url = 'http://127.0.0.1:{0}/api/envs'.format(port)
    s.post(url=url, data=data)
    logger.info("\n账号添加完成\n--------------------\n")


def cloud_info():
    url = str(base64.b64decode(
        'aHR0cHM6Ly9oZWxsb2Rucy5jb2RpbmcubmV0L3Avc2lnbi9kL2pzaWduL2dpdC9yYXcvbWFzdGVyL2NoZWNrX2FwaQ==').decode())
    for i in range(3):
        try:
            res = requests.get(url=url, verify=False, timeout=20).text
        except requests.exceptions.ConnectTimeout:
            logger.info("\n获取云端参数超时, 正在重试!" + str(i))
        except requests.exceptions.ReadTimeout:
            logger.info("\n获取云端参数超时, 正在重试!" + str(i))
        except Exception as err:
            logger.info(str(err) + "\n未知错误, 退出脚本!")
            sys.exit(1)
        else:
            try:
                c_info = json.loads(res)
            except:
                logger.info("云端参数解析失败")
                sys.exit(1)
            else:
                return c_info


if __name__ == '__main__':
    logger.info("\n--------------------\n")
    if "QL_PORT" in os.environ:
        try:
            port = int(os.environ['QL_PORT'])
        except:
            logger.info("变量格式有问题...\n格式: export QL_PORT=\"端口号\"")
            sys.exit(1)
    else:
        port = 5700
    if not ql_check(port):
        logger.info(str(port) + "端口检查失败, 如果改过端口, 请在变量中声明端口 \n在config.sh中加入 export QL_PORT=\"端口号\"")
        logger.info("\n如果你很确定端口没错, 还是无法执行, 在GitHub给我发issus\n--------------------\n")
        sys.exit(1)
    else:
        logger.info(str(port) + "端口检查通过\n")
    # global cloud_arg
    cloud_arg = cloud_info()
    update()
    ua = cloud_arg['User-Agent']
    boom()
    sv, st, uuid, sign = get_sign()  # 获取认证参数
    token = ql_login()  # 获取青龙 token
    s = requests.session()
    s.headers.update({"authorization": "Bearer " + str(token)})
    s.headers.update({"Content-Type": "application/json;charset=UTF-8"})
    wslist = get_wskey()
    for ws in wslist:
        wspin = ws.split(";")[0]
        if "pin" in wspin:
            wspin = "pt_" + wspin + ";"  # 封闭变量
            return_serch = serch_ck(wspin)  # 变量 pt_pin 搜索获取 key eid
            if return_serch[0]:  # bool: True 搜索到账号
                jck = str(return_serch[1])  # 拿到 JD_COOKIE
                if not check_ck(jck):  # bool: False 判定 JD_COOKIE 有效性
                    return_ws = getToken(ws)  # 使用 WSKEY 请求获取 JD_COOKIE bool jd_ck
                    if return_ws[0]:  # bool: True
                        nt_key = str(return_ws[1])
                        # logger.info("wskey转pt_key成功", nt_key)
                        logger.info("wskey转换成功\n")
                        logger.info("--------------------\n")
                        eid = return_serch[2]  # 从 return_serch 拿到 eid
                        ql_update(eid, nt_key)  # 函数 ql_update 参数 eid JD_COOKIE
                    else:
                        logger.info(str(ws) + "wskey失效\n")
                        eid = return_serch[2]
                        logger.info("禁用账号" + str(wspin))
                        ql_disable(eid)
                else:
                    logger.info(str(wspin) + "账号有效")
                    eid = return_serch[2]
                    ql_enable(eid)
                    logger.info("--------------------\n")
            else:
                logger.info("wskey未生成pt_key\n")
                return_ws = getToken(ws)  # 使用 WSKEY 请求获取 JD_COOKIE bool jd_ck
                if return_ws[0]:
                    nt_key = str(return_ws[1])
                    logger.info("wskey转换成功\n")
                    ql_insert(nt_key)
        else:
            logger.info("WSKEY格式错误\n--------------------\n")
    logger.info("执行完成\n--------------------")
    sys.exit(0)
