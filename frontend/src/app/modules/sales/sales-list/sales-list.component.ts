// src/app/modules/sales/sales-list/sales-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor, DatePipe, CurrencyPipe } from '@angular/common';
import { Sale } from '../../../interfaces/models';
import { SaleService } from '../../../services/sale.service';

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, DatePipe, CurrencyPipe],
  templateUrl: './sales-list.component.html'
})
export class SalesListComponent implements OnInit {
  private readonly saleService = inject(SaleService);

  sales: Sale[] = [];
  isLoading = true;
  errorMessage = '';
  selectedSale?: Sale;

  ngOnInit() {
    this.loadSales();
  }

  private loadSales() {
    this.isLoading = true;
    this.errorMessage = '';

    this.saleService.getAll().subscribe({
      next: (sales) => {
        this.sales = sales;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading sales:', error);
        this.errorMessage = 'Error al cargar las ventas. Por favor, intente nuevamente.';
        this.isLoading = false;
      }
    });
  }

  updateStatus(sale: Sale, newStatus: Sale['status']) {
    if (!confirm(`¿Está seguro de marcar esta venta como ${this.getStatusLabel(newStatus)}?`)) {
      return;
    }

    this.selectedSale = sale;
    this.saleService.updateStatus(sale.id, { status: newStatus }).subscribe({
      next: (updatedSale) => {
        const index = this.sales.findIndex(s => s.id === sale.id);
        if (index !== -1) {
          this.sales[index] = updatedSale;
        }
        this.selectedSale = undefined;
      },
      error: (error) => {
        console.error('Error updating sale status:', error);
        this.errorMessage = 'Error al actualizar el estado. Por favor, intente nuevamente.';
        this.selectedSale = undefined;
      }
    });
  }

  // Convertimos las funciones flecha en métodos de clase
  getStatusClass(status: Sale['status']): string {
    return this.saleService.getStatusClass(status);
  }

  getStatusLabel(status: Sale['status']): string {
    return this.saleService.getStatusLabel(status);
  }

  formatPrice(price: string): string {
    return this.saleService.formatPrice(price);
  }

  canBeCancelled(sale: Sale): boolean {
    return this.saleService.canBeCancelled(sale);
  }

  isProcessing(saleId: number): boolean {
    return this.selectedSale?.id === saleId;
  }

  // Método helper para obtener el nombre del cliente truncado si es muy largo
  getTruncatedName(name: string, limit: number = 20): string {
    return name.length > limit ? `${name.substring(0, limit)}...` : name;
  }

  // Método helper para obtener la dirección truncada
  getTruncatedAddress(address: string, limit: number = 30): string {
    return address.length > limit ? `${address.substring(0, limit)}...` : address;
  }
}