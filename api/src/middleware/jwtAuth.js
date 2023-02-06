import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const token = req.headers.authorization.split('Bearer ')[1];

    if (!token) {
      return res.status(403).json({
        message: 'User is not authorized',
      });
    }

    req.user = jwt.verify(token, process.env.API_SECRET);

    next();
  } catch (e) {
    console.error(e);

    return res.status(403).json({
      message: 'User is not authorized',
    });
  }
};
