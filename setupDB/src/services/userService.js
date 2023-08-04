import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    });
};

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExit = await checkUserEmail(email);
            if (isExit) {
                let user = await db.User.findOne({
                    attributes: [
                        "email",
                        "password",
                        "roleId",
                        "firstName",
                        "lastName",
                        "id",
                    ],
                    where: { email: email },
                    raw: true,
                });
                if (user) {
                    let check = await bcrypt.compareSync(
                        password,
                        user.password
                    );
                    if (check) {
                        userData.errCode = 0;
                        userData.message = "OK";
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.message = "Incorrect password!";
                    }
                } else {
                    userData.errCode = 3;
                    userData.message = "User's not found";
                }
            } else {
                userData.errCode = 1;
                userData.message = `Your email isn't exist in your system. Please try other email!`;
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    });
};

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail },
            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = "";
            if (userId === "ALL") {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ["password"],
                    },
                });
            } else if (userId && userId !== "ALL") {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ["password"],
                    },
                });
            }
            resolve(users);
        } catch (error) {
            reject(error);
        }
    });
};

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isEmailExist = await checkUserEmail(data.email);
            if (isEmailExist) {
                resolve({
                    errCode: 1,
                    message:
                        "This email was existed, Please choose another email!",
                });
            } else {
                let hashUserPasswordFromBcrypt = await hashUserPassword(
                    data.password
                );
                await db.User.create({
                    email: data.email,
                    password: hashUserPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar,
                });
                resolve({
                    errCode: 0,
                    message: "OK",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
            });
            if (!user) {
                resolve({
                    errCode: 2,
                    message: "This user is not exist",
                });
            } else {
                await db.User.destroy({
                    where: { id: userId },
                });
                resolve({
                    errCode: 0,
                    message: "This user has just been deleted",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let editUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    message: "You missing parameters!",
                });
            } else {
                let user = await db.User.findOne({
                    where: { id: data.id },
                    raw: false,
                });
                if (user) {
                    user.firstName = data.firstName;
                    user.lastName = data.lastName;
                    user.address = data.address;
                    user.roleId = data.roleId;
                    user.positionId = data.positionId;
                    user.gender = data.gender;
                    user.phoneNumber = data.phoneNumber;
                    if (data.avatar) {
                        user.image = data.avatar;
                    }
                    await user.save();
                    resolve({
                        errCode: 0,
                        message: "Update success!",
                    });
                } else {
                    resolve({
                        errCode: 1,
                        message: "User's not found!",
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    message: "Missing required parameters!",
                });
            } else {
                let allCode = await db.Allcode.findAll({
                    where: { type: typeInput },
                    raw: true,
                });
                resolve({
                    data: allCode,
                    errCode: 0,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = {
    handleUserLogin,
    getAllUsers,
    createNewUser,
    deleteUser,
    editUser,
    getAllCodeService,
};
