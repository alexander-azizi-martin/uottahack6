import { useGeolocation } from "@uidotdev/usehooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useClient from "~/hooks/useClient";

export default function Client() {
  const router = useRouter();
  const [_, refresh] = useState(0);
  const geolocation = useGeolocation();
  const client = useClient();

  const carId = router.query.id as string;

  useEffect(() => {
    if (client && carId) {
      const intervalId = setInterval(() => {
        client.publish(carId, JSON.stringify({ type: "ping" }));
      }, 2500);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [client, carId]);

  useEffect(() => {
    const { longitude, latitude } = geolocation;

    if (client && carId && longitude && latitude) {
      const message: Message = {
        type: "location",
        data: {
          lat: latitude,
          lng: longitude,
        },
      };

      client.publish(carId, JSON.stringify(message));
    }
  }, [client, geolocation]);

  useEffect(() => {
    refresh((s) => s + 1);
  }, []);

  return <main>hello</main>;
}
