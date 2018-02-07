/*
Author:chenrunjiang@qq.com
Date:2018年2月5日
*/
import Koa from 'koa'
import IO from 'koa-socket'
import http from 'http'
import wx_user from './wx_user'

function createServer(port) {

    let app = new Koa();
    let io = new IO();

    app.use(require('koa-static')('./files'));

    io.attach(app);

    io.on( 'join', ( ctx, data ) => {
        console.log( `message: ${ data }` )
    })

    io.on('connection', async (sock) => {

        sock.socket.emit('output', `
    Author:chenrunjiang@qq.com
    Date:2018年2月5日

        1.导出全部数据
        0.退出

    输入>`);

    //     ctx.socket.question = async function(str) {
    //         sock.socket.emit('output',str);
    //     }
    //
    //     await ctx.scoket.question("")

    });

    io.on('msg', async (ctx, msg) => {

        if (!ctx.socket.question) {
            ctx.socket.question = async function(str) {
                ctx.socket.emit('output',str);

                return await (new Promise(function(resolve, reject) {
                    ctx.socket.resolve = resolve;
                }));
            }
        }

        if (ctx.socket.resolve) {
            ctx.socket.resolve(msg);
            ctx.socket.resolve = null;
            return;
        }

        switch (msg.trim()) {
            case '1':
                let d1 = (await ctx.socket.question('\n开始日期(例如2018-1-1): ')).trim();
                let d2 = await ctx.socket.question('结束日期(为空时开始日期): ');
                d2 = d2?d2.trim():null;

                await wx_user.getAll(d1,d2||d1, (msg) => {
                    ctx.socket.emit('output', msg.toString()+"\n");
                });
                break;

            // case '0':
            //     process.exit();
        }

        ctx.socket.emit('output', '输入>');
    });

    app.listen(port);
}

createServer(5050);
createServer(18080);

/*
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
                await wx_user.getAll(d1,d2||d1);
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
*/
