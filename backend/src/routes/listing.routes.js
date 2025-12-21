import express from "express";
import { createListing } from "../controllers/listing.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// create listing (ONLY logged in users)
router.post("/", protect, createListing);

export default router;
