import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Button, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { emitter } from "../../utils/emitter";

class ModalUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            address: "",
        };
        this.listenToEmitter();
    }

    listenToEmitter() {
        emitter.on("EVENT_CLEAR_MODAL_DATA", () => {
            //reset state
            this.setState({
                email: "",
                password: "",
                firstName: "",
                lastName: "",
                address: "",
            });
        });
    }

    componentDidMount() {}

    handleOnChangeInput = (e, field) => {
        let copyState = { ...this.state };
        copyState[field] = e.target.value;
        this.setState({
            ...copyState,
        });
    };

    checkValidUser = () => {
        let isValid = true;
        let arrInput = [
            "email",
            "password",
            "firstName",
            "lastName",
            "address",
        ];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                alert("Missing parameters: " + arrInput[i]);
                break;
            }
        }
        return isValid;
    };
    handleAddNewUser = () => {
        let isValid = this.checkValidUser();
        if (isValid) {
            this.props.createNewuser(this.state);
        }
    };

    toggle = () => {
        this.props.toggleFormParent();
    };
    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={() => this.toggle()}
                className={"moal-user-container"}
                size="lg"
                centered
            >
                <ModalHeader toggle={() => this.toggle()}>
                    Create New User
                </ModalHeader>
                <ModalBody>
                    <div className="modal-user-body">
                        <div className="input-container">
                            <label>Email</label>
                            <input
                                type="email"
                                onChange={(e) =>
                                    this.handleOnChangeInput(e, "email")
                                }
                                value={this.state.email}
                            ></input>
                        </div>
                        <div className="input-container">
                            <label>Password</label>
                            <input
                                type="password"
                                onChange={(e) =>
                                    this.handleOnChangeInput(e, "password")
                                }
                                value={this.state.password}
                            ></input>
                        </div>
                        <div className="input-container">
                            <label>First Name</label>
                            <input
                                type="text"
                                onChange={(e) =>
                                    this.handleOnChangeInput(e, "firstName")
                                }
                                value={this.state.firstName}
                            ></input>
                        </div>
                        <div className="input-container">
                            <label>Last Name</label>
                            <input
                                type="text"
                                onChange={(e) =>
                                    this.handleOnChangeInput(e, "lastName")
                                }
                                value={this.state.lastName}
                            ></input>
                        </div>
                        <div className="input-container max-width-input">
                            <label>Address</label>
                            <input
                                type="text"
                                onChange={(e) =>
                                    this.handleOnChangeInput(e, "address")
                                }
                                value={this.state.address}
                            ></input>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        className="px-3"
                        onClick={() => this.handleAddNewUser()}
                    >
                        Add New
                    </Button>
                    <Button
                        color="secondary"
                        className="px-3"
                        onClick={() => this.toggle()}
                    >
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
