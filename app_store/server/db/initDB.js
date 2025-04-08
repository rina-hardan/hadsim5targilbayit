// טען משתני סביבה מהקובץ .env
require('dotenv').config();

// חיבור למסד הנתונים
const db = require('./config'); // config.js מניח שהוא כבר מייצא חיבור תקין

const createAdminTable = `
    CREATE TABLE IF NOT EXISTS admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL
    );
`;

// שאילתות יצירת טבלאות
const createSuppliersTable = `
    CREATE TABLE IF NOT EXISTS suppliers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company_name VARCHAR(255) NOT NULL,
        supplier_name VARCHAR(30),
        phone_number VARCHAR(20),
        email VARCHAR(30) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
    );
`;

const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_name VARCHAR(255) NOT NULL,
        price_per_unit DECIMAL(10,2) NOT NULL,
        min_quantity INT NOT NULL,
        supplier_id INT,
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
    );
`;


const createOrdersTable = `
    CREATE TABLE IF NOT EXISTS orders (
        order_id INT AUTO_INCREMENT PRIMARY KEY,
        admin_id INT,
        supplier_id INT NOT NULL,
        status ENUM('Pending', 'In Process', 'Completed') DEFAULT 'Pending',
        order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
        FOREIGN KEY (admin_id) REFERENCES admin(id)
    );
`;


const createOrderDetailsTable = `
    CREATE TABLE IF NOT EXISTS order_details (
        order_id INT,
        product_id INT,
        quantity INT NOT NULL,
        PRIMARY KEY (order_id, product_id),
        FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
`;

db.query(createAdminTable, (err) => {
    if (err) console.error("❌ Error creating admin table:", err);
    else console.log("✅ Admin table created successfully.");
});

// הפעלת כל השאילתות
db.query(createSuppliersTable, (err) => {
    if (err) console.error("❌ Error creating suppliers table:", err);
    else console.log("✅ Suppliers table created successfully.");
});

db.query(createProductsTable, (err) => {
    if (err) console.error("❌ Error creating products table:", err);
    else console.log("✅ Products table created successfully.");
});

db.query(createOrdersTable, (err) => {
    if (err) console.error("❌ Error creating orders table:", err);
    else console.log("✅ Orders table created successfully.");
});



db.query(createOrderDetailsTable, (err) => {
    if (err) console.error("❌ Error creating order_details table:", err);
    else console.log("✅ Order Details table created successfully.");
});


// סגירת החיבור אחרי סיום
db.end();
