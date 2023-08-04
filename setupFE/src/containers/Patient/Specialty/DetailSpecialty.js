import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailSpecialty.scss";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import HomeHeader from "../../HomePage/HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import {
    getAllDetailSpecialtyById,
    getAllCodeService,
} from "../../../services/userService";
import _ from "lodash";

class DetailSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailSpecialty: {},
            listProvince: [],
            isShow: false,
        };
    }

    async componentDidMount() {
        if (
            this.props.match &&
            this.props.match.params &&
            this.props.match.params &&
            this.props.match.params.id
        ) {
            let id = this.props.match.params.id;
            let res = await getAllDetailSpecialtyById({
                id: id,
                location: "ALL",
            });
            let resProvince = await getAllCodeService("PROVINCE");
            if (
                res &&
                res.errCode === 0 &&
                resProvince &&
                resProvince.errCode === 0
            ) {
                let data = res.data;
                let arrDoctorId = [];
                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map((item) => {
                            arrDoctorId.push(item.doctorId);
                        });
                    }
                }
                let dataProvince = resProvince.data;
                if (dataProvince && dataProvince.length > 0) {
                    dataProvince.unshift({
                        createdAt: null,
                        updatedAt: null,
                        keyMap: "ALL",
                        type: "PROVINCE",
                        valueEn: "All",
                        valueVi: "Toàn quốc",
                    });
                }
                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: arrDoctorId,
                    listProvince: dataProvince,
                });
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapShot) {}

    handleOnChangeSelectProvince = async (e) => {
        if (
            this.props.match &&
            this.props.match.params &&
            this.props.match.params &&
            this.props.match.params.id
        ) {
            let id = this.props.match.params.id;
            let location = e.target.value;
            let res = await getAllDetailSpecialtyById({
                id: id,
                location: location,
            });

            console.log("check res: ", res);
            if (res && res.errCode === 0) {
                let data = res.data;
                let arrDoctorId = [];
                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map((item) => {
                            arrDoctorId.push(item.doctorId);
                        });
                    }
                }
                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: arrDoctorId,
                });
            }
        }
    };
    handleShowHide = () => {
        this.setState({
            isShow: !this.state.isShow,
        });
    };
    render() {
        let { language } = this.props;
        let { arrDoctorId, dataDetailSpecialty, listProvince, isShow } =
            this.state;
        return (
            <>
                <HomeHeader />

                <div className="detail-specialty-container">
                    <div
                        className={
                            isShow
                                ? "description-specialty active"
                                : "description-specialty"
                        }
                    >
                        {dataDetailSpecialty &&
                            !_.isEmpty(dataDetailSpecialty) && (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: dataDetailSpecialty.descriptionHTML,
                                    }}
                                ></div>
                            )}
                    </div>
                    <div
                        className="show-hide-btn"
                        onClick={() => this.handleShowHide()}
                    >
                        {isShow ? "Hide" : "Show"}
                    </div>
                    <div className="search-province">
                        <select
                            onChange={(e) =>
                                this.handleOnChangeSelectProvince(e)
                            }
                        >
                            {listProvince &&
                                listProvince.length > 0 &&
                                listProvince.map((item, index) => {
                                    return (
                                        <option key={index} value={item.keyMap}>
                                            {language === LANGUAGES.VI
                                                ? item.valueVi
                                                : item.valueEn}
                                        </option>
                                    );
                                })}
                        </select>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
