import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config';
import bcrypt from 'bcrypt';

//Models
import Posts from './post';

class User extends Model {
    public id!: string;
    public username!: string;
    public handle!: string;
    public followersCount!: Array<any>;
    public followingCount!: Array<any>;
    public profilePhoto!: string;
    public password!: string;
    public email!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;    
    public workingProfile!: string;
    public joinedDate!: Date;
    public bornDate!: Date;
    public place!: string;
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        handle: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        followersCount: {
            type: DataTypes.ARRAY(DataTypes.UUID),
            allowNull: false,
            defaultValue: [],
        },
        followingCount: {
            type: DataTypes.ARRAY(DataTypes.UUID),
            allowNull: false,
            defaultValue: [],
        },
        profilePhoto: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        workingProfile: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false,
        },
        joinedDate: {
            type: DataTypes.DATE,
            allowNull: false,
            unique: false,
            defaultValue: DataTypes.NOW
        },
        bornDate: {
            type: DataTypes.DATE,
            allowNull: true,
            unique: false
        },
        place: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: false  
        }

    },
    {
        sequelize,
        modelName: 'user',
    }
);
User.hasMany(Posts, {as: 'posts', foreignKey: 'userId'});
User.hasMany(Posts, {as: 'replies', foreignKey: 'userId'});
Posts.belongsTo(User);

export default User;
