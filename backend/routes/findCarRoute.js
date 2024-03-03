const mysql = require("mysql2/promise");

const chooseCar = (cars, endLongitude, endLatitude) => {
  let closestCar = cars[0];
  let min_distance = Infinity;
  cars.forEach((car) => {
    euclidean_distance = Math.sqrt(
      (endLongitude - car.last_recorded_location.longitude) ** 2 +
        (endLatitude - car.last_recorded_location.latitude) ** 2
    );
    if (euclidean_distance < min_distance) {
      min_distance = euclidean_distance;
      closestCar = car;
    }
  });
  return closestCar;
};

const express = require("express");

const router = express.Router();

router.get("/findCarRoute", async (req, res) => {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    const [cars] = await connection.query("SELECT * FROM Cars");
    connection.end();
    const closestCar = chooseCar(cars, req.query.startLong, req.query.startLat);

    const reqBody = {
      origin: {
        location: {
          latLng: {
            latitude: closestCar.last_recorded_location.latitude,
            longitude: closestCar.last_recorded_location.longitude,
          },
        },
      },
      destination: {
        location: {
          latLng: {
            latitude: req.query.endLat,
            longitude: req.query.endLong,
          },
        },
      },
      intermediates: [
        {
          location: {
            latLng: {
              latitude: req.query.startLat,
              longitude: req.query.startLong,
            },
          },
        },
      ],
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE",
    };

    const response = await fetch(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
          "X-Goog-FieldMask":
            "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
        },
        body: JSON.stringify(reqBody),
      }
    );
    const data = await response.json();
    console.log(data)
    res.json(data)
  } catch (error) {
    console.log(error)
    res.json({ ...error });
  }
});

module.exports = router;
