import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Button, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import _ from "lodash";

class ModalEditUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            address: "",
        };
    }

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
    handleSaveUser = () => {
        let isValid = this.checkValidUser();
        if (isValid) {
            this.props.editUser(this.state);
        }
    };

    toggle = () => {
        this.props.toggleFormParent();
    };
    componentDidMount() {
        let user = this.props.currentUser;
        if (user && !_.isEmpty(user)) {
            this.setState({
                id: user.id,
                email: user.email,
                password: "hardcode",
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address,
            });
        }
    }

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
                    Edit User
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
                                disabled
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
                                disabled
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
                        onClick={() => this.handleSaveUser()}
                    >
                        Save Changes
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
