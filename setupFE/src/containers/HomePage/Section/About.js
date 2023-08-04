import React, { Component } from "react";
import { connect } from "react-redux";
// import { FormattedMessage } from "react-intl";

class About extends Component {
    render() {
        return (
            <div className="section-share section-about">
                <div className="section-about-header">
                    Truyền thông nói về Quang Huy
                </div>
                <div className="section-about-content">
                    <div className="content-left">
                        <iframe
                            width="100%"
                            height="400px"
                            src="https://www.youtube.com/embed/M9wWc2EKxX8?list=RDM9wWc2EKxX8"
                            title="[ Vietsub + Lyric ] Hayd - Head In The Clouds"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                    <div className="content-right">
                        <p>
                            Điểm đặc biệt ở những bài hát của Hayd là giai điệu
                            ngọt ngào, tươi sáng cùng lời nhạc khá bắt tay và
                            hợp thị hiếu của giới trẻ. Mùa hè năm 2022, ca sĩ
                            sinh năm 2001 này đã trở thành 1 ngôi sao vụt sáng
                            sau khi phát hành bài hát Head In The Clouds. Những
                            lời gửi gắm của chàng trai trẻ về tâm hồn trên mây
                            đã chiếm được cảm tình của giới trẻ Việt Nam dù
                            không mấy ai biết đến danh tính thật sự của anh.
                            Head In The Clouds đã nhanh chóng ngự trị trên top
                            đầu của các bảng xếp hạng ca khúc viral nhất tại
                            Việt Nam. Thậm chí, trên ứng dụng nghe nhạc trực
                            tuyến Spotify, bài hát còn vượt mặt cả những sản
                            phẩm made in Vietnam như Hẹn Ước từ Hư Vô hay Muộn
                            Rồi Mà Sao Còn.{" "}
                        </p>
                    </div>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
