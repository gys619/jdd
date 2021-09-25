#!/usr/bin/env bash
## CUSTOM_SHELL_FILE for https://gitee.com/lxk0301/jd_docker/tree/master/docker
### 编辑docker-compose.yml文件添加: - CUSTOM_SHELL_FILE=https://raw.githubusercontent.com/passerby-b/JDDJ/main/shell_script_mod.sh
#### 容器完全启动后执行 docker exec -it jd_scripts /bin/sh -c 'crontab -l' 查看是否成功添加京东到家的定时任务

function jddj(){
    # 备份cookie文件
    [[ -f /scripts/jddj/jddj_cookie.js ]] && cp -rf /scripts/jddj/jddj_cookie.js /scripts/backup_jddj_cookie.js
    # clone
    rm -rf /scripts/jddj && git clone https://github.com/passerby-b/JDDJ.git /scripts/jddj
    # 下载自定义cookie文件地址,如私密的gist地址,需修改
    jddj_cookiefile="https://raw.githubusercontent.com/passerby-b/JDDJ/main/jddj_cookie.js"
    curl -so /scripts/jddj/jddj_cookie.js $jddj_cookiefile
    # 下载cookie文件失败时从备份恢复
    test $? -eq 0 || cp -rf /scripts/jddj/backup_jddj_cookie.js /scripts/backup_jddj_cookie.js
    # 获取js文件中cron字段设置定时任务
    for jsname in $(ls /scripts/jddj | grep -E "js$" | tr "\n" " "); do
        jsname_cn="$(grep "cron" /scripts/jddj/$jsname | grep -oE "/?/?tag\=.*" | cut -d"=" -f2)"
        jsname_log="$(echo /scripts/jddj/$jsname | sed 's;^.*/\(.*\)\.js;\1;g')"
        jsnamecron="$(cat /scripts/jddj/$jsname | grep -oE "/?/?cron \".*\"" | cut -d\" -f2)"
        test -z "$jsname_cn" && jsname_cn=$jsname_log
        test -z "$jsnamecron" || echo "# $jsname_cn" >> /scripts/docker/merged_list_file.sh
        test -z "$jsnamecron" || echo "$jsnamecron node /scripts/jddj/$jsname >> /scripts/logs/$jsname_log.log 2>&1" >> /scripts/docker/merged_list_file.sh
    done
}

function main(){
    # 首次运行时拷贝docker目录下文件
    [[ ! -d /jd_diy ]] && mkdir /jd_diy && cp -rf /scripts/docker/* /jd_diy
    # DIY脚本执行前后信息
    a_jsnum=$(ls -l /scripts/jddj | grep -oE "^-.*js$" | wc -l)
    a_jsname=$(ls -l /scripts/jddj | grep -oE "^-.*js$" | grep -oE "[^ ]*js$")
    jddj
    b_jsnum=$(ls -l /scripts/jddj | grep -oE "^-.*js$" | wc -l)
    b_jsname=$(ls -l /scripts/jddj | grep -oE "^-.*js$" | grep -oE "[^ ]*js$")
    # DIY脚本更新TG通知
    info_more=$(echo $a_jsname  $b_jsname | tr " " "\n" | sort | uniq -c | grep -oE "1 .*$" | grep -oE "[^ ]*js$" | tr "\n" " ")
    [[ "$a_jsnum" == "0" || "$a_jsnum" == "$b_jsnum" ]] || curl -sX POST "https://api.telegram.org/bot$TG_BOT_TOKEN/sendMessage" -d "chat_id=$TG_USER_ID&text=DIY脚本更新完成：$a_jsnum $b_jsnum $info_more" >/dev/null
    # LXK脚本更新TG通知
    lxktext="$(diff /jd_diy/crontab_list.sh /scripts/docker/crontab_list.sh | grep -E "^[+-]{1}[^+-]+" | grep -oE "node.*\.js" | cut -d/ -f3 | tr "\n" " ")"
    test -z "$lxktext" || curl -sX POST "https://api.telegram.org/bot$TG_BOT_TOKEN/sendMessage" -d "chat_id=$TG_USER_ID&text=LXK脚本更新完成：$(cat /jd_diy/crontab_list.sh | grep -vE "^#" | wc -l) $(cat /scripts/docker/crontab_list.sh | grep -vE "^#" | wc -l) $lxktext" >/dev/null
    # 拷贝docker目录下文件供下次更新时对比
    cp -rf /scripts/docker/* /jd_diy
}

main
