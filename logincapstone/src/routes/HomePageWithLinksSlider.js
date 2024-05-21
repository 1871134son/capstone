import React from 'react';
import Slider from 'react-slick';
import { DisplayImage } from "../firebase/firebase"; //firebase.js 에서 import 
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
        <div className="slider-container">
            <Slider {...settings}>
                <div>
                    <a href="/linkA" className="slider-link">
                        <DisplayImage folderName="promotions" fileName="promotions1.jpg" className="slider-image" />
                    </a>
                </div>
                <div>
                    <a href="/linkB" className="slider-link">
                        <DisplayImage folderName="promotions" fileName="promotions2.jpg" />
                    </a>
                </div>
                <div>
                    <a href="/linkC" className="slider-link">
                        <DisplayImage folderName="promotions" fileName="promotions.jpg" />
                    </a>
                </div>
                <div>
                    <a href="/linkD" className="slider-link">
                        <DisplayImage folderName="promotions" fileName="promotions4.jpg" />
                    </a>
                </div>
            </Slider>
        </div>
    );
}

export default HomePageWithLinksSlider;
