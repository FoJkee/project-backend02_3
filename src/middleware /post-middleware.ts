import {body} from "express-validator";
import {blogRepository} from "../repository/blog-repository";


export const postMiddleware = [
    body('title').exists().trim().isString()
        .isLength({min: 1, max: 30}).withMessage('Incorrect title'),
    body('shortDescription').exists().trim().isString()
        .isLength({min: 1, max: 100}).withMessage('Incorrect shortDescription'),
    body('content').exists().trim().isString().isLength({min: 1, max: 1000}).withMessage('Incorrect content'),
    body("blogId").exists().trim().isString().custom(async (value, {req}) => {
        const blogData = await blogRepository.getBlogForId(value)
        if (!blogData) throw new Error()
        req.body.blogName = blogData.name
        return true
    })
]