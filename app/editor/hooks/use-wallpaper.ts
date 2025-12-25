"use client";

import { useState, useEffect } from "react";
import { Wallpaper } from "../types";

export function useWallpapers() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWallpapers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/imagekit/wallpapers");
        const data = await response.json();
        
        console.log("API Response:", data);
        
        if (Array.isArray(data)) {
          setWallpapers(data);
        } else if (data.wallpapers && Array.isArray(data.wallpapers)) {
          setWallpapers(data.wallpapers);
        } else {
          console.error("Unexpected response format:", data);
          setWallpapers([]);
        }
      } catch (err) {
        console.error("Failed to fetch wallpapers:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setWallpapers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWallpapers();
  }, []);

  return { wallpapers, loading, error };
}
