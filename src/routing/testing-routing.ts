import {Response, Router, Request} from "express";
import {postService} from "../domen/post-service";
import {blogService} from "../domen/blog-service";
import {userService} from "../domen/user-service";


export const testingRouter = Router()


testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await postService.deletePostAll()
    await blogService.deleteBlogAll()
    await userService.deleteUserAll()
    res.sendStatus(204)
})
