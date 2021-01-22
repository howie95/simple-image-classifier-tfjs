import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../core/store.service'

@Component({
  selector: 'app-playing-model',
  templateUrl: './playing-model.component.html',
  styleUrls: ['./playing-model.component.scss']
})
export class PlayingModelComponent implements OnInit {
  imageClassList = ''

  constructor(
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.storeService.getImageClassList().subscribe(list => this.imageClassList = JSON.stringify(list))
  }

}
