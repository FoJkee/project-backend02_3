import {Response, Router, Request} from "express";
import {authService} from "../domen/auth-service";
import {jwtService} from "../application/jwt-service";
import {authPassMiddleware} from "../middleware /authpass-middleware";
import {errorsMiddleware} from "../middleware /errors-middleware";
import {userRepository} from "../repository/user-repository";
import {authBearerMiddleware} from "../middleware /authbearer-middleware";
import {userService} from "../domen/user-service";
import {userMiddleware} from "../middleware /user-middleware";
import {emailConfirmation, emailResending} from "../middleware /email-middleware";
import {randomUUID} from "crypto";


export const authRouter = Router({})

authRouter.post('/registration-confirmation', emailConfirmation, errorsMiddleware, async (req: Request, res: Response) => {
    const result = await userService.confirmCode(req.body.emailConfirmationCode)

    return res.status(204).json(result)

})

authRouter.post('/registration', userMiddleware, errorsMiddleware, async (req: Request, res: Response) => {

    const user = await userService.createUser(req.body.login, req.body.password, req.body.email)

    return res.status(204).json(user)

})
authRouter.post('/registration-email-resending', emailResending, errorsMiddleware, async (req: Request, res: Response) => {

    const result = await userService.confirmEmail(req.body.email, req.body.code)


    return res.status(204).json(result)

})


authRouter.post('/login', authPassMiddleware, errorsMiddleware, async (req: Request, res: Response) => {

    const loginUser = await userService.checkCredentials(req.body.loginOrEmail, req.body.password)
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