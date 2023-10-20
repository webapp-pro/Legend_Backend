import express from "express";
import https from "https";
import fs from "fs";
import { Server } from "socket.io";
import path from "path";
import cors from "cors";
import bodyParser from 'body-parser';
import colors from 'colors';
import cookieParser from 'cookie-parser';
import serveStatic from 'serve-static';
import rateLimit from "express-rate-limit"

import uuid from 'node-uuid';
import _ from 'lodash';
import socketConnectionManager from "./socket.js";
import { connectMongoDB } from "./db/connecton.js";

import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), '.env.development') });

// Port declaration................................

const PORT = process.env.PORT || 5000;
const base_url = process.env.BASE_URL;

// Database connection..............................
connectMongoDB();

// Importing the routes ............................
import usersRouter from './routes/usersRoutes.js';
import pvpRouter from './routes/pvpRoutes.js';
import { catchWallet } from "./controllers/userActions.js";

// Middleware function calling .....................
const app = express();
app.use(express.static('client/build'));
app.use('/admin', express.static('client/build/admin'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

// Set up rate limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 60 * 1000, // 15 minutes
  max: 300 // limit each IP to 100 requests per windowMs
});

// Apply rate limiter to all requests
app.use(limiter);

const __dirname = path.resolve();
app.use(serveStatic(path.join(__dirname, 'public')));

// Routes declarations ............................
app.use(`${base_url}user`, usersRouter);
app.use(`${base_url}pvp`, pvpRouter);

const options = {
  // Path to the SSL/TLS certificate file
  cert: fs.readFileSync("cer.crt"),

  // Path to the SSL/TLS private key file
  key: fs.readFileSync("cer.key")
};

const server = https.createServer(options, app);

server.listen(PORT, () => {
  console.log(`App is running on HTTPS. Listening on port ${PORT}`);
});

// Socket server
const io = new Server(server);
io.on("connection", function (socket) {
  socketConnectionManager(socket, io);
});

export default app;
