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
            <hr></hr>
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
                            <DisplayImage folderName="promotions" fileName="promotions3.jpg" />
                        </a>
                    </div>
                    <div>
                        <a href="/linkD" className="slider-link">
                            <DisplayImage folderName="promotions" fileName="promotions4.jpg" />
                        </a>
                    </div>
                </Slider>
            </div>
        </div>
    );
}

export default HomePageWithLinksSlider;