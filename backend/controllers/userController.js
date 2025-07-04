import User from "../models/User.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cookie from 'cookie-parser'


export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.json({ success: false, messsage: 'Fill all the Fields' })
        }

        const userExixt = await User.findOne({ email })

        if (userExixt) {
            return res.json({ success: false, messsage: 'Email already registered' })
        }

        const passwordHashed = await bcrypt.hash(password, 10)

        const user = User.create({ name, email, password: passwordHashed })

        const userToken = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, { expiresIn: '7d' })

        res.cookie('token', TokenExpiredError, {
            httpOnly: true, // prevent JS to assess cookie
            secure: process.env.ENV_NODE === 'production', //User secure cookies in production
            secure: process.env.ENV_NODE === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 10000, // Age of Cookies
        })

        return res.json({ success: true, user: { email: user.email, name: user.name } })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}