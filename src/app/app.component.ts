import { AfterViewInit, Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { GoogleMap, MapInfoWindow, MapMarker } from "@angular/google-maps";

// import companies from '../assets/companies.tsv';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
    @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
    @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow;
    // @Input() menuEvent: Event;

    showMenu = false;
    mapHeight = 500;

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
    }
    markers: any = [];
    companies: any = [];

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.mapHeight = window.innerHeight - 34;
        // this.scrWidth = window.innerWidth;
        // console.log(this.scrHeight, this.scrWidth);
    }

    constructor(private httpClient: HttpClient) {
        this.getScreenSize();
    }

    ngOnInit() {

        this.getCompaniesTsv();
    }

    toggleMenu(event) {
        this.showMenu = !this.showMenu;
    }

    getCompaniesTsv() {
        this.httpClient.request('GET', 'Companies.tsv', { responseType: 'text' }).subscribe(
            (response) => {
                this.companiesTsv = response;
                this.convertCompaniesTSVintoJSON();
                this.createMarkers();
            },
            (error) => {
                console.error('companies error: ' + error.error);
            }
        );
    }

    infoContent = 'test!';

    // openInfo(element, event, marker) {
    openInfo(marker, content) {
        // debugger;
        this.infoContent = content;
        this.info.open(marker);
        // this.infoWindow.open(marker);
        // this.infoWindow.open(marker.anchor);
        // this.infoWindow.open(marker);
    }

    createMarkers() {
        // debugger;
        let markerList = [];
        for (var a = 0; a < this.companies.length; a++) {
            if (this.companies[a].Lat != '' && this.companies[a].Long != '') {
                // console.log('______________________________________[' + a + ']');
                // console.log(this.companies[a].Company);
                // console.log(Number(this.companies[a].Lat));
                // console.log(Number(this.companies[a].Long));
                markerList.push(
                    {
                        position: {
                            lat: Number(this.companies[a].Lat),
                            lng: Number(this.companies[a].Long)
                        },
                        title: this.companies[a].Company,
                        info: this.companies[a]
                    },
                )
            }
        }
        if (markerList.length > 0) {
            this.markers = markerList;
        }
    }

    convertCompaniesTSVintoJSON() {
        //get the tsv data into an array
        let companiesRaw: Array<any> = this.companiesTsv.split('\n');
        for (var i = 0; i < companiesRaw.length; i++) {
            let y = companiesRaw[i].split('\t');
            companiesRaw[i] = y;
        }

        //create objects from the array
        let headingsRaw: Array<string> = companiesRaw.splice(0, 1);
        let headings = [];

        //sanitize headings
        for (var c = 0; c < headingsRaw[0].length; c++) {
            // let test = headings[0][c];
            headings.push(headingsRaw[0][c].split(' ')[0]);
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

    ngAfterViewInit() {
        // this.markers.push(
        //     {
        //         position: {
        //             lat: 34.2005678,
        //             lng: -119.13652
        //         },
        //         label: {
        //             color: 'black',
        //             text: 'HAAS Automation',
        //         },
        //         title: 'HAAS Automation',
        //     },
        //     {
        //         position: {
        //             lat: 34.1892288,
        //             lng: -118.9231888
        //         },
        //         label: {
        //             color: 'black',
        //             text: 'Amgen Inc',
        //         },
        //         title: 'Amgen Inc',
        //         options: {
        //             anchorPoint: {
        //                 x: 10,
        //                 y: 10
        //             }
        //         }
        //     },
        // );
    }

    companiesTsv = 'Company Name\tWebsite\tMode\tSize\tWhat is local?\tMaker connection\tAddress\tCity\tLat\tLong\tNotes\tWikipedia Page\tTwitter\tFacebook\tYouTube\tInstagram\tFlikr\tLinkedIn\tTikTok\tPhone\n' +
        'Interconnect Systems (Molex)\thttps://www.isipkg.com/\tOffice\t\tHQ\telectronics\t\tCamarillo\t\t\tMakes digitizer boards\thttps://en.wikipedia.org/wiki/Molex\thttps://twitter.com/isipkg\t-\thttps://www.youtube.com/channel/UCj7-oRypXfbZGtjPvUdsG5A\t-\t-\thttps://www.linkedin.com/company/interconnect-systems-inc.\t-\t(805) 482-2870\n' +
        'ATM Part Mart\thttps://atmpartmart.com/\tRetail\t\tHQ\telectronics, CNC\t733 Lakefield Rd Suite AA Westlake Village, CA 91361\tWeslake Village\t34.1576179\t-118.8307406\tHas CNC, might be willing to let others use it\t-\thttps://www.twitter.com/ATMPartMart\thttps://www.facebook.com/ATMPartMart\t\t-\t-\thttps://www.linkedin.com/company/atmpartmart.com\t\t(866) 417-2286  (805) 381-0806\n' +
        'Rollocam\thttps://rollocam.com/\tOnline\t\tEmployee?\telectronics\t\tCV?\t\t\t\t-\thttps://twitter.com/Rollocam_\thttps://www.facebook.com/Rollocam/\thttps://www.youtube.com/channel/UCpA75FwCXSINUBWGKQXvpjA\thttps://www.instagram.com/rollocam/\t-\t-\t-\t-\n' +
        'Planet Zuda\thttp://planetzuda.com/\tConsulting\ttiny\tHQ\tcybersecurity\t\tCamarillo\t\t\t\t-\thttps://twitter.com/planetzuda\thttps://www.facebook.com/planetzuda\t-\t-\t-\t-\t-\t-\n' +
        'Direct Suggest\thttps://www.DirectSuggest.com\t?\t\tHQ\tStartup\t\t\t\t\t\t-\thttps://twitter.com/DirectSuggest\t-\thttps://www.youtube.com/channel/UCI4UaVbfKpCadfKdizA9d8g\thttps://www.instagram.com/directsuggest/\t-\thttps://www.linkedin.com/company/directsuggest\t-\t-\n' +
        'Minimus\thttps://minimus.biz\tOffice, Warehouse\tMedium\tHQ\tStartup, shipping, logistics\t\tThousand Oaks, Camarillo\t\t\tShips 250k products from TO warehouse. Creates many influencer products.\t-\thttps://twitter.com/minimusbiz\thttps://www.facebook.com/Minimus.biz\thttps://www.youtube.com/channel/UCel9EYLAfxDmY-2EIsngQSw\thttps://www.instagram.com/minimusbiz/\t-\thttps://www.linkedin.com/company/minimus.biz\t-\t805-480-1415\n' +
        'Art Studio Live\tartstudiolive.com\tOnline?\t\tHQ\tArts & Crafts\t\t\t\t\t\t-\t-\thttps://www.facebook.com/artstudiolivegallery/\t\thttps://www.instagram.com/artstudiolive/\t-\thttps://www.linkedin.com/company/art-studio-live\t-\t-\n' +
        'Matter Labs\thttps://www.matterlabs.co/\tConsulting\t\tHQ\tCommunity leaders\t\tCamarillo\t\t\tConnectors, involved in lots of cool projects\t-\thttps://twitter.com/matterlabsinc\thttps://www.facebook.com/MatterLabs/\t\t-\t-\thttps://www.linkedin.com/company/matter-labs\t-\t-\n' +
        'Laritech, Inc\thttps://www.laritech.com/\tOffice, Consulting\t\tHQ\tPCB\t\t\t\t\t\t-\t-\thttps://www.facebook.com/Laritech.Inc\t\t-\t-\thttps://www.linkedin.com/company/laritech-inc\t-\t805-529-5000  \n' +
        'Alcove Electronic Services\thttp://www.alcoveelectronics.com/\tOffice?, Consulting?\t\tHQ\tElectronics\t31316 Via Colinas #114, Westlake Village, CA 91362\tWestlake Village\t34.15640662\t-118.8063555\t\t-\t-\thttps://m.facebook.com/alcove.EMS/?_rdr\t\t-\t-\t-\t-\t(818) 707-9093\n' +
        'Taurus Products Inc\thttp://www.taurusproducts.com/\tConsulting?\t\tHQ\tElectronics\t67 W. Easy Street # 118, Simi Valley CA, 93065\tSimi Valley\t34.27960882\t-118.8018497\t\t-\t-\t-\t-\t-\t-\t-\t-\t805 584-1555\n' +
        'Code Ninjas\t??\tClasses\t\tHQ\tProgramming\t1772 Avenida de los Arboles.\tThousand Oaks\t34.21001\t-118.845618\t\thttps://en.wikipedia.org/wiki/Code_Ninjas\thttps://twitter.com/codeninjas\thttps://www.facebook.com/CodeNinjas/\t\thttps://www.instagram.com/codeninjas/\t-\thttps://www.linkedin.com/company/codeninjas\t-\t805-492-2633\n' +
        'Electronics Expediters\thttp://www.expediters.com/\tRetail\t\tHQ\tElectonics parts store\t3700 Via Pescador, Camarillo, CA 93012-5049\tCamarillo\t34.22375696\t-119.021136\t\t-\thttps://twitter.com/expediteelectro\t\t-\thttps://www.instagram.com/electronicexpediters/?hl=en\t-\thttps://www.linkedin.com/company/electronic-expediters-inc-\t-\t(805) 987-7171\n' +
        'EaZyHold\thttps://eazyhold.com/\tOnline\t\tHQ\tutility gadget\t<online>\tConejo Valley\t\t\t\t-\thttps://twitter.com/eazyhold\thttps://www.facebook.com/eazyhold/\thttps://www.youtube.com/channel/UCfvHPLdTh5WvBWW_dXHLs0Q\thttps://www.instagram.com/eazyhold/\t\t-\t-\t-\n' +
        'Microduino\thttps://www.microduinoinc.com/\tOnline. Medium.\tMedium\tHQ\tSTEM electronics for kids\t143 Triunfo Canyon Rd, Thousand OaksCA91361\tThousand Oaks\t34.1602842\t-118.8354181\t\t-\thttp://twitter.com/microduino\thttp://facebook.com/microduino\thttps://www.youtube.com/c/MicroduinoStudio\thttp://instagram.com/microduino\t-\thttp://linkedin.com/in/bin-feng-8118454\t-\t818-900-0804\n' +
        'Aptiv\thttps://www.aptiv.com/\tOffice\tBig\tBranch Office\tStuff?\t5137 Clareton Dr #220v, Agoura Hills, CA 91301\tAgoura Hills\t34.146868\t-118.754245\t\thttps://en.wikipedia.org/wiki/Aptiv\thttps://twitter.com/aptiv\thttps://facebook.com/aptiv\thttps://www.youtube.com/aptiv\thttps://instagram.com/aptiv\t\thttps://linkedin.com/company/aptiv\t\t-\n' +
        'Mitov Software\thttp://www.mitov.com/\tOnline\t\tHQ\tElectronics SW Platform\t11326 Rosecreek Dr., Moorpark, CA 93021\tMoorpark\t34.26726408\t-118.9066621\tNo-code / Low-code Arduino platform\tSite won\'t open.\t\t\t\t\t\t\t\t\n' +
        'Arcox Engineering\thttp://arcox.com/\tConsulting\t\tHQ\tElectronics\t1336 N. Moorpark Rd. PMB 236, Thousand Oaks, CA 91360\tThousand Oaks\t34.19446513\t-118.8794018\tDoes PIC stuff\t-\t-\t-\t-\t-\t-\thttps://www.linkedin.com/company/arcox-engineering\t-\t(805) 490-6507\n' +
        'Invia Robotics\thttps://www.inviarobotics.com/\tOffice.\tMedium\tHQ\tRobots\t5701 Lindero Canyon Rd #3-100, Westlake Village, CA 91362\tWestlake Village\t34.145552\t-118.80764\tWarehouse robotics, etc.\t-\thttps://twitter.com/inviarobotics\t\thttps://www.youtube.com/c/inViaRobotics/featured\t-\t-\thttps://www.linkedin.com/company/invia-robotics\t\t855-424-6842\n' +
        'RMIS\thttps://rmis.com/\tOffice. Online?\t\tHQ\tStartup\t5388 Sterling Center Drive, Westlake Village, California 91361\tWestlake Village\t34.14660923\t-118.8038308\tRay works there??\tSite won\'t open.\t\t\t\t\t\t\t\t\n' +
        'Ventura Biocenter\thttps://venturabiocenter.com/\tOffice\t\tHQ\tStartup, Bio\t1176 Tourmaline Drive, Thousand Oaks CA 91320\tThousand Oaks\t34.19388424\t-118.9313703\t\t-\thttps://twitter.com/vbiocenter\t-\t-\t-\t-\thttps://www.linkedin.com/company/ventura-biocenter\t-\t805-480-9900\n' +
        'Huan\thttps://www.gethuan.com/\tOnline\t\tHQ\tStartup (pet tags)\t<online>\tAgoura Hills\t\t\tAir tag holder for dog collars (was BLE beacons, app)\t-\thttps://twitter.com/gethuan/\t-\thttps://www.youtube.com/channel/UCc6GvJ1PVik4hAatSw8w88Q\thttps://www.instagram.com/gethuan/\t\thttps://www.linkedin.com/company/huan\t\t-\n' +
        'Quill Technologies\thttps://quill.codes/\tConsulting\t\tHQ\tProgramming\t\tVentura?\t\t\t\t-\thttps://twitter.com/QuillCodes\t\t-\t-\t-\thttps://www.linkedin.com/in/caseymcquillan/\t\t\n' +
        'Chaparral Software\thttp://www.chapsoft.com/index.html\tConsulting\t\tHQ\tProgramming, Filemaker\t5737 Kanan Road, Suite 589, Agoura Hills, CA 91301\tAgoura Hills\t34.15442645\t-118.7566644\tRussel  Kohn. russ@chapsoft.com. 818.324.8542\t-\t-\t-\t-\t-\t-\t-\t-\t(877) 203-3109\n' +
        'High Tech Corp\thttps://htemfg.com/\tOffice\t\tHQ\tMachining\t4610 Calle Quetzal, Camarillo, CA 93012\tCamarillo\t34.1968436\t-119.0108615\t\t-\t-\t-\t-\t-\t-\t-\t-\t805-987-5449\n' +
        'Coastline Optics\thttp://www.coastlineoptics.com/\tOffice\t\tHQ\t\t906 Via Alondra, Camarillo, CA 93012\tCamarillo\t34.22646517\t-119.0224182\tOptics. Polish Metals, Measure lenses\t-\t-\t-\t-\t-\t-\thttps://www.linkedin.com/company/coastline-optics-llc\t-\t805-384-0609\n' +
        'Lundberg Survey\thttps://www.lundbergsurvey.com/\toffice?\t\tHQ\tResearch\t\tCamarillo\t\t\tPublish the Lundberg Gas price survey\t-\t-\thttps://m.facebook.com/profile.php?id=2103861336499839\t\t\t-\thttps://www.linkedin.com/company/lundberg-survey-inc\t-\t805-383-2400\n' +
        'Big Shot Digital\thttp://bigshotsdigital.com/\tRetail\t\tHQ\tPrinting\t3201 Corte Malpaso, Unit 302, Camarillo, CA 93012\tCamarillo\t34.227754\t-119.000133\tPrinting\t-\t-\thttps://m.facebook.com/profile.php?id=166806529998924\t-\t-\t-\t-\t-\t805-484-9111\n' +
        'Axion Communications\thttps://www.axioncommunications.com/\tOffice?\t\tHQ\tPhones\t2060-D E Avenida De Los Arboles, #350, Thousand Oaks, CA 91362\tThousand Oaks\t34.21119183\t-118.8418267\tVOIP\t-\thttps://twitter.com/axionco\thttps://www.facebook.com/Axiontelecom/\thttps://www.youtube.com/user/TheHIVEBiz\t-\thttps://www.flickr.com/photos/48045487@N08/\thttps://www.linkedin.com/company/axion-communications\t\t(805) 642-1414\n' +
        'Pulse Insturments\thttp://www.pulseinstruments.net/\tOffice? Online.\t\tHQ\tElectroinics\t3233 Mission Oaks Blvd, Unit P, Camarillo, CA, 93012\tCamarillo\t34.218941\t-119.026703\tElectronics Parts, Sensors for water treatment, etc\t-\t-\t-\t-\t-\t-\t-\t-\t1(800) 462-1926\n' +
        'Zanders Game House\thttps://www.zandersgamehouse.com/\tRetail\t\tHQ\tGames\t2270 Ventura Blvd, Camarillo, CA\tCamarillo\t34.2157616\t-119.0698541\tGame nites\t-\t-\thttps://www.facebook.com/Zandersgamehouse/\t-\thttps://www.instagram.com/zandersgamehouse/\t-\t-\t-\t(805) 383-9983\n' +
        'Arsenal Comics and games\thttps://arsenalcomicsandgames.com\tRetail\t\tHQ\tGames\t1610-1 Newbury Rd, Newbury Park, CA\tNewbury Park\t34.183671\t-118.91183\tComics\t-\thttps://twitter.com/arsenal_comics\thttps://www.facebook.com/arsenalcomicsandgames\thttps://www.youtube.com/channel/UC5sYeZrwSBHrrZ28_MQ1Gxw\thttps://www.instagram.com/arsenalcomicsandgames/\t-\thttps://www.linkedin.com/company/arsenal-comics-&-games?trk=public_profile_topcard-current-company\t-\t805-620-0543\n' +
        'A Hidden Fortress\thttps://www.ahiddenfortress.com/\tRetail\t\tHQ\tGames\t1960 Sequoia Avenue, Unit #10, Simi Valley, CA 93063\tSimi Valley\t34.2714266\t-118.7313708\tCard Games\t-\thttps://twitter.com/ahiddenfortress\t\t-\t-\t-\t-\t-\t805-526-6457\n' +
        'The Game Ogre\thttp://www.thegameogre.com/\tRetail\t\tHQ\tGames, Meetings?\t1145 Lindero Canyon Rd., Unit D4, Westlake Village, CA 91362\tWestlake Village\t34.1850477\t-118.7882413\tGames\t-\thttps://twitter.com/gameogre\thttps://www.facebook.com/TheGameOgre/\t-\thttps://www.instagram.com/thegameogre/\t-\t-\t-\t818-852-7270\n' +
        'Hagoenergetics\thttps://hagoenergetics.com/\tOffice?\t\tHQ\tResearch?\t412 Calle San Pablo Suite 103, Camarillio,CA. 93012\tCamarillo\t34.2057745\t-119.0390043\tBenefit Corporation? Env Research ?\t-\thttps://twitter.com/hagoco2?lang=hr\t\thttps://www.youtube.com/channel/UClsO5tjX_MDjgvg5nXFFhqw/featured\thttps://www.instagram.com/hagoenergetics/\t-\thttps://www.linkedin.com/in/wilson-hago-a168366\t-\t(805) 400-4196\n' +
        'Applied Wireless\thttp://www.appliedwireless.com/\tConsulting?\t\tHQ\tConsulting wireless\t1250 Avenida Acaso, Camarillo, CA 93012\tCamarillo\t34.22922078\t-119.011037\tdesigning and manufacturing wireless products for unlicensed use for the past decade.\t-\t-\t-\t-\t-\t-\thttps://www.linkedin.com/company/applied-wireless-inc.\t-\t(805) 383-9600\n' +
        'The Makery\thttps://themakerywa.com/\tRetail\t\tHQ\tKids Crafts\t1111 Rancho Conejo Blvd. #304, Thousand Oaks, CA 91320\t\t34.194029\t-118.923727\t\t-\t-\thttps://www.facebook.com/shopthemakery/\t-\thttps://www.instagram.com/themakerydiy/?hl=hr\t-\t-\t-\t805-376-0230\n' +
        'Art Trek\thttps://www.arttrek.org/\tRetail\t\t\tKids Crafts\t703 Rancho Conejo Blvd, Newbury Park, CA 91320  \t\t34.1887604\t-118.9243108\t\t-\thttps://twitter.com/arttrekinc\thttps://www.facebook.com/arttrekinc\thttp://www.youtube.com/arttrekinc\thttps://www.instagram.com/arttrekinc\thttps://www.flickr.com/photos/arttrekinc/\thttps://www.linkedin.com/company/art-trek-inc-\t-\t(805) 499-1700\n' +
        'Ukaton\thttps://www.linkedin.com/company/ukaton/about/\tOffice\tstartup\tHQ\telectronics, footwear?\t\tCamarillo, Ca\t\t\tSmartShoe Insoles\t-\thttps://twitter.com/concretescifi\thttps://www.facebook.com/concretescifi/\thttps://www.youtube.com/channel/UCL-Ko-jT7ORIfxBuPw_vkJQ\thttps://www.instagram.com/concretescifi/channel/\t-\thttps://www.linkedin.com/company/ukaton\t-\t(805) 312-4900\n' +
        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n' +
        'Alcatel-Lucent Enterprise\thttp://www.al-enterprise.com/\tOffice\tBig, Branch\t\t\t26801 Agoura Rd, Calabasas, CA 91301, United States\tCalabasas\t34.13935675\t-118.7104745\t\thttps://en.wikipedia.org/wiki/Alcatel-Lucent\thttps://twitter.com/ALUEnterprise\thttps://www.facebook.com/ALUEnterprise\thttps://www.youtube.com/user/EnterpriseALU\thttps://www.instagram.com/alcatel_lucent_enterprise/?hl=en\thttps://www.flickr.com/photos/alcatel-lucent/\thttps://www.linkedin.com/company/alcatellucententerprise\t-\t18188784500\n' +
        'Hixme\t?? website broken ??\toffice?\tMedium\tBranch office\tInsurance?\t27489 Agoura Rd #100, Agoura Hills, CA\tAgoura Hills\t34.1370429\t-118.7256728\t$23M funding\t-\thttps://twitter.com/joinhixme\thttps://www.facebook.com/joinhixme/\t\thttps://www.instagram.com/joinhixme/?hl=hr\t-\thttps://www.linkedin.com/company/hixme\t-\t855-449-6348\n' +
        'Micheals Craft Store\t\tRetail\tBig, Branch\tBranch store\tcrafts\t\t\t\t\t\thttps://en.wikipedia.org/wiki/Michaels\thttps://twitter.com/michaelsstores\thttps://www.facebook.com/Michaels\thttps://www.youtube.com/subscription_center?add_user=MichaelsStores\thttps://instagram.com/michaelsstores#\t-\thttps://www.linkedin.com/company/michaels-stores-inc.\thttps://www.tiktok.com/@michaelscraftstore?lang=en\t-\n' +
        'Amazon (warehouse)\t\t\tBig, Branch\tBranch office\tLocal\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n' +
        'HRL (Research arm of Boeing)\thttps://www.hrl.com/\toffice. Big.\tBig, Branch\tBranch office\tResearch\t\tMalibu\t\t\t\thttps://en.wikipedia.org/wiki/HRL_Laboratories\thttps://twitter.com/hrllaboratories\thttps://www.facebook.com/hrllabs\thttps://www.youtube.com/user/HRLLaboratories\thttps://www.instagram.com/hrllaboratories/?hl=hr\t\thttps://www.linkedin.com/company/hrl-laboratories\t-\t(310) 317-5000\n' +
        'SkyWorks\thttps://www.skyworksinc.com/\toffice. Big.\tBig, Branch\tBranch office\t?\tBorchard + Wendy\tNewbury Park\t\t\tHQ Irving, CA. $1B/quarter\thttps://en.wikipedia.org/wiki/Skyworks_Solutions\thttps://twitter.com/skyworksinc\thttps://www.facebook.com/skyworksinc/\thttps://www.youtube.com/channel/UCVT7P0K4jQyDE15ANfd_-RA\t-\t\thttps://www.linkedin.com/company/skyworks-solutions-inc/\t\t-\n' +
        'Batteries + (?)\t\tRetail\tBig\tBranch store\t\t\t\t\t\t\thttps://en.wikipedia.org/wiki/Batteries_Plus_Bulbsbs\thttp://twitter.com/batteriesplus\thttp://www.facebook.com/BatteriesPlus\thttp://www.youtube.com/batteriesplus\thttps://www.instagram.com/batteriesplus/\t-\thttps://www.linkedin.com/company/batteries-plus\t-\t800-677-8278\n' +
        'Wild Birds Unlimited\t\tRetail\tBig\tBranch store\t\t\t\t\t\t\thttps://en.wikipedia.org/wiki/Wild_Birds_Unlimited\thttps://twitter.com/wbu_inc\thttps://www.facebook.com/wildbirdsunlimited/\thttps://www.youtube.com/user/WildBirdsUnlimited\thttps://www.instagram.com/wildbirdsunlimited/?hl=hr\thttps://www.flickr.com/photos/wildbirdsunlimited/\thttps://www.linkedin.com/company/wild-birds-unlimited-inc.\t\t(317) 571-7100\n' +
        'Haas\thttps://www.haascnc.com/\tRetail\tBig\tHQ\tCNC\t\tTorrance, CA\t\t\t\t\t\t\t\t\t\t\t\t\n' +
        'Haas\thttps://www.haascnc.com/\tFactory\tBig\tHQ\tCNC\t2800 Sturgis Rd, Oxnard, CA 93030\tOxnard, CA\t34.20069625\t-119.13659\t\thttps://en.wikipedia.org/wiki/Haas_Automation\thttp://twitter.com/Haas_Automation\thttp://www.facebook.com/pages/Oxnard-CA/Haas-Automation-Inc/177787316584\thttp://www.youtube.com/user/haasautomation\thttp://instagram.com/haas_automation\thttp://www.flickr.com/photos/haasautomation\thttps://www.linkedin.com/company/haas-automation\thttps://www.tiktok.com/@haas_automation\t\n' +
        'Harbor Freight\t\tRetail\tBig\t\t\t\t\t\t\t\thttps://en.wikipedia.org/wiki/Harbor_Freight_Tools\thttps://twitter.com/harborfreight\thttps://www.facebook.com/harborfreight/\thttps://www.youtube.com/harborfreight\thttps://www.instagram.com/harborfreight/?hl=hr\t\thttps://www.linkedin.com/company/harbor-freight-tools\t\t-\n' +
        'Joanne Fabrics\t\tRetail\tBig\t\t\t\t\t\t\t\thttps://en.wikipedia.org/wiki/Jo-Ann_Stores\thttps://twitter.com/JoAnn_Stores\thttps://www.facebook.com/JoAnn\thttps://www.youtube.com/user/Joanndotcom\thttps://www.instagram.com/joann_stores/\t\thttps://www.linkedin.com/company/jo-ann-stores-inc-\t-\t-\n' +
        'Amgen\thttps://www.amgen.com/\tOffice\tBig\tHQ\tLocal, hire STEM professionals\t\t\t\t\t\thttps://en.wikipedia.org/wiki/Amgen\thttp://www.twitter.com/amgen\thttps://www.facebook.com/amgenbiotech/\thttps://www.youtube.com/user/Amgen\thttps://www.instagram.com/amgenbiotech/\t\thttps://www.linkedin.com/company/amgen\thttps://www.tiktok.com/@amgenbiotech\t-\n' +
        'Atara Biotheraputics\t\t\tBig\tHQ\t\t\t\t\t\t\t-\thttps://twitter.com/Atarabio\t-\t-\t-\t-\thttps://www.linkedin.com/company/atarabio\t\t\n' +
        'On Assignment\t\t\tBig\tHQ\tSTEM: Science workers\t26651 W. Algonquin Road, Calabasas, California 91302 \tCalabasas\t34.1446643\t-118.644097\tProfessional tech assignment: Places scientific and tech workers in temporary jobs\tCould not event find the company??\t\t\t\t\t\t\t\t\n' +
        'Blackline\t\t\tBig\tHQ\t\t\t\t\t\t\thttps://en.wikipedia.org/wiki/Blackline_(software_company)\thttps://twitter.com/blackLine\thttps://www.facebook.com/blackline\thttps://www.youtube.com/channel/UCZ_JmAcNaCl57KX90KcbVgA\thttps://www.instagram.com/blackline/\t\thttps://www.linkedin.com/company/blackline\t-\t-\n' +
        'Cheesecake Factory\t\t\tBig\tHQ\tLocal\t26901 Malibu Hills Rd, Calabasas Hills, CA 91301, USA\tCalabasas Hills\t34.13706515\t-118.7075769\t\thttps://en.wikipedia.org/wiki/The_Cheesecake_Factory\thttps://www.twitter.com/cheesecake\thttps://www.facebook.com/thecheesecakefactory\thttps://www.youtube.com/thecheesecakefactory\thttp://www.instagram.com/cheesecakefactory\t\thttps://www.linkedin.com/company/the-cheesecake-factory\thttps://www.tiktok.com/@thecheesecakefactory\t-\n' +
        'Diodes, Inc\t\t\tBig\tHQ\tLocal tech\t\t\t\t\t\thttps://en.wikipedia.org/wiki/Diodes_Incorporated\thttps://twitter.com/diodesinc\thttps://www.facebook.com/DiodesInc\thttps://www.youtube.com/channel/UC56hxWwP0_TIbsWnHIn1nTw\t-\t-\thttps://www.linkedin.com/company/diodes-incorporated\t-\t-\n' +
        'Takeda Pharmaceuticals\thttps://www.takeda.com/\tOffice\tBig\tBranch office?\tLocal\t1700 Rancho Conejo Blvd, Thousand Oaks, CA 91320\tThousand Oaks\t34.1854417\t-118.9255714\t\thttps://en.wikipedia.org/wiki/Takeda_Pharmaceutical_Company\thttp://www.twitter.com/takedapharma\t-\thttps://www.youtube.com/takeda-pharmaceuticals/\t-\t-\thttps://www.linkedin.com/company/takeda-pharmaceuticals/\t-\t-\n' +
        'AeroVironment\thttps://www.avinc.com/\tOffice\tBig\tBranch Office?\tLocal tech\t14501 Princeton Ave, Moorpark, CA 93021\tMoorpark\t34.28763414\t-118.8624254\t\thttps://en.wikipedia.org/wiki/AeroVironment\thttps://twitter.com/aerovironment\thttps://www.facebook.com/aerovironmentinc\thttps://www.youtube.com/user/AeroVironmentInc\thttps://www.instagram.com/aerovironmentinc\t\thttps://www.linkedin.com/company/aerovironment\t-\t-\n' +
        'Guitar Center\t\t\tBig\tHQ\tLocal\t\t\t\t\t\thttps://en.wikipedia.org/wiki/Guitar_Center\thttps://twitter.com/guitarcenter\thttps://www.facebook.com/GuitarCenter\thttps://www.youtube.com/guitarcenter\thttps://instagram.com/guitarcenter#\thttps://www.flickr.com/people/guitarcenter/\thttps://www.linkedin.com/company/the-guitar-center-company\thttps://www.tiktok.com/@guitarcenter\t-\n' +
        'Trade Desk\t\t\tBig\tHQ\tLocal\t\t\t\t\t\thttps://en.wikipedia.org/wiki/The_Trade_Desk\thttps://www.twitter.com/TheTradeDesk\thttps://www.thetradedesk.com/assets/global/facebook-footer.svg\thttps://www.youtube.com/channel/UCepu1fEfXlB39NF13-yiqew\thttps://www.instagram.com/thetradedesk\t\thttps://www.thetradedesk.com/assets/global/linkedin-footer.svg\t-\t-\n' +
        'Patagonia\t\t\tBig\tHQ\tLocal\t\t\t\t\t\thttps://en.wikipedia.org/wiki/Patagonia,_Inc.\thttps://twitter.com/patagonia\thttps://hr-hr.facebook.com/PATAGONIA/\t-\thttps://www.instagram.com/patagonia/\t\thttps://www.linkedin.com/company/patagonia_2\thttps://www.tiktok.com/@patagonia\t1-800-638-6464\n' +
        'Teledyne Technologies\t\t\tBig\tHQ\tLocal tech\t\t\t\t\t\thttps://en.wikipedia.org/wiki/Teledyne_Technologies\thttps://twitter.com/teledynemarine ??\t-\t-\t-\t-\thttps://www.linkedin.com/company/teledyne-technologies-incorporated\t-\t(805) 373-4545\n' +
        'Benchmark (Arrow?)\thttps://www.bench.com/moorpark-california\tConsulting?\tBig\tBranch office\tElectronics\t200 Science Drive,  Moorpark, CA 93021\tMoorpark\t34.279682\t-118.869234\tFormerly Arrow??\t-\thttps://twitter.com/BenchElec\thttps://www.facebook.com/BenchBHE/\t-\t-\t-\thttps://www.linkedin.com/company/benchelec/\t-\t(623) 300-7000\n' +
        'Spirent\thttps://www.spirent.com/\tOffice\tBig\tBranch office\tNetwork testing\t27349 Agoura Rd, Calabasas, CA 91301\tCalabasas\t34.13811497\t-118.7200176\t\thttps://en.wikipedia.org/wiki/Spirent\thttps://twitter.com/Spirent\thttps://www.facebook.com/spirent\thttps://www.youtube.com/channel/UCyi1h4XXdj1AeUjeCDksYvg\thttps://www.instagram.com/spirent_/?hl=hr\t-\thttp://www.linkedin.com/company/spirent-communications\t-\t800-774-7368\n' +
        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n' +
        'Lukys Hardware\thttp://www.lukyshardware.com/\tRetail\tMedium\tremote\t\t\tBurbank\t\t\t\t-\t-\thttps://m.facebook.com/profile.php?id=140415952661134\t-\t-\t-\t-\t-\t(818) 845-8338\n' +
        'Apex Surplus\thttps://www.apexsurplus.com/\tRetail\tMedium\tremote\tProps\t\tSun Valley\t\t\tFasinating props\t-\t-\thttps://www.facebook.com/ApexSurplus/\t-\thttps://www.instagram.com/apexsurplus/\t-\thttps://www.linkedin.com/company/apex-surplus-corporation?trk=public_profile_topcard-current-company\t-\t(818) 767-7202\n' +
        'All Electronics\thttps://www.allelectronics.com/\tRetail\tMedium\tremote\t\t\tVan Nuys\t\t\tTons of surplus\t-\thttps://twitter.com/AllElectronicsC\thttps://www.facebook.com/allelectronics\t\thttps://www.instagram.com/allelectronicscorp/\t\thttps://www.linkedin.com/company/all-electronic\t-\t818-904-0524 (customer service)\n' +
        'Freedom Photonics\thttps://freedomphotonics.com/\tOffice\tBig\tremote\t\t\tSanta Barbra\t\t\t\t-\t-\t-\t-\t-\t-\thttps://www.linkedin.com/company/freedom-photonics\t-\t805-967-4900\n' +
        'SparkFun\thttps://sparkfun.com/\tOnline\tBig\tremote\tElectronics, sensors\t\tEverything for making electronics\t\t\t\thttps://en.wikipedia.org/wiki/SparkFun_Electronics\thttps://twitter.com/sparkfun\thttps://www.facebook.com/SparkFun\thttps://www.youtube.com/sparkfun\thttps://www.instagram.com/sparkfun/\thttps://www.flickr.com/photos/sparkfun/\thttps://www.linkedin.com/company/sparkfun-electronics\thttps://www.tiktok.com/@sparkfun.electronics?lang=en\t-\n' +
        'AdaFruit\thttps://adafruit.com/\tOnline\tBig\tremote\tElectronics, sensors\t\tEverything for making electronics\t\t\t\thttps://en.wikipedia.org/wiki/Adafruit_Industries\thttps://twitter.com/adafruit/\thttps://www.facebook.com/adafruitindustries\thttps://www.youtube.com/adafruit\thttps://www.instagram.com/adafruit/\thttps://www.flickr.com/photos/adafruit/\thttps://www.linkedin.com/company/adafruit\thttps://www.tiktok.com/@adafruit\t-\n' +
        'Yoctapuse\thttps://yoctapuse.com \tOnline\tMedium\tremote\tElectronic gadgets / USB Dongles\t\t\t\t\tlike phidgets\t-\thttps://twitter.com/yoctopuce\t-\thttps://www.youtube.com/c/Yoctopuce/featured\t-\t-\t-\t-\t41 22 756 59 14\n' +
        'Osh Park\thttps://oshpark.com/\tOnline\tMedium\tremote\tMake PCB Boards\t\t\t\t\tBoard\t-\thttps://twitter.com/oshpark\thttps://www.facebook.com/oshpark/\t-\thttps://www.instagram.com/oshpark/\thttps://www.flickr.com/photos/144141882@N07/\t-\t-\t503-616-248\n' +
        'Maker Gear\thttps://makergear.com/\tOnline\tMedium\tremote\t3D printers\t\t\t\t\t\t-\thttps://twitter.com/makergear?lang=en\thttps://www.facebook.com/Makergear/\thttps://www.youtube.com/c/MakerGear\thttps://www.instagram.com/makergear/?hl=hr\t\thttps://www.linkedin.com/company/makergear-llc\thttps://www.tiktok.com/@makergear\t216- 765-0030\n' +
        'Nordic Semi\thttps://www.nordicsemi.com/\tOnline\tBig\tremote\tElectronic parts\t\t\t\t\t\thttps://en.wikipedia.org/wiki/Nordic_Semiconductor\thttps://twitter.com/NordicTweets\thttps://www.facebook.com/nordicsemiconductor/\thttps://www.youtube.com/user/NordicSemi\thttps://www.instagram.com/nordicsemi/\t-\thttps://www.linkedin.com/company/nordic-semiconductor\thttps://www.tiktok.com/@nordic_semiconductor?traffic_type=others&referer_url=amp_nordicsemi&referer_video_id=7125744508834204934\t-\n' +
        'Arrow Electronics Inc﻿\thttps://arrow.com\tOnline\tBig\tremote\t\t\t\t\t\t\thttps://en.wikipedia.org/wiki/Arrow_Electronics\thttps://twitter.com/Arrow_dot_com\thttps://www.facebook.com/ArrowDotCom\thttps://www.youtube.com/channel/UCPyQ-SpXmUVEyEzC_4s4pQA\thttps://www.instagram.com/arrowelectronics/?hl=hr\t-\thttps://www.linkedin.com/company/arrow-electronics\t-\t18553264757\n' +
        '11 Health\thttps://eleven.health/\tOnline. Medium.\tMedium\tremote\tHealth\t\tIrvine\t\t\tWent Bros / Matter Labs involved\t-\t-\thttps://www.facebook.com/11health/\thttps://www.youtube.com/c/11HealthandTechnologies\t-\t-\thttps://www.linkedin.com/company/11-health-&-technologies-limited\t-\t\n' +
        'Sabrewing Aircraift Company\thttps://www.sabrewingaircraft.com/\tAircraft?\t\tremote\tAirplanes\t1000 Town Center Drive, Ste 300, Oxnard, CA 93036\tOxnard\t34.2430217\t-119.181846\tStarted in Camarillio Airport, moved\t-\thttps://twitter.com/sabrewingair\thttps://www.facebook.com/SabrewingAircraftCompany/\thttps://www.youtube.com/c/SabrewingAircraft/featured\t-\t-\thttps://www.linkedin.com/company/sabrewing-aircraft-company/\t\t805-996-0601\n' +
        'Cambium Networks acquired Xirrus\t\t\t\t\t\t\t\t\t\t\thttps://en.wikipedia.org/wiki/Cambium_Networks\thttps://twitter.com/CambiumNetworks\thttps://www.facebook.com/CambiumNetworks/\thttps://www.youtube.com/user/CambiumNetworksLtd\thttps://www.instagram.com/cambiumnetworks/\t-\thttps://www.linkedin.com/company/cambium-networks\thttps://www.tiktok.com/@cambiumnetworks\t1-888-863-5250\n' +
        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n' +
        'Crash Space\thttps://blog.crashspace.org/\tMakerspace\t\tHQ\tMakerspace\t10526 Venice Blvd, Culver City, CA\tCulver City\t34.0193445\t-118.405315\t\t-\thttps://twitter.com/crashspacela\thttps://www.facebook.com/groups/149637545078593/about/\thttps://www.youtube.com/channel/UCLc4X_ZDE26ZmY9ZcBCVX-w\thttps://www.instagram.com/crashspacela/?hl=hr\thttps://www.flickr.com/groups/crashspace/\thttps://pr.linkedin.com/company/crash-space ??\t-\t424-241-3379\n' +
        'Null Space Labs\thttps://www.nsl.ninja/\tMakerspace\t\tHQ\tMakerspace\t2522 N Ontario St, Ontario, CA\tBurbank\t34.065846\t-117.6484304\t\t-\thttps://twitter.com/nullspacelabs\thttps://www.facebook.com/nullspacelabs/\t\t??\thttps://www.flickr.com/photos/nullspacelabs/\t??\t-\t234-312-4521\n' +
        'Hex Lab\thttps://www.hexlabmakerspace.com/\tMakerspace\t\tHQ\tMakerspace\t16556 Arminta Street, Van Nys, CA\tVan Nuys\t34.214715\t-118.494281\t\t-\thttps://twitter.com/hexlabmake\t-\thttps://www.youtube.com/c/hexlabmakerspacelosangeles?app=desktop\thttps://www.instagram.com/hexlabla/\t-\t??\t-\t(818) 530-7900\n' +
        'Daetec\thttps://www.daetec.com/\tOffice\t\tHQ\tChemicals\t4069 Calle Tesoro,, Camarillo, CA 93012\tCamarillo\t34.23081021\t-119.0134593\t\t-\thttp://www.twitter.com/wix\thttp://www.facebook.com/wix\t-\t-\t-\thttps://www.linkedin.com/company/daetec-llc\t-\t(805) 484-5546\n' +
        'Dole\t\t\t\tHQ\t\t\tWestlake\t\t\t\t\t\t\t\t\t\t\t\t'

}
