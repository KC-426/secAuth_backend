import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config({ path: "config/.env" });

const PORT = process.env.PORT || 3000;
const { MONGODB_URI } = process.env;

app.use(express.json({ limit: "5000mb" }));

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());

import userRouter from "./routes/userRouter.js";
import faqRouter from "./routes/faqRouter.js";
import projectRouter from "./routes/projectRouter.js";
import referenceUserRouter from "./routes/referenceUserRouter.js";
import serviceRequestRouter from "./routes/serviceRequestRouter.js";
import technicalSupportRouter from "./routes/technicalSupportRouter.js";
import subscriptionPlanRouter from "./routes/subscriptonPlanRouter.js"
import orderRouter from './routes/orderRouter.js'
import paymentRouter from "./routes/paymentRoutes.js"

app.use("/api/v1/user", userRouter);
app.use("/api/v1/faq", faqRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/refUser", referenceUserRouter);
app.use("/api/v1/request", serviceRequestRouter);
app.use("/api/v1/support", technicalSupportRouter);
app.use('/api/v1/plan', subscriptionPlanRouter)
app.use('/api/v1/order', orderRouter)
app.use('/api/v1/payment', paymentRouter)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
  console.log('DB connected')
  })
  .catch((err) => console.log(err));

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });