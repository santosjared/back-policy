export default () => ({
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/denuncias',
  PORT: parseInt(process.env.PORT ?? '3000', 10),
  JWT_SECRET: process.env.JWT_SECRET || 'mySecret',
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || 'soporte@tudominio.com',
  ROOT_EMAIL: process.env.ROOT_EMAIL || 'admin@gmail.com',
  ROOT_PASSWORD: process.env.ROOT_PASSWORD || 'admin',
  ROOT_NAME: process.env.ROOT_NAME || 'SuperAdministrador',
});
