import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { Autocomplete } from "@mantine/core";
import { useEffect, useState } from "react";

interface LocationAutoComplete {
  onPlace: (placeId?: string) => void;
  onChange: (value: string) => void;
  placeholder: string;
  value?: string;
  error?: string;
}

export default function LocationAutoComplete(props: LocationAutoComplete) {
  const { placePredictions, getPlacePredictions } = usePlacesService({
    debounce: 0,
  });
  const [value, setValue] = useState(props.value ?? "");

  useEffect(() => {
    if (props.value !== undefined) {
      setValue(props.value);
    }
  }, [props.value]);

  return (
    <Autocomplete
      w={"350px"}
      placeholder={props.placeholder}
      value={value}
      error={props.error}
      onChange={(newValue) => {
        setValue(newValue);

        if (value !== newValue) {
          getPlacePredictions({ input: newValue });
        }

        const place = placePredictions.find(
          (place) => place.description === newValue
        );

        if (place) {
          props.onPlace(place.place_id);
        } else {
          props.onPlace(undefined);
        }

        props.onChange(newValue);
      }}
      data={!!value ? placePredictions.map((place) => place.description) : []}
      comboboxProps={{ width: "600px" }}
    />
  );
}
