import express from "express";
import healthRoutes from "./routes/health.js";
import authRoutes from "./routes/auth.routes.js";
import listingRoutes from "./routes/listing.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import bookingRoutes from "./routes/booking.routes.js";

const app = express();

app.use(express.json());

app.use("/", healthRoutes);
app.use("/auth", authRoutes);
app.use("/listings", listingRoutes);
app.use("/reviews", reviewRoutes);
app.use("/bookings", bookingRoutes);

export default app;
