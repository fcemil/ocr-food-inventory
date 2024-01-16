import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OcrPage } from './ocr.page';

const routes: Routes = [
  {
    path: '',
    component: OcrPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab1PageRoutingModule {}
