import {Response, Router, Request} from "express";
import {QueryParamsUser} from "../types/user-type";
import {authMiddleware} from "../middleware /auth-middleware";
import {errorsMiddleware} from "../middleware /errors-middleware";
import {userMiddleware} from "../middleware /user-middleware";
import {userService} from "../domen/user-service";
import {ObjectId} from "mongodb";


export const userRouter = Router({})


userRouter.get('/', async (req: Request<{}, {}, {}, QueryParamsUser>, res: Response) => {
    const userGet = await userService.getUser(
        req.query.searchLoginTerm || '',
        req.query.searchEmailTerm || '',
        req.query.sortBy || 'createdAt',
        req.query.sortDirection  === 'asc' ? "asc" : "desc",
        Number(req.query.pageNumber) || 1,
        Number(req.query.pageSize) || 10
    )
    return res.status(200).json(userGet)

})

userRouter.post('/', authMiddleware, userMiddleware, errorsMiddleware, async (req: Request, res: Response) => {

    const postUser = await userService.createUser(
        req.body.login, req.body.password, req.body.email
    )
    return res.status(201).json(postUser)

})

userRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const findUserId = await userService.getUserId(req.params.id)
    if(!findUserId){
        res.sendStatus(404)
        return
    }
    const deleteUserId = await userService.deleteUserId(req.params.id)
    res.sendStatus(204)


})



