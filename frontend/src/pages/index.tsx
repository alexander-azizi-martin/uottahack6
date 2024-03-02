import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Center,
  Container,
  Flex,
  Group,
  Indicator,
  Modal,
  NumberInput,
  Progress,
  Skeleton,
  Slider,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useGeolocation } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";

export default function Home() {
  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({});
  const geolocation = useGeolocation();
  const [map, setMap] = useState<google.maps.Map>();
  const [marker, setMarker] = useState<google.maps.Marker>();
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    const { latitude, longitude } = geolocation;

    if (latitude && longitude) {
      if (!map || !marker) {
        const newMap = new google.maps.Map(
          document.getElementById("map-1") as HTMLElement,
          {
            center: { lat: latitude, lng: longitude },
            zoom: 15,
            fullscreenControl: false,
            gestureHandling: "none",
            mapTypeControl: false,
            streetViewControl: false,
          }
        );

        const newMarker = new google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: newMap,
        });

        setMap(newMap);
        setMarker(newMarker);
      } else {
        map.setCenter({ lat: latitude, lng: longitude });
        marker.setPosition({ lat: latitude, lng: longitude });
      }
    }
  }, [map, marker, geolocation]);
  console.log(placePredictions);
  return (
    <Container my={"md"}>
      <Center>
        <Group>
          <Autocomplete
            placeholder="Enter source location"
            onChange={(value) => {
              getPlacePredictions({ input: value });
            }}
          />
          <Box>to</Box>
          <Autocomplete
            placeholder="Enter target location"
            onChange={(value) => {
              getPlacePredictions({ input: value });
            }}
          />
          <Button>Dispatch</Button>
        </Group>
      </Center>
      <Stack mt={"lg"}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={3}>Car: 1</Title>
          <Flex justify={"space-between"} gap={"xl"}>
            <Stack flex={1}>
              <Group gap="xs">
                <Indicator color="green" processing />
                <Box pos={"relative"} bottom={"1px"}>
                  online
                </Box>
              </Group>
              <Box>
                <Text fw={700}>Distance Driven</Text>
                <Box>148 miles</Box>
              </Box>
              <Box>
                <Text fw={700}>Carbon Footprint</Text>
                <Box>130 tons</Box>
              </Box>
              <Box>
                <Text fw={700}>Battery Charge</Text>

                <Progress.Root size={"xl"} mt={8}>
                  <Progress.Section value={50}>
                    <Progress.Label>50%</Progress.Label>
                  </Progress.Section>
                </Progress.Root>
              </Box>
              <Box>
                <Text fw={700}>Battery Health</Text>

                <Progress.Root size={"xl"} mt={8}>
                  <Progress.Section value={90} color="green">
                    <Progress.Label>90%</Progress.Label>
                  </Progress.Section>
                </Progress.Root>
              </Box>
            </Stack>
            <Skeleton visible={geolocation.loading} w="300px" h="300px">
              <Box id="map-1" w="300px" h="300px"></Box>
            </Skeleton>
          </Flex>
        </Card>
        <Center>
          <Button onClick={open}>Add car</Button>
        </Center>
      </Stack>
      <Modal opened={opened} onClose={close} title="Add Car" centered>
        <TextInput label="Car Id" placeholder="Enter Car Id" />
        <NumberInput label="Miles Driven" placeholder="Input placeholder" />
        <Slider /> <Slider />
        <Button>Submit</Button>
      </Modal>
    </Container>
  );
}
