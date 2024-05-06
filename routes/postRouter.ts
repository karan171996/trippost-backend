import express from 'express';

// controller
import {
    addPost,
    getAllPosts,
    editPosts,
    deletePost,
    getPost,
    postLike,
    trendingPost
} from '../controller/postController';
import {tokenVerify} from '../middleware/auth';

const router = express.Router();

router.post('/add-post',tokenVerify, addPost);

router.get('/get-all-post', tokenVerify, getAllPosts);

router.put('/edit-post',tokenVerify, editPosts);

router.delete('/delete-post',tokenVerify, deletePost);

router.get('/get-post/:postId',tokenVerify, getPost);

router.post('/update-like', tokenVerify, postLike);

router.get('/trending-post', tokenVerify, trendingPost)

export default router;