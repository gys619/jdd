/**
cron=0 0-23/11 * * * jd_update.js
new Env('强制更新');
 */
const exec = require('child_process').exec;

if(process.env.PWD==='/ql/scripts'){
  exec("cd /ql/repo/gys619_jdd")
}

exec("git fetch --all; git reset --hard origin/main; git pull", (error, stdout, stderr) => {
  console.log(stdout.trim())
})

if(process.env.PWD==='/ql/scripts') {
  if (__dirname.indexOf('/ql/') > -1) {
    exec('ql repo https://github.com/gys619/jdd.git "jd_|jx_|jddj_|gua_|jddj_|getJDCookie|wskey" "activity|backUp|scf_test_event" "^jd[^_]|USER|utils|ZooFaker_Necklace|JDJRValidator_Pure|sign_graphics_validate|jddj_cookie|function"', (error, stdout, stderr) => {
      console.log(stdout.trim())
    })
  }
}

