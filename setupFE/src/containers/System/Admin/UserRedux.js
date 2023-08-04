import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { LANGUAGES, CRUD_ACTIONS } from "../../../utils/constant";
import * as actions from "../../../store/actions";
import "./UserRedux.scss";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import TableManageUser from "./TableManageUser";
import CommonUtils from "../../../utils/CommonUtils";

class UserRedux extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgUrl: "",
            isOpen: false,
            //user info
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            address: "",
            phoneNumber: "",
            gender: "",
            position: "",
            role: "",
            avatar: "",
            userEditId: "",
            action: "",
        };
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: arrGenders,
                gender:
                    arrGenders && arrGenders.length > 0
                        ? arrGenders[0].keyMap
                        : "",
            });
        }
        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux;
            this.setState({
                positionArr: arrPositions,
                position:
                    arrPositions && arrPositions.length > 0
                        ? arrPositions[0].keyMap
                        : "",
            });
        }
        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux;
            this.setState({
                roleArr: arrRoles,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : "",
            });
        }
        if (prevProps.listUsers !== this.props.listUsers) {
            let arrGenders = this.props.genderRedux;
            let arrPositions = this.props.positionRedux;
            let arrRoles = this.props.roleRedux;

            this.setState({
                email: "",
                password: "",
                firstName: "",
                lastName: "",
                address: "",
                phoneNumber: "",
                gender:
                    arrGenders && arrGenders.length > 0
                        ? arrGenders[0].keyMap
                        : "",
                position:
                    arrPositions && arrPositions.length > 0
                        ? arrPositions[0].keyMap
                        : "",
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : "",
                avatar: "",
                action: CRUD_ACTIONS.CREATE,
                previewImgUrl: "",
            });
        }
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgUrl: objectUrl,
                avatar: base64,
            });
        }
    };

    checkValidateInput = () => {
        let isValid = true;
        let arrCheck = [
            "email",
            "password",
            "firstName",
            "lastName",
            "address",
            "phoneNumber",
        ];
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                alert(`You missing ${arrCheck[i]} field`);
            }
        }
        return isValid;
    };

    openPreviewImage = () => {
        if (!this.state.previewImgUrl) {
            return;
        }
        this.setState({
            isOpen: true,
        });
    };

    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if (!isValid) {
            return;
        } else {
            let { action } = this.state;
            if (action === CRUD_ACTIONS.CREATE) {
                // fire redux create user
                this.props.createNewUser({
                    email: this.state.email,
                    password: this.state.password,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    address: this.state.address,
                    phoneNumber: this.state.phoneNumber,
                    gender: this.state.gender,
                    roleId: this.state.role,
                    positionId: this.state.position,
                    avatar: this.state.avatar,
                });
            } else if (action === CRUD_ACTIONS.EDIT) {
                //fire redux edit user
                this.props.editAUserRedux({
                    id: this.state.userEditId,
                    email: this.state.email,
                    password: this.state.password,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    address: this.state.address,
                    phoneNumber: this.state.phoneNumber,
                    gender: this.state.gender,
                    roleId: this.state.role,
                    positionId: this.state.position,
                    avatar: this.state.avatar,
                });
            }
        }
    };

    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState(
            {
                ...copyState,
            },
            () => {
                console.log("Check input data user: ", this.state);
            }
        );
    };
    handleEditUserFromParent = (user) => {
        let imageBase64 = "";
        if (user.image) {
            imageBase64 = Buffer.from(user.image, "base64").toString("binary");
        }
        this.setState({
            email: user.email,
            password: "user.password",
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address,
            phoneNumber: user.phoneNumber,
            gender: user.gender,
            position: user.positionId,
            role: user.roleId,
            avatar: "",
            previewImgUrl: imageBase64,
            action: CRUD_ACTIONS.EDIT,
            userEditId: user.id,
        });
    };
    render() {
        let language = this.props.language;
        let genders = this.state.genderArr;
        let positions = this.state.positionArr;
        let roles = this.state.roleArr;

        let {
            email,
            password,
            firstName,
            lastName,
            address,
            phoneNumber,
            gender,
            position,
            role,
            avatar,
        } = this.state;

        return (
            <div className="user-redux-container">
                <div className="title">user redux</div>
                <div className="user-redux-body">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 my-3">
                                <FormattedMessage id="manage-user.add" />
                            </div>
                            <div className="col-3">
                                <label>
                                    {" "}
                                    <FormattedMessage id="manage-user.email" />
                                </label>
                                <input
                                    className="form-control"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        this.onChangeInput(event, "email")
                                    }
                                    disabled={
                                        this.state.action === CRUD_ACTIONS.EDIT
                                            ? true
                                            : false
                                    }
                                />
                            </div>
                            <div className="col-3">
                                <label>
                                    {" "}
                                    <FormattedMessage id="manage-user.password" />
                                </label>
                                <input
                                    className="form-control"
                                    type="password"
                                    value={password}
                                    onChange={(event) =>
                                        this.onChangeInput(event, "password")
                                    }
                                    disabled={
                                        this.state.action === CRUD_ACTIONS.EDIT
                                            ? true
                                            : false
                                    }
                                />
                            </div>
                            <div className="col-3">
                                <label>
                                    {" "}
                                    <FormattedMessage id="manage-user.first-name" />
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={firstName}
                                    onChange={(event) =>
                                        this.onChangeInput(event, "firstName")
                                    }
                                />
                            </div>
                            <div className="col-3">
                                <label>
                                    {" "}
                                    <FormattedMessage id="manage-user.last-name" />
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={lastName}
                                    onChange={(event) =>
                                        this.onChangeInput(event, "lastName")
                                    }
                                />
                            </div>
                            <div className="col-3">
                                <label>
                                    {" "}
                                    <FormattedMessage id="manage-user.phone-number" />
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(event) =>
                                        this.onChangeInput(event, "phoneNumber")
                                    }
                                />
                            </div>
                            <div className="col-9">
                                <label>
                                    {" "}
                                    <FormattedMessage id="manage-user.address" />
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={address}
                                    onChange={(event) =>
                                        this.onChangeInput(event, "address")
                                    }
                                />
                            </div>
                            <div className="col-4">
                                <label>
                                    {" "}
                                    <FormattedMessage id="manage-user.gender" />
                                </label>
                                <select
                                    className="form-control"
                                    onChange={(event) =>
                                        this.onChangeInput(event, "gender")
                                    }
                                    value={gender}
                                >
                                    {genders &&
                                        genders.length > 0 &&
                                        genders.map((gender, index) => {
                                            return (
                                                <option
                                                    key={index}
                                                    value={gender.keyMap}
                                                >
                                                    {language === LANGUAGES.VI
                                                        ? gender.valueVi
                                                        : gender.valueEn}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>
                            <div className="col-4">
                                <label>
                                    <FormattedMessage id="manage-user.position" />
                                </label>
                                <select
                                    className="form-control"
                                    onChange={(event) =>
                                        this.onChangeInput(event, "position")
                                    }
                                    value={position}
                                >
                                    {positions &&
                                        positions.length > 0 &&
                                        positions.map((position, index) => {
                                            return (
                                                <option
                                                    key={index}
                                                    value={position.keyMap}
                                                >
                                                    {language === LANGUAGES.VI
                                                        ? position.valueVi
                                                        : position.valueEn}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>
                            <div className="col-4">
                                <label>
                                    {" "}
                                    <FormattedMessage id="manage-user.role" />
                                </label>
                                <select
                                    className="form-control"
                                    onChange={(event) =>
                                        this.onChangeInput(event, "role")
                                    }
                                    value={role}
                                >
                                    {roles &&
                                        roles.length > 0 &&
                                        roles.map((role, index) => {
                                            return (
                                                <option
                                                    key={index}
                                                    value={role.keyMap}
                                                >
                                                    {language === LANGUAGES.VI
                                                        ? role.valueVi
                                                        : role.valueEn}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>
                            <div className="col-12">
                                <label>
                                    {" "}
                                    <FormattedMessage id="manage-user.image" />
                                </label>
                                <div className="preview-img-container">
                                    <input
                                        id="previewImg"
                                        className="form-control"
                                        type="file"
                                        hidden
                                        onChange={(event) =>
                                            this.handleOnChangeImage(event)
                                        }
                                    />
                                    <label
                                        className="label-upload"
                                        htmlFor="previewImg"
                                    >
                                        Tải ảnh<i className="fas fa-upload"></i>
                                    </label>
                                    <div className="preview-image">
                                        <div
                                            className="image"
                                            style={{
                                                background: `url(${this.state.previewImgUrl})`,
                                                backgroundRepeat: "no-repeat",
                                            }}
                                            onClick={() =>
                                                this.openPreviewImage()
                                            }
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 my-3">
                                <button
                                    type="submit"
                                    className={
                                        this.state.action === CRUD_ACTIONS.EDIT
                                            ? "btn btn-warning"
                                            : "btn btn-primary"
                                    }
                                    onClick={() => this.handleSaveUser()}
                                >
                                    {this.state.action === CRUD_ACTIONS.EDIT ? (
                                        <FormattedMessage id="manage-user.edit" />
                                    ) : (
                                        <FormattedMessage id="manage-user.save" />
                                    )}
                                </button>
                            </div>
                            <div className="col-12">
                                <TableManageUser
                                    handleEditUserFromParentKey={
                                        this.handleEditUserFromParent
                                    }
                                    action={this.state.action}
                                />
                            </div>
                            <div style={{ height: "200px" }}></div>
                        </div>
                    </div>
                </div>

                {this.state.isOpen && (
                    <Lightbox
                        mainSrc={this.state.previewImgUrl}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        positionRedux: state.admin.positions,
        roleRedux: state.admin.roles,
        listUsers: state.admin.users,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => {
            dispatch(actions.fetchAllUsersStart());
        },
        editAUserRedux: (data) => dispatch(actions.editAUser(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
