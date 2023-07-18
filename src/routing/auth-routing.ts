import  {Response, Router, Request} from "express";
import {authService} from "../domen/auth-service";
import {jwtService} from "../application/jwt-service";
import {authPassMiddleware} from "../middleware /authpass-middleware";
import {errorsMiddleware} from "../middleware /errors-middleware";
import {userRepository} from "../repository/user-repository";
import {authBearerMiddleware} from "../middleware /authbearer-middleware";
import {emailAdapters} from "../adapters/email-adapters";


export const authRouter = Router({})

authRouter.post('/registration-confirmation', async (req: Request, res: Response) => {


})
authRouter.post('/registration', async (req: Request, res: Response) => {
    const email  = await emailAdapters.sendEmail(req.body.email)

    res.status(204).json(email)

})

authRouter.post('/registration-email-resending', async (req: Request, res: Response) => {


})


authRouter.post('/login', authPassMiddleware, errorsMiddleware, async (req: Request, res: Response) => {

    const loginUser = await authService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (loginUser) {
        const token = await jwtService.createJwt(loginUser)
        res.status(200).json({accessToken: token})

    } else {
        res.sendStatus(401)
    }
})

authRouter.get('/me', authBearerMiddleware, async (req: Request, res: Response) => {

    const userMe = await userRepository.getMe()

    return res.status(200).json(userMe)

})