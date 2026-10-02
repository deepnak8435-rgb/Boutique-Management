const Product = require("../models/Product");

// Create Product (Admin - supports Multer file upload or Image URL)
async function createProduct(req, res) {
  try {
    const { name, category, price, description, image, fabric, stock, featured } = req.body;
    if (!name || price === undefined || !category) {
      return res.status(400).json({ error: "Name, category, and price are required." });
    }
    // Determine image source: Multer uploaded file path vs URL string
    let imageUrl = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80";
    if (req.file) {
      const protocol = req.protocol || "http";
      const host = req.get("host") || "localhost:5000";
      imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    } else if (image && typeof image === "string" && image.trim() !== "") {
      imageUrl = image.trim();
    }

    const newProduct = new Product({
      name,
      category,
      price: Number(price),
      description,
      image: imageUrl,
      fabric: fabric || "Silk",
      stock: stock !== undefined ? Number(stock) : 10,
      featured: Boolean(featured),
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: "Product created successfully", product: savedProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get All Products (with optional category & search filter)
async function getAllProducts(req, res) {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get Product By ID
async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update Product (Admin)
async function updateProduct(req, res) {
  try {
    let updateData = { ...req.body };
    if (req.file) {
      const protocol = req.protocol || "http";
      const host = req.get("host") || "localhost:5000";
      updateData.image = `${protocol}://${host}/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });
    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Delete Product (Admin)
async function deleteProduct(req, res) {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ error: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {createProduct,getAllProducts,getProductById,updateProduct,deleteProduct,};
