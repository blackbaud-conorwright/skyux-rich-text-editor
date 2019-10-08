import {
  NgModule
} from '@angular/core';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyRichTextEditorModule
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyRichTextEditorModule
  ]
})
export class AppExtrasModule { }
