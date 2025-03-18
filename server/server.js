const express = require("express");
const cors = require("cors");
const eventsRouter = require("./router/eventsRouter");
const authRouter = require("./router/authRouter");
const hangoutRouter = require("./router/hangoutRouter");
const userRouter = require("./router/userRouter");
const connectDB = require("./db");
const session = require('express-session');
require('dotenv').config();

const app = express();
connectDB();
app.use(cors({
  origin: "http://localhost:4200",
  credentials: true,
}));
app.use(express.json());

const sessionSecret = process.env.SESSION_SECRET;
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

const PORT = 3001;

app.use("/api", eventsRouter);
app.use("/api/auth", authRouter);
app.use("/api", hangoutRouter);
app.use("/api", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});