import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./routes/user.js";
import videoRoutes from "./routes/video.js";
import commentsRoutes from "./routes/comments.js";
import { Server } from "socket.io";
import http from "http";
import path from "path";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000", // Add your frontend development server URL here
      "https://youtubefrontjnv.netlify.app",
      "https://youtubeclonefront--youtubefrontjnv.netlify.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000", // Add your frontend development server URL here
      "https://youtubefrontjnv.netlify.app",
      "https://youtubeclonefront--youtubefrontjnv.netlify.app",
    ];
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use("/uploads", express.static(path.join("uploads")));

app.get("/", (req, res) => {
  res.send("hello");
});

app.use(bodyParser.json());

app.use("/user", userRoutes);
app.use("/video", videoRoutes);
app.use("/comment", commentsRoutes);

const PORT = process.env.PORT || 8080;

const DB_URL = process.env.CONNECTION_URL;
mongoose.set("strictQuery", false);
mongoose
  .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB database connected");
  })
  .catch((error) => {
    console.log(error);
  });

// WebRTC and Socket.io signaling
const users = {}; // Object to store users with their email and socket ID

io.on('connection', socket => {
  console.log('New client connected');

  socket.on('register', email => {
    users[email] = socket.id; // Map email to socket ID
    console.log('User registered:', email, 'with socket ID:', socket.id);
    socket.emit('me', socket.id); // Inform client of their socket ID
  });

  socket.on('callUser', (data) => {
    const targetSocketId = users[data.userToCall];
    if (targetSocketId) {
      io.to(targetSocketId).emit('callUser', {
        signal: data.signalData,
        from: data.from,
      });
    }
  });

  socket.on('answerCall', (data) => {
    const targetSocketId = users[data.to];
    if (targetSocketId) {
      io.to(targetSocketId).emit('callAccepted', data.signal);
    }
  });

  socket.on('disconnect', () => {
    for (let email in users) {
      if (users[email] === socket.id) {
        delete users[email];
        break;
      }
    }
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server Running on the PORT ${PORT}`);
});
