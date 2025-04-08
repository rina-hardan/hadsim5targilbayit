const jwt = require("jsonwebtoken");

exports.authenticateSupplier = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // ציפייה ל-"Bearer <token>"
    if (!token) return res.status(401).json({ error: "אין טוקן, גישה נדחית" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
        if (decoded.role !== "supplier") {
            return res.status(403).json({ error: "גישה נדחית - לא ספק" });
        }
        req.supplier = decoded; // מוסיפים את המידע לבקשה
        next();
    } catch (err) {
        res.status(401).json({ error: "טוקן לא תקין" });
    }
};

exports.authenticateAdmin = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "אין טוקן, גישה נדחית" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
        if (decoded.role !== "admin") {
            return res.status(403).json({ error: "גישה נדחית - לא מנהל" });
        }
        req.admin = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: "טוקן לא תקין" });
    }
};
