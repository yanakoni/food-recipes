export class UserController {
    async createUser(req, res) {
        const {login, fridge} = req.body;
        console.log(login, fridge);
        res.json('mama serogo krutaya jenchina')
    }
    async getUsers(req, res) {
        console.log("succsess")
        res.json("200")
    }
    async getUser(req, res) {
        
    }
    async updateUser(req, res) {

    }
    async deleteUser(req, res) {
        
    }
}
