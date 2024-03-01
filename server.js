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
import { login } from './Middlwares/UserAuth.js'
import { logOut } from './Middlwares/UserAuth.js'
import subscriberRoutes from './Routes/SubscriberRoutes.js'
import nodemailer from 'nodemailer'
import { addUser } from "./Controllers/Oauth.js";

const app = express();
app.use(express.json())

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

const corsOption = {
  origin: ["http://localhost:3000","https://trailz-1ovwzm97m-rayan-ali0s-projects.vercel.app"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOption));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT;

app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server is Running, and App is listening on port " + PORT)
  } else {
    console.log("Error: ", error)
  }
}
);
connectDB()

app.use('/images', express.static('images'))
app.post('/login', login)
app.post('/logout', logOut)
app.use('/location', locationRoutes)
app.use('/restaurant', restaurantRoutes)
app.use('/site', siteRoutes)
app.use('/story', storyRoutes)
app.use('/user', userRoutes)
app.use('/trail', trailRoutes)
app.use('/event', eventRoutes)
app.use('/subscribe', subscriberRoutes)
app.use("/google",addUser)

app.post('/sendEmail', async (req, res) => {
  const { name, email, amount, type } = req.body;
  console.log(req.body)
  var message = ''
  var subject = ''
  if (type && type === "reminder") {
    message = `Hello ${name},\n\nTo ensure your spot on the trip, please complete the payment process within the next two days.\nHere are the payment details:
\n\nPayment Information:\n- Payment Method: Wish Money to 76147030\n- Total Amount: ${amount}
`
    subject = 'Reminder To Pay'
  }
  else if (type && type === "done") {
    subject = 'Payment Confirmed'
    message = `Hello ${name},\n\nThank you for completing the payment for the trip! Your spot is confirmed.\nSee you there!`;
  }
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'gmail'
    smtp: 'smtp.gmail.com',
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASSWORD,
    },
  });
  // Set up the email options
  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: email, // Use the email from the form
    subject: subject,
    text: message
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("done")
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});