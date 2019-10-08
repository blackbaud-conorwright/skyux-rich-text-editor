import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyIconButtonComponent
} from './icon-button.component';

@NgModule({
  imports: [
    CommonModule,
    SkyIconModule
  ],
  exports: [
    SkyIconButtonComponent
  ],
  declarations: [
    SkyIconButtonComponent
  ]
})
export class SkyIconButtonModule { }
