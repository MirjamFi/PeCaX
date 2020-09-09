var pecaxdb = {
	createdb(Database, collection_name, assembly){
		// creating a new instance of Database using a connection string:
		var db = new Database('/db/');

		// creating a new database called database_name if it does not exist &
		// Switching to the new database

		var database_name = 'pecax'

		return db.listDatabases().then((names) => {
			if (names.indexOf(database_name) > -1){
				db.useDatabase(database_name)
				return db.get().then(
					()=> {
					// Collections are where you keep your actual data
					var collection = db.collection(collection_name);

					// Creating a collection if it does not exist
					return collection.exists().then(res => {
						if(!res){
							return collection.create().then(
							  () => { return saveDoc(collection, assembly)},
							  err => console.error('Failed to create collection:', err)
							);
						}
						else{
							return saveDoc(collection, assembly)
						}
					});
						},
					error=> console.error("Error connecting to database: " + error)
				);
			} else {
				return db.createDatabase(database_name).then(
					()=> {
						return db.get().then(
							()=> {
							// Collections are where you keep your actual data
							var collection = db.collection(collection_name);

							return collection.create().then(
							  () => {return saveDoc(collection, assembly)},
							  err => console.error('Failed to create collection:', err)
							);
						},
							error=> console.error("Error connecting to database: " + error)
						);},
					error=> console.error("Error creating database: " + error)
				);
			}
		})
	},
	updateEntry(Database, database_name, collection_name, jobid, uuid){
		console.log("uuid: ", uuid)
		// creating a new instance of Database using a connection string:
		var db = new Database('/db/');

		// creating a new database called database_name if it does not exist &
		// Switching to the new database

		db.listDatabases().then((names) => {
			if (names.indexOf(database_name) > -1){
				db.useDatabase(database_name);
			} else {
				return "No database found."
			}
		}).then (() => {
			db.get().then(
				()=> {
				// Collections are where you keep your actual data
				var collection = db.collection(collection_name);

				// Creating a collection if it does not exist
				collection.exists().then(() => {
					collection.document(jobid+'.vcf').then(doc => {
						console.log("doc.uuids: ", doc.uuids)
						var uuidslist = doc.uuids
						uuidslist.push(uuid)
						console.log(uuidslist)
						collection.update(doc, {uuids:uuidslist});
						printDoc(collection, doc);
					})
				});},
				error=> console.error("Error connecting to database: " + error)
			);
		});
	},
	addJson(Database, database_name, collection_name, idkey, json, assembly){
		// creating a new instance of Database using a connection string:
		var db = new Database('/db/');

		// creating a new database called database_name if it does not exist &
		// Switching to the new database

		db.listDatabases().then((names) => {
			if (names.indexOf(database_name) > -1){
				db.useDatabase(database_name);
			} else {
				return "No database found."
			}
		}).then (() => {
			db.get().then(
				()=> {
				// Collections are where you keep your actual data
				var collection = db.collection(collection_name);

				// Creating a collection if it does not exist
				collection.exists().then(exists => {
					console.log(exists)
					var doc = {
					  _key: idkey,
					  assembly: assembly,
					  json_file: json,
					  uuids:[]
					};
					if(!exists){
						collection.create().then(
							collection.save(doc).then(
							  	meta => {return ["new", doc._key]},
							  	err => console.error('Failed to save document:', err)
							)
						)
					}
					else{
						collection.save(doc).then(
						  	meta => {return ["new", doc._key]},
						  	err => console.error('Failed to save document:', err)
						)
					}
					// var doc_old = collection.document(idkey).then(doc => {
					// 	collection.update(doc, { _key: idkey, assembly: assembly, json_file:json});
					// 	// printDoc(collection, doc);
					// })

				});},
				error=> console.error("Error connecting to database: " + error)
			);
		});
	},
	getJsonFromJobID(Database, aqlQuery, database_name, collection_name, jobid){
		jobid = jobid + '.vcf';
		// creating a new instance of Database using a connection string:
		var db = new Database('/db/');

		// creating a new database called database_name if it does not exist &
		// Switching to the new database

		return db.listDatabases().then((names) => {
			if (names.indexOf(database_name) > -1){
				db.useDatabase(database_name);
			} else {
				return "No database found."
			}
		}).then (() => {
			return db.get().then(
				()=> {
				// Collections are where you keep your actual data
				var collection = db.collection(collection_name);

				// Creating a collection if it does not exist
				return collection.exists().then(() => {
						return db.query({
						  query: "FOR d IN @@c FILTER d._key == @jobid RETURN d", 
						  bindVars: { "@c": collection_name, "jobid": jobid },
						})
						.then(function (cursor) {
						    return cursor
						})
				});},
				error=> console.error("Error connecting to database: " + error)
			);
		});	
	}
}

function saveDoc(collection, assembly){
	// save document if it does not exist
	return collection.list('_key').then(keys => {
		var doc = {
		  _key: keys.length + '.vcf',
		  assembly: assembly,
		  json_file: {},
		  uuids:[]
		};
		// creating a document
		return collection.save(doc).then(
		  meta => {return ["new", doc._key]},
		  err => console.error('Failed to save document:', err)
		);
	});
}

function printDoc(collection, doc){
	// fetch and see complete document
	collection.document(doc._key).then(
	  doc => console.log('Document:', JSON.stringify(doc, null, 2)),
	  err => console.error('Failed to fetch document:', err)
	);
}

// function selectAction(modal){
// 	modal.classList.toggle('activeModal');
// }



// // // updare document in place
// // collection.update(doc._key, {d: 'qux'}).then(
// //   meta => console.log('Document updated:', meta._rev),
// //   err => console.error('Failed to update document:', err)
// // );



// // Removing the document
// collection.remove('firstDocument').then(
//   () => console.log('Document removed'),
//   err => console.error('Failed to remove document', err)
// );
 
// // fetch and see complete document
// collection.document('firstDocument').then(
//   doc => console.log('Document:', JSON.stringify(doc, null, 2)),
//   err => console.error('Failed to fetch document:', err.message));

// // more example data
// docs = [];
// for (i = 0; i < 100; i++) {
//   docs.push({_key: `doc${i + 1}`, value: i});
// }

// // import method 
// collection.import(docs).then(
//   result => console.log('Import complete:', result),
//   err => console.error('Import failed:', err)
// );

// // all query
// collection.all().then(
//   cursor => cursor.map(doc => doc._key)
// ).then(
//   keys => console.log('All keys:', keys.join(', ')),
//   err => console.error('Failed to fetch all documents:', err)
// );

// // sort
// db.query('FOR d IN firstCollection SORT d.value ASC RETURN d._key').then(
//   cursor => cursor.all()
// ).then(
//   keys => console.log('All keys:', keys.join(', ')),
//   err => console.error('Failed to execute query:', err)
// );
export default pecaxdb