module.exports = (req, res, next) => {
    const { order_id, product_id, quantity, price_per_unit } = req.body;

    if (!order_id || !product_id || !quantity || !price_per_unit) {
        return res.status(400).json({ error: "יש למלא את כל השדות: order_id, product_id, quantity, price_per_unit" });
    }

    if (isNaN(order_id) || isNaN(product_id) || isNaN(quantity) || isNaN(price_per_unit)) {
        return res.status(400).json({ error: "כל הערכים חייבים להיות מספריים" });
    }

    if (quantity <= 0 || price_per_unit <= 0) {
        return res.status(400).json({ error: "כמות ומחיר חייבים להיות חיוביים" });
    }

    next();
};
