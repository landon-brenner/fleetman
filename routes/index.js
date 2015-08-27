var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('navbar-fixed-top', { title: 'Fleet Manager 0.1' });
});

module.exports = router;
