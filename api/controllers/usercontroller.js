import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient()

export class UserController {
    async test(req, res){ 
        const username = "roman";
        const password = "12345";
        const user = await prisma.users.findFirst({
                where: {
                    username: username
                }
        });
        console.log(user)
        res.status(200).json({
            message: "111111"
        })
    }
    async helloworld(req, res){ 
        res.status(200).json({
            message: "mat shluha"
        })
    }
    async singUp(req, res) {
        //const { username, password, email } = req.body;
        const username = "roman";
        const password = "12345";
        const email = "roman@gmail.com";
        console.log(username);
        try {
            const exister = await prisma.users.findFirst({
                where: {
                    username: username
                }
            });
            if (exister) {
                return res.status(400).json({
                    message: "User already exist"
                });
            }
            await prisma.users.create({
                data: {
                    email: email,
                    username: username,
                    password: bcrypt.hashSync(password, 5)
                }
            });
            res.status(200).json({
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
        //const { username, password} = req.body;
        const username = "roman";
        const password = "12345";
        try{
            const user = await prisma.users.findFirst({
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
            }, "1234567", {
                expiresIn: "1h"
            });
            
            res.status(200).json({
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                },
                message: "Login successfull",
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
