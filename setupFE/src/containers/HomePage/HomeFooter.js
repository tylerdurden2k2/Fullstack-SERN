import React, { Component } from "react";
import { connect } from "react-redux";
// import { FormattedMessage } from "react-intl";

class HomeFooter extends Component {
    render() {
        return (
            <div className="home-footer">
                <p>
                    &copy; 15/11/2022 Quang Huy{" "}
                    <a href="#">&#8594;Click here&#8592;</a> for more
                    information
                </p>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
