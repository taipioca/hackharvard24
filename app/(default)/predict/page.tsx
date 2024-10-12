"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
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
import { HomeIcon } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { CompareDemo } from "@/app/components/image-slider";

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

const migrations = [
  { from: "Akron, OH", to: "Cleveland, OH" },
  { from: "Albany, NY", to: "New York, NY" },
  { from: "Albuquerque, NM", to: "Phoenix, AZ" },
  { from: "Allentown, PA", to: "Philadelphia, PA" },
  { from: "Asheville, NC", to: "Charlotte, NC" },
  { from: "Atlanta, GA", to: "Miami, FL" },
  { from: "Augusta, GA", to: "Atlanta, GA" },
  { from: "Austin, TX", to: "Dallas, TX" },
  { from: "Bakersfield, CA", to: "Los Angeles, CA" },
  { from: "Baltimore, MD", to: "Washington, DC" },
  { from: "Barnstable Town, MA", to: "Boston, MA" },
  { from: "Baton Rouge, LA", to: "New Orleans, LA" },
  { from: "Bend, OR", to: "Portland, OR" },
  { from: "Birmingham, AL", to: "Atlanta, GA" },
  { from: "Boise City, ID", to: "Salt Lake City, UT" },
  { from: "Boston, MA", to: "New York, NY" },
  { from: "Boulder, CO", to: "Denver, CO" },
  { from: "Bremerton, WA", to: "Seattle, WA" },
  { from: "Bridgeport, CT", to: "New York, NY" },
  { from: "Buffalo, NY", to: "Rochester, NY" },
  { from: "Canton, OH", to: "Cleveland, OH" },
  { from: "Cape Coral, FL", to: "Miami, FL" },
  { from: "Cedar Rapids, IA", to: "Des Moines, IA" },
  { from: "Charleston, SC", to: "Savannah, GA" },
  { from: "Charlotte, NC", to: "Atlanta, GA" },
  { from: "Chattanooga, TN", to: "Nashville, TN" },
  { from: "Chicago, IL", to: "Los Angeles, CA" },
  { from: "Cincinnati, OH", to: "Dayton, OH" },
  { from: "Clarksville, TN", to: "Nashville, TN" },
  { from: "Cleveland, OH", to: "Columbus, OH" },
  { from: "Colorado Springs, CO", to: "Denver, CO" },
  { from: "Columbia, MO", to: "Kansas City, MO" },
  { from: "Columbia, SC", to: "Charlotte, NC" },
  { from: "Columbus, OH", to: "Cincinnati, OH" },
  { from: "Concord, NH", to: "Boston, MA" },
  { from: "Corpus Christi, TX", to: "Houston, TX" },
  { from: "Crestview, FL", to: "Pensacola, FL" },
  { from: "Dallas, TX", to: "Austin, TX" },
  { from: "Daphne, AL", to: "Mobile, AL" },
  { from: "Davenport, IA", to: "Des Moines, IA" },
  { from: "Dayton, OH", to: "Cincinnati, OH" },
  { from: "Deltona, FL", to: "Orlando, FL" },
  { from: "Denver, CO", to: "Boulder, CO" },
  { from: "Des Moines, IA", to: "Omaha, NE" },
  { from: "Detroit, MI", to: "Grand Rapids, MI" },
  { from: "Duluth, MN", to: "Minneapolis, MN" },
  { from: "Durham, NC", to: "Raleigh, NC" },
  { from: "El Paso, TX", to: "Austin, TX" },
  { from: "Eugene, OR", to: "Portland, OR" },
  { from: "Fayetteville, AR", to: "Little Rock, AR" },
  { from: "Fayetteville, NC", to: "Raleigh, NC" },
  { from: "Flint, MI", to: "Detroit, MI" },
  { from: "Fort Collins, CO", to: "Denver, CO" },
  { from: "Fresno, CA", to: "Los Angeles, CA" },
  { from: "Grand Rapids, MI", to: "Detroit, MI" },
  { from: "Greeley, CO", to: "Fort Collins, CO" },
  { from: "Greensboro, NC", to: "Charlotte, NC" },
  { from: "Greenville, SC", to: "Charleston, SC" },
  { from: "Harrisburg, PA", to: "Philadelphia, PA" },
  { from: "Hartford, CT", to: "New Haven, CT" },
  { from: "Hickory, NC", to: "Charlotte, NC" },
  { from: "Hilton Head Island, SC", to: "Savannah, GA" },
  { from: "Houston, TX", to: "Austin, TX" },
  { from: "Huntsville, AL", to: "Birmingham, AL" },
  { from: "Indianapolis, IN", to: "Chicago, IL" },
  { from: "Jacksonville, FL", to: "Orlando, FL" },
  { from: "Jacksonville, NC", to: "Camp Lejeune, NC" },
  { from: "Kansas City, MO", to: "St. Louis, MO" },
  { from: "Killeen, TX", to: "Austin, TX" },
  { from: "Knoxville, TN", to: "Nashville, TN" },
  { from: "Lake Havasu City, AZ", to: "Las Vegas, NV" },
  { from: "Lakeland, FL", to: "Tampa, FL" },
  { from: "Lancaster, PA", to: "Philadelphia, PA" },
  { from: "Lansing, MI", to: "Grand Rapids, MI" },
  { from: "Las Vegas, NV", to: "Los Angeles, CA" },
  { from: "Lexington, KY", to: "Louisville, KY" },
  { from: "Lincoln, NE", to: "Omaha, NE" },
  { from: "Little Rock, AR", to: "Fayetteville, AR" },
  { from: "Los Angeles, CA", to: "San Diego, CA" },
  { from: "Louisville, KY", to: "Lexington, KY" },
  { from: "Lubbock, TX", to: "Dallas, TX" },
  { from: "Madison, WI", to: "Milwaukee, WI" },
  { from: "Memphis, TN", to: "Nashville, TN" },
  { from: "Miami, FL", to: "Orlando, FL" },
  { from: "Milwaukee, WI", to: "Chicago, IL" },
  { from: "Minneapolis, MN", to: "St. Paul, MN" },
  { from: "Modesto, CA", to: "Fresno, CA" },
  { from: "Myrtle Beach, SC", to: "Charleston, SC" },
  { from: "Naples, FL", to: "Miami, FL" },
  { from: "Nashville, TN", to: "Memphis, TN" },
  { from: "New Haven, CT", to: "Hartford, CT" },
  { from: "New Orleans, LA", to: "Baton Rouge, LA" },
  { from: "New York, NY", to: "Los Angeles, CA" },
  { from: "North Port, FL", to: "Sarasota, FL" },
  { from: "Ogden, UT", to: "Salt Lake City, UT" },
  { from: "Oklahoma City, OK", to: "Tulsa, OK" },
  { from: "Omaha, NE", to: "Lincoln, NE" },
  { from: "Orlando, FL", to: "Tampa, FL" },
  { from: "Oxnard, CA", to: "Los Angeles, CA" },
  { from: "Palm Bay, FL", to: "Melbourne, FL" },
  { from: "Panama City, FL", to: "Tallahassee, FL" },
  { from: "Pensacola, FL", to: "Mobile, AL" },
  { from: "Peoria, IL", to: "Chicago, IL" },
  { from: "Philadelphia, PA", to: "New York, NY" },
  { from: "Phoenix, AZ", to: "Las Vegas, NV" },
  { from: "Pittsburgh, PA", to: "Cleveland, OH" },
  { from: "Port St. Lucie, FL", to: "Palm Beach, FL" },
  { from: "Portland, ME", to: "Boston, MA" },
  { from: "Portland, OR", to: "Seattle, WA" },
  { from: "Poughkeepsie, NY", to: "New York, NY" },
  { from: "Prescott Valley, AZ", to: "Phoenix, AZ" },
  { from: "Providence, RI", to: "Boston, MA" },
  { from: "Provo, UT", to: "Salt Lake City, UT" },
  { from: "Punta Gorda, FL", to: "Cape Coral, FL" },
  { from: "Raleigh, NC", to: "Durham, NC" },
  { from: "Reading, PA", to: "Philadelphia, PA" },
  { from: "Reno, NV", to: "Las Vegas, NV" },
  { from: "Richmond, VA", to: "Virginia Beach, VA" },
  { from: "Riverside, CA", to: "Los Angeles, CA" },
  { from: "Rochester, MN", to: "Minneapolis, MN" },
  { from: "Rochester, NY", to: "Buffalo, NY" },
  { from: "Rockford, IL", to: "Chicago, IL" },
  { from: "Sacramento, CA", to: "San Francisco, CA" },
  { from: "Salisbury, MD", to: "Baltimore, MD" },
  { from: "Salt Lake City, UT", to: "Provo, UT" },
  { from: "San Antonio, TX", to: "Austin, TX" },
  { from: "San Diego, CA", to: "Los Angeles, CA" },
  { from: "San Francisco, CA", to: "San Jose, CA" },
  { from: "San Jose, CA", to: "San Francisco, CA" },
  { from: "San Luis Obispo, CA", to: "Santa Barbara, CA" },
  { from: "Santa Maria, CA", to: "Santa Barbara, CA" },
  { from: "Santa Rosa, CA", to: "San Francisco, CA" },
  { from: "Savannah, GA", to: "Charleston, SC" },
  { from: "Scranton, PA", to: "Wilkes-Barre, PA" },
  { from: "Seattle, WA", to: "Portland, OR" },
  { from: "Sebastian, FL", to: "Vero Beach, FL" },
  { from: "Spokane, WA", to: "Seattle, WA" },
  { from: "Springfield, IL", to: "Chicago, IL" },
  { from: "Springfield, MA", to: "Boston, MA" },
  { from: "Springfield, MO", to: "Kansas City, MO" },
  { from: "St. Louis, MO", to: "Kansas City, MO" },
  { from: "Stockton, CA", to: "Modesto, CA" },
  { from: "Tallahassee, FL", to: "Orlando, FL" },
  { from: "Tampa, FL", to: "Orlando, FL" },
  { from: "Toledo, OH", to: "Cleveland, OH" },
  { from: "Trenton, NJ", to: "Philadelphia, PA" },
  { from: "Tucson, AZ", to: "Phoenix, AZ" },
  { from: "Tulsa, OK", to: "Oklahoma City, OK" },
  { from: "United States", to: "Canada" },
  { from: "Urban Honolulu, HI", to: "Los Angeles, CA" },
  { from: "Virginia Beach, VA", to: "Norfolk, VA" },
  { from: "Visalia, CA", to: "Fresno, CA" },
  { from: "Washington, DC", to: "Baltimore, MD" },
  { from: "Wilmington, NC", to: "Charlotte, NC" },
  { from: "Winston, NC", to: "Greensboro, NC" },
  { from: "Worcester, MA", to: "Boston, MA" },
  { from: "York, PA", to: "Harrisburg, PA" },
  { from: "Youngstown, OH", to: "Cleveland, OH" },
  { from: "New York, NY", to: "Los Angeles, CA" },
  { from: "Miami, FL", to: "Seattle, WA" },
  { from: "Chicago, IL", to: "San Francisco, CA" },
  { from: "Houston, TX", to: "New York, NY" },
  { from: "Phoenix, AZ", to: "Chicago, IL" },
  { from: "Dallas, TX", to: "Los Angeles, CA" },
  { from: "San Diego, CA", to: "New York, NY" },
  { from: "Atlanta, GA", to: "San Francisco, CA" },
  { from: "Boston, MA", to: "Los Angeles, CA" },
  { from: "Philadelphia, PA", to: "Miami, FL" },
  { from: "Washington, DC", to: "Houston, TX" },
  { from: "Seattle, WA", to: "Boston, MA" },
  { from: "Detroit, MI", to: "Los Angeles, CA" },
  { from: "San Francisco, CA", to: "Miami, FL" }
];

