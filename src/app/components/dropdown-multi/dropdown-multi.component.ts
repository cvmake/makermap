import { AfterContentChecked, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'dropdown-multi',
    templateUrl: './dropdown-multi.component.html',
    styleUrls: ['./dropdown-multi.component.scss']
})
export class DropdownMultiComponent implements OnInit, AfterContentChecked {
    @Input() data: any = [];
    @Input() label: any = '';
    @Input() type: any = '';
    @Output() change: any = new EventEmitter();

    selected = 'All';
    selectedInit: boolean = false;
    allChecked: boolean = true;

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

    ngAfterContentChecked() {
        if (this.data[this.type].array.length > 0 && this.selectedInit === false) {
            this.selectedInit = true;
        }
    }

    select(event) {
        this.data[this.type].map.set(event.target.id, event.target.checked === false ? 0 : 1);
        this.selected = this.getSelected();
        if (this.selected != 'All')
            this.allChecked = false;
        this.change.emit({ type: this.type, value: this.data[this.type].map });
    }

    selectAll(event) {
        let newValue = 0;
        if (event.target.checked)
            newValue = 1;
        for (let i = 0; i < this.data[this.type].array.length; i++) {
            this.data[this.type].map.set(this.data[this.type].array[i], newValue);
        }
        if (newValue === 1)
            this.selected = 'All';
        else
            this.selected = 'None';
        this.change.emit({ type: this.type, value: this.data[this.type].map });
    }

    getSelected() {
        let selected = 'None';
        let count = 0;
        for (const element of this.data[this.type].map) {
            count += element[1];
            if (element[1] === 1 && selected === 'None') {
                selected = element[0];
            } else if (element[1] === 1 && count === 2) {
                selected += '...';
            }
        }
        if (count > 1) {
            selected += ' (+' + (count - 1) + ')';
        }
        return selected;
    }

    toggle(event) {
        document.getElementById("dropdown" + this.type).style.maxHeight = (event.view[0].innerHeight - event.y - 70) + 'px';
        document.getElementById("dropdown" + this.type).classList.toggle("show");
    }

}
