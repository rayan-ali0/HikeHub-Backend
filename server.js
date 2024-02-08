import express from "express";
import session from 'express-session';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDB from "./Config/Config.js";
import cors from "cors";

import locationRoutes from './Routes/LocationRoutes.js'
import restaurantRoutes from './Routes/RestaurantRoutes.js'
import siteRoutes from './Routes/SiteRoutes.js'
import storyRoutes from './Routes/StoryRoutes.js'
import userRoutes from './Routes/UserRoutes.js'
import trailRoutes from './Routes/TrailRoutes.js'
import eventRoutes from "./Routes/EventRoutes.js";

const app = express();

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
  }));

const corsOption = {
  origin: "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOption));
app.use(cookieParser());
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}));

const PORT = process.env.PORT;

app.listen(PORT, (error) =>{ 
    if(!error) {
        console.log("Server is Running, and App is listening on port "+ PORT) 
    } else {
        console.log("Error: ", error)
    }
} 
);
connectDB()

app.use('/images',express.static('images'))

app.use('/location',locationRoutes)
app.use('/restaurant',restaurantRoutes)
app.use('/site',siteRoutes)
app.use('/story',storyRoutes)
app.use('/user',userRoutes)
app.use('/trail',trailRoutes)
app.use('/event',eventRoutes)