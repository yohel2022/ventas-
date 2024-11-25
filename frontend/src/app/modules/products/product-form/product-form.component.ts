// src/app/modules/products/product-form/product-form.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { Category, Product } from '../../../interfaces/models';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form!: FormGroup;
  categories: Category[] = [];
  isLoading = false;
  errorMessage = '';
  isEditing = false;
  productId?: number;

  ngOnInit() {
    this.initForm();
    this.loadCategories();
    this.checkIfEditing();
  }

  private initForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null, [Validators.required]],
      status: [true]
    });
  }

  private loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (categories) => this.categories = categories,
      error: (error) => {
        console.error('Error loading categories:', error);
        this.errorMessage = 'Error loading categories';
      }
    });
  }

  private checkIfEditing() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.productId = +id;
      this.loadProduct(this.productId);
    }
  }

  private loadProduct(id: number) {
    this.isLoading = true;
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.form.patchValue(product);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.errorMessage = 'Error loading product';
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const product: Product = this.form.value;
      
      const request = this.isEditing
        ? this.productService.update(this.productId!, product)
        : this.productService.create(product);

      request.subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error saving product:', error);
          this.errorMessage = 'Error saving product';
          this.isLoading = false;
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  hasError(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(field: string): string {
    const control = this.form.get(field);
    
    if (!control) return '';
    
    if (control.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    
    if (control.hasError('minlength')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least 3 characters`;
    }
    
    if (control.hasError('min')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} must be greater than or equal to 0`;
    }
    
    return '';
  }

  cancel() {
    this.router.navigate(['/products']);
  }
}