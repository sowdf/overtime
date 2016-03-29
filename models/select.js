var mongodb = require('./db');

function Select(){

}

module.exports = Select();

Select.get = function(date,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取集合users
        db.collection('users',function(err,collection){
            if(err){
                return callback(err);
            }
            collection.findOne()
        })
    });
}