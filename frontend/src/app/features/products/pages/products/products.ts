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
  newProduct: ProductAttributes = {product_id:0, modelo: '', color: '', costo_m2: 0, img_Url: '', productType: '',descripcion: '' };
  editingProduct: ProductAttributes | null = null;
  selectedFile: File | null = null;
  selectedFileForEdit: File | null = null;

  // ✅ Estados de carga para mejor UX
  isUploading: boolean = false;
  isUpdating: boolean = false;

  constructor(
    private readonly _productService: ProductService,
    private readonly toastr: ToastrService
  ) {}

  // ✅ Método actualizado para usar URLs optimizadas
  getImageUrl(imgUrl: string, width: number = 200, height: number = 200): string {
    return this._productService.getOptimizedImageUrl(imgUrl, width, height);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    
    if (file) {
      // Validar tamaño del archivo (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.toastr.error('El archivo es demasiado grande. Máximo 10MB', 'Error');
        input.value = '';
        return;
      }
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        this.toastr.error('Solo se permiten archivos de imagen', 'Error');
        input.value = '';
        return;
      }
    }
    
    this.selectedFile = file;
  }

  onFileSelectedForEdit(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    
    if (file) {
      // Validar tamaño del archivo (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.toastr.error('El archivo es demasiado grande. Máximo 10MB', 'Error');
        input.value = '';
        return;
      }
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        this.toastr.error('Solo se permiten archivos de imagen', 'Error');
        input.value = '';
        return;
      }
    }
    
    this.selectedFileForEdit = file;
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
    console.error('Error al cargar imagen');
    // Establecer imagen por defecto en caso de error
    event.target.src = 'https://via.placeholder.com/400x300/cccccc/666666?text=Error+al+cargar';
  }

  cancelEdit() {
    this.editingProduct = null;
    this.selectedFileForEdit = null;
    this.isUpdating = false;
  }

  addProduct(): void {
    if (!this.newProduct.modelo || !this.newProduct.color) {
      this.toastr.error('Todos los campos son obligatorios', 'Error');
      return;
    }

    if (this.isUploading) {
      return; // Prevenir múltiples clicks
    }

    this.isUploading = true;

    const formData = new FormData();
    formData.append('modelo', this.newProduct.modelo);
    formData.append('color', this.newProduct.color);
    formData.append('costo_m2', String(this.newProduct.costo_m2));
    formData.append('productType', this.newProduct.productType);
      formData.append('descripcion', this.newProduct.descripcion);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this._productService.addProductFormData(formData).subscribe({
      next: () => {
        this.toastr.success('Producto agregado correctamente', 'Éxito');
        this.fetchProducts();
        this.newProduct = { product_id:0, modelo: '', color: '', costo_m2: 0, img_Url: '', productType: '', descripcion:'' };
        this.selectedFile = null;
        this.clearFileInput();
        this.isUploading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al agregar producto:', error);
        this.toastr.error(
          error.error?.message || 'Error al agregar producto', 
          'Error'
        );
        this.isUploading = false;
      }
    });
  }

  editProduct(product: ProductAttributes): void {
    this.editingProduct = { ...product };
    this.selectedFileForEdit = null;
  }

  saveProduct(): void {
    if (!this.editingProduct) return;
    if (this.isUpdating) {
      return; // Prevenir múltiples clicks
    }

    this.isUpdating = true;

    if (this.selectedFileForEdit) {
      const formData = new FormData();
      formData.append('modelo', this.editingProduct.modelo);
      formData.append('color', this.editingProduct.color);
      formData.append('costo_m2', String(this.editingProduct.costo_m2));
      formData.append('image', this.selectedFileForEdit);
      formData.append('productType', this.editingProduct.productType);
      formData.append('descripcon', this.editingProduct.descripcion);

      this._productService.updateProductFormData(this.editingProduct.product_id!, formData).subscribe({
        next: () => {
          this.toastr.success('Producto actualizado correctamente', 'Éxito');
          this.fetchProducts();
          this.editingProduct = null;
          this.selectedFileForEdit = null;
          this.isUpdating = false;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al actualizar:', error);
          this.toastr.error(
            error.error?.message || 'Error al actualizar producto', 
            'Error'
          );
          this.isUpdating = false;
        }
      });
    } else {
      // Sin nueva imagen, actualizar solo datos
      this._productService.updateProduct(this.editingProduct).subscribe({
        next: () => {
          this.toastr.success('Producto actualizado correctamente', 'Éxito');
          this.fetchProducts();
          this.editingProduct = null;
          this.isUpdating = false;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al actualizar:', error);
          this.toastr.error(
            error.error?.message || 'Error al actualizar producto', 
            'Error'
          );
          this.isUpdating = false;
        }
      });
    }
  }

  deleteProduct(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar este producto? Esta acción no se puede deshacer.')) return;

    this._productService.deleteProduct(id).subscribe({
      next: () => {
        this.toastr.success('Producto eliminado correctamente', 'Éxito');
        this.fetchProducts();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al eliminar:', error);
        this.toastr.error(
          error.error?.message || 'Error al eliminar producto', 
          'Error'
        );
      }
    });
  }

  private clearFileInput(): void {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input: any) => {
      input.value = '';
    });
  }

  // ✅ Método auxiliar para mostrar el nombre del archivo seleccionado
  getSelectedFileName(): string {
    return this.selectedFile ? this.selectedFile.name : 'Ningún archivo seleccionado';
  }

  getSelectedFileNameForEdit(): string {
    return this.selectedFileForEdit ? this.selectedFileForEdit.name : 'Ningún archivo seleccionado';
  }
}