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
        <div className="links-wrapper" style={{ textAlign: 'center' }}>
            <Slider {...settings}>
                <div>
                    <a href="/linkA">
                    <DisplayImage folderName ="promotions" fileName="promotions1.jpg"></DisplayImage>
                    </a>
                </div>
                <div>
                    <a href="/linkB">
                    <DisplayImage folderName ="promotions" fileName="promotions2.jpg"></DisplayImage>
                    </a>
                </div>
                <div>
                    <a href="/linkC">
                    <DisplayImage folderName ="promotions" fileName="promotions5.jpg"></DisplayImage>
                    </a>
                </div>
                <div>
                    <a href="/linkD">
                    <DisplayImage folderName ="promotions" fileName="promotions4.jpg"></DisplayImage>
                    </a>
                </div>
            </Slider>
        </div>
    );
}

export default HomePageWithLinksSlider;