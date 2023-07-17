import {ObjectId} from "mongodb";
import {CommentTypeId} from "../types/comment-type";
import {commentCollection} from "../db";


export const commentRepository = {

    async getComId(id: string): Promise<CommentTypeId | null> {

        const findComId = await commentCollection.findOne({_id: new ObjectId(id)})


        if (findComId) {
            return {
                id: findComId._id.toString(),
                content: findComId.content,
                commentatorInfo: findComId.commentatorInfo,
                createdAt: findComId.createdAt
            }
        } else {
            return null
        }

    },

    async deleteCom(id: string): Promise<boolean> {
        const deleteComment = await commentCollection.deleteOne({_id: new ObjectId(id)})
        return deleteComment.deletedCount === 1


    },

    async updateCom(content: string, id: string) {
        const updateComment = await commentCollection.updateOne({_id: new ObjectId(id)},
            {
                $set: {
                    content
                }
            })
        return updateComment.matchedCount === 1

    }


}