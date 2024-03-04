interface GeoLocation {
  lat: number;
  lng: number;
}

interface Car {
  id: string;
  milage: number;
  milesDriven: number;
  batteryCharge: number;
  batteryHealth: number;
  route: any | null;
  location: GeoLocation | null;
  status: "online" | "offline";
}

type Message =
  | { type: "location"; data: GeoLocation }
  | { type: "ping" }
  | { type: "route"; data: string };
