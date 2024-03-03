import { create } from "zustand";

interface State {
  cars: Car[];
}

interface Actions {
  ping: (carId: number) => void;
  timeout: (cardId: number) => void;
  updateLocation: (cardId: number, location: GeoLocation) => void;
}

const initialCars: Car[] = [
  {
    id: 1,
    batteryCharge: 90,
    batteryHealth: 70,
    carbonEmitted: 130,
    distanceDriven: 150,
    status: "offline",
    location: undefined,
  },
];

const useCarStore = create<State & Actions>((set) => ({
  cars: initialCars,
  ping: (cardId: number) =>
    set((state) => ({
      cars: state.cars.map((car) =>
        car.id === cardId ? { ...car, status: "online" } : car
      ),
    })),
  timeout: (cardId: number) =>
    set((state) => ({
      cars: state.cars.map((car) =>
        car.id === cardId
          ? { ...car, status: "offline", location: undefined }
          : car
      ),
    })),
  updateLocation: (cardId: number, location: GeoLocation) =>
    set((state) => ({
      cars: state.cars.map((car) =>
        car.id === cardId ? { ...car, location } : car
      ),
    })),
}));

export default useCarStore;
