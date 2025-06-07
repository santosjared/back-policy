
export default ()=>({
    MONGO_URI:process.env.MONGO_URI,
    PORT:process.env.PORT,
    JWT_SECRET:process.env.JWT_SECRET,
    RESEND_API_KEY:process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL:process.env.RESEND_FROM_EMAIL || 'soporte@tudominio.com'
})