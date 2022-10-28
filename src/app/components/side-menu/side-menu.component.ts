import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
    @Input() filters: any = {};
    @Input() selectedFilters: any = {};
    @Input() smallScreen: boolean = false;
    @Output() filterChange: any = new EventEmitter();

    ngOnInit(): void {
    }

    change(event) {
        this.filterChange.emit(event);
    }

}
