import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { InputChangeEventDetail } from '@ionic/angular';
import { IonInputCustomEvent } from '@ionic/core';
import * as Tesseract from 'tesseract.js'

@Component({
  selector: 'app-tab1',
  templateUrl: 'ocr.page.html',
  styleUrls: ['ocr.page.scss']
})
export class OcrPage {

removeFood(_t33: Food) {
  this.foods = this.foods.filter(food => food !== _t33);
}
updateAmount(_t33: Food,$event: IonInputCustomEvent<InputChangeEventDetail>) {
  _t33.amount = parseFloat(($event.target as unknown as HTMLInputElement).value);
}
updateDate(_t29: Food,$event: Event) {
  console.log("Date updated: " + ($event.target as HTMLInputElement).value);
  _t29.date = ($event.target as HTMLInputElement).value;
}

  public selectedImage!: string;
  public imageText!: string;
  public photos: UserPhoto[] = [];
  public foods: Food[] = [];
  public defaultText = 'Ei Appel Brood';

  public onSubmit(){
    console.log("form submitted YAY");
    console.log(this.foods);
  }

  constructor() {
    this.imageText = '';
  }
  async getPicture() {
    const capturedPhoto = await Camera.getPhoto({
    resultType: CameraResultType.Uri,
    source: CameraSource.Camera,
    quality: 100
    });
    this.selectedImage = capturedPhoto.webPath!;
    this.photos.unshift({
      filepath: "soon...",
      webviewPath: capturedPhoto.webPath!
    });
    this.recognizeImage();
  }
  
  async recognizeImage() {
    const worker = await Tesseract.createWorker('nld');
    worker.recognize(this.selectedImage)
      .then(result => {
        this.imageText = result.data.text;
        // to lowercase
        this.imageText = this.imageText.toLowerCase();
        // split on spaces
        const words = this.imageText.split(' ');
        this.foods = [];
        console.log(words);
        // loop over know foods and check if they are in the text
        KnownFoodsInDutch.foods.forEach((food, index) => {
          if (this.findKeyword(this.imageText, food)) {
            this.foods.push(new Food(food, KnownFoodsInDutch.foodsExpirationInDays[index]));
          }
        });
      })
      .catch(error => {
        console.error('Error recognizing image:', error);
      });
  }

  // function to check if a keword in given text
  findKeyword(text: string, keyword: string): boolean {
    return text.includes(keyword);
  }


}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

export class KnownFoodsInDutch {
  public static readonly foods: string[] = [
    'appel',
    'banaan',
    'brood',
    'chocolade',
    'ei',
    'kaas',
    'rijst'
  ];
  public static readonly foodsExpirationInDays: number[] = [
    7,
    5,
    3,
    10,
    7,
    14,
    30
  ];
}

export class Food {
  public name: string;
  public expirationInDays: number;
  public amount: number = 1.0;
  public date: string = new Date().toISOString();
  constructor(name: string, expirationInDays: number) {
    this.name = name;
    this.expirationInDays = expirationInDays;
  }
}