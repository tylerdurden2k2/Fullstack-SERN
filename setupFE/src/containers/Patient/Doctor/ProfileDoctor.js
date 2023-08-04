import React, { Component } from "react";
import { connect } from "react-redux";
import "./ProfileDoctor.scss";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import { getProfileDoctorById } from "../../../services/userService";
import NumberFormat from "react-number-format";
import _ from "lodash";
import moment from "moment";
import { Link } from "react-router-dom";

class ProfileDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {},
        };
    }

    async componentDidMount() {
        let data = await this.getInforById(this.props.doctorId);
        this.setState({
            dataProfile: data,
        });
    }

    getInforById = async (id) => {
        let result = {};
        let res = await getProfileDoctorById(id);
        if (res && res.errCode === 0) {
            result = res.data;
        }
        return result;
    };

    componentDidUpdate(prevProps, prevState, snapShot) {
        if (prevProps.language !== this.props.language) {
        }
        if (prevProps.doctorId !== this.props.doctorId) {
            // let data = this.getInforById(this.props.doctorId);
        }
    }
    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    renderBookingTime = (dataTime) => {
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
            return (
                <>
                    <div>
                        {time} - {date}
                    </div>
                    <div>Miễn phí đặt lịch</div>
                </>
            );
        }
        return <></>;
    };

    render() {
        let { dataProfile } = this.state;
        let {
            language,
            isShowDescription,
            dataTime,
            isShowLinkDetail,
            doctorId,
        } = this.props;
        console.log("check props: ", this.props);
        let nameVi = "",
            nameEn = "";
        let description =
            dataProfile &&
            dataProfile.Markdown &&
            dataProfile.Markdown.description
                ? dataProfile.Markdown.description
                : "";
        let nameClinic =
            dataProfile && dataProfile.Doctor_Infor
                ? dataProfile.Doctor_Infor.nameClinic
                : "";
        let addressClinic =
            dataProfile && dataProfile.Doctor_Infor
                ? dataProfile.Doctor_Infor.addressClinic
                : "";
        if (dataProfile && dataProfile.positionData) {
            nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`;
            nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`;
        }
        let priceVi = dataProfile.Doctor_Infor &&
            dataProfile.Doctor_Infor.priceTypeData && (
                <NumberFormat
                    value={dataProfile.Doctor_Infor.priceTypeData.valueVi}
                    displayType={"text"}
                    thousandSeparator={true}
                    suffix={"VND"}
                />
            );
        let priceEn = dataProfile.Doctor_Infor &&
            dataProfile.Doctor_Infor.priceTypeData && (
                <NumberFormat
                    value={dataProfile.Doctor_Infor.priceTypeData.valueEn}
                    displayType={"text"}
                    thousandSeparator={true}
                    suffix={"$"}
                />
            );
        return (
            <>
                <div className="profile-doctor-container">
                    <div
                        className="image"
                        style={{
                            background: `url(${
                                dataProfile.image ? dataProfile.image : ""
                            })`,
                        }}
                    ></div>
                    <div className="content">
                        <div className="position-doctor">
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                        </div>
                        {isShowDescription ? (
                            <div className="address-infor">
                                <div className="address-clinic">
                                    {addressClinic}
                                </div>
                                <div className="name-clinic">{nameClinic}</div>
                            </div>
                        ) : (
                            <>{this.renderBookingTime(dataTime)}</>
                        )}
                    </div>
                </div>
                {isShowLinkDetail ? (
                    <div>
                        <Link
                            className="watch-more"
                            to={`/detail-doctor/${doctorId}`}
                        >
                            Xem thêm
                        </Link>
                    </div>
                ) : (
                    <div className="price">
                        <FormattedMessage id="patient.booking-modal.price" />{" "}
                        {language === LANGUAGES.VI ? priceVi : priceEn}
                    </div>
                )}
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
