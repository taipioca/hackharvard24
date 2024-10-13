"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { Slider } from "@/app/components/ui/slider";
import { Input } from "@/app/components/ui/input";
import LineChart from "@/app/components/charts/line-chart";
import axios from "axios";
import RealEstateMap from "@/app/components/real-estate-map";
import RealStateInsights from "@/app/components/real-state-insights";
import { ModeToggle } from "@/app/components/ui/toggle";
import { HomeIcon, Send, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { CompareDemo } from "@/app/components/image-slider";
import { Router } from "next/router";
import { RealEstateAiCard } from "@/app/components/real-estate-ai-card";
import usa from "./usa.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// City positions
const cityPositions: { [key: string]: [number, number, number] } = {
  "Akron, OH": [1.2, 0.6, 0],
  "Albany, NY": [2.6, 1.4, 0],
  "Albuquerque, NM": [-1.6, -0.3, 0],
  "Allentown, PA": [2.4, 1.0, 0],
  "Asheville, NC": [1.6, -0.7, 0],
  "Atlanta, GA": [1.5, -0.8, 0],
  "Augusta, GA": [1.7, -0.9, 0],
  "Austin, TX": [-0.2, -0.8, 0],
  "Bakersfield, CA": [-2.4, 0.3, 0],
  "Baltimore, MD": [2.5, 0.7, 0],
  "Barnstable Town, MA": [2.7, 1.6, 0],
  "Baton Rouge, LA": [0.5, -1.2, 0],
  "Birmingham, AL": [1.2, -1.0, 0],
  "Boise City, ID": [-2.1, 1.3, 0],
  "Boston, MA": [2.7, 1.5, 0],
  "Boulder, CO": [-1.0, 0.7, 0],
  "Bremerton, WA": [-2.3, 1.8, 0],
  "Bridgeport, CT": [2.6, 1.4, 0],
  "Buffalo, NY": [2.1, 1.1, 0],
  "Canton, OH": [1.3, 0.6, 0],
  "Cape Coral, FL": [2.2, -1.5, 0],
  "Cedar Rapids, IA": [0.4, 0.7, 0],
  "Charleston, SC": [1.7, -1.2, 0],
  "Charlotte, NC": [1.7, -0.9, 0],
  "Chattanooga, TN": [1.4, -0.8, 0],
  "Chicago, IL": [0.5, 1, 0],
  "Cincinnati, OH": [1.2, 0.4, 0],
  "Clarksville, TN": [1.1, -0.5, 0],
  "Cleveland, OH": [1.2, 0.7, 0],
  "Colorado Springs, CO": [-1.1, 0.6, 0],
  "Columbia, SC": [1.7, -1.1, 0],
  "Columbus, OH": [1.3, 0.4, 0],
  "Corpus Christi, TX": [-0.3, -1.2, 0],
  "Crestview, FL": [2.0, -1.3, 0],
  "Dallas, TX": [-0.2, -0.5, 0],
  "Davenport, IA": [0.4, 0.6, 0],
  "Dayton, OH": [1.2, 0.5, 0],
  "Deltona, FL": [2.1, -1.4, 0],
  "Denver, CO": [-1.0, 0.5, 0],
  "Des Moines, IA": [0.4, 0.8, 0],
  "Detroit, MI": [1.2, 0.9, 0],
  "Duluth, MN": [0, 1.4, 0],
  "Durham, NC": [1.8, -0.8, 0],
  "El Paso, TX": [-1.4, -0.7, 0],
  "Eugene, OR": [-2.4, 1.5, 0],
  "Fayetteville, AR": [0.5, -0.7, 0],
  "Fayetteville, NC": [1.8, -1.1, 0],
  "Flint, MI": [1.2, 1.0, 0],
  "Fort Collins, CO": [-1.0, 0.6, 0],
  "Fresno, CA": [-2.4, 0.1, 0],
  "Grand Rapids, MI": [1.1, 1.1, 0],
  "Greeley, CO": [-1.0, 0.7, 0],
  "Greensboro, NC": [1.8, -0.7, 0],
  "Greenville, SC": [1.6, -0.9, 0],
  "Harrisburg, PA": [2.4, 1.0, 0],
  "Hartford, CT": [2.6, 1.3, 0],
  "Hickory, NC": [1.7, -0.8, 0],
  "Houston, TX": [0, -0.8, 0],
  "Indianapolis, IN": [0.8, 0.7, 0],
  "Jacksonville, FL": [2.0, -1.2, 0],
  "Kansas City, MO": [0.3, 0.1, 0],
  "Killeen, TX": [-0.3, -0.9, 0],
  "Knoxville, TN": [1.4, -0.6, 0],
  "Lakeland, FL": [2.1, -1.3, 0],
  "Lancaster, PA": [2.4, 1.1, 0],
  "Lansing, MI": [1.1, 1.0, 0],
  "Las Vegas, NV": [-2.0, 0.3, 0],
  "Lexington, KY": [1.2, 0.1, 0],
  "Little Rock, AR": [0.3, -0.6, 0],
  "Los Angeles, CA": [-2.5, 0.2, 0],
  "Louisville, KY": [1.1, 0, 0],
  "Lubbock, TX": [-0.5, -0.8, 0],
  "Madison, WI": [0.6, 1.2, 0],
  "Memphis, TN": [0.5, -0.7, 0],
  "Miami, FL": [2, -1.5, 0],
  "Milwaukee, WI": [0.6, 1.1, 0],
  "Minneapolis, MN": [0, 1.4, 0],
  "Modesto, CA": [-2.4, 0.3, 0],
  "Myrtle Beach, SC": [1.9, -1.3, 0],
  "Naples, FL": [2.2, -1.5, 0],
  "Nashville, TN": [1.1, -0.5, 0],
  "New Haven, CT": [2.6, 1.4, 0],
  "New York, NY": [2.5, 1.2, 0],
  "North Port, FL": [2.1, -1.5, 0],
  "Ogden, UT": [-1.9, 0.9, 0],
  "Oklahoma City, OK": [0.5, -0.5, 0],
  "Omaha, NE": [0.8, 0.4, 0],
  "Orlando, FL": [2.0, -1.3, 0],
  "Oxnard, CA": [-2.4, 0.2, 0],
  "Palm Bay, FL": [2.1, -1.4, 0],
  "Pensacola, FL": [1.5, -1.2, 0],
  "Peoria, IL": [0.5, 0.7, 0],
  "Philadelphia, PA": [2.4, 1.1, 0],
  "Phoenix, AZ": [-1.5, 0, 0],
  "Pittsburgh, PA": [2.1, 1.0, 0],
  "Port St. Lucie, FL": [2.1, -1.5, 0],
  "Portland, ME": [2.7, 1.7, 0],
  "Portland, OR": [-2.3, 1.7, 0],
  "Prescott Valley, AZ": [-1.7, 0.2, 0],
  "Providence, RI": [2.7, 1.6, 0],
  "Provo, UT": [-1.8, 0.8, 0],
  "Punta Gorda, FL": [2.2, -1.6, 0],
  "Raleigh, NC": [1.8, -0.8, 0],
  "Reading, PA": [2.4, 1.0, 0],
  "Reno, NV": [-2.1, 0.6, 0],
  "Richmond, VA": [2.1, 0.8, 0],
  "Riverside, CA": [-2.4, 0.1, 0],
  "Rochester, NY": [2.4, 1.2, 0],
  "Rockford, IL": [0.6, 1.0, 0],
  "Sacramento, CA": [-2.4, 0.8, 0],
  "Salisbury, MD": [2.5, 0.6, 0],
  "Salt Lake City, UT": [-1.9, 0.7, 0],
  "San Antonio, TX": [-0.5, -1.0, 0],
  "San Diego, CA": [-2.3, -0.2, 0],
  "San Francisco, CA": [-2.5, 0.6, 0],
  "San Jose, CA": [-2.4, 0.5, 0],
  "San Luis Obispo, CA": [-2.4, 0.4, 0],
  "Santa Maria, CA": [-2.3, 0.3, 0],
  "Santa Rosa, CA": [-2.4, 0.6, 0],
  "Savannah, GA": [1.8, -1.1, 0],
  "Scranton, PA": [2.4, 1.1, 0],
  "Seattle, WA": [-2.3, 1.8, 0],
  "Sebastian, FL": [2.1, -1.5, 0],
  "Spokane, WA": [-2.2, 1.7, 0],
  "Springfield, MA": [2.6, 1.5, 0],
  "Springfield, MO": [0.3, 0.3, 0],
  "St. Louis, MO": [0.3, 0.5, 0],
  "Stockton, CA": [-2.4, 0.4, 0],
  "Tallahassee, FL": [1.9, -1.3, 0],
  "Tampa, FL": [2.0, -1.4, 0],
  "Toledo, OH": [1.1, 0.6, 0],
  "Trenton, NJ": [2.5, 1.1, 0],
  "Tucson, AZ": [-1.6, -0.2, 0],
  "Tulsa, OK": [0.5, -0.5, 0],
  "Urban Honolulu, HI": [-4.5, -2.5, 0], // Off mainland USA
  "Virginia Beach, VA": [2.2, 0.7, 0],
  "Visalia, CA": [-2.4, 0.2, 0],
  "Washington, DC": [2.3, 0.8, 0],
  "Winston, NC": [1.7, -0.8, 0],
  "Worcester, MA": [2.6, 1.4, 0],
  "York, PA": [2.4, 1.0, 0],
};

const citiesToLabel = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Urban Honolulu, HI",
  "San Francisco, CA",
  "Philadelphia, PA",
  "Boston, MA",
  "Baltimore, MD",
  "Miami, FL",
];

export default function RealEstateMapComponent() {
  const searchParams = useSearchParams();
  const city = searchParams.get("city");
  console.log(city?.toString());
  const router = useRouter();

  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedCity, setSelectedCity] = useState<{
    name: string;
    price: number;
    position: THREE.Vector3;
  } | null>(null);

  const [currentYear, setCurrentYear] = useState(2008);
  const spheresRef = useRef<{ [key: string]: THREE.Mesh }>({});
  const [realEstateData, setRealEstateData] = useState<{
    [key: string]: { [key: string]: number };
  }>({});
  const [clickedCity, setClickedCity] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/dump_data");
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return {};
    }
  };

  const initData = async () => {
    const data = await fetchData();
    setRealEstateData(data);
  };

  useEffect(() => {
    initData();
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    mountRef.current.appendChild(renderer.domElement);

    // Label renderer setup
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0px";
    mountRef.current.appendChild(labelRenderer.domElement);

    // Controls setup
    const controls = new OrbitControls(camera, labelRenderer.domElement);
    controls.enableDamping = true;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Create nodes (cities)
    const minSize = 0.05;
    const maxSize = 0.15;

    const cityMeshes: { [key: string]: THREE.Mesh } = {};
    Object.entries(cityPositions).forEach(([cityName, position]) => {
      const geometry = new THREE.SphereGeometry(minSize, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.5,
        roughness: 0.1,
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(...position);
      scene.add(sphere);
      cityMeshes[cityName] = sphere;
      spheresRef.current[cityName] = sphere;

      // Add label only for specified cities
      if (citiesToLabel.includes(cityName)) {
        const cityDiv = document.createElement("div");
        cityDiv.className = "label";
        cityDiv.textContent = cityName;
        cityDiv.style.color =
          localStorage.getItem("theme") === "dark" ? "white" : "white";
        cityDiv.style.fontSize = "12px";
        const cityLabel = new CSS2DObject(cityDiv);
        cityLabel.position.set(0, 0, 0);
        sphere.add(cityLabel);
      }

      // Add hover effect
      sphere.userData = { name: cityName };
    });

    // // Create migration edges
    // migrations.forEach(({ from, to }) => {
    //   const start = cityMeshes[from]?.position;
    //   const end = cityMeshes[to]?.position;

    //   if (start && end) {
    //     const points = [];
    //     points.push(start.clone());
    //     points.push(end.clone());

    //     const geometry = new THREE.BufferGeometry().setFromPoints(points);
    //     const lineMaterial = new THREE.LineBasicMaterial({ color: 0xd3d3d3, transparent: true, opacity: 0.2 }); // Red color for migration lines
    //     const line = new THREE.Line(geometry, lineMaterial);
    //     scene.add(line);
    //   }
    // });

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(usa.src, (texture) => {
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
      });
      const geometry = new THREE.PlaneGeometry(6.8, 4.1); // Adjust size as needed
      const usaMap = new THREE.Mesh(geometry, material);
      usaMap.position.set(0.08, 0.2, -0.1); // Adjust position as needed
      scene.add(usaMap);
    });

    camera.position.z = 3;

    // Raycaster for hover effect
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.addEventListener("mousemove", (event) => {
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      mouse.x =
        ((event.clientX - rect.left) / mountRef.current.clientWidth) * 2 - 1;
      mouse.y =
        -((event.clientY - rect.top) / mountRef.current.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      if (
        intersects.length > 0 &&
        intersects[0].object instanceof THREE.Mesh &&
        intersects[0].object.userData.name !== undefined
      ) {
        const cityData = intersects[0].object.userData;
        const position = intersects[0].object.position.clone();
        position.project(camera);
        setSelectedCity({
          name: cityData.name,
          price: realEstateData[currentYear.toString()]?.[cityData.name] || 0,
          position: new THREE.Vector3(
            (position.x * 0.5 + 0.5) * mountRef.current.clientWidth,
            (-position.y * 0.5 + 0.5) * mountRef.current.clientHeight,
            0
          ),
        });
      } else {
        setSelectedCity(null);
      }
    });

    window.addEventListener("click", (event) => {
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      mouse.x =
        ((event.clientX - rect.left) / mountRef.current.clientWidth) * 2 - 1;
      mouse.y =
        -((event.clientY - rect.top) / mountRef.current.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0 && intersects[0].object instanceof THREE.Mesh) {
        const cityData = intersects[0].object.userData;
        setClickedCity(cityData.name);
      } else {
        setClickedCity(null);
      }
    });

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    }
    animate();

    // Cleanup
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      mountRef.current?.removeChild(labelRenderer.domElement);
    };
  }, [currentYear, realEstateData]);

  useEffect(() => {
    if (!realEstateData[currentYear.toString()]) return;

    const yearData = realEstateData[currentYear.toString()];
    const prices = Object.values(yearData);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    Object.entries(yearData).forEach(([cityName, price]) => {
      const sphere = spheresRef.current[cityName];
      if (sphere) {
        const normalizedPrice = (price - minPrice) / (maxPrice - minPrice);
        const size = 0.03 + normalizedPrice * (0.15 - 0.03);
        sphere.scale.setScalar(size / 0.03);
        if (sphere.material instanceof THREE.MeshStandardMaterial) {
          const hue = 0.6 * (1 - normalizedPrice);
          sphere.material.color.setHSL(hue, 1, 0.5);
        }
      }
    });
  }, [currentYear, realEstateData]);

  const getCityInsights = useMemo(() => {
    if (!city || !realEstateData) {
      // Calculate mean of all cities if no city is clicked
      const meanData: { [key: string]: number } = {};
      Object.entries(realEstateData).forEach(([year, cities]) => {
        const values = Object.values(cities);
        meanData[year] =
          values.reduce((sum, value) => sum + value, 0) / values.length;
      });
      return meanData;
    }

    return Object.entries(realEstateData).reduce((acc, [year, cities]) => {
      acc[year] = cities[city] || 0;
      return acc;
    }, {} as { [key: string]: number });
  }, [city, realEstateData]);

  const [message, setMessage] = useState(''); // Current input message
  const [response, setResponse] = useState(""); // Array of chat messages
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleSend = async () => {
    if (!message.trim()) return; // Prevent sending empty messages

    setResponse("")
        // Add the user's message to the chat history
       
        setIsLoading(true); // Set loading state
    
        try {
          // Make the POST request to your backend
          const response = await fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_input: message }),
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
    
          const data = await response.json();
    
          // Add the chatbot's response to the chat history
          setResponse(data.response)
        } catch (error) {
          console.error('Error sending message:', error);
          // Optionally, display an error message in the chat
          setResponse("Error fucck")
        } finally {
          setIsLoading(false); // Reset loading state
        }
    
        setMessage(''); // Clear the input field
        
  };
  
  // Handler to open the modal
  const openModal = () => {
    setShowModal(true);
  };

  // Handler to close the modal
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="w-full h-full">
        <div className="w-screen items-center flex justify-center sticky top-0 z-10">
          {" "}
          <header className=" p-4 flex flex-row items-center justify-center mt-4 gap-2 bg-white dark:bg-black w-[550px] rounded-full">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                router.push("/");
              }}
            >
              <HomeIcon className="h-[18px]" />
            </Button>
            <ModeToggle />
            <Input
              type="search"
              placeholder="Search city..."
              className="max-w-md rounded-full h-[50px] w-[550px]"
            />

            <Button
              variant="outline"
              onClick={() => {
                setShowModal(true);
              }}
              style={{
                background:
                  "linear-gradient(to right, #ff0000, #ff7a5c, #ffea00)",
                color: "white",
              }} className="rounded-full"
            >
              Ask AI
            </Button>
          </header>
        </div>

        <div className="container mx-auto p-4">
          <div className="w-full flex flex-col lg:flex-row gap-4">
            <div className="lg:w-2/3">
              <h2 className="text-xl font-semibold mb-4 tracking-wide">
                Median Price of Real Estate Over Time
              </h2>
              <div
                ref={mountRef}
                className="w-full h-[500px] rounded-lg relative"
              >
                {selectedCity && (
                  <div
                    className="absolute p-2 rounded text-sm text-black dark:text-white"
                    style={{
                      left: `${selectedCity.position.x}px`,
                      top: `${selectedCity.position.y}px`,
                      transform: "translate(-50%, -100%)",
                    }}
                  >
                    {selectedCity.name}: ${selectedCity.price.toLocaleString()}
                  </div>
                )}
              </div>
              <div className="mt-4 w-full flex flex-col gap-2 items-center justify-center">
                <Slider
                  min={2008}
                  max={2035}
                  step={1}
                  value={[currentYear]}
                  onValueChange={(value) => setCurrentYear(value[0])}
                />
                <p className="text-center mt-2 text-base">
                  Price Development for Year: {currentYear}
                </p>
              </div>
            </div>
            <div className="lg:w-1/3 flex flex-col gap-5">
              <RealEstateMap
                cityData={getCityInsights}
                cityName={city || "USA"}
                year={currentYear.toString()}
              />
              <RealStateInsights cityName={city || "USA"} />
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-4 mb-20">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="lg:w-3/5">
              <LineChart
                cityData={getCityInsights}
                cityName={city || "Average"}
              />
            </div>
            <div className="lg:w-2/5 ml-4">
              <CompareDemo />
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogTrigger asChild>
            <Button variant="outline">Open Chatbox</Button>
          </DialogTrigger>
          <DialogContent className="min-w-[1000px] h-[500px]">
            <Card className="border-none shadow-none">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  AI Assist
                </CardTitle>
                <CardDescription>
                  Want to learn about mortgages? You only have to ask.
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] p-4">
                <div className="border h-[250px] w[550px] overflow-auto rounded-lg p-4">
                  {isLoading && "Loading......."}
                  {response}
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center justify-center">
                  <Input
                    type="text"
                    placeholder="Ask a question based on real estates..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-[750px]"
                  />
                  <Button onClick={handleSend} className="ml-2 w-[150px]">
                    <Send className="w-4 h-4 mr-2" />
                    Ask
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
