/*
原生nodejs运行方式,不需要面板,下面配置好脚本和运行时间,在pm2挂载该主要程序脚本
安装pm2命令:npm install pm2 -g
挂载主程序命令:pm2 start main.js --name myserver

*/
var request = require('sync-request');
var cronJob = require("cron").CronJob;

//在此处配置定时和脚本
cron('0 0 8 * * *', 'https://raw.githubusercontents.com/passerby-b/JDDJ/main/123.js');//远程脚本
cron('0 0 8 * * *', './123.js');//本地脚本

function cron(time,file){new cronJob(time,()=>{try{if(file.indexOf('http://')>-1||file.indexOf('https://')>-1){let res=request('get',file);if(res.getBody('utf8'))eval(res.getBody('utf8'))}else{delete require.cache[require.resolve(file)];require(file)}}catch(error){console.log('\r\n '+file+"_erro:"+error)}},null,true)}
