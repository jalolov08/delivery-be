import { Request, Response, NextFunction } from "express";

async function checkAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.user && req.user.isAdmin) {
        return next();
    } else {
        res.status(403).json({
            error: "Доступ запрещен. Только для администраторов.",
        });
        return
    }
}

export default checkAdmin;
