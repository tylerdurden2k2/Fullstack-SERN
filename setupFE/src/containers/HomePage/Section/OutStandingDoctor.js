import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import * as actions from "../../../store/actions";
import { LANGUAGES } from "../../../utils";
import { withRouter } from "react-router";

class OutStandingDoctor extends Component {
    //function init state
    constructor(props) {
        super(props);
        this.state = {
            arrDoctors: [],
        };
    }

    //auto check props change then assign value back
    componentDidUpdate(prevProps, prevState, snapShot) {
        if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
            this.setState({
                arrDoctors: this.props.topDoctorsRedux,
            });
        }
    }
    //fire Redux to get info
    componentDidMount() {
        this.props.loadTopDoctors();
    }
    handleViewDetailDoctor = (doctor) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctor.id}`);
        }
    };

    render() {
        let arrDoctors = this.state.arrDoctors;
        let { language } = this.props;
        return (
            <div className="section-share section-outstanding-doctor">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section">
                            <FormattedMessage id="homepage.out-standing-doctor" />
                        </span>
                        <button className="btn-section">
                            <FormattedMessage id="homepage.watch-more" />
                        </button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            {arrDoctors &&
                                arrDoctors.length > 0 &&
                                arrDoctors.map((doctor, index) => {
                                    let imageBase64 = "";
                                    if (doctor.image) {
                                        imageBase64 = Buffer.from(
                                            doctor.image,
                                            "base64"
                                        ).toString("binary");
                                    }
                                    let nameVi = `${doctor.positionData.valueVi}, ${doctor.lastName} ${doctor.firstName}`;
                                    let nameEn = `${doctor.positionData.valueEn}, ${doctor.firstName} ${doctor.lastName}`;
                                    return (
                                        <div
                                            key={index}
                                            className="section-customize"
                                            onClick={() =>
                                                this.handleViewDetailDoctor(
                                                    doctor
                                                )
                                            }
                                        >
                                            <div className="customize-border">
                                                <div className="circle-outer">
                                                    <div
                                                        className="bg-image section-outstanding-doctor-img"
                                                        style={{
                                                            backgroundImage: `url(${imageBase64})`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="position-doctor">
                                                    <div>
                                                        {language ===
                                                        LANGUAGES.VI
                                                            ? nameVi
                                                            : nameEn}
                                                    </div>
                                                    <span>
                                                        Chuyên khoa da liễu
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        topDoctorsRedux: state.admin.topDoctors,
    };
};

//fire actions
const mapDispatchToProps = (dispatch) => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctor()),
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor)
);
