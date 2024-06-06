import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';
import bodyParser from "body-parser";
import userRoutes from './routes/user.js';
import videoRoutes from './routes/video.js';
import commentsRoutes from './routes/comments.js';
import path from 'path';
// import User from "./models/auth.js"

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
    origin: true, // allow requests from any origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use('/uploads', express.static(path.join('uploads')));

app.get('/', (req, res) => {
    res.send("hello");
});


// const updateUsers = async () => {
//     try {
//       await User.updateMany(
//         { points: { $exists: false } }, 
//         { $set: { points: 0 } } 
//       );
//       console.log('Users updated successfully');
//       mongoose.disconnect();
//     } catch (error) {
//       console.error('Error updating users:', error);
//       // mongoose.disconnect();
//     }
//   }
//   updateUsers();

app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/video', videoRoutes);
app.use('/comment', commentsRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server Running on the PORT ${PORT}`);
});

const DB_URL = process.env.CONNECTION_URL;
mongoose.set("strictQuery", false);
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("MongoDB database connected");
}).catch((error) => {
    console.log(error);
});
