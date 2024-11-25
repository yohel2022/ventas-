// src/app/modules/clients/client-form/client-form.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { Client } from '../../../interfaces/models';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './client-form.component.html'
})
export class ClientFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form!: FormGroup;
  isLoading = false;
  errorMessage = '';
  isEditing = false;
  clientId?: number;

  ngOnInit() {
    this.initForm();
    this.checkIfEditing();
  }

  private initForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{6,}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      status: [true]
    });
  }

  private checkIfEditing() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.clientId = +id;
      this.loadClient(this.clientId);
    }
  }

  private loadClient(id: number) {
    this.isLoading = true;
    this.clientService.getById(id).subscribe({
      next: (client) => {
        this.form.patchValue(client);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading client:', error);
        this.errorMessage = 'Error loading client';
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const client: Client = this.form.value;

      const request = this.isEditing
        ? this.clientService.update(this.clientId!, client)
        : this.clientService.create(client);

      request.subscribe({
        next: () => {
          this.router.navigate(['/clients']);
        },
        error: (error) => {
          console.error('Error saving client:', error);
          this.errorMessage = 'Error saving client';
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
      const minLength = field === 'name' ? 3 : 5;
      return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${minLength} characters`;
    }

    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }

    if (control.hasError('pattern')) {
      return 'Please enter a valid phone number';
    }

    return '';
  }

  cancel() {
    this.router.navigate(['/clients']);
  }
}