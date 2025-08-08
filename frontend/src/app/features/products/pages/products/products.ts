<<<<<<< HEAD
// AdminProductsComponent actualizado
=======
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductAttributes } from '@shared/dto/product.dto';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
<<<<<<< HEAD
=======
import { environment } from '../../../../../environments/environment'; 
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592

@Component({
  selector: 'app-products',
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
  standalone: false
})
export class AdminProductsComponent implements OnInit {

  products: ProductAttributes[] = [];
<<<<<<< HEAD
  newProduct: ProductAttributes = {product_id:0, modelo: '', color: '', costo_m2: 0, img_Url: '', productType: '',descripcion: '' };
  editingProduct: ProductAttributes | null = null;
  selectedFile: File | null = null;
  selectedFileForEdit: File | null = null;

  // ✅ Estados de carga para mejor UX
  isUploading: boolean = false;
  isUpdating: boolean = false;
=======
  newProduct: ProductAttributes = {
    modelo: '', color: '', costo_m2: 0, img_Url: '', productType: '',
    product_id: 0,
    descripcion: ''
  };
  editingProduct: ProductAttributes | null = null;
  selectedFile: File | null = null;
  selectedFileForEdit: File | null = null; // ✅ Agregado: archivo separado para edición
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592

  constructor(
    private readonly _productService: ProductService,
    private readonly toastr: ToastrService
  ) {}

<<<<<<< HEAD
  // ✅ Método actualizado para usar URLs optimizadas
  getImageUrl(imgUrl: string, width: number = 200, height: number = 200): string {
    return this._productService.getOptimizedImageUrl(imgUrl, width, height);
=======
  getImageUrl(imgUrl: string): string {
    return this._productService.getImageUrl(imgUrl);
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
<<<<<<< HEAD
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
=======
    this.selectedFile = input.files?.[0] ?? null;
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
  }

  onFileSelectedForEdit(event: Event): void {
    const input = event.target as HTMLInputElement;
<<<<<<< HEAD
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
=======
    this.selectedFileForEdit = input.files?.[0] ?? null; // ✅ Corregido: usar selectedFileForEdit
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
  }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this._productService.getAll().subscribe({
<<<<<<< HEAD
      next: (data) => {
=======
      next: (data: ProductAttributes[]) => {
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
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
<<<<<<< HEAD
    console.error('Error al cargar imagen');
    // Establecer imagen por defecto en caso de error
    event.target.src = 'https://via.placeholder.com/400x300/cccccc/666666?text=Error+al+cargar';
  }

  cancelEdit() {
    this.editingProduct = null;
    this.selectedFileForEdit = null;
    this.isUpdating = false;
=======
    console.error('Error al cargar imagen:');
  }

  // ✅ Corregido: método para cancelar edición
  cancelEdit() {
    this.editingProduct = null;
    this.selectedFileForEdit = null; // ✅ Corregido: limpiar archivo de edición
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
  }

  addProduct(): void {
    if (!this.newProduct.modelo || !this.newProduct.color) {
      this.toastr.error('Todos los campos son obligatorios', 'Error');
      return;
    }

<<<<<<< HEAD
    if (this.isUploading) {
      return; // Prevenir múltiples clicks
    }

    this.isUploading = true;

=======
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
    const formData = new FormData();
    formData.append('modelo', this.newProduct.modelo);
    formData.append('color', this.newProduct.color);
    formData.append('costo_m2', String(this.newProduct.costo_m2));
<<<<<<< HEAD
    formData.append('productType', this.newProduct.productType);
      formData.append('descripcion', this.newProduct.descripcion);
=======
    formData.append('productType', this.newProduct.productType)
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this._productService.addProductFormData(formData).subscribe({
      next: () => {
<<<<<<< HEAD
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
=======
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
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
      }
    });
  }

  editProduct(product: ProductAttributes): void {
    this.editingProduct = { ...product };
<<<<<<< HEAD
    this.selectedFileForEdit = null;
=======
    this.selectedFileForEdit = null; // ✅ Limpiar archivo de edición al empezar
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
  }

  saveProduct(): void {
    if (!this.editingProduct) return;

<<<<<<< HEAD
    if (this.isUpdating) {
      return; // Prevenir múltiples clicks
    }

    this.isUpdating = true;

    // Si hay nueva imagen, usar FormData
=======
    // ✅ Corregido: usar selectedFileForEdit para edición
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
    if (this.selectedFileForEdit) {
      const formData = new FormData();
      formData.append('modelo', this.editingProduct.modelo);
      formData.append('color', this.editingProduct.color);
      formData.append('costo_m2', String(this.editingProduct.costo_m2));
      formData.append('image', this.selectedFileForEdit);
<<<<<<< HEAD
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
=======
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
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
        }
      });
    }
  }

  deleteProduct(id: number): void {
<<<<<<< HEAD
    if (!confirm('¿Seguro que deseas eliminar este producto? Esta acción no se puede deshacer.')) return;

    this._productService.deleteProduct(id).subscribe({
      next: () => {
        this.toastr.success('Producto eliminado correctamente', 'Éxito');
=======
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;

    this._productService.deleteProduct(id).subscribe({
      next: () => {
        this.toastr.success('Producto eliminado');
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
        this.fetchProducts();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al eliminar:', error);
<<<<<<< HEAD
        this.toastr.error(
          error.error?.message || 'Error al eliminar producto', 
          'Error'
        );
=======
        this.toastr.error('Error al eliminar', 'Error');
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
      }
    });
  }

<<<<<<< HEAD
=======
  // ✅ Método auxiliar para limpiar inputs de archivo
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
  private clearFileInput(): void {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input: any) => {
      input.value = '';
    });
  }
<<<<<<< HEAD

  // ✅ Método auxiliar para mostrar el nombre del archivo seleccionado
  getSelectedFileName(): string {
    return this.selectedFile ? this.selectedFile.name : 'Ningún archivo seleccionado';
  }

  getSelectedFileNameForEdit(): string {
    return this.selectedFileForEdit ? this.selectedFileForEdit.name : 'Ningún archivo seleccionado';
  }
=======
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592
}