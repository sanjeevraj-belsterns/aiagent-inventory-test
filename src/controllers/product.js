import mongoose from "mongoose";
import path from "path";

import cloudinary from "../utils/cloudinaryServices.js";
import ProductModel from "../models/products.js";

const addProduct = async (req, res) => {
  try {
    let productImageURL = null;

    if (req.body.productImage) {
      const result = await cloudinary.uploader.upload(req.body.productImage, {
        folder: "/inventory/product"
      });
      productImageURL = result.secure_url;
    } 

    const product = {
      productName: req.body.productName,
      productImage: productImageURL,
      category: req.body.category,
      brandId: req.body.brandId,
      purchasePrice: req.body.purchasePrice,
      retailPrice: req.body.retailPrice,
      offerPer: req.body.offerPer,
      threshold: req.body.threshold,
      stock: req.body.stock,
      description: req.body.description,
    };

    const savedProduct = await ProductModel.create(product);
    res.status(201).send({ message: "Product added successfully!" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const getProductsByBrandId = async (req, res) => {
  const brandId = req.query._id;
  try {
    const products = await ProductModel.find({ brandId: brandId });
    res.status(200).send({
      products: products,
    });
  } catch (error) {
    console.error("Error fetching products by brand ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    console.log("updateProduct", await req.body);
    const product = await ProductModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(req.body._id) },
      req.body,
      { new: true }
    );
    if (product) {
      res.status(200).send({
        message: "Product updated successfully",
        product,
      });
    } else {
      res.status(400).send({
        message: "Product not found!",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || "Internal Server Error!!",
    });
  }
};

const deleteProduct = async (req, res) => {
  const delPrdId = req.query._id;
  try {
    if (!delPrdId) {
      return res.status(400).json({ error: "Product ID is required." });
    }
    const deletedProduct = await ProductModel.findByIdAndDelete(delPrdId);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Internal Server Error!",
    });
  }
};

const getProductsForInvoice = async (req, res) => {
  try {
    const projection = {
      _id: 1,
      productName: 1,
      purchasePrice: 1,
      retailPrice: 1,
      offerPer: 1,
      stock: 1,
    };
    const invoiceProducts = await ProductModel.find({}, projection);

    res.status(200).send({
      products: invoiceProducts,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Internal Server Error!",
    });
  }
};

const getLowStockProducts = async (req, res) => {
  try {
    const thresholdProjection = {
      $match: {
        $expr: { $lte: ["$stock", "$threshold"] },
      },
    };

    const projection = {
      _id: 1,
      productName: 1,
      productImage: 1,
      stock: 1,
      threshold: 1,
    };

    const lowStockProducts = await ProductModel.aggregate([
      thresholdProjection,
      { $project: projection },
    ]);

    // const updatedProducts = await Promise.all(lowStockProducts.map(async (product) => {
    //   if (product.productImage) {
    //     const imagePath = path.join('/inventory/product', product.productImage);
    //     product.productImage = await cloudinary.url(imagePath, { secure: true });
    //   }
    //   return product;
    // }));

    res.status(200).send({
      products: lowStockProducts,
    });
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};


export default {
  addProduct,
  getProductsByBrandId,
  updateProduct,
  deleteProduct,
  getProductsForInvoice,
  getLowStockProducts,
};
