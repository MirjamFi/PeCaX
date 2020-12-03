<template>
  	<v-layout justify-center align-center width=90%>
    	<v-flex xs12 sm8 md12>
    		<div class="topnav" id ="nav">
			    <div class="topnav-centered">
			      <a class="page-link active border-0 border-dark" href="/"><font face="verdana">PeCaX</font></a>
			    </div>
			    <div class="dropdown topnav-left" id="navAbout">  
			      <button class="dropbtn"><b-icon data-html2canvas-ignore="true" icon="list" class="h3"></b-icon>
			        <div class="dropdown-content">
			          <a class="page-link" href="/about" ><font face="verdana">About</font></a>
			          <a class="page-link" href="/documentation"><font face="verdana">Documentation</font></a>
			          <a class="page-link" href="/contact"><font face="verdana">Contact</font></a>
			        </div>
			      </button> 
			    </div>
			</div>
    		<div class="row">
	    		<div style="width: 30%; margin-left: 5%">
	 				<img src="/landingpage_image.svg" style="margin: auto;">
	 			</div>
	    		<div style="margin-bottom: 20px; padding-bottom: 10px; padding-top:5%;font-size: 16px; font-weight: 500; width: 59%; margin-right: 5%">
	    			<v-card text class="rounded-card"  style="background-color:#DCE3FF; color:#000000" >
	    				<v-card-text color="black">
	    				Personalized Cancer and Network Explorer (PeCax) is a tool for identifying patient specific cancer mechanisms by providing a complete mutational profile from variants to networks. It employs ClinVAP to perform clinical variant annotation which focuses on processing, filtering and prioritization of the variants to find the disrupted genes that are involved in carcinogenesis and to identify actionable variants from the mutational landscape of a patient. In addition it creates networks showing the connections between the driver genes and the genes in their neighbourhood and automatically performs pathway enrichment analysis using pathway resources (SBML4j). Its interactive visualisation (BioGraphVisart) supports easy network exploration and patient similarity (node overlap) and a merged network graph of two patient-specific networks can be calculated.
	    				</v-card-text>
	    			</v-card>
	    			<div class="text-center"style="margin-bottom: 20px; margin-top: 10%; padding-bottom: 10px; font-size: 16px; font-weight: 500; width: 60%; margin-left: 25%; ">
	    				<v-card text class="rounded-card"  style="background-color:#DCE3FF; color:#000000" >
	    					<v-card-text color="black">
	    						Give a username to attach your jobs to it and revisit them later.</v-card-text>
 							<input name="username" ref="username" placeholder="Username" style="width: 250px; color:#000000; font-size: 18px; background-color: #EDF1FF"/>
 				 			<v-card-actions style="float: right;">
 				  				<v-btn flat style="color:#000000" color="#DCE3FF"v-on:click="loggedIn();">Start</v-btn>
<!-- 			         <button class= 'butn' v-on:click="
			          loggedIn();
			          ">Start</button> -->
			      			</v-card-actions>
			      		</v-card>
	 				</div>
	 			</div>
 			</div>
 		<div style="border-bottom: thin solid #BDBDBD"></div>
 			
 			<div style="border-bottom: thin solid #BDBDBD"></div>
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
	      title: 'PeCaX'
	    },
	    data (){
	      return {
	      	database:''
	      }
	  },
	  methods: {
	  	loggedIn(){
	  		if(this.$refs.username.value != ""){
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
	},
	created(){
		localStorage.clear();
	}
}

</script>