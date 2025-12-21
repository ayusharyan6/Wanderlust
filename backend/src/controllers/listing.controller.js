import Listing from "../models/Listing.js";

export const createListing = async (req, res) => {
  try {
    const { title, description, price, location, country, image } = req.body;

    if (!title || !description || !price || !location || !country || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }
    console.log(req.user.id);
    console.log(req.user._id);
    const listing = await Listing.create({
      title,
      description,
      price,
      location,
      country,
      image,
      host: req.user._id, 
    });

    res.status(201).json({
      message: "Listing created successfully",
      listing,
    });
  } catch (error) {
    res.status(500).json({
      message: "Listing creation failed",
      error: error.message,
    });
  }
};
