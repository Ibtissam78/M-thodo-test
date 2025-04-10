
import jwt from 'jsonwebtoken';

const middlewaresjwtVerify = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send('Token is missing');
    }

    const tokenParts = token.split(' ');
    const tokenValue = tokenParts[1];

    jwt.verify(tokenValue, 'cledechiffrage', (err, decoded) => {
        if (err) {
            return res.status(403).send('Token is invalid');
        }
        
        next();
    });
};
export { middlewaresjwtVerify };