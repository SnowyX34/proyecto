import { Component, OnInit, OnDestroy } from '@angular/core';
import { CotizacionService } from '../../services/cotizacion.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { Quotation } from '@shared/dto/quotation.dto';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-quotations-view',
  templateUrl: './admin-quotations-view.html',
  styleUrls: ['./admin-quotations-view.css'],
  standalone: false
})
export class AdminQuotationsViewComponent implements OnInit, OnDestroy {
  quotations: Quotation[] = [];
  isAdmin: boolean = false;
  private authStatusSubscription?: Subscription;

  constructor(
    private readonly cotizacionService: CotizacionService,
    private readonly authService: AuthService,
    private readonly toastr: ToastrService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.authStatusSubscription = this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.checkAdminStatus();
      if (this.isAdmin) {
        this.loadAllQuotations();
      } else {
        this.quotations = [];
        this.toastr.error('Acceso denegado. Solo los administradores pueden ver esta página.', 'No Autorizado');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authStatusSubscription) {
      this.authStatusSubscription.unsubscribe();
    }
  }

  checkAdminStatus(): void {
    this.isAdmin = this.authService.getUserRole() === 'admin';
  }

  loadAllQuotations(): void {
    this.cotizacionService.getAllQuotationsAdmin().subscribe({
      next: (data) => {
        console.log('AdminQuotationsViewComponent: Cotizaciones de admin cargadas:', data);
        this.quotations = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('AdminQuotationsViewComponent: Error al cargar cotizaciones de admin:', error);
        this.toastr.error('Error al cargar cotizaciones', 'Error');
        if (error.status === 401 || error.status === 403) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  viewQuotationDetails(quotationId: number): void {
    this.toastr.info(`Navegando a detalles de cotización ${quotationId}`, 'Detalles');
    console.log(`Navegar a detalles de cotización con ID: ${quotationId}`);
    // Aquí puedes implementar la navegación real, por ejemplo:
    // this.router.navigate(['/admin/cotizaciones', quotationId]);
  }

  // NUEVO: Método para eliminar una cotización
  deleteQuotation(quotationId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta cotización? Esta acción es irreversible.')) {
      this.cotizacionService.deleteQuotation(quotationId.toString()).subscribe({
        next: (response) => {
          this.toastr.success('Cotización eliminada correctamente', 'Éxito');
          this.loadAllQuotations(); // Recargar la lista después de eliminar
        },
        error: (error: HttpErrorResponse) => {
          console.error('AdminQuotationsViewComponent: Error al eliminar cotización:', error);
          this.toastr.error('Error al eliminar la cotización', 'Error');
          if (error.status === 401 || error.status === 403) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }

  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }
}
