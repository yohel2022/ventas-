export interface Category {
    id?: number;
    name: string;
    description: string;
    status: boolean;
}

export interface Product {
    id?: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
    status: boolean;
}

export interface Client {
    id?: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    status: boolean;
}

export interface SaleDetail {
    id: number;
    saleId: number;
    productId: number;
    quantity: number;
    price: string;    // Cambiado a string
    subtotal: string; // Cambiado a string
    createdAt: string;
    updatedAt: string;
    product: Product;
}

export interface Sale {
    id: number;
    clientId: number;
    total: string;    // Cambiado a string
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
    observation: string | null;
    createdAt: string;
    updatedAt: string;
    client: {
        id: number;
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    details: SaleDetail[];
}

// DTOs para crear/actualizar
export interface CreateSaleDTO {
    clientId: number;
    observation?: string;
    items: {
        productId: number;
        quantity: number;
    }[];
}

export interface UpdateSaleStatusDTO {
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}
