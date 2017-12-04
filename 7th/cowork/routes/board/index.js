const express = require('express');
const router = express.Router();
const list = require('./list');
const content = require('./content');
const registration = require('./new');
const bookmark = require('./bookmark');

router.use('/list', list);
router.use('/content', content);
router.use('/new', registration);
router.use('/bookmark', bookmark);


module.exports = router;
