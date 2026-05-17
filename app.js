require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const cors = require("cors");

const listingRouter = require("./router/listing.js");
const reviewRouter = require("./router/review.js");
const userRouter = require("./router/user.js");

const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

// CORS — allow React dev server
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("Error in Mongo Session Store", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Make flash & user available in res.locals (used by controllers)
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// API route: get current logged-in user
app.get("/api/me", (req, res) => {
    if (req.user) {
        res.json({ user: { _id: req.user._id, username: req.user.username, email: req.user.email } });
    } else {
        res.json({ user: null });
    }
});

// API Routes
app.use("/api/listing", listingRouter);
app.use("/api/listing/:id/reviews", reviewRouter);
app.use("/api", userRouter);

// Serve React build in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "client", "dist")));
    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
    });
}

// 404 handler
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "API route not found"));
});

// Error handler
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).json({ error: message });
});

app.listen(3000, () => {
    console.log("Server running on Port: 3000");
});