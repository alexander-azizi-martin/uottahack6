import { Center, Container, Stack } from "@mantine/core";
import { useEffect, useRef } from "react";
import CarInfo from "~/components/CarInfo";
import useCarStore from "~/hooks/useCarStore";
import useClient from "~/hooks/useClient";
import CarModal from "~/components/CarModal";
import CarDispatch from "~/components/CarDispatch";

export default function Home() {
  const client = useClient();
  const { cars, timeout, ping, updateLocation } = useCarStore();
  const timeoutIds = useRef({} as any);

  useEffect(() => {
    if (client) {
      client.subscribe("1");

      client.on("message", (topic, message) => {
        console.log(topic, message.toString());
        const carId = parseInt(topic);
        const parsedMessage = JSON.parse(message.toString()) as Message;

        switch (parsedMessage.type) {
          case "location":
            updateLocation(carId, parsedMessage.data);

            break;
          case "ping":
            if (carId in timeoutIds.current) {
              clearTimeout(timeoutIds.current[carId]);
            }

            timeoutIds.current[carId] = setTimeout(() => {
              timeout(carId);
              timeoutIds.current[carId] = null;
            }, 5000);

            ping(carId);

            break;
          default:
            break;
        }
      });
    }
  }, [client]);

  return (
    <Container my={"md"}>
      <Center>
        <CarDispatch />
      </Center>
      <Stack mt={"lg"}>
        {cars.map((car) => (
          <CarInfo car={car} key={car.id} />
        ))}
        <Center>
          <CarModal />
        </Center>
      </Stack>
    </Container>
  );
}
