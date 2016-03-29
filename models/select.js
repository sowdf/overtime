var mongodb = require('./db');

function Select(){

}

module.exports = Select();

Select.get = function(date,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection()
    });
}