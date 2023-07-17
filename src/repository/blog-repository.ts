import {Filter, ObjectId, Sort, SortDirection} from "mongodb";
import {blogCollection, postCollection} from "../db";
import {BlogType_Id, BlogTypeId, Paginated} from "../types/blog-type";
import {PostType_Id, PostTypeId} from "../types/post-type";


export const blogRepository = {

    async getBlog(searchNameTerm: string, sortBy: string, sortDirection: SortDirection, pageNumber: number,
                  pageSize: number): Promise<Paginated<BlogTypeId>> {

        const filter: Filter<BlogType_Id> = {name: {$regex: searchNameTerm, $options: 'i'}}

        const settingBlog = await blogCollection
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip(pageSize * (pageNumber - 1))
            .limit(pageSize)
            .toArray()

        const itemBlog: BlogTypeId[] = settingBlog.map(el => ({
            id: el._id.toString(),
            name: el.name,
            description: el.description,
            websiteUrl: el.websiteUrl,
            createdAt: el.createdAt,
            isMembership: el.isMembership
        }))

        const totalCount: number = await blogCollection.countDocuments(filter)
        const pagesCount: number = Math.ceil(totalCount / pageSize)

        const resultBlog: Paginated<BlogTypeId> = {

            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: itemBlog
        }
        return resultBlog

    },

    async createBlog(newBlog: BlogType_Id): Promise<BlogTypeId> {

        const createBlogDb = await blogCollection.insertOne(newBlog)

        return {
            id: createBlogDb.insertedId.toString(),
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt,
            isMembership: newBlog.isMembership
        }
    },

    async getBlogForPost(pageNumber: number, pageSize: number, sortBy: string,
                         sortDirection: SortDirection, blogId: string): Promise<Paginated<PostTypeId>> {

        const result = await postCollection
            .find({blogId})
            .sort({[sortBy]: sortDirection})
            .skip(pageSize * (pageNumber - 1))
            .limit(pageSize)
            .toArray()

        const itemPostForBlog: PostTypeId[] = result.map(el => ({
            id: el._id.toString(),
            title: el.title,
            shortDescription: el.shortDescription,
            content: el.content,
            blogId: el.blogId,
            blogName: el.blogName,
            createdAt: el.createdAt

        }))

        const totalCount: number = await postCollection.countDocuments({blogId})

        const pagesCount: number = Math.ceil(totalCount / pageSize)

        const resultPostForBlog: Paginated<PostTypeId> = {

            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: itemPostForBlog
        }

        return resultPostForBlog

    },

    async createBlogForPost(createPostInBlog: PostType_Id, blogId: string): Promise<PostTypeId> {


        const resultCreatePostInBlog = await postCollection.insertOne(createPostInBlog)

        return {
            id: resultCreatePostInBlog.insertedId.toString(),
            title: createPostInBlog.title,
            shortDescription: createPostInBlog.shortDescription,
            content: createPostInBlog.content,
            blogId: blogId,
            blogName: createPostInBlog.blogName,
            createdAt: createPostInBlog.createdAt
        }

    },


    async getBlogForId(id: string): Promise<BlogTypeId | null> {

        const findBlogId = await blogCollection.findOne({_id: new ObjectId(id)})
        if (findBlogId) {
            return {
                id: findBlogId._id.toString(),
                name: findBlogId.name,
                description: findBlogId.description,
                websiteUrl: findBlogId.websiteUrl,
                createdAt: findBlogId.createdAt,
                isMembership: findBlogId.isMembership
            }
        } else {
            return null
        }

    },

    async updateBlogId(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        const updateBlog = await blogCollection.updateOne({_id: new ObjectId(id)},
            {
                $set: {
                    name,
                    description,
                    websiteUrl
                }
            })
        return updateBlog.matchedCount === 1
    },

    async deleteBlogId(id: string): Promise<boolean> {
        const deleteBlog = await blogCollection.deleteOne({_id: new ObjectId(id)})
        return deleteBlog.deletedCount === 1

    },

    async deleteBlogAll(): Promise<boolean> {
        const deleteAll = await blogCollection.deleteMany({})
        return deleteAll.deletedCount === 1

    }


}