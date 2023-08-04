import React, { Component } from "react";
import { connect } from "react-redux";
import "./TableManageUser.scss";
import * as actions from "../../../store/actions";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";

import "react-markdown-editor-lite/lib/index.css";

const mdParser = new MarkdownIt();

function handleEditorChange({ html, text }) {
    console.log("handleEditorChange: ", html, text);
}

class TableManageUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userRedux: [],
        };
    }

    componentDidMount() {
        this.props.fetchUserRedux();
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({
                userRedux: this.props.listUsers,
            });
        }
    }

    handleDeleteUser = (user) => {
        this.props.deleteAUserRedux(user.id);
    };

    handleEditUser = (user) => {
        this.props.handleEditUserFromParentKey(user);
    };

    render() {
        let arrUsers = this.state.userRedux;
        return (
            <React.Fragment>
                <table className="table-manage-user">
                    <tbody>
                        <tr>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                        {arrUsers &&
                            arrUsers.length > 0 &&
                            arrUsers.map((user, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{user.email}</td>
                                        <td>{user.firstName}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.address}</td>
                                        <td>
                                            <button className="btn-edit">
                                                <i
                                                    className="fas fa-pencil-alt"
                                                    onClick={() =>
                                                        this.handleEditUser(
                                                            user
                                                        )
                                                    }
                                                ></i>
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => {
                                                    this.handleDeleteUser(user);
                                                }}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
                <MdEditor
                    style={{ height: "500px" }}
                    renderHTML={(text) => mdParser.render(text)}
                    onChange={handleEditorChange}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        listUsers: state.admin.users,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserRedux: () => {
            dispatch(actions.fetchAllUsersStart());
        },
        deleteAUserRedux: (userId) => {
            dispatch(actions.deleteAUser(userId));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
