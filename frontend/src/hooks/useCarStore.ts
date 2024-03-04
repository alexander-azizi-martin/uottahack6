import { create } from "zustand";

interface State {
  cars: Car[];
}

interface Actions {
  addCar: (car: Car) => void;
  ping: (carId: string) => void;
  timeout: (carId: string) => void;
  updateRoute: (carId: string, route: string) => void;
  updateLocation: (carId: string, location: GeoLocation) => void;
}

const initialCars: Car[] = [
  {
    id: "EkANqm1pegqzPl9SEcn8G",
    batteryCharge: 90,
    batteryHealth: 70,
    milesDriven: 150,
    milage: 160,
    status: "offline",
    route: null,
    location: null,
  },
];

const useCarStore = create<State & Actions>((set) => ({
  cars: initialCars,
  addCar: (car) => set((state) => ({ cars: [...state.cars, car] })),
  ping: (carId) =>
    set((state) => ({
      cars: state.cars.map((car) =>
        car.id === carId ? { ...car, status: "online" } : car
      ),
    })),
  updateRoute: (carId, route) =>
    set((state) => ({
      cars: state.cars.map((car) =>
        car.id === carId ? { ...car, route: route } : car
      ),
    })),
  timeout: (carId) =>
    set((state) => ({
      cars: state.cars.map((car) =>
        car.id === carId ? { ...car, status: "offline", location: null } : car
      ),
    })),
  updateLocation: (carId, location) =>
    set((state) => ({
      cars: state.cars.map((car) =>
        car.id === carId ? { ...car, location } : car
      ),
    })),
}));

export default useCarStore;
