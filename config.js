module.exports = {
    apps : [
        {
            name: "api",
            script: "node /home/ubuntu/food-recipes/api/src/index.js",
            env: {
                "API_PORT": 4000,
                "DATABASE_URL": "postgresql://postgres:postgres@localhost:5432/food-db",
                "CLIENT_URL": "http://localhost:3000",
                "API_SECRET": 12746123,
                "API_REFRESH_SECRET": 238974618924,

            }
        },
        {
          name: "ui",
          script: "cd /home/ubuntu/food-recipes/client && npm run start",
          env: {
            "REACT_APP_API_BASE_URL": "http://localhost:4000",
          }
        }
    ]
}
