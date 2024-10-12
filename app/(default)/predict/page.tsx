"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";

// Expanded mock data for cities
const cities: {
  name: string;
  price: number;
  position: [number, number, number];
}[] = [
  { name: "New York", price: 1000000, position: [2.5, 1.2, 0] },
  { name: "Los Angeles", price: 900000, position: [-2.5, 0.2, 0] },
  { name: "Chicago", price: 500000, position: [0.5, 1, 0] },
  { name: "Houston", price: 300000, position: [0, -0.8, 0] },
  { name: "Phoenix", price: 400000, position: [-1.5, 0, 0] },
  { name: "Philadelphia", price: 350000, position: [2.3, 0.8, 0] },
  { name: "San Antonio", price: 250000, position: [-0.5, -1, 0] },
  { name: "San Diego", price: 800000, position: [-2.3, -0.2, 0] },
  { name: "Dallas", price: 350000, position: [-0.2, -0.5, 0] },
  { name: "San Jose", price: 1100000, position: [-2.4, 0.5, 0] },
  { name: "Miami", price: 450000, position: [2, -1.5, 0] },
  { name: "Seattle", price: 750000, position: [-2.3, 1.8, 0] },
  { name: "Denver", price: 500000, position: [-1, 0.5, 0] },
  { name: "Boston", price: 700000, position: [2.7, 1.5, 0] },
  { name: "Atlanta", price: 350000, position: [1.5, -0.8, 0] },
  { name: "Washington D.C.", price: 600000, position: [2.1, 0.5, 0] },
  { name: "Las Vegas", price: 350000, position: [-2, 0.3, 0] },
  { name: "Portland", price: 450000, position: [-2.4, 1.5, 0] },
  { name: "Detroit", price: 200000, position: [1, 1.2, 0] },
  { name: "Nashville", price: 400000, position: [0.8, -0.3, 0] },
  { name: "Austin", price: 550000, position: [-0.3, -0.9, 0] },
  { name: "San Francisco", price: 1200000, position: [-2.5, 0.7, 0] },
  { name: "Minneapolis", price: 300000, position: [0, 1.5, 0] },
  { name: "New Orleans", price: 250000, position: [0.5, -1.3, 0] },
  { name: "Salt Lake City", price: 400000, position: [-1.5, 0.8, 0] },
  { name: "Orlando", price: 300000, position: [1.8, -1.3, 0] },
  { name: "Charlotte", price: 320000, position: [1.7, -0.5, 0] },
  { name: "Sacramento", price: 420000, position: [-2.3, 0.9, 0] },
  { name: "Kansas City", price: 230000, position: [-0.2, 0.3, 0] },
  { name: "Columbus", price: 250000, position: [1.3, 0.5, 0] },
  { name: "Indianapolis", price: 200000, position: [0.8, 0.5, 0] },
  { name: "Pittsburgh", price: 180000, position: [1.8, 0.8, 0] },
  { name: "Cincinnati", price: 190000, position: [1.2, 0.2, 0] },
  { name: "Raleigh", price: 340000, position: [2, -0.3, 0] },
  { name: "St. Louis", price: 180000, position: [0.3, 0.2, 0] },
];

export default function RealEstateMapComponent() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedCity, setSelectedCity] = useState<{
    name: string;
    price: number;
    position: THREE.Vector3;
  } | null>(null);

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
    const minPrice = Math.min(...cities.map((city) => city.price));
    const maxPrice = Math.max(...cities.map((city) => city.price));
    const minSize = 0.03;
    const maxSize = 0.15;

    cities.forEach((city) => {
      const normalizedPrice = (city.price - minPrice) / (maxPrice - minPrice);
      const size = minSize + normalizedPrice * (maxSize - minSize);
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const color = new THREE.Color().setHSL(
        0.6 * (1 - normalizedPrice),
        1,
        0.5
      );
      const material = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.5,
        roughness: 0.1,
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(...city.position);
      scene.add(sphere);

      // Add label
      const cityDiv = document.createElement("div");
      cityDiv.className = "label";
      cityDiv.textContent = city.name;
      cityDiv.style.color = "white";
      cityDiv.style.fontSize = "12px";
      const cityLabel = new CSS2DObject(cityDiv);
      cityLabel.position.set(0, size + 0.02, 0);
      sphere.add(cityLabel);

      // Add hover effect
      sphere.userData = { name: city.name, price: city.price };
    });

    camera.position.z = 3;

    // Raycaster for hover effect
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.addEventListener("mousemove", (event) => {
      const rect = mountRef.current!.getBoundingClientRect();
      mouse.x =
        ((event.clientX - rect.left) / mountRef.current!.clientWidth) * 2 - 1;
      mouse.y =
        -((event.clientY - rect.top) / mountRef.current!.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0 && intersects[0].object instanceof THREE.Mesh) {
        const cityData = intersects[0].object.userData;
        const position = intersects[0].object.position.clone();
        position.project(camera);
        setSelectedCity({
          name: cityData.name,
          price: cityData.price,
          position: new THREE.Vector3(
            (position.x * 0.5 + 0.5) * mountRef.current!.clientWidth,
            (-position.y * 0.5 + 0.5) * mountRef.current!.clientHeight,
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

  return (
    <div className="w-full h-full bg-gray-900 text-white">
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
          </div>
          <div className="lg:w-1/3">
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-bold mb-2">Our Suggestion</h3>
              <p className="font-bold">Buy this property</p>
              <p className="text-sm mb-2">Why we say that?</p>
              <p className="text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Reprehenderit animi accusamus iste excepturi dolor error natus
                culpa aspernatur iure quo. Animi facilis cumque officiis
                voluptate in sit nostrum dignissimos similique?
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Real Estate Insights</h3>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-sm">Median List to Sale</p>
                  <p className="font-bold">1,234</p>
                </div>
                <div>
                  <p className="text-sm">Median Price</p>
                  <p className="font-bold">$450,000</p>
                </div>
              </div>
              <p className="text-sm font-bold text-green-400">
                +5.2% this month
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
