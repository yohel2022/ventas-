// src/app/modules/products/products-list/products-list.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor, CurrencyPipe, DatePipe } from '@angular/common';
import { Product } from '../../../interfaces/models';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, CurrencyPipe, DatePipe],
  templateUrl: './products-list.component.html'
})
export class ProductsListComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  products: Product[] = [];
  categories: Map<number, string> = new Map();
  isLoading = true;
  errorMessage = '';

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  private loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        categories.forEach(category => {
          this.categories.set(category.id!, category.name);
        });
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  private loadProducts() {
    this.isLoading = true;
    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error loading products. Please try again.';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  updateStock(id: number, newStock: number) {
    if (newStock >= 0) {
      this.productService.updateStock(id, newStock).subscribe({
        next: (updatedProduct) => {
          const index = this.products.findIndex(p => p.id === id);
          if (index !== -1) {
            this.products[index] = updatedProduct;
          }
        },
        error: (error) => {
          console.error('Error updating stock:', error);
          this.errorMessage = 'Error updating stock. Please try again.';
        }
      });
    }
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.errorMessage = 'Error deleting product. Please try again.';
        }
      });
    }
  }

  getCategoryName(categoryId: number): string {
    return this.categories.get(categoryId) || 'Unknown Category';
  }
}