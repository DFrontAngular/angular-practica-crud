import { Injectable, NotFoundException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { v4 as uuid } from 'uuid';

import {
  CreateCarDto,
  UploadCarDocumentDto,
  UploadedPracticeFile,
  UploadedCarDocumentResponseDto,
} from './dto';
import { Car, CarDetailEntity, CarSummary } from './entities';

import { brandsDB, modelsDB } from '../brands/data/brand.data';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';
import {
  CarSortField,
  GetCarsFilterDto,
  SortOrder,
} from './dto/get-cars-filter.dto';

@Injectable()
export class CarsService {
  // In-memory storage for cars
  private cars: Car[] = this.generateSeedData(50);

  /**
   * Curated Unsplash car photo IDs. The backend always resolves imageUrl
   * here so the frontend never has to deal with it.
   */
  private readonly carImageUrls: string[] = [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8',
    'https://images.unsplash.com/photo-1542362567-b058c03b46cf',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b',
    'https://images.unsplash.com/photo-1511919884226-fd3cad34687c',
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7',
    'https://images.unsplash.com/photo-1609521263047-f8f205293f24',
    'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023',
  ];

  /** Returns a random Unsplash car photo URL. */
  private getRandomCarImageUrl(): string {
    return this.carImageUrls[
      Math.floor(Math.random() * this.carImageUrls.length)
    ];
  }

  /**
   * Retrieves paginated and filtered cars.
   * @param filterDto - The filter and pagination options.
   * @returns A paginated response with filtered cars and metadata.
   */
  findAll(
    filterDto: GetCarsFilterDto = { page: 1, limit: 10 },
  ): PaginatedResponseDto<CarSummary> {
    const { page = 1, limit = 10 } = filterDto;
    const filteredCars = this.getFilteredCars(filterDto);

    const skip = (page - 1) * limit;
    const totalItems = filteredCars.length;

    const paginatedItems = filteredCars.slice(skip, skip + limit).map((car) => {
      const { carDetails, ...carWithoutDetails } = car;
      return {
        ...carWithoutDetails,
        total: carDetails?.length || 0,
      };
    });

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: paginatedItems,
      meta: {
        totalItems,
        itemCount: paginatedItems.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Generates a set of seed data for the dealership.
   * @param count - The number of cars to generate.
   * @returns An array of generated cars.
   */
  private generateSeedData(count: number): Car[] {
    const seedCars: Car[] = [];
    const colors = ['White', 'Black', 'Grey', 'Silver', 'Blue', 'Red'];
    const descriptions = [
      'Excellent condition, well maintained.',
      'Perfect for city driving, very fuel efficient.',
      'Luxury interior with all extras included.',
      'One previous owner, smoke-free environment.',
      'Ready for adventure, off-road capable.',
      'Sporty look with high performance engine.',
    ];
    const carImages = [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8',
      'https://images.unsplash.com/photo-1542362567-b058c03b46cf',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7',
    ];

    for (let i = 0; i < count; i++) {
      const brand = brandsDB[Math.floor(Math.random() * brandsDB.length)];
      const brandModels = modelsDB.filter((m) => m.brandId === brand.id);
      const model = brandModels[Math.floor(Math.random() * brandModels.length)];

      const consonants = 'BCDFGHJKLMNPRSTVWXYZ';
      const getRandomConsonant = () =>
        consonants[Math.floor(Math.random() * consonants.length)];

      seedCars.push({
        id: uuid(),
        brandId: brand.id,
        modelId: model.id,
        carDetails: [
          {
            availability: Math.random() > 0.3,
            currency: 'EUR',
            licensePlate: `${1000 + i} ${getRandomConsonant()}${getRandomConsonant()}${getRandomConsonant()}`,
            manufactureYear: 2015 + (i % 10),
            mileage: Math.floor(Math.random() * 100000),
            price: 15000 + Math.floor(Math.random() * 30000),
            registrationDate: new Date(
              2015 + (i % 10),
              i % 12,
              (i % 28) + 1,
            ).toISOString(),
            color: colors[i % colors.length],
            description: descriptions[i % descriptions.length],
            imageUrl: carImages[i % carImages.length],
          },
        ],
      });
    }
    return seedCars;
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
    const { carDetails, ...rest } = createCarDto;

    // Apply defaults to carDetails and assign a random Unsplash image.
    // The frontend sends a real file (multipart), but we mock storage
    // by always resolving to a curated Unsplash URL.
    const processedDetails: CarDetailEntity[] =
      carDetails?.map(
        (detail): CarDetailEntity => ({
          ...detail,
          availability: detail.availability ?? true,
          currency: detail.currency ?? 'EUR',
          imageUrl: this.getRandomCarImageUrl(),
        }),
      ) || [];

    const newCar: Car = {
      ...rest,
      carDetails: processedDetails,
      id: uuid(),
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
   */
  update(id: string, carToUpdate: CreateCarDto): Car {
    const carDB = this.findOne(id);
    const { carDetails, ...rest } = carToUpdate;

    // Apply defaults to carDetails if provided.
    // The client never sends imageUrl; we always assign a random Unsplash URL.
    const processedDetails = carDetails?.map(
      (detail): CarDetailEntity => ({
        ...detail,
        availability: detail.availability ?? true,
        currency: detail.currency ?? 'EUR',
        imageUrl: this.getRandomCarImageUrl(),
      }),
    );

    const updatedCar = {
      ...carDB,
      ...rest,
      ...(processedDetails && { carDetails: processedDetails }),
      id,
    };
    const carIndex = this.cars.findIndex((car) => car.id === id);
    this.cars[carIndex] = updatedCar;

    return updatedCar;
  }

  uploadDocument(
    id: string,
    uploadDocumentDto: UploadCarDocumentDto,
    file: UploadedPracticeFile,
  ): UploadedCarDocumentResponseDto {
    this.findOne(id);

    return {
      id: uuid(),
      carId: id,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      documentType: uploadDocumentDto.documentType ?? 'other',
      title: uploadDocumentDto.title?.trim() || undefined,
      description: uploadDocumentDto.description?.trim() || undefined,
      uploadedAt: new Date().toISOString(),
      persisted: false,
      message:
        'The file was received as multipart/form-data and processed in memory, but it was not stored.',
    };
  }

  async exportCarsToExcel(
    filterDto: GetCarsFilterDto = { page: 1, limit: 10 },
  ): Promise<{
    fileName: string;
    content: Buffer;
  }> {
    const exportedCars = this.getFilteredCars(filterDto);
    const rows = exportedCars.map((car) => {
      const detail = this.getMatchingCarDetail(car, filterDto);

      return {
        brand: this.getBrandName(car.brandId),
        model: this.getModelName(car.modelId),
        licensePlate: detail?.licensePlate ?? '',
        manufactureYear: detail?.manufactureYear ?? '',
        registrationDate: detail?.registrationDate ?? '',
        price: detail?.price ?? '',
        currency: detail?.currency ?? '',
        mileage: detail?.mileage ?? '',
        available: detail?.availability ? 'Yes' : 'No',
        color: detail?.color ?? '',
        description: detail?.description ?? '',
        totalDetails: car.carDetails?.length ?? 0,
      };
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'car-dealership backend';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Cars');

    worksheet.columns = [
      { header: 'Brand', key: 'brand', width: 18 },
      { header: 'Model', key: 'model', width: 22 },
      { header: 'License Plate', key: 'licensePlate', width: 18 },
      { header: 'Manufacture Year', key: 'manufactureYear', width: 18 },
      { header: 'Registration Date', key: 'registrationDate', width: 24 },
      { header: 'Price', key: 'price', width: 14 },
      { header: 'Currency', key: 'currency', width: 12 },
      { header: 'Mileage', key: 'mileage', width: 14 },
      { header: 'Available', key: 'available', width: 12 },
      { header: 'Color', key: 'color', width: 14 },
      { header: 'Description', key: 'description', width: 40 },
      { header: 'Total Details', key: 'totalDetails', width: 14 },
    ];

    worksheet.addRows(rows);

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1F4E78' },
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.views = [{ state: 'frozen', ySplit: 1 }];
    worksheet.autoFilter = {
      from: 'A1',
      to: 'L1',
    };

    const priceColumn = worksheet.getColumn('price');
    priceColumn.numFmt = '#,##0.00';

    const buffer = await workbook.xlsx.writeBuffer();

    return {
      fileName: `cars-export-${new Date().toISOString().slice(0, 10)}.xlsx`,
      content: Buffer.from(buffer),
    };
  }

  /**
   * Populates the car storage with an array of car objects (used for seeding data).
   * @param car - The array of car objects to fill the storage.
   */
  fillSeedData(car: Car[]): void {
    this.cars = car;
  }

  /**
   * Checks if a car with the same license plate already exists.
   * @param licensePlate - The license plate to check for duplicates.
   * @param excludeId - (Optional) The ID of the car to exclude from the check.
   * @returns True if the license plate is already taken, false otherwise.
   */
  isLicensePlateTaken(licensePlate: string, excludeId?: string): boolean {
    return this.cars.some((car) =>
      car.carDetails.some(
        (carDetail) =>
          carDetail.licensePlate === licensePlate && car.id !== excludeId,
      ),
    );
  }

  private getFilteredCars(filterDto: GetCarsFilterDto): Car[] {
    const {
      brandId,
      modelId,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      available,
      licensePlate,
      sortBy,
      sortOrder = 'asc',
    } = filterDto;

    let filteredCars = this.cars.filter((car) => {
      if (brandId && car.brandId !== brandId) return false;
      if (modelId && car.modelId !== modelId) return false;

      return car.carDetails.some((detail) => {
        if (minPrice !== undefined && detail.price < minPrice) return false;
        if (maxPrice !== undefined && detail.price > maxPrice) return false;
        if (minYear !== undefined && detail.manufactureYear < minYear)
          return false;
        if (maxYear !== undefined && detail.manufactureYear > maxYear)
          return false;
        if (
          available !== undefined &&
          detail.availability !== (String(available) === 'true')
        )
          return false;
        if (
          licensePlate &&
          !detail.licensePlate
            .toLowerCase()
            .includes(licensePlate.toLowerCase())
        )
          return false;
        return true;
      });
    });

    if (sortBy) {
      filteredCars = [...filteredCars].sort((leftCar, rightCar) =>
        this.compareCars(leftCar, rightCar, sortBy, sortOrder, filterDto),
      );
    }

    return filteredCars;
  }

  private compareCars(
    leftCar: Car,
    rightCar: Car,
    sortBy: CarSortField,
    sortOrder: SortOrder,
    filterDto: GetCarsFilterDto,
  ): number {
    const direction = sortOrder === 'desc' ? -1 : 1;
    const leftValue = this.getSortableValue(leftCar, sortBy, filterDto);
    const rightValue = this.getSortableValue(rightCar, sortBy, filterDto);

    if (leftValue === rightValue) {
      return leftCar.id.localeCompare(rightCar.id) * direction;
    }

    if (leftValue === undefined || leftValue === null) return 1;
    if (rightValue === undefined || rightValue === null) return -1;

    if (typeof leftValue === 'boolean' && typeof rightValue === 'boolean') {
      return (Number(leftValue) - Number(rightValue)) * direction;
    }

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return (leftValue - rightValue) * direction;
    }

    return (
      String(leftValue).localeCompare(String(rightValue), 'es', {
        sensitivity: 'base',
      }) * direction
    );
  }

  private getSortableValue(
    car: Car,
    sortBy: CarSortField,
    filterDto: GetCarsFilterDto,
  ): string | number | boolean | undefined {
    const matchingDetail = this.getMatchingCarDetail(car, filterDto);

    switch (sortBy) {
      case 'brandId':
        return this.getBrandName(car.brandId);
      case 'modelId':
        return this.getModelName(car.modelId);
      case 'total':
        return car.carDetails?.length ?? 0;
      case 'price':
        return matchingDetail?.price;
      case 'manufactureYear':
        return matchingDetail?.manufactureYear;
      case 'registrationDate':
        return matchingDetail?.registrationDate;
      case 'mileage':
        return matchingDetail?.mileage;
      case 'licensePlate':
        return matchingDetail?.licensePlate;
      case 'availability':
        return matchingDetail?.availability;
      default:
        return undefined;
    }
  }

  private getMatchingCarDetail(
    car: Car,
    filterDto: GetCarsFilterDto,
  ): CarDetailEntity | undefined {
    const { minPrice, maxPrice, minYear, maxYear, available, licensePlate } =
      filterDto;

    return (
      car.carDetails.find((detail) => {
        if (minPrice !== undefined && detail.price < minPrice) return false;
        if (maxPrice !== undefined && detail.price > maxPrice) return false;
        if (minYear !== undefined && detail.manufactureYear < minYear)
          return false;
        if (maxYear !== undefined && detail.manufactureYear > maxYear)
          return false;
        if (
          available !== undefined &&
          detail.availability !== (String(available) === 'true')
        )
          return false;
        if (
          licensePlate &&
          !detail.licensePlate
            .toLowerCase()
            .includes(licensePlate.toLowerCase())
        )
          return false;
        return true;
      }) ?? car.carDetails[0]
    );
  }

  private getBrandName(brandId: string): string {
    return brandsDB.find((brand) => brand.id === brandId)?.name ?? brandId;
  }

  private getModelName(modelId: string): string {
    return modelsDB.find((model) => model.id === modelId)?.name ?? modelId;
  }
}
