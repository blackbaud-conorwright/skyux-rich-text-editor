import {
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'sky-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss']
})
export class SkyIconButtonComponent {
    @Input()
    public icon: string;

    @Input()
    public isPrimary = false;
}
