/*
Author:chenrunjiang@qq.com
Date:2018年2月5日
*/
import config from './config'
import wx_api from './wx_api'
import path from 'path'
import fs from 'fs'
import map from './map'
import iconv from 'iconv-lite';

const config_filename = path.join(__dirname, "./config.js");

export default {
    async getAll(begin_date, end_date, log) {
        let txt = map.title;

        for (let i = 0; i < config.length; i++) {
            let c = config[i];

            // get access token
            if (!c.access_token || c.expires < Date.now()) {
                let at = null;

                try {
                    at = await wx_api.access_token(c);
                } catch (e) {
                    log(e);
                }

                if (at && at.access_token) {
                    c.access_token = at.access_token;
                    c.expires = Date.now() + (at.expires_in-60) * 1000;
                }
            }

            if (!c.access_token) {
                log(`\nERROR: ${c.name}获取access_token失败`);
                continue;
            }

            try {
                let usercumulate = await wx_api.getusercumulate(c, begin_date, end_date);
                let usersummary = await wx_api.getusersummary(c, begin_date, end_date);

                console.log(usercumulate, usersummary)
                txt += "\n" + map.data(c, usercumulate, usersummary);
            } catch(e) {
                if (e.errcode == 40001) {
                    c.access_token = null;
                }
                console.log(begin_date, end_date)
                log(JSON.stringify(e));
            }
        }

        write_config();

        let outputpath = Date.now() + '.csv';
        fs.writeFileSync(path.join(__dirname, "files/" + outputpath), iconv.encode(txt, 'GBK'));

        if (log == console.log) {
            log(`已保存到 files/${outputpath}，遇到错误请重试`);
        } else {
            log(`已保存到 <a href="/${outputpath}">${outputpath}</a>，遇到错误请重试`);
        }
    },

    async getOne() {

    },
}


function write_config() {
    let txt =
`/*
Author:chenrunjiang@qq.com
Date:2018年2月5日

必须数据:
{
	"name": "账号",
	"appid": "wxxxxxxxxxxxxxxxxxx",
	"appsrcret": "xxxxxxxxxxxxxxxxxxxxxxxxxx",
}
*/
export default `;

    txt += JSON.stringify(config, true, "\t");

    fs.writeFileSync(config_filename,txt);
}

// exports.default.getAll();
