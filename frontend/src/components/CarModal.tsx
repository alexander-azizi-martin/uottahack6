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
import useCarStore from "~/hooks/useCarStore";

interface AddCarModalProps {
  onNewCar: (car: Car) => void;
}

export default function AddCarModal(props: AddCarModalProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const { addCar } = useCarStore();
  const form = useForm({
    initialValues: {
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
        <form
          onSubmit={form.onSubmit(async (values) => {
            const car = await (
              await fetch("http://localhost:8000/cars", {
                method: "POST",
                body: JSON.stringify(values),
                headers: { "Content-Type": "application/json" },
              })
            ).json();

            addCar(car);
            form.reset();
            close();
            props?.onNewCar(car);
          })}
        >
          <Stack>
            <NumberInput
              label="Milage"
              placeholder="Milage"
              {...form.getInputProps("milage")}
            />
            <NumberInput
              label="Miles Driven"
              placeholder="Miles Driven"
              {...form.getInputProps("milesDriven")}
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
