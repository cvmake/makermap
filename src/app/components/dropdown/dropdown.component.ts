import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {
    @Input() label: any = '';
    @Input() type: any = '';
    @Input() data: any = {};
    @Output() change: any = new EventEmitter();

    selected = 'All';

    constructor() {
    }

    ngOnInit(): void {
        // Close the dropdown menu if the user clicks outside of it
        window.onclick = function (event) {
            if (!event.target.matches('.dropbtn')) {
                var dropdowns = document.getElementsByClassName("dropdown-content");
                var i;
                for (i = 0; i < dropdowns.length; i++) {
                    var openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('show')) {
                        openDropdown.classList.remove('show');
                    }
                }
            }
        }
    }

    select(value) {
        this.selected = value;
        this.change.emit({ type: this.type, value: value });
    }

    toggle() {
        document.getElementById("dropdown"+this.type).classList.toggle("show");
    }

}
