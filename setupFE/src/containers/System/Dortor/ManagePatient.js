import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManagePatient.scss";
import { FormattedMessage } from "react-intl";
import DatePicker from "../../../components/Input/DatePicker";
import { getAllPatientForDoctor } from "../../../services/userService";
import moment from "moment";
import RemedyModal from "./RemedyModal";
import { postSendRemedy } from "../../../services/userService";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";

class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf("day").valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            dataModal: {},
            isLoading: false,
        };
    }

    async componentDidMount() {
        await this.getDataPatient();
    }

    getDataPatient = async () => {
        let { user } = this.props;
        let { currentDate } = this.state;
        let formatedDate = new Date(currentDate).getTime();
        let res = await getAllPatientForDoctor({
            doctorId: user.id,
            date: formatedDate,
        });
        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data,
            });
        }
    };

    componentDidUpdate(prevProps, prevState, snapShot) {}
    handleOnchangeDatePicker = (date) => {
        this.setState(
            {
                currentDate: date[0],
            },
            async () => {
                await this.getDataPatient();
            }
        );
    };
    handleBtnConfirm = (item) => {
        let data = {
            doctorId: item.doctorId,
            email: item.patientData.email,
            patientId: item.patientId,
            timeType: item.timeType,
            patientName: item.patientData.firstName,
        };
        this.setState({
            isOpenRemedyModal: true,
            dataModal: data,
        });
    };
    closeRemedyModal = () => {
        this.setState({
            dataModal: {},
            isOpenRemedyModal: false,
        });
    };
    sendRemedy = async (dataChild) => {
        let { dataModal } = this.state;
        this.setState({
            isLoading: true,
        });
        let res = await postSendRemedy({
            email: dataChild.email,
            imageBase64: dataChild.imageBase64,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            language: this.props.language,
            patientName: dataModal.patientName,
        });

        if (res && res.errCode === 0) {
            toast.success("Success!");
            this.setState({
                isOpenRemedyModal: false,
                isLoading: false,
            });
            await this.getDataPatient();
        } else {
            this.setState({
                isLoading: false,
            });
            toast.error("Error!");
        }
    };

    render() {
        let { dataPatient, isOpenRemedyModal, dataModal } = this.state;
        return (
            <LoadingOverlay
                active={this.state.isLoading}
                spinner
                text="Loading..."
            >
                <RemedyModal
                    isOpenModal={isOpenRemedyModal}
                    dataModal={dataModal}
                    closeRemedyModal={this.closeRemedyModal}
                    sendRemedy={this.sendRemedy}
                />
                <div className="manage-patient-container">
                    <div className="title">Quản lý bệnh nhân khám bệnh</div>
                    <div className="manage-patient-body row">
                        <div className="col-6 form-group">
                            <label>Chọn ngày khám</label>
                            <DatePicker
                                onChange={this.handleOnchangeDatePicker}
                                className="form-control"
                                value={this.state.currentDate}
                            />
                        </div>
                        <div className="col-12 table-manage-patient">
                            <table style={{ width: "100%" }}>
                                <tbody>
                                    <tr>
                                        <th>STT</th>
                                        <th>Thời gian</th>
                                        <th>Họ và tên</th>
                                        <th>Giới tính</th>
                                        <th>Địa chỉ</th>
                                        <th>Actions</th>
                                    </tr>
                                    {dataPatient && dataPatient.length > 0 ? (
                                        dataPatient.map((item, index) => {
                                            return (
                                                <tr key={item.id}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        {
                                                            item
                                                                .timeTypeDataPatient
                                                                .valueVi
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            item.patientData
                                                                .firstName
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            item.patientData
                                                                .genderData
                                                                .valueVi
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            item.patientData
                                                                .address
                                                        }
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn-confirm"
                                                            onClick={() =>
                                                                this.handleBtnConfirm(
                                                                    item
                                                                )
                                                            }
                                                        >
                                                            Xác nhận
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={6}>No data</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        user: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
