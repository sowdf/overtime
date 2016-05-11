var mongodb = require('./db');
function Enroll(enroll) {
    this.time = enroll.time;
    this.gh = enroll.gh;
    this.reason = enroll.reason;
    this.name = enroll.name;
}

module.exports = Enroll;

Enroll.prototype.save = function(callback){
    var date = {
        time : this.time,
        gh : this.gh,
        reason : this.reason,
        name : this.name
    }
    //打开数据库
    mongodb.open(function(err,db){
        //读取enroll集合
        db.collection('enroll',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.insert(date,{safe : true},function(err,result){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,result[0]);//成功返回插入成功的数据
            })
        })
    })
}

Enroll.get = function(gh,callback){
    //打开数据库
    var date = new Date();
    var day = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    mongodb.open(function(err,db){
        query = {
            'gh':gh,
            'time.day' : day
        }
        if(err){
            return callback(err);
        }
        db.collection('enroll',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne(query,function(err,docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,docs);
            })
        })
    })
}
Enroll.getToday = function(callback){
    var date = new Date();
    var month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    var day =  date.getDate() < 10 ? '0' +  date.getDate() :  date.getDate();
    var day = date.getFullYear() + '-' + month + '-' + day;
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('enroll',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.find({
                'time.day' : day
            }).sort({
                time : -1
            }).toArray(function(err,docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,docs);
            });
        })
    })
}

Enroll.getSearch = function(day,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('enroll',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.find({
                'time.day' : day
            }).sort({
                time : -1
            }).toArray(function(err,docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,docs);
            });
        })
    })
}