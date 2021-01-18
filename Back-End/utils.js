import jwt from 'jsonwebtoken';
import config from "./config";

/* jwt stands for JSON Web Token, The below code generates a token for every user when they log into the application to authenticate their username */
export const generateToken = (user) => {
    return jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      config.JWT_SECRET,
    );
  };

/* Middlewear used to prevent non-authorized users to change each others saved information */
export const isAuth = (req, res, next) => {
  const bearerToken = req.headers.authorization;
  if (!bearerToken) {
    res.status(401).send({ message: 'Token is not supplied' });
  } else {
    const token = bearerToken.slice(7, bearerToken.length);
    jwt.verify(token, config.JWT_SECRET, (err, data) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = data;
        next();
      }
    });
  }
};

/* Middlewear that checks whether the user is the Admin User or not */
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) { // req.user is defined by isAuth middlewear above when it is executed
    next();
  } else {
    res.status(401).send({ message: 'Token is not valid for Admin User' });
  }
};
