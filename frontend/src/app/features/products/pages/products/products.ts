import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductAttributes } from '@shared/dto/product.dto';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../environments/environment'; 

@Component({
  selector: 'app-products',
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
  standalone: false
})
export class AdminProductsComponent implements OnInit {

  products: ProductAttributes[] = [];
  newProduct: ProductAttributes = {
    modelo: '', color: '', costo_m2: 0, img_Url: '', productType: '',
    product_id: 0,
    descripcion: ''
  };
  editingProduct: ProductAttributes | null = null;
  selectedFile: File | null = null;
  selectedFileForEdit: File | null = null; // ✅ Agregado: archivo separado para edición

  constructor(
    private readonly _productService: ProductService,
    private readonly toastr: ToastrService
  ) {}

  getImageUrl(imgUrl: string): string {
    return this._productService.getImageUrl(imgUrl);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  onFileSelectedForEdit(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFileForEdit = input.files?.[0] ?? null; // ✅ Corregido: usar selectedFileForEdit
  }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this._productService.getAll().subscribe({
      next: (data: ProductAttributes[]) => {
        console.log('Productos recibidos:', data);
        this.products = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar productos:', error);
        this.toastr.error('Error al cargar productos', 'Error');
      }
    });
  }

  onImageError(event: any) {
    console.error('Error al cargar imagen:');
  }

  // ✅ Corregido: método para cancelar edición
  cancelEdit() {
    this.editingProduct = null;
    this.selectedFileForEdit = null; // ✅ Corregido: limpiar archivo de edición
  }

  addProduct(): void {
    if (!this.newProduct.modelo || !this.newProduct.color) {
      this.toastr.error('Todos los campos son obligatorios', 'Error');
      return;
    }

    const formData = new FormData();
    formData.append('modelo', this.newProduct.modelo);
    formData.append('color', this.newProduct.color);
    formData.append('costo_m2', String(this.newProduct.costo_m2));
    formData.append('productType', this.newProduct.productType)

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this._productService.addProductFormData(formData).subscribe({
      next: () => {
        this.toastr.success('Producto agregado');
        this.fetchProducts();
        this.newProduct = { modelo: '', color: '', costo_m2: 0, img_Url: '', productType: '',
    product_id: 0,
    descripcion: ''};
        this.selectedFile = null;
        // ✅ Limpiar el input file
        this.clearFileInput();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al agregar producto:', error);
        this.toastr.error('Error al agregar producto', 'Error');
      }
    });
  }

  editProduct(product: ProductAttributes): void {
    this.editingProduct = { ...product };
    this.selectedFileForEdit = null; // ✅ Limpiar archivo de edición al empezar
  }

  saveProduct(): void {
    if (!this.editingProduct) return;

    // ✅ Corregido: usar selectedFileForEdit para edición
    if (this.selectedFileForEdit) {
      const formData = new FormData();
      formData.append('modelo', this.editingProduct.modelo);
      formData.append('color', this.editingProduct.color);
      formData.append('costo_m2', String(this.editingProduct.costo_m2));
      formData.append('image', this.selectedFileForEdit);
      formData.append('productType', this.editingProduct.productType)

      this._productService.updateProductFormData(this.editingProduct.product_id!, formData).subscribe({
        next: () => {
          this.toastr.success('Producto actualizado');
          this.fetchProducts();
          this.editingProduct = null;
          this.selectedFileForEdit = null;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al actualizar:', error);
          this.toastr.error('Error al actualizar', 'Error');
        }
      });
    } else {
      this._productService.updateProduct(this.editingProduct).subscribe({
        next: () => {
          this.toastr.success('Producto actualizado');
          this.fetchProducts();
          this.editingProduct = null;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al actualizar:', error);
          this.toastr.error('Error al actualizar', 'Error');
        }
      });
    }
  }

  deleteProduct(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;

    this._productService.deleteProduct(id).subscribe({
      next: () => {
        this.toastr.success('Producto eliminado');
        this.fetchProducts();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al eliminar:', error);
        this.toastr.error('Error al eliminar', 'Error');
      }
    });
  }

  // ✅ Método auxiliar para limpiar inputs de archivo
  private clearFileInput(): void {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input: any) => {
      input.value = '';
    });
  }
}