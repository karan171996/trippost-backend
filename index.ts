import express, { Express} from 'express';
import {sequelize} from './config';
import cookieParser from 'cookie-parser';

  
//Routers
import userRouter from './routes/userRouter';
import postRouter from './routes/postRouter';


const router: Express = express();

// Takes for JSON data
router.use(express.json());
router.use(function(req, res, next) {
      // res.header("Access-Control-Allow-Origin", "*");
      const allowedOrigins = ['http://localhost:3000', 'https://trippost.vercel.app', 'https://gamebrag.onrender.com'];
      const origin = req?.headers?.origin  as any;
      if (allowedOrigins.includes(origin)) {
           res.setHeader('Access-Control-Allow-Origin', origin);
      }
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
      res.header("Access-Control-Allow-credentials", 'true');
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
      next();
    });

//Parse request data
router.use(express.urlencoded({ extended: false }));

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
