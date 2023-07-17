import {NextFunction, Response, Request} from "express";


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const code = Buffer.from("admin:qwerty", "utf-8").toString('base64')

    if(req.headers.authorization === `Basic ${code}`){
      next()
    } else {
      res.sendStatus(401)

    }

}