const supplierModel = require("../models/supplierModel");
const bcrypt = require("bcrypt");

exports.getAllSuppliers = (req, res) => {
    supplierModel.getAllSuppliers((err, suppliers) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(suppliers);
    });
};

// שליפת ספק לפי ID
exports.getSupplierById = (req, res) => {
    const {id} = req.params;
    supplierModel.getSupplierById(id, (err, supplier) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!supplier) return res.status(404).json({ error: "Supplier not found" });
        res.json(supplier);
    });
};



exports.addSupplier = (req, res) => {
    const supplierData = req.body;
    const products = req.body.products;

    const { company_name, supplier_name, phone_number, email, password } = supplierData;

    if (!company_name || !supplier_name || !phone_number || !email || !password) {
        return res.status(400).json({ error: "יש למלא את כל השדות הנדרשים" });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error("❌ שגיאה בהצפנת הסיסמה:", err);
            return res.status(500).json({ error: "שגיאה בהצפנת הסיסמה" });
        }

        const supplierWithHashedPassword = {
            company_name,
            supplier_name,
            phone_number,
            email,
            password: hashedPassword
        };

        supplierModel.registerSupplierWithProducts(supplierWithHashedPassword, products, (err, result) => {
            if (err) {
                console.error("❌ שגיאה בהרשמת ספק:", err);
                return res.status(500).json({ error: "שגיאה בהרשמה" });
            }

            res.status(201).json({ message: "✅ הספק נרשם בהצלחה", supplierId: result.supplier_id });
        });
    });
};

// התחברות – הסרת JWT
exports.login = (req, res) => {
    const { email, password } = req.body;

    supplierModel.getSupplierByEmail(email, (err, supplier) => {
        if (err) return res.status(500).json({ error: "שגיאה בשרת" });
        if (!supplier) return res.status(401).json({ error: " בבקשה תרשם-ספק לא נמצא" });

        bcrypt.compare(password, supplier.password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: "שגיאה בבדיקת סיסמה" });

            if (!isMatch) {
                return res.status(401).json({ error: "סיסמה שגויה" });
            }

            // הסרנו את הטוקן, אין יותר JWT
            res.json({
                message: "התחברות הצליחה",
                supplier: {
                    id: supplier.id,
                }
            });
        });
    });
};
