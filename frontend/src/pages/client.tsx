import { useGeolocation } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import useClient from "~/hooks/useClient";

export default function Client() {
  const [_, refresh] = useState(0);
  const geolocation = useGeolocation();
  const client = useClient();

  useEffect(() => {
    if (client) {
      const intervalId = setInterval(() => {
        client.publish("1", JSON.stringify({ type: "ping" }));
      }, 2500);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [client]);

  useEffect(() => {
    const { longitude, latitude } = geolocation;

    if (client && longitude && latitude) {
      const message: Message = {
        type: "location",
        data: {
          lat: latitude,
          lng: longitude,
        },
      };

      client.publish("1", JSON.stringify(message));
    }
  }, [client, geolocation]);

  useEffect(() => {
    refresh((s) => s +  1);
  }, []);

  return <main>hello</main>;
}
