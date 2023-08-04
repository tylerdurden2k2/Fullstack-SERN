import React, { Component } from "react";
import { connect } from "react-redux";
import "./BookingModal.scss";
import { LANGUAGES } from "../../../../utils";
import { FormattedMessage } from "react-intl";
import DatePicker from "../../../../components/Input/DatePicker";
import { Modal } from "reactstrap";
import ProfileDoctor from "../ProfileDoctor";
import _ from "lodash";
import * as actions from "../../../../store/actions";
import Select from "react-select";
import { postPatientBookAppointment } from "../../../../services/userService";
import { toast } from "react-toastify";
import moment from "moment";

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: "",
            phoneNumber: "",
            email: "",
            address: "",
            reason: "",
            birthday: "",
            selectedGender: "",
            doctorId: "",
            genders: "",
            timeType: "",
        };
    }

    async componentDidMount() {
        this.props.getGenders();
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if (this.props.language !== prevProps.language) {
            this.setState({
                genders: this.buildDataGender(this.props.gendersRedux),
            });
        }
        if (this.props.gendersRedux !== prevProps.gendersRedux) {
            this.setState({
                genders: this.buildDataGender(this.props.gendersRedux),
            });
        }
        if (this.props.dataTime !== prevProps.dataTime) {
            if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
                let doctorId = this.props.dataTime.doctorId;
                this.setState({
                    doctorId: doctorId,
                    timeType: this.props.dataTime.timeType,
                });
            }
        }
    }
    buildDataGender = (data) => {
        let result = [];
        let language = this.props.language;
        if (data && data.length > 0) {
            data.map((item) => {
                let object = {};
                object.label =
                    language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                object.value = item.keyMap;
                result.push(object);
            });
        }
        return result;
    };
    handleOnChangeInput = (e, id) => {
        let valueInput = e.target.value;
        let stateCopy = { ...this.state };
        stateCopy[id] = valueInput;
        this.setState({
            ...stateCopy,
        });
    };
    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0],
        });
    };

    handleChangeGender = (selectedOption) => {
        this.setState({ selectedGender: selectedOption });
    };
    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    buildBookingTime = (dataTime) => {
        let { language } = this.props;

        if (dataTime && !_.isEmpty(dataTime)) {
            let { timeTypeData } = dataTime;
            let time =
                language === LANGUAGES.VI
                    ? timeTypeData.valueVi
                    : timeTypeData.valueEn;
            let date =
                language === LANGUAGES.VI
                    ? this.capitalizeFirstLetter(
                          moment
                              .unix(+dataTime.date / 1000)
                              .format("dddd - DD/MM/YYYY")
                      )
                    : moment
                          .unix(+dataTime.date / 1000)
                          .locale("en")
                          .format("ddd - MM/DD/YYYY");
            return `${time} - ${date}`;
        }
        return "";
    };

    buildDoctorName = (dataTime) => {
        let { language } = this.props;

        if (dataTime && !_.isEmpty(dataTime)) {
            let name =
                language === LANGUAGES.VI
                    ? `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
                    : `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`;
            return name;
        }
        return "";
    };
    handleConfirmBooking = async () => {
        //validate
        let date = new Date(this.state.birthday).getTime();
        let timeString = this.buildBookingTime(this.props.dataTime);
        let doctorName = this.buildDoctorName(this.props.dataTime);
        let res = await postPatientBookAppointment({
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            selectedGender: this.state.selectedGender.value,
            doctorId: this.state.doctorId,
            timeType: this.state.timeType,
            date: this.props.dataTime.date,
            birthday: date,
            language: this.props.language,
            timeString: timeString,
            doctorName: doctorName,
        });
        if (res && res.errCode === 0) {
            toast.success("Booking a new appointment succeed!");
            this.props.closeModal();
        } else {
            toast.error("Booking error");
        }
    };

    render() {
        let { isOpenModal, closeModal, dataTime } = this.props;
        let doctorId =
            dataTime && !_.isEmpty(dataTime) ? dataTime.doctorId : "";
        return (
            <Modal
                isOpen={isOpenModal}
                className={"booking-modal-container"}
                centered={true}
                size="lg"
            >
                <div className="booking-modal-content">
                    <div className="booking-modal-header">
                        <span className="left">
                            <FormattedMessage id="patient.booking-modal.title" />
                        </span>
                        <span className="right" onClick={closeModal}>
                            <i className="fas fa-times"></i>
                        </span>
                    </div>
                    <div className="booking-modal-body">
                        {/* {JSON.stringify(dataTime)} */}
                        <ProfileDoctor
                            doctorId={doctorId}
                            isShowDescription={false}
                            dataTime={dataTime}
                        />
                        <div className="row">
                            <div className="col-4">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.fullName" />
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={this.state.fullName}
                                    onChange={(e) =>
                                        this.handleOnChangeInput(e, "fullName")
                                    }
                                />
                            </div>
                            <div className="col-4">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.phoneNumber" />
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={this.state.phoneNumber}
                                    p
                                    onChange={(e) =>
                                        this.handleOnChangeInput(
                                            e,
                                            "phoneNumber"
                                        )
                                    }
                                />
                            </div>
                            <div className="col-4">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.email" />
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={this.state.email}
                                    onChange={(e) =>
                                        this.handleOnChangeInput(e, "email")
                                    }
                                />
                            </div>
                            <div className="col-4">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.birthday" />
                                </label>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className="form-control"
                                    value={this.state.birthday}
                                />
                            </div>
                            <div className="col-4">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.gender" />
                                </label>
                                <Select
                                    options={this.state.genders}
                                    value={this.state.selectedGender}
                                    onChange={this.handleChangeGender}
                                />
                            </div>
                            <div className="col-4">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.address" />
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={this.state.address}
                                    onChange={(e) =>
                                        this.handleOnChangeInput(e, "address")
                                    }
                                />
                            </div>
                            <div className="col-12">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.reason" />
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={this.state.reason}
                                    onChange={(e) =>
                                        this.handleOnChangeInput(e, "reason")
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div className="booking-modal-footer">
                        <button
                            className="btn-booking-confirm"
                            onClick={() => this.handleConfirmBooking()}
                        >
                            <FormattedMessage id="patient.booking-modal.btnConfirm" />
                        </button>
                        <button
                            className="btn-booking-cancel"
                            onClick={closeModal}
                        >
                            <FormattedMessage id="patient.booking-modal.btnCancel" />
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        gendersRedux: state.admin.genders,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGenders: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
