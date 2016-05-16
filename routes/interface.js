var Enroll = require('../modules/enroll');
module.exports = function(app){
    app.get('/getOne',function(req,res){
        var date = req.query.date;
        Enroll.getSearch(date,function(err,datas){

            if(err){
                res.json({
                    code : 99,
                    message : err
                });
                return;
            }
            if(datas.length == 0){
                res.json({
                    code : 98,
                    message : '没有你要查询的数据哦'
                });
                return ;
            }
            res.json({
                code : 100,
                result : datas
            })
        });
    })
}