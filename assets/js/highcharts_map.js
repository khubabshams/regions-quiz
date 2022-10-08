/**
 * Render the highcharts map for a given region code
 * @param {string} code - country code
 * credit: https://www.highcharts.com/blog/code-examples/planet-earth/ By Mustapha Mekhatria
 */
 export function renderMap(code) {
    const data = [{
        'code': code,
        'value': 0
    }];

    const getGraticule = () => {
        const data = [];

        // Meridians
        for (let x = -180; x <= 180; x += 15) {
            data.push({
                geometry: {
                    type: 'LineString',
                    coordinates: x % 90 === 0 ? [
                        [x, -90],
                        [x, 0],
                        [x, 90]
                    ] : [
                        [x, -80],
                        [x, 80]
                    ]
                }
            });
        }

        // Latitudes
        for (let y = -90; y <= 90; y += 10) {
            const coordinates = [];
            for (let x = -180; x <= 180; x += 5) {
                coordinates.push([x, y]);
            }
            data.push({
                geometry: {
                    type: 'LineString',
                    coordinates
                },
                lineWidth: y === 0 ? 2 : undefined
            });
        }

        return data;
    };

    Highcharts.getJSON(
        'https://code.highcharts.com/mapdata/custom/world.topo.json',
        topology => {

            const chart = Highcharts.mapChart('map-container', {
                chart: {
                    map: topology
                },

                title: {
                    text: 'RegionsQuiz',
                    floating: true,
                    align: 'left',
                    style: {
                        textOutline: '2px white'
                    }
                },

                subtitle: {
                    text: '<br>Click and drag to rotate globe<br>',
                    floating: true,
                    y: 34,
                    align: 'left'
                },

                legend: {
                    enabled: false
                },

                mapNavigation: {
                    enabled: true,
                    enableDoubleClickZoomTo: true,
                    buttonOptions: {
                        verticalAlign: 'bottom'
                    }
                },

                mapView: {
                    maxZoom: 30,
                    projection: {
                        name: 'Orthographic',
                        rotation: [60, -30]
                    }
                },

                colorAxis: {
                    tickPixelInterval: 100,
                    minColor: '#03AEB8',
                    maxColor: '#FFFF',
                    max: 1000
                },

                tooltip: {
                    pointFormat: 'Region Code: {point.code}'
                },

                plotOptions: {
                    series: {
                        animation: {
                            duration: 750
                        },
                        clip: false
                    }
                },

                series: [{
                    name: 'Graticule',
                    id: 'graticule',
                    type: 'mapline',
                    data: getGraticule(),
                    accessibility: {
                        enabled: false
                    },
                    enableMouseTracking: false
                }, {
                    data,
                    joinBy: ['iso-a2', 'code'],
                    name: 'Hint',
                    states: {
                        hover: {
                            color: '#FC4662',
                            borderColor: '#a4edba'
                        }
                    },
                    dataLabels: {
                        enabled: false,
                        format: '{point.code}'
                    },
                    events: {},
                    accessibility: {
                        exposeAsGroupOnly: true
                    }
                }]
            });

            // Render a circle filled with a radial gradient behind the globe to
            // make it appear as the sea around the continents
            const renderSea = () => {
                let verb = 'animate';
                if (!chart.sea) {
                    chart.sea = chart.renderer
                        .circle()
                        .attr({
                            fill: {
                                radialGradient: {
                                    cx: 0.4,
                                    cy: 0.4,
                                    r: 1
                                },
                                stops: [
                                    [0, 'white'],
                                    [1, 'lightblue']
                                ]
                            },
                            zIndex: -1
                        })
                        .add(chart.get('graticule').group);
                    verb = 'attr';
                }

                const bounds = chart.get('graticule').bounds,
                    p1 = chart.mapView.projectedUnitsToPixels({
                        x: bounds.x1,
                        y: bounds.y1
                    }),
                    p2 = chart.mapView.projectedUnitsToPixels({
                        x: bounds.x2,
                        y: bounds.y2
                    });
                chart.sea[verb]({
                    cx: (p1.x + p2.x) / 2,
                    cy: (p1.y + p2.y) / 2,
                    r: Math.min(p2.x - p1.x, p1.y - p2.y) / 2
                });
            };
            renderSea();
            Highcharts.addEvent(chart, 'redraw', renderSea);

        }
    );

}