import { Component, OnInit, Input } from '@angular/core';
import { input } from '@tensorflow/tfjs';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() label: string = ''
  @Input() type: string = 'normal'
  @Input() progress: number = 0
  @Input() disable: boolean = false

  constructor() { }

  ngOnInit(): void {
  }

}
