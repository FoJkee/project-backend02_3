import {Filter, ObjectId, SortDirection} from "mongodb";
import {PostType_Id, PostTypeId} from "../types/post-type";
import {commentCollection, postCollection, userCollection} from "../db";
import {Paginated} from "../types/blog-type";
import {CommentType_Id, CommentTypeId} from "../types/comment-type";

export const postRepository = {

    async getPostForComments(pageNumber: number, pageSize: number,
                             sortBy: string, sortDirection: SortDirection, postId: string): Promise<Paginated<CommentTypeId>> {

        const filter = {postId: new ObjectId(postId)}

        const settingComForPost: CommentType_Id[] = await commentCollection
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip(pageSize * (pageNumber - 1))
            .limit(pageSize)
            .toArray()

        const itemCom: CommentTypeId[] = settingComForPost.map(el => ({
            id: el._id.toString(),
            content: el.content,
            commentatorInfo: el.commentatorInfo,
            createdAt: el.createdAt
        }))

        const totalCount: number = await commentCollection.countDocuments(filter)
        const pagesCount: number = Math.ceil(totalCount / pageSize)

        const resultCom: Paginated<CommentTypeId> = {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: itemCom
        }
        return resultCom

    },

    async createPostForComments(createComInPost: CommentType_Id): Promise<CommentTypeId> {

        const resultCreateComInPost = await commentCollection.insertOne(createComInPost)

        return {
            id: resultCreateComInPost.insertedId.toString(),
            content: createComInPost.content,
            commentatorInfo: createComInPost.commentatorInfo,
            createdAt: createComInPost.createdAt
        }
    },

    async getPost(pageNumber: number, pageSize: number, sortBy: string, sortDirection: SortDirection): Promise<Paginated<PostTypeId>> {

        const filter: Filter<PostType_Id> = {}

        const settingPost = await postCollection
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip(pageSize * (pageNumber - 1))
            .limit(pageSize)
            .toArray()

        const itemPost: PostTypeId[] = settingPost.map(el => ({
            id: el._id.toString(),
            title: el.title,
            shortDescription: el.shortDescription,
            content: el.content,
            blogId: el.blogId,
            blogName: el.blogName,
            createdAt: el.createdAt
        }))


        const totalCount: number = await postCollection.countDocuments(filter)
        const pagesCount: number = Math.ceil(totalCount / pageSize)

        const resultPost: Paginated<PostTypeId> = {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: itemPost
        }
        return resultPost

    },

    async createPost(newPost: PostType_Id): Promise<PostTypeId> {

        const resultNewPost = await postCollection.insertOne(newPost)

        return {
            id: resultNewPost.insertedId.toString(),
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId,
            blogName: newPost.blogName,
            createdAt: newPost.createdAt
        }

    },
    async getPostForId(id: string): Promise<PostTypeId | null> {

        const findPostId = await postCollection.findOne({_id: new ObjectId(id)})

        if (findPostId) {
            return {
                id: findPostId._id.toString(),
                title: findPostId.title,
                shortDescription: findPostId.shortDescription,
                content: findPostId.content,
                blogId: findPostId.blogId,
                blogName: findPostId.blogName,
                createdAt: findPostId.createdAt
            }
        } else {

            return null
        }

    },

    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {

        const updatePostForId = await postCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                title,
                shortDescription,
                content,
                blogId
            }
        })

        return updatePostForId.matchedCount === 1

    },

    async deletePostId(id: string): Promise<boolean> {
        const deletePostId = await postCollection.deleteOne({_id: new ObjectId(id)})
        return deletePostId.deletedCount === 1

    },

    async deletePostAll() {
        const deleteAll = await postCollection.deleteMany({})
        return deleteAll.deletedCount === 1

    }

}