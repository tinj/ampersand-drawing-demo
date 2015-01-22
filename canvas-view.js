var AmpersandView   = require('ampersand-view');
var Offset          = require('./helpers/offset');
var raf             = require('raf');
// var log             = require('bows')('V:Canvas');

module.exports = AmpersandView.extend(Offset, raf, {

    template: '<canvas dragable="false">',

    bindings: {
        // 'canvasStyle': {
        //     name: 'style',
        //     type: 'attribute'
        // },
        'model.height': {
            name: 'height',
            type: 'attribute'
        },
        'model.width': {
            name: 'width',
            type: 'attribute'
        }
    },

    // derived: {
    //     canvasStyle: {
    //         deps: ['model.topOffset', 'model.leftOffset'],
    //         fn: function () {
    //             var style = '';
    //             if (this.model.topOffset)
    //                 style += 'top:' + this.model.topOffset + 'px;';
    //             if (this.model.leftOffset)
    //                 style += 'left:' + (this.model.leftOffset) + 'px;';
    //             return style;
    //         }
    //     }
    // },

    session: {
        _drawPending: ['boolean', true, false],
        ctx: 'object',
        drawing: 'boolean',
        left: 'number',
        top: 'number'
    },

    initialize: function () {
        // log('initializing');
        this.on('change:model.lastPoint', this.draw);
    },

    render: function () {
        this.renderWithTemplate(this);
        this.drawCanvas = this.drawCanvas.bind(this);
        var ctx = this.ctx = this.el.getContext('2d');
        ctx.lineCap = this.model.lineCap;
        ctx.lineJoin = this.model.lineJoin;
        ctx.lineWidth = this.model.lineWidth;
        ctx.strokeStyle = this.model.strokeStyle;
        this.draw();
    },

    draw: function () {
        if (this._drawPending) return;
        this._drawPending = true;
        raf(this.drawCanvas);
    },

    clearCanvas: function () {
        this.ctx.clearRect(0, 0, this.model.width, this.model.height);
    },

    drawCanvas: function () {
        this._drawPending = false;
        this.clearCanvas();
        this.drawLines(this.model.points);
    },

    drawLines: function (points) {
        var ctx = this.ctx;

        ctx.beginPath();

        points.forEach(function (pts, i) {
            if (i === 0) {
                // Start at the first point
                ctx.moveTo.apply(ctx, pts);
            } else {
                ctx.lineTo.apply(ctx, pts);
            }
        });

        ctx.stroke();
    },

    events: {
        'mousedown': 'startDraw',
        'mousemove': 'moveDraw',
        'mouseup': 'stopDraw',
        'touchstart': 'startDraw',
        'touchmove': 'moveDraw',
        'touchend': 'stopDraw'
    },

    addPoint: function (ev) {
        var pt = this._getEventPosition(ev);
        this.model.addPoint(pt);
    },

    startDraw: function (ev) {
        if (ev) ev.preventDefault();
        this.drawing = true;
        this.set(this.getElOffset());
        this.model.startDraw();
        this.addPoint(ev, true);
    },

    moveDraw: function (ev) {
        if (!this.drawing) return;
        if (ev) {
            ev.preventDefault();
            ev.stopPropagation();
        }
        this.addPoint(ev);
    },

    stopDraw: function (ev) {
        if (!this.drawing) return;
        if (ev) {
            ev.preventDefault();
            ev.stopPropagation();
        }
        this.drawing = false;
    },

    /**
     * Normalizes input event offsets relative to the actual curve canvas area.
     * @param  {{Object}} ev    Event data.
     * @return {{Object}} X and Y coordinates.
     */
    _getEventPosition: function (ev) {
        var pageX, pageY;

        if (ev.touches && ev.touches.length) {
            // This is a touch event
            pageX = ev.touches[0].pageX;
            pageY = ev.touches[0].pageY;
        } else {
            // Mouse event
            pageX = ev.pageX;
            pageY = ev.pageY;
        }

        return {
            x: pageX - this.left,
            y: pageY - this.top
        };
    }

});