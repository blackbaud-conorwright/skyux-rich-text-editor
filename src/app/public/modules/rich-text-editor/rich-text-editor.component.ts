import {
  Component,
  ViewEncapsulation,
  HostListener,
  Input,
  forwardRef
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

import {
    SkyColorpickerOutput
} from '@skyux/colorpicker';

import {
  SkyModalService,
  SkyModalCloseArgs
} from '@skyux/modals';

import {
  SkyRichTextEditorUrlModalComponent
} from './url-modal/url-modal.component';

import {
  UrlTarget
} from './url-modal/url-target';

import {
  SkyRichTextEditorMergeField
} from './types/rich-text-editor-merge-field';

@Component({
  selector: 'rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // tslint:disable-next-line: no-forward-ref
      useExisting: forwardRef(() => SkyRichTextEditorComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class SkyRichTextEditorComponent implements ControlValueAccessor {
  public fontSizeList = Array(7).fill(0).map((_, i: number) => i + 1);
  public fontList = [
    {
      name: 'Blackbaud Sans',
      value: '"Blackbaud Sans", "Helvetica Neue", Arial, sans-serif'
    },
    {
      name: 'Arial',
      value: 'Arial'
    },
    {
      name: 'Arial Black',
      value: '"Arial Black"'
    },
    {
      name: 'Courier New',
      value: '"Courier New"'
    },
    {
      name: 'Times New Roman',
      value: '"Times New Roman"'
    }
  ];

  @Input()
  public mergeFields: SkyRichTextEditorMergeField[] = [];

  public backColor = '#ffffff';
  public fontColor = '#000000';
  public fontSize = 4;
  public font = this.fontList[0].value;
  public tag = 'p';
  public boldState = false;
  public italicState = false;
  public underlineState = false;

  public get value(): string {
    return this._value;
  }
  public set value(value: string) {
    if (this._value !== value) {
      this._value = value;
      this.syncElements();
      this.onChange();
    }
  }

  private _value = '<p></p>';

  constructor(
    public modalService: SkyModalService
  ) { }

  public writeValue(obj: string): void {
    this.value = obj;
  }

  public registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this._onTouch = fn;
  }

  public onChange() {
    this._onChange(this.value);
  }

  public onTouch() {
    this._onTouch();
  }

  public pasteOverride(e: ClipboardEvent) {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    this.execCommand('insertHTML', text);
  }

  public link(): void {
    const priorSelection = this.saveSelection();
    const inputModal = this.modalService.open(SkyRichTextEditorUrlModalComponent);
    inputModal.closed.subscribe((result: SkyModalCloseArgs) => {
      if (result.reason === 'save' && priorSelection) {
        this.restoreSelection(priorSelection);
        if (result.data.target === UrlTarget.None) {
          // Current window
          this.execCommand('createLink', result.data.url);
        } else {
          // New Window
          const sText = document.getSelection();
          this.execCommand('insertHTML', '<a href="' + result.data.url + '" rel="noopener noreferrer" target="_blank">' + sText + '</a>');
        }
      }
    });
  }

  public insertMergeField(field: SkyRichTextEditorMergeField) {
    this.execCommand(
      'insertHTML',
      '<img style="display: inline; cursor: grab;" data-fieldname="' + field.id +
        '" data-fielddisplay="' + field.name +
        '" src="' + this.makeImageFromText(field.name) + '" />'
    );
  }

  public copy(): void {
    this.execCommand('copy');
  }

  public changeFontSize() {
    this.fontSize = this.fontSize > 7 ? 7 : this.fontSize;
    this.fontSize = this.fontSize < 1 ? 1 : this.fontSize;
    this.execCommand('fontSize', this.fontSize);
  }

  public changeColor(color: SkyColorpickerOutput, isBackground = false): void {
    this.execCommand(isBackground ? 'backColor' : 'foreColor', color.hex);
  }

  public changeTag(tag: string) {
    this.execCommand('formatblock', tag);
  }

  public execCommand(command: string, value: any = ''): void {
    const editor: HTMLElement = document.querySelector('.editor');
    if (!editor.contains(document.getSelection().anchorNode)) {
      editor.focus();
    }
    if (editor.contains(document.getSelection().anchorNode)) {
      document.execCommand(command, false, value);
      this.updateValues();
    }
  }

  @HostListener('document:selectionchange', ['$event'])
  public updateValues(): void {
    const editor = document.querySelector('.editor');
    if (editor.contains(document.getSelection().anchorNode)) {
      this.backColor = document.queryCommandValue('BackColor');
      this.fontColor = document.queryCommandValue('ForeColor');
      this.fontSize = parseInt(document.queryCommandValue('fontsize') || '4', undefined);
      this.font = document.queryCommandValue('fontname');
      this.tag = document.queryCommandValue('FormatBlock');
      this.boldState = document.queryCommandState('Bold');
      this.italicState = document.queryCommandState('Italic');
      this.underlineState = document.queryCommandState('Underline');
    }
    this.updateValue();
  }

  private updateValue() {
    const editorContent = document.querySelector('.editor');
    this.value = editorContent.innerHTML;
  }

  private syncElements() {
    const editorContent = document.querySelector('.editor');
    if (editorContent.innerHTML !== this.value) {
      const previousSelection = this.saveSelection();
      editorContent.innerHTML = this.value;
      this.restoreSelection(previousSelection);
    }
  }

  private saveSelection(): Range {
    if (window.getSelection) {
      const sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        return sel.getRangeAt(0);
      }
    } else if (document.getSelection() && document.getSelection().getRangeAt) {
      return document.getSelection().getRangeAt(0);
    }
    return undefined;
  }

  private restoreSelection(selectedRange: Range): void {
    if (selectedRange) {
      if (window.getSelection) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(selectedRange);
      } else if (document.getSelection) {
        const sel = document.getSelection();
        sel.removeAllRanges();
        sel.addRange(selectedRange);
      }
    }
  }

  private makeImageFromText(text: string): string {
    let textToUse = text;
    if (text.length > 18) {
      textToUse = text.substr(0, 15) + '...';
    }

    const canvasElement = document.createElement('canvas');
    canvasElement.setAttribute('height', '20');
    canvasElement.setAttribute('width', '100');
    canvasElement.style.backgroundColor = 'tan';
    canvasElement.style.border = '1px solid #000000';
    canvasElement.style.borderRadius = '5px';

    const context = canvasElement.getContext('2d');
    context.font = '12px Arial';
    context.textAlign = 'center';
    context.fillText(textToUse, 50, 15);

    context.globalCompositeOperation = 'destination-over';
    context.fillStyle = '#00FFFF';
    context.fillRect(0, 0, 100, 20);

    context.globalCompositeOperation = 'source-over';
    context.lineWidth = 2;
    context.strokeStyle = '#FF0000';
    context.strokeRect(0, 0, 100, 20);

    const result = canvasElement.toDataURL('image/png', 1.0);
    return result;
  }

  private _onChange = (value: string) => {};
  private _onTouch = () => {};
}
