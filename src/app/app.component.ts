import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { GoogleMap, MapInfoWindow } from "@angular/google-maps";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
    @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow;

    private filterCategories = ['City', 'What'];
    private selectedFilters = {};
    filters = {};

    smallScreen = false;
    showSideMenu = false;
    mapWidth = 500;
    mapHeight = 500;
    companiesTsv = '';

    menuBreakpoint = 1000;

    zoom = 12;
    center: google.maps.LatLngLiteral = {
        lat: 34.2010894490859,
        lng: -118.86900114840579
    };
    options: google.maps.MapOptions = {
        zoomControl: true,
        scrollwheel: true,
        disableDoubleClickZoom: true,
        maxZoom: 20,
        minZoom: 8,
        fullscreenControl: false
    }
    allMarkers: any = [];
    filteredMarkers: any = [];
    companies: any = [];
    infoContent = '';

    @HostListener('window:resize', ['$event'])
    getScreenSize() {
        this.smallScreen = window.innerWidth <= this.menuBreakpoint;
        this.showSideMenu = window.innerWidth >= this.menuBreakpoint + 1;
        if (window.innerWidth <= this.menuBreakpoint) {
            this.mapHeight = window.innerHeight - 40;
            this.mapWidth = window.innerWidth;
        } else {
            this.mapHeight = window.innerHeight;
            this.mapWidth = window.innerWidth - 237;
        }
    }

    constructor(private httpClient: HttpClient) {
        this.getScreenSize();
    }

    ngOnInit() {
        this.prepareFilters();
        this.getCompaniesTsv();
    }

    toggleMenu() {
        this.showSideMenu = !this.showSideMenu;
    }

    filterChange(event) {
        this.selectedFilters[event.type].selected = event.value;
        this.filteredMarkers = this.allMarkers.filter(this.updateFilteredMarkers.bind(this));
    }

    updateFilteredMarkers(item) {
        let keep = true;
        for (const element in this.selectedFilters) {
            if (item.info[element] === '')
                keep = false;
            if (this.selectedFilters[element].selected.get(item.info[element]) === 0)
                keep = false;
        }
        return keep;
    }

    prepareFilters() {
        for (const index in this.filterCategories) {
            this.filters[this.filterCategories[index]] = {
                array: [],
                map: new Map()
            };
            this.selectedFilters[this.filterCategories[index]] = {
                selected: new Map()
            }
        }
    }

    updateFilterArrays() {
        for (const index in this.filterCategories) {
            this.filters[this.filterCategories[index]].array = Array.from(this.filters[this.filterCategories[index]].map.keys());
        }
    }

    getCompaniesTsv() {
        this.httpClient.request('GET', 'Companies.tsv', { responseType: 'text' }).subscribe(
            (response) => {
                this.companiesTsv = response;
                this.convertCompaniesTSVintoJSON();
                this.createMarkers();
                this.updateFilterArrays();
            },
            (error) => {
                console.error('companies error: ' + error.error);
            }
        );
    }

    openInfo(marker, content) {
        this.infoContent = content;
        this.info.open(marker);
    }

    createMarkers() {
        let markerList = [];
        for (var a = 0; a < this.companies.length; a++) {
            if (this.companies[a].Lat != '' && this.companies[a].Long != '') {
                // populate filter lists
                for (const index in this.filterCategories) {
                    if (this.companies[a][this.filterCategories[index]] != '' && this.companies[a][this.filterCategories[index]] != undefined) {
                        this.filters[this.filterCategories[index]].map.set(this.companies[a][this.filterCategories[index]], 1);
                    }
                }
                //add markers
                markerList.push(
                    {
                        position: {
                            lat: Number(this.companies[a].Lat),
                            lng: Number(this.companies[a].Long)
                        },
                        info: this.companies[a]
                    },
                )
            }
        }
        if (markerList.length > 0) {
            this.allMarkers = markerList;
            this.filteredMarkers = [...markerList];
        }
    }

    convertCompaniesTSVintoJSON() {
        //get the tsv data into an array
        let companiesRaw: Array<any> = this.companiesTsv.split('\n');
        for (var i = 0; i < companiesRaw.length; i++) {
            companiesRaw[i] = companiesRaw[i].split('\t');
        }

        //create objects from the array
        let headingsRaw: Array<string> = companiesRaw.splice(0, 1);
        let headings = [];

        //sanitize headings
        for (var c = 0; c < headingsRaw[0].length; c++) {
            headings.push(headingsRaw[0][c].replace(/\s/g, ''));
        }

        //build json
        for (var a = 0; a < companiesRaw.length; a++) {
            let company = {};
            for (var b = 0; b < headings.length; b++) {
                company[headings[b]] = companiesRaw[a][b];
            }
            this.companies.push(company);
        }
    }

}
