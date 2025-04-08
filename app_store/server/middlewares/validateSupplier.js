module.exports = (req, res, next) => {
    const { company_name, email, password } = req.body;
    if (!company_name || !email || !password) {
        return res.status(400).json({ error: "company_name, email and password are required" });
    }
    next();
};


