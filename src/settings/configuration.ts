const configuration = () => ({
  port: parseInt(process.env.PORT!, 10) || 3000,
  auth: {
    passwordSecret: process.env.PASSWORD_SECRET,
    basicUser: process.env.HTTP_BASIC_USER,
    basicPassword: process.env.HTTP_BASIC_PASS,
    jwtExpireTime: process.env.JWT_EXPIRE_TIME,
    jwtSecret: process.env.JWT_SECRET,
  },
  smtp: {
    email: process.env.SMTP_EMAIL,
    password: process.env.SMTP_PASSWORD,
  },
  throttle: {
    ttl: process.env.TH_TTL || 10,
    limit: process.env.TH_LIMIT || 5,
  },
});

export default configuration;
