import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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
    <div className="links-wrapper">
      <Slider {...settings}>
        <div>
          <LinkContainer to="/linkA">
            <img src="image_1.jpg" alt="첫번째" className="link-image" />
          </LinkContainer>
        </div>
        <div>
          <LinkContainer to="/linkB">
            <img src="image_2.jpg" alt="두번째" className="link-image" />
          </LinkContainer>
        </div>
        <div>
          <LinkContainer to="/linkC">
            <img src="image_3.jpg" alt="세번째" className="link-image" />
          </LinkContainer>
        </div>
        <div>
          <LinkContainer to="/linkD">
            <img src="image_4.jpg" alt="네번째" className="link-image" />
          </LinkContainer>
        </div>
      </Slider>
    </div>
  );
}

function ImageSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000 // 3초마다 자동으로 슬라이드 전환
  };

  return (
    <div className="links-wrapper">
      <Slider {...settings}>
        <div>
          <LinkContainer to="/linkA">
            <img src="linkA_image.jpg" alt="Link A" className="link-image" />
          </LinkContainer>
        </div>
        <div>
          <LinkContainer to="/linkB">
            <img src="linkB_image.jpg" alt="Link B" className="link-image" />
          </LinkContainer>
        </div>
        <div>
          <LinkContainer to="/linkC">
            <img src="linkC_image.jpg" alt="Link C" className="link-image" />
          </LinkContainer>
        </div>
        <div>
          <LinkContainer to="/linkD">
            <img src="linkD_image.jpg" alt="Link D" className="link-image" />
          </LinkContainer>
        </div>
      </Slider>
    </div>
  );
}

function LinkContainer({ to, children }) {
  return <Link to={to} className="link-container">{children}</Link>;
}

export { HomePageWithLinksSlider, ImageSlider };