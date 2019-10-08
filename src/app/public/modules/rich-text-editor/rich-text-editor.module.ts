import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyColorpickerModule
} from '@skyux/colorpicker';

import {
  SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyRichTextEditorResourcesModule
} from '../../plugin-resources/rich-text-editor-resources.module';

import {
  SkyRichTextEditorComponent
} from './rich-text-editor.component';

import {
  SkyRichTextEditorUrlModalComponent
} from './url-modal/url-modal.component';

import {
  SkyIconButtonModule
} from '../icon-btn/icon-button.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyRichTextEditorResourcesModule,
    SkyI18nModule,
    SkyIconModule,
    SkyIconButtonModule,
    SkyColorpickerModule,
    SkyDropdownModule,
    SkyModalModule
  ],
  exports: [
    SkyRichTextEditorComponent,
    SkyRichTextEditorUrlModalComponent
  ],
  declarations: [
    SkyRichTextEditorComponent,
    SkyRichTextEditorUrlModalComponent
  ],
  entryComponents: [
    SkyRichTextEditorUrlModalComponent
  ]
})
export class SkyRichTextEditorModule { }
