interface GeoLocation {
  lat: number;
  lng: number;
}

interface Car {
  id: number;
  distanceDriven: number;
  carbonEmitted: number;
  batteryCharge: number;
  batteryHealth: number;
  location?: GeoLocation;
  status: "online" | "offline";
}

type Message = { type: "location"; data: GeoLocation } | { type: "ping" };
