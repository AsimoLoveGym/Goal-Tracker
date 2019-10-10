(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = factory(require("d3"));
    else if (typeof define === 'function' && define.amd)
        define(["d3"], factory);
    else if (typeof exports === 'object')
        exports["timeline"] = factory(require("d3"));
    else
        root["timeline"] = factory(root["d3"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
    return /******/ (function(modules) { // webpackBootstrap
        /******/ // The module cache
        /******/
        var installedModules = {};
        /******/
        /******/ // The require function
        /******/
        function __webpack_require__(moduleId) {
            /******/
            /******/ // Check if module is in cache
            /******/
            if (installedModules[moduleId])
                /******/
                return installedModules[moduleId].exports;
            /******/
            /******/ // Create a new module (and put it into the cache)
            /******/
            var module = installedModules[moduleId] = {
                /******/
                exports: {},
                /******/
                id: moduleId,
                /******/
                loaded: false
                /******/
            };
            /******/
            /******/ // Execute the module function
            /******/
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            /******/
            /******/ // Flag the module as loaded
            /******/
            module.loaded = true;
            /******/
            /******/ // Return the exports of the module
            /******/
            return module.exports;
            /******/
        }
        /******/
        /******/
        /******/ // expose the modules object (__webpack_modules__)
        /******/
        __webpack_require__.m = modules;
        /******/
        /******/ // expose the module cache
        /******/
        __webpack_require__.c = installedModules;
        /******/
        /******/ // __webpack_public_path__
        /******/
        __webpack_require__.p = "";
        /******/
        /******/ // Load entry module and return exports
        /******/
        return __webpack_require__(0);
        /******/
    })
    /************************************************************************/
    /******/
    ([
        /* 0 */
        /***/
        function(module, exports, __webpack_require__) {

            __webpack_require__(9);
            module.exports = __webpack_require__(13);


            /***/
        },
        /* 1 */
        /***/
        function(module, exports) {

            module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

            /***/
        },
        /* 2 */
        /***/
        function(module, exports, __webpack_require__) {

            'use strict';

            var _d = __webpack_require__(1);

            var _d2 = _interopRequireDefault(_d);

            function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

            var config = {
                start: new Date(0),
                end: new Date(),
                contextStart: null,
                contextEnd: null,
                minScale: 0,
                maxScale: Infinity,
                width: null,
                padding: {
                    top: 30, //must be at least 24 for marker to display properly
                    left: 40,
                    bottom: 40,
                    right: 40
                },
                lineHeight: 40,
                labelWidth: 140,
                sliderWidth: 30,
                contextHeight: 50,
                locale: null,
                axisFormat: null,
                tickFormat: [
                    ['.%L', function(d) {
                        return d.getMilliseconds();
                    }],
                    [':%S', function(d) {
                        return d.getSeconds();
                    }],
                    ['%I:%M', function(d) {
                        return d.getMinutes();
                    }],
                    ['%I %p', function(d) {
                        return d.getHours();
                    }],
                    ['%b %d', function(d) {
                        return d.getMonth() && d.getDate();
                    }],
                    ['%b', function(d) {
                        return d.getMonth();
                    }],
                    ['%Y', function() {
                        return true;
                    }]
                ],
                eventHover: null,
                eventZoom: null,
                eventClick: null,
                eventLineColor: function eventLineColor(d, i) {
                    switch (i % 5) {
                        case 0:
                            return "#00659c";
                        case 1:
                            return "#0088ce";
                        case 2:
                            return "#3f9c35";
                        case 3:
                            return "#ec7a08";
                        case 4:
                            return "#cc0000";
                    }
                },
                eventColor: null,
                eventShape: function eventShape(d) {
                    if (d.hasOwnProperty("events")) {
                        return '\uF140';
                    } else {
                        return '\uF111';
                    }
                },
                eventPopover: function eventPopover(d) {
                    var popover = '';
                    if (d.hasOwnProperty("events")) {
                        popover = 'Group of ' + d.events.length + ' events';
                    } else {
                        for (var i in d.details) {
                            popover = popover + i.charAt(0).toUpperCase() + i.slice(1) + ': ' + d.details[i] + '<br>';
                        }
                        popover = popover + 'Date: ' + d.date;
                    }
                    return popover;
                },
                marker: true,
                context: true,
                slider: true,
                eventGrouping: 60000 //one minute
            };

            config.dateFormat = config.locale ? config.locale.timeFormat('%a %x %I:%M %p') : _d2.default.time.format('%a %x %I:%M %p');

            module.exports = config;

            /***/
        },
        /* 3 */
        /***/
        function(module, exports, __webpack_require__) {

            'use strict';

            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            var _xAxis = __webpack_require__(10);

            var _xAxis2 = _interopRequireDefault(_xAxis);

            function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

            exports.default = function(axesContainer, scales, configuration, dimensions) {
                return function(data) {
                    var axis = function axis(scope, scale) {
                        var selection = axesContainer.selectAll('.timeline-pf-x-axis.' + scope).data([{}]);

                        selection.enter().append('g').classed('timeline-pf-x-axis', true).classed(scope, true).call((0, _xAxis2.default)(scale, configuration)).attr('transform', 'translate(0,' + (scope === 'focus' ? dimensions.height : dimensions.height + dimensions.ctxHeight + 40) + ')');

                        selection.call((0, _xAxis2.default)(scale, configuration, dimensions.width));

                        selection.exit().remove();
                    };

                    axis('focus', scales.x);

                    if (configuration.context) {
                        axis('context', scales.ctx);
                    }
                };
            };

            /***/
        },
        /* 4 */
        /***/
        function(module, exports, __webpack_require__) {

            'use strict';

            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            var _d = __webpack_require__(1);

            var _d2 = _interopRequireDefault(_d);

            function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

            exports.default = function(svg, scales, dimensions, configuration, data) {

                var contextContainer = svg.append("g").classed('timeline-pf-context', true).attr('width', dimensions.width).attr('height', dimensions.ctxHeight).attr('clip-path', 'url(#timeline-pf-context-brush-clipper)').attr("transform", 'translate(' + (configuration.padding.left + configuration.labelWidth) + ',' + (configuration.padding.top + dimensions.height + 40) + ')');

                var counts = [];
                var roundTo = 3600000; //one hour
                var barWidth = Math.ceil(roundTo / (scales.ctx.domain()[1] - scales.ctx.domain()[0]) * dimensions.width);

                countEvents(data, roundTo, counts);
                counts.sort(function(a, b) {
                    if (a.date < b.date) {
                        return -1;
                    }
                    if (a.date > b.date) {
                        return 1;
                    }
                    return 0;
                });
                scales.cty.domain([0, _d2.default.max(counts, function(d) {
                    return d.count;
                })]);

                contextContainer.selectAll(".timeline-pf-bar").data(counts).enter().append("rect").attr("class", "timeline-pf-bar").attr("x", function(d) {
                    return scales.ctx(d.date);
                }).attr("y", function(d) {
                    return scales.cty(d.count);
                }).attr("width", barWidth).attr("height", function(d) {
                    return dimensions.ctxHeight - scales.cty(d.count);
                });

                contextContainer.append("g").attr("class", "timeline-pf-brush");
            };

            function countEvents(data, toRoundTo, counts) {
                var temp = {};
                for (var i in data) {
                    for (var j in data[i].data) {
                        var rounded = Math.floor(data[i].data[j].date / toRoundTo) * toRoundTo;
                        temp[rounded] = temp[rounded] + 1 || 1;
                    }
                }
                for (var k in temp) {
                    var tempDate = new Date();
                    tempDate.setTime(+k);
                    counts.push({ 'date': tempDate, 'count': temp[k] });
                }
            };

            /***/
        },
        /* 5 */
        /***/
        function(module, exports) {

            'use strict';

            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            exports.default = function(svg, scales, configuration) {
                return function dropsSelector(data) {
                    var dropLines = svg.selectAll('.timeline-pf-drop-line').data(data);

                    dropLines.enter().append('g').classed('timeline-pf-drop-line', true).attr('transform', function(d, idx) {
                        return 'translate(0, ' + (scales.y(idx) + configuration.lineHeight / 2) + ')';
                    }).attr('fill', configuration.eventLineColor);

                    dropLines.each(function dropLineDraw(drop) {

                        var drops = d3.select(this).selectAll('.timeline-pf-drop').data(drop.data);

                        drops.attr('transform', function(d) {
                            return 'translate(' + scales.x(d.date) + ')';
                        });

                        var shape = drops.enter().append('text').classed('timeline-pf-drop', true).classed('timeline-pf-event-group', function(d) {
                            return d.hasOwnProperty("events") ? true : false;
                        }).attr('transform', function(d) {
                            return 'translate(' + scales.x(d.date) + ')';
                        }).attr('fill', configuration.eventColor).attr('text-anchor', 'middle').attr('data-toggle', 'popover').attr('data-html', 'true').attr('data-content', configuration.eventPopover).attr('dominant-baseline', 'central').text(configuration.eventShape);

                        if (configuration.eventClick) {
                            shape.on('click', configuration.eventClick);
                        }

                        if (configuration.eventHover) {
                            shape.on('mouseover', configuration.eventHover);
                        }

                        // unregister previous event handlers to prevent from memory leaks
                        drops.exit().on('click', null).on('mouseover', null);

                        drops.exit().remove();
                    });

                    dropLines.exit().remove();
                };
            };

            /***/
        },
        /* 6 */
        /***/
        function(module, exports, __webpack_require__) {

            'use strict';

            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            var _d = __webpack_require__(1);

            var _d2 = _interopRequireDefault(_d);

            var _axes = __webpack_require__(3);

            var _axes2 = _interopRequireDefault(_axes);

            var _drops = __webpack_require__(5);

            var _drops2 = _interopRequireDefault(_drops);

            var _labels = __webpack_require__(7);

            var _labels2 = _interopRequireDefault(_labels);

            var _marker = __webpack_require__(8);

            var _marker2 = _interopRequireDefault(_marker);

            function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

            exports.default = function(svg, dimensions, scales, configuration) {
                var defs = svg.append('defs');
                defs.append('clipPath').attr('id', 'timeline-pf-drops-container-clipper').append('rect').attr('id', 'timeline-pf-drops-container-rect').attr('x', 0).attr('y', 0).attr('width', dimensions.width).attr('height', dimensions.height);

                if (configuration.context) {
                    defs.append('clipPath').attr('id', 'timeline-pf-context-brush-clipper').append('polygon').attr('points', '0,0 ' + dimensions.width + ',0 ' + (dimensions.width + configuration.sliderWidth) + ',' + dimensions.ctxHeight / 2 + ' ' + dimensions.width + ',' + dimensions.ctxHeight + ' 0,' + dimensions.ctxHeight + ' ' + -configuration.sliderWidth + ',' + dimensions.ctxHeight / 2);
                }

                var pattern = defs.append('pattern').attr('class', 'timeline-pf-grid-stripes').attr('id', 'timeline-pf-grid-stripes').attr('width', dimensions.width).attr('height', configuration.lineHeight * 2).attr('patternUnits', 'userSpaceOnUse');
                pattern.append('rect').attr('width', dimensions.width).attr('height', configuration.lineHeight);
                pattern.append('line').attr('x1', 0).attr('x2', dimensions.width).attr('y1', configuration.lineHeight).attr('y2', configuration.lineHeight);
                pattern.append('line').attr('x1', 0).attr('x2', dimensions.width).attr('y1', '1px').attr('y2', '1px');

                var gridContainer = svg.append('g').classed('timeline-pf-grid', true).attr('fill', 'url(#timeline-pf-grid-stripes)').attr('transform', 'translate(' + (configuration.padding.left + configuration.labelWidth) + ', ' + configuration.padding.top + ')');

                var labelsContainer = svg.append('g').classed('timeline-pf-labels', true).attr('transform', 'translate(' + configuration.padding.left + ', ' + configuration.padding.top + ')');

                var axesContainer = svg.append('g').classed('timeline-pf-axes', true).attr('transform', 'translate(' + (configuration.padding.left + configuration.labelWidth) + ',  ' + configuration.padding.top + ')');

                var dropsContainer = svg.append('g').classed('timeline-pf-drops-container', true).attr('clip-path', 'url(#timeline-pf-drops-container-clipper)').attr('transform', 'translate(' + (configuration.padding.left + configuration.labelWidth) + ',  ' + configuration.padding.top + ')');

                if (configuration.marker) {
                    var stampContainer = svg.append('g').classed('timeline-pf-timestamp', true).attr('height', 30).attr('transform', 'translate(' + (configuration.padding.left + configuration.labelWidth) + ', ' + configuration.padding.top + ')');

                    (0, _marker2.default)(gridContainer, stampContainer, scales, dimensions, configuration.dateFormat);
                }

                var axes = (0, _axes2.default)(axesContainer, scales, configuration, dimensions);
                var labels = (0, _labels2.default)(labelsContainer, scales, configuration);
                var drops = (0, _drops2.default)(dropsContainer, scales, configuration);

                return function(data) {
                    drops(data);
                    labels(data);
                    axes(data);
                };
            };

            /***/
        },
        /* 7 */
        /***/
        function(module, exports) {

            'use strict';

            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            exports.default = function(container, scales, config) {
                return function(data) {
                    var labels = container.selectAll('.timeline-pf-label').data(data);

                    var countEvents = function countEvents(data) {
                        var count = 0;
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].hasOwnProperty("events")) {
                                count += data[i].events.length;
                            } else {
                                count++;
                            }
                        }
                        return count;
                    };
                    var text = function text(d) {
                        var count = countEvents(d.data);
                        if (d.name === undefined || d.name === '') {
                            return count + ' Events';
                        }
                        return d.name + (count >= 0 ? ' (' + count + ')' : '');
                    };

                    labels.text(text);

                    labels.enter().append('text').classed('timeline-pf-label', true).attr('transform', function(d, idx) {
                        return 'translate(' + (config.labelWidth - 20) + ' ' + (scales.y(idx) + config.lineHeight / 2) + ')';
                    }).attr('dominant-baseline', 'central').attr('text-anchor', 'end').text(text);

                    labels.exit().remove();
                };
            };

            /***/
        },
        /* 8 */
        /***/
        function(module, exports, __webpack_require__) {

            'use strict';

            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            var _d = __webpack_require__(1);

            var _d2 = _interopRequireDefault(_d);

            function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

            exports.default = function(gridContainer, stampContainer, scales, dimensions, dateFormat) {
                gridContainer.append('rect').attr('width', dimensions.width).attr('height', dimensions.height).on("mouseover", function() {
                    marker.style("display", null);
                    timeStamp.style("display", null);
                    timeBox.style("display", null);
                }).on("mouseout", function() {
                    marker.style("display", "none");
                    timeStamp.style("display", "none");
                    timeBox.style("display", "none");
                }).on('mousemove', moveMarker);

                var marker = gridContainer.append('line').classed('timeline-pf-marker', true).attr('y1', 0).attr('y2', dimensions.height);

                var domain = scales.x.domain();

                var timeBox = stampContainer.append('rect').attr('height', '24').attr('width', '150').style('display', 'none');

                var timeStamp = stampContainer.append('text').text(dateFormat(domain[1])).attr('transform', 'translate(' + scales.x.range()[1] + ')').attr('text-anchor', 'middle');

                function moveMarker() {
                    var pos = _d2.default.mouse(gridContainer[0][0])[0];
                    marker.attr('transform', 'translate(' + pos + ')');
                    timeBox.attr('transform', 'translate(' + (pos - 75) + ', -25)');
                    timeStamp.attr('transform', 'translate(' + pos + ', -9)').text(dateFormat(scales.x.invert(pos)));
                }
            };

            /***/
        },
        /* 9 */
        /***/
        function(module, exports, __webpack_require__) {

            'use strict';

            var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

            var _d = __webpack_require__(1);

            var _d2 = _interopRequireDefault(_d);

            var _configurable = __webpack_require__(12);

            var _configurable2 = _interopRequireDefault(_configurable);

            var _config = __webpack_require__(2);

            var _config2 = _interopRequireDefault(_config);

            var _drawer = __webpack_require__(6);

            var _drawer2 = _interopRequireDefault(_drawer);

            var _context = __webpack_require__(4);

            var _context2 = _interopRequireDefault(_context);

            var _zoom = __webpack_require__(11);

            var _zoom2 = _interopRequireDefault(_zoom);

            function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

            function timeline() {
                var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                var finalConfiguration = _extends({}, _config2.default, config);
                var zoomInstance = new _zoom2.default();

                var yScale = function yScale(data) {
                    return _d2.default.scale.ordinal().domain(data.map(function(d) {
                        return d.name;
                    })).range(data.map(function(d, i) {
                        return i * finalConfiguration.lineHeight;
                    }));
                };

                var xScale = function xScale(width, timeBounds) {
                    return _d2.default.time.scale().range([0, width]).domain(timeBounds);
                };

                function timelineGraph(selection) {
                    selection.each(function selector(data) {

                        var ungroupedData = data;
                        data = groupEvents(data, finalConfiguration.eventGrouping);

                        finalConfiguration.lineHeight = data.length <= 3 ? 80 : 40;
                        finalConfiguration.contextStart = finalConfiguration.contextStart || _d2.default.min(getDates(data));
                        finalConfiguration.contextEnd = finalConfiguration.contextEnd || finalConfiguration.end;

                        _d2.default.select(this).select('.timeline-pf-chart').remove();
                        _d2.default.select(this).selectAll('.timeline-pf-zoom').remove();

                        var SCALEHEIGHT = 40;
                        var outer_width = finalConfiguration.width || selection.node().clientWidth;
                        var height = data.length * finalConfiguration.lineHeight;

                        var dimensions = {
                            width: outer_width - finalConfiguration.padding.right - finalConfiguration.padding.left - finalConfiguration.labelWidth - (finalConfiguration.slider ? finalConfiguration.sliderWidth : 0),
                            height: height,
                            ctxHeight: finalConfiguration.contextHeight,
                            outer_height: height + finalConfiguration.padding.top + finalConfiguration.padding.bottom + (finalConfiguration.context ? finalConfiguration.contextHeight + SCALEHEIGHT : 0)
                        };
                        var scales = {
                            x: xScale(dimensions.width, [finalConfiguration.start, finalConfiguration.end]),
                            y: yScale(data),
                            ctx: xScale(dimensions.width, [finalConfiguration.contextStart, finalConfiguration.contextEnd]),
                            cty: _d2.default.scale.linear().range([dimensions.ctxHeight, 0])
                        };

                        var svg = _d2.default.select(this).append('svg').classed('timeline-pf-chart', true).attr({
                            width: outer_width,
                            height: dimensions.outer_height
                        });
                        var draw = (0, _drawer2.default)(svg, dimensions, scales, finalConfiguration).bind(selection);

                        draw(data);

                        if (finalConfiguration.context) {
                            (0, _context2.default)(svg, scales, dimensions, finalConfiguration, ungroupedData);
                        }

                        zoomInstance.updateZoom(_d2.default.select(this), dimensions, scales, finalConfiguration, data, draw);
                    });
                }

                (0, _configurable2.default)(timelineGraph, finalConfiguration);
                timelineGraph.Zoom = zoomInstance;
                return timelineGraph;
            }

            _d2.default.chart = _d2.default.chart || {};
            _d2.default.chart.timeline = timeline;

            module.exports = timeline;

            function getDates(data) {
                var toReturn = [];
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < data[i].data.length; j++) {
                        toReturn.push(data[i].data[j].date);
                    }
                }
                return toReturn;
            }

            function groupEvents(data, toRoundTo) {
                var rounded = void 0,
                    temp = {},
                    toReturn = [];

                for (var i = 0; i < data.length; i++) {
                    toReturn[i] = {};
                    toReturn[i].name = data[i].name;
                    toReturn[i].data = [];
                    for (var j = 0; j < data[i].data.length; j++) {
                        rounded = Math.round(data[i].data[j].date / toRoundTo) * toRoundTo;
                        if (temp[rounded] === undefined) {
                            temp[rounded] = [];
                        }
                        temp[rounded].push(data[i].data[j]);
                    }
                    for (var k in temp) {
                        if (temp[k].length === 1) {
                            toReturn[i].data.push(temp[k][0]);
                        } else {
                            var tempDate = new Date();
                            tempDate.setTime(+k);
                            toReturn[i].data.push({ 'date': tempDate, 'events': temp[k] });
                        }
                    }
                    temp = {};
                }
                return toReturn;
            }

            /***/
        },
        /* 10 */
        /***/
        function(module, exports, __webpack_require__) {

            'use strict';

            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            exports.default = function(xScale, configuration, width) {
                var tickFormatData = configuration.tickFormat.map(function(t) {
                    return t.slice(0);
                });
                var tickFormat = configuration.locale ? configuration.locale.timeFormat.multi(tickFormatData) : _d2.default.time.format.multi(tickFormatData);
                var numTicks = Math.round(width / 70);
                var axis = _d2.default.svg.axis().scale(xScale).orient('bottom').ticks(numTicks).tickFormat(tickFormat);

                if (typeof configuration.axisFormat === 'function') {
                    configuration.axisFormat(axis);
                }

                return axis;
            };

            var _d = __webpack_require__(1);

            var _d2 = _interopRequireDefault(_d);

            function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

            /***/
        },
        /* 11 */
        /***/
        function(module, exports, __webpack_require__) {

            'use strict';

            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            var _createClass = function() {
                function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor); } } return function(Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

            var _d = __webpack_require__(1);

            var _d2 = _interopRequireDefault(_d);

            function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

            function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

            var zoom = function() {
                function zoom() {
                    _classCallCheck(this, zoom);
                }

                _createClass(zoom, [{
                    key: 'updateZoom',
                    value: function updateZoom(container, dimensions, scales, configuration, data, callback) {
                        var _this = this;

                        this.ONE_MINUTE = 60 * 1000;
                        this.ONE_HOUR = this.ONE_MINUTE * 60;
                        this.ONE_DAY = this.ONE_HOUR * 24;
                        this.ONE_WEEK = this.ONE_DAY * 7;
                        this.ONE_MONTH = this.ONE_DAY * 30;

                        this.grid = _d2.default.select('.timeline-pf-grid');
                        this.dimensions = dimensions;
                        this.scales = scales;
                        this.configuration = configuration;
                        this.data = data;
                        this.callback = callback;
                        this.sliderScale = _d2.default.scale.log().domain([configuration.minScale, configuration.maxScale]).range([configuration.minScale, configuration.maxScale]).base(2);
                        this.zoom = _d2.default.behavior.zoom().size([dimensions.width, dimensions.height]).scaleExtent([configuration.minScale, configuration.maxScale]).x(scales.x);
                        this.brush = null;

                        if (configuration.slider) {
                            var zoomIn = container.append('button').attr('type', 'button').attr('class', 'btn btn-default timeline-pf-zoom timeline-pf-zoom-in').attr('id', 'timeline-pf-zoom-in').style('top', configuration.padding.top + 'px').on('click', function() {
                                _this.zoomClick();
                            });
                            zoomIn.style('left', configuration.padding.left + configuration.labelWidth + dimensions.width + (configuration.sliderWidth - zoomIn.node().offsetWidth) + 'px').append('i').attr('class', 'fa fa-plus').attr('id', 'timeline-pf-zoom-in-icon');

                            var zoomOut = container.append('button').attr('type', 'button').attr('class', 'btn btn-default timeline-pf-zoom').attr('id', 'timeline-pf-zoom-out').style('top', configuration.padding.top + dimensions.height - 26 + 'px').on('click', function() {
                                _this.zoomClick();
                            });
                            zoomOut.style('left', configuration.padding.left + configuration.labelWidth + dimensions.width + (configuration.sliderWidth - zoomOut.node().offsetWidth) + 'px').append('i').attr('class', 'fa fa-minus').attr('id', 'timeline-pf-zoom-out-icon');

                            var zoomSlider = container.append('input').attr('type', 'range').attr('class', 'timeline-pf-zoom timeline-pf-slider').attr('id', 'timeline-pf-slider').style('width', dimensions.height - zoomIn.node().offsetHeight * 2 + 'px').attr('value', this.sliderScale(this.zoom.scale())).attr('min', configuration.minScale).attr('max', configuration.maxScale).attr('step', 0.1).on('input', function() {
                                _this.zoomClick();
                            }).on('change', function() {
                                _this.zoomClick();
                            });
                            zoomSlider.style('top', configuration.padding.top + (dimensions.height - zoomIn.node().offsetHeight * 2) / 2 + zoomIn.node().offsetHeight - zoomSlider.node().offsetHeight / 2 + 'px').style('left', configuration.padding.left + configuration.labelWidth + dimensions.width + configuration.sliderWidth - (zoomIn.node().offsetWidth - zoomSlider.node().offsetHeight) / 2 - zoomSlider.node().offsetWidth / 2 + 'px');
                        }

                        if (configuration.context) {
                            this.brush = _d2.default.svg.brush().x(scales.ctx).extent(scales.x.domain()).on("brush", function() {
                                _this.brushed();
                            });

                            container.select('.timeline-pf-brush').call(this.brush).selectAll("rect").attr("height", dimensions.ctxHeight);
                        }

                        if (configuration.eventZoom) {
                            this.zoom.on('zoomend', configuration.eventZoom);
                        }

                        this.zoom.on('zoom', function() {
                            requestAnimationFrame(function() {
                                return callback(data);
                            });
                            if (configuration.slider) {
                                container.select('#timeline-pf-slider').property('value', _this.sliderScale(_this.zoom.scale()));
                            }
                            if (configuration.context) {
                                _this.brush.extent(_this.scales.x.domain());
                                container.select('.timeline-pf-brush').call(_this.brush);
                            }
                        });
                        return this.grid.call(this.zoom).on("dblclick.zoom", null);
                    }
                }, {
                    key: 'brushed',
                    value: function brushed() {
                        if (this.brush.empty() !== true) {
                            var extent = this.brush.extent();
                            this.zoomFilter(extent[0], extent[1], 0);
                        }
                    }
                }, {
                    key: 'zoomClick',
                    value: function zoomClick() {
                        var factor = 0.5,
                            target_zoom = 1,
                            duration = 0,
                            center = this.dimensions.width / 2,
                            extent = this.zoom.scaleExtent(),
                            translate0 = void 0,
                            l = void 0,
                            view = {
                                x: this.zoom.translate()[0],
                                k: this.zoom.scale()
                            };
                        switch (_d2.default.event.target.id) {
                            case 'timeline-pf-zoom-in-icon':
                            case 'timeline-pf-zoom-in':
                                target_zoom = this.zoom.scale() * (1 + factor);
                                duration = 100;
                                break;
                            case 'timeline-pf-zoom-out-icon':
                            case 'timeline-pf-zoom-out':
                                target_zoom = this.zoom.scale() * (1 + factor * -1);
                                duration = 100;
                                break;
                            case 'timeline-pf-slider':
                                target_zoom = this.sliderScale.invert(_d2.default.event.target.value);
                                break;
                            default:
                                target_zoom = this.zoom.scale();
                        }

                        if (target_zoom < extent[0]) {
                            target_zoom = extent[0];
                        } else if (target_zoom > extent[1]) {
                            target_zoom = extent[1];
                        }

                        translate0 = (center - view.x) / view.k;
                        view.k = target_zoom;
                        l = translate0 * view.k + view.x;

                        view.x += center - l;
                        this.interpolateZoom([view.x, 0], view.k, duration);
                    }
                }, {
                    key: 'interpolateZoom',
                    value: function interpolateZoom(translate, scale, duration) {
                        var _this2 = this;

                        return _d2.default.transition().duration(duration).tween("zoom", function() {
                            if (_this2.zoom) {
                                var iTranslate = _d2.default.interpolate(_this2.zoom.translate(), translate),
                                    iScale = _d2.default.interpolate(_this2.zoom.scale(), scale);
                                return function(t) {
                                    _this2.zoom.scale(iScale(t)).translate(iTranslate(t));
                                    _this2.zoom.event(_this2.grid);
                                };
                            }
                        });
                    }
                }, {
                    key: 'getRange',
                    value: function getRange(Extent) {
                        return Extent[1].getTime() - Extent[0].getTime();
                    }
                }, {
                    key: 'getScale',
                    value: function getScale(oldRange, newRange) {
                        return oldRange / newRange;
                    }
                }, {
                    key: 'zoomFilter',
                    value: function zoomFilter(fromTime, toTime) {
                        var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;

                        var range = toTime - fromTime,
                            width = this.dimensions.width,
                            extent = this.zoom.scaleExtent(),
                            translate = this.zoom.translate()[0],
                            curZoom = this.zoom.scale(),
                            target_zoom = this.zoom.scale(),
                            cur_width = this.getRange(this.scales.x.domain()),
                            startDiff = void 0;

                        target_zoom = target_zoom * this.getScale(this.getRange(this.scales.x.domain()), range); // new scale is ratio between old and new date ranges

                        if (target_zoom < extent[0]) {
                            target_zoom = extent[0];
                        } else if (target_zoom > extent[1]) {
                            target_zoom = extent[1];
                        }

                        startDiff = (this.scales.x.domain()[0] - fromTime) * (width / cur_width); // difference between leftmost dates in px

                        translate += startDiff;

                        translate = translate * (target_zoom / curZoom); // scale translate value (in px) to new zoom scale

                        this.interpolateZoom([translate, 0], target_zoom, duration);
                    }
                }]);

                return zoom;
            }();

            exports.default = zoom;

            /***/
        },
        /* 12 */
        /***/
        function(module, exports, __webpack_require__) {

            'use strict';

            function configurable(targetFunction, config) {

                function configure(item) {
                    return function(value) {
                        if (!arguments.length) return config[item];
                        config[item] = value;

                        return targetFunction;
                    };
                }

                for (var item in config) {
                    targetFunction[item] = configure(item);
                }
            }

            if (true) {
                module.exports = configurable;
            } else if ('function' == typeof define && define.amd) {
                define([], configurable);
            } else {
                window.configurable = configurable;
            }


            /***/
        },
        /* 13 */
        /***/
        function(module, exports) {

            // removed by extract-text-webpack-plugin

            /***/
        }
        /******/
    ])
});;


/** WEBPACK FOOTER **
 ** timeline.js
 **/