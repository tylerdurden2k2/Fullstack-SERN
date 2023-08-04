import db from "../models/index";
import CRUDService from "../services/CRUDService";

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render("homepage.ejs", { data: JSON.stringify({}) });
    } catch (error) {
        console.log(error);
    }
};

let getCRUD = (req, res) => {
    return res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send("POST CRUD");
};

let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUsers();
    return res.render("displayCRUD.ejs", { data: data });
};

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        return res.render("editCRUD.ejs", {
            user: userData,
        });
    } else {
        return res.send("ERROR!");
    }
};

let putCRUD = async (req, res) => {
    let data = req.body;
    let allUsers = await CRUDService.updateUserData(data);
    return res.render("displayCRUD.ejs", { data: allUsers });
};

let deleteCRUD = async (req, res) => {
    let userId = req.query.id;
    let allUsers = await CRUDService.deleteUserById(userId);
    return res.render("displayCRUD.ejs", { data: allUsers });
};

module.exports = {
    getHomePage,
    getCRUD,
    postCRUD,
    displayGetCRUD,
    getEditCRUD,
    putCRUD,
    deleteCRUD,
};
