var mongodb = require('./db');
function Post(date){
    this.date = date;
}
module.exports = Post;
//读取信息
Post.get = function(date,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取集合
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query = {}
            if(date){
                query.date = date;
            }
            collection.find(query).sort({
                time:-1
            }).toArray(function(err,docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }

                callback(null,docs);
            })
        })
    })
}