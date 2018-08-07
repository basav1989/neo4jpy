var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "halkarni.89"));
var session = driver.session();
var fs = require('fs')
var path = require('path')
var async = require('async')
var dataset = path.join(__dirname, "trialrelations");
var entities = path.join(__dirname, "entities");


var id = "relation";
var contents  = fs.readFileSync(dataset, 'utf8').toString().split('\n');


// Build a NER map
var entities = fs.readFileSync(entities, 'utf8').toString().split('\n');


var entityMap = {}
//0.8699863738170038	Amsterdam	inEurope	Leuven
//Heineken NNP ORGANIZATION

for (entity in entities) {
  var mention = entities[entity].split(" ")
  if (mention[2] == 'O') {
    continue;
  }

  if (!entityMap.hasOwnProperty(mention[0])) {
    entityMap[mention[0]] = mention[2]
  }  
}

console.log(entityMap)


// Insert into Graph
async.forEachOfSeries(contents, function(line, index, callback) {
        console.log("index" + index.toString() )
        var tokens  = line.split(' ')
        console.log(tokens)
                var atype = entityMap[tokens[1]]	
	        var btype = entityMap[tokens[3]]
                var pquery = "MATCH (a:" +  atype + "),(b:" + btype + ") WHERE a.title='" + tokens[1] + "' AND b.title='" + tokens[3] + "' CREATE (a)-[r:" + tokens[2] + "]->(b)";
		//var query = "MATCH (a:NATIONALITY),(b:NATIONALITY) WHERE a.title='Dutch' AND b.title='Danish' CREATE (a)-[r:neighbours]->(b)";
                console.log(pquery)
		session
		.run(pquery)
		.subscribe({
			onNext: function (record) {
			console.log(record.get('name'));
			},
		onCompleted: function () {
			console.log("completed successfully");
                        backup = "";
			callback();		
		},
		onError: function (error) {
			console.log(error);
			callback("cannot insert node")
                        return;
		}});



}, function(error) {
  console.log(error)

});


