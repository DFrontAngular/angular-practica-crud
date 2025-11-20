import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { CarDetailsDto, CreateCarDto } from './dto';
import { Car, CarSummary } from './entities';

@Injectable()
export class CarsService {
  // In-memory storage for cars
  private cars: Car[] = [
    {
      brand: 'Toyota',
      model: 'Corolla',
      id: uuid(),
      total: 1,
      carDetails: [
        {
          availability: true,
          currency: 'USD',
          licensePlate: '1111 BBB',
          manufactureYear: new Date().getFullYear(),
          mileage: 30_000,
          price: 25_000,
          registrationDate: new Date().toISOString(),
        },
        {
          availability: false,
          currency: 'EUR',
          licensePlate: '2222 CCC',
          manufactureYear: new Date().getFullYear(),
          mileage: 0,
          price: 40_000,
          registrationDate: new Date().toISOString(),
        },
      ],
    },
  ];

  /**
   * Retrieves all cars, with the added property 'total' which is the count of carDetails.
   * @returns A list of all cars with the total car details count.
   */
  findAll(): CarSummary[] {
    return this.cars.map((car) => {
      const { carDetails, ...carWithoutDetails } = car;
      return {
        ...carWithoutDetails,
        total: carDetails?.length || 0,
      };
    });
  }

  /**
   * Finds a car by its ID.
   * @param id - The unique identifier of the car.
   * @returns The car object with its details and the total count of car details.
   * @throws NotFoundException if the car with the given ID does not exist.
   */
  findOne(id: string): Car {
    const car = this.cars.find((car) => car.id === id);
    if (!car) throw new NotFoundException(`Car with id ${id} not found`);
    return { ...car, total: car.carDetails.length || 0 };
  }

  /**
   * Creates a new car using the provided car data.
   * @param createCarDto - The DTO containing the car data to create a new car.
   * @returns The newly created car object.
   */
  create(createCarDto: CreateCarDto): Car {
    this.validateCarDetails(
      createCarDto.carDetails,
      createCarDto.brand,
      createCarDto.model,
    );

    const newCar: Car = {
      ...createCarDto,
      id: uuid(), // Generates a unique ID for the new car
      total: this.cars.length + 1, // Set the total car details
    };
    this.cars.push(newCar);
    return newCar;
  }

  /**
   * Removes a car from the list by its ID.
   * @param id - The unique identifier of the car to be removed.
   * @returns The car that was removed.
   * @throws NotFoundException if the car with the given ID does not exist.
   */
  remove(id: string): Car {
    const carToDelete = this.findOne(id);
    this.cars = this.cars.filter((car) => car.id !== id);
    return carToDelete;
  }

  /**
   * Updates a car with the provided ID and new data.
   * @param id - The ID of the car to update.
   * @param carToUpdate - The DTO containing the new data for the car.
   * @returns The updated car object.
   * @throws NotFoundException if the car with the given ID does not exist.
   */
  update(id: string, carToUpdate: CreateCarDto): Car {
    const carDB = this.findOne(id);

    this.validateCarDetails(
      carToUpdate.carDetails,
      carToUpdate.brand,
      carToUpdate.model,
      id,
    );

    const updatedCar = {
      ...carDB,
      ...carToUpdate,
      id,
    };
    const carIndex = this.cars.findIndex((car) => car.id === id);
    this.cars[carIndex] = updatedCar;

    return updatedCar;
  }

  /**
   * Populates the car storage with an array of car objects (used for seeding data).
   * @param car - The array of car objects to fill the storage.
   */
  fillSeedData(car: Car[]): void {
    this.cars = car;
  }

  /**
   * Validates the car details including brand, model, license plate, and manufacture year.
   * @param carDetails - An array of car details to validate.
   * @param brand - The brand of the car.
   * @param model - The model of the car.
   * @param id - (Optional) The ID of the car to exclude from validation checks.
   * @throws ConflictException if a duplicate car or license plate is found.
   * @throws BadRequestException if the manufacture year is later than the registration date.
   */
  private validateCarDetails(
    carDetails: CarDetailsDto[] | undefined,
    brand: string,
    model: string,
    id?: string,
  ): void {
    this.validateDuplicateLicensePlateWithinSelfDetail(carDetails);
    this.validateDuplicateCar(brand, model, id);

    carDetails?.forEach((detail) => {
      this.validateDuplicateLicensePlate(detail.licensePlate, id);
      this.validateManufactureYear(
        detail.manufactureYear,
        detail.registrationDate,
        detail.licensePlate,
      );
    });
  }

  /**
   * Validates if there is already a car with the same brand and model, excluding the current car if ID is provided.
   * @param brand - The brand of the car.
   * @param model - The model of the car.
   * @param id - (Optional) The ID of the car to exclude from the check.
   * @throws ConflictException if a car with the same brand and model already exists.
   */
  private validateDuplicateCar(
    brand: string,
    model: string,
    id?: string,
  ): void {
    const existingCar = this.cars.find(
      (car) => car.id !== id && car.brand === brand && car.model === model,
    );
    if (existingCar) {
      throw new ConflictException(
        `A car with the same brand (${brand}) and model (${model}) already exists.`,
      );
    }
  }

  /**
   * Validates if a car with the same license plate already exists, excluding the current car if ID is provided.
   * @param licensePlate - The license plate to check for duplicates.
   * @param id - (Optional) The ID of the car to exclude from the check.
   * @throws ConflictException if a car with the same license plate already exists.
   */
  private validateDuplicateLicensePlate(
    licensePlate: string,
    id?: string,
  ): void {
    const existingCarWithPlate = this.cars.find((car) =>
      car.carDetails.some(
        (carDetail) => carDetail.licensePlate === licensePlate && car.id !== id,
      ),
    );

    if (existingCarWithPlate) {
      throw new ConflictException(
        `A car with the license plate ${licensePlate} already exists.`,
      );
    }
  }

  /**
   * Validates if a car with the same license plate already exists whiting the carDetails object.
   * @param carDetail - The car details object to check for duplicates.
   * @throws ConflictException if a car with the same license plate already exists.
   */
  private validateDuplicateLicensePlateWithinSelfDetail(
    carDetail: CarDetailsDto[],
  ) {
    const existingCarWithPlate = carDetail.length;
    const plates = carDetail.map((car) => car.licensePlate);
    const platesSet = new Set([...plates]);

    if (existingCarWithPlate !== platesSet.size) {
      throw new ConflictException(
        `A car with the license plate already exists.`,
      );
    }
  }

  /**
   * Validates that the car's manufacture year is not later than the registration date.
   * @param manufactureYear - The manufacture year of the car.
   * @param registrationDate - The registration date of the car.
   * @param licensePlate - The license plate of the car (used for error messages).
   * @throws BadRequestException if the manufacture year is later than the registration date.
   */
  private validateManufactureYear(
    manufactureYear: number,
    registrationDate: string,
    licensePlate: string,
  ): void {
    const manufactureDate = new Date(manufactureYear, 0, 1);
    const regDate = new Date(registrationDate);

    if (manufactureDate > regDate) {
      throw new BadRequestException(
        `Manufacture year ${manufactureYear} in the car with license plate ${licensePlate} cannot be later than registration date ${registrationDate}.`,
      );
    }
  }
}
