import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt";
const prisma = new PrismaClient()

export class UserController {
    async singUp(req, res) {
        const { username, password, email } = req.body;
        try {
            const exister = await prisma.user.findFirst({
                where: {
                    username: username
                }
            });
            if (exister) {
                return res.status(400).send({
                    message: "User already exist"
                });
            }
            await prisma.user.create({
                data: {
                    email: email,
                    username: username,
                    password: bcrypt.hashSync(password, process.env.SALT ?? 5)
                }
            });
            res.status(200);
        } catch (e) {
            res.status(400).send({
                message: "sign up failed"
            })
        }
    }
    async singIn(req, res){
        const { username, password, email } = req.body;
        try{
            const user = await prisma.user.findUnique({
                where: {
                    username: username
                }
            });
            if(!user) {
                return res.status(404).send({
                message: "User Not found."
            });
            }
            const passwordIsValid = bcrypt.compareSync(
                password,
                user.password
            );
            if (!passwordIsValid) {
                return res.status(401)
                  .send({
                    accessToken: null,
                    message: "Invalid Password!"
                  });
              }
            const token = jwt.sign({
                id: user.id
            }, process.env.API_SECRET, {
                expiresIn: 7200
            });
            
            res.status(200).send({
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
            res.status(404).send({
                message: "User Not found."
            });
        }
    }
}
