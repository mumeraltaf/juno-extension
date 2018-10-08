/// <reference path="../typings/leaflet.vectorgrid.d.ts"/>

import {
    Widget
} from '@phosphor/widgets';

import {
    ICommandPalette
} from '@jupyterlab/apputils';

import {
    JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';

import '../style/leaflet.css'

declare var L: any;

import 'leaflet';
import 'leaflet.vectorgrid';

declare var require: any;


/**
 * Initialization data for the juno extension.
 */
const extension: JupyterLabPlugin<void> = {
    id: 'juno',
    autoStart: true,
    requires: [ICommandPalette],
    activate: (app: JupyterLab, palette: ICommandPalette) => {
        // Create a single widget
        let widget: Widget = new Widget();
        widget.id = 'juno-jupyterlab';
        widget.title.label = 'Choropleth';
        widget.title.closable = true;
        widget.addClass('jp-junoWidget'); // new line


        let mapDiv = document.createElement('div');
        mapDiv.setAttribute("id", "map");
        mapDiv.className = 'map';
        widget.node.appendChild(mapDiv);


        // Add an application command
        const command: string = 'juno:open';
        app.commands.addCommand(command, {
            label: 'Display a Choropleth',
            execute: () => {
                if (!widget.isAttached) {
                    // Attach the widget to the main work area if it's not there
                    app.shell.addToMainArea(widget);
                }
                // Activate the widget
                app.shell.activateById(widget.id);

                let mymap = L.map('map', {
                    center: [ 25.2744, 133.7751],
                    zoom: 6
                });

                L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 18,
                    id: 'mapbox.streets',
                    accessToken: 'pk.eyJ1IjoidW1lcmFsdGFmIiwiYSI6ImNqbGJtaWhueTEyN2Izd28wMjkyYXNmYnQifQ.9b8Evpk6ihtBY7jJeHUqEw'
                }).addTo(mymap);


                let markerImage = require('../style/images/marker-icon.png');
                let markerShadow = require('../style/images/marker-shadow.png');

                var greenIcon = L.icon({
                    iconUrl: markerImage,
                    shadowUrl: markerShadow,
                    iconSize: [25, 41],
                    iconAnchor: [12, 41]
                });
                L.marker([ 25.2744, 133.7751], {icon: greenIcon}).addTo(mymap);


                L.vectorGrid.protobuf(
                    'http://openapi-dev.aurin.org.au/public/gwc/service/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&LAYER=aurin:SA1_2016_AUST&STYLE=&TILEMATRIX=EPSG:900913:{z}&TILEMATRIXSET=EPSG:900913&FORMAT=application/x-protobuf;type=mapbox-vector&TILECOL={x}&TILEROW={y}'
                ).addTo(mymap);


                setTimeout(function () {
                    mymap.invalidateSize()
                }, 100);

            }
        });


        // Add the command to the palette.
        palette.addItem({command, category: 'JUNO'});


    }
};

export default extension;
