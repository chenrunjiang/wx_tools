/*
Author:chenrunjiang@qq.com
Date:2018年2月5日
*/

export default {
    title : '公众号,新增,取关,净增,累积',

    data(c, usercumulate, usersummary) {
       let userdata = {
           new_user: 0,
           cancel_user: 0,
       };

       for (let user of usersummary.list) {
           userdata.new_user += user.new_user;
           userdata.cancel_user += user.cancel_user;
       }

       userdata.cumulate_user = usercumulate.list.length?usercumulate.list[0].cumulate_user:0;
       userdata.netincrease_user = userdata.new_user - userdata.cancel_user;

       return `${c.name},${userdata.new_user},${userdata.cancel_user},${userdata.netincrease_user},${userdata.cumulate_user}`;
   }

}
