import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../../core/store.service'

@Component({
  selector: 'app-prepare-data',
  templateUrl: './prepare-data.component.html',
  styleUrls: ['./prepare-data.component.scss']
})
export class PrepareDataComponent implements OnInit {
  public buttonLabel = 'Start training !'
  public buttonProgress = 0
  public isTraining = false
  public imageClassList = []

  private imageExampleLabels = ['poodle_dog', 'british_cat', 'red_apple']

  get isDataReady() {
    if(this.imageClassList.length <2 ) {
      return false
    }
    for(let i = 0; i < this.imageClassList.length; i++) {
      if(this.imageClassList[i].images.length < 5) {
        return false
      }
    }
    return true
  }
  get actionTips() {
    let tips = 'Good, it seems like your data is ready 🥳'
    if(this.imageClassList.length == 0) {
      tips = 'Add a image class to start 👆'
    }else{
      if(this.imageClassList.length < 2) {
        tips = 'You need at least 2 classes to start training 🤔️'
      }
      for(let i = 0; i < this.imageClassList.length; i++) {
        if(this.imageClassList[i].images.length<5){
          tips = 'A class need at least 5 images to be train 🤔️'
          break
        }
      }
    }
    if(this.isTraining){
      tips = ''
    }
    return tips
  }

  constructor(
    private router: Router,
    private zone: NgZone,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.storeService.getImageClassList().subscribe(list => this.imageClassList = list)
    if(this.imageClassList.length == 0) {
      this.imageExampleLabels.forEach( label => {
        let imageClass = {
          label: label,
          images: []
        }
        for (let index = 0; index < 10; index++) {
          imageClass.images.push(`./assets/example_images/${label}/${label}_${index}.png`)
        }
        this.storeService.addImageClass(imageClass)
      })
    }
  }
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
    this.isTraining = true
    await this.storeService.startTrainTask({
      onProgress: (progress: number) => {
        if(progress - this.buttonProgress > 0.2 || progress === 1) {
          //Not sure why it has to be in NgZone.run to trigger component refresh
          this.zone.run(() => {
            this.buttonProgress = progress
          })
        }
      }
    })
    setTimeout(() => {
      this.router.navigate(['/playing'])
      this.isTraining = false
    }, 1000)
  }
}
