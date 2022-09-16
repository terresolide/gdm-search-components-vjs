/* eslint no-extend-native: 0 */
/* eslint camelcase: 0 */

export default {
  lastApi: '',
  defaultApi: 'https://earthquake.usgs.gov/fdsnws/event/1/query',
  radius (mag) {
    var magn = Math.floor(mag)
    switch (magn) {
      case 4:
        return 200
      case 5: 
        return 500
      case 6: 
        return 1000
      case 7:
        return 5000
      case 8:
        return 20000
      case 9:
        return 50000
    }
  },
  search (params) {
    var url = this.defaultApi + '?format=geojson&limit=200'
    for (var key in params) {
      url += '&' + key + '=' + params[key]
    }
    return new Promise((successCallback, failureCallback) => {
      fetch(url)
      .then(
        response => successCallback(response.json()),
        response => failureCallback(response)
      )
      /* var xhttp = new XMLHttpRequest()
       console.log(url)
       xhttp.open('GET', url, true)
       xhttp.onreadystatechange = function() {
         if (xhttp.readyState == 4 && xhttp.status == 200) {
           successCallback(xhttp.response)
         }
         if (xhttp.readyState == 4 & xhttp.status !== 200) {
           failureCallback(resp)
         }
       }
       xhttp.send()
       */
    })
  }
}
