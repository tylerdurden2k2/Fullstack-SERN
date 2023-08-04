import React, { Component } from "react";
import { connect } from "react-redux";
import "./VerifyEmail.scss";
import { LANGUAGES } from "../../utils";
import { FormattedMessage } from "react-intl";
import { postVerifyBookAppointment } from "../../services/userService";
import HomeHeader from "../HomePage/HomeHeader";

class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusVerify: false,
        };
    }

    async componentDidMount() {
        if (this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search);
            let token = urlParams.get("token");
            let doctorId = urlParams.get("doctorId");

            let res = await postVerifyBookAppointment({
                token,
                doctorId,
            });
            if (res && res.errCode === 0) {
                this.setState({
                    statusVerify: true,
                });
            } else {
                this.setState({
                    statusVerify: false,
                });
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapShot) {}

    render() {
        let { statusVerify } = this.state;
        return (
            <>
                <HomeHeader />
                <div className="verify-booking">
                    {statusVerify ? (
                        <div className="success-booking">
                            <FormattedMessage id="patient.verify-booking.success-booking" />
                        </div>
                    ) : (
                        <div className="error-booking">
                            <FormattedMessage id="patient.verify-booking.error-booking" />
                        </div>
                    )}
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
