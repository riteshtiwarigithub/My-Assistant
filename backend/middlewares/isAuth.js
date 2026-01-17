import jwt from "jsonwebtoken"

const isAuth = async (req, res, next) => {
    try {
        console.log("🔐 Checking authentication...")
        console.log("- Cookies:", req.cookies)
        
        const token = req.cookies.token
        
        if (!token) {
            console.log("❌ No token found")
            return res.status(400).json({ message: "token not found" })
        }

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET)
        console.log("✅ Token verified, userId:", verifyToken.userId)
        
        req.userId = verifyToken.userId
        next()

    } catch (error) {
        console.error("❌ Auth error:", error.message)
        return res.status(500).json({ message: "is Auth error" })
    }
}

export default isAuth