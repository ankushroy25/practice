import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connection from "./database/db.js";
import cookieParser from "cookie-parser";
import adhardetailRoutes from "./routes/adhardetailRoute.js";
import apiRoutes from "./routes/apiRoutes.js";
import mailAuthRoute from "./routes/mailAuthRoute.js";
import faceReconitionRoute from "./routes/faceRecongnitionRoute.js";
import cors from "cors";

//CONFIG ENV
dotenv.config();

const PORT = process.env.PORT;

// REST OBJECT
const app = express();

// MIDDLEWARES
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// DATABASE CONNECTION
connection();

// REST API
app.use("/api", apiRoutes);
app.use("/adhar", adhardetailRoutes);
app.use("/mailConfirm", mailAuthRoute);
app.use("/faceRecoginiton", faceReconitionRoute);

app.get("/", async (req, res, next) => {
  res.json({ message: "API running" });
});

// MIDDLEWAREs TO HANDLE ERRORS
app.use((err, req, res, next) => {
  console.error(err);
  next(err);
});

app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
});

const corsOptions = {
  origin: "https://vote-easy.onrender.com",
  methods: "GET, POST, PUT, DELETE",
  optionsSuccessStatus: 204,
};

// Enable CORS with specific urls
app.use(cors(corsOptions));

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`.bgBlue.white);
});
