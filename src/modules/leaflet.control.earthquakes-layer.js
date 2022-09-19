/**
 * L control tiles with given default tiles
 */
/* eslint no-undef: 0 */
 L.Control.earthquakeslayer = L.Control.Layers.extend({
   options: {
     position: 'topleft',
   },
    _addItem: function (obj) {
      if (obj.layer.first) {
        // insert the title if there is a first attribute (containing title)
        var div = document.createElement('b')
        div.innerHTML = obj.layer.first
        this._overlaysList.appendChild(div)
      }
      L.Control.Layers.prototype._addItem.call(this, obj)
    }
 })
 module.exports = L.Control.earthquakeslayer
