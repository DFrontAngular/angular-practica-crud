import { Injectable, NotFoundException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import { join, extname } from 'path';
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

interface StoredCarDocument extends UploadedCarDocumentResponseDto {
  storagePath: string;
}

@Injectable()
export class CarsService {
  // In-memory storage for cars
  private cars: Car[];
  private readonly carDocuments = new Map<string, StoredCarDocument>();

  /**
   * Public image path catalog keyed by model id.
   * Files live under backend/public/images/car_images.
   */
  private readonly imageBasePath = '/images/car_images';

  private readonly carImagesByModelId: Record<string, string> = {
    'model-1': 'model-1_toyota_corolla.webp',
    'model-2': 'model-2_toyota_camry.webp',
    'model-3': 'model-3_toyota_prius.webp',
    'model-4': 'model-4_toyota_rav4.webp',
    'model-5': 'model-5_toyota_land_cruiser.webp',
    'model-6': 'model-6_ford_focus.webp',
    'model-7': 'model-7_ford_mustang.webp',
    'model-8': 'model-8_ford_escape.webp',
    'model-9': 'model-9_ford_explorer.webp',
    'model-10': 'model-10_ford_f150.webp',
    'model-11': 'model-11_honda_civic.webp',
    'model-12': 'model-12_honda_accord.webp',
    'model-13': 'model-13_honda_crv.webp',
    'model-14': 'model-14_bmw_x5.webp',
    'model-15': 'model-15_bmw_m3.webp',
    'model-16': 'model-16_mercedes_c_class.webp',
    'model-17': 'model-17_mercedes_e_class.webp',
    'model-18': 'model-18_chevrolet_camaro.webp',
    'model-19': 'model-19_chevrolet_silverado.webp',
    'model-20': 'model-20_nissan_altima.webp',
    'model-21': 'model-21_nissan_z.webp',
    'model-22': 'model-22_audi_a4.webp',
    'model-23': 'model-23_audi_q5.webp',
    'model-24': 'model-24_hyundai_tucson.webp',
    'model-25': 'model-25_hyundai_ioniq5.webp',
    'model-26': 'model-26_kia_sportage.webp',
    'model-27': 'model-27_kia_ev6.webp',
  };

  private readonly fallbackImageByBrandId: Record<string, string> = {
    'brand-1': 'model-1',
    'brand-2': 'model-6',
    'brand-3': 'model-11',
    'brand-4': 'model-14',
    'brand-5': 'model-16',
    'brand-6': 'model-18',
    'brand-7': 'model-20',
    'brand-8': 'model-22',
    'brand-9': 'model-24',
    'brand-10': 'model-26',
  };

  private readonly documentsRootPath = join(process.cwd(), 'uploads', 'cars');

  constructor() {
    fs.mkdirSync(this.documentsRootPath, { recursive: true });
    this.cars = this.generateSeedData(50);
  }

  private getImageUrlForCar(modelId: string, brandId: string): string {
    const exactImage = this.carImagesByModelId[modelId];
    if (exactImage) {
      return `${this.imageBasePath}/${exactImage}`;
    }

    const fallbackModelId = this.fallbackImageByBrandId[brandId];
    const fallbackImage = fallbackModelId
      ? this.carImagesByModelId[fallbackModelId]
      : undefined;

    return fallbackImage
      ? `${this.imageBasePath}/${fallbackImage}`
      : `${this.imageBasePath}/${this.carImagesByModelId['model-1']}`;
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
            imageUrl: this.getImageUrlForCar(model.id, brand.id),
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

    // Resolve the image from the local public catalog instead of relying
    // on client-provided image URLs.
    const processedDetails: CarDetailEntity[] =
      carDetails?.map(
        (detail): CarDetailEntity => ({
          ...detail,
          availability: detail.availability ?? true,
          currency: detail.currency ?? 'EUR',
          imageUrl: this.getImageUrlForCar(rest.modelId, rest.brandId),
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
    this.deleteStoredDocument(id);
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

    // Keep image resolution backend-owned and based on the selected model.
    const processedDetails = carDetails?.map(
      (detail): CarDetailEntity => ({
        ...detail,
        availability: detail.availability ?? true,
        currency: detail.currency ?? 'EUR',
        imageUrl: this.getImageUrlForCar(rest.modelId, rest.brandId),
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
    const carDirectory = join(this.documentsRootPath, id);
    fs.mkdirSync(carDirectory, { recursive: true });

    this.deleteStoredDocument(id);

    const documentId = uuid();
    const fileExtension = extname(file.originalname) || this.getExtensionFromMimeType(file.mimetype);
    const storedFileName = `${documentId}${fileExtension}`;
    const storagePath = join(carDirectory, storedFileName);

    fs.writeFileSync(storagePath, file.buffer);

    const document: StoredCarDocument = {
      id: documentId,
      carId: id,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      documentType: uploadDocumentDto.documentType ?? 'other',
      title: uploadDocumentDto.title?.trim() || undefined,
      description: uploadDocumentDto.description?.trim() || undefined,
      uploadedAt: new Date().toISOString(),
      persisted: true,
      downloadUrl: `/cars/${id}/documents/download`,
      message:
        'The file was stored on disk and replaced any previous document linked to the vehicle.',
      storagePath,
    };

    this.carDocuments.set(id, document);

    return this.toDocumentResponse(document);
  }

  getDocumentMetadata(id: string): UploadedCarDocumentResponseDto {
    this.findOne(id);

    const document = this.carDocuments.get(id);
    if (!document) {
      throw new NotFoundException(`Car with id ${id} has no uploaded document`);
    }

    return this.toDocumentResponse(document);
  }

  getDocumentForDownload(id: string): StoredCarDocument {
    this.findOne(id);

    const document = this.carDocuments.get(id);
    if (!document || !fs.existsSync(document.storagePath)) {
      throw new NotFoundException(`Car with id ${id} has no uploaded document`);
    }

    return document;
  }

  removeDocument(id: string): void {
    this.findOne(id);

    const document = this.carDocuments.get(id);
    if (!document || !fs.existsSync(document.storagePath)) {
      throw new NotFoundException(`Car with id ${id} has no uploaded document`);
    }

    this.deleteStoredDocument(id);
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

  private deleteStoredDocument(carId: string): void {
    const existingDocument = this.carDocuments.get(carId);
    if (!existingDocument) {
      return;
    }

    if (fs.existsSync(existingDocument.storagePath)) {
      fs.unlinkSync(existingDocument.storagePath);
    }

    const carDirectory = join(this.documentsRootPath, carId);
    if (fs.existsSync(carDirectory)) {
      const remainingFiles = fs.readdirSync(carDirectory);
      if (remainingFiles.length === 0) {
        fs.rmdirSync(carDirectory);
      }
    }

    this.carDocuments.delete(carId);
  }

  private getExtensionFromMimeType(mimeType: string): string {
    const extensionByMimeType: Record<string, string> = {
      'application/pdf': '.pdf',
      'text/plain': '.txt',
      'application/msword': '.doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        '.docx',
      'image/png': '.png',
      'image/jpeg': '.jpg',
    };

    return extensionByMimeType[mimeType] ?? '';
  }

  private toDocumentResponse(
    document: StoredCarDocument,
  ): UploadedCarDocumentResponseDto {
    const { storagePath: _storagePath, ...publicDocument } = document;
    return publicDocument;
  }
}
