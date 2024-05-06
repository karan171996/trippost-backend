import express from 'express';

// controllers
import {
    loginUser,
    logout,
    createUser,
    updateUser,
    getAllUsersData,
    getCurrentUser,
    refreshToken,
    getUserDetail,
    getPopularPeopleToFollow
} from '../controller/userController';

import {saveUser, tokenVerify} from '../middleware/auth';

const router = express.Router();

router.post('/signup', saveUser, createUser);

router.post('/login', loginUser);

router.get('/logout', tokenVerify, logout)

router.patch('/update-user',tokenVerify, updateUser);

router.get('/get-all-users', getAllUsersData);

router.get('/get-current-user',tokenVerify, getCurrentUser);

router.get('/user-exists/:userhandle', tokenVerify, getUserDetail)

router.post('/refresh-token', refreshToken);

router.get('/popular-posters', tokenVerify, getPopularPeopleToFollow)

export default router;
