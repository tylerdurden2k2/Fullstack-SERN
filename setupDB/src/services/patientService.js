import db from "../models";
import emailService from "./emailService";
require("dotenv").config();
import { v4 as uuidv4 } from "uuid";

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
    return result;
};

let postBookAppointment = (dataInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !dataInput.email ||
                !dataInput.timeType ||
                !dataInput.date ||
                !dataInput.doctorId ||
                !dataInput.fullName ||
                !dataInput.selectedGender ||
                !dataInput.address
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters!",
                });
            } else {
                let token = uuidv4();
                await emailService.sendSimpleEmail({
                    receiverEmail: dataInput.email,
                    patientName: dataInput.fullName,
                    time: dataInput.timeString,
                    doctorName: dataInput.doctorName,
                    language: dataInput.language,
                    redirectLink: buildUrlEmail(dataInput.doctorId, token),
                });
                //upsert patient
                let user = await db.User.findOrCreate({
                    where: { email: dataInput.email },
                    defaults: {
                        email: dataInput.email,
                        roleId: "R3",
                        address: dataInput.address,
                        gender: dataInput.selectedGender,
                        firstName: dataInput.fullName,
                    },
                });
                if (user && user[0]) {
                    let result = await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            statusId: "S1",
                            doctorId: dataInput.doctorId,
                            patientId: user[0].id,
                            date: dataInput.date,
                            timeType: dataInput.timeType,
                            token: token,
                        },
                    });
                    if (result[1]) {
                        resolve({
                            errCode: 0,
                            errMessage: "Create new patient booking succeed!",
                        });
                    } else {
                        resolve({
                            errCode: 0,
                            errMessage: "This booking has already!",
                        });
                    }
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.token) {
                resolve({
                    errCode: 1,
                    errMessage: "You missing required parameter!",
                });
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: "S1",
                    },
                    raw: false,
                });
                if (appointment) {
                    appointment.statusId = "S2";
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: "Confirm appointment succeed!",
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: "This appointment doesn't exist!",
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

export default {
    postBookAppointment,
    postVerifyBookAppointment,
};
