const db = require("../db/config");

exports.getAllSuppliers = (callback) => {
    db.query("SELECT * FROM suppliers", callback);
};

exports.getSupplierById = (id, callback) => {
    db.query("SELECT * FROM suppliers WHERE id = ?", [id], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
    });
};

exports.registerSupplierWithProducts = (supplierData, products, callback) => {
    const {
        company_name,
        supplier_name,
        phone_number,
        email,
        password
    } = supplierData;

    const sqlSupplier = `
        INSERT INTO suppliers (company_name, supplier_name, phone_number, email, password)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sqlSupplier,
        [company_name, supplier_name, phone_number, email, password],
        (err, result) => {
            if (err) return callback(err);

            const supplier_id = result.insertId;

            // נבנה מערך מוצרים עם הספק החדש
            const arrProducts = products.map(product => [
                product.product_name,
                product.price_per_unit,
                product.min_quantity,
                supplier_id
            ]);

            const sqlProducts = `
                INSERT INTO products (product_name, price_per_unit, min_quantity, supplier_id)
                VALUES ?
            `;

            db.query(sqlProducts, [arrProducts], (err2, productResults) => {
                if (err2) return callback(err2);

                callback(null, {
                    supplier_id,
                    message: 'הספק והמוצרים שלו נוספו בהצלחה',
                    productResults
                });
            });
        }
    );
};


exports.getSupplierByEmail = (email, callback) => {
    db.query("SELECT * FROM suppliers WHERE email = ?", [email], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
    });
};
