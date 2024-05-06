import {Model, DataTypes} from 'sequelize';
import {sequelize} from '../config';

class Posts extends Model {}

Posts.init({
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    postLike: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
    },
    commentsCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,

    },
    images: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true,
        defaultValue: [],
    },
    viewsCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
    },
    type: {
        type: DataTypes.ENUM('POST', 'REPLY'),
        defaultValue: 'POST',
        allowNull: false,
    }
},{
    sequelize,
    modelName: 'posts'
});

Posts.hasMany(Posts, {as: 'postToPosts', foreignKey: 'lastRepliedPosts'});

export default Posts;