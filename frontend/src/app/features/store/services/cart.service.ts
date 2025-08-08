import { Injectable } from '@angular/core';
import { CotizacionItem } from '@shared/dto/quotation.dto';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'shopping_cart'; // Clave para localStorage
  private items: CotizacionItem[] = [];
  private itemsSubject = new BehaviorSubject<CotizacionItem[]>([]);

  constructor() {
    // Cargar items del localStorage al inicializar el servicio
    this.loadFromStorage();
  }

  getItems(): Observable<CotizacionItem[]> {
    return this.itemsSubject.asObservable();
  }

  addItem(item: CotizacionItem): void {
    this.items.push(item);
    this.saveToStorage(); // Guardar en localStorage
    this.itemsSubject.next([...this.items]); // Crear nueva referencia para que Angular detecte el cambio
  }

  clearCart(): void {
    this.items = [];
    this.saveToStorage(); // Guardar en localStorage (vacío)
    this.itemsSubject.next([]);
  }

  removeItem(index: number): void {
    if (index >= 0 && index < this.items.length) {
      this.items.splice(index, 1);
      this.saveToStorage(); // Guardar en localStorage
      this.itemsSubject.next([...this.items]); // Crear nueva referencia
    }
  }

  getItemsCount(): number {
    return this.items.length;
  }

  getCurrentItems(): CotizacionItem[] {
    return [...this.items];
  }

  // Métodos para persistencia en localStorage
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.items = JSON.parse(stored);
        this.itemsSubject.next([...this.items]);
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      this.items = []; // Limpiar si hay un error de parseo
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  // Opcional: Método para limpiar el storage del carrito (útil al hacer logout completo)
  clearCartStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.clearCart(); // También limpia el carrito en memoria
  }
}
