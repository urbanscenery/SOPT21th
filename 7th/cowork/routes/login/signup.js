const express = require('express');
const router = express.Router();
const async = require('async');
const moment = require('moment');
const crypto = require('crypto');
const pool = require('../../config/db_pool');
const upload = require('../../config/AWS-S3');

router.post('/', upload.single('image'), (req, res) => {
  let taskArray = [
    //1. connection 설정
    (callback) => {
      pool.getConnection((err, connection) => {
        if (err) {
          res.status(500).send({
            status: "fail",
            msg: "get connection error"
          });
          callback("getConnection error : " + err);
        } else callback(null, connection);
      });
    },
    //2. email 중복검사
    (connection, callback) => {
      let selectEmailQuery = 'select user_email from users where user_email = ?';
      connection.query(selectEmailQuery, req.body.email, (err, email) => {
        if (err) {
          res.status(500).send({
            status: "fail",
            msg: "get user data error"
          });
          connection.release();
          callback("selectEmailQuery error : " + err, null);
        } else {
          if (email.length !== 0) {
            res.status(401).send({
              status: "fail",
              msg: "email overlap"
            });
            connection.release();
            callback("email overlap");
          } else {
            callback(null, connection);
          }
        }
      });
    },
    //3. pwd 해싱
    (connection, callback) => {
      crypto.randomBytes(32, function(err, buffer) {
        if (err) {
          res.status(500).send({
            status: "fail",
            msg: "hash password error"
          });
          connection.release();
          callback("hash password error : " + err);
        } else {
          let salt = buffer.toString('base64');
          crypto.pbkdf2(req.body.pwd, salt, 100000, 64, 'sha512', function(err, hashed) {
            if (err) {
              res.status(500).send({
                status: "fail",
                msg: "hash password error"
              });
              connection.release();
              callback("hash password error : " + err);
            } else {
              callback(null, hashed.toString('base64'), salt, connection);
            }
          });
        }
      });
    },
    //3. 회원가입 완료
    (hashed, salt, connection, callback) => {
      let insertUserDataQuery = 'insert into users values(?,?,?,?,?)';
      connection.query(insertUserDataQuery, [req.body.email, hashed, salt, req.body.nickname, req.file.location], (err) => {
        if (err) {
          res.status(500).send({
            status: "fail",
            msg: "insert user data error"
          });
          connection.release();
          callback("insertUserDataQuery error : " + err);
        } else {
          res.status(201).send({
            status: "success",
            msg: "successful sign up"
          });
          connection.release();
          callback(null, "successful signup : " + req.body.email + " // " + req.body.nickname);
        }
      });
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