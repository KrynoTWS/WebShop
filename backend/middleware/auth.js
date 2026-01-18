const jwt = require("jsonwebtoken");

const signJwt = (user) => {
  const token = jwt.sign(
    {
      sub: user._id,
      role: user.role
    },
    process.env.JWT_SECRET
  );

  return token;
};

const verifyJwt = (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization
    ? authorization.split("Bearer ")[1]
    : undefined;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err || !payload.sub) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = payload;
    next();
  });
};

module.exports = { signJwt, verifyJwt };