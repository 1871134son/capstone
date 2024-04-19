import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function AdditionalLinksSlider() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3, // 이제 페이지 넘기기 버튼을 클릭할 때 3개의 슬라이드를 한 번에 넘길 수 있습니다.
    };

    return (
        <div className="additional-links-slider" style={{ textAlign: 'center', padding: '20px' }}>
            <Slider {...settings}>
                <div>
                    <a href="/extraLink1">
                        <img src="extra_image1.jpg" alt="Extra Link 1" className="link-image" />
                    </a>
                </div>
                <div>
                    <a href="/extraLink2">
                        <img src="extra_image2.jpg" alt="Extra Link 2" className="link-image" />
                    </a>
                </div>
                <div>
                    <a href="/extraLink3">
                        <img src="extra_image3.jpg" alt="Extra Link 3" className="link-image" />
                    </a>
                </div>
                {/* 이미지를 반복하여 다시 렌더링하여 총 6개의 슬라이드로 만듭니다. */}
                <div>
                    <a href="/extraLink1">
                        <img src="extra_image1.jpg" alt="Extra Link 1" className="link-image" />
                    </a>
                </div>
                <div>
                    <a href="/extraLink2">
                        <img src="extra_image2.jpg" alt="Extra Link 2" className="link-image" />
                    </a>
                </div>
                <div>
                    <a href="/extraLink3">
                        <img src="extra_image3.jpg" alt="Extra Link 3" className="link-image" />
                    </a>
                </div>
            </Slider>
        </div>
    );
}

export default AdditionalLinksSlider;
