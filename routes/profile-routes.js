const router = require('express').Router();
const authCheck = require('../modules/auth-check').authCheck;

router.get('/', authCheck, function(req, res){
  res.render('profile', {user: req.user});
});

module.exports = router;
