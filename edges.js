var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "halkarni.89"));
var session = driver.session();
var fs = require('fs')
var path = require('path')
var async = require('async')
var dataset = path.join(__dirname, "trialrelations");


//Amsterdam NNP CITY
var id = "relation";
var contents  = fs.readFileSync(dataset, 'utf8').toString().split('\n');

async.forEachOfSeries(contents, function(line, index, callback) {
        console.log("index" + index.toString() )
        var tokens  = line.split('\t')
        console.log(tokens)

		var query = "MATCH (a:NATIONALITY),(b:NATIONALITY) WHERE a.title='Dutch' AND b.title='Danish' CREATE (a)-[r:neighbours]->(b)";
		session
		.run(query)
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
