const express = require('express');
const router = express.Router();
const async = require('async');
const moment = require('moment');
const pool = require('../../config/db_pool');



router.get('/', (req, res) => {
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
    (connection, callback) => {
      let getListQuery = 'select b.board_id, b.board_title, b.board_image, b.board_hits, b.board_writetime, u.user_nickname from board as b inner join users as u '+
      'on b.user_email = u.user_email order by b.board_writetime desc';
      connection.query(getListQuery, (err, lists) => {
        if (err) {
          res.status(500).send({
            status: "fail",
            msg: "get board lists error"
          });
          connection.release();
          callback("getListQuery error : " + err);
        } else {
          let listArray = [];
          for(let i = 0 ; i < lists.length ; i++){
            let data = {
              board_id : lists[i].board_id,
              board_title : lists[i].board_title,
              board_image : lists[i].board_image,
              board_hits : lists[i].board_hits,
              board_writetime : moment(lists[i].board_writetime, moment.ISO_8601).format('YYYY-MM-DD HH:mm:ss'),
              user_nickname : lists[i].user_nickname
            }
            listArray.push(data);
          }
          res.status(200).send({
            status : "success",
            data : listArray,
            msg : "successful get board lists"
          });
          connection.release();
          callback(null, "successful get board lists");
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