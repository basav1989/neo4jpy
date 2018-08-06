var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://10.221.31.64:7687", neo4j.auth.basic("neo4j", "halkarni89"));
var session = driver.session();
var fs = require('fs')
var path = require('path')
var async = require('async')
var dataset = path.join(__dirname, "entities");


//Amsterdam NNP CITY
var id = "entity";
var contents  = fs.readFileSync(dataset, 'utf8').toString().split('\n');
var backup = "";

async.forEachOfSeries(contents, function(line, index, callback) {
        console.log("index" + index.toString() )
	var tokens  = line.split(' ')
	if (tokens[2] === 'O') {
		callback();
        return;
	}
	
	if ( (index + 1) < contents.length && contents[index + 1].split(' ')[1] === tokens[1] ) {
		backup = backup + tokens[0];
		console.log(backup);
		callback();
		return;
	} else {
		if (backup === "") {
			backup = backup + tokens[0];
		}
	}
	//console.log(tokens)

		console.log(line)
		
		var query = "CREATE (" + id + ":" + tokens[2] + "{title:'" +  backup + "'})";
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
		}
		});

}, function(error) {
	console.log(error);
	
	
});


/*
// Run a Cypher statement, reading the result in a streaming manner as records arrive:
session
  .run("CREATE (Nights:Documentary {title: '500 days of summer', released:2002, tagline: 'Not a love story'})")
  .subscribe({
    onNext: function (record) {
      console.log(record.get('name'));
    },
    onCompleted: function () {
      console.log("completed successfully");
      session.close();
      driver.close();
    },
    onError: function (error) {
      console.log(error);
      driver.close();
    }
  });
*/
/*
// or
// the Promise way, where the complete result is collected before we act on it:
session
  .run('MERGE (james:Person {name : {nameParam} }) RETURN james.name AS name', {nameParam: 'James'})
  .then(function (result) {
    result.records.forEach(function (record) {
      console.log(record.get('name'));
    });
    session.close();
  })
  .catch(function (error) {
    console.log(error);
  });
*/

// Close the driver when application exits.
// This closes all used network connections.
