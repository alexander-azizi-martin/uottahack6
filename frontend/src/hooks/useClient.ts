import mqtt from "mqtt";
import { useEffect, useState } from "react";

export default function useClient() {
  const [client, setClient] = useState<mqtt.MqttClient>();

  useEffect(() => {
    const client = mqtt.connect(
      "wss://mr-connection-e3dzpkhfy1t.messaging.solace.cloud:8443",
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

  return client;
}
