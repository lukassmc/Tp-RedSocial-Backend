import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from '../posts/schemas/post.schema';
import { Comment } from '../comments/schemas/comments.schemas';
import moment from 'moment';

@Injectable()
export class StatsService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>,
        @InjectModel(Comment.name) private commentModel: Model<Comment>
    ) {}

    
    async getPostsByUser(startDate: string, endDate: string) {
        const start = moment(startDate).startOf('day').toDate();
        const end = moment(endDate).endOf('day').toDate();

        return this.postModel.aggregate([
            { $match: { createdAt: { $gte: start, $lte: end } } },
            {
                $group: {
                    _id: '$userId',
                    postCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            {
                $project: {
                    _id: 0,
                    username: { $arrayElemAt: ['$userInfo.username', 0] },
                    postCount: 1
                }
            }
        ]);
    }

    
    async getCommentsOverTime(startDate: string, endDate: string) {
        const start = moment(startDate).startOf('day').toDate();
        const end = moment(endDate).endOf('day').toDate();

        return this.commentModel.aggregate([
            { $match: { createdAt: { $gte: start, $lte: end } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    commentCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } } 
        ]);
    }

n
    async getCommentsPerPost(startDate: string, endDate: string) {
        const start = moment(startDate).startOf('day').toDate();
        const end = moment(endDate).endOf('day').toDate();

        return this.postModel.aggregate([
            { $match: { createdAt: { $gte: start, $lte: end } } },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'postId',
                    as: 'postComments'
                }
            },
            {
                $project: {
                    _id: 0,
                    postTitle: '$title',
                    commentCount: { $size: '$postComments' }
                }
            },
            { $sort: { commentCount: -1 } }, 
            { $limit: 10 } 
        ]);
    }
}