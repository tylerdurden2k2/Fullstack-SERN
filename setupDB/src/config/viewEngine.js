import express from "express";

let configViewEngine = (app) => {
    // config static file
    app.use(express.static("./src/public"));
    //config view engine package to render HTML with JS
    app.set("view engine", "ejs");
    //config file to export HTML file
    app.set("views", "./src/views");
};

module.exports = configViewEngine;
