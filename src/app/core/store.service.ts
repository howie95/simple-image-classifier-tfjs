import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'
import { ImageService } from './image.service'
import { TfjsService } from './tfjs.service'
import * as tf from '@tensorflow/tfjs'

interface ImageClass {
  label: string
  images: string[]
}
interface ImageLabel {
  label: string
  image: string
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private imageSideLength = 150
  private imageClassList:ImageClass[] = []
  private modelLabels:string[] = []
  private trainModel:tf.LayersModel

  constructor(
    private imageService: ImageService,
    private tfjsService: TfjsService
  ) { }

  /**
   * Get stored model labels
   */
  getModelLabelList(): Observable<string[]> {
    return of(this.modelLabels)
  }
  /**
   * Get stored imageClassList used by pages 
   */
  getImageClassList(): Observable<ImageClass[]> {
    return of(this.imageClassList)
  }
  /**
   * Add new class to stored imageClassList used by pages 
   * @param item ImageClass item
   */
  addImageClass(item: ImageClass) {
    this.imageClassList.push(item)
  }

  async startTrainTask(opt?: { onProgress: Function }) {
    this.modelLabels = this.imageClassList.map(item => {
      return item.label
    })

    let imageDataList: ImageLabel[] = []
    let imageLabelList: number[] = []

    this.imageClassList.forEach(item => {
      item.images.forEach(image => {
        imageDataList.push({
          label: item.label,
          image: image
        })
      })
    })
    imageDataList.sort(()=>{return 0.5 - Math.random()})
    imageLabelList = imageDataList.map(item => {
      return this.modelLabels.indexOf(item.label)
    })

    let datasetImage = await this.imageService.makeImageDataset(imageDataList , this.imageSideLength, {
      onProgress: progress => {
        opt?.onProgress(parseFloat((0.2 * progress).toFixed(2)))
      }
    })
    
    const [trainXs, trainYs] = tf.tidy(() => {
      return [
        this.tfjsService.getImagesTensor(datasetImage, imageDataList.length, this.imageSideLength),
        this.tfjsService.makeLabelOneHot(imageLabelList,this.modelLabels.length)
      ]
    })
    this.trainModel = this.tfjsService.makeNewModel(this.modelLabels.length, this.imageSideLength)
    await this.tfjsService.trainModel(this.trainModel, trainXs, trainYs, {
      onProgress: progress => {
        opt?.onProgress(parseFloat((0.8 * progress + 0.2).toFixed(2)))
      }
    })

    opt?.onProgress(1)
  }

  async makePredict(imgUrl: string) {
    let datasetImage = await this.imageService.makeImageDataset([{ image: imgUrl }], this.imageSideLength)
    let xs = this.tfjsService.getImagesTensor(datasetImage, 1, this.imageSideLength)
    const prediction = (this.trainModel.predict(xs) as tf.Tensor).dataSync()
    xs.dispose()
    let result = []
    for (let i = 0; i < prediction.length; i++) {
      result.push({
        label: this.modelLabels[i],
        value: parseFloat(prediction[i].toFixed(2))
      })
    }
    result.sort((a, b) => b.value - a.value)
    return result
  }
}
