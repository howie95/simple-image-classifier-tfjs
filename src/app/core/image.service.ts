import { Injectable } from '@angular/core';

interface ImageList {
  image: string
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor() { }

  /**
  * Convert an image into ImageData
  * @param url imageUrl
  */
  async getImageData(url: string, sideLength: number) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext("2d")
    canvas.width = sideLength
    canvas.height = sideLength
    const imgDataLoad = new Promise((resolve, reject) => {
      const image = new Image
      image.onload = () => {
        let drawRect = this.getCanvasRect(sideLength,sideLength,image.width,image.height)
        ctx.drawImage(image,drawRect.rectX,drawRect.rectY,drawRect.rectW,drawRect.rectH,0,0,sideLength,sideLength)
        resolve(true)
      }
      image.src = url
    })
    await imgDataLoad
    const imageData = ctx.getImageData(0, 0, sideLength, sideLength)
    return imageData
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
  /**
  * Make imageDataset from classified images list
  * @param imageClassList an ImageClass list
  */
  async makeImageDataset(imageList: ImageList[], sideLength: number, opt?: { onProgress: Function }) {
    const datasetBytesBuffer = new ArrayBuffer(imageList.length * sideLength * sideLength * 4 * 3)
    for (let i = 0; i < imageList.length; i++) {
      const datasetBytesView = new Float32Array(datasetBytesBuffer, i * sideLength * sideLength * 4 * 3, sideLength * sideLength * 3)
      let imageData = await this.getImageData(imageList[i].image, sideLength)
      for (let j = 0; j < imageData.data.length / 4; j++) {
        datasetBytesView[j * 3] = imageData.data[j * 4] / 255
        datasetBytesView[j * 3 + 1] = imageData.data[j * 4 + 1] / 255
        datasetBytesView[j * 3 + 2] = imageData.data[j * 4 + 2] / 255
      }
      opt?.onProgress((i + 1) / imageList.length)
    }
    const datasetImage = new Float32Array(datasetBytesBuffer)
    return datasetImage
  }
}
