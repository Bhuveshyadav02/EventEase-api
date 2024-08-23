require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
app.use(express.static(path.join(__dirname, 'public')));
// CORS Configuration
const corsOptions = {
  origin: "*", // Allow any origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// Import and use routes
const authRouter = require("./routes/authRoutes");
const hallRouter = require("./routes/hallRoutes");
const bookingRouter = require('./routes/bookingRoutes');
app.use(authRouter);
app.use(hallRouter);
app.use(bookingRouter);

// Health Check Route
app.get("/", (req, res) => {
  res.send("Server is working");
});

// Start Server
const start = async () => {
  try {
    // Ensure to await the database connection
    console.log("Database Connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server Started at Port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
