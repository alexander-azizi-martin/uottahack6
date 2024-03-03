import {
  Button,
  InputWrapper,
  Modal,
  NumberInput,
  Slider,
  Stack,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";

export default function AddCarModal() {
  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      carId: "",
      milesDriven: 0,
      milage: 0,
      batteryCharge: 0,
      batteryHealth: 0,
    },

    validate: {},
  });

  return (
    <>
      <Button onClick={open}>Add car</Button>
      <Modal opened={opened} onClose={close} title="Add Car" centered>
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <Stack>
            <TextInput
              label="Car Id"
              placeholder="Car Id"
              {...form.getInputProps("carId")}
            />
            <NumberInput
              label="Miles Driven"
              placeholder="Miles Driven"
              {...form.getInputProps("milesDriven")}
            />
            <NumberInput
              label="Milage"
              placeholder="Milage"
              {...form.getInputProps("milage")}
            />
            <InputWrapper label="Battery Charge" mb={16}>
              <Slider
                marks={[
                  { value: 20, label: "20%" },
                  { value: 50, label: "50%" },
                  { value: 80, label: "80%" },
                ]}
                {...form.getInputProps("batteryCharge")}
              />
            </InputWrapper>
            <InputWrapper label="Battery Health" mb={16}>
              <Slider
                marks={[
                  { value: 20, label: "20%" },
                  { value: 50, label: "50%" },
                  { value: 80, label: "80%" },
                ]}
                {...form.getInputProps("batteryHealth")}
              />
            </InputWrapper>
            <Button type="submit">Submit</Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
