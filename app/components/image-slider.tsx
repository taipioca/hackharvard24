import React from "react";
import Slider from "react-slick";
import { Compare } from "@/components/ui/compare";
import honoluluBefore from "../public/honolulu_before.png";
import honoluluAfter from "../public/honolulu_after.png";
import chicagoBefore from "../public/chicago_2001.png";
import chicagoAfter from "../public/chicago_2023.png";
import irvineBefore from "../public/irvine_before.png";
import irvineAfter from "../public/irvine_after.png";
import miamiBefore from "../public/miami_2019.png";
import miamiAfter from "../public/miami_2024.png";
import phoenixBefore from "../public/phoenix_2003.png";
import phoenixAfter from "../public/phoenix_2023.png";
import saltBefore from "../public/saltlakecity_2003.png";
import saltAfter from "../public/saltlakecity_2024.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom arrow components
function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        right: "60px", // Adjust the right position
        zIndex: 1, // Ensure it stays on top of the content
      }}
      onClick={onClick}
    />
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        left: "-20px", // Adjust the left position
        zIndex: 1, // Ensure it stays on top of the content
      }}
      onClick={onClick}
    />
  );
}

export function CompareDemo() {
  // Array of cities with their corresponding images
  const cities = [
    { name: "Honolulu", before: honoluluBefore.src, after: honoluluAfter.src },
    { name: "Chicago", before: chicagoBefore.src, after: chicagoAfter.src },
    { name: "Irvine", before: irvineBefore.src, after: irvineAfter.src },
    { name: "Miami", before: miamiBefore.src, after: miamiAfter.src },
    { name: "Phoenix", before: phoenixBefore.src, after: phoenixAfter.src },
    { name: "Salt Lake City", before: saltBefore.src, after: saltAfter.src },
  ];

  // Slider settings with custom arrows
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />, // Custom next arrow
    prevArrow: <PrevArrow />, // Custom previous arrow
  };

  return (
    <div>
      <Slider {...settings}>
        {cities.map((city, index) => (
          <div key={index}>
            <div className="p-4 rounded-3xl px-4">
              <Compare
                firstImage={city.before}
                secondImage={city.after}
                firstImageClassName="object-cover object-left-top"
                secondImageClassname="object-cover object-left-top"
                className="h-[250px] w-[200px] md:h-[500px] md:w-[500px]"
                slideMode="hover"
              />
            </div>
            <div className="text-center italic">
              <p>Development in {city.name}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
