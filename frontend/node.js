const mqtt = require("mqtt");
const client = mqtt.connect(
  "ssl://mr-connection-e3dzpkhfy1t.messaging.solace.cloud:8883",
  {
    username: "solace-cloud-client",
    password: "vsn37cslsk4iadhehemlbkl9c7",
  }
);

client.on("connect", () => {
  client.subscribe("presence", (err) => {
    if (!err) {
      for (let i = 0; i < 100; i++) {
        client.publish("presence", "Hello mqtt");
      }
    }
  });
});

client.on("message", (topic, message) => {
  // message is Buffer
  console.log(message.toString());
  client.end();
});
