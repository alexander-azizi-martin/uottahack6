import { Center, Container, Stack } from "@mantine/core";
import { useEffect, useRef } from "react";
import CarInfo from "~/components/CarInfo";
import useCarStore from "~/hooks/useCarStore";
import useClient from "~/hooks/useClient";
import CarModal from "~/components/CarModal";
import CarDispatch from "~/components/CarDispatch";

export default function Home() {
  const client = useClient();
  const { cars, timeout, ping, updateLocation, updateRoute } = useCarStore();
  const timeoutIds = useRef({} as any);

  useEffect(() => {
    if (client) {
      fetch("http://localhost:5000/cars");

      client.subscribe("1");

      client.on("message", (carId, message) => {
        const parsedMessage = JSON.parse(message.toString()) as Message;

        switch (parsedMessage.type) {
          case "route":
            updateRoute(carId, parsedMessage.data);

            break;
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
          <CarModal
            onNewCar={(car) => {
              client?.subscribe(car.id);
            }}
          />
        </Center>
      </Stack>
    </Container>
  );
}
