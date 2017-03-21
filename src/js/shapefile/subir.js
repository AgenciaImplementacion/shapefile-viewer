import VectorSource from 'ol/source/vector';
import VectorLayer from 'ol/layer/vector';
import GeoJSON from 'ol/format/geojson';
import Style from 'ol/style/style';
import Stroke from 'ol/style/stroke';
import Fill from 'ol/style/fill';
import Circle from 'ol/style/circle';

$('#file').on('change', function() {
  $('#cargando').removeClass('hidden');
  console.log('Cargando...');
  loadshp({
    url: document.getElementById('file').files[0], // path or your upload file
    encoding: 'big5', // default utf-8
    EPSG: 3857 // default 4326 //3826
  }, function(geojson) {
    // geojson returned
    console.log('Cargado.', geojson);
    window.geojsonObject = geojson;
    var source = new VectorSource({
      features: (new GeoJSON()).readFeatures(geojson)
    });
    var vectorLayer = new VectorLayer({
      source: source,
      style: styleFunction
    });
    window.vectorLayer = vectorLayer;
    map.addLayer(vectorLayer);
    var extent = vectorLayer.getSource().getExtent();
    map.getView().fit(extent, map.getSize());
    $('#cargando').addClass('hidden');
  });
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
