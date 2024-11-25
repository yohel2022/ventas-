// src/app/modules/categories/category-form/category-form.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { Category } from '../../../interfaces/models';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './category-form.component.html'
})
export class CategoryFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form!: FormGroup;
  isLoading = false;
  errorMessage = '';
  isEditing = false;
  categoryId?: number;

  ngOnInit() {
    this.initForm();
    this.checkIfEditing();
  }

  private initForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      status: [true]
    });
  }

  private checkIfEditing() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.categoryId = +id;
      this.loadCategory(this.categoryId);
    }
  }

  private loadCategory(id: number) {
    this.isLoading = true;
    this.categoryService.getById(id).subscribe({
      next: (category) => {
        this.form.patchValue(category);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading category:', error);
        this.errorMessage = 'Error loading category';
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const category: Category = this.form.value;

      const request = this.isEditing
        ? this.categoryService.update(this.categoryId!, category)
        : this.categoryService.create(category);

      request.subscribe({
        next: () => {
          this.router.navigate(['/categories']);
        },
        error: (error) => {
          console.error('Error saving category:', error);
          this.errorMessage = 'Error saving category';
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

    return '';
  }

  cancel() {
    this.router.navigate(['/categories']);
  }
}