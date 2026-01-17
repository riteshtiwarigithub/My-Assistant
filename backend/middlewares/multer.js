import multer from "multer"
import fs from "fs"

// ✅ Use /tmp on Render, ./public locally
const uploadDir = process.env.NODE_ENV === 'production' ? '/tmp' : './public'

// Create directory if doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
})

export default upload