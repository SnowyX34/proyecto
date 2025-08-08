import { ToastrService } from 'ngx-toastr';
import { ErrorService } from '../../services/error.service';
import { Register } from '@shared/dto/register.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../../services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  standalone: false,
  styleUrls: ['./register.css']
})
export class SignInComponent implements OnInit {
  user_name: string = '';
  user_secondName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  phone_number: string = '';
  role: string = 'user';
  loading: boolean = false;
  agreeToTerms: boolean = false;

  // Propiedades para el manejo de imágenes
  avatarPreview: string | null = null;
  selectedFile: File | null = null;
  maxFileSize: number = 5 * 1024 * 1024; // 5MB
  allowedFileTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  constructor(
    private readonly toastr: ToastrService,
    private readonly _userService: RegisterService,
    private readonly router: Router,
    private readonly _errorService: ErrorService
  ) {}

  ngOnInit(): void {}

  togglePassword(inputId: string, toggleId: string) {
    const passwordInput = document.getElementById(inputId) as HTMLInputElement | null;
    const toggleButton = document.getElementById(toggleId);

    if (passwordInput && toggleButton) {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      toggleButton.classList.toggle('show-password', isPassword);
      toggleButton.classList.toggle('hide-password', !isPassword);
    }
  }

  /**
   * Maneja la selección de imagen
   * @param event - Evento del input file
   */
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Validar archivo
    if (!this.isValidImageFile(file)) {
      this.toastr.error(`Archivo no válido. Solo se permiten imágenes JPG, PNG, GIF y WebP de máximo ${this.formatFileSize(this.maxFileSize)}`, 'Error');
      return;
    }

    this.selectedFile = file;
    this.createImagePreview(file);
  }

  /**
   * Crea una vista previa de la imagen seleccionada
   * @param file - Archivo de imagen seleccionado
   */
  private createImagePreview(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.avatarPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  /**
   * Remueve la imagen seleccionada
   */
  removeAvatar() {
    this.selectedFile = null;
    this.avatarPreview = null;
    
    // Limpiar el input file
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  handleSubmit(event: Event) {
    event.preventDefault();

    if (this.password !== this.confirmPassword) {
      this.toastr.error('Las contraseñas no coinciden', 'Error');
      return;
    }

    if (!this.agreeToTerms) {
      this.toastr.error('Debe aceptar los términos y condiciones', 'Error');
      return;
    }

    this.addUser();
  }

  async addUser() {
    if (
      this.user_name.trim() === '' ||
      this.user_secondName.trim() === '' ||
      this.email.trim() === '' ||
      this.password.trim() === '' ||
      this.confirmPassword.trim() === '' ||
      this.phone_number.trim() === ''
    ) {
      this.toastr.error('Todos los campos son obligatorios', 'Error');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toastr.error('Las contraseñas ingresadas son distintas', 'Error');
      return;
    }

    this.loading = true;

    try {
      const user: Register = {
        user_name: this.user_name,
        user_secondName: this.user_secondName,
        email: this.email,
        password: this.password,
        phone_number: this.phone_number,
        role: this.role,
        avatarUrl: '' // Se manejará en el backend
      };

      // Llamar al servicio pasando el archivo por separado
      this._userService.signIn(user, this.selectedFile || undefined).subscribe({
        next: (response) => {
          this.loading = false;
          this.toastr.success(`Usuario ${this.user_name} registrado con éxito`, 'Registro exitoso');
          this.router.navigate(['/Home']);
        },
        error: (e: HttpErrorResponse) => {
          this.loading = false;
          this._errorService.msjError(e);
        }
      });
    } catch (error) {
      this.loading = false;
      this.toastr.error('Error al procesar el registro', 'Error');
      console.error('Error:', error);
    }
  }

  /**
   * Valida si el archivo es una imagen válida
   * @param file - Archivo a validar
   * @returns boolean
   */
  private isValidImageFile(file: File): boolean {
    return this.allowedFileTypes.includes(file.type) && file.size <= this.maxFileSize;
  }

  /**
   * Formatea el tamaño del archivo para mostrar
   * @param bytes - Tamaño en bytes
   * @returns string - Tamaño formateado
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}