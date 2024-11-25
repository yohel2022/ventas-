// src/app/modules/categories/categories-list/categories-list.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { Category } from '../../../interfaces/models';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor],
  templateUrl: './categories-list.component.html'
})
export class CategoriesListComponent implements OnInit {
  private categoryService = inject(CategoryService);

  categories: Category[] = [];
  isLoading = true;
  errorMessage = '';
  deleteInProgress = new Set<number>();

  ngOnInit() {
    this.loadCategories();
  }

  private loadCategories() {
    this.isLoading = true;
    this.errorMessage = '';

    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.errorMessage = 'Error loading categories. Please try again.';
        this.isLoading = false;
      }
    });
  }

  deleteCategory(category: Category) {
    if (!category.id) {
      console.error('Category ID is undefined');
      return;
    }

    if (this.deleteInProgress.has(category.id)) {
      return;
    }

    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      this.deleteInProgress.add(category.id);

      this.categoryService.delete(category.id).subscribe({
        next: () => {
          this.categories = this.categories.filter(c => c.id !== category.id);
          this.deleteInProgress.delete(category.id!);
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          this.deleteInProgress.delete(category.id!);
          this.errorMessage = 'Error deleting category. Please try again.';
        }
      });
    }
  }

  isDeleting(categoryId: number): boolean {
    return this.deleteInProgress.has(categoryId);
  }
}