// src/app/services/sale.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';
import {
  Sale,
  CreateSaleDTO,
  UpdateSaleStatusDTO,
  SaleDetail
} from '../interfaces/models';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/sales`;

  // Obtener todas las ventas
  getAll(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.apiUrl);
  }

  // Obtener una venta por ID
  getById(id: number): Observable<Sale> {
    return this.http.get<Sale>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva venta
  create(saleData: CreateSaleDTO): Observable<Sale> {
    return this.http.post<Sale>(this.apiUrl, saleData);
  }

  // Actualizar estado de una venta
  updateStatus(id: number, status: UpdateSaleStatusDTO): Observable<Sale> {
    return this.http.patch<Sale>(`${this.apiUrl}/${id}/status`, { status });
  }

  // Helper Methods

  // Calcular total de los detalles de una venta
  calculateTotal(details: SaleDetail[]): number {
    return details.reduce((sum, detail) => {
      return sum + parseFloat(detail.subtotal);
    }, 0);
  }

  // Formatear precio para mostrar
  formatPrice(price: string | number): string {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'PEN'
    }).format(numPrice);
  }

  // Verificar si una venta puede ser cancelada
  canBeCancelled(sale: Sale): boolean {
    return sale.status === 'PENDING';
  }

  // Obtener el estado formateado para mostrar
  getStatusLabel(status: Sale['status']): string {
    const statusMap: Record<Sale['status'], string> = {
      'PENDING': 'Pendiente',
      'COMPLETED': 'Completado',
      'CANCELLED': 'Cancelado'
    };
    return statusMap[status];
  }

  // Obtener clase CSS para el estado
  getStatusClass(status: Sale['status']): string {
    const statusClasses: Record<Sale['status'], string> = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return statusClasses[status];
  }

  // Obtener resumen de items para mostrar
  getItemsSummary(details: SaleDetail[]): string {
    const items = details.map(detail =>
      `${detail.quantity}x ${detail.product.name}`
    );

    if (items.length <= 2) {
      return items.join(', ');
    }

    return `${items.slice(0, 2).join(', ')} y ${items.length - 2} más`;
  }

  // Verificar si hay stock suficiente
  hasEnoughStock(quantity: number, product: { stock: number }): boolean {
    return product.stock >= quantity;
  }

  // Calcular subtotal de un item
  calculateItemSubtotal(quantity: number, price: string): number {
    return quantity * parseFloat(price);
  }
}