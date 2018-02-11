module.exports.authCheck = function(req, res, next){
  // Check if user is not logged in
  if(req.user){
    next();
  } else {
    res.redirect('/auth/login');
  }
};

module.exports.unauthCheck = function(req, res, next){
  // Check if user is not logged in
  if(!req.user){
    next();
  } else {
    res.redirect('/auth/logout/ask');
  }
};
