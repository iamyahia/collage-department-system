const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  //  verify to have a correct user,, authorization
  const authHeader = req.headers["authorization"];
  //  Bearer  token
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.json("unAuth");
  jwt.verify(token, "secret", (err, user) => {
    if (err)
      return res.json({ message: "we have error, please fix it", err: err });
    req.user = user;
    next();
  });
}

module.exports = {
  authenticateToken,
};
