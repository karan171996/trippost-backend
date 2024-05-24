import jwt, { JwtPayload } from "jsonwebtoken";
import UserModal from '../models/user';

export const getCurrentUser = async (token: string | undefined) => {
    if(token){
        const user: JwtPayload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload ;
        try {
            const selectedUser: any = await UserModal.findOne({
                where: {
                    id: user.id,
                },
                raw: true
            });
            return selectedUser;
        }catch(err){
            return {};
        }
    }
    return {};
}