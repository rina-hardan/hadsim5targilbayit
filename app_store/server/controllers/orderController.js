const orderModel = require("../models/orderModel");

exports.approveOrderBySupplier = (req, res) => {
    const id = req.params.order_id;
    orderModel.updateOrderStatus(id, 'In Process', (err, result) => {
        if (err) {
            console.error("שגיאה בעדכון סטטוס ע״י ספק:", err);
            return res.status(500).json({ error: "שגיאה בעדכון הסטטוס" });
        }
        res.status(200).json({ message: "ההזמנה אושרה ע״י הספק" });
    });
};

exports.confirmOrderByAdmin = (req, res) => {
    const id = req.params.order_id;
    orderModel.updateOrderStatus(id, 'Completed', (err, result) => {
        if (err) {
            console.error("שגיאה באישור קבלת ההזמנה:", err);
            return res.status(500).json({ error: "שגיאה באישור ההזמנה" });
        }
        res.status(200).json({ message: "ההזמנה סומנה כהושלמה" });
    });
};

exports.getPendingOrdersBySupplier = (req, res) => {
    const { supplier_id } = req.params;
  
    orderModel.getPendingOrdersBySupplier(supplier_id, (err, results) => {
      if (err) {
        console.error("Error fetching pending orders:", err);
        return res.status(500).json({ error: "Error fetching pending orders" });
      }
      res.json(results);
    });
  };
  
exports.getOrdersBySupplierId = (req, res) => {
    const { supplier_id } = req.params;
  
    orderModel.getOrdersBySupplierId(supplier_id, (err, results) => {
      if (err) {
        console.error("Error fetching orders for supplier:", err);
        return res.status(500).json({ error: "Error fetching orders" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: "No orders found for this supplier" });
      }
  
      res.json(results);
    });
  };
  

exports.createOrderByAdminAndSupplier = (req, res) => {
    const { admin_id, supplier_id, products} = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: "חובה לציין לפחות מוצר אחד" });
    }

    orderModel.addOrderByAdminAndSupplier(admin_id, supplier_id, products, (err, result) => {
        if (err) {
            console.error("שגיאה בהוספת הזמנה:", err);
            return res.status(500).json({ error: "שגיאה בהוספת הזמנה" });
        }
        res.status(201).json({
            message: "הזמנה נוספה בהצלחה",
            order_id: result.order_id,
            details: result.detailsResult
        });
    });
};


exports.getPendingOrInProcessOrders = (req, res) => {
    const {admin_id} = req.params;
    orderModel.getOrdersByStatusList(admin_id,(err, results) => {
        if (err) {
            console.error(" Error fetching orders with status 'Pending' or 'In Process':", err);
            return res.status(500).json({ error: "Error fetching orders" });
        }
        res.json(results);
    });
};


exports.getOrdersByAdmin = (req, res) => {
  const {admin_id} = req.params;

  orderModel.getOrdersByAdmin(admin_id, (err, results) => {
    if (err) {
      console.error("❌ Error fetching orders by admin ID:", err);
      return res.status(500).json({ error: "Error fetching orders" });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "No orders found for this admin" });
    }

    res.json(results);
  });
};
