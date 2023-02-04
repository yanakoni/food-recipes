import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export const verifyToken = (req, res, next) => {
    if(req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(403).json({
                message: "User is not authorized"
            })
        }
        const decodedData = jwt.verify(token, "1234567");
        req.user = decodedData;
        next()
    }catch(e){
        console.log(e);
        return res.status(403).json({
            message: "User is not authorized"
        })
    }
};
