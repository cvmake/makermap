import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'top-menu',
    templateUrl: './top-menu.component.html',
    styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {
    @Output() toggleMenuEvent: EventEmitter<any> = new EventEmitter();

    constructor() {
    }

    toggleMenu(){
        this.toggleMenuEvent.emit(null);
    }

    ngOnInit(): void {
    }

}
