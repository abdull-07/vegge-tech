import express from 'express'
import { sellerLogin, checkAuthSeller, logoutSeller } from '../controllers/sellerController.js'
import sellerAuth from "../middlewares/sellerAuth.js"

const router = express.Router()

router.post('/login', sellerLogin)
router.get('/check-auth', checkAuthSeller)
router.post('/logout', sellerAuth, logoutSeller)

export default router