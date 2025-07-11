import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { TokenUserData, User } from './interfaces';

const atSecret: string = 'at_secret'

export function generateAccessToken(user: User) {
    const tokenUserData: TokenUserData = setTokenUserData(user)
    return jwt.sign(tokenUserData, atSecret)
}

export function getToken(req: Request) {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(" ")[1]

    return token
}

export function decodeToken(token: string) {
    return jwt.decode(token)
}

function setTokenUserData(user: User) {
    return {
        id: user.id,
        email: user.email,
        user: user.user
    }
}