import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './_AdditionalLinkSlider.css';

function AdditionalLinksSlider({ links }) {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
    };

    return (
        <div className="additional-links-slider">
            <Slider {...settings}>
                {links.map((link) => (
                    <div key={link.id}>
                        <a href={link.href}>
                            <img src={link.src} alt={link.alt} className="link-image" />
                        </a>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default AdditionalLinksSlider;