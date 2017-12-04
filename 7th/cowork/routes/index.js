const express = require('express');
const router = express.Router();
const signin = require('./login/signin');
const signup = require('./login/signup');
const api = require('./apireference');
const board = require('./board/index');
const mypage = require('./mypage/index');


router.use('/signin', signin);
router.use('/signup', signup);
router.use('/api', api);
router.use('/board', board);
router.use('/mypage', mypage);

module.exports = router;
