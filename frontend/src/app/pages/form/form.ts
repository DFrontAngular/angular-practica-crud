import { Component, computed, inject, signal, Signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarBrandDto } from '../../../model/DTO/car-brand-dto';
import { CarModelDto } from '../../../model/DTO/car-model-dto';
import { CarsService } from '../../../services/cars-service/cars-service';
import { BrandDao } from '../../../model/DAO/brand-dao';
import { HttpErrorResponse } from '@angular/common/http';
import { ModelDao } from '../../../model/DAO/model-dao';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form {
  private formBuilder = inject(FormBuilder);
  private carsService = inject(CarsService);

  error = signal<HttpErrorResponse|null>(null);
  loading = signal(false);
  brands = signal<BrandDao[]>([]);
  currentBrand = signal<BrandDao|null>(null);
  currencies = this.carsService.getCurrencyCodes();

  form = this.formBuilder.nonNullable.group({
    brandId: ['', Validators.required],
    modelId: ['', Validators.required],
    carDetails: this.formBuilder.array([])
  });

  constructor(){
    this.loadBrands();

    this.form.controls.brandId.valueChanges.subscribe(brandId => {
      this.currentBrand.set(
        this.brands().find(brand => brand.id == brandId) ?? null
      );
      this.form.controls.modelId.setValue('');
    })
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

  get carDetails(): FormArray {
    return this.form.get('carDetails') as FormArray;
  }

  createCarDetailsGroup(): FormGroup {
    return this.formBuilder.group({
      registrationDate: [''],
      mileage: [0],
      currency: [''],
      price: [0],
      manufactureYear: [0],
      availability: [false],
      color: [''],
      description: [''],
      licensePlate: ['']
    });
  }

  addCarDetails(){
    this.carDetails.push(this.createCarDetailsGroup());
  }

  removeCarDetails(index: number){
    this.carDetails.removeAt(index);
  }

  submit(){
    console.log(this.form.getRawValue());
  }
}
