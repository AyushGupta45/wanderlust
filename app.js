if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRoute = require("./routes/listingRoute.js");
const reviewRoute = require("./routes/reviewRoute.js");
const userRoute = require("./routes/userRoute.js");
const mongoStore = require("connect-mongo");
const MongoStore = require("connect-mongo");

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// const MONGOOSE_URL = "mongodb://127.0.0.1:27017/wanderlust";
const MONGOOSE_URL = process.env.ATLAS_DB_URL;
async function main() {
  await mongoose.connect(MONGOOSE_URL);
}

main()
  .then(() => console.log("Database Connected"))
  .catch(() => console.log("Some error occured Connecting Database"));

const store = MongoStore.create({
  mongoUrl: MONGOOSE_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("Error", () => {
  console.log("Mongo Error", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};

//session middleware
app.use(session(sessionOptions));

//flash middleware
app.use(flash());

//passport middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

//routes
app.use("/listings", listingRoute);
app.use("/listings/:id/reviews/", reviewRoute);
app.use("/", userRoute);

// Page not found middleware
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Custom error handling middleware
app.use(
  (err, req, res, next) => {
    if (err.message.includes("Cast to ObjectId failed")) {
      const statusCode = 400;
      return res.status(statusCode).render("error.ejs", {
        err: new ExpressError(statusCode, "Invalid ID!"),
      });
    }
    if (err.statusCode === 404) {
      return res.status(404).render("error.ejs", {
        err: new ExpressError(404, "Page Not Found!!"),
      });
    }
    next(err);
  },
  (err, req, res, next) => {
    res.status(500).render("error.ejs", {
      err: new ExpressError(500, "Something Went Wrong!!"),
    });
  }
);

app.listen(8080, () => {
  console.log("App is running");
});
