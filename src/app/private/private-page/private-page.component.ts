import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { ProjectsService, IProject } from '../../services/projects/projects.service';
import { SwPush } from '@angular/service-worker';
import { environment } from '../../../environments/environment';
import { PushNotificationService } from '../../services/push-notification/push-notification.service';

@Component({
  selector: 'app-private-page',
  templateUrl: './private-page.component.html',
  styleUrls: ['./private-page.component.scss'],
  providers: [PushNotificationService]
})
export class PrivatePageComponent implements OnInit {

  public username: string;
  public projects: IProject[];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private projecsService: ProjectsService,
    private swPush: SwPush,
    private pushNotificationService: PushNotificationService
  ) { }

  async ngOnInit() {
    this.username = (await this.userService.getUserInfo()).username;

    this.projecsService.getList().subscribe(data => {
      this.projects = data;
    });

    if (this.swPush.isEnabled) {
      this.swPush.requestSubscription({
        serverPublicKey: environment.vapid_public
      })
      .then(subscription => {
        this.pushNotificationService.sendSubscription(subscription);
      })
      .catch(console.error);

    }
  }

  public logout(): void {
    this.authService.logout();
  }
}
