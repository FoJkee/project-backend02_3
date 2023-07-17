import {BlogType_Id, BlogTypeId, Paginated} from "../types/blog-type";
import {Filter, ObjectId, Sort, SortDirection} from "mongodb";
import {blogRepository} from "../repository/blog-repository";
import {PostType_Id, PostTypeId} from "../types/post-type";
import {blogCollection, postCollection} from "../db";


export const blogService = {

    async getBlog(searchNameTerm: string, sortBy: string, sortDirection: SortDirection, pageNumber: number,
                  pageSize: number): Promise<Paginated<BlogTypeId>> {

        return blogRepository.getBlog(searchNameTerm, sortBy, sortDirection, pageNumber, pageSize)

    },

    async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogTypeId> {

        const newBlog: BlogType_Id = {
            _id: new ObjectId(),
            name,
            description,
            websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        return blogRepository.createBlog(newBlog)

    },

    async getBlogForPost(pageNumber: number, pageSize: number, sortBy: string,
                         sortDirection: SortDirection, blogId: string): Promise<Paginated<PostTypeId>> {

        return blogRepository.getBlogForPost(pageNumber, pageSize, sortBy, sortDirection, blogId)

    },

    async createBlogForPost(title: string, shortDescription: string, content: string,
                            blogId: string): Promise<PostTypeId | null> {

        const createPostForBlog = await blogCollection.findOne({_id: new ObjectId(blogId)})
        if (!createPostForBlog) return null

        const createPostInBlog: PostType_Id = {
            _id: new ObjectId(),
            title,
            shortDescription,
            content,
            blogId: createPostForBlog._id.toString(),
            blogName: createPostForBlog.name,
            createdAt: new Date().toISOString()
        }
        return blogRepository.createBlogForPost(createPostInBlog, blogId)

    },

    async getBlogForId(id: string): Promise<BlogTypeId | null> {
        return blogRepository.getBlogForId(id)
    },

    async updateBlogId(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        return blogRepository.updateBlogId(id, name, description, websiteUrl)
    },

    async deleteBlogId(id: string): Promise<boolean> {
        return blogRepository.deleteBlogId(id)
    },

    async deleteBlogAll(): Promise<boolean> {
        return blogRepository.deleteBlogAll()
    }


}