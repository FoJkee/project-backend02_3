import {Response, Request, Router} from "express";
import {commentRepository} from "../repository/comment-repository";
import {errorsMiddleware} from "../middleware /errors-middleware";
import {authBearerMiddleware} from "../middleware /authbearer-middleware";
import {commentMiddleware} from "../middleware /comment-middleware";


export const commentRouter = Router({})


commentRouter.get('/:id', async (req: Request, res: Response) => {
    const getComId = await commentRepository.getComId(req.params.id)
    if (getComId) {
        res.status(200).json(getComId)
    } else {
        res.sendStatus(404)
    }
})


commentRouter.delete('/:commentId', authBearerMiddleware, async (req: Request, res: Response) => {

    const findComId = await commentRepository.getComId(req.params.commentId)
    if (!findComId) {
        res.sendStatus(404)
        return
    }
    if (req.user!.id !== findComId?.commentatorInfo?.userId) {
        res.sendStatus(403)

    } else {
        const deleteComId = await commentRepository.deleteCom(req.params.commentId)
        res.sendStatus(204)
        return
    }

})

commentRouter.put('/:commentId', authBearerMiddleware, commentMiddleware, errorsMiddleware, async (req: Request, res: Response) => {

    const findComId = await commentRepository.getComId(req.params.commentId)
    if (!findComId) {
        res.sendStatus(404)
        return
    }
    if (req.user!.id !== findComId?.commentatorInfo?.userId) {
        res.sendStatus(403)

    } else {
        const comPut = await commentRepository.updateCom(req.body.content, req.params.commentId)
        res.sendStatus(204)
        return
    }

})