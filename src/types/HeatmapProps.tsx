export type HeatmapProps = {
  points: [number, number, number][]; // [lat, lng, intensity]
  zoomLocation: [number, number, number]
};


// A simple heatmap point: [latitude, longitude, weight]
export type HeatmapPoint = [number, number, number];

// A categorized heatmap point: [latitude, longitude, weight, harassment_type]
export type CategorizedHeatmapPoint = [number, number, number, string];


