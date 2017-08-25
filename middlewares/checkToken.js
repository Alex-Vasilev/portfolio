const jwt =require('jsonwebtoken');

exports.checkToken = function (req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return next({
      status: 403,
      message: 'Forbidden. No Token!'
    });
  }
 var tokenObj = jwt.verify(token, 'balalaika');
//  try {
//    var tokenObj = jwt.verify(token, 'balalaika');
//  } catch ({ message }) {
//    return next({
//      status: 400,
//      message
//    });
//  }
  
  req.token = tokenObj;
//  next();
}

