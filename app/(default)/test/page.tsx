"use client";

import { useEffect } from "react";
import axios from "axios";
import * as Cesium from "cesium";

const App = () => {
  useEffect(() => {
    // Set Cesium access token
    Cesium.Ion.defaultAccessToken = process.env
      .NEXT_PUBLIC_CESIUM_ACCESS_TOKEN as string;

    // Initialize Cesium viewer
    const viewer = new Cesium.Viewer("cesiumContainer", {
      baseLayerPicker: false,
      timeline: true,
      animation: true,
    });

    // Remove default base layer
    viewer.imageryLayers.remove(viewer.imageryLayers.get(0));

    // Authenticate with Sentinel Hub
    const getSentinelHubToken = async () => {
      try {
        const clientId = process.env.NEXT_PUBLIC_SENTINELHUB_CLIENT_ID;
        const clientSecret = process.env.NEXT_PUBLIC_SENTINELHUB_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
          throw new Error(
            "Sentinel Hub credentials are not set in environment variables"
          );
        }

        const response = await axios.post(
          "https://services.sentinel-hub.com/oauth/token",
          "grant_type=client_credentials",
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
            },
          }
        );
        return response.data.access_token;
      } catch (error) {
        console.error("Error fetching Sentinel Hub token:", error);
        if (axios.isAxiosError(error) && error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        }
        throw error;
      }
    };

    const loadSentinelImagery = async () => {
      try {
        const sentinelToken = await getSentinelHubToken();

        if (!sentinelToken) {
          throw new Error("Failed to authenticate with Sentinel Hub");
        }

        const sentinelLayer = new Cesium.WebMapTileServiceImageryProvider({
          url: `https://services.sentinel-hub.com/ogc/wms/${process.env.NEXT_PUBLIC_SENTINELHUB_INSTANCE_ID}`,
          layers: "TRUE_COLOR",
          style: "",
          format: "image/png",
          tileMatrixSetID: "PopularWebMercator512",
          maximumLevel: 16,
          time: "",
          tilingScheme: new Cesium.WebMercatorTilingScheme(),
          credit: new Cesium.Credit("Sentinel Hub"),
          customTags: {
            access_token: sentinelToken,
          },
        });

        viewer.imageryLayers.addImageryProvider(sentinelLayer);

        // Set up timeline
        const start = Cesium.JulianDate.fromDate(new Date(2020, 0, 1));
        const end = Cesium.JulianDate.fromDate(new Date());
        viewer.timeline.zoomTo(start, end);
        viewer.clock.startTime = start;
        viewer.clock.stopTime = end;
        viewer.clock.currentTime = end;
        viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
        viewer.clock.multiplier = 1000000;

        // Update imagery based on timeline
        viewer.clock.onTick.addEventListener((clock) => {
          const currentTime = Cesium.JulianDate.toDate(clock.currentTime);
          const formattedTime = currentTime.toISOString().split("T")[0];
          sentinelLayer.time = formattedTime;
        });
      } catch (error) {
        console.error("Error loading Sentinel imagery:", error);
      }
    };

    loadSentinelImagery();

    return () => {
      viewer.destroy();
    };
  }, []);

  return (
    <div id="cesiumContainer" style={{ height: "100vh", width: "100%" }}></div>
  );
};

export default App;
