const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.json({ message: "Use the React frontend to sign up." });
};

module.exports.renderLoginForm = (req, res) => {
    res.json({ message: "Use the React frontend to log in." });
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({
                success: true,
                message: "Welcome to TripNest!",
                user: { _id: registeredUser._id, username: registeredUser.username, email: registeredUser.email },
            });
        });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

module.exports.Login = async (req, res) => {
    res.json({
        success: true,
        message: "Welcome back to TripNest! You are logged in.",
        user: { _id: req.user._id, username: req.user.username, email: req.user.email },
    });
};

module.exports.Logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.json({ success: true, message: "You are logged out." });
    });
};