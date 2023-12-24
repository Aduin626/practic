import { Component } from '@angular/core';
import { Application } from '../shared/interfaces';
import { ApplicationService } from '../shared/services/application.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfimComponent } from '../shared/modal/confim/confim.component';
import { DataSharingService } from '../shared/services/data-sharing.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css'],
})
export class AdminPageComponent {
  applications: Application[] = [];

  constructor(
    private dataSharingService: DataSharingService,
    private applicationService: ApplicationService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadApplication();
  }

  loadApplication(): void {
    this.applicationService.getApplications().subscribe(
      (responce) => {
        this.applications = responce;
        console.log(this.applications);
      },
      (error) => {
        console.error('Error fetching application', error);
      }
    );
  }

  openRejectReasonDialog(applicationId: string) {
    this.dataSharingService.changeApplicationId(applicationId);
    const modalRef = this.modalService.open(ConfimComponent);
    modalRef.result.then(
      () => {
        this.loadApplication();
      },
      (reason) => {
        console.log(`Modal dismissed with reason: ${reason}`);
      }
    );
  }
  accpetApplication(applicationId: string): void {
    if (confirm('Вы уверены, что хотите подтвердить эту запись?')) {
      this.applicationService.acceptApplication(applicationId).subscribe({
        next: () => {
          alert('Заявка подтверждена');
          this.loadApplication();
        },
        error: (error) => {
          alert(`Ошибка при подтверждении записи: ${error.error.error}`);
        },
      });
    }
  }
}
