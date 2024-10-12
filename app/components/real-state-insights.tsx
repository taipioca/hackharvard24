import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const RealStateInsights = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Our Suggestion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto font-bold">Buy this property </div>
        <div>Why we say that?</div>
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit
          animi accusamus iste excepturi dolor error natus culpa aspernatur iure
          quo. Animi facilis cumque officiis voluptate in sit nostrum
          dignissimos similique?
        </div>
      </CardContent>
    </Card>
  );
};

export default RealStateInsights;
