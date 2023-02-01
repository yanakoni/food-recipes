export class Environment{
    static get config(){
        return {
            http: {
                LOCAL_PORT: process.env.LOCAL_PORT || 3000
            }
        }
    }
}