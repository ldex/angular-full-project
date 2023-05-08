import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.css']
})
export class ModalDialogComponent {

  @ViewChild('modal') modal: ElementRef;

  @Input() title: string = "";

  @Output() onClose = new EventEmitter<string>();

  open() {
    this.modal.nativeElement.showModal();
  }

  close() {
    this.modal.nativeElement.close();
    this.onClose.emit('Modal dialog closed.');
  }
}
