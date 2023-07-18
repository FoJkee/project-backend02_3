import {ObjectId} from "mongodb";

export type BlogType_Id = {
    _id: ObjectId,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type BlogTypeId = { id: string } & Omit<BlogType_Id, "_id">

export type Paginated<T> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number
    items: T[]
}

export type QueryParamsBlog = {
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string,
    searchNameTerm: string

}






