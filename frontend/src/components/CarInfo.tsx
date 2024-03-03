import {
  Box,
  Card,
  Flex,
  Group,
  Indicator,
  Progress,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";

interface CarInfoProps {
  car: Car;
}

export default function CarInfo({ car }: CarInfoProps) {
  const [map, setMap] = useState<google.maps.Map>();
  const [marker, setMarker] = useState<google.maps.Marker>();

  useEffect(() => {
    if (car.location) {
      if (!map || !marker) {
        const newMap = new google.maps.Map(
          document.getElementById("map-1") as HTMLElement,
          {
            center: car.location,
            zoom: 15,
            fullscreenControl: false,
            gestureHandling: "none",
            mapTypeControl: false,
            streetViewControl: false,
          }
        );

        const newMarker = new google.maps.Marker({
          position: car.location,
          map: newMap,
        });

        setMap(newMap);
        setMarker(newMarker);
      } else {
        map.setCenter(car.location);
        marker.setPosition(car.location);
      }
    }
  }, [map, marker, car.location]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={3}>Car {car.id}</Title>
      <Flex justify={"space-between"} gap={"xl"}>
        <Stack flex={1}>
          {car.status === "online" ? (
            <Group gap="xs">
              <Indicator color="green" processing />
              <Box pos={"relative"} bottom={"1px"}>
                online
              </Box>
            </Group>
          ) : (
            <Group gap="xs">
              <Indicator color="grey" />
              <Box pos={"relative"} bottom={"1px"}>
                offline
              </Box>
            </Group>
          )}
          <Box>
            <Text fw={700}>Distance Driven</Text>
            <Box>{car.distanceDriven} miles</Box>
          </Box>
          <Box>
            <Text fw={700}>Carbon Footprint</Text>
            <Box>{car.carbonEmitted} tons</Box>
          </Box>
          <Box>
            <Text fw={700}>Battery Charge</Text>

            <Progress.Root size={"xl"} mt={8}>
              <Progress.Section
                value={car.batteryCharge}
                color={valueToColor(car.batteryCharge)}
              >
                <Progress.Label>{car.batteryCharge}%</Progress.Label>
              </Progress.Section>
            </Progress.Root>
          </Box>
          <Box>
            <Text fw={700}>Battery Health</Text>

            <Progress.Root size={"xl"} mt={8}>
              <Progress.Section
                value={car.batteryHealth}
                color={valueToColor(car.batteryHealth)}
              >
                <Progress.Label>{car.batteryHealth}%</Progress.Label>
              </Progress.Section>
            </Progress.Root>
          </Box>
        </Stack>
        <Flex
          justify={"center"}
          align={"center"}
          w="300px"
          h="300px"
          bg={"grey"}
          c={"white"}
          display={car.location === undefined ? "flex" : "none"}
        >
          Location Not Known
        </Flex>
        <Box
          id="map-1"
          w="300px"
          h="300px"
          display={car.location !== undefined ? "block" : "none"}
        ></Box>
      </Flex>
    </Card>
  );
}

function valueToColor(value: number) {
  if (75 <= value && value <= 100) return "green";
  if (50 <= value && value < 75) return "blue";
  if (25 <= value && value < 50) return "yellow";
  if (0 <= value && value < 25) return "red";
}
