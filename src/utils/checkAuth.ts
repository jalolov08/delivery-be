import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config";

export interface DecodedToken {
    _id: string;
}
declare global {
    namespace Express {
        interface Request {
            user: DecodedToken;
        }
    }
}
async function checkAuth(req: Request, res: Response, next: NextFunction) {
    const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");

    if (token) {
        try {
            const decoded = jwt.verify(token, jwtSecret) as DecodedToken;
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({
                error: "Неавторизованный.",
            })
            return
        }
    } else {
        res.status(401).json({
            error: "Неавторизованный.",
        })
        return
    }
}

export default checkAuth;
