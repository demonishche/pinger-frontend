import { Component, OnInit } from '@angular/core';
import { UserService, IUser } from '../../services/user/user.service';
import { PingersService, IPinger } from '../../services/pingers/pingers.service';

@Component({
  selector: 'app-private-page',
  templateUrl: './private-page.component.html',
  styleUrls: ['./private-page.component.scss']
})
export class PrivatePageComponent implements OnInit {

  public username: string;
  public pingers: IPinger[];

  constructor(
    private userService: UserService,
    private pingersService: PingersService
  ) { }

  async ngOnInit() {
    this.username = (await this.userService.getUserInfo()).username;
    this.pingersService.getPingersList().subscribe(data => {
      this.pingers = data;
      console.log(this.pingers)
    });
  }

}
