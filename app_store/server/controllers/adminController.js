const adminModel = require("../models/adminModel");
const bcrypt = require("bcrypt");

exports.addAdmin = (req, res) => {
    const {username,password,email} = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ error: "יש לספק שם משתמש וסיסמה" });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error("❌ שגיאה בהצפנת הסיסמה:", err);
            return res.status(500).json({ error: "שגיאה בהצפנת הסיסמה" });
        }
        adminModel.addAdmin(username, hashedPassword,email, (err, result) => {
            if (err) {
                console.error("❌ שגיאה בהוספת אדמין:", err);
                return res.status(500).json({ error: "שגיאה בהוספת אדמין" });
            }

            res.status(201).json({ message: "✅ אדמין נוסף בהצלחה", adminId: result.insertId });
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    adminModel.getAdminByEmail(email, (err, admin) => {
        if (err) return res.status(500).json({ error: "שגיאה במסד נתונים" });
        if (!admin) return res.status(401).json({ error: "בבקשה תרשם-מנהל לא נמצא" });

        bcrypt.compare(password, admin.password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: "שגיאה בהשוואת סיסמה" });

            if (!isMatch) return res.status(401).json({ error: "סיסמה שגויה" });

            res.json({
                message: "התחברות הצליחה",
                admin: {
                    id: admin.id
                }
            });
        });
    });
};
