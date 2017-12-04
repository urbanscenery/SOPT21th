const express = require('express');
const router = express.Router();
const async = require('async');
const moment = require('moment');
const crypto = require('crypto');
const pool = require('../../config/db_pool');



//로그인 실제 작동코드
router.post('/', (req, res) => {
  let taskArray = [
    //1. connection 설정
    (callback) => {
      pool.getConnection((err, connection) => {
        if (err) {
          res.status(500).send({
            status: "fail",
            msg: "get connection error"
          });
          callback("getConnection error : " + err, null);
        } else callback(null, connection);
      });
    },
    //2. 받은 email로 DB검색
    (connection, callback) => {
      let getMailQuery = 'select * from users where user_email = ?';
      connection.query(getMailQuery, req.body.email, (err, userData) => {
        if (err) {
          res.status(500).send({
            status: "fail",
            msg: "find user data error"
          });
          connection.release();
          callback("getMailQuery error : " + err, null);
        } else {
          callback(null, userData, connection);
        }
      });
    },
    //3. 찾은 email로 회원가입여부 판정, 회원가입된 회원시 pwd 해싱.
    (userData, connection, callback) => {
      if (userData.length === 0) {
        res.status(401).send({
          status: "fail",
          msg: "signin fail"
        });
        connection.release();
        callback("non signed up user", null);
      } else {
        crypto.pbkdf2(req.body.pwd, userData[0].user_salt, 100000, 64, 'sha512', function(err, hashed) {
          if (err) {
            res.status(500).send({
              status: "fail",
              msg: "hash password error"
            });
            connection.release();
            callback("hash password error : " + err);
          } else {
            callback(null, userData, hashed.toString('base64'), connection);
          }
        });
      }
    },
    //4. 비밀번호 비교 후 로그인 완료.
    (userData, hashed, connection, callback) => {
      if (userData[0].user_pwd !== hashed) {
        res.status(401).send({
          status: "fail",
          msg: "signin fail"
        });
        connection.release();
        callback("pwd uncorrect", null);
      } else {
        res.status(201).send({
          status: "success",
          data : {
            email : req.body.email,
            nickname : userData[0].user_nickname,
            profile : userData[0].user_profile
          },
          msg: "successful sign in"
        });
        connection.release();
        callback(null, "successful signin : " + req.body.email);
      }
    }
  ];
  async.waterfall(taskArray, (err, result) => {
    if (err) {
      err = moment().format('MM/DDahh:mm:ss//') + err;
      console.log(err);
    } else {
      result = moment().format('MM/DDahh:mm:ss//') + result;
      console.log(result);
    }
  });
});


module.exports = router;