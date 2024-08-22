require('dotenv').config()
const express = require('express');
const app = express();
const connectDB = require("./database/index");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
  credentials: true, 
};
app.use(cors(corsOptions))


app.set("trust proxy", 1);

// Helmet configuration for CSP
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    imgSrc: ["'self'", "data:"],
    connectSrc: ["'self'", "*",  "http://localhost:3000" ], // Allow connections from any origin
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
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
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log("Server Started at Port 5000");
    });
  } catch (error) {
    console.log(error);
  }
};

start();
