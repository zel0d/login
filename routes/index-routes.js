const router = require('express').Router();
const authCheck = require('../modules/auth-check').authCheck;

router.get('/', authCheck, function(req, res){
  res.render('home', {user: req.user});
  console.log(req.session);
});

module.exports = router;
