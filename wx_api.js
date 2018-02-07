/*
Author:chenrunjiang@qq.com
Date:2018年2月5日
*/
import https from 'https'
import querystring from 'querystring'

const URL = 'https://api.weixin.qq.com';
const HOST = 'api.weixin.qq.com';

export default {
    access_token(c) {
        return new Promise(function(resolve, reject) {
            let url = `${URL}/cgi-bin/token?grant_type=client_credential&appid=${c.appid}&secret=${c.appsrcret}`;
            https.get(url, (res) => {

                res.on('data', (data) => {
                    let json = JSON.parse(data);

                    if (json.errcode) {
                        reject(new Error(data));
                    }

                    resolve(json);
                }).on('error', (e) => {
                    reject(e);
                });
            });
        });
    },


    getusersummary(c, begin_date, end_date) {
        return getuser(c, begin_date, end_date, 'getusersummary');
    },

    getusercumulate(c, begin_date, end_date) {
        return getuser(c, begin_date, end_date, 'getusercumulate');
    }
}

function getuser(c, begin_date, end_date, method) {
    return new Promise(function(resolve, reject) {
        let postData = JSON.stringify({begin_date, end_date});

        let opts = {
            hostname: HOST,
            port: 443,
            path: `/datacube/${method}?access_token=${c.access_token}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Content-Length':postData.length
            }
        };

        let req = https.request(opts,function(res){
            let datas = [];

            res.on('data',function(data){
                datas.push(data);
            })

            res.on('end', function(){
                let json = JSON.parse(datas.join(''));

                if (json.errcode) {
                    return reject(json);
                }

                resolve(json);
            })
        })

        req.on('error',function(err){
            reject(err);
        })

        req.write(postData);
        req.end();
    });
}
