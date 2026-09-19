import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

//create a new product
export const createProduct = async (req, res) => {
  try {
    const { title, description, price, stock = 0 } = req.body;
    const seller = req.user;

    const images = await Promise.all(
      (req.files ?? []).map(async (file) => {
        return await uploadFile({
          buffer: file.buffer,
          fileName: file.originalname,
        });
      }),
    );

    const product = await productModel.create({
      title,
      description,
      price,
      stock: Number(stock),
      images,
      seller: seller._id,
    });

    res.status(201).json({
      message: "Product created successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error during product creation:", error);
    res.status(502).json({
      message: "Unable to upload product images",
      success: false,
    });
  }
};

// get all the products of the seller
export const getProductsSeller = async (req, res) => {
  const seller = req.user;

  const products = await productModel.find({ seller: seller._id });

  res.status(200).json({
    message: "Products retrieved successfully",
    success: true,
    products,
  });
};

// get all the products of the buyer
export const getAllProducts = async (req, res) => {
  const products = await productModel.find();

  res.status(200).json({
    message: "Products retrieved successfully",
    success: true,
    products,
  });
};

// get product details by id
export const getProductDetails = async (req, res) => {
  const { id } = req.params;

  const product = await productModel.findById(id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
      success: false,
    });
  }

  res.status(200).json({
    message: "Product details retrieved successfully",
    success: true,
    product,
  });
};

// update product details
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, stock } = req.body;
    const seller = req.user;

    // Find product and make sure it belongs to the logged-in seller
    const product = await productModel.findOne({
      _id: id,
      seller: seller._id,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found or you are not authorized to edit it",
        success: false,
      });
    }

    // Update only the fields that were provided
    if (title !== undefined) product.title = title;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);

    // If new images are uploaded, replace the existing images
    if (req.files && req.files.length > 0) {
      const images = await Promise.all(
        req.files.map(async (file) => {
          return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname,
          });
        }),
      );

      product.images = images;
    }

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error during product update:", error);

    res.status(500).json({
      message: "Unable to update product",
      success: false,
    });
  }
};