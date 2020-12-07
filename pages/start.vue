<style type="text/css">
  .v-data-table-header th {
    white-space: nowrap;
  }
  .first{
    background: #fbb4ae !important;
  }
  .second {
     background: #b3cde3 !important;
  }
  .third {
     background: #ccebc5 !important;
  }
  .fourth {
     background: #decbe4 !important;
  }
  .fifth {
     background: #fed9a6 !important;
  }
</style>
<template>
	<div>
    	<div class="topnav" id ="nav">
		    <div class="topnav-centered">
		      <a class="page-link active border-0 border-dark" href="/"><font face="verdana">PeCaX</font></a>
		    </div>
		    <div class="dropdown topnav-left" id="navAbout">  
		      <button class="dropbtn"><b-icon data-html2canvas-ignore="true" icon="list" class="h3"></b-icon>
				        <div class="dropdown-content">
				          <a class="page-link" href="/profile"><font face="verdana">My Jobs</font></a>
				          <a class="page-link" href="/about" ><font face="verdana">About</font></a>
			          	  <a class="page-link" href="/documentation"><font face="verdana">Documentation</font></a>
			          	  <a class="page-link" href="/contact"><font face="verdana">Contact</font></a>
			          	</div>
		      </button> 
		    </div>
		</div>
	 	<!-- <div style="border-bottom: thin solid #BDBDBD; margin-bottom: 20px; padding-bottom: 10px; font-size: 16px; font-weight: 500">
	 		Personalized Cancer and Network Explorer (PeCax) is a tool for identifying patient specific cancer mechanisms by providing a complete mutational profile from variants to networks. It employs ClinVAP to perform clinical variant annotation which focuses on processing, filtering and prioritization of the variants to find the disrupted genes that are involved in carcinogenesis and to identify actionable variants from the mutational landscape of a patient. In addition it creates networks showing the connections between the driver genes and the genes in their neighbourhood and automatically performs pathway enrichment analysis using pathway resources (SBML4j). Its interactive visualisation (BioGraphVisart) supports easy network exploration and patient similarity (node overlap) and a merged network graph of two patient-specific networks can be calculated.
	 	</div> -->
	  	<div class="row">
		  	<div class="column" >
		  		<v-card text class="rounded-card"  style="background-color:#DCE3FF; color:#000000" >
		  		<v-card-title><font face="verdana">ClinVAP</font></v-card-title>
		  		<v-card-text class="text-center">Extract information from simple somatic mutations (SNVs) of a patient given in VCF files and create a structured clinical report by annotating, prioritizing and filtering the genomic variants. The report is designed to provide assistance in making therapeutic decisions by equipping them with the molecular mechanisms initiating carcinogenesis and actionable genes.</v-card-text>
		  		<div class="text-center" id='vcfbutn'>
		  			<table style="display: inline-block;margin: 0 auto;">
		  				<tr>
		  					<td>
		  						VCF
		  					</td>
		  					<td>
		  						<input type="file" accept=".vcf"id="vcffile" ref="vcffile" style="width: 300px; background-color: #EDF1FF"/>
		  					</td>
		  				</tr>
		  				<tr>
		  					<td title="Select the assembly according to the human reference genome that was used in mapping of the NGS-pipeline. If you do not know it, it might be noted in the vcf-file. Otherwise the default is GRCh37.">
		  						Assembly <b-icon data-html2canvas-ignore="true" icon="info-circle" ></b-icon> 
		  					</td>
		  					<td>
		  						<select name="assembly" size="1" ref="assembly" style="width: 10px; background-color: #EDF1FF">
									<option value="GRCh37">GRCh37</option>
									<option value="GRCh38">GRCh38</option>
								</select>
		  					</td>
		  				</tr>
		  				<tr>
		  					<td>
		  						CNV (optional)
		  					</td>
		  					<td>
		  						<input type="file" accept=".tsv"id="file" ref="cnvfile" style="width: 300px;background-color: #EDF1FF"/>
		  					</td>
		  				</tr>
		  				<tr>
		  					<td>
		  						Diagnosis - ICD10 (optional)
		  					</td>
		  					<td>
		  					<autocomplete-dropdown
							  id="autocomplete-dropdown"
							  :options="icd10codes"
							  v-model="selectedICD10"
							  placeholder="ICD10 code"
							></autocomplete-dropdown>
							</td>
		  				</tr>
		  				<tr>
		  					<td >
		  						Diagnosis based filtering option
		  					</td>
		  					<td>
		  						<select name="diagnosisfilter" size="1" ref="diagnosisfilter" style="width: 10px;background-color: #EDF1FF">
									<option value="sort">sort</option>
									<option value="filter">filter</option>
									<option value="prioritize,filter,sort">prioritize, filter, sort</option>
								</select>
		  					</td>
		  					<td>
		  						<v-card-actions style="float: right;"><v-btn text style="color:#000000; float: right;" color="#DCE3FF"v-on:click="checkDB();">Submit</v-btn></v-card-actions>
		  					</td>
		  				</tr>
					</table>
				</div>
				</v-card>
				<p style="font-size: 10px; width:100%; float: left;">
					If you use ClinVAP reports for your analysis, please cite the following article:<br>
					Sürün, B., Schärfe, C.P., Divine, M.R., Heinrich, J., Toussaint, N.C., Zimmermann, L., Beha, J. and Kohlbacher, O., 2020. ClinVAP: a reporting strategy from variants to therapeutic options. Bioinformatics, 36(7), pp.2316-2317. <a href="https://doi.org/10.1093/bioinformatics/btz924">https://doi.org/10.1093/bioinformatics/btz924</a></p>
			</div>
			<div class="column">
			  	<v-card text class="rounded-card"  style="background-color:#DCE3FF; color:#000000" >
			  		<v-card-title><font face="verdana">Personalized Cancer and Network Exploration</font></v-card-title>
				  	<v-card-text class="text-center">Display report generated by ClinVAP as interactive table, generate the interaction network of driver genes containing targeting drugs with SBML4j and explore it interactively with BioGraphVisart.</v-card-text>
					<div class="text-center" id="jsonbtn">
						<table style="display: inline-block;margin: 0 auto;">
							<tr>
								<td>
				        			<input type="file" accept=".json"id="file" ref="jsonfile" style="width: 250px; background-color: #EDF1FF"/>
								</td>
								<td>
									<p><input type="checkbox" id="checkbox" v-model="cnvjson" color="#EDF1FF" style="color:#EDF1FF"><label for="checkbox">CNV</label></p>
								</td>
								<td>
									<v-card-actions><v-btn text style="color:#000000" color="#DCE3FF"v-on:click="showJSON();">Submit .JSON</v-btn></v-card-actions>
								</td>
							</tr>
							<tr>
								<td>
									<input v-show="allowJobId" type="text" name="vcfID" ref="jobid" placeholder="Job ID" style="width: 250px;background-color: #EDF1FF"/>
								</td>
								<td></td>
								<td>
									<v-card-actions><v-btn v-show="allowJobId" text style="color:#000000" color="#DCE3FF"v-on:click="getJsonFromJobID();">Submit Job ID</v-btn></v-card-actions>
								</td>
							</tr>
						</table>   
				    </div>
				</v-card>
			</div>
		</div>
  		<br><br><br>
	  	<footer>
	      <div class="footerIndex" style="width: 70%">
	          <a class="page-link border-0 border-dark" href="/imprint/">Imprint</a>
	          <a class="page-link border-0 border-dark" href="/datenschutzerklarung/" aria-current="page">Datenschutzerklärung</a>   
	          <p style="color:grey;"><b>Disclaimer</b> The report created by ClinVAP is intended as a hypothesis generating framework and thus for research use only, and not for diagnostic or clinical purposes. Information provided in the report does not replace a physician's medical judgment and usage is entirely at your own risk. The providers of this resource shall in no event be liable for any direct, indirect, incidental, consequential, or exemplary damages.</p>
	      </div> 
		</footer>
	</div>
