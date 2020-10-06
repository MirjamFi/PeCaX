var pecaxdb = {
	createdb(db, collection_name){
		return db.get().then(()=> {
			// Collections are where you keep your actual data
			var collections = db.listCollections().then(res => {return res});
			return collections.then(res => {
				if(res.length == 0){
					var collection = db.collection(collection_name);
					collection.create().then(
					()=> {console.log("Collection created ("+collection_name+")."); return false},
					err => console.error('Failed to create collection:', err))
				}
				else{
					for(let col of res){
						if(col.name == collection_name){
							var collection = db.collection(collection_name);
							return db.query({
							  query: "FOR d IN @@c RETURN d._key", 
							  bindVars: { "@c": collection_name},
							})
							.then(function (cursor) {
							    return cursor._result
							})
						}
						else{
							var collection = db.collection(collection_name);
							collection.create().then(
							()=> {console.log("Collection created ("+collection_name+")."); return false},
							err => console.error('Failed to create collection:', err))
						}
					}
				}
			});
		})			
	},
	enterdb(database, collection_name, assembly){
		var db = database.useDatabase('pecax');
		return db.get().then(
			()=> {
			// Collections are where you keep your actual data
				var collection = db.collection(collection_name);
				return saveDoc(collection, assembly)
			},
			error=> console.error("Error connecting to database: " + error)
			);
	},
	updateEntry(database, collection_name, jobid, driveruuid){
		console.log(driveruuid)
		// creating a new database called database_name if it does not exist &
		// Switching to the new database

		var db = database.useDatabase('pecax');
		return db.get().then(
			()=> {
				// Collections are where you keep your actual data
				var collection = db.collection(collection_name);

				// Creating a collection if it does not exist
				collection.exists().then(() => {
					collection.document(jobid+'.vcf').then(doc => {
						collection.update(doc, {driveruuid:driveruuid});
						// printDoc(collection, doc);
					})
				});},
				error=> console.error("Error connecting to database: " + error)
			);
	},
	addJson(database, collection_name, idkey, json, assembly){
		// creating a new database called database_name if it does not exist &
		// Switching to the new database
		var db = database.useDatabase('pecax');
		return db.get().then(
			()=> {
			// Collections are where you keep your actual data
			var collection = db.collection(collection_name);

				collection.document(idkey).then(doc => {
					// printDoc(collection, doc);
					collection.update(doc, {json_file:json});
					// printDoc(collection, doc);
				})
				
			},
			error=> console.error("Error connecting to database: " + error)
		)
	},
	getJsonFromJobID(db, aqlQuery, collection_name, jobid){
		jobid = jobid + '.vcf';
		// creating a new database called database_name if it does not exist &
		// Switching to the new database

		var db = db.useDatabase('pecax');
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
	},
	deleteDoc(db, jobid, collection_name){
		db = db.useDatabase('pecax');
		var collection = db.collection(collection_name);
		// Removing the document
		collection.remove(jobid+'.vcf').then(
		  () => console.log('Document removed'),
		  err => console.error('Failed to remove document', err)
		);
	}
}

function saveDoc(collection, assembly){
	// save document if it does not exist
	return collection.list('_key').then(keys => {
		var doc = {
		  _key: keys.length + '.vcf',
		  assembly: assembly,
		  json_file: {},
		  driveruuid:""
		};
		// creating a document
		return collection.save(doc).then(
		  meta => { return ["new", doc._key]},
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