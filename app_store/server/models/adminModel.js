const db = require("../db/config");

exports.addAdmin = (username, password,email, callback) => {
    const sql = `INSERT INTO admin (username, password,email) VALUES (?, ?,?)`;
    db.query(sql, [username, password,email], callback);
};


exports.getAdminByEmail = (email, callback) => {
    db.query("SELECT * FROM admin WHERE email = ?", [email], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
    });
};








