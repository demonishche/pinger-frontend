import { Component, OnInit, ViewChild } from '@angular/core';
import { PingersService, newPingerState, IPinger, PingerStatus } from '../../services/pingers/pingers.service';

@Component({
  selector: 'app-pingers-list',
  templateUrl: './pingers-list.component.html',
  styleUrls: ['./pingers-list.component.scss']
})
export class PingersListComponent implements OnInit {

  @ViewChild('removeWebsiteForm') removeWebsiteForm;
  public newWebsiteModalVisibility: boolean = false;
  public removeWebsiteModalVisibility: boolean = false;
  public pingers: IPinger[] = [];

  constructor(private pingersService: PingersService) { }

  ngOnInit() {
    this.pingersService.newPingerState.subscribe(data => {
      if (data.state === newPingerState.SUCCESS)
        setTimeout(() => this.closeNewWebsiteModal(undefined, true), 2000);
    });

    this.pingersService.removePingerState.subscribe(data => {
      if (data.state === newPingerState.SUCCESS)
        setTimeout(() => this.closeRemoveWebsiteModal(undefined, true), 2000);
    });

    this.pingersService.getPingersList().subscribe(data => this.pingers = data);
  }

  public showNewWebsiteModal(): void {
    this.newWebsiteModalVisibility = true;
    this.pingersService.setNewPingerState(newPingerState.CREATING);
  }

  public closeNewWebsiteModal(event, close = false): void {
    if ((!!event && event.target.className.indexOf('modalContainer') !== -1) || close) {
      this.newWebsiteModalVisibility = false;
    }
  }

  public showRemoveWebsiteModal(): void {
    this.removeWebsiteModalVisibility = true;
    this.pingersService.removePingerState.next({state: newPingerState.CREATING});
  }

  public closeRemoveWebsiteModal(event, close = false): void {
    if ((!!event && event.target.className.indexOf('modalContainer') !== -1) || close) {
      this.removeWebsiteModalVisibility = false;
    }
  }

  public startPinger(id): void {
    this.pingersService.setPingerStatus(id, PingerStatus.UNDEFINED);
  }

  public pausePinger(id): void {
    this.pingersService.setPingerStatus(id, PingerStatus.PAUSED);
  }

  public editPinger(id): void {
    console.log(id);
  }

  public removePinger(id): void {
    const name = this.pingers.find(item => id === item.id)['name'];
    this.removeWebsiteForm.setPingerInfo(name , id);
    this.showRemoveWebsiteModal();
  }

  public refreshData(): void {
    this.pingersService.reloadData();
  }
}
