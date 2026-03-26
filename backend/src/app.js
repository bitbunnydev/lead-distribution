import express from "express";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import leadRoute from "./routes/leadRoute.js";

const app = express();

app.use(cors());
app.use(express.json());

//Routes
app.use("/api/user", userRoute);
app.use("/api/lead", leadRoute);

export default app;
