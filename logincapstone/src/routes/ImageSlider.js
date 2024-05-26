import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function HomePageWithLinksSlider() {
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000
    };

    return (
        <div className="links-wrapper">
            <Slider {...sliderSettings}>
                <div>
                    <Link to="#">
                        <img src="/image1.png" alt="첫번째" className="link-image" />
                    </Link>
                </div>
                <div>
                    <Link to="#">
                        <img src="/image2.png" alt="두번째" className="link-image" />
                    </Link>
                </div>
            </Slider>
        </div>
    );
}

export default HomePageWithLinksSlider;