import VectorSource from 'ol/source/vector';
import VectorLayer from 'ol/layer/vector';
import GeoJSON from 'ol/format/geojson';
import Style from 'ol/style/style';
import Stroke from 'ol/style/stroke';
import Fill from 'ol/style/fill';
import Circle from 'ol/style/circle';
import Point from 'ol/geom/point';
var parseQueryString = require('js/lib/parseQueryString');

var jsts = require('js/lib/jsts');
var jstsParser = new jsts.io.OL3Parser();

function bufferGeometry(geometry, meters) {
  meters = (typeof meters !== 'undefined') ?
    meters :
    0;

  var sourceProj = window.map.getView().getProjection();
  var transformedGeometry = (geometry.clone().transform(sourceProj, 'EPSG:3857'));
  var jstsGeom = jstsParser.read(transformedGeometry); //Only accept 3857
  console.log('jstsGeom', jstsGeom);
  // create a buffer of 1 meters around each line
  var buffered = jstsGeom.buffer(meters);

  // convert back from JSTS and replace the geometry on the feature
  var bufferedGeometry = window.jstsParser.write(buffered);
  return bufferedGeometry.transform('EPSG:3857', sourceProj);
}

function cargarShapefile(url) {
  $('#cargando').removeClass('hidden');
  console.log('Cargando...');
  window.loadshp({
    url: url, // path or your upload file
    encoding: 'big5', // default utf-8
    EPSG: 3116, // default 4326 //3826
    EPSG: 3857 // Web mercator
  }, function(geojson) {
    console.log('Cargado.', geojson);
    // geojson returned
    window.geojsonObject = geojson;
    var features = geojson.features;
    if (features.length === 0){
      window.alert('No se han encontrado datos en el archivo.');
      $('#cargando').addClass('hidden');
    }
    var source = new VectorSource({
      features: (new GeoJSON()).readFeatures(geojson)
    });
    var vectorLayer = new VectorLayer({
      source: source,
      style: styleFunction
    });
    window.vectorLayer = vectorLayer;
    map.addLayer(vectorLayer);
    var extent = null;
    var geometry = features[0].geometry;
    if (features.length === 1 && geometry.type == 'Point'){
      console.log('geometry', geometry);
      var newGeometry = new Point(geometry.coordinates);
      extent = bufferGeometry(newGeometry, 10);
    } else {
      extent = vectorLayer.getSource().getExtent()
    }
    map.getView().fit(extent, map.getSize());
    $('#cargando').addClass('hidden');
  }, function(error) {
    window.alert('Error: ' + error);
    $('#cargando').addClass('hidden');
  });
}

map.once('postrender', function(event) {
  var url = parseQueryString.getParams().url;
  if (url !== undefined) {
    cargarShapefile(url);
  }
});

$('#file').on('change', function() {
  console.log('dsdf', document.getElementById('file').files[0]);
  cargarShapefile(document.getElementById('file').files[0]);
});

var image = new Circle({
  radius: 5,
  fill: null,
  stroke: new Stroke({
    color: 'red',
    width: 1
  })
});

var styles = {
  'Point': new Style({
    image: image
  }),
  'LineString': new Style({
    stroke: new Stroke({
      color: 'green',
      width: 1
    })
  }),
  'MultiLineString': new Style({
    stroke: new Stroke({
      color: 'green',
      width: 1
    })
  }),
  'MultiPoint': new Style({
    image: image
  }),
  'MultiPolygon': new Style({
    stroke: new Stroke({
      color: 'yellow',
      width: 1
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 0, 0.1)'
    })
  }),
  'Polygon': new Style({
    stroke: new Stroke({
      color: 'blue',
      lineDash: [4],
      width: 3
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.1)'
    })
  }),
  'GeometryCollection': new Style({
    stroke: new Stroke({
      color: 'magenta',
      width: 2
    }),
    fill: new Fill({
      color: 'magenta'
    }),
    image: new Circle({
      radius: 10,
      fill: null,
      stroke: new Stroke({
        color: 'magenta'
      })
    })
  }),
  'Circle': new Style({
    stroke: new Stroke({
      color: 'red',
      width: 2
    }),
    fill: new Fill({
      color: 'rgba(255,0,0,0.2)'
    })
  })
};

var styleFunction = function(feature) {
  return styles[feature.getGeometry().getType()];
};
