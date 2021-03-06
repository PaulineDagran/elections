var options = {
  // Map options
  fullscreenControl: true,
  mapDivId: 'map',
  minZoom: 6,
  maxZoom: 7,
  startZoom: 6,
  center: [46.50, 1.45],
  // Data options
  resultFile: 'data/resultats/tour1/departements.json',
  // resultFileTour2: 'data/resultats/tour2/departements.json',
  entityFile: '../resources/departements.geojson',
  neutralColor: '#FFFFFF',
  // Legend options
  legendTitle: '<h3>Résultats par département</h3><p><small>La couleur du département montre la nuance ayant recueilli le plus grand nombre de voix, pas celle qui a le plus grand nombre d\'élus.</small></p>',
  legendHelp: 'Survolez un département pour plus de détails.',
  // Additionnal layer ?
  additionalLayer: 'data/regions_2015.geojson',
};

/* This function computes the results from the data and
   should return something like:
{ entityId (text): {
  name: entityName (text),
  scores: { {parti: text, score: int}, {parti: text, score: int} },
  winner: {
    parti: 'parti name' (Text),
    score: parti score (Int)
  }
}}
*/
function computeResults(data) {
  var entityId, parti, score, currentData;
  var results = {};
  // Start with i = 1 because of headers row
  for (var i = 1; i < data.length; i++) {
    currentData = data[i];
    entityId    = currentData.FIELD1;
    entityName  = 'Département : ' + currentData.FIELD2;
    resultId    = entityId;
    // Init.
    results[resultId] = {
      name: entityName,
      scores: {},
      winner: {
        parti: 'NUL',
        score: 0
      }
    }
    // Not partis.
    results[resultId].scores['ABSTENTION'] = parseInt(currentData.FIELD4);
    results[resultId].scores['BLANC'] = parseInt(currentData.FIELD8);
    results[resultId].scores['NUL'] = parseInt(currentData.FIELD11);
    var j = 17;
    while (j < 102) {
      parti       = currentData['FIELD'+j];
      if (parti === "") {
        break;
      } else {
        parti = parti.split('-')[1];
        score = parseInt(currentData['FIELD'+(j+2)]);
        if (score > results[resultId].winner.score) {
          results[resultId].winner = {
            parti: parti,
            score: score
          };
        } else if (score === results[resultId].winner.score) {
          results[resultId].winner = {
            parti: "BC-egal",
            score: score
          };
        }
        results[resultId].scores[parti] = score;
      }
      // Iterate.
      j += 5;
    }
  }
  return results;
}


function getEntityCode (rawCode) {
  if (rawCode === '2A' || rawCode === '2B') {
    return rawCode;
  } else {
    return ""+parseInt(rawCode);
  }
}
/**
 * This function retrieve the id of the geometrical layer.
 */
function getBorderId(layer) {
  entityCode = layer.feature.properties.code;
  return getEntityCode(entityCode);
}

/**
 * This function retrieve the TEXT version of the id
 * of the geometrical layer.
 */
function getResultId(feature) {
  entityCode = feature.properties.code;
  return getEntityCode(entityCode);
}
