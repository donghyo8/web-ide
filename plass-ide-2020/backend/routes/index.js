var express = require('express');
var router = express.Router();
const sql = require('../sql');
var db = require('../modules/db-connection-pool');

router.get('/', function (req, res) {
  res.status(200);
  res.json({
    login: req.session.login,
    username: req.session.username,
    authority: req.session.authority,
    page: 'main'
  });
});
router.get('/logout', function (req, res) {
  res.status(200);
  req.session.destroy(function (err) {
    if (err) {
      console.log("Session destroy Error");
    } else {
      res.redirect('/');
    }
  })
});
module.exports = router;

