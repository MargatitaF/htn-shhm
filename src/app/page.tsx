"use client";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useEffect } from "react";

const DynamicMap = dynamic(() => import("@/app/Components/Heatmap"), {
  ssr: false,
});

export default function HomePage() {
  const [category, setCategory] = useState<string>("all");
  const [doLoop, setDoLoop] = useState(false)
  const [categories, setCategories] = useState<string[]>([]);
  const [loopCategoryIndex, setLoopCategoryIndex] = useState(0)
  const [points, setPoints] = useState<any>([])
  const [pointsWithCategory, setPointsWithCategory] = useState<any>([])

  const updateCategory = (category: string) => {
    setDoLoop(false)
    setCategory(category)
    const index = categories.findIndex((el) => el === category)
    console.log("category", category)
    console.log("found index:", index)
    setLoopCategoryIndex(index)
  }

  useEffect(() => {
    const FetchData = async () => {
      try {
        const response = await fetch('/data/heatmaps_data.json')
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`)
        }
        const result = await response.json()
        let filteredData = []
        let filteredData1 = []
        let newCategories: string[] = []

        for (let i = 0; i < result.length; i++) {
          const obj = [result[i].latitude, result[i].longitude, 0.5]
          const obj1 = [result[i].latitude, result[i].longitude, 0.5, result[i].harassment_type]
          const categoryType = result[i].harassment_type

          if (!newCategories.find((el) => el === categoryType)) {
            newCategories.push(categoryType)
            console.log("added category:", categoryType)
          }
          filteredData.push(obj)
          filteredData1.push(obj1)
        }

        setCategories(newCategories)
        setPoints(filteredData)
        setPointsWithCategory(filteredData1)
        console.log("final categories:", newCategories)
      } catch (error) {
        console.error(error)
      }
    }
    FetchData()
  }, [])

  useEffect(() => {
    if (!doLoop) return;
    const intervalId = setInterval(() => {
      setLoopCategoryIndex((prevIndex) => {
        const allOptions = ["all", ...categories];
        const nextIndex = prevIndex === allOptions.length - 1 ? 0 : prevIndex + 1;
        const selectedCategory = allOptions[nextIndex];
        setCategory(selectedCategory);
        console.log("dbg:", selectedCategory);
        console.log("dbg:", nextIndex);
        return nextIndex;
      });
    }, 5000);
    return () => clearInterval(intervalId);
  }, [doLoop, categories]);

  const selectedPoints = useMemo(() => {
    if (category === "all") {
      return points;
    }
    return pointsWithCategory
      .filter((point: any) => point[3] === category)
      .map((point: any) => [point[0], point[1], point[2]]);
  }, [category, points, pointsWithCategory]);

  return (
    <div className="w-full">
      <div className="flex justify-between gap-2 p-2">
        <div>
          <Button onClick={(() => updateCategory("all"))}
            className={category === "all" ? "" : "bg-white text-black hover:bg-gray-300"}
          >
            All
          </Button>
          {categories.length === 0 ? (
            <div></div>
          ) : (
            categories.map((cat) => (
              <Button
                key={cat}
                onClick={() => updateCategory(cat)}
                className={category === cat ? "" : "bg-white text-black hover:bg-gray-300"}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))
          )}
        </div>
        <Button
          className={doLoop ? "animate-pulse shadow-lg shadow-blue-500/50 bg-violet-400" : ""}
          onClick={() => setDoLoop(!doLoop)}
        >
          Cycle
        </Button>
      </div>
      <div className="h-[90vh]">
        <DynamicMap points={selectedPoints} />
      </div>
    </div>
  );
}