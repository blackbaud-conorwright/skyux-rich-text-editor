import {
  Component
} from '@angular/core';

@Component({
  selector: 'rich-text-editor-visual',
  templateUrl: './rich-text-editor-visual.component.html',
  styleUrls: ['./rich-text-editor-visual.component.scss']
})
export class RichTextEditorVisualComponent {
  public mergeFields = [
    {
      id: '0',
      name: 'Best field'
    },
    {
      id: '1',
      name: 'Second best field'
    },
    {
      id: '2',
      name: 'A field that is really too long for its own good'
    }
  ];

  public value: string = '<p>I am a test</p>';
}
