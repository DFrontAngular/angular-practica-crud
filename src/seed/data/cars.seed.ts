import { StoredCar } from '../../cars/entities/car.entity';
import { v4 as uuid } from 'uuid';

export const CARS_SEED: StoredCar[] = [
  {
    brandId: 'brand-1',
    modelId: 'model-1',
    brand: {
      id: 'brand-1',
      name: 'Toyota',
    },
    model: {
      id: 'model-1',
      name: 'Corolla',
    },
    id: uuid(),
    carDetails: [
      {
        registrationDate: '2022-05-15T10:01:35.288Z',
        mileage: 0,
        currency: 'USD',
        price: 20000,
        manufactureYear: 2020,
        availability: true,
        licensePlate: '1234 BBB',
        imageUrl:
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
      },
      {
        registrationDate: '2021-03-10T08:15:00.000Z',
        mileage: 30000,
        currency: 'EUR',
        price: 18000,
        manufactureYear: 2019,
        availability: false,
        licensePlate: '5678 DFG',
        imageUrl:
          'https://images.unsplash.com/photo-1494976388531-d1058494cdd8',
      },
    ],
  },
];
