var AmpersandCollection = require('ampersand-collection');
var underscoreMixin     = require('ampersand-collection-underscore-mixin');
var _                   = require('underscore');
var log              = require('bows')('C:Points');

module.exports = AmpersandCollection.extend(underscoreMixin, {

    mainIndex: 'x',

    comparator: 'x',

    // fill in intermediate values between p1 & p2
    interpolate: function (p1, p2) {
        if (!p2) return this.add(p1, {merge: true});
        var min = p1.x < p2.x ? p1 : p2;
        var max = p1.x > p2.x ? p1 : p2;
        var range = _.range(min.x, max.x);
        var yStart = min.y;
        var yEnd = max.y;
        var dy =  (yEnd - yStart) / (range.length + 1);
        range = _.map(range, function (x, i) {
            return {
                x: x,
                y: yStart + (i + 1) * dy
            };
        });
        range.push(p1);
        // log(range);
        this.add(range, {merge: true});
        return p1;
    }
});