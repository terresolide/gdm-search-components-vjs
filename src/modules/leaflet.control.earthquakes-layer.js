/**
 * L control tiles with given default tiles
 */
/* eslint no-undef: 0 */
 L.Control.earthquakeslayer = L.Control.Layers.extend({
   options: {
     position: 'topleft',
   },
  _addItem: function (obj) {
    console.log(obj.layer)
      if (obj.layer.first) {
        // insert the title if there is a first attribute (containing title)
        var div = document.createElement('b')
        div.innerHTML = obj.layer.first
        this._overlaysList.appendChild(div)
      }
      L.Control.Layers.prototype._addItem.call(this, obj)
      if (obj.layer.last) {
        var div = document.createElement('b')
        div.innerHTML = obj.layer.last.title
        this._overlaysList.appendChild(div)
      }
    }
 })
 module.exports = L.Control.earthquakeslayer
