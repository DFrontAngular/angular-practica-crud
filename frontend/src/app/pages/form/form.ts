import { Component, computed, effect, inject, signal, Signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarsService } from '../../../services/cars-service/cars-service';
import { BrandDao } from '../../../model/DAO/brand-dao';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CreateCarDetailsDto } from '../../../model/DTO/create-car-details';
import { regex } from '../../../utilities';
import { ActivatedRoute } from '@angular/router';
import { CreateCarDto } from '../../../model/DTO/create-car-dto';
import { CarDetailEntityDto } from '../../../model/DTO/car-detail-entity-dto';
import { toSignal } from '@angular/core/rxjs-interop';

type CreateCarDetailsFormGroup = FormGroup<{
  registrationDate: FormControl<string>,
  mileage: FormControl<number>,
  currency: FormControl<string>,
  price: FormControl<number>,
  manufactureYear: FormControl<number>,
  availability: FormControl<boolean>,
  color: FormControl<string>,
  description: FormControl<string>,
  licensePlate: FormControl<string>
}>;

@Component({
  selector: 'app-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form {
  private fb = inject(FormBuilder).nonNullable;
  private carsService = inject(CarsService);

  carId: string|null = null;
  title: string = 'Create Car';

  error = signal<HttpErrorResponse|null>(null);
  loading = signal(false);
  brands = signal<BrandDao[]>([]);
  currencies = this.carsService.getCurrencyCodes();
  
  form = this.fb.group({
    brandId: this.fb.control<string>(
      '',
      Validators.required
    ),
    modelId: this.fb.control<string>(
      '',
      Validators.required
    ),
    carDetails: this.fb.array<CreateCarDetailsFormGroup>([])
  });

  brandIdSignal = toSignal(
    this.form.get('brandId')!.valueChanges,
    { initialValue: this.form.get('brandId')!.value }
  );

  currenBrandId = computed(()=>this.brandIdSignal());
  currentBrand = computed(()=>{
    return this.brands().find(b => b.id == this.currenBrandId());
  });
  
  constructor (private route: ActivatedRoute) {
    effect(()=>{
      if (this.currentBrand() == null) this.form.get('modelId')?.disable();
      else this.form.get('modelId')?.enable();
    });

    this.carId = this.route.snapshot.paramMap.get('id');

    this.setTitle();
    this.loadBrands();
    this.loadCarInfo();
  }

  setTitle(){
    if (this.carId == null) this.title = 'Create Car';
    else this.title = 'Edit Car';
  }

  loadBrands(){
    this.loading.set(true);
    this.error.set(null);

    this.carsService.getBrands().subscribe({
      next: (brands) => {
        const requests = brands.map( brand => 
          this.carsService.getModelsByBrand(brand.id)
        )

        forkJoin(requests).subscribe({

          next: (modelArrays) => {
            this.brands.set( 
              brands.map<BrandDao>((brand, i) => ({
                id: brand.id,
                name: brand.name,
                models: modelArrays[i]
              }))
            )
          },

          error: (error) => {
            this.loading.set(false);
            this.error.set(error);
            this.brands.set([]);
          },

          complete: () => {
            this.loading.set(false);
            this.error.set(null);
          }

        })
      },
      
      error: (error) => {
        this.loading.set(false);
        this.error.set(error);
        this.brands.set([]);
      }
    });
  }

  loadCarInfo(){
    if (this.carId == null) return;

    this.carsService.getCarDetails(this.carId).subscribe({
      next: (car)=>{
        this.form.patchValue({
          brandId: car.brand.id,
          modelId: car.model.id
        });

        this.form.setControl(
          'carDetails',
          this.fb.array(
            car.carDetails.map(d => this.createCarDetailsFormGroup(d))
          )
        );
      }
    });
  }

  get carDetails(): FormArray<CreateCarDetailsFormGroup> {
    return this.form.get('carDetails') as FormArray<CreateCarDetailsFormGroup>;
  }

  createCarDetailsFormGroup(data?: Partial<CarDetailEntityDto>): CreateCarDetailsFormGroup {
    return this.fb.group({
      registrationDate: this.fb.control(
        data?.registrationDate?.slice(0, 10) ?? '', // Slice the YYYY-MM-DD part
        [
          Validators.required,
          regex(/^\d{4}-\d{2}-\d{2}$/)
        ]
      ),

      mileage: this.fb.control(
        data?.mileage ?? 0,
        [
          Validators.min(0),
          Validators.required
        ]
      ),

      currency: this.fb.control(
        data?.currency ?? 'EUR',
        [
          regex(/[A-Z]{3}/),
          Validators.required
        ]
      ),

      price: this.fb.control(
        data?.price ?? 0,
        [
          Validators.min(0),
          Validators.required
        ]
      ),

      manufactureYear: this.fb.control(
        data?.manufactureYear ?? 1,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(new Date().getFullYear())
        ]
      ),

      availability: this.fb.control(
        data?.availability ?? false,
        Validators.required
      ),

      color: this.fb.control(
        data?.color ?? '',
        Validators.required
      ),

      description: this.fb.control(
        data?.description ?? '',
        Validators.required
      ),

      licensePlate: this.fb.control(
        data?.licensePlate ?? '',
        [
          Validators.required,
          regex(/^\d{4} [B-DF-HJ-NP-TV-Z]{3}$/) // match 4 numbers, a space, and three uppercase consonants
        ]
      )
    });
  }

  addCarDetails(data?: Partial<CreateCarDetailsDto>){
    this.carDetails.push(this.createCarDetailsFormGroup(data));
  }

  removeCarDetails(index: number){
    this.carDetails.removeAt(index);
  }

  getControl(group: AbstractControl, name: string){
    return group.get(name);
  }

  isInvalid(control: AbstractControl|null): boolean {
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  submit(){
    let car = this.form.getRawValue() as CreateCarDto;

    car.carDetails.forEach((car)=>{
      car.registrationDate += 'T00:00:00.000Z' // For some reason, backend expects this date format (YYYY-MM-DDTHH:MM:SS.mmmZ)
    });

    if (this.carId == null) {
      this.carsService.createCar(car).subscribe({
        next: () => {
          console.log('Car created');
        },
        error: () => {
          console.log('Error creating the car');
        }
      });
    }

    else {
      this.carsService.editCar(this.carId, car).subscribe({
        next: () => {
          console.log('Car editted');
        },
        error: () => {
          console.log('Error editting the car');
        }
      });
    }
  }
}
