import { Component } from '@angular/core';
import { CvPageComponent } from './@presentation/pages/cv/cv-page.component';

@Component({
  selector: 'app-root',
  imports: [CvPageComponent],
  template: '<app-cv-page />',
})
export class App {}
