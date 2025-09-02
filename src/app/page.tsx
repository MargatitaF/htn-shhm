"use client";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useEffect } from "react";
import { points } from "@/data/points";

const DynamicMap = dynamic(() => import("@/app/Components/Heatmap"), {
  ssr: false,
});

export default function HomePage() {
  const [category, setCategory] = useState<string>("all");
  const [doLoop, setDoLoop] = useState(false)
  const categories = ["all", "catcalling", "groping", "stalking", "rape"];
  const [loopCategoryIndex, setLoopCategoryIndex] = useState(0)
  const updateCategory = (category:string) =>{
    setDoLoop(false)
    setCategory(category)
    const index = categories.findIndex((el)=> el === category)
    console.log("category",category)
    console.log("found index:",index)
    setLoopCategoryIndex(index)
  }

  useEffect(() => {
    if (!doLoop) return;

    const intervalId = setInterval(() => {
      setLoopCategoryIndex((prevIndex) => {
        const nextIndex = prevIndex === categories.length - 1 ? 0 : prevIndex + 1;
        const category = categories[nextIndex];
        setCategory(category);
        console.log("dbg:", category);
        console.log("dbg:", nextIndex);
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [doLoop, categories]);
  

  const selectedPoints = useMemo(() => {
    if (category === "all") {
      return Object.values(points).flat();
    }
    return points[category as keyof typeof points];
  }, [category]);


  return (
    <div className="w-full">
      <div className="flex justify-between gap-2 p-2">
        <div>
          {categories.map((cat) => (
            <Button
              key={cat}
              onClick={() => updateCategory(cat)}
              className={category === cat ? "" : "bg-white text-black hover:bg-gray-300"}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>
        <Button className={doLoop ? "animate-pulse shadow-lg shadow-blue-500/50 bg-violet-400" : ""} onClick={()=>setDoLoop(!doLoop)}>Cycle</Button>
      </div>

      <div className="h-[90vh]">
        <DynamicMap points={selectedPoints} />
      </div>
    </div>
  );
}
