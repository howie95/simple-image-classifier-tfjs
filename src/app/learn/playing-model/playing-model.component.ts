import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../core/store.service'

@Component({
  selector: 'app-playing-model',
  templateUrl: './playing-model.component.html',
  styleUrls: ['./playing-model.component.scss']
})
export class PlayingModelComponent implements OnInit {
  public predictFinish: boolean = false
  public showRatioBarAnim: boolean = false
  public modelLabelList: string[] = []
  public predictResultList: {label: string, value: number}[] = []

  private predictImageUrl: string = ''

  get classifierImage(): string {
    return this.predictImageUrl || './assets/poodle_dog_guess.png'
  }
  get classifierTitle(): string {
    let text = 'Since your model has been trained...'
    if(this.predictFinish) {
      let result = this.predictResultList[0]
      if(result.value >= 0.8) {
        text = `I think it must be the ${result.label} 😎!`
      }else if(result.value >= 0.6) {
        text = `Emm...It might be the ${result.label} 🤔️?`
      }else {
        text = 'Oops...I can\'t figure it out 🤯'
      }
    }
    return text
  }

  constructor(
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.storeService.getModelLabelList().subscribe(list => this.modelLabelList = list)
  }

  tryChooseImage() {
    let inputElement = document.querySelector('#imageInput') as HTMLInputElement
    inputElement.click()
  }

  async predictImageSelected(event) {
    if(this.predictImageUrl){
      URL.revokeObjectURL(this.predictImageUrl)
    }
    const imgFile = event.target.files[0]
    this.predictImageUrl = URL.createObjectURL(imgFile)
    this.predictResultList = await this.storeService.makePredict(this.predictImageUrl)
    this.predictFinish = true
    setTimeout(() => {
      this.showRatioBarAnim = true
    }, 100)
  }
}
