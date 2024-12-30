import '@tensorflow/tfjs-node';
import * as faceapi from '@vladmandic/face-api';
import { Canvas, Image, ImageData } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';

 class FaceSearchService {
  initialized = false;
  faceDescriptorCache = new Map();

  async initialize() {
    if (this.initialized) return;

    // Initialize face-api
    faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

    // Load required models
    await faceapi.nets.faceRecognitionNet.loadFromDisk('server/services/FaceModels');
    await faceapi.nets.faceLandmark68Net.loadFromDisk('server/services/FaceModels');
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('server/services/FaceModels');

    this.initialized = true;
  }

  async getFaceDescriptor(imagePath) {
    try {
      // Check cache first
      if (this.faceDescriptorCache.has(imagePath)) {
        return this.faceDescriptorCache.get(imagePath);
      }

      const img = await faceapi.fetchImage(imagePath);
      const detection = await faceapi.detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) return null;

      // Cache the result
      this.faceDescriptorCache.set(imagePath, detection.descriptor);
      return detection.descriptor;
    } catch (error) {
      console.error('Error getting face descriptor:', error);
      return null;
    }
  }

  async findSimilarFaces(
    referenceImagePath,
    searchDirectory,
    threshold = 0.6
  ){
    await this.initialize();

    const referenceDescriptor = await this.getFaceDescriptor(referenceImagePath);
    if (!referenceDescriptor) return [];

    const results = [];
    const files = this.getImageFiles(searchDirectory);

    for (const file of files) {
      const descriptor = await this.getFaceDescriptor(file);
      if (descriptor) {
        const distance = faceapi.euclideanDistance(referenceDescriptor, descriptor);
        const similarity = 1 - distance;
        if (similarity >= threshold) {
          results.push({ path: file, similarity });
        }
      }
    }

    return results.sort((a, b) => b.similarity - a.similarity);
  }

 getImageFiles(directory) {
    const imageExtensions = ['.jpg', '.jpeg', '.png'];
    const results = [];

    const readDirectory = (dir) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
          readDirectory(fullPath);
        } else if (imageExtensions.includes(path.extname(fullPath).toLowerCase())) {
          results.push(fullPath);
        }
      }
    };

    readDirectory(directory);
    return results;
  }
}

export default new FaceSearchService();
