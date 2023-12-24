import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataSharingService } from '../../services/data-sharing.service';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-confim',
  templateUrl: './confim.component.html',
  styleUrls: ['./confim.component.css'],
})
export class ConfimComponent {
  @Input() applicationId!: string;

  reason: string = '';

  constructor(
    public activeModal: NgbActiveModal,
    private dataSharingService: DataSharingService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit() {
    this.dataSharingService.currentApplicationId.subscribe((applicationId) => {
      this.applicationId = applicationId;
    });
  }

  refuseApplication(): void {
    if (this.reason.trim() !== '') {
      this.dataSharingService.changeApplicationId(this.applicationId);

      this.applicationService
        .deleteApplication(this.applicationId, this.reason)
        .subscribe({
          next: () => {
            alert('Заявка отклонена');
            this.activeModal.close();
          },
          error: (error) => {
            alert(`Ошибка при отклонении записи: ${error.error.error}`);
          },
        });
    } else {
      alert('Введите причину отказа в текстовое поле.');
    }
  }
}
