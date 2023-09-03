const jwt = require('jsonwebtoken');

const middlewareController = {
    //verifyToken
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        // console.log('Token ne cac ban:'+token)
        if (token) {
            //Bearer 123456789
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json("Token is not valid");
                }
                req.user = user;
                next();
            })
        } else {
            res.status(401).json("You are not authenticated");
        }
    },

    verifyTokenAndAdminAuth: (req, res) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.user.id == req.params.id) {
                next();
            } else {
                return res.status(403).json("You are not allowed to delete other");
            }
        })
    }
}

module.exports = middlewareController;