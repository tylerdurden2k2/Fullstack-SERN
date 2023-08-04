import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import "./ManageDoctor.scss";
import Select from "react-select";
import { CRUD_ACTIONS, LANGUAGES } from "../../../utils";
import { getDetailInforDoctor } from "../../../services/userService";
import { FormattedMessage } from "react-intl";

const mdParser = new MarkdownIt();

class ManageDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //save to markdown table
            contentMarkdown: "",
            contentHTML: "",
            description: "",
            hasOldData: false,

            //save to doctor info table
            listPrice: [],
            listPayment: [],
            listProvince: [],
            listSpecialty: [],
            listClinic: [],
            listDoctors: [],

            selectedPrice: "",
            selectedProvince: "",
            selectedPayment: "",
            nameClinic: "",
            selectedDoctor: "",
            selectedSpecialty: "",
            selectedClinic: "",
            addressClinic: "",
            note: "",
        };
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.getRequiredDoctorInfor();
    }

    BuildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            if (type === "USERS") {
                inputData.map((item) => {
                    let object = {};
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = `${item.firstName} ${item.lastName}`;
                    object.label =
                        language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                    result.push(object);
                });
            }
            if (type === "PRICE") {
                inputData.map((item) => {
                    let object = {};
                    let labelVi = item.valueVi;
                    let labelEn = `${item.valueEn} USD`;
                    object.label =
                        language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                });
            }
            if (type === "PAYMENT" || type === "PROVINCE") {
                inputData.map((item) => {
                    let object = {};
                    let labelVi = item.valueVi;
                    let labelEn = item.valueEn;
                    object.label =
                        language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                });
            }
            if (type === "SPECIALTY" || type === "CLINIC") {
                inputData.map((item) => {
                    let object = {};
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object);
                });
            }
        }
        return result;
    };

    componentDidUpdate(prevProps, prevState, snapShot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let listDatas = this.BuildDataInputSelect(
                this.props.allDoctors,
                "USERS"
            );

            this.setState({
                listDoctors: listDatas,
            });
        }
        if (prevProps.language !== this.props.language) {
            let dataSelectPrice = this.BuildDataInputSelect(
                this.props.allRequiredDoctorInfor.resPrice,
                "PRICE"
            );
            let dataSelectPayment = this.BuildDataInputSelect(
                this.props.allRequiredDoctorInfor.resPayment,
                "PAYMENT"
            );
            let dataSelectProvince = this.BuildDataInputSelect(
                this.props.allRequiredDoctorInfor.resProvince,
                "PROVINCE"
            );
            let listDatas = this.BuildDataInputSelect(
                this.props.allDoctors,
                "USERS"
            );
            this.setState({
                listDoctors: listDatas,
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
            });
        }
        if (
            prevProps.allRequiredDoctorInfor !==
            this.props.allRequiredDoctorInfor
        ) {
            let dataSelectPrice = this.BuildDataInputSelect(
                this.props.allRequiredDoctorInfor.resPrice,
                "PRICE"
            );
            let dataSelectPayment = this.BuildDataInputSelect(
                this.props.allRequiredDoctorInfor.resPayment,
                "PAYMENT"
            );
            let dataSelectProvince = this.BuildDataInputSelect(
                this.props.allRequiredDoctorInfor.resProvince,
                "PROVINCE"
            );
            let dataSelectSpecialty = this.BuildDataInputSelect(
                this.props.allRequiredDoctorInfor.resSpecialty,
                "SPECIALTY"
            );
            let dataSelectClinic = this.BuildDataInputSelect(
                this.props.allRequiredDoctorInfor.resClinic,
                "CLINIC"
            );

            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty: dataSelectSpecialty,
                listClinic: dataSelectClinic,
            });
        }
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html,
        });
    };

    handleSaveContentMarkdown = () => {
        let { hasOldData } = this.state;
        this.props.saveDetailDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            id: this.state.selectedDoctor.value,
            action: hasOldData ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

            selectedPrice: this.state.selectedPrice.value,
            selectedProvince: this.state.selectedProvince.value,
            selectedPayment: this.state.selectedPayment.value,
            nameClinic: this.state.nameClinic,
            addressClinic: this.state.addressClinic,
            note: this.state.note,
            clinicId:
                this.state.selectedClinic && this.state.selectedClinic.value
                    ? this.state.selectedClinic.value
                    : "",
            specialtyId: this.state.selectedSpecialty.value,
        });
    };
    handleChangeSelectDoctorInfor = (selectedOption, name) => {
        let stateName = name.name;
        let copyState = { ...this.state };
        copyState[stateName] = selectedOption;
        this.setState({
            ...copyState,
        });
    };
    handleChangeSelected = async (selectedDoctor) => {
        let {
            listPayment,
            listPrice,
            listProvince,
            listSpecialty,
            listClinic,
        } = this.state;
        this.setState({
            selectedDoctor: selectedDoctor,
        });
        let res = await getDetailInforDoctor(selectedDoctor.value);
        if (res && res.errCode === 0 && res.data && res.data.Markdown) {
            let markdown = res.data.Markdown;
            let addressClinic = "",
                nameClinic = "",
                note = "",
                paymentId = "",
                provinceId = "",
                priceId = "",
                specialtyId = "",
                clinicId = "",
                selectedClinic = "",
                selectedPrice = "",
                selectedPayment = "",
                selectedProvince = "",
                selectedSpecialty = "";
            if (res.data.Doctor_Infor) {
                addressClinic = res.data.Doctor_Infor.addressClinic;
                nameClinic = res.data.Doctor_Infor.nameClinic;
                note = res.data.Doctor_Infor.note;
                paymentId = res.data.Doctor_Infor.paymentId;
                provinceId = res.data.Doctor_Infor.provinceId;
                priceId = res.data.Doctor_Infor.priceId;
                specialtyId = res.data.Doctor_Infor.specialtyId;
                clinicId = res.data.Doctor_Infor.clinicId;
                selectedPrice = listPrice.find((item) => {
                    return item && item.value === priceId;
                });
                selectedPayment = listPayment.find((item) => {
                    return item && item.value === paymentId;
                });
                selectedProvince = listProvince.find((item) => {
                    return item && item.value === provinceId;
                });
                selectedSpecialty = listSpecialty.find((item) => {
                    return item && item.value === specialtyId;
                });
                selectedClinic = listClinic.find((item) => {
                    return item && item.value === clinicId;
                });
            }
            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                hasOldData: true,
                addressClinic: addressClinic,
                nameClinic: nameClinic,
                note: note,
                selectedPrice: selectedPrice,
                selectedPayment: selectedPayment,
                selectedProvince: selectedProvince,
                selectedSpecialty: selectedSpecialty,
                selectedClinic: selectedClinic,
            });
        } else {
            this.setState({
                contentHTML: "",
                contentMarkdown: "",
                description: "",
                hasOldData: false,
                addressClinic: "",
                nameClinic: "",
                note: "",
                selectedPrice: "",
                selectedPayment: "",
                selectedProvince: "",
                selectedSpecialty: "",
                selectedClinic: "",
            });
        }
    };
    handleOnChangetext = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        });
    };
    render() {
        console.log("check state: ", this.state);
        let { hasOldData } = this.state;
        return (
            <div className="manage-doctor-container">
                <div className="manage-doctor-tile">
                    <FormattedMessage id="admin.manage-doctor.title" />
                </div>
                <div className="more-info">
                    <div className="content-left form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.choose-doctor" />
                        </label>
                        <Select
                            value={this.state.selectedDoctor}
                            onChange={this.handleChangeSelected}
                            options={this.state.listDoctors}
                            placeholder={
                                <FormattedMessage id="admin.manage-doctor.choose-doctor" />
                            }
                        />
                    </div>
                    <div className="content-right form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.description-doctor" />
                        </label>
                        <textarea
                            className="form-control"
                            onChange={(event) =>
                                this.handleOnChangetext(event, "description")
                            }
                            value={this.state.description}
                        ></textarea>
                    </div>
                </div>
                <div className="more-infor-extra row">
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.choose-price" />
                        </label>
                        <Select
                            value={this.state.selectedPrice}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listPrice}
                            placeholder={
                                <FormattedMessage id="admin.manage-doctor.choose-price" />
                            }
                            name={"selectedPrice"}
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.choose-payment" />
                        </label>
                        <Select
                            value={this.state.selectedPayment}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listPayment}
                            placeholder={
                                <FormattedMessage id="admin.manage-doctor.choose-payment" />
                            }
                            name={"selectedPayment"}
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.choose-province" />
                        </label>
                        <Select
                            value={this.state.selectedProvince}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listProvince}
                            placeholder={
                                <FormattedMessage id="admin.manage-doctor.choose-province" />
                            }
                            name={"selectedProvince"}
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.name-clinic" />
                        </label>
                        <input
                            className="form-control"
                            onChange={(event) =>
                                this.handleOnChangetext(event, "nameClinic")
                            }
                            value={this.state.nameClinic}
                        ></input>
                    </div>
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.address-clinic" />
                        </label>
                        <input
                            className="form-control"
                            onChange={(event) =>
                                this.handleOnChangetext(event, "addressClinic")
                            }
                            value={this.state.addressClinic}
                        ></input>
                    </div>
                    <div className="col-4 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.note" />
                        </label>
                        <input
                            className="form-control"
                            onChange={(event) =>
                                this.handleOnChangetext(event, "note")
                            }
                            value={this.state.note}
                        ></input>
                    </div>
                    <div className="col-6 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.choose-specialty" />
                        </label>
                        <Select
                            value={this.state.selectedSpecialty}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listSpecialty}
                            placeholder={
                                <FormattedMessage id="admin.manage-doctor.choose-specialty" />
                            }
                            name={"selectedSpecialty"}
                        />
                    </div>
                    <div className="col-6 form-group">
                        <label>
                            <FormattedMessage id="admin.manage-doctor.choose-clinic" />
                        </label>
                        <Select
                            value={this.state.selectedClinic}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listClinic}
                            placeholder={
                                <FormattedMessage id="admin.manage-doctor.choose-clinic" />
                            }
                            name={"selectedClinic"}
                        />
                    </div>
                </div>
                <div className="manage-doctor-editor">
                    <MdEditor
                        style={{ height: "300px" }}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </div>

                <button
                    className={
                        hasOldData
                            ? "save-content-doctor"
                            : "create-content-doctor"
                    }
                    onClick={() => this.handleSaveContentMarkdown()}
                >
                    {hasOldData ? (
                        <span>
                            <FormattedMessage id="admin.manage-doctor.save" />
                        </span>
                    ) : (
                        <span>
                            <FormattedMessage id="admin.manage-doctor.create" />
                        </span>
                    )}
                </button>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        allDoctors: state.admin.allDoctors,
        language: state.app.language,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        getRequiredDoctorInfor: () =>
            dispatch(actions.getRequiredDoctorInfor()),
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
