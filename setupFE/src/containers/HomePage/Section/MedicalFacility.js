import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";
import { getAllClinic } from "../../../services/userService";
import { withRouter } from "react-router-dom";

class MedicalFacility extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataClinics: [],
        };
    }
    async componentDidMount() {
        let res = await getAllClinic();
        if (res && res.errCode === 0) {
            this.setState({
                dataClinics: res.data ? res.data : [],
            });
        }
    }

    handleViewDetailClinic = (clinic) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${clinic.id}`);
        }
        console.log("check item: ", clinic);
    };
    render() {
        let { dataClinics } = this.state;
        console.log("check dataClinics: ", dataClinics);
        return (
            <div className="section-share section-medical-facility">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section">
                            Cơ sở y tế nổi bật
                        </span>
                        <button className="btn-section">Tìm kiếm</button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            {dataClinics &&
                                dataClinics.length > 0 &&
                                dataClinics.map((item) => {
                                    return (
                                        <div
                                            key={item.id}
                                            className="section-customize"
                                            onClick={() =>
                                                this.handleViewDetailClinic(
                                                    item
                                                )
                                            }
                                        >
                                            <div
                                                style={{
                                                    backgroundImage: `url(${item.image})`,
                                                }}
                                                className="bg-image section-medical-facility-img"
                                            ></div>
                                            <div className="medical-name">
                                                {item.name}
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(MedicalFacility)
);
