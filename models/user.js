var mongodb = require('./db');

function User(user){
    this.date = user.date;
    this.gh = user.gh;
    this.reason = user.reason;
}

module.exports = User;
//存储信息
User.prototype.save = function(callback){
    //要存入数据库的文旦
    var date = new Date();
    var time = {
        date: date,
        year : date.getFullYear(),
        month : date.getFullYear() + "-" + (date.getMonth() + 1),
        day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
        date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    }
    var user = {
        date : time,
        gh : this.gh,
        reason : this.reason
    };
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err); // 返回错误信息
        }
        //读取users集合
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);//错误返回错误信息
            }
            //讲数据插入users集合
            collection.insert(user,{
                safe : true
            },function(err,user){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,user[0]);//成功！err 为 null，并返回存储后的用户文档
            })
        })

    });
}

User.get = function(gh,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne({
                gh:gh
            },function(err,user){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,user);
            })
        })
    })
}