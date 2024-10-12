'use client'

import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { Slider } from '@/components/ui/slider.tsx'
import { Card, CardTitle, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card.tsx'
import { Input } from '@/components/ui/input.tsx'
import { ModeToggle } from '@/components/ui/toggle.tsx'
import LineChart from '@/components/charts/line-chart.tsx'
import { Home, DollarSign, TrendingUp, Users } from "lucide-react";

// Real estate data for 20 years
const realEstateData: { [key: string]: { [city: string]: number } } = {
  "2004": {"New York City": 400000, "Los Angeles": 350000, "Chicago": 250000, "Houston": 180000, "Phoenix": 150000, "Philadelphia": 220000, "San Antonio": 140000, "San Diego": 340000, "Dallas": 180000, "San Jose": 380000, "Miami": 280000, "Atlanta": 160000, "Seattle": 300000, "Denver": 210000, "Boston": 400000, "Las Vegas": 220000},
  "2005": {"New York City": 420000, "Los Angeles": 370000, "Chicago": 255000, "Houston": 185000, "Phoenix": 160000, "Philadelphia": 230000, "San Antonio": 145000, "San Diego": 360000, "Dallas": 190000, "San Jose": 400000, "Miami": 300000, "Atlanta": 170000, "Seattle": 320000, "Denver": 220000, "Boston": 420000, "Las Vegas": 240000},
  "2006": {"New York City": 420000, "Los Angeles": 370000, "Chicago": 255000, "Houston": 185000, "Phoenix": 160000, "Philadelphia": 230000, "San Antonio": 145000, "San Diego": 360000, "Dallas": 190000, "San Jose": 400000, "Miami": 300000, "Atlanta": 170000, "Seattle": 320000, "Denver": 220000, "Boston": 420000, "Las Vegas": 240000},
  "2007": {"New York City": 3000, "Los Angeles": 370000, "Chicago": 255000, "Houston": 185000, "Phoenix": 160000, "Philadelphia": 230000, "San Antonio": 145000, "San Diego": 360000, "Dallas": 190000, "San Jose": 400000, "Miami": 300000, "Atlanta": 170000, "Seattle": 320000, "Denver": 220000, "Boston": 420000, "Las Vegas": 240000},
  "2008": {"New York City": 420000, "Los Angeles": 370000, "Chicago": 255000, "Houston": 185000, "Phoenix": 160000, "Philadelphia": 230000, "San Antonio": 145000, "San Diego": 360000, "Dallas": 190000, "San Jose": 400000, "Miami": 300000, "Atlanta": 170000, "Seattle": 320000, "Denver": 220000, "Boston": 420000, "Las Vegas": 240000},
  "2009": {"New York City": 420000, "Los Angeles": 370000, "Chicago": 255000, "Houston": 185000, "Phoenix": 160000, "Philadelphia": 230000, "San Antonio": 145000, "San Diego": 360000, "Dallas": 190000, "San Jose": 400000, "Miami": 300000, "Atlanta": 170000, "Seattle": 320000, "Denver": 220000, "Boston": 420000, "Las Vegas": 240000},
  "2010": {"New York City": 420000, "Los Angeles": 370000, "Chicago": 255000, "Houston": 185000, "Phoenix": 160000, "Philadelphia": 230000, "San Antonio": 145000, "San Diego": 360000, "Dallas": 190000, "San Jose": 400000, "Miami": 300000, "Atlanta": 170000, "Seattle": 320000, "Denver": 220000, "Boston": 420000, "Las Vegas": 240000},
  "2023": {"New York City": 640000, "Los Angeles": 540000, "Chicago": 370000, "Houston": 300000, "Phoenix": 280000, "Philadelphia": 355000, "San Antonio": 220000, "San Diego": 540000, "Dallas": 290000, "San Jose": 540000, "Miami": 440000, "Atlanta": 270000, "Seattle": 490000, "Denver": 340000, "Boston": 560000, "Las Vegas": 380000}
}

const years = Object.keys(realEstateData)

// City positions
const cityPositions: { [key: string]: [number, number, number] } = {
  "New York City": [2.5, 1.2, 0],
  "Los Angeles": [-2.5, 0.2, 0],
  "Chicago": [0.5, 1, 0],
  "Houston": [0, -0.8, 0],
  "Phoenix": [-1.5, 0, 0],
  "Philadelphia": [2.3, 0.8, 0],
  "San Antonio": [-0.5, -1, 0],
  "San Diego": [-2.3, -0.2, 0],
  "Dallas": [-0.2, -0.5, 0],
  "San Jose": [-2.4, 0.5, 0],
  "Miami": [2, -1.5, 0],
  "Atlanta": [1.5, -0.8, 0],
  "Seattle": [-2.3, 1.8, 0],
  "Denver": [-1, 0.5, 0],
  "Boston": [2.7, 1.5, 0],
  "Las Vegas": [-2, 0.3, 0],
}

export default function RealEstateMapComponent() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [selectedCity, setSelectedCity] = useState<{ name: string; price: number; position: THREE.Vector3 } | null>(null)
  const [currentYear, setCurrentYear] = useState(2004)
  const spheresRef = useRef<{ [key: string]: THREE.Mesh }>({})

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    mountRef.current.appendChild(renderer.domElement)

    // Label renderer setup
    const labelRenderer = new CSS2DRenderer()
    labelRenderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    labelRenderer.domElement.style.position = 'absolute'
    labelRenderer.domElement.style.top = '0px'
    mountRef.current.appendChild(labelRenderer.domElement)

    // Controls setup
    const controls = new OrbitControls(camera, labelRenderer.domElement)
    controls.enableDamping = true

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(5, 5, 5)
    scene.add(pointLight)

    // Create nodes (cities)
    const minSize = 0.03
    const maxSize = 0.15

    Object.entries(cityPositions).forEach(([cityName, position]) => {
      const geometry = new THREE.SphereGeometry(minSize, 32, 32)
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.5,
        roughness: 0.1,
      })
      const sphere = new THREE.Mesh(geometry, material)
      sphere.position.set(...position)
      scene.add(sphere)
      spheresRef.current[cityName] = sphere

      // Add label
      const cityDiv = document.createElement('div')
      cityDiv.className = 'label'
      cityDiv.textContent = cityName
      cityDiv.style.color = 'white'
      cityDiv.style.fontSize = '12px'
      const cityLabel = new CSS2DObject(cityDiv)
      cityLabel.position.set(0, 0.1, 0)
      sphere.add(cityLabel)

      // Add hover effect
      sphere.userData = { name: cityName }
    })

    camera.position.z = 3

    // Raycaster for hover effect
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    window.addEventListener('mousemove', (event) => {
      const rect = mountRef.current!.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / mountRef.current!.clientWidth) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / mountRef.current!.clientHeight) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(scene.children)

      if (intersects.length > 0 && intersects[0].object instanceof THREE.Mesh) {
        const cityData = intersects[0].object.userData
        const position = intersects[0].object.position.clone()
        position.project(camera)
        setSelectedCity({
          name: cityData.name,
          price: realEstateData[currentYear.toString()][cityData.name],
          position: new THREE.Vector3(
            (position.x * 0.5 + 0.5) * mountRef.current!.clientWidth,
            (-position.y * 0.5 + 0.5) * mountRef.current!.clientHeight,
            0
          ),
        })
      } else {
        setSelectedCity(null)
      }
    })

    // Animation loop
    function animate() {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
      labelRenderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      mountRef.current?.removeChild(renderer.domElement)
      mountRef.current?.removeChild(labelRenderer.domElement)
    }
  }, [])

  useEffect(() => {
    const yearData = realEstateData[currentYear.toString()]
    const prices = Object.values(yearData)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)

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
  });    

  return (
    <div>
      <div className="w-full h-full bg-gray-900 text-white">
        <div className="container mx-auto p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="lg:w-2/3">
              <h2 className="text-xl font-bold mb-4">Property Map</h2>
              <div ref={mountRef} className="w-full h-[500px] bg-gray-800 rounded-lg relative">
                {selectedCity && (
                  <div
                    className="absolute bg-gray-800 p-2 rounded text-sm"
                    style={{
                      left: `${selectedCity.position.x}px`,
                      top: `${selectedCity.position.y}px`,
                      transform: 'translate(-50%, -100%)',
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
              {/* Suggestion and Insights sections */}
            </div>
          </div>
        </div>
      </div>
      <div className="h-screen bg-background flex flex-col">
        {/* this is the search bar */}
        <header className="sticky top-0 z-10 bg-background border-b flex flex-row items-center justify-center">
          <div className="px-4 py-4">
            <Input
              type="search"
              placeholder="Search properties..."
              className="max-w-md mx-auto"
            />
          </div>
          <ModeToggle />
        </header>
        <div className="flex flex-col gap-[14px]">
          <Card>
            <CardHeader>
              <CardTitle>Our Suggestion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto font-bold">
                Buy this property{" "}
              </div>
              <div>Why we say that?</div>
              <div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Reprehenderit animi accusamus iste excepturi dolor error natus
                culpa aspernatur iure quo. Animi facilis cumque officiis
                voluptate in sit nostrum dignissimos similique?
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Real Estate Insights</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row">
              <ul className="space-y-4 flex flex-row items-start justify-center">
                <li className="flex items-center space-x-2">
                  <Home className="text-primary" />
                  <div>
                    <h3 className="font-semibold text-sm">Median List to Sale</h3>
                    <p className="text-2xl">1,234</p>
                  </div>
                </li>
                <li className="flex items-center space-x-2 text-sm">
                  <DollarSign className="text-primary" />
                  <div>
                    <h3 className="font-semibold">Median Price</h3>
                    <p className="text-2xl">$450,000</p>
                  </div>
                </li>
                <li className="flex items-center space-x-2 text-sm">
                  <TrendingUp className="text-primary" />
                  <div>
                    <h3 className="font-semibold">Market Trend</h3>
                    <p className="text-2xl">+5.2% this month</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <LineChart />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );  
}
