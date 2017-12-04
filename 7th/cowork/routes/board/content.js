const express = require('express');
const router = express.Router();
const async = require('async');
const moment = require('moment');
const pool = require('../../config/db_pool');


router.get('/:boardid/:useremail', (req, res) => {
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
      let getContentQuery = 'select b.board_id, b.board_title, b.board_content, b.board_image, b.board_hits, b.board_writetime, u.user_nickname from board as b inner join users as u '+
      'on b.user_email = u.user_email where b.board_id = ?';
      connection.query(getContentQuery, req.params.boardid,(err, contents) => {
        if (err) {
          res.status(500).send({
            status: "fail",
            msg: "get board content error"
          });
          connection.release();
          callback("getContentQuery error : " + err);
        } else {
          let content = {
            board_id : contents[0].board_id,
            board_title : contents[0].board_title,
            board_content : contents[0].board_content,
            board_image : contents[0].board_image,
            board_hits : contents[0].board_hits + 1,
            board_writetime : moment(contents[0].board_writetime, moment.ISO_8601).format('YYYY-MM-DD HH:mm:ss'),
            board_bookmarked : 0,
            user_nickname : contents[0].user_nickname
          }
          callback(null, content, connection);
        }
      });
    },
    (content, connection, callback) => {
      let getCommentQuery = 'select c.comment_id, c.comment_content, c.comment_writetime, u.user_nickname from comment as c inner join users as u ' +
      'on c.user_email = u.user_email where c.board_id = ? order by c.comment_writetime desc';
      connection.query(getCommentQuery, req.params.boardid, (err, comment) => {
        if (err) {
          res.status(500).send({
            status: "fail",
            msg: "get board comments error"
          });
          connection.release();
          callback("getCommentQuery error : " + err);
        } else {
          let listArray = [];
          for(let i = 0 ; i < comment.length ; i++){
            let data = {
              comment_id : comment[i].comment_id,
              comment_content : comment[i].comment_content,
              comment_writetime : moment(comment[i].comment_writetime, moment.ISO_8601).format('YYYY-MM-DD HH:mm:ss'),
              user_nickname : comment[i].user_nickname
            }
            listArray.push(data);
          }
          callback(null, content, listArray, connection);
        }
      });
    },
    (content, comment, connection, callback) => {
      let getBookmarkedQuery = 'select * from bookmark where board_id = ? and user_email = ?';
      connection.query(getBookmarkedQuery, [req.params.boardid, req.params.useremail], (err, bookmark) => {
        if (err) {
          res.status(500).send({
            status: "fail",
            msg: "get bookmark data error"
          });
          connection.release();
          callback("getBookmarkedQuery error : " + err);
        } else {
          if(bookmark.length !== 0) {
            content.board_bookmarked = 1;
          }
          callback(null, content, comment, connection);
        }
      });
    },
    (content, comment, connection, callback) => {
      let updateHitQuery = 'update board set board_hits = board_hits + 1 where board_id = ?';
      connection.query(updateHitQuery, req.params.boardid, (err) => {
        if (err) {
          res.status(500).send({
            status: "fail",
            msg: "update board hit error"
          });
          connection.release();
          callback("updateHitQuery error : " + err);
        } else {
          res.status(200).send({
            status : "success",
            data : {
              content : content,
              comments : comment
            },
            msg : "successful load board content"
          });
          connection.release();
          callback(null, "successful load board content");
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