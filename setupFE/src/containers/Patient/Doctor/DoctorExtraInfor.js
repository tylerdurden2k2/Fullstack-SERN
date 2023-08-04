import React, { Component } from "react";
import { connect } from "react-redux";
import "./DoctorExtraInfor.scss";
import { LANGUAGES } from "../../../utils";
import { getExtraInforDoctorById } from "../../../services/userService";
import { FormattedMessage } from "react-intl";
import NumberFormat from "react-number-format";

class DoctorExtraInfor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfor: false,
            extraInforDoctor: {},
        };
    }

    async componentDidMount() {
        if (this.props.doctorIdFromParent) {
            let res = await getExtraInforDoctorById(
                this.props.doctorIdFromParent
            );
            if (res && res.errCode === 0) {
                this.setState({
                    extraInforDoctor: res.data,
                });
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapShot) {
        if (prevProps.language !== this.props.language) {
        }
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let res = await getExtraInforDoctorById(
                this.props.doctorIdFromParent
            );
            if (res && res.errCode === 0) {
                this.setState({
                    extraInforDoctor: res.data,
                });
            }
        }
    }
    handleShowHideDetailInfor = () => {
        this.setState({
            isShowDetailInfor: !this.state.isShowDetailInfor,
        });
    };

    render() {
        let { isShowDetailInfor, extraInforDoctor } = this.state;
        return (
            <div className="doctor-extra-infor-container">
                <div className="content-up">
                    <div className="text-address">
                        <FormattedMessage id="patient.extra-infor-doctor.address-clinic" />
                    </div>
                    <div className="name-clinic">
                        {extraInforDoctor && extraInforDoctor.nameClinic
                            ? extraInforDoctor.nameClinic
                            : ""}
                    </div>
                    <div className="detail-address">
                        {extraInforDoctor && extraInforDoctor.addressClinic
                            ? extraInforDoctor.addressClinic
                            : ""}
                    </div>
                </div>
                <div className="content-down">
                    {!isShowDetailInfor ? (
                        <div>
                            <FormattedMessage id="patient.extra-infor-doctor.price" />
                            :{" "}
                            {extraInforDoctor &&
                                extraInforDoctor.priceTypeData &&
                                this.props.language === LANGUAGES.VI && (
                                    <NumberFormat
                                        value={
                                            extraInforDoctor.priceTypeData
                                                .valueVi
                                        }
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        suffix={"VND"}
                                    />
                                )}{" "}
                            {extraInforDoctor &&
                                extraInforDoctor.priceTypeData &&
                                this.props.language === LANGUAGES.EN && (
                                    <NumberFormat
                                        value={
                                            extraInforDoctor.priceTypeData
                                                .valueEn
                                        }
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        suffix={"$"}
                                    />
                                )}{" "}
                            <span
                                className="button-show"
                                onClick={() => this.handleShowHideDetailInfor()}
                            >
                                <FormattedMessage id="patient.extra-infor-doctor.show-btn" />
                            </span>
                        </div>
                    ) : (
                        <>
                            <div className="title-price">
                                <FormattedMessage id="patient.extra-infor-doctor.price" />
                            </div>
                            <div className="detail-infor">
                                <div className="detail-price">
                                    <div className="left-right">
                                        <span className="left">
                                            <FormattedMessage id="patient.extra-infor-doctor.price" />
                                        </span>
                                        <span className="right">
                                            {extraInforDoctor &&
                                                extraInforDoctor.priceTypeData &&
                                                this.props.language ===
                                                    LANGUAGES.VI && (
                                                    <NumberFormat
                                                        value={
                                                            extraInforDoctor
                                                                .priceTypeData
                                                                .valueVi
                                                        }
                                                        displayType={"text"}
                                                        thousandSeparator={true}
                                                        suffix={"VND"}
                                                    />
                                                )}{" "}
                                            {extraInforDoctor &&
                                                extraInforDoctor.priceTypeData &&
                                                this.props.language ===
                                                    LANGUAGES.EN && (
                                                    <NumberFormat
                                                        value={
                                                            extraInforDoctor
                                                                .priceTypeData
                                                                .valueEn
                                                        }
                                                        displayType={"text"}
                                                        thousandSeparator={true}
                                                        suffix={"$"}
                                                    />
                                                )}{" "}
                                        </span>
                                    </div>
                                    <div className="note">
                                        {extraInforDoctor &&
                                        extraInforDoctor.note
                                            ? extraInforDoctor.note
                                            : ""}
                                    </div>
                                </div>

                                <div className="payment">
                                    <FormattedMessage id="patient.extra-infor-doctor.payment-method" />
                                    {extraInforDoctor &&
                                    extraInforDoctor.paymentTypeData &&
                                    this.props.language === LANGUAGES.VI
                                        ? extraInforDoctor.paymentTypeData
                                              .valueVi
                                        : " "}
                                    {extraInforDoctor &&
                                    extraInforDoctor.paymentTypeData &&
                                    this.props.language === LANGUAGES.EN
                                        ? extraInforDoctor.paymentTypeData
                                              .valueEn
                                        : " "}
                                </div>
                            </div>
                            <div
                                className="button-hide"
                                onClick={() => this.handleShowHideDetailInfor()}
                            >
                                <FormattedMessage id="patient.extra-infor-doctor.hide-btn" />
                            </div>
                        </>
                    )}
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
