import dotenv from 'dotenv'
import {MongoClient} from "mongodb";
import {BlogType_Id} from "./types/blog-type";
import {PostType_Id} from "./types/post-type";
import {UserType_Id} from "./types/user-type";
import {CommentType_Id} from "./types/comment-type";

dotenv.config()


const mongoUrl = process.env.Mongo_Url || "mongodb://127.0.0.1:27017"

export const jwtAccess = process.env.JWT_ACCESS_SECRET || '123'

export const jwtRefresh = process.env.JWT_REFRESH_SECRET || '123'



console.log(mongoUrl)

if (!mongoUrl) throw new Error('Not')


const client = new MongoClient(mongoUrl)

const db = client.db('social_network')


export const blogCollection = db.collection<BlogType_Id>('blogs')
export const postCollection = db.collection<PostType_Id>('posts')
export const userCollection = db.collection<UserType_Id>('users')
export const commentCollection = db.collection<CommentType_Id>('comments')


export async function runDb() {
    try {
        await client.connect()
        console.log('Connect')
    } catch {
        await client.close()
        console.log('Disconnect')
    }

}


