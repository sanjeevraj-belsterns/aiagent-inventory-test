import mongoose from "./index.js";
import BrandModel from "./brand.js";

const productSchema = new mongoose.Schema({
    productImage : {
      type : String,
      trim : true
    },
    productName: {
      type: String,
      required: [true, 'Product Name is required'],
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      required: [true, 'Category Name is required'],
      trim: true
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'brand', 
      required: [true, 'BrandId is required'],
      trim: true,
    },
    purchasePrice: {
        type: Number,
        required: false,
        min: 0
    },
    retailPrice: { 
        type: Number,
        required: false,
        min: 0  
    },
    offerPer: {
      type: Number,
      required: false, 
      validate: {
        validator: (value) => value >= 0 && value <= 100,
        message: "Discount percentage must be between 0 and 100",
      },
    },
    threshold : {
      type : Number,
      min : 0,
      required : true
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: 0,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    }
});

const ProductModel = mongoose.model("products", productSchema);

export default ProductModel;
