import Image from "next/image";
import LeAnnPic from "/public/LeAnn.jpg";
import JosiePic from "/public/Josie.jpg";
import PiyusshPic from "/public/sp.jpg";
import ChaiPic from "/public/Chai.jpg";

export default function Component() {
  const teamMembers = [
    { name: "Chai", caption: "ASU, 2025", image: ChaiPic },
    { name: "Josie", caption: "MIT, 2027", image: JosiePic },
    { name: "LeAnn", caption: "MIT, 2027", image: LeAnnPic },
    { name: "Piyussh", caption: "ASU, 2025", image: PiyusshPic },
  ];

  return (
    <div className="min-h-screen w-full bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <h2
        className="text-5xl font-bold text-center mb-12 text-white" // Increased margin bottom
        style={{
          background: "linear-gradient(to right, #0EB5E6 40%, #bc64cd 60%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Our Team
      </h2>
      <div className="flex flex-nowrap justify-center max-w-5xl mx-auto overflow-x-auto">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="flex flex-col items-center w-64 mx-4" // Adjusted width to ensure spacing
          >
            <div className="relative w-full h-80 mb-4">
              <Image
                src={member.image}
                alt={member.name}
                layout="fill"
                objectFit="cover"
                className="rounded-lg" // Added rounded corners
              />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2 text-center">
              {member.name}
            </h3>
            <p className="text-lg text-gray-300 text-center">
              {member.caption}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
