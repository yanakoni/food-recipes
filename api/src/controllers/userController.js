import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();

export class UserController {
    async singUp(req, res) {
        const { username, password } = req.body;
        try {
            const exist = await prisma.user.findFirst({
                where: {
                    username: username
                }
            });
            if (exist) {
                return res.status(409).json({
                    message: "User already exist"
                });
            }
            await prisma.user.create({
                data: {
                    username: username,
                    password: bcrypt.hashSync(password, parseInt(process.env.API_SECRET))
                }
            });
            res.status(201).json({
                message: "User successfully created"
            });
        } catch (e) {
            console.log(e);
            res.status(400).json({
                message: "Signup failed"
            })
        }
    }
    async singIn(req, res){
        const { username, password} = req.body;
        try{
            const user = await prisma.user.findFirst({
                where: {
                    username: username
                }
            });
            console.log(user);
            if(!user) {
                return res.status(404).json({
                message: "User Not found."
            });
            }
            const passwordIsValid = bcrypt.compareSync(
                password,
                user.password
            );
            if (!passwordIsValid) {
                return res.status(401)
                  .json({
                    accessToken: null,
                    message: "Invalid Password!"
                  });
              }
            const token = jwt.sign({
                id: user.id
            }, process.env.API_SECRET, {
                expiresIn: "1h"
            });

            res.status(200).json({
                user: {
                    id: user.id,
                    username: user.username
                },
                message: "Login successfully",
                accessToken: token
            })
        }
        catch(e){
            console.warn(e);
            res.status(404).json({
                message: "User Not found catch module."
            });
        }
    }
}
