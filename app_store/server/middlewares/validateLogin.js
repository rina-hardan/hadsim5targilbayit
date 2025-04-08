module.exports = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "חובה למלא אימייל וסיסמה" });
    }
    next();
}