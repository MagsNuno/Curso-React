require("dotenv").config();


const express = require("express");
const path = require("path");
const cors = require("cors");

const port = process.env.PORT;
const app = express();


// config JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// SOLVE CORS
app.use(cors({credentials:true, origin: 'http://localhost:5173'}));

// UPLOAD directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// DB connection
require("./config/db.js");


// ROUTES 
const router = require("./routes/Router.js");
app.use(router);


app.listen(port, () => {
    console.log(`App running on port ${port}`);
});