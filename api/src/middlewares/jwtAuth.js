import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const accessToken = req.headers['access-token'].split('Bearer ')[1];
    const refreshToken = req.headers['refresh-token'];

    if (!accessToken) {
      return res.status(403).json({
        message: 'Not authorized.',
      });
    }

    await jwt.verify(accessToken, process.env.API_SECRET, (err, decoded) => {
      if (err && err instanceof jwt.TokenExpiredError) {
        jwt.verify(refreshToken, process.env.API_REFRESH_SECRET, (err, { id }) => {
          if (err && err instanceof jwt.TokenExpiredError) {
            return res.status(403).json({
              message: 'Not authorized.',
            });
          }

          const aToken = jwt.sign(
            {
              id,
            },
            process.env.API_SECRET,
            {
              expiresIn: '1h',
            }
          );

          const rToken = jwt.sign(
            {
              id,
            },
            process.env.API_REFRESH_SECRET,
            {
              expiresIn: '30d',
            }
          );
          return res.status(201).json({ accessToken: aToken, refreshToken: rToken });
        });
      } else {
        req.user = { id: decoded.id };
      }
    });

    next();
  } catch (e) {
    console.error(e);

    return res.status(403).json({
      message: 'Not authorized.',
    });
  }
};
