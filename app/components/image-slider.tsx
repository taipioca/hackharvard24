import React, { useState, useEffect } from "react";
import { Compare } from "@/components/ui/compare";
import honoluluBefore from "../public/honolulu_before.png";
import honoluluAfter from "../public/honolulu_after.png";
import chicagoBefore from "../public/chicago_2001.png";
import chicagoAfter from "../public/chicago_2023.png";
import irvineBefore from "../public/irvine_before.png";
import irvineAfter from "../public/irvine_after.png";
import miamiBefore from "../public/miami_2019.png";
import miamiAfter from "../public/miami_2024.png";

export function CompareDemo() {
  // Array of cities with their corresponding images
  const cities = [
    { name: "Honolulu", before: honoluluBefore.src, after: honoluluAfter.src },
    { name: "Chicago", before: chicagoBefore.src, after: chicagoAfter.src },
    { name: "Irvine", before: irvineBefore.src, after: irvineAfter.src },
    { name: "Miami", before: miamiBefore.src, after: miamiAfter.src },
  ];

  // Randomly select a city on component mount
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    setSelectedCity(randomCity);
  }, []);

  if (!selectedCity) return null; // Prevent rendering until city is selected

  return (
    <div>
      <div className="p-4 rounded-3xl px-4">
        <Compare
          firstImage={selectedCity.before}
          secondImage={selectedCity.after}
          firstImageClassName="object-cover object-left-top"
          secondImageClassname="object-cover object-left-top"
          className="h-[250px] w-[200px] md:h-[500px] md:w-[500px]"
          slideMode="hover"
        />
      </div>
      <div className="text-center italic">
        <p>Development in {selectedCity.name}</p>
      </div>
    </div>
  );
}
