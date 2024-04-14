import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './AdditionalLinksSlider.css'; // 이 경로는 AdditionalLinksSlider.js 파일과 CSS 파일이 같은 디렉토리에 있다고 가정함


function AdditionalLinksSlider({ links }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  return (
    <div className="additional-links-slider" style={{ textAlign: 'center', padding: '20px' }}>
      <Slider {...settings}>
        {links.map(link => (
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

function App() {
  const sliderContents = [
    [
      { id: 1, href: "/articleLink1", src: "article_image1.png", alt: "Article Link 1" },
      { id: 2, href: "/articleLink2", src: "article_image2.jpg", alt: "Article Link 2" },
      { id: 3, href: "/articleLink3", src: "article_image3.jpg", alt: "Article Link 3" }
    ],
    [
      { id: 4, href: "/articleLink4", src: "article_image4.jpg", alt: "Article Link 4" },
      { id: 5, href: "/articleLink5", src: "article_image5.jpg", alt: "Article Link 5" },
      { id: 6, href: "/articleLink6", src: "article_image6.jpg", alt: "Article Link 6" }
    ],
    [
      { id: 7, href: "/articleLink7", src: "article_image7.jpg", alt: "Article Link 7" },
      { id: 8, href: "/articleLink8", src: "article_image8.jpg", alt: "Article Link 8" },
      { id: 9, href: "/articleLink9", src: "article_image9.jpg", alt: "Article Link 9" }
    ]
  ];

  return (
    <div className="App">
      {sliderContents.map((links, index) => (
        <AdditionalLinksSlider key={index} links={links} />
      ))}
    </div>
  );
}

export default App;
