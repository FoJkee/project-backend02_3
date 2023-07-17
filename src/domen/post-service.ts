import {CommentType_Id, CommentTypeId} from "../types/comment-type";
import {commentCollection, postCollection, userCollection} from "../db";
import {Filter, ObjectId, Sort, SortDirection} from "mongodb";
import {postRepository} from "../repository/post-repository";
import {PostType_Id, PostTypeId} from "../types/post-type";
import {Paginated} from "../types/blog-type";


export const postService = {

    async getPostForComments(pageNumber: number, pageSize: number,
                             sortBy: string, sortDirection: SortDirection, postId: string): Promise<Paginated<CommentTypeId>> {

        return postRepository.getPostForComments(pageNumber, pageSize, sortBy, sortDirection, postId)

    },

    async createPostForComments(content: string, userId: string, postId: string): Promise<CommentTypeId | null> {

        const user = await userCollection.findOne({_id: new ObjectId(userId)},)

        const createComInPost: CommentType_Id = {
            _id: new ObjectId(),
            postId: new ObjectId(postId),
            content,
            commentatorInfo: {
                userId: user!._id.toString(),
                userLogin: user!.login,
            },
            createdAt: new Date().toISOString()
        }

        return postRepository.createPostForComments(createComInPost)

    },

    async getPost(pageNumber: number, pageSize: number, sortBy: string, sortDirection: SortDirection): Promise<Paginated<PostTypeId>> {

        return postRepository.getPost(pageNumber, pageSize, sortBy, sortDirection)

    },

    async createPost(title: string, shortDescription: string, content: string, blogId: string, blogName: string): Promise<PostTypeId> {

        const newPost: PostType_Id = {
            _id: new ObjectId(),
            title,
            shortDescription,
            content,
            blogId,
            blogName,
            createdAt: new Date().toISOString()
        }
        return postRepository.createPost(newPost)

    },

    async getPostForId(id: string): Promise<PostTypeId | null> {
        return postRepository.getPostForId(id)
    },

    async updatePost(id: string, title: string, shortDescription: string,
                     content: string, blogId: string): Promise<boolean> {

        return postRepository.updatePost(id, title, shortDescription, content, blogId)
    },

    async deletePostId(id: string): Promise<boolean> {
        return postRepository.deletePostId(id)

    },
    async deletePostAll() {
        return postRepository.deletePostAll()
    }

}