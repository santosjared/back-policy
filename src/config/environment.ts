
export default ()=>({
    MONGO_URI:process.env.MONGO_URI,
    PORT:process.env.PORT,
    JWT_SECRET:process.env.JWT_SECRET
})