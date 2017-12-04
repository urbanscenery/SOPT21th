const express = require('express');
const router = express.Router();
const async = require('async');
const moment = require('moment');
const pool = require('../../config/db_pool');
const upload = require('../../config/AWS-S3');


router.post('/content', upload.single('image'), (req, res) => {
  let taskArray = [
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
    (connection, callback) => {
      let insertBoardQuery = 'insert into board values(?,?,?,?,?,?,?)';
      let time = moment().format('YYYY-MM-DD HH:mm:ss');
      if (typeof req.file === 'undefined') req.file.location = null;
      connection.query(insertBoardQuery, [null, req.body.title, req.body.content, req.file.location, 0, time, req.body.email], (err) => {
        if (err) {
          res.status(500).send({
            status: "fail",
            msg: "regist board data error"
          });
          connection.release();
          callback("insertBoardQuery error : " + err);
        } else {
          res.status(201).send({
            status : "success",
            msg : "successful regist board data"
          });
          connection.release();
          callback(null, "successful regist board data");
        }
      })
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


router.post('/comment', (req, res) => {
  let taskArray = [
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
    (connection, callback) => {
      let insertCommentQuery = 'insert into comment values(?,?,?,?,?)';
      let time = moment().format('YYYY-MM-DD HH:mm:ss');
      connection.query(insertCommentQuery, [null, req.body.content, time, req.body.id, req.body.email], (err) => {
        if (err) {
          res.status(500).send({
            status: "fail",
            msg: "regist comment data error"
          });
          connection.release();
          callback("insertCommentQuery error : " + err);
        } else {
          res.status(201).send({
            status : "success",
            msg : "successful regist comment data"
          });
          connection.release();
          callback(null, "successful regist comment data");
        }
      })
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