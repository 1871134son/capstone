import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

<<<<<<< HEAD
function AdditionalLinksSlider({ links }) {
=======
function AdditionalLinksSlider() {
>>>>>>> bb5234fb88c4011411b1a3f8542fcf5418f7898f
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
<<<<<<< HEAD
        slidesToScroll: 1,
=======
        slidesToScroll: 3, // 이제 페이지 넘기기 버튼을 클릭할 때 3개의 슬라이드를 한 번에 넘길 수 있습니다.
>>>>>>> bb5234fb88c4011411b1a3f8542fcf5418f7898f
    };

    return (
        <div className="additional-links-slider" style={{ textAlign: 'center', padding: '20px' }}>
            <Slider {...settings}>
<<<<<<< HEAD
                {links.map(link => (
                    <div key={link.id}>
                        <a href={link.href}>
                            <img src={link.src} alt={link.alt} className="link-image" />
                        </a>
                    </div>
                ))}
=======
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
>>>>>>> bb5234fb88c4011411b1a3f8542fcf5418f7898f
            </Slider>
        </div>
    );
}

<<<<<<< HEAD
function App() {
    const sliderContents = [
        [
            { id: 1, href: "/articleLink1", src: "article_image1.jpg", alt: "Article Link 1" },
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
=======
export default AdditionalLinksSlider;
>>>>>>> bb5234fb88c4011411b1a3f8542fcf5418f7898f
