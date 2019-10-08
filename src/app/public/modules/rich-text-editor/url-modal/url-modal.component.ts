import {
  Component
} from '@angular/core';

import {
  SkyModalInstance
} from '@skyux/modals';

import {
    SkyValidation
} from '@skyux/validation';

import {
  UrlModalResult
} from './url-modal-result';

@Component({
  selector: 'skyux-rich-text-editor-url-modal',
  templateUrl: './url-modal.component.html'
})
export class SkyRichTextEditorUrlModalComponent {
    public set url(value: string) {
        this._url = value;
        this.valid = this.isValid(value);
    }
    public get url(): string {
        return this._url;
    }

    public target: number = 0;

    public valid: boolean = false;
    private _url: string = '';

    constructor(
        private modalInstance: SkyModalInstance
    ) {}

    public save() {
        if (this.isValid(this.url)) {
            this.modalInstance.save({
                url: this.url,
                target: this.target
            } as UrlModalResult);
        }
    }

    public cancel() {
        this.modalInstance.cancel();
    }

    private isValid(value: string): boolean {
        return !!value && SkyValidation.isUrl(value);
    }
}
