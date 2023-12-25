export const AuthConstants = {
  secretKey: process.env.jwtSecretKey || 'sadas4c5asc5as5c54545as4545',
  strategies: ['jwt'],
  expiresIn: process.env.jwtExpiresIn || '2d'
};
