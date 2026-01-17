import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const existEmail = await User.findOne({ email })
    if (existEmail) {
      return res.status(400).json({ message: "email already exists !" })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "password must be at least 6 characters !" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    const token = await genToken(user._id)

    // ✅ Updated cookie settings for production
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production', // true in production, false in dev
      path: '/'
    })

    const { password: pwd, ...safeUser } = user._doc
    return res.status(201).json(safeUser)

  } catch (error) {
    return res.status(500).json({ message: `sign up error ${error}` })
  }
}

export const Login = async (req, res) => {
  console.log("🔥 SIGNIN API HIT")
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "email does not exist !" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "incorrect password" })
    }

    const token = await genToken(user._id)

    // ✅ Updated cookie settings for production
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production', // true in production, false in dev
      path: '/'
    })

    const { password: pwd, ...safeUser } = user._doc
    return res.status(200).json(safeUser)

  } catch (error) {
    return res.status(500).json({ message: `login error ${error}` })
  }
}

export const logOut = async (req, res) => {
  try {
    // ✅ Updated clearCookie settings
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    })
    return res.status(200).json({ message: "log out successfully" })
  } catch (error) {
    return res.status(500).json({ message: `logout error ${error}` })
  }
}