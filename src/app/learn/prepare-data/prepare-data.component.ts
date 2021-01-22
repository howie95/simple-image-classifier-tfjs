import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../../core/store.service'

@Component({
  selector: 'app-prepare-data',
  templateUrl: './prepare-data.component.html',
  styleUrls: ['./prepare-data.component.scss']
})
export class PrepareDataComponent implements OnInit {
  buttonLabel = 'Start training !'

  imageClassList = []
  private imageExampleLabels = ['poodle_dog', 'british_cat', 'red_apple']

  constructor(
    private router: Router,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.storeService.getImageClassList().subscribe(list => this.imageClassList = list)
    this.imageExampleLabels.forEach( label => {
      this.storeService.addImageClass({
        label: label,
        images: [
          `../../../assets/example_images/${label}/${label}_0.png`,
          `../../../assets/example_images/${label}/${label}_1.png`,
          `../../../assets/example_images/${label}/${label}_2.png`,
          `../../../assets/example_images/${label}/${label}_3.png`,
          `../../../assets/example_images/${label}/${label}_4.png`
        ]
      })
    })
  }
  testInc = 0
  testFuc() {
    this.storeService.addImageClass({
      label: '1',
      images: []
    })
  }
  getActionTipsStatus() {
    return 'right'
  }

  async startLearnProcess() {
    this.storeService.startTrainTask({
      onProgress: progress => {
        console.log(progress)
      }
    })
    return
    this.router.navigate(['/playing'])
  }
  predictImageSelected(event) {
    try {
      const imgFile = event.target.files[0]
      const imgUrl = URL.createObjectURL(imgFile)
      this.storeService.makePredict(imgUrl)
    } catch (error) {
      console.error(error)
    }
  }

  imageSelected(event?) {
    try {
      const imgFile = event.target.files[0]
      const imgUrl = URL.createObjectURL(imgFile)
      const img = new Image
      img.src = imgUrl
      img.onload = () => {
        this.makeImage(img)
        URL.revokeObjectURL(imgUrl)
      }
    } catch (error) {
      console.error(error)
    }
  }
  makeImage(img: HTMLImageElement) {
    let canvas = document.createElement('canvas')
    canvas.width = 150
    canvas.height = 150
    let canvasCtx = canvas.getContext('2d')
    let drawRect = this.getCanvasRect(150,150,img.width,img.height)
    canvasCtx.drawImage(img,drawRect.rectX,drawRect.rectY,drawRect.rectW,drawRect.rectH,0,0,150,150)
    document.body.appendChild(canvas)
  }
  getCanvasRect(canvasW: number, canvasH: number, SourceW: number, SourceH: number) {
    let rectX = 0,
        rectY = 0,
        rectW = SourceW,
        rectH = SourceH
    if(SourceW > SourceH || (SourceW == SourceH && canvasW < canvasH)) {
      rectW = canvasW * SourceH / canvasH
      rectX = (SourceW - rectW) / 2
    }else if(SourceW < SourceH || (SourceW == SourceH && canvasW > canvasH)) {
      rectH = canvasH * SourceW / canvasW
      rectY = (SourceH - rectH) / 2
    }
    return {
      rectX,
      rectY,
      rectW,
      rectH
    }
  }
}
