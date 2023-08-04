import actionTypes from "./actionTypes";
import { toast } from "react-toastify";
import {
    getAllCodeService,
    createNewUserService,
    getAllUsers,
    deleteUserService,
    editUserService,
    getTopDoctorHomeService,
    getAllDoctors,
    saveDetailDoctorService,
    getAllSpecialty,
    getAllClinic,
} from "../../services/userService";

export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("GENDER");
            if (res && res.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data));
            } else {
                dispatch(fetchGenderFail());
            }
        } catch (e) {
            dispatch(fetchGenderFail());
            console.log("Error:", e);
        }
    };
};

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData,
});

export const fetchGenderFail = () => ({
    type: actionTypes.FETCH_GENDER_FAIL,
});

export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("POSITION");
            console.log("check res genders: ", res.data, res.errCode);
            if (res && res.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data));
            } else {
                dispatch(fetchPositionFail());
            }
        } catch (e) {
            dispatch(fetchPositionFail());
            console.log("Error:", e);
        }
    };
};

export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData,
});

export const fetchPositionFail = () => ({
    type: actionTypes.FETCH_POSITION_FAIL,
});

export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("ROLE");
            if (res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data));
            } else {
                dispatch(fetchRoleFail());
            }
        } catch (e) {
            dispatch(fetchRoleFail());
            console.log("Error:", e);
        }
    };
};

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData,
});

export const fetchRoleFail = () => ({
    type: actionTypes.FETCH_ROLE_FAIL,
});

export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createNewUserService(data);
            if (res && res.errCode === 0) {
                toast.success("Create new user succeed");
                dispatch(saveUserSuccess());
                dispatch(fetchAllUsersStart());
            } else {
                dispatch(saveUserFail());
            }
        } catch (e) {
            dispatch(saveUserFail());
            console.log("Error: ", e);
        }
    };
};

export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS,
});
export const saveUserFail = () => ({
    type: actionTypes.CREATE_USER_FAIL,
});

export const fetchAllUsersStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllUsers("ALL");
            if (res && res.errCode === 0) {
                dispatch(fetchAllUsersSuccess(res.users.reverse()));
            } else {
                dispatch(fetchAllUsersFail());
            }
        } catch (e) {
            dispatch(fetchAllUsersFail());
            console.log("Error:", e);
        }
    };
};

export const fetchAllUsersSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    users: data,
});
export const fetchAllUsersFail = () => ({
    type: actionTypes.FETCH_ALL_USERS_FAIL,
});

export const deleteAUser = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteUserService(userId);
            if (res && res.errCode === 0) {
                toast.success("Delete a user succeed!");
                dispatch(deleteUserSuccess());
                dispatch(fetchAllUsersStart());
            } else {
                toast.error("It's have an error!");
                dispatch(deleteUserFail());
            }
        } catch (e) {
            toast.error("It's have fetch an error!");
            dispatch(deleteUserFail());
            console.log("Error: ", e);
        }
    };
};

export const deleteUserSuccess = () => ({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
});
export const deleteUserFail = () => ({
    type: actionTypes.FETCH_ALL_USERS_FAIL,
});

export const editAUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await editUserService(data);
            if (res && res.errCode === 0) {
                toast.success("Update a user succeed!");
                dispatch(editUserSuccess());
                dispatch(fetchAllUsersStart());
            } else {
                toast.error("Update a user error!");
                dispatch(editUserFail());
            }
        } catch (e) {
            toast.error("It's have fetch an error!");
            dispatch(editUserFail());
            console.log("Error: ", e);
        }
    };
};

export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS,
});
export const editUserFail = () => ({
    type: actionTypes.EDIT_USER_FAIL,
});

export const fetchTopDoctor = () => {
    return async (dispatch, getState) => {
        try {
            let response = await getTopDoctorHomeService("10");
            if (response && response.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
                    dataDoctors: response.data,
                });
            } else {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_FAIL,
                });
            }
        } catch (e) {
            console.log("FETCH_TOP_DOCTORS_FAIL: ", e);
            dispatch({
                type: actionTypes.FETCH_TOP_DOCTORS_FAIL,
            });
        }
    };
};

export const fetchAllDoctors = () => {
    return async (dispatch, getState) => {
        try {
            let response = await getAllDoctors();
            if (response && response.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
                    allDoctors: response.data,
                });
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_FAIL,
                });
            }
        } catch (e) {
            console.log("FETCH_TOP_DOCTORS_FAIL: ", e);
            dispatch({
                type: actionTypes.FETCH_ALL_DOCTORS_FAIL,
            });
        }
    };
};

export const saveDetailDoctor = (data) => {
    return async (dispatch, getState) => {
        try {
            let response = await saveDetailDoctorService(data);
            if (response && response.errCode === 0) {
                toast.success("Save infor detail doctor succeed!");
                dispatch({
                    type: actionTypes.FETCH_DETAIL_DOCTOR_SUCCESS,
                });
            } else {
                console.log("error: ", response);
                toast.error("Save infor detail doctor error");
                dispatch({
                    type: actionTypes.FETCH_DETAIL_DOCTOR_FAIL,
                });
            }
        } catch (e) {
            toast.error("Save infor detail doctor error");
            console.log("FETCH_TOP_DOCTORS_FAIL: ", e);
            dispatch({
                type: actionTypes.FETCH_DETAIL_DOCTOR_FAIL,
            });
        }
    };
};

export const fetchAllScheduleTime = () => {
    return async (dispatch, getState) => {
        try {
            let response = await getAllCodeService("TIME");
            if (response && response.errCode === 0) {
                console.log("vao ham thanh cong");
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
                    dataTime: response.data,
                });
            } else {
                console.log("vao ham that bai");

                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAIL,
                });
            }
        } catch (e) {
            console.log("FETCH_TOP_DOCTORS_FAIL: ", e);
            dispatch({
                type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAIL,
            });
        }
    };
};

export const getRequiredDoctorInfor = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_START });
            let resPrice = await getAllCodeService("PRICE");
            let resPayment = await getAllCodeService("PAYMENT");
            let resProvince = await getAllCodeService("PROVINCE");
            let resSpecialty = await getAllSpecialty();
            let resClinic = await getAllClinic();

            if (
                resPrice &&
                resPrice.errCode === 0 &&
                resPayment &&
                resPayment.errCode === 0 &&
                resProvince &&
                resProvince.errCode === 0 &&
                resSpecialty &&
                resSpecialty.errCode === 0 &&
                resClinic &&
                resClinic.errCode === 0
            ) {
                let data = {
                    resPrice: resPrice.data,
                    resPayment: resPayment.data,
                    resProvince: resProvince.data,
                    resSpecialty: resSpecialty.data,
                    resClinic: resClinic.data,
                };
                dispatch(fetchRequiredDoctorInforSuccess(data));
            } else {
                dispatch(fetchRequiredDoctorInforFail());
            }
        } catch (e) {
            dispatch(fetchRequiredDoctorInforFail());
            console.log(e);
        }
    };
};

export const fetchRequiredDoctorInforSuccess = (allRequiredData) => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS,
    data: allRequiredData,
});

export const fetchRequiredDoctorInforFail = () => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAIL,
});
