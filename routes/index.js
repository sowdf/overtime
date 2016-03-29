var express = require('express');
var router = express.Router();
var crypto = require('crypto'),
    User = require('../models/user.js'),
    Post = require('../models/post.js');


function checkSubmit(req,res,next){
  var date = new Date();
  var today = date.getFullYear()+'年'+date.getMonth() + 1 + '月' + date.getDate() + '日';
  console.log(req.session.user.date + ':' + req.body.gh);
  if(req.session.user.gh == req.body.gh){
    if(req.session.user.date == today ){
      req.flash('error', '请勿重复提交');
      return res.redirect('/');
    }
    next();
  }else{
    next();
  }
}


/* GET home page. */
module.exports = function(app) {
  app.get('/', function (req, res) {
    res.render('index', {title: 'express'});
  });
  app.post('/',checkSubmit);
  app.post('/', function (req, res) {
    var date = new Date();
    var today = date.getFullYear()+'年'+date.getMonth() + 1 + '月' + date.getDate() + '日';
    var date = today;
        gh = req.body.gh,
        reason = req.body.reason;
    if (gh == null || reason == null) {
      req.flash('error', '请填写信息');
      return res.redirect('/');
    }
    var newUser = new User({
      date:date,
      gh: gh,
      reason: reason
    });
    //检查工号是否存在
    User.get(newUser.gh, function (err, user) {
      if (err) {
        req.flash('error', err);
      }
      //如果不存在则新增
      newUser.save(function (err, user) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/');
        }
        req.session.user = newUser;//存入session
        req.flash('success', '添加成功！');
        return res.redirect('/success');
      });
    });
  });
  app.get('/success',function(req,res){
    res.render('success',{title:'提交成功'});
  })
  app.get('/today',function(req,res){
    var date = new Date();
    var today = date.getFullYear()+'年'+date.getMonth() + 1 + '月' + date.getDate() + '日';
    Post.get(null,function(err,posts){
      if(err){
        posts = [];
      }
      res.render('today',{
        title: 'express',
        data : posts
      })
    })
  })

}