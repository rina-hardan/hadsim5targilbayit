const productModel = require('../models/productModel');

// שליפת מוצר לפי מזהה
exports.getProductById = (req, res) => {
    const {supplier_id} = req.params;
    productModel.getProductById(supplier_id, (err, result) => {
        if (err) {
            console.error("❌ Error fetching product:", err);
            return res.status(500).json({ error: "Error fetching product" });
        }
        res.json(result);
    });
};


exports.addProduct = (req, res) => {
    const newProduct = req.body;
    productModel.addProduct(newProduct, (err, result) => {
        if (err) {
            console.error("❌ Error adding product:", err);
            return res.status(500).json({ error: "Error adding product" });
        }
        res.status(201).json({ message: "Product added successfully", id: result.insertId });
    });
};
