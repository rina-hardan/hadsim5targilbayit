const db = require('../db/config');

// שליפת כל המוצרים
exports.getAllProducts = (callback) => {
    db.query("SELECT * FROM products", callback);
};

// שליפת מוצר לפי מזהה
exports.getProductById = (supplier_id, callback) => {
    db.query("SELECT * FROM products WHERE supplier_id = ?", [supplier_id], callback);
};

// הוספת מוצר חדש
exports.addProduct = (product, callback) => {
    const { product_name, price_per_unit, min_quantity, supplier_id } = product;
    db.query(
        "INSERT INTO products (product_name, price_per_unit, min_quantity, supplier_id) VALUES (?, ?, ?, ?)",
        [product_name, price_per_unit, min_quantity, supplier_id],
        callback
    );
};
