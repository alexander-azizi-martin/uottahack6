import { useGeolocation } from "@uidotdev/usehooks";
import mqtt from "mqtt";
import { useEffect, useState } from "react";

export default function Client() {
  const geolocation = useGeolocation();
  const [client, setClient] = useState<mqtt.MqttClient>();

  useEffect(() => {
    const client = mqtt.connect(
      "ssl://mr-connection-e3dzpkhfy1t.messaging.solace.cloud:8883",
      {
        username: "solace-cloud-client",
        password: "vsn37cslsk4iadhehemlbkl9c7",
      }
    );

    setClient(client);

    return () => {
      client.end();
    };
  }, []);

  useEffect(() => {
    const { longitude, latitude } = geolocation;

    if (client && longitude && latitude) {
    }
  }, [client, geolocation]);

  return <main>hello</main>;
}
