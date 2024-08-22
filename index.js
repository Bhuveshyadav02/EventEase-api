const express = require('express');
const app = express();
const connectDB = require("./database/index");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: 'http://localhost:3000', // Allow only this origin
  credentials: true, // Allow credentials to be sent
};
app.use(cors(corsOptions))


app.set("trust proxy", 1);

// Helmet configuration for CSP
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"], // Allow resources from the same origin
    scriptSrc: ["'self'"],  // Allow scripts from the same origin
    styleSrc: ["'self'", "https://fonts.googleapis.com"], // Allow styles from the same origin and Google Fonts
    fontSrc: ["'self'", "https://fonts.gstatic.com"], // Allow fonts from the same origin and Google Fonts
    imgSrc: ["'self'", "data:"], // Allow images from the same origin and data URIs
    connectSrc: ["'self'", "http://localhost:5000"], // Allow connecting to self and API server
    objectSrc: ["'none'"], // Disallow Flash, etc.
    upgradeInsecureRequests: [], // Automatically upgrade HTTP requests to HTTPS
  }
}));

// Import and use routes
const authRouter = require("./routes/authRoutes");
const hallRouter=require("./routes/hallRoutes")
const bookingRouter=require('./routes/bookingRoutes')
app.use(authRouter);
app.use(hallRouter)
app.use(bookingRouter)

app.get("/", (req, res) => {
  res.send("Server is working");
});

const start = async () => {
  try {
    await connectDB(); // Ensure to await the database connection
    console.log("Database Connected");
    app.listen(5000, () => {
      console.log("Server Started at Port 5000");
    });
  } catch (error) {
    console.log(error);
  }
};

start();
