import mongoose from "mongoose";
import path from "path";

import cloudinary from "../utils/cloudinaryServices.js";
import BrandModel from "../models/brand.js";

const addBrand = async (req, res) => {
  try {
    let brandImageURL = null;

    if (req.body.brandImage) {
      const result = await cloudinary.uploader.upload(req.body.brandImage , {
        folder : "/inventory/brand"
      });
      brandImageURL = result.secure_url;
    }
    
    const otherFields = {
      brandName: req.body.brandName,
      brandImage: brandImageURL,
    };

    const savedBrand = await BrandModel.create(otherFields);
    
    res.status(201).json(savedBrand);
  } catch (error) {
    console.error("Error adding brand:", error);
    res.status(500).send({ error });
  }
};


const getAllBrand = async (req, res) => {
  try {
    const brands = await BrandModel.find();
    res.status(200).send({ brands });
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ error: "Error fetching brands" });
  }
};

const updateBrand = async (req, res) => {
  try {
    const brand = await BrandModel.findById(new mongoose.Types.ObjectId(req.body._id));

    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    let brandImageURL = brand.brandImage;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      brandImageURL = result.secure_url;
    }

    const updatedBrand = await BrandModel.findByIdAndUpdate(
      req.body._id,
      {
        brandName: req.body.updatedName || brand.brandName,
        brandImage: brandImageURL,
      },
      { new: true }
    );

    res.status(200).send({
      updatedBrand :  updatedBrand
    });
  } catch (error) {
    console.error("Error updating brand:", error);
    res.status(500).send({ error });
  }
};


const deleteBrand = async (req, res) => {
  const _id = req.query._id;
  try {
    if (!_id) {
      return res.status(400).json({ error: "Brand ID is required." });
    }
    const deletedBrand = await BrandModel.findByIdAndDelete(_id);
    if (!deletedBrand) {
      return res.status(404).json({ error: "Brand not found." });
    }
    res
      .status(200)
      .json({ _id: deletedBrand._id, message: "Brand deleted successfully." });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Internal Server Error!",
    });
  }
};

export default {
  addBrand,
  getAllBrand,
  updateBrand,
  deleteBrand
};
