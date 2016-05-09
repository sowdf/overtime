var express = require('express');
var router = express.Router();
var Enroll = require('../modules/enroll');

/* GET home page. */
module.exports = function(app){
  app.get('/', function(req, res, next) {
    res.render('index', {
      title: '报名',
      success : req.flash('success').toString(),
      error : req.flash('error').toString()
    });
  });
  app.post('/', function(req, res, next) {
    var date = new Date();
    var time = {
      year : date.getFullYear(),
      month : date.getMonth() + 1,
      day : date.getFullYear()+ '-' + (date.getMonth() + 1) + '-'+ date.getDate()
    };
    var gh = req.body.gh,
        reason = req.body.reason;
    if(gh == 0){
      req.flash('error','请选择工号！');
      return res.redirect('/');
    }
    if(reason == ''){
      req.flash('error','请填写理由！');
      return res.redirect('/');
    }
    var newEnroll = new Enroll({
      time : time,
      gh : gh,
      reason : reason
    });

    Enroll.get(newEnroll.gh,function(err,result){
      if(err){
        req.flash('error',err);
        return res.redirect('/');
      }
      if(result){
        if( req.session.enroll.time.day == result.time.day ){
          req.flash('error','您今日已提交过！');
          return res.redirect('/');
        }
      }
      //如果今日没有报名就存入数据库
      newEnroll.save(function(err,result){
        if(err){
          req.flash('error','存入失败！');
          return res.redirect('/');
        }
        req.session.enroll = newEnroll;//报名信息存入session
        req.flash('success','提交成功！');
        res.redirect('/result');
      });
    });
    app.get('/result',function(req,res){
      Enroll.getToday(function(err,list){
        if(err){
          req.flash('error',err);
          return res.redirect('/result');
        }
        res.render('result',{
          title : '报名结果',
          list : list,
          success : req.flash('success').toString(),
          error : req.flash('error').toString()
        });
      })
    })


  });
}


