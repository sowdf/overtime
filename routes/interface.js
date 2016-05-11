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
            console.log(datas);
            res.json({
                code : 100,
                result : datas
            })
        });
    })
}