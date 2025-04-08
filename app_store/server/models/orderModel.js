const db = require("../db/config");



exports.updateOrderStatus = (order_id, status, callback) => {
    const sql = "UPDATE orders SET status = ? WHERE order_id = ?";
    db.query(sql, [status, order_id], callback);
};

exports.getPendingOrdersBySupplier = (supplier_id, callback) => {
    const sql = "SELECT * FROM orders WHERE supplier_id = ? AND status='Pending' ORDER BY order_id DESC";
    db.query(sql, [supplier_id], callback);
};

exports.getOrdersBySupplierId = (supplier_id, callback) => {
  const sql = `
    SELECT o.*, od.product_id, od.quantity, p.product_name, p.price_per_unit
    FROM orders o
    JOIN order_details od ON o.order_id = od.order_id
    JOIN products p ON od.product_id = p.id
    WHERE o.supplier_id = ?
    ORDER BY o.order_id DESC
  `;

  db.query(sql, [supplier_id], (err, results) => {
    if (err) return callback(err);

    const groupedOrders = {};

    results.forEach(row => {
      if (!groupedOrders[row.order_id]) {
        groupedOrders[row.order_id] = {
          order_id: row.order_id,
          supplier_id: row.supplier_id,
          admin_id: row.admin_id,
          status: row.status,
          order_date: row.order_date,
          products: []
        };
      }

      groupedOrders[row.order_id].products.push({
        product_id: row.product_id,
        product_name: row.product_name,
        quantity: row.quantity,
        price_per_unit: row.price_per_unit
      });
    });

    callback(null, Object.values(groupedOrders));
  });
};

exports.addOrderByAdminAndSupplier = (admin_id, supplier_id, products, callback) => {
    const sql = `
        INSERT INTO orders (admin_id, supplier_id, status)
        VALUES (?, ?, 'Pending')
    `;
    db.query(sql, [admin_id, supplier_id], (err, result) => {
        if (err) return callback(err);

        const order_id = result.insertId;

        const arrProducts = products.map(product => [
            order_id,
            product.productId,
            product.quantity,
        ]);

        const sqlOrderDetails = `
            INSERT INTO order_details (order_id, product_id, quantity)
            VALUES ?
        `;
        db.query(sqlOrderDetails, [arrProducts], (err2, detailsResult) => {
            if (err2) return callback(err2);

            callback(null, { order_id, detailsResult }); // ✅ מחזירים את ה-order_id הנכון
        });
    });
};


exports.getOrdersByStatusList = (admin_id, callback) => {
    const sql = `
        SELECT 
            orders.*, 
            suppliers.company_name AS supplier_company_name, 
            suppliers.phone_number AS supplier_phone
        FROM orders
        JOIN suppliers ON orders.supplier_id = suppliers.id
        WHERE (orders.status = 'Pending' OR orders.status = 'In Process') 
        AND orders.admin_id = ?
    `;
    db.query(sql, [admin_id], callback);
};

exports.getOrdersByAdmin = (admin_id, callback) => {
  const sql = `
    SELECT o.*, od.product_id, od.quantity, p.product_name, p.price_per_unit
    FROM orders o
    JOIN order_details od ON o.order_id = od.order_id
    JOIN products p ON od.product_id = p.id
    WHERE o.admin_id = ?
    ORDER BY o.order_id DESC
  `;

  db.query(sql, [admin_id], (err, results) => {
    if (err) return callback(err);

    const groupedOrders = {};

    results.forEach(row => {
      if (!groupedOrders[row.order_id]) {
        groupedOrders[row.order_id] = {
          order_id: row.order_id,
          supplier_id: row.supplier_id,
          admin_id: row.admin_id,
          status: row.status,
          order_date: row.order_date,
          products: []
        };
      }

      groupedOrders[row.order_id].products.push({
        product_id: row.product_id,
        product_name: row.product_name,
        quantity: row.quantity,
        price_per_unit: row.price_per_unit
      });
    });

    callback(null, Object.values(groupedOrders));
  });
};

