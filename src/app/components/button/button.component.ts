import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() label: string = ''
  @Input() type: string = 'normal'
  @Input() disable: boolean = false
  @Input() set progress(value: number) {
    this.progressPercent = value * 100 + '%'
  }

  public progressPercent: string = '0%'

  constructor() { }

  ngOnInit(): void {
  }
}
