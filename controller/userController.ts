import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt, {JwtPayload} from 'jsonwebtoken';
import { Op, Sequelize} from 'sequelize';
import User from '../models/user';
import PostModel from '../models/post';


export const createUser = async (req: Request, res: Response) => {
    const id = uuidv4();
    try {
        const data = {
            ...req.body,
            password: await bcrypt.hash(req.body.password, 10),
        }
        const user = await User.create({
            ...data,
            id
        },{raw: true});
        console.log("🚀 ~ createUser ~ user:", user, process.env.JWT_SECRET)

        if(user){
            let token = jwt.sign({ id }, process.env.JWT_SECRET as string, {expiresIn: '1h'});
            res.cookie("jwt", token, {maxAge: 3600000, httpOnly: true});

            return res.json({
                ...user,
                token
            });
        }else{
            return res.status(409).send("Details are not correct");
        }
    } catch (error) {
        return res
            .status(500)
            .json({ error, msg: 'Error during creation of User' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
        
        const { password, email } = req.body;

        try {
            const user:any = await User.findOne({ where: { email }, raw: true });
            if(user){
                bcrypt.compare(password, user.password, (err, result) => {
                        if(!!err) {
                            return res.status(401).send({
                                message: "Authentication failed", err
                             })
                        }
                        if(result) {
                            let token = jwt.sign({ id: user?.id ?? '' }, process.env.JWT_SECRET as string, {expiresIn: '1h'});
                            const refreshToken = jwt.sign({ id: user?.id ?? '' }, process.env.REFRESH_TOKEN as string, {expiresIn: '7d'});
                            
                            res.cookie("jwt", token, {maxAge: 3600000, httpOnly: true});
            
                                //send user data
                            return res.status(201).json({
                                user,
                                token,
                                refreshToken
                            });
                        }
                });
            }else{
                return res.status(401).json({
                    user: {},
                    message: 'user not found'
                })
            }
        }catch(err) {
            return res.status(500).send(err);

        }

}

export const logout = (req: Request, res: Response) => {
    const token = req.headers.authorization;
    if(token){
        res.clearCookie("jwt");
        return res.status(200).send({message: "Logout successful"});
    }else{

        return res.status(500).send({message: "No token found"});
    }
}

export const getAllUsersData = async (req: Request, res: Response) => {
    try {
        const allUsers = await User.findAll();
        return res.send(allUsers)
    }catch(err){
        return res.send(err);
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const userId = req.query?.userId as string;
    const {...anydata} = req.body;

    const fieldsToUpdate ={...anydata};
    try {
        await User.update(fieldsToUpdate,{
            where: {
                id:userId,
            }
        })
        const currentUser = await User.findByPk(userId);

        return res.json(currentUser);
    }catch(err){
        return res.json(err);
    }
};

export const getCurrentUser = async (req: Request, res: Response) => {
    const accessToken = req.query?.userToken as string;
    try {
        const decodedToken:JwtPayload = jwt.verify(accessToken, process.env.JWT_SECRET as string) as JwtPayload;
        const currentUser = await User.findByPk(decodedToken?.id);
        return res.json(currentUser);

      } catch (error) {
        console.error('Error decoding token:', error);
        return res.json(error);

      }
};

export const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;
    try {
        const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN as string) as JwtPayload;

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {expiresIn: '1h'});

        res.send({token});
    }catch(err){
        res.send(err)
    }
}

export const getUserDetail =  async (req: Request, res: Response) => {
    const userHandle = req.params.userhandle;
    try {
        const userExist = await User.findOne({where: {
            handle: userHandle,
        }
        , raw:true})
        if(userExist?.handle === userHandle){
            const usersPost = await User.findOne({
                where: {
                    id: userExist.id
                }, 
                attributes: ['username','handle', 'followersCount','followingCount', 'profilePhoto', 'workingProfile', 'joinedDate', 'bornDate', 'place'],
                include:[{
                    model: PostModel,
                    as: 'posts',
                    where: {
                        userId: userExist.id,
                        type:'POST'
                    },
                    include:[{
                        model: User,
                        attributes: ['handle', 'username', 'profilePhoto'],
                    }]
                },{
                    model: PostModel,
                    as: 'replies',
                    where: {
                        userId: userExist.id,
                        type: 'REPLY'
                    },
                    required: false,
                    include:[{
                        model: User,
                        attributes: ['handle', 'username', 'profilePhoto'],
                    }]
                }],

            })
            return res.status(200).json({message: 'user exists', userDetail:usersPost})
        }else{
            return res.status(400).json({message: 'user not exists'})
        }
    }catch(err){
        return res.json(err);

    }
}

export const getPopularPeopleToFollow = async(req:Request, res: Response) => {
   try {
        const newPopularPosters = await User.findAll({
            where: {
                followersCount: Sequelize.where(Sequelize.fn('array_length', Sequelize.col('followersCount'), 1), { [Op.gte]: 2 })
            }
        });

        return res.status(200).json(newPopularPosters);
   }catch(err){
        return res.json(err);
   } 
}