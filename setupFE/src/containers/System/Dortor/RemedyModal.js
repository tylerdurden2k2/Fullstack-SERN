import React, { Component } from "react";
import { connect } from "react-redux";
import "./RemedyModal.scss";
import { FormattedMessage } from "react-intl";
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from "reactstrap";
import _ from "lodash";
import { toast } from "react-toastify";
import { CommonUtils } from "../../../utils";

class RemedyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageBase64: "",
            email: "",
        };
    }

    async componentDidMount() {
        if (this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email,
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if (prevProps.dataModal !== this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email,
            });
        }
    }
    handleOnChangeEmail = (e) => {
        this.setState({
            email: e.target.value,
        });
    };
    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64,
            });
        }
    };
    handleSendRemedy = () => {
        this.props.sendRemedy(this.state);
    };
    render() {
        let { isOpenModal, dataModal, closeRemedyModal, sendRemedy } =
            this.props;
        return (
            <Modal
                isOpen={isOpenModal}
                className={"booking-modal-container"}
                centered={true}
                size="md"
            >
                <div className="modal-header">
                    <h5 className="modal-title">
                        Gửi hóa đơn bệnh thành công!
                    </h5>
                    <button
                        type="button"
                        className="close"
                        aria-label="Close"
                        onClick={closeRemedyModal}
                    >
                        <span aria-hidden="true">x</span>
                    </button>
                </div>
                <ModalBody>
                    <div className="row">
                        <div className="col-6 form-group">
                            <label>Email bệnh nhân</label>
                            <input
                                className="form-control"
                                type="email"
                                value={this.state.email}
                                onChange={(e) => this.handleOnChangeEmail(e)}
                            />
                        </div>
                        <div className="col-6 form-group">
                            <label>Chọn file đơn thuốc</label>
                            <input
                                className="form-control-file"
                                type="file"
                                onChange={(e) => this.handleOnChangeImage(e)}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        onClick={() => this.handleSendRemedy()}
                    >
                        Send
                    </Button>
                    <Button color="secondary" onClick={closeRemedyModal}>
                        Cancel
                    </Button>
                </ModalFooter>
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
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
