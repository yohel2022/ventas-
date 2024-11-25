// src/app/modules/sales/sale-form/sale-form.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { SaleService } from '../../../services/sale.service';
import { ClientService } from '../../../services/client.service';
import { ProductService } from '../../../services/product.service';
import {
  Client,
  Product,
  CreateSaleDTO,
  SaleDetail
} from '../../../interfaces/models';

// Interface para el formulario de items
interface SaleItemForm {
  productId: number;
  productName: string;
  price: number;      // Ahora es number para coincidir con Product
  quantity: number;
  stock: number;
  subtotal: string;   // Se mantiene como string para coincidir con SaleDetail
}

@Component({
  selector: 'app-sale-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, CurrencyPipe, FormsModule],
  templateUrl: './sale-form.component.html'
})
export class SaleFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private saleService = inject(SaleService);
  private clientService = inject(ClientService);
  private productService = inject(ProductService);
  private router = inject(Router);

  form!: FormGroup;
  clients: Client[] = [];
  products: Product[] = [];
  isLoading = false;
  errorMessage = '';
  selectedProduct: Product | null = null;
  tempQuantity = 1;
  Math = Math;

  ngOnInit() {
    this.initForm();
    this.loadClients();
    this.loadProducts();
  }

  private initForm() {
    this.form = this.fb.group({
      clientId: ['', Validators.required],
      observation: [''],
      items: this.fb.array<FormGroup>([])
    });
  }

  get items() {
    return this.form.get('items') as FormArray<FormGroup>;
  }

  get total(): string {
    return this.items.controls.reduce((sum, control) => {
      return sum + parseFloat(control.get('subtotal')?.value || '0');
    }, 0).toFixed(2);
  }

  addProductToSale() {
    if (!this.selectedProduct || this.tempQuantity < 1) return;

    const existingItemIndex = this.items.controls.findIndex(
      control => control.get('productId')?.value === this.selectedProduct?.id
    );

    if (existingItemIndex >= 0) {
      const control = this.items.at(existingItemIndex);
      const currentQuantity = control.get('quantity')?.value || 0;
      const newQuantity = currentQuantity + this.tempQuantity;

      if (newQuantity <= (this.selectedProduct?.stock || 0)) {
        const subtotal = (this.selectedProduct.price * newQuantity).toFixed(2);
        control.patchValue({
          quantity: newQuantity,
          subtotal: subtotal
        });
      } else {
        this.errorMessage = 'Stock insuficiente';
      }
    } else {
      if (this.tempQuantity <= (this.selectedProduct?.stock || 0)) {
        const subtotal = (this.selectedProduct.price * this.tempQuantity).toFixed(2);

        const itemForm = this.fb.group({
          productId: [this.selectedProduct.id],
          productName: [this.selectedProduct.name],
          price: [this.selectedProduct.price],
          quantity: [this.tempQuantity],
          stock: [this.selectedProduct.stock],
          subtotal: [subtotal]
        });

        this.items.push(itemForm);
      } else {
        this.errorMessage = 'Stock insuficiente';
        return;
      }
    }

    // Resetear selección
    this.selectedProduct = null;
    this.tempQuantity = 1;
    this.errorMessage = '';
  }

  updateQuantity(index: number, increment: number) {
    const control = this.items.at(index);
    const currentQuantity = control.get('quantity')?.value || 0;
    const stock = control.get('stock')?.value || 0;
    const price = control.get('price')?.value || 0; // Ahora es number
    const newQuantity = currentQuantity + increment;

    if (newQuantity > 0 && newQuantity <= stock) {
      const subtotal = (price * newQuantity).toFixed(2);
      control.patchValue({
        quantity: newQuantity,
        subtotal: subtotal
      });
    }
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  onSubmit() {
    if (this.form.valid && this.items.length > 0) {
      this.isLoading = true;
      this.errorMessage = '';

      const saleData: CreateSaleDTO = {
        clientId: this.form.get('clientId')?.value,
        observation: this.form.get('observation')?.value,
        items: this.items.controls.map(control => ({
          productId: control.get('productId')?.value,
          quantity: control.get('quantity')?.value
        }))
      };

      this.saleService.create(saleData).subscribe({
        next: () => {
          this.router.navigate(['/sales']);
        },
        error: (error) => {
          console.error('Error creating sale:', error);
          this.errorMessage = 'Error al crear la venta';
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Por favor, complete todos los campos requeridos y agregue al menos un producto';
    }
  }

  formatPrice(price: number | string): string {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(numPrice);
  }

  getAvailableProducts(): Product[] {
    const currentProductIds = new Set(
      this.items.controls.map(control => control.get('productId')?.value)
    );
    return this.products.filter(p =>
      !currentProductIds.has(p.id) ||
      this.items.controls.find(control =>
        control.get('productId')?.value === p.id &&
        control.get('quantity')?.value < p.stock
      )
    );
  }

  private loadClients() {
    this.clientService.getAll().subscribe({
      next: (clients) => this.clients = clients,
      error: (error) => {
        console.error('Error loading clients:', error);
        this.errorMessage = 'Error al cargar los clientes';
      }
    });
  }

  private loadProducts() {
    this.productService.getAll().subscribe({
      next: (products) => this.products = products.filter(p => p.stock > 0),
      error: (error) => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Error al cargar los productos';
      }
    });
  }
}