/* eslint no-extend-native: 0 */
/* eslint camelcase: 0 */
Number.prototype.toRad = function () {
  return this * Math.PI / 180
}
Number.prototype.toDeg = function () {
  return this * 180 / Math.PI
}
export default {
  img (scan, ortho, az) {
    return {
      scan: scan,
      ortho: ortho,
      az: az,
      s_comp: Math.cos(ortho.toRad()) * Math.sin(scan.toRad()),
      o_comp: Math.cos(scan.toRad()) * Math.sin(ortho.toRad()),
      z_comp: Math.cos(ortho.toRad()) * Math.cos(scan.toRad())
    }
  },
  compute_b_to_h (im1, im2) {
    var tetaDeg = im2.az - im1.az
    var teta = tetaDeg.toRad()
    var p = [im1.s_comp, im1.o_comp, im1.z_comp]
    var p_prime = [
      Math.cos(teta) * p[0] - Math.sin(teta) * p[1],
      Math.sin(teta) * p[0] + Math.cos(teta) * p[1],
      p[2]
    ]
    var q = [im2.s_comp, im2.o_comp, im2.z_comp]
    var stereo_angle = Math.acos(p_prime[0] * q[0] + p_prime[1] * q[1] + p_prime[2] * q[2])
    var half_angle = stereo_angle / 2.0
    var b_to_h = Math.tan(half_angle) * 2
    return {angle: stereo_angle.toDeg(), bh: b_to_h}
  },
  computeStereo (images) {
      var angles = []
      images.forEach(function (img) {
        img.angles.sort(function (a, b) {
          return a.date < b.date ? -1 : 1
        })
        var data = { 
            id: img.id,
            date: img.startDate,
            scan: img.angles[1].incidence.alongTrack,
            ortho: img.angles[1].incidence.acrossTrack,
            az: img.angles[1].azimuth
          }
        angles.push(data)
      })
      angles.sort(function (a, b) {
        return a.date < b.date ? -1 : 1
      })
      for (var i = 0; i < angles.length - 1; i++) {
        for (var j = i + 1; j < angles.length; j++) {
          var img1 = this.img(angles[i].scan, angles[i].ortho, angles[i].az)
          var img2 = this.img(angles[j].scan, angles[j].ortho, angles[j].az)
          var st = this.compute_b_to_h(img1, img2)
          st.name = (i + 1) + '' + (j + 1)
          if (!angles[i].stereo) {
             angles[i].stereo = [st]
          } else {
            angles[i].stereo.push(st)
          }
        }
      }
      return angles
    }
}
