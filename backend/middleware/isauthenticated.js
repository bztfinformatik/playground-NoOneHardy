const jwt = require("jsonwebtoken");
const secret = process.env.NODE_JWT_SECRET;


module.exports = (req, res, next) => {
    try {
        const authHeader = req.get("Authorization");
        if (!authHeader) {
            const err = new Error("Not authenticated.")
            err.statusCode = 403
            throw err
        }

        const token = authHeader.split(" ")[1]

        const payload = jwt.verify(token, secret)
        if (!payload) {
            const err = new Error("Not authenticated.")
            err.statusCode = 403
            throw err
        }
        next()
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    }
}
