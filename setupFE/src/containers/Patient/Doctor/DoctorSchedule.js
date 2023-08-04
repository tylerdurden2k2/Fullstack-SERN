import React, { Component } from "react";
import { connect } from "react-redux";
import "./DoctorSchedule.scss";
import moment from "moment";
import localization from "moment/locale/vi";
import { LANGUAGES } from "../../../utils";
import { getScheduleDoctorByDate } from "../../../services/userService";
import { FormattedMessage } from "react-intl";
import BookingModal from "./Modals/BookingModal";

class DoctorSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            allAvailableTime: [],
            isOpenBookingModal: false,
            dataScheduleTimeModal: {},
        };
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    getArrDays = (language) => {
        let arrDate = [];
        for (let i = 0; i < 7; i++) {
            let object = {};
            if (language === LANGUAGES.VI) {
                if (i === 0) {
                    let ddMM = moment(new Date()).format("DD/MM");
                    let today = `Hôm nay - ${ddMM}`;
                    object.label = today;
                } else {
                    let labelVi = moment(new Date())
                        .add(i, "days")
                        .format("dddd - DD/MM");
                    object.label = this.capitalizeFirstLetter("" + labelVi);
                }
            } else {
                if (i === 0) {
                    let ddMM = moment(new Date()).format("DD/MM");
                    let today = `Today - ${ddMM}`;
                    object.label = today;
                } else {
                    object.label = moment(new Date())
                        .add(i, "days")
                        .locale("en")
                        .format("ddd - DD/MM");
                }
            }
            object.value = moment(new Date())
                .add(i, "days")
                .startOf("day")
                .valueOf();

            arrDate.push(object);
        }
        return arrDate;
    };
    //component was called
    async componentDidMount() {
        let allDays = this.getArrDays(this.props.language);
        if (this.props.doctorIdFromParent) {
            let res = await getScheduleDoctorByDate(
                this.props.doctorIdFromParent,
                allDays[0].value
            );
            this.setState({
                allAvailableTime: res.data ? res.data : [],
            });
        }
        this.setState({
            allDays: allDays,
        });
    }
    //state changed
    async componentDidUpdate(prevProps, prevState, snapShot) {
        if (prevProps.language !== this.props.language) {
            let allDays = this.getArrDays(this.props.language);
            this.setState({
                allDays: allDays,
            });
        }
        if (prevProps.doctorIdFromParent !== this.props.doctorIdFromParent) {
            let allDays = this.getArrDays(this.props.language);
            let res = await getScheduleDoctorByDate(
                this.props.doctorIdFromParent,
                allDays[0].value
            );
            this.setState({
                allAvailableTime: res.data ? res.data : [],
            });
        }
    }
    handleOnChangeSelect = async (e) => {
        if (
            this.props.doctorIdFromParent &&
            this.props.doctorIdFromParent !== -1
        ) {
            let doctorId = this.props.doctorIdFromParent;
            let date = e.target.value;
            let res = await getScheduleDoctorByDate(doctorId, date);
            if (res && res.errCode === 0) {
                this.setState({
                    allAvailableTime: res.data ? res.data : [],
                });
            }
            console.log("check res schedule from react: ", res);
        }
    };

    handleSelectScheduleTime = (time) => {
        this.setState({
            dataScheduleTimeModal: time,
            isOpenBookingModal: true,
        });
    };
    handleCloseModal = () => {
        this.setState({
            isOpenBookingModal: false,
        });
    };
    render() {
        let {
            allDays,
            allAvailableTime,
            isOpenBookingModal,
            dataScheduleTimeModal,
        } = this.state;
        let { language } = this.props;
        return (
            <>
                <div className="doctor-schedule-container">
                    <div className="all-schedule">
                        <select onChange={(e) => this.handleOnChangeSelect(e)}>
                            {allDays &&
                                allDays.length > 0 &&
                                allDays.map((item, index) => {
                                    return (
                                        <option key={index} value={item.value}>
                                            {item.label}
                                        </option>
                                    );
                                })}
                        </select>
                    </div>
                    <div className="all-available-time">
                        <div className="text-calendar">
                            <i className="fas fa-calendar-alt">
                                <span>
                                    <FormattedMessage id="patient.detail-doctor.schedule" />
                                </span>
                            </i>
                        </div>
                        <div className="time-content">
                            <div class="btn-box">
                                {allAvailableTime &&
                                allAvailableTime.length > 0 ? (
                                    allAvailableTime.map((item, index) => {
                                        let timeDisplay =
                                            language === LANGUAGES.VI
                                                ? item.timeTypeData.valueVi
                                                : item.timeTypeData.valueEn;
                                        return (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    this.handleSelectScheduleTime(
                                                        item
                                                    )
                                                }
                                            >
                                                {timeDisplay}
                                            </button>
                                        );
                                    })
                                ) : (
                                    <div className="no-calendar">
                                        <FormattedMessage id="patient.detail-doctor.no-calendar" />
                                    </div>
                                )}
                            </div>
                            <div className="book-free">
                                <FormattedMessage id="patient.detail-doctor.choose" />
                                <i className="far fa-hand-point-up"></i>{" "}
                                <FormattedMessage id="patient.detail-doctor.book-free" />
                            </div>
                        </div>
                    </div>
                </div>
                <BookingModal
                    isOpenModal={isOpenBookingModal}
                    closeModal={this.handleCloseModal}
                    dataTime={dataScheduleTimeModal}
                />
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
