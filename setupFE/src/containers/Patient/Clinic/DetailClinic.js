import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailClinic.scss";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import HomeHeader from "../../HomePage/HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import { getAllDetailClinicById } from "../../../services/userService";
import _ from "lodash";

class DetailClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailClinic: {},
        };
    }

    async componentDidMount() {
        if (
            this.props.match &&
            this.props.match.params &&
            this.props.match.params.id
        ) {
            let id = this.props.match.params.id;
            let res = await getAllDetailClinicById({
                id: id,
            });
            if (res && res.errCode === 0) {
                let data = res.data;
                let arrDoctorId = [];
                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorClinic;
                    if (arr && arr.length > 0) {
                        arr.map((item) => {
                            arrDoctorId.push(item.doctorId);
                        });
                    }
                }

                this.setState({
                    dataDetailClinic: res.data,
                    arrDoctorId: arrDoctorId,
                });
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapShot) {}

    render() {
        let { language } = this.props;
        let { arrDoctorId, dataDetailClinic } = this.state;
        console.log("check state detail doctor id", this.state);
        return (
            <>
                <HomeHeader />

                <div className="detail-clinic-container">
                    <div className={"description-clinic"}>
                        {dataDetailClinic && !_.isEmpty(dataDetailClinic) && (
                            <>
                                <div className="name-clinic">
                                    {dataDetailClinic.name}
                                </div>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: dataDetailClinic.descriptionHTML,
                                    }}
                                ></div>
                            </>
                        )}
                    </div>

                    {arrDoctorId &&
                        arrDoctorId.length > 0 &&
                        arrDoctorId.map((item, index) => {
                            return (
                                <div className="each-doctor" key={item}>
                                    <div className="content-left">
                                        <ProfileDoctor
                                            doctorId={item}
                                            isShowDescription={true}
                                            isShowLinkDetail={true}
                                            // dataTime={dataTime}
                                        />
                                    </div>
                                    <div className="content-right">
                                        <div className="doctor-shedule">
                                            <DoctorSchedule
                                                doctorIdFromParent={item}
                                            />
                                        </div>
                                        <div className="doctor-extra-infor">
                                            <DoctorExtraInfor
                                                doctorIdFromParent={item}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
