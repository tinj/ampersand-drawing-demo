module.exports = {

    getElOffset: function(el) {
        // Ported from https://github.com/jquery/jquery/blob/master/src/offset.js
        // Not as foolproof, but trades paranoia for speed
        if (!el)
            el = this.el;
        if (!this.el.ownerDocument)
            return undefined;
        var box = {left: 0, top: 0};
        var docElem = this.el.ownerDocument;
        var win = docElem.defaultView;
        // Check if this DOM node is disconnected
        if (!docElem.contains(this.el)) return box;
        // Does not work on BlackBerry <= 5.0 & iOS <= 3.0
        box = this.el.getBoundingClientRect();
        return {
            left: box.left + win.pageXOffset - docElem.documentElement.clientLeft,
            top: box.top + win.pageYOffset - docElem.documentElement.clientTop
        };
    }
};