var AmpersandState        = require('ampersand-state');
var PointCollection       = require('./collection');
// var log                   = require('bows')('M:Drawing');
// var _                     = require('underscore');

module.exports = AmpersandState.extend({

    props: {
        width: ['number', true, 400],
        height: ['number', true, 300],
        lineCap: ['string', true, 'round'],
        lineJoin: ['string', true, 'round'],
        lineWidth: ['number', true, 2],
        strokeStyle: ['string', true, '#4400FF']
    },

    collections: {
        points: PointCollection
    },

    session: {
        lastPoint: 'object'
    },

    startDraw: function () {
        this.unset('lastPoint');
        this.points.reset();
    },

    addPoint: function (pt) {
        this.lastPoint = this.points.interpolate(pt, this.lastPoint);
    }

});