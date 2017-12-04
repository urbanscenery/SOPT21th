const express = require('express');
const router = express.Router();
const async = require('async');
const moment = require('moment');
const pool = require('../../config/db_pool');

router.get('/:useremail', (req, res) => {
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
      let selectMarkedQuery = "select b.board_id, b.board_title, b.board_image, b.board_hits, b.board_writetime, u.user_nickname " +
        "from board b " +
        "join bookmark m " +
        "on b.board_id = m.board_id " +
        "join users u " +
        "on b.user_email = u.user_email " +
        "where m.user_email = ? order by b.board_writetime desc";
      connection.query(selectMarkedQuery, req.params.useremail, (err, bookmarkData) => {
        if (err) {
          res.status(500).send({
            status: "fail",
            msg: "get marked board data error"
          });
          connection.release();
          callback("selectMarkedQuery err : " + err, null);
        } else {
          let listArray = [];
          for(let i = 0 ; i < bookmarkData.length ; i++){
            let data = {
              board_id : bookmarkData[i].board_id,
              board_title : bookmarkData[i].board_title,
              board_image : bookmarkData[i].board_image,
              board_hits : bookmarkData[i].board_hits,
              board_writetime : moment(bookmarkData[i].board_writetime, moment.ISO_8601).format('YYYY-MM-DD HH:mm:ss'),
              user_nickname : bookmarkData[i].user_nickname
            }
            listArray.push(data);
          }
          res.status(200).send({
            status : "success",
            data : listArray,
            msg : "successful get bookmark lists"
          });
          connection.release();
          callback(null, "successful get bookmark lists");
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