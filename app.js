const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet"); // secure headers
const compression = require("compression"); // compress assets
const morgan = require("morgan"); // logging
const { MONGODB_URI, PORT } = require("./config/AppConst");

/**
 * Controllers
 */
const AppError = require("./controllers/errorController");

/**
 * Routes
 */
const userRoutes = require("./routes/userRoutes");
const foodRoutes = require("./routes/foodsRoute");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

/**
 * Database Connection
 */
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(result => {
    console.log('Database is Connected')
}).catch(err => console.log('error' + err))


app.listen(PORT,() =>{
    
    console.clear()
    console.log(`App is listening to the port ${PORT}`)
    
})
/**
 * Middlewares
 */

app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/user", userRoutes); // --- User Acccess
app.use("/food", foodRoutes); // -- Product Access
app.use("/admin", adminRoutes); // --- Admin Access
app.use(AppError.unAuthorised); // -- Error Handler

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const data = error.data;
  res.status(status).json({ data: data });
});

// const PORT = process.env.PORT || 8000;
// app.listen(PORT);
