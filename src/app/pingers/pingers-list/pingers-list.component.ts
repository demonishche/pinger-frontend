import { Component, OnInit, ViewChild } from '@angular/core';
import { PingersService, requestState, IPinger, PingerStatus } from '../../services/pingers/pingers.service';
import { IProject } from '../../services/projects/projects.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pingers-list',
  templateUrl: './pingers-list.component.html',
  styleUrls: ['./pingers-list.component.scss']
})
export class PingersListComponent implements OnInit {

  @ViewChild('newWebsiteForm') newWebsiteForm;
  @ViewChild('removeWebsiteForm') removeWebsiteForm;
  @ViewChild('editWebsiteForm') editWebsiteForm;
  public newWebsiteModalVisibility: boolean = false;
  public removeWebsiteModalVisibility: boolean = false;
  public editWebsiteModalVisibility: boolean = false;
  public pingers: IPinger[] = [];
  public project: IProject;

  constructor(
    private pingersService: PingersService,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.project = data.projectInfo;

      this.pingersService.getPingersList(this.project.id).subscribe(data => this.pingers = data);
    });

    this.pingersService.newPingerState.subscribe(data => {
      if (data.state === requestState.SUCCESS)
        setTimeout(() => this.closeNewWebsiteModal(undefined, true), 2000);
    });

    this.pingersService.removePingerState.subscribe(data => {
      if (data.state === requestState.SUCCESS)
        setTimeout(() => this.closeRemoveWebsiteModal(undefined, true), 2000);
    });

    this.pingersService.editPingerState.subscribe(data => {
      if (data.state === requestState.SUCCESS)
        setTimeout(() => this.closeEditWebsiteModal(undefined, true), 2000);
    });
  }

  public showNewWebsiteModal(): void {
    this.newWebsiteForm.setProjectId(this.project.id);
    this.newWebsiteModalVisibility = true;
    this.pingersService.setNewPingerState(requestState.CREATING);
  }

  public closeNewWebsiteModal(event, close = false): void {
    if ((!!event && event.target.className.indexOf('modalContainer') !== -1) || close) {
      this.newWebsiteModalVisibility = false;
    }
  }

  public showRemoveWebsiteModal(): void {
    this.removeWebsiteModalVisibility = true;
    this.pingersService.removePingerState.next({ state: requestState.CREATING });
  }

  public closeRemoveWebsiteModal(event, close = false): void {
    if ((!!event && event.target.className.indexOf('modalContainer') !== -1) || close) {
      this.removeWebsiteModalVisibility = false;
    }
  }

  public showEditWebsiteModal(): void {
    this.editWebsiteModalVisibility = true;
    this.pingersService.editPingerState.next({ state: requestState.CREATING });
  }

  public closeEditWebsiteModal(event, close = false): void {
    if ((!!event && event.target.className.indexOf('modalContainer') !== -1) || close) {
      this.editWebsiteModalVisibility = false;
    }
  }

  public startPinger(id): void {
    this.pingersService.setPingerStatus(this.project.id, id, PingerStatus.UNDEFINED);
  }

  public pausePinger(id): void {
    this.pingersService.setPingerStatus(this.project.id, id, PingerStatus.PAUSED);
  }

  public editPinger(id): void {
    const {name, url} = this.pingers.find(item => id === item.id);
    this.editWebsiteForm.setPingerInfo(this.project.id, id, name, url);
    this.showEditWebsiteModal();
  }

  public removePinger(id): void {
    const name = this.pingers.find(item => id === item.id)['name'];
    this.removeWebsiteForm.setPingerInfo(this.project.id, name, id);
    this.showRemoveWebsiteModal();
  }

  public refreshData(): void {
    this.pingersService.reloadData(this.project.id);
  }
}
