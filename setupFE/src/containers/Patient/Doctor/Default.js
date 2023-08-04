import React, { Component } from "react";
import { connect } from "react-redux";
// import "./Default.scss";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";

class Default extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    componentDidUpdate(prevProps, prevState, snapShot) {}

    render() {
        return <div>Hello world</div>;
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

export default connect(mapStateToProps, mapDispatchToProps)(Default);
