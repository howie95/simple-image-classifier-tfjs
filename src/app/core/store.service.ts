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
    
    let xs = this.tfjsService.getImagesTensor(datasetImage, imageDataList.length, this.imageSideLength)

    let labels = this.tfjsService.makeLabelOneHot(imageLabelList,this.modelLabels.length)

    this.trainModel = this.tfjsService.makeNewModel(this.modelLabels.length, this.imageSideLength)
    const trainHistory = await this.tfjsService.trainModel(this.trainModel, xs, labels, {
      onProgress: progress => {
        opt?.onProgress(parseFloat((0.8 * progress + 0.2).toFixed(2)))
      }
    })

    xs.dispose()
    labels.dispose()

    opt?.onProgress(1)
    console.log(this.modelLabels)
  }

  async makePredict(imgUrl: string) {
    let datasetImage = await this.imageService.makeImageDataset([{ image: imgUrl }], this.imageSideLength, {
      onProgress: progress => {
        console.log(progress)
      }
    })
    let xs = this.tfjsService.getImagesTensor(datasetImage, 1, this.imageSideLength)
    const prediction = (this.trainModel.predict(xs) as tf.Tensor).dataSync()
    console.log(prediction)
    xs.dispose()
  }
}
