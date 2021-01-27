import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs'

@Injectable({
  providedIn: 'root'
})
export class TfjsService {

  constructor() {
  }

  makeLabelOneHot(imageLabels: number[], modelLabelLength: number) {
    let l1d = tf.expandDims(imageLabels, 1)
    let i1d = tf.expandDims(tf.range(0,imageLabels.length), 1)
    let c1d = tf.concat([i1d, l1d], 1).toInt()
    let one_hot = tf.sparseToDense(c1d, 1, tf.zeros([imageLabels.length, modelLabelLength]).shape)
    return one_hot
  }
  
  makeNewModel(classNum: number, sideLength: number) {
    const model = tf.sequential()

    model.add(tf.layers.conv2d({
      inputShape: [sideLength, sideLength, 3],
      kernelSize: 5,
      filters: 8,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'varianceScaling'
    }))

    model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}))

    model.add(tf.layers.conv2d({
      kernelSize: 5,
      filters: 16,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'varianceScaling'
    }));
    model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}))

    model.add(tf.layers.flatten())

    model.add(tf.layers.dense({
      units: classNum,
      kernelInitializer: 'varianceScaling',
      activation: 'softmax'
    }))

    const optimizer = tf.train.adam();
    model.compile({
      optimizer: optimizer,
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    })

    return model
  }

  getImagesTensor(datasetImage: Float32Array, imagesNum: number, sideLength: number) {
    return tf.tensor4d(datasetImage, [imagesNum, sideLength, sideLength, 3])
  }

  trainModel(model: tf.LayersModel, xs: tf.Tensor, ys: tf.Tensor, opt?: { onProgress: Function }) {
    return model.fit(xs, ys, {
      batchSize: 5,
      epochs: 20,
      shuffle: true,
      callbacks: {
        onEpochEnd: epoch => {
          opt?.onProgress((epoch + 1) / 20)
        }
      }
    })
  }
}
