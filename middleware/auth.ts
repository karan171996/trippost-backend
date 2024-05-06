import express, { RequestHandler } from 'express';
import UserModel from '../models/user';
import { Request, Response, NextFunction } from 'express';
import jwt ,{ JwtPayload } from 'jsonwebtoken';
import User from '../models/user';


export const saveUser: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const userCheck = await UserModel.findOne({ where: {
            username: req.body.username,
            email: req.body.email
        }});
        if(userCheck) {
            return res.status(401).json({
            message: 'User already exists'
        });
        }
        next();
    } catch(err){
        return res.status(401).json(err);
    }
}

export const tokenVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization as string;
        const decodedToken: JwtPayload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        const currentUser = await User.findByPk(decodedToken?.id);
        if(currentUser){
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) ;
            
            if(!decoded){
                res.status(401).json({
                    message: 'Unauthorized'
                })
            }
            next();
        }else{
            res.status(401).json({
                message: 'Unauthorized'
            })
        }
    }catch(err){
        res.status(401).json(err);
    }
}

