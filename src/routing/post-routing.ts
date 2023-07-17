import {Router, Request, Response} from "express";
import {QueryParamsPost} from "../types/post-type";
import {authMiddleware} from "../middleware /auth-middleware";
import {postMiddleware} from "../middleware /post-middleware";
import {errorsMiddleware} from "../middleware /errors-middleware";
import {CommentTypeId, QueryParamsCom} from "../types/comment-type";
import {commentMiddleware} from "../middleware /comment-middleware";
import {postService} from "../domen/post-service";
import {authBearerMiddleware} from "../middleware /authbearer-middleware";


export const postRouter = Router({})

postRouter.get('/:id/comments',async (req: Request<CommentTypeId, {}, {}, QueryParamsCom>, res: Response) => {
    const findPostId = await postService.getPostForId(req.params.id)

    if (!findPostId) {
        res.sendStatus(404)
        return
    }

    const postIdCom = await postService.getPostForComments(
        Number(req.query.pageNumber) || 1,
        Number(req.query.pageSize) || 10,
        req.query.sortBy || 'createdAt',
        req.query.sortDirection === 'asc' ? "asc" : "desc",
        req.params.id
    )

    return res.status(200).json(postIdCom)

})
postRouter.post('/:id/comments', authBearerMiddleware, commentMiddleware, errorsMiddleware,
    async (req: Request, res: Response) => {

        const findPostId = await postService.getPostForId(req.params.id)
        if (!findPostId) {
            res.sendStatus(404)
            return
        }

        const createPostForCom = await postService.createPostForComments(
            req.body.content, req.user!.id, req.params.id)
        return res.status(201).json(createPostForCom)

    })

postRouter.get('/', async (req: Request<{}, {}, {}, QueryParamsPost>, res: Response) => {

    const getPost = await postService.getPost(
        Number(req.query.pageNumber) || 1,
        Number(req.query.pageSize) || 10,
        req.query.sortBy || 'createdAt',
        req.query.sortDirection === 'asc' ? "asc" : "desc"
    )

    return res.status(200).json(getPost)

})

postRouter.post('/', authMiddleware, postMiddleware, errorsMiddleware, async (req: Request, res: Response) => {

    const createPost = await postService.createPost(
        req.body.title,
        req.body.shortDescription,
        req.body.content,
        req.body.blogId,
        req.body.blogName
    )
    return res.status(201).json(createPost)
})

postRouter.get('/:id', async (req: Request, res: Response) => {
    const findPostId = await postService.getPostForId(req.params.id)

    if (!findPostId) {
        res.sendStatus(404)
    } else {
        res.status(200).json(findPostId)
    }
})

postRouter.put('/:id', authMiddleware, postMiddleware, errorsMiddleware, async (req: Request, res: Response) => {
    try {
        const findPostId = await postService.getPostForId(req.params.id)
        if (!findPostId) {
            res.sendStatus(404)

        } else {
            const updatePost = await postService.updatePost(
                req.params.id,
                req.body.title,
                req.body.shortDescription,
                req.body.content,
                req.body.blogId,
            )
            res.sendStatus(204)
        }
    } catch (e) {
        res.status(401).json(e)
    }

})

postRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const findPostId = await postService.getPostForId(req.params.id)
    if (!findPostId) {
        res.sendStatus(404)
        return
    }

    const deletePost = await postService.deletePostId(req.params.id)
    return res.sendStatus(204)

})