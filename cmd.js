/*
Author:chenrunjiang@qq.com
Date:2018年2月7日
*/
import readline from 'readline'
import wx_user from './wx_user'

console.log(`
Author:chenrunjiang@qq.com
Date:2018年2月5日

    1.导出全部数据
    0.退出
`);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

(async ()=>{
    while(true) {
        switch (await question('\n输入> ')) {
            case '1':
                let d1 = await question('\n开始日期(例如2018-1-1): ');
                let d2 = await question('结束日期(为空时开始日期): ');
                await wx_user.getAll(d1,d2||d1,console.log);
                break;

            case '0':
                process.exit();
        }
    }
})();


function question(str) {
    return new Promise(function(resolve, reject) {
        rl.question(str, (data) => {
            resolve(data);
        });
    });
}
