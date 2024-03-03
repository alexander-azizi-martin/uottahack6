import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { Box, Button, Group } from "@mantine/core";
import { useState } from "react";
import LocationAutoComplete from "~/components/LocationAutoComplete";

export default function CarDispatch() {
  const [sourceId, setSourceId] = useState<string>();
  const [sourceValue, setSourceValue] = useState<string>("");
  const [sourceError, setSourceError] = useState<string>();
  const [targetId, setTargetId] = useState<string>();
  const [targetValue, setTargetValue] = useState<string>("");
  const [targetError, setTargetError] = useState<string>();

  const handleDispatch = async () => {
    if (!sourceId) {
      setSourceError("Must have a valid location");
    }
    if (!targetId) {
      setTargetError("Must have a valid location");
    }
    if (!sourceId || !targetId) {
      return;
    }

    setSourceValue("");
    setTargetValue("");
  };

  return (
    <Group>
      <LocationAutoComplete
        placeholder="Pickup location"
        onChange={(value) => {
          setSourceValue(value);
          setSourceError(undefined);
        }}
        onPlace={(placeId) => {
          setSourceId(placeId);
        }}
        error={sourceError}
        value={sourceValue}
      />
      <Box>to</Box>
      <LocationAutoComplete
        placeholder="Dropoff location"
        onChange={(value) => {
          setTargetValue(value);
          setTargetError(undefined);
        }}
        onPlace={(placeId) => {
          setTargetId(placeId);
        }}
        error={targetError}
        value={targetValue}
      />
      <Button onClick={handleDispatch}>Dispatch</Button>
    </Group>
  );
}
