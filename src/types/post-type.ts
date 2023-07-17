import {ObjectId, Sort, SortDirection} from "mongodb";

export type PostType_Id = {
    _id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}

export type PostTypeId = {id: string} &  Omit<PostType_Id, "_id">

export type QueryParamsPost = {
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string,

}