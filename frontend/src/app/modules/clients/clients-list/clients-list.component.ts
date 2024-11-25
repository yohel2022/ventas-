// src/app/modules/clients/clients-list/clients-list.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { Client } from '../../../interfaces/models';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor],
  templateUrl: './clients-list.component.html'
})
export class ClientsListComponent implements OnInit {
  private clientService = inject(ClientService);

  clients: Client[] = [];
  isLoading = true;
  errorMessage = '';
  deleteInProgress = new Set<number>();

  ngOnInit() {
    this.loadClients();
  }

  private loadClients() {
    this.isLoading = true;
    this.errorMessage = '';

    this.clientService.getAll().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.errorMessage = 'Error loading clients. Please try again.';
        this.isLoading = false;
      }
    });
  }

  deleteClient(client: Client) {
    if (!client.id) {
      console.error('Client ID is undefined');
      return;
    }

    if (this.deleteInProgress.has(client.id)) {
      return;
    }

    if (confirm(`Are you sure you want to delete "${client.name}"?`)) {
      this.deleteInProgress.add(client.id);

      this.clientService.delete(client.id).subscribe({
        next: () => {
          this.clients = this.clients.filter(c => c.id !== client.id);
          this.deleteInProgress.delete(client.id!);
        },
        error: (error) => {
          console.error('Error deleting client:', error);
          this.deleteInProgress.delete(client.id!);
          this.errorMessage = 'Error deleting client. Please try again.';
        }
      });
    }
  }

  isDeleting(clientId: number): boolean {
    return this.deleteInProgress.has(clientId);
  }
}