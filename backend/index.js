import express from "express";
import loki from "lokijs";
import { nanoid } from "nanoid";
import mqtt from "mqtt";
import cors from "cors";

const app = express();
app.use(cors());

const db = new loki("database");
const cars = db.addCollection("cars", { unique: ["id"] });
const availableCars = cars.addDynamicView("available_cars");
availableCars.applyWhere(function aCustomFilter(car) {
  return car.status === "online" && car.route !== null;
});

const client = mqtt.connect(
  "ssl://mr-connection-e3dzpkhfy1t.messaging.solace.cloud:8883",
  {
    username: "solace-cloud-client",
    password: "vsn37cslsk4iadhehemlbkl9c7",
  }
);

const timeoutIds = {};
client.on("message", (carId, message) => {
  const parsedMessage = JSON.parse(message.toString());
  var car = cars.findOne({ id: carId });

  switch (parsedMessage.type) {
    case "location":
      car.status = "online";
      car.location = parsedMessage.data;

      break;
    case "ping":
      if (carId in timeoutIds) {
        clearTimeout(timeoutIds[carId]);
      }

      timeoutIds[carId] = setTimeout(() => {
        car.status = "offline";
        cars.location = null;
        cars.update(car);

        timeoutIds[carId] = null;
      }, 5000);

      car.status = "online";

      break;
    default:
      break;
  }

  cars.update(car);
});

app.use(express.json());

app.get("/cars", (req, res) => {
  res.send(cars.find());
});

app.post("/cars", (req, res) => {
  const car = {
    ...req.body,
    status: "offline",
    location: null,
    route: null,
    id: nanoid(),
  };

  client.subscribe(car.id);

  cars.insert(car);
  res.json(car);
});

app.post("/route", async (req, res) => {
  const { source, target } = req.body;

  const route = await (
    await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": "AIzaSyAJRKxCnvG61GDDq14TaIlVn635rO4jQYo",
        "X-Goog-FieldMask":
          "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
      },
      body: JSON.stringify({
        origin: {
          vehicleStopover: false,
          sideOfRoad: false,
          address: source,
        },
        destination: {
          vehicleStopover: false,
          sideOfRoad: false,
          address: target,
        },
        travelMode: "drive",
        routingPreference: "traffic_unaware",
        polylineQuality: "high_quality",
        computeAlternativeRoutes: false,
        routeModifiers: {
          avoidTolls: false,
          avoidHighways: false,
          avoidFerries: false,
          avoidIndoor: false,
        },
      }),
    })
  ).json();

  const cars = availableCars.data();

  if (cars.length === 0) {
    res.json({ error: "No cars available" });
  } else {
    const car = cars[0];
    car.route = route;
    client.publish(
      car.id,
      JSON.stringify({
        type: "route",
        data: route["routes"][0].polyline,
      })
    );

    cars.update(car);
    res.send(204);
  }
});

app.listen(8000, () => {
  console.log("listening on localhost:8000");
});
