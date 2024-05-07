import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './HomePageWithLinksSlider.css';

function HomePageWithLinksSlider() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000
    };

    return (
        <div className="links-wrapper" style={{ textAlign: 'center' }}>
            <Slider {...settings}>
                <div>
                    <a href="/linkA">
                        <img src="image1.jpg" alt="첫번째" className="link-image" />
                    </a>
                </div>
                <div>
                    <a href="/linkB">
                        <img src="image2.jpg" alt="두번째" className="link-image" />
                    </a>
                </div>
            </Slider>
        </div>
    );
}

export default HomePageWithLinksSlider;