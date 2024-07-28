const jwt = require("jsonwebtoken");
const secret = "@20211067766515042001@Amdr53600";

const isLogin = (req,res,next) => {
  
  const token = req.header("token");

  console.log(token);
  if (!token)
    return res.status(401).send({ success: false, error: "Invalid credentials" });

  try {
    const user = jwt.verify(token, secret);
    if (!user)
      return res.status(401).send({ success: false, error: "Invalid credentials" });
    else {
      req.user = user.id;
      // console.log(req.user, " from Middleware");
      next();
    }
  } catch (error) {
    return res.status(500).send({ success: false, error: error.message });
  }
};

module.exports = isLogin;
