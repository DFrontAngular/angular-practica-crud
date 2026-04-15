import { Component, computed, effect, inject, signal, Signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarBrandDto } from '../../../model/DTO/car-brand-dto';
import { CarModelDto } from '../../../model/DTO/car-model-dto';
import { CarsService } from '../../../services/cars-service/cars-service';
import { BrandDao } from '../../../model/DAO/brand-dao';
import { HttpErrorResponse } from '@angular/common/http';
import { ModelDao } from '../../../model/DAO/model-dao';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CreateCarDetailsDto } from '../../../model/DTO/create-car-details';
import { isInvalid, regex } from '../../../utilities';

@Component({
  selector: 'app-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form {
  private fb = inject(FormBuilder).nonNullable;
  private carsService = inject(CarsService);

  error = signal<HttpErrorResponse|null>(null);
  loading = signal(false);
  brands = signal<BrandDao[]>([]);
  currentBrand = signal<BrandDao|null>(null);
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
    carDetails: this.fb.array([])
  });

  constructor(){
    this.loadBrands();

    this.form.controls.brandId.valueChanges.subscribe(brandId => {
      this.currentBrand.set(
        this.brands().find(brand => brand.id == brandId) ?? null
      );
      this.form.controls.modelId.setValue('');
    })

    effect(()=>{
      if (this.currentBrand() == null){
        this.form.get('modelId')?.disable();
      } else {
        this.form.get('modelId')?.enable();
      }
    });
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
    return this.fb.group({
      registrationDate: this.fb.control(
        '',
        [
          Validators.required,
          regex(/^\d{4}-\d{2}-\d{2}$/)
        ]
      ),

      mileage: this.fb.control(
        0,
        [
          Validators.min(0),
          Validators.required
        ]
      ),

      currency: this.fb.control(
        'EUR',
        [
          regex(/[A-Z]{3}/),
          Validators.required
        ]
      ),

      price: this.fb.control(
        0,
        [
          Validators.min(0),
          Validators.required
        ]
      ),

      manufactureYear: this.fb.control(
        1,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(new Date().getFullYear())
        ]
      ),

      availability: this.fb.control(
        false,
        Validators.required
      ),

      color: this.fb.control(
        '',
        Validators.required
      ),

      description: this.fb.control(
        '',
        Validators.required
      ),

      licensePlate: this.fb.control(
        '',
        [
          Validators.required,
          regex(/^\d{4} [B-DF-HJ-NP-TV-Z]{3}$/) // match 4 numbers, a space, and three uppercase consonants
        ]
      )
    });
  }

  addCarDetails(){
    this.carDetails.push(this.createCarDetailsGroup());
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
    console.log(this.form.getRawValue());
  }
}
