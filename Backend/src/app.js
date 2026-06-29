import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import AuthRoutes from "./routes/auth.routes.js";
import companyRoutes from "./routes/company.routes.js";
import JobRoutes from "./routes/job.routes.js";
import ApplicationRoutes from "./routes/application.routes.js";
import ResumeRoutes from "./routes/resume.routes.js";
import ProfileRoutes from "./routes/profile.routes.js";
import savedJobRoutes from "./routes/savedJob.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import offerRoutes from "./routes/offer.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: "*",
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
    ],
  })
);

app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 100,

  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },
});

app.use(limiter);


app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", AuthRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/job", JobRoutes);
app.use("/api/application", ApplicationRoutes);
app.use("/api/resume", ResumeRoutes);
app.use("/api/profile", ProfileRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec));

export default app;