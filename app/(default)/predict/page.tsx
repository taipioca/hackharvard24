"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import LineChart from "@/components/charts/line-chart";
import axios from "axios";
import RealEstateMap from "@/components/real-estate-map";
import RealStateInsights from "@/components/real-state-insights";

// City positions
const cityPositions: { [key: string]: [number, number, number] } = {
  "New York City, NY": [2.5, 1.2, 0],
  "Los Angeles, CA": [-2.5, 0.2, 0],
  "Chicago, IL": [0.5, 1, 0],
  "Houston, TX": [0, -0.8, 0],
  "Phoenix, AZ": [-1.5, 0, 0],
  "Philadelphia, PA": [2.3, 0.8, 0],
  "San Antonio, TX": [-0.5, -1, 0],
  "San Diego, CA": [-2.3, -0.2, 0],
  "Dallas, TX": [-0.2, -0.5, 0],
  "San Jose, CA": [-2.4, 0.5, 0],
  "Miami, FL": [2, -1.5, 0],
  "Atlanta, GA": [1.5, -0.8, 0],
  "Seattle, WA": [-2.3, 1.8, 0],
  "Denver, CO": [-1, 0.5, 0],
  "Boston, MA": [2.7, 1.5, 0],
  "Las Vegas, NV": [-2, 0.3, 0],
  "Washington D.C., DC": [2.4, 0.9, 0],
  "Baltimore, MD": [2.5, 0.7, 0],
  "Portland, OR": [-2.5, 1.6, 0],
  "Oklahoma City, OK": [0.5, -0.5, 0],
  "Milwaukee, WI": [0.6, 1.1, 0],
  "Albuquerque, NM": [-1.7, -0.2, 0],
  "Tucson, AZ": [-1.6, 0.2, 0],
  "Fresno, CA": [-2.4, 0.1, 0],
  "Sacramento, CA": [-2.5, 0.5, 0],
  "Long Beach, CA": [-2.4, 0.3, 0],
  "Kansas City, MO": [0.3, 0.1, 0],
  "Mesa, AZ": [-1.5, 0.1, 0],
  "Virginia Beach, VA": [2.3, -1.1, 0],
  "Cleveland, OH": [1, 0.8, 0],
  "Pittsburgh, PA": [1, 0.5, 0],
  "New Orleans, LA": [0.5, -1.5, 0],
  "Louisville, KY": [1, 0, 0],
  "Tampa, FL": [2, -1.2, 0],
  "Omaha, NE": [0.8, 0.4, 0],
  "Cincinnati, OH": [1, 0.3, 0],
  "Minneapolis, MN": [0, 1.4, 0],
  "Wichita, KS": [0.7, -0.3, 0],
  "Newark, NJ": [2.6, 1.3, 0],
  "St. Louis, MO": [0.5, 0, 0],
  "Anchorage, AK": [-2.8, 2, 0],
  "Honolulu, HI": [-3, -2, 0],
  "Baton Rouge, LA": [0.5, -1.4, 0],
};

export default function RealEstateMapComponent() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedCity, setSelectedCity] = useState<{
    name: string;
    price: number;
    position: THREE.Vector3;
  } | null>(null);
  const [currentYear, setCurrentYear] = useState(2004);
  const spheresRef = useRef<{ [key: string]: THREE.Mesh }>({});
  const [realEstateData, setRealEstateData] = useState<{
    [key: string]: { [key: string]: number };
  }>({});

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/dump_data");
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return {};
    }
  };

  useEffect(() => {
    const initData = async () => {
      const data = await fetchData();
      setRealEstateData(data);
    };
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Create nodes (cities)
    const minSize = 0.03;
    const maxSize = 0.15;

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
      spheresRef.current[cityName] = sphere;

      // Add label
      const cityDiv = document.createElement("div");
      cityDiv.className = "label";
      cityDiv.textContent = cityName;
      cityDiv.style.color = "white";
      cityDiv.style.fontSize = "12px";
      const cityLabel = new CSS2DObject(cityDiv);
      cityLabel.position.set(0, 0.1, 0);
      sphere.add(cityLabel);

      // Add hover effect
      sphere.userData = { name: cityName };
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

      if (intersects.length > 0 && intersects[0].object instanceof THREE.Mesh) {
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
  }, []);

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

  return (
    <div className="w-full h-full bg-gray-900 text-white">
      <header className="sticky top-0 z-10 p-4 flex flex-row items-center justify-center mt-4">
        <Input
          type="search"
          placeholder="Search properties..."
          className="max-w-md mx-auto rounded-3xl"
        />
      </header>
      <div className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-2/3">
            <h2 className="text-xl font-bold mb-4">Property Map</h2>
            <div
              ref={mountRef}
              className="w-full h-[500px] bg-gray-800 rounded-lg relative"
            >
              {selectedCity && (
                <div
                  className="absolute bg-gray-800 p-2 rounded text-sm"
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
            <div className="mt-4">
              <Slider
                min={2004}
                max={2023}
                step={1}
                value={[currentYear]}
                onValueChange={(value) => setCurrentYear(value[0])}
              />
              <p className="text-center mt-2">Year: {currentYear}</p>
            </div>
          </div>
          <div className="lg:w-1/3">
            <RealEstateMap />
            <RealStateInsights />
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-4">
        <LineChart />
      </div>
    </div>
  );
}
