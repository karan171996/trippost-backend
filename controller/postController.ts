import { Request, Response } from 'express';
import PostModel from '../models/post';
import UserModal from '../models/user';
import { Op } from 'sequelize';
import { getCurrentUser } from '../utils/getCurrentUser';

export const addPost = async (req: Request, res: Response) => {
    const {parentPostId} = req.body
    try {
        const currentUser = await getCurrentUser(req.headers.authorization);
        const post = await PostModel.create({
            ...req.body,
            userId: currentUser.id,
            ...(parentPostId && {lastRepliedPosts: parentPostId})
        });
        if(parentPostId){
             await PostModel.increment('commentsCount', {by: 1, where: {id: parentPostId}})
        }
        return res.json(post);
    } catch (err) {
        return res.status(500).json({ err, msg: 'Error during Adding Post' });
    }
};

export const getAllPosts = async (req: Request, res: Response) => {
    let selectedPost:any  = {};
    const {postId} = req?.query;
    const page: number = Number(req?.query?.page);
    const pageSize: number = Number(req?.query?.pageSize);
    const offset = page * pageSize;
    const limit = pageSize;

    try {
        const selectedUser = await getCurrentUser(req.headers.authorization)
        const followersCount = selectedUser.followersCount;
        const followingCount = selectedUser.followingCount;
        const usersIdArray = followersCount.concat(followingCount);
        if(!!postId && selectedPost?.id !== postId ) {
            selectedPost = await PostModel.findOne({
                where: {
                    id: postId
                },
                include:[{
                    model: UserModal,
                    attributes: ['handle', 'username', 'profilePhoto'],
                }]
            })
        }

        const posts = await PostModel.findAll({
            where: !!postId ? {
                lastRepliedPosts: postId,
            } :{
                userId: [...usersIdArray, selectedUser?.id],
                type: 'POST'
            },
            include: [{
                model: UserModal,
                attributes: [ 'username', 'handle', 'profilePhoto', 'followingCount', 'id'],
            }],
            order: [
                ['createdAt', 'DESC']
            ],
            ...(!!postId ? {required: true }: {required: false}),
            offset,
            limit,
        })
        // get the all the post of the user with the user details include attributes like id, email, handle and userId match wit h
       return res.json({posts, ...(!!postId && {selectedPost})});
    }catch(err){
        return res.status(500).json({"post": [], msg: "Error , during Fetching the posts", err})
    }
}

export const postLike = async (req: Request, res: Response) => {
    const postId = req?.body?.postId;
    const userId = req?.body?.userId;
    try {
        const post = await PostModel.increment("postLike", {by: 1, where: {
            id: postId,
            userId: userId,
        }})
        return res.json(post);
    }catch(err) {
        return res.status(500).json({ err, msg: 'Error during updating the postLike'});
    }
}

export const editPosts = async (req: Request, res: Response) => {
    
    const {postId, userId, body} = req.body;

    try {
        await PostModel.update(body, {
            where: {
                id: postId,
                userId: userId,
            },
        });
        return res.json({message: "Post Updated",});
    }catch(err){
        return res.status(500).json({msg: "Error during Editing the post"})
    }
}

export const deletePost = async (req: Request, res: Response) => {
    const postId = req?.body?.postId;
    const userId = req?.body?.userId;
    try {
        await PostModel.destroy({
            where: {
                id: postId,
                userId: userId,
            },
        });
        return res.json({message: "Post Deleted"});
    }catch(error){
        res.status(500).json({msg: "Error during Deleting the post"});

    }
};

export const getPost = async (req: Request, res: Response) => {
    const {postId} = req.params;

    try {

        const singlePost = await PostModel.findOne({
            where: {
                id: postId,
            },
            include:[
            {
                model: PostModel,
                as: 'postToPosts',
                where:{
                    lastRepliedPosts: postId,
                },
                include:[{  
                    model: UserModal,
                    attributes: ['handle', 'username', 'profilePhoto']
                }],
            },
            {
                model: UserModal,
                attributes: ['handle', 'username', 'profilePhoto'],
            }],

        })
        return res.json(singlePost);
    } catch (err) {
        return res.status(500).json({ err: '', msg: 'Error during Fetching the post' });
    }
}

export const trendingPost = async (req: Request, res: Response) => {
    try {
        const allTrendingPosts = await PostModel.findAll({
            where: {
                type: 'POST',
                postLike: {
                    [Op.gte]: 1
                }
            }, attributes:['content', 'commentsCount', 'id'],
            include:[{
                model: UserModal,                 
                attributes: ['handle', 'username', 'profilePhoto']
            }]
        })
        return res.json(allTrendingPosts);
    }catch(e){
        return res.status(500).json({err: '', msg: 'Error during Fetch the trending Posts'});
    }
}

