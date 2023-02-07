import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const accessToken = req.headers['AccessToken'].split('Bearer ')[1];
    const refreshToken = req.headers['RefreshToken'];

    if (!accessToken) {
      return res.status(403).json({
        message: 'Not authorized.',
      });
    }

    req.user = jwt.verify(accessToken, process.env.API_SECRET);

    next();
  } catch (e) {
    console.error(e);

    return res.status(403).json({
      message: 'User is not authorized',
    });
  }
};
