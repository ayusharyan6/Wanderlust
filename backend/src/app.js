import express from "express";
import healthRoutes from "./routes/health.js";
import authRoutes from "./routes/auth.routes.js";
import listingRoutes from "./routes/listing.routes.js";

const app = express();

app.use(express.json());

app.use("/", healthRoutes);
app.use("/auth", authRoutes); 
app.use("/listings", listingRoutes);

export default app;
