var express = require('express');
var router = express.Router();
var Enroll = require('../modules/enroll');

/* GET home page. */
module.exports = function(app){
  app.get('/', function(req, res, next) {
    var gh ='';
    if(req.session.enroll){
      gh = req.session.enroll.gh;
    }
    res.render('index', {
      gh : gh || 0,
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
    var value = req.body.gh.split('-');
    var gh = value[0],
        name = value[1],
        reason = req.body.reason;
    if(date.getHours() >= 15){
      req.flash('error','已超过报名时间，请明天再来！！');
      return res.redirect('/');
    }
    if(gh == 0){
      req.flash('error','请选择工号！');
      return res.redirect('/');
    }
    if(reason == ''){
      req.flash('error','请填写理由！');
      return res.redirect('/');
    }
    var newEnroll = new Enroll({
      name : name,
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
        if( req.session.enroll && req.session.enroll.time.day == result.time.day ){
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
}