</template>


<script>
  import axios from "axios";
  import html2pdf from 'html2pdf.js';
  import pecaxdb from '../src/db';
  import arangodb from 'arangojs';
  import AutocompleteDropdown from '@/components/AutocompleteDropdown'
  import icd10codestxt from 'raw-loader!../static/icd10cm_codes_2020.txt'

  	export default {
	    head: {
	      title: 'PeCax'
	    },
	    components: {
    		'autocomplete-dropdown': AutocompleteDropdown
	    },
	    data (){
	      return {    
	        vcffile:"",
	        cnvfile:"",
	        assembly:"",
	        status:"",
	        jobid:"",
	        filename:"",
	        username:'',
	        allowJobId:true,
		    icd10codes:{},
		    selectedICD10:'',
		    filter:'',
		    cnvjson:false
	      }
	    },
	    methods: {
		    showJSON(){
		    	// json fiel is uploaded
	    		var file = this.$refs.jsonfile.files[0]; // FileList object
		        if(!file){
		        	alert("Please give a .json-file generated by ClinVAP.")
		        	return
		        }
		        localStorage.setItem("cnvjson", this.cnvjson)
		        var reader = new FileReader();

		        // Closure to capture the file information.
		        reader.onload = function (e) {
		          localStorage.setItem("json", e.target.result);
		          var url = '/results?username='+localStorage.getItem("username")+'&json=true' 
			      document.location.href = url;
		        }
		        reader.readAsText(file);
		    },
		    checkDB(){
		    	this.username = localStorage.getItem("username")
		    	var assembly = pecaxdb.enterdb(new arangodb.Database('/db/'), this.username, this.$refs.assembly.value)
		    		.then(res => {return res});
		    	assembly.then(res => {
		    		var as = res[0]; 
		    		this.jobid = res[1];
		    		var ids = localStorage.getItem("jobids");
		    		if(ids == "undefined"){
		    			ids = "";
		    		}
					localStorage.setItem("jobids", ids+","+this.jobid)
		    		this.assembly = this.$refs.assembly.value
		    		this.vcffile = new File([this.$refs.vcffile.files[0]], this.username+'_'+this.jobid+'.vcf');
		    		this.filename = this.$refs.vcffile.files[0].name;
		    		this.filter = this.$refs.diagnosisfilter.value;
		    		if(this.$refs.cnvfile.files.length > 0){
		    			this.cnvfile = new File([this.$refs.cnvfile.files[0]], this.username+'_'+this.jobid+'.tsv');
		    			var cnvfileavailable = true;
		    		}
		    		else{
		    			this.cnvfile = new File([""], "")
		    			var cnvfileavailable = false;
		    		}
		    		this.analyzeVCF(this.vcffile, this.assembly, this.cnvfile, cnvfileavailable, this.jobid, this.username, this.selectedICD10, this.filter)
		    	}) 	
		    },
		    analyzeVCF(file, assemblyparam, cnvfile, cnvfileavailable, jobid, username, selectedICD10, filter){
		    	localStorage.setItem("assembly", assemblyparam);
		    	localStorage.setItem("username", username);
		    	localStorage.setItem("jobid", jobid);
		    	localStorage.setItem("cnvfileavailable", cnvfileavailable)
		    	localStorage.setItem("diagnosis", selectedICD10)
		    	localStorage.setItem("filter", filter)
		    	var formData = new FormData();
		    	formData.append("vcf", file);
		    	formData.append("assembly", assemblyparam)
		    	formData.append("cnv", cnvfile)
		    	formData.append("icd10", selectedICD10)
		    	formData.append("filter", filter)
				axios.post('/clinvap/upload-input', formData, {
				    headers: {
				      'Content-Type': 'multipart/form-data'
				    }})
				.then(response => {
					console.log(response);
				  })
				  .catch(function (error) {
				    console.log(error);
				  });
				  setTimeout(function(scope){
				  	var url = '/results?username='+username+'&jobid=' + encodeURIComponent(jobid)
				        +'&assembly='+encodeURIComponent(assemblyparam)
				    	document.location.href = url;}, 1000, this);
		    },
		    getJsonFromJobID(){
		    	localStorage.setItem("jobid", this.$refs.jobid.value);
	          	var url = '/results?username='+localStorage.getItem("username")+'&jobid='+this.$refs.jobid.value
		      	document.location.href = url;
		    }
	  	},
	  	created(){
	  		var icd10codeslist = icd10codestxt.split("\n")
	  		for(let code of icd10codeslist){
	  			let codeID = code.split(" ")[0]
	  			this.icd10codes[code] = codeID
	  		}
	  		if(localStorage.getItem("jobids") == "undefined" || localStorage.getItem("jobids").length == 0){
	  			this.allowJobId = false;
	  		}
	  	}
	}
</script>
