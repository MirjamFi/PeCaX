<template>
  	<v-layout justify-center align-center width=90%>
    	<v-flex xs12 sm8 md12>
    		<div style="border-bottom: thin solid #BDBDBD; margin-bottom: 20px; padding-bottom: 10px; font-size: 16px; font-weight: 500">
 				Personalized Cancer and Network Explorer (PeCax) is a tool for identifying patient specific cancer mechanisms by providing a complete mutational profile from variants to networks. It employs ClinVAP to perform clinical variant annotation which focuses on processing, filtering and prioritization of the variants to find the disrupted genes that are involved in carcinogenesis and to identify actionable variants from the mutational landscape of a patient. In addition it creates networks showing the connections between the driver genes and the genes in their neighbourhood and automatically performs pathway enrichment analysis using pathway resources (SBML4j). Its interactive visualisation (BioGraphVisart) supports easy network exploration and patient similarity (node overlap) and a merged network graph of two patient-specific networks can be calculated.

 			</div>
 			<div>
 				 <input type="text" name="username" ref="username" placeholder="Username" style="width: 250px"/>
			         <button class= 'butn' v-on:click="
			          loggedIn();
			          ">Log In</button>
 			</div>
			<footer>
		      	<div class="footerIndex">
		          	<a class="page-link border-0 border-dark" href="/imprint/">Imprint</a>
		          	<a class="page-link border-0 border-dark" href="/datenschutzerklarung/" aria-current="page">Datenschutzerklärung</a>   
		      	</div>
		  	</footer>
    	</v-flex>
	</v-layout>
</template>

<script>
	import axios from "axios";
	import pecaxdb from '../src/db';
	import arangodb from 'arangojs';

	export default {
		head: {
	      title: 'PeCax'
	    },
	    data (){
	      return {
	      	database:''
	      }
	  },
	  methods: {
	  	loggedIn(){
	  		if(!localStorage.getItem("username")){
	  			document.getElementById('new').style.visibility = "hidden"
	  		}
		  	// creating a new database called database_name if it does not exist &
			// Switching to the new database
			var db = new arangodb.Database('/db/');
			db.listDatabases().then((names) => {
				if (names.indexOf('pecax') > -1){
					db.useDatabase('pecax');
					db.get().then(
					()=> {console.log("Using database " + 'pecax')
							var registered = pecaxdb.createdb(db, this.$refs.username.value)
					    	.then((res)=> {return res;});
						    registered.then(res => {	
						  			localStorage.setItem("username", this.$refs.username.value);
					    			localStorage.setItem("jobids", res)
									var url = '/start?user='+this.$refs.username.value
									setTimeout(function(scope){
						    			document.location.href = url;}, 1000, this);
						    })
						},
						error=> console.error("Error connecting to database: " + error)
					);
				} else {
					db.createDatabase('pecax').then(
						()=> {console.log("Database created successfully: "+ 'pecax')
							db.useDatabase('pecax');
							db.get().then(
							()=> {console.log("Using database " + 'pecax')
								var registered = pecaxdb.createdb(db, this.$refs.username.value)
					    		.then((res)=> {return res;});
						    	registered.then(res => {
						  			localStorage.setItem("username", this.$refs.username.value);
					    			localStorage.setItem("jobids", res)
									var url = '/start?user='+this.$refs.username.value
									setTimeout(function(scope){
						    			document.location.href = url;}, 1000, this);
					    		})
							},
							error=> console.error("Error connecting to database: " + error)
						);
						},
						error=> console.error("Error creating database: " + error)
					);
				}
			})
		}
	}
}

</script>