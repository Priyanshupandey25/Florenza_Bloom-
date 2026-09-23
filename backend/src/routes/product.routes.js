import {Router} from "express";
import {authenticateSeller} from "../middlewares/auth.middleware.js";
import { createProduct, getProductsSeller, getAllProducts, getProductDetails, updateProduct, productDelete} from "../controllers/product.controller.js";
import multer from "multer";

// Multer configuration for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits :{
        fileSize: 5 * 1024 * 1024 // 5MB
    }
})

const router = Router();

//@route POST /api/products
//description: Create a new product
//access Private (Seller only)
//at a time 5 images can be uploaded
router.post("/", authenticateSeller, upload.array("images", 5), createProduct)

//@route GET /api/products/seller
//description: Get products for a seller
//access Private (Seller only)
router.get("/seller", authenticateSeller, getProductsSeller);

//@route GET /api/products
//description: Get all products
//access Public
router.get("/", getAllProducts);

//@route GET /api/products/detail/:id
//description: Get product details by ID
//access Public
router.get("/detail/:id", getProductDetails);

//@route PUT /api/products/update/:id
//description: Update product details by ID
//access Private (Seller only)
router.put("/update/:id", authenticateSeller, upload.array("images", 5), updateProduct);

//@route POST /api/products/delete/:id
//description: Delete a product by ID
//access Private (Seller only)
router.post("/delete/:id", authenticateSeller, productDelete);

export default router;