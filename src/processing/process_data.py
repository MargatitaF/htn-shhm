import pandas as pd
from geopy.geocoders import Nominatim
import time
import json

DEBUG = True # Enable or disable debugging

def load_data():
    """Load the incident data from a CSV file."""
    try:
        df = pd.read_csv("incidents_clean.csv", delimiter=';')
        return df
    except FileNotFoundError:
        print("Error: The file 'incidents_clean.csv' was not found.")

def combine_location(df):
    """Combine address components into a full address."""
    df['full_location'] = df['Street'] + ' ' + df['Number'].astype(str) + ', ' + df['Zip_code'].astype(str) + ' ' + df['Place']
    if DEBUG:
        print("Created full addresses. First few:")
        print(df['full_location'].head())
        print("-" * 20)
    return df

geolocator = Nominatim(user_agent="street-harassment-map-project")
incident_data = []

def geocode_location(df):
    """Geocode the full addresses in the DataFrame and collect detailed information."""
    for index, row in df.iterrows():
        retries = 3
        for attempt in range(1, retries + 1):
            try:
                location = geolocator.geocode(row['full_location'])
                if location:
                    incident_info = {
                        "situation_id": row['Situantion_id'],
                        "harassment_type": row['Harassment_type'] if pd.notna(row['Harassment_type']) else "",
                        "latitude": location.latitude,
                        "longitude": location.longitude,
                        "street": row['Street'],
                        "number": row['Number'],
                        "place": row['Place'],
                        "zip_code": row['Zip_code'],
                        "time": row['Time']
                    }
                    incident_data.append(incident_info)
                    if DEBUG:
                        print(f"SUCCESS: {row['full_location']} -> [{location.latitude}, {location.longitude}]")
                    break
                else:
                    print(f"WARNING: Could not find coordinates for: {row['full_location']}")
                    break
            except Exception as e:
                print(f"ERROR: Attempt {attempt} for {row['full_location']}: {e}")
                if attempt < retries:
                    time.sleep(2)
                else:
                    print(f"FAILED: Could not geocode {row['full_location']} after {retries} attempts.")
        time.sleep(1)
    return incident_data

def save_incident_data(df, incident_data):
    """Save the incident data with coordinates to a JSON file."""
    try:
        output_path = '../../public/data/heatmaps_data.json'
        with open(output_path, 'w') as f:
            json.dump(incident_data, f, indent=4)
        if DEBUG:
            print(f"Saved {len(incident_data)} incidents with coordinates to '{output_path}'.")
    except Exception as e:
        print(f"ERROR: Could not save incident data: {e}")

def main():
    """Main function to process incident data."""
    df = load_data()
    if df is not None:
        df = combine_location(df)
        incident_data = geocode_location(df)
        save_incident_data(df, incident_data)

if __name__ == "__main__":
    main()