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

    selectCity(city) {
        this.filterChange.emit({ type: 'City', value: city });
    }

    /* When the user clicks on the button,
    toggle between hiding and showing the dropdown content */
    myFunction() {
        document.getElementById("myDropdown").classList.toggle("show");
    }

}
