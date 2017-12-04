const express = require('express');
const router = express.Router();
const async = require('async');
const moment = require('moment');
const pool = require('../../config/db_pool');

router.put('/', (req, res) => {
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
    //3. userID, storeID로 북마크 있는지 검사
    (connection, callback) => {
      let selectBookmarkQuery = 'select * from bookmark where user_email = ? and board_id = ?';
      connection.query(selectBookmarkQuery, [req.body.useremail, req.body.boardid], (err, bookmarkData) => {
        if (err) {
          res.status(500).send({
            status: "fail",
            msg: "get bookmark data error"
          });
          connection.release();
          callback("get bookmark data err : " + err, null);
        } else {
          callback(null, bookmarkData, connection);
        }
      });
    },
    //4. bookmark데이터가 있으면 삭제, 없으면 추가
    (bookmarkData, connection, callback) => {
      if (bookmarkData.length === 0) {
        let insertBookmarkQuery = 'insert into bookmark values(?,?,?)';
        connection.query(insertBookmarkQuery, [null, req.body.useremail, req.body.boardid], (err) => {
          if (err) {
            res.status(500).send({
              status: "fail",
              msg: "insert bookmark data error"
            });
            connection.release();
            callback("insert bookmark data err : " + err, null);
          } else {
            res.status(201).send({
              status: "success",
              msg: "successful regist bookmark"
            });
            connection.release();
            callback(null, "succesful regist bookmark", );
          }
        });
      } else {
        let deleteBookmarkQuery = 'delete from bookmark where user_email = ? and board_id = ?';
        connection.query(deleteBookmarkQuery, [req.body.useremail, req.body.boardid], (err) => {
          if (err) {
            res.status(500).send({
              status: "fail",
              msg: "delete bookmark data error"
            });
            connection.release();
            callback("delete bookmark data err : " + err, null);
          } else {
            res.status(201).send({
              status: "success",
              msg: "successful delete bookmark"
            });
            connection.release();
            callback(null, "successful delete bookmark");
          }
        });
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