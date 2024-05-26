import express, { Express} from 'express';
import {sequelize} from './config';
import cookieParser from 'cookie-parser';
import cors from 'cors'

  
//Routers
import userRouter from './routes/userRouter';
import postRouter from './routes/postRouter';

const router: Express = express();

// Takes for JSON data
router.use(express.json());

//Parse request data
router.use(express.urlencoded({ extended: false }));

router.use(cors());

router.use(userRouter);
router.use(postRouter);
router.use(cookieParser());

(async() => {
    await sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((error:any) => {
        console.error('Unable to connect to the database:', error);
    });

    await sequelize
        // .sync({force: true})
        .sync()
        .then(() => {
            console.log('Database Created!!!')
        })
        .catch((err: any) => {
            console.log('Error during table creation: ' + err.message);
        });
})()

router.listen(process.env.PORT || 8080, () => {
    console.log('Server Running');
});

export const viteNodeApp = router; // Named export
