import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { DisplayImage } from "../firebase/firebase";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './HomePageWithLinksSlider.css';

function HomePageWithLinksSlider() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

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
        <div className={`color ${isScrolled ? 'scrolled' : ''}`}>
            <div className="slider-container">
                <Slider {...settings}>
                    <div>
                        <a href="https://www.wevity.com/index_university.php?c=find&s=_university&gbn=viewok&gp=3&ix=85945" target="_blank" className="slider-link">
                            <DisplayImage folderName="promotions" fileName="promotions2.jpg" />
                        </a>
                    </div>
                    <div>
                        <a href="https://www.wevity.com/index_university.php?c=find&s=_university&gbn=viewok&gp=7&ix=87256" target="_blank" className="slider-link">
                            <DisplayImage folderName="promotions" fileName="promotions3.jpg" />
                        </a>
                    </div>
                    <div>
                        <a href="https://linkareer.com/activity/124196" target="_blank" className="slider-link">
                            <DisplayImage folderName="promotions" fileName="promotions4.jpg" />
                        </a>
                    </div>
                </Slider>
            </div>
        </div>
    );
}

export default HomePageWithLinksSlider;