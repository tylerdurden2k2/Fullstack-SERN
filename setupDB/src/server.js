import express from "express";
//bodyParser to get requires[object] from clients
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import dotenv from "dotenv";
import connectDB from "./config/connectDB";
import cors from "cors";

//call config of dotenv package // to run line process.env.PORT
dotenv.config();

//app is an instant of framework Express
let app = express();
// app.use(cors({ credentials: true, origin: true }));
//config app

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", `${process.env.URL_REACT}`);
    res.header(
        "Access-Control-Allow-Methods",
        "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        // "X-Requested-With, content-type"
        "Origin, X-Requested-With, Content-Type, Accept, Z-Key"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

viewEngine(app);
initWebRoutes(app);

connectDB();

//PORT === undefined => PORT = 3000
let port = process.env.PORT || 3000;

//get starting localhost server
app.listen(port, () => {
    console.log("Your server is running on http://localhost:" + port);
});
