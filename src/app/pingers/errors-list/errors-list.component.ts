import { Component, OnInit } from '@angular/core';
import { IPinger } from '../../services/pingers/pingers.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-errors-list',
  templateUrl: './errors-list.component.html',
  styleUrls: ['./errors-list.component.scss']
})
export class ErrorsListComponent implements OnInit {

  public pinger: IPinger;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.pinger = data.info.pinger;
    });
  }

}
