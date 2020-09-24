import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ServersService } from '../servers.service';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css']
})
export class ServerComponent implements OnInit {
  server: {id: number, name: string, status: string};
  paramsSubscription: Subscription;

  constructor(private serversService: ServersService,
              private router:Router,
              private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.data
      .subscribe(
        (data: Data) => {
          this.server = data['server']
        }
      );
    // const id = +this.route.snapshot.params['id'];
    // this.route.params
    //   .subscribe(
    //     (params:Params) => {
    //       this.server = this.serversService.getServer(+params['id']);
    //     }
    //   )
    // this.server = this.serversService.getServer(id);
    // console.log(this.server);
  }

  onEdit() {
    this.router.navigate(['edit'], {
        relativeTo: this.route, 
        queryParamsHandling: 'preserve'
      });
  }

}
