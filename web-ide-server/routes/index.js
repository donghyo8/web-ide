var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({msg: "환영한다? IDE 서버에 온 걸? 개발은 근성이다?"})
});

module.exports = router;
