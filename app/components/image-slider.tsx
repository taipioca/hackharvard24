import React from "react";
import { Compare } from "@/components/ui/compare";
import honoluluBefore from "../public/honolulu_before.png";
import honoluluAfter from "../public/honolulu_after.png";

export function CompareDemo() {
  return (
    <div>
      <div className="p-4 rounded-3xl px-4">
        <Compare
          firstImage={honoluluBefore.src}
          secondImage={honoluluAfter.src}
          firstImageClassName="object-cover object-left-top"
          secondImageClassname="object-cover object-left-top"
          className="h-[250px] w-[200px] md:h-[500px] md:w-[500px]"
          slideMode="hover"
        />
      </div>
      <div className="text-center italic">
        <p>Honolulu, HI from 2020 to 2023</p>
      </div>
    </div>
  );
}