export default function RealEstateMapComponent() {
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
  }, [])

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
        cityLabel.position.set(0, 0.1, 0);
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
    if (!clickedCity || !realEstateData) {
      // Calculate mean of all cities if no city is clicked
      const meanData: { [key: string]: number } = {};
      Object.entries(realEstateData).forEach(([year, cities]) => {
        const values = Object.values(cities);
        meanData[year] = values.reduce((sum, value) => sum + value, 0) / values.length;
      });
      return meanData;
    }

    return Object.entries(realEstateData).reduce((acc, [year, cities]) => {
      acc[year] = cities[clickedCity] || 0;
      return acc;
    }, {} as { [key: string]: number });
  }, [clickedCity, realEstateData]);

  return (
    <div className="w-full h-full">
      <header className="sticky top-0 z-10 p-4 flex flex-row items-center justify-center mt-4 gap-2">
        <Input
          type="search"
          placeholder="Search properties..."
          className="max-w-md rounded-full h-[50px] w-[550px]"
        />
        <Button variant="outline" size="icon">
          <HomeIcon className="h-[18px]" />
        </Button>
        <ModeToggle />
      </header>
      <div className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-2/3">
            <h2 className="text-xl font-semibold mb-4 tracking-tighter">
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
              <p className="text-center mt-2">
                Price Development for Year: {currentYear}
              </p>
            </div>
          </div>
          <div className="lg:w-1/3 flex flex-col gap-5">
            <RealEstateMap cityData={getCityInsights} cityName={clickedCity || "USA"} year={currentYear.toString()} />
            <RealStateInsights cityName={clickedCity || "USA"} />
          </div>
        </div>
      </div>
        <div className="container mx-auto mt-4 mb-20">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-2/3">
            <LineChart cityData={getCityInsights} cityName={clickedCity || "Average"} />
          </div>
          <div className="lg:w-1/3">
            <CompareDemo />
          </div>
        </div>
      </div>
    </div>
  );
}
