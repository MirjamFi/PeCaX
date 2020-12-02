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
	<v-container fluid style="margin: 0px; padding: 0px; width: 100%">
		<v-layout>
			<v-flex>
				<div class="topnav" id ="nav">
				    <div class="topnav-centered">
				      <a class="page-link active border-0 border-dark" href="/">PeCaX</a>
				    </div>
				    <div class="dropdown topnav-left" id="navAbout">  
				      <button class="dropbtn"><b-icon data-html2canvas-ignore="true" icon="list" class="h3"></b-icon>
				        <div class="dropdown-content">
				          <a class="page-link" href="/profile">My Jobs</a>
				          <a class="page-link" href="/about" >About </a>
				          <a class="page-link" href="/documentation">Documentation</a>
				          <a class="page-link" href="/contact">Contact</a>
				        </div>
				      </button> 
				    </div>
				    <div class="topnav-right">
				    	<button style="margin-top: 2vw; margin-right: 10px">
				    		<a href="/"><b-icon icon="file-earmark-plus" class="h3" variant="dark"></b-icon></a>
						</button>
				      <p class="dropdown">
				        <button class="dropbtn"><b-icon icon="download" class="h3"></b-icon>
				              <div class="dropdown-content">
				            <a class="page-link pdfdownload"  @click="exportToPDF_all()">PDF</a>
				            <a class="page-link jsondownload" @click="download_json()">JSON</a>
				            <a class="page-link" @click="download_Networks()" >Networks</a>
				          </div>
				        </button>
				      </p>			      
					</div>
				</div>
				<div >
					<!-- <h1>Clinical Variant Annotation Pipeline</h1> -->
					<p v-show="showStatus" style="border:3px; border-style:solid; border-color:#BDBDBD; padding: 1em;" class="text-center" >Job ID: {{this.jobid}} <br> Status of analysis with ClinVAP: {{this.status}}
					<p v-show="showNetwork" style="border:3px; border-style:solid; border-color:#BDBDBD; padding: 1em;" class="text-center" >Calculating networks.</p> 
					</p>
					<div v-show="showNetwork || showStatus"class="loader" ref="loader1"></div>
				</div>
			    <div  data-app v-show="showTable" ref="all" style="width:100%">
			    	<div v-if="icd10!=''"ref="diagnosisinfo" style="margin-right: 10px">
			    			<p style="font-size:16px">
			    				<b>Diagnosis: </b>
			    				{{icd10}}<br>
			    				<b>Filter</b>
			    				{{diagnosisfilter}}
			    				
			    			</p>
			    	</div>
			    	<div v-if="!cnvjson"ref = "content_driver_table" id="driver_table_content" class="row" style="margin-bottom: 1.5vw; margin-left: 10px;">
			    		<div id="tooltipdriver" style="width:100%">
			    			<v-tooltip bottom attach="#tooltipdriver">
       							<template v-slot:activator="{ on, attrs }">
       						
						        	<b-button
							          :class="visibleDrivers ? null : 'collapsed'"
							          :aria-expanded="visibleDrivers ? 'true' : 'false'"
							          aria-controls="collapse-4"
							          @click="visibleDrivers = !visibleDrivers"
							          v-bind:style="{ background: 'green', color:'white' }" 
							          block variant="primary"
							          
							         >
					          			<Strong class="text-center" style="color: white">Somatic Mutations in Known Driver Genes </Strong><b-icon data-html2canvas-ignore="true" icon="info-circle" style="margin-left: 10px" v-bind="attrs" v-on="on"></b-icon> <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrows-expand" v-if="visibleDrivers"></b-icon> <b-icon class="float-right" icon="arrows-collapse" v-else></b-icon>
					        		</b-button>
					        	
					        	</template>
		       					<span>List of cancer driver genes along with the mutations observed in the patient. Consequence column provides the predicted effects of the variants on the protein sequence. Tumor type column gives the list of cohorts in which the gene is identified as driver. VAF (variant allele frequency) column shows the proportion of the variant allele to the coverage of that loci. Reference column represents the driver gene sources that catalogued the corresponding gene as driver. Driver gene information is obtained from Vogelstein <em>et al.</em>, Uniprot, TSGene, IntoGen and COSMIC. </span>
		       				
      						</v-tooltip>
      					</div>
			       		<b-collapse id="collapse-4" v-model="visibleDrivers" :class="{column:visibleDrivergenes}">					             
							<b-card>
					            <table class="table table-hover">
					              <thead>
					                <tr data-html2canvas-ignore="true">
					                  <td>
						                    <v-text-field v-model="genes1" type="string" label="Gene" clearable></v-text-field>
						                    <button @click="sortMskdg('Gene')">
						                  		<b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirGene1 == 'asc'"></b-icon> 
						                  		<b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
						                  	</button>
					                  </td>
					                  <td>
					                    	<v-text-field v-model="mutations1" type="string" label="Mutation" clearable :disabled="!hidedriver_tableMutation"></v-text-field>
					                    	<button id="checkbox1" @click="hidedriver_tableMutation = !hidedriver_tableMutation" style="margin-right: 10px;">
							        			<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidedriver_tableMutation"></b-icon> 
							              		<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
							            	</button>
					                    	<button @click="sortMskdg('Mutation')" :disabled="!hidedriver_tableMutation"> 
					                    		<b-icon  data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirMut1 == 'asc'"></b-icon> 
					                  			<b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
					                    	</button>
					                  </td>
					                  <td>
					                    	<v-text-field v-model="consequence1" type="string" label="Consequence"clearable :disabled="!hidedriver_tableConsequence"></v-text-field>
					                    	<button id="checkbox2" @click="hidedriver_tableConsequence = !hidedriver_tableConsequence" style="margin-right: 10px;">
					        					<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidedriver_tableConsequence"></b-icon> 
					              				<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
					            			</button>
					            			<button @click="sortMskdg('Consequence')" :disabled="!hidedriver_tableConsequence">
					            				<b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirCons1 == 'asc'"></b-icon> 
					            				<b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
					            			</button>
					                  </td>
					                  <td>
					                    	<v-text-field v-model="driverType1" type="string" label="DriverType"clearable :disabled="!hidedriver_tableDriverType"></v-text-field>
					                    	<button id="checkbox3" @click="hidedriver_tableDriverType = !hidedriver_tableDriverType" style="margin-right: 10px;">
					        					<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidedriver_tableDriverType"></b-icon> 
					              				<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
					            			</button>
					            			<button @click="sortMskdg('Driver Type')" :disabled="!hidedriver_tableDriverType">
					            				<b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirDriverType1 == 'asc'"></b-icon> 
					            				<b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
					            			</button>
					                  </td>
					                  <td>
					                    	<v-text-field v-model="tumorType1" type="string" label="TumorType"clearable :disabled="!hidedriver_tableTumorType"  ></v-text-field>
					                    	<button id="checkbox4" @click="hidedriver_tableTumorType = !hidedriver_tableTumorType" style="margin-right: 10px;">
					        					<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidedriver_tableTumorType"></b-icon> 
					              				<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
					            			</button>
					            			<button @click="sortMskdg('Tumor Type')" :disabled="!hidedriver_tableTumorType">
					            				<b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirTumorType1 == 'asc'"></b-icon> 
					            				<b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
					            			</button>
					                  </td>
					                 <td>
					                    	<v-text-field v-model="vaf1" type="double" label="VAF" clearable :disabled="!hidedriver_tableVAF"></v-text-field>
					                    	<button id="checkbox5" @click="hidedriver_tableVAF = !hidedriver_tableVAF" style="margin-right: 10px;">
								        		<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidedriver_tableVAF"></b-icon> 
								              	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
								            </button>
								            <button @click="sortMskdg('VAF')" :disabled="!hidedriver_tableVAF">
								            	<b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirVAF1 == 'asc'"></b-icon> 
								            	<b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
								            </button>
					                  </td>
					                  <td>
					                    	<v-text-field v-model="reference1" type="string" label="References"clearable :disabled="!hidedriver_tableReferences" ></v-text-field>
					                    	<button id="checkbox6" @click="hidedriver_tableReferences = !hidedriver_tableReferences" style="margin-right: 10px;">
								        		<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidedriver_tableReferences"></b-icon> 
								              	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
								            </button>
								            <button @click="sortMskdg('References')" :disabled="!hidedriver_tableReferences" ><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirRef1 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></button>
					                  </td>
					                  <td><button class="downloadbutn float-right " @click="exportToPDF_driver_table()"><b-icon class="float-left" icon="download" style="margin-right: 3px"></b-icon></button></td>
					                </tr>
					                <tr>
					                  <!-- <th data-html2canvas-ignore="true">
					                    <label class="form-checkbox">
					                      <input type="checkbox" v-model="selectAll" @click="select(driver_table)">
					                      <i class="form-icon"></i>
					                    </label>
					                  </th> -->
					                  <th >Gene </th>
					                  <th v-show="hidedriver_tableMutation" >Mutation</th>
					                  <th v-show="hidedriver_tableConsequence">Consequence </th>
					                  <th v-show="hidedriver_tableDriverType">Driver Type</th>
					                  <th v-show="hidedriver_tableTumorType">Tumor Type </th>
					                  <th v-show="hidedriver_tableVAF">VAF</th>
					                  <th v-show="hidedriver_tableReferences">References</th>
					                </tr>
					              </thead>
					              <tbody>
					                <tr v-for="(item, index) in sortedMskdg" :key="item.gene" v-if="index < startRow + rowsPerPage && index >= startRow">
					                  <!-- <td class="text-xs-center" data-html2canvas-ignore="true">      
					                    <label class="form-checkbox">
					                        <input type="checkbox" :value="item.gene" v-model="checkedGenes">
					                        <i class="form-icon"></i>
					                    </label>
					                  </td> -->
					                  <td v-on:click.self="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}">
					                    {{ item.gene}}
					                   	<div v-if="item.network" class="dropdown_gene" data-html2canvas-ignore="true"><b-icon class="float-right dropbtn" icon="link"></b-icon>
						                    <div class="dropdown-content">
									            <a v-if = "item.eccode" class="page-link" :href="item.eccode" target="_blank">IntEnz</a>
									            <a v-if = "item.ensembl"class="page-link" :href="item.ensembl" target="_blank">Ensembl</a>
									            <a v-if = "item.hgnc" class="page-link" :href="item.hgnc" target="_blank">HGNC</a>
									            <!-- <a class="page-link" :href="item.omim">OMIM</a>
									            <a class="page-link" :href="item.entrez">Entrez</a> -->
									            <a v-if = "item.mdanderson"class="page-link" :href="item.mdanderson" target="_blank">MDAnderson</a>
									            <a v-if = "item.kegg"class="page-link" :href="item.kegg" target="_blank">KEGG</a>
									            <a v-if = "item.uniprot"class="page-link" :href="item.uniprot" target="_blank">UniProt</a>
								          	</div>
								        </div> 
					                  </td>
					                  <td v-show="hidedriver_tableMutation" v-on:click.self="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
					                    {{ item.one_letter_repr}}
					                  </td>
					                  <td v-show="hidedriver_tableConsequence" v-on:click.self="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
					                    {{ item.Consequence }}
					                  </td>	                  
					                  <td v-show="hidedriver_tableDriverType" v-on:click.self="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
					                    {{ item.driver_role}}
					                  </td>
					                  <td v-show="hidedriver_tableTumorType"  v-on:click.self="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class="text-xs-right ">
					                    <span> {{item.trunc}} 
					                    	<span class="hidden" v-bind:id="item.Overflow">{{item.remainder}}</span>
					                    </span>
					                    <a style="color: blue" v-if="item.remainder" v-bind:id="item.MoreLink" v-on:click="showMore(item)">More</a>
					                    <a style="color: blue" v-if="item.remainder" class="hidden" v-bind:id="item.LessLink" v-on:click="showLess(item)">Less</a>
					                  </td>
					                  <td v-show="hidedriver_tableVAF" v-on:click.self="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
					                    {{ item.vaf}}
					                  </td>	                  
					                  <td v-show="hidedriver_tableReferences" v-on:click.self="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
					                    {{ item.ref_map}}
					                  </td>
					                </tr>
					              </tbody>
					            </table>
				                   
				            	<div id="page-navigation" class="text-center" data-html2canvas-ignore="true">
					              <table>
					                <tr>
					                  <td>
					                    <select v-model="rowsPerPage" style="width: 10px">
					                      <option disabled value="">Rows per Page</option>
					                      <option>10</option>
					                      <option>20</option>
					                      <option>50</option>
					                    </select>
					                  </td>
					                  <td>{{startRow+1}}-{{rowsPerPage*currentPage}} out of {{sortedMskdg.length}}</td>
					                  <td><button @click=movePages(-1)><b-icon icon="chevron-left"></b-icon></button></td>
					                  
					                  <td><button class="float-right" @click=movePages(1)><b-icon icon="chevron-right"></b-icon></button></td>
					              </tr>
					            	</table>
				            	</div> 
				            	<div id="notepadDrivers">
									<textarea style="width: 70%"ref="driverNotes" placeholder="Notes">{{drivergenes_notes}}</textarea>
									<button class= 'butn' v-on:click="storeNotes('drivergenes');">Save</button>
									<p v-show="savedDrivergenesNotes"style="width: 50px" class="float-right">saved</p>
				            	</div>    	
				          	</b-card> 
				        </b-collapse>
				        <div v-if="visibleDrivers && visibleDrivergenes" class="embed-responsive embed-responsive-16by9 z-depth-1-half column">
							<iframe id="drivergenesVis" class="embed-responsive-item" src="http://localhost:3000/BioGraphVisart/drivergenes" allowfullscreen></iframe>
						</div>
				    </div> 
				    <div v-if="cnvjsonavailable" ref = "content_driver_table_cnv" id="driver_table_content_cnv" class="row" style="margin-bottom: 1.5vw; margin-left: 10px;">
			    		<div id="tooltipdriver_cnv" style="width:100%">
			    			<v-tooltip bottom attach="#tooltipdriver_cnv">
	       						<template v-slot:activator="{ on, attrs }">
	       						
							        <b-button
							          :class="visibleDrivers_cnv ? null : 'collapsed'"
							          :aria-expanded="visibleDrivers_cnv ? 'true' : 'false'"
							          aria-controls="collapse-4"
							          @click="visibleDrivers_cnv = !visibleDrivers_cnv"
							          v-bind:style="{ background: 'green', color:'white' }" 
							          block variant="primary"
							          
							         >
						          		<Strong class="text-center" style="color: white">CNV: Somatic Mutations in Known Driver Genes </Strong><b-icon data-html2canvas-ignore="true" icon="info-circle" style="margin-left: 10px" v-bind="attrs" v-on="on"></b-icon> <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrows-expand" v-if="visibleDrivers_cnv"></b-icon> <b-icon class="float-right" icon="arrows-collapse" v-else></b-icon>
						        	</b-button>					        	
						       	</template>
			       				<span>List of cancer driver genes along with the mutations observed in the patient. Consequence column provides the predicted effects of the variants on the protein sequence. Tumor type column gives the list of cohorts in which the gene is identified as driver. VAF (variant allele frequency) column shows the proportion of the variant allele to the coverage of that loci. Reference column represents the driver gene sources that catalogued the corresponding gene as driver. Driver gene information is obtained from Vogelstein <em>et al.</em>, Uniprot, TSGene, IntoGen and COSMIC. </span>		
      						</v-tooltip>
      					</div>
			       		<b-collapse id="collapse-4" v-model="visibleDrivers_cnv" :class="{column:visibleDrivergenes_cnv}">					      
							<b-card>
					            <table class="table table-hover">
					              <thead>
					                <tr data-html2canvas-ignore="true">
					                  <td>
						                    <v-text-field v-model="genes1_cnv" type="string" label="Gene" clearable></v-text-field>
						                    <button @click="sortMskdg_cnv('Gene')">
						                  		<b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirGene1_cnv == 'asc'"></b-icon> 
						                  		<b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
						                  	</button>
					                  </td>
					                  <td>
					                    	<v-text-field v-model="type1_cnv" type="string" label="Type" clearable :disabled="!hidedriver_tableType_cnv"></v-text-field>
					                    	<button id="checkbox1_cnv" @click="hidedriver_tableType_cnv = !hidedriver_tableType_cnv" style="margin-right: 10px;">
							        			<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidedriver_tableType_cnv"></b-icon> 
							              		<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
							            	</button>
					                    	<button @click="sortMskdg_cnv('Type')" :disabled="!hidedriver_tableType_cnv"> 
					                    		<b-icon  data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirType1_cnv == 'asc'"></b-icon> 
					                  			<b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
					                    	</button>
					                  </td>
					                  <!-- <td>
					                    	<v-text-field v-model="copy1_cnv" type="string" label="CopyNumber"clearable :disabled="!hidedriver_tableCopy_cnv"></v-text-field>
					                    	<button id="checkbox2_cnv" @click="hidedriver_tableCopy_cnv = !hidedriver_tableCopy_cnv" style="margin-right: 10px;">
					        					<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidedriver_tableCopy_cnv"></b-icon> 
					              				<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
					            			</button>
					            			<button @click="sortMskdg_cnv('Copy Number')" :disabled="!hidedriver_tableCopy_cnv">
					            				<b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirCopy1_cnv == 'asc'"></b-icon> 
					            				<b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
					            			</button>
					                  </td> -->
					                  <!-- <td>
					                    	<v-text-field v-model="effect1_cnv" type="string" label="DriverType"clearable :disabled="!hidedriver_tableEffect_cnv"></v-text-field>
					                    	<button id="checkbox3_cnv" @click="hidedriver_tableEffect_cnv = !hidedriver_tableEffect_cnv" style="margin-right: 10px;">
					        					<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidedriver_tableEffect_cnv"></b-icon> 
					              				<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
					            			</button>
					            			<button @click="sortMskdg_cnv('Effect')" :disabled="!hidedriver_tableEffect_cnv">
					            				<b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirEffect1_cnv == 'asc'"></b-icon> 
					            				<b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
					            			</button>
					                  </td> -->
					                  <td>
					                    	<v-text-field v-model="driverType1_cnv" type="string" label="Driver Type"clearable :disabled="!hidedriver_tableDriverType_cnv"  ></v-text-field>
					                    	<button id="checkbox4_cnv" @click="hidedriver_tableDriverType_cnv = !hidedriver_tableDriverType_cnv" style="margin-right: 10px;">
					        					<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidedriver_tableDriverType_cnv"></b-icon> 
					              				<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
					            			</button>
					            			<button @click="sortMskdg_cnv('Driver Type')" :disabled="!hidedriver_tableDriverType_cnv">
					            				<b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirDriverType1_cnv == 'asc'"></b-icon> 
					            				<b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
					            			</button>
					                  </td>
					                 <td>
					                    	<v-text-field v-model="tumorList_cnv" type="double" label="Tumor List" clearable :disabled="!hidedriver_tableTumorList_cnv"></v-text-field>
					                    	<button id="checkbox5_cnv" @click="hidedriver_tableTumorList_cnv = !hidedriver_tableTumorList_cnv" style="margin-right: 10px;">
								        		<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidedriver_tableTumorList_cnv"></b-icon> 
								              	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
								            </button>
								            <button @click="sortMskdg_cnv('Tumor List')" :disabled="!hidedriver_tableTumorList_cnv">
								            	<b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirTumorList1_cnv == 'asc'"></b-icon> 
								            	<b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
								            </button>
					                  </td>
					                  <td>
					                    	<v-text-field v-model="reference1_cnv" type="string" label="References"clearable :disabled="!hidedriver_tableReferences_cnv" ></v-text-field>
					                    	<button id="checkbox6_cnv" @click="hidedriver_tableReferences_cnv = !hidedriver_tableReferences_cnv" style="margin-right: 10px;">
								        		<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidedriver_tableReferences_cnv"></b-icon> 
								              	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
								            </button>
								            <button @click="sortMskdg_cnv('References')" :disabled="!hidedriver_tableReferences_cnv" ><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirRef1_cnv == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></button>
					                  </td>
					                  <td><button class="downloadbutn float-right " @click="exportToPDF_driver_table_cnv()"><b-icon class="float-left" icon="download" style="margin-right: 3px"></b-icon></button></td>
					                </tr>
					                <tr>
					                  <th >Gene </th>
					                  <th v-show="hidedriver_tableType_cnv" >Type</th>
					                  <!-- <th v-show="hidedriver_tableCopy_cnv">Copy Number </th> -->
					                  <!-- <th v-show="hidedriver_tableEffect_cnv">Effect</th> -->
					                  <th v-show="hidedriver_tableDriverType_cnv">Driver Type </th>
					                  <th v-show="hidedriver_tableTumorList_cnv">Tumor List</th>
					                  <th v-show="hidedriver_tableReferences_cnv">References</th>
					                </tr>
					              </thead>
					              <tbody>
					                <tr v-for="(item, index) in sortedMskdg_cnv" :key="item.gene" v-if="index < startRow_cnv + rowsPerPage_cnv && index >= startRow_cnv">
					                  <td v-on:click.self="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}">
					                    {{ item.gene}}
					                   	<div v-if="item.network" class="dropdown_gene" data-html2canvas-ignore="true"><b-icon class="float-right dropbtn" icon="link"></b-icon>
						                    <div class="dropdown-content">
									            <a v-if = "item.eccode" class="page-link" :href="item.eccode" target="_blank">IntEnz</a>
									            <a v-if = "item.ensembl"class="page-link" :href="item.ensembl" target="_blank">Ensembl</a>
									            <a v-if = "item.hgnc" class="page-link" :href="item.hgnc" target="_blank">HGNC</a>
									            <!-- <a class="page-link" :href="item.omim">OMIM</a>
									            <a class="page-link" :href="item.entrez">Entrez</a> -->
									            <a v-if = "item.mdanderson"class="page-link" :href="item.mdanderson" target="_blank">MDAnderson</a>
									            <a v-if = "item.kegg"class="page-link" :href="item.kegg" target="_blank">KEGG</a>
									            <a v-if = "item.uniprot"class="page-link" :href="item.uniprot" target="_blank">UniProt</a>
								          	</div>
								        </div> 
					                  </td>
					                  <td v-show="hidedriver_tableType_cnv"  @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
					                    {{ item.type}}
					                  </td>
					                 <!--  <td v-show="hidedriver_tableCopy_cnv" v-on:click.self="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
					                    {{ item.copy_number }}
					                  </td>	    -->               
					                  <!-- <td v-show="hidedriver_tableEffect_cnv" v-on:click.self="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
					                    {{ item.effect}}
					                  </td> -->
					                  <td v-show="hidedriver_tableDriverType_cnv"  v-on:click.self="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class="text-xs-right ">
					                    {{item.driver_type}}
					                  </td>
					                  <td v-show="hidedriver_tableTumorList_cnv" v-on:click.self="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
					                    <span> {{item.trunc}} 
					                    	<span class="hidden" v-bind:id="item.Overflow">{{item.remainder}}</span>
					                    </span>
					                    <a style="color: blue" v-if="item.remainder" v-bind:id="item.MoreLink" v-on:click="showMore(item)">More</a>
					                    <a style="color: blue" v-if="item.remainder" class="hidden" v-bind:id="item.LessLink" v-on:click="showLess(item)">Less</a>
					                  </td>	                  
					                  <td v-show="hidedriver_tableReferences_cnv" v-on:click.self="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
					                    {{ item.ref_map}}
					                  </td>
					                </tr>
					              </tbody>
					            </table>
				                   
				            	<div id="page-navigation_cnv" class="text-center" data-html2canvas-ignore="true">
				              <table>
				                <tr>
				                  <td>
				                    <select v-model="rowsPerPage_cnv" style="width: 10px">
				                      <option disabled value="">Rows per Page</option>
				                      <option>10</option>
				                      <option>20</option>
				                      <option>50</option>
				                    </select>
				                  </td>
				                  <td>{{startRow_cnv+1}}-{{rowsPerPage_cnv*currentPage_cnv}} out of {{sortedMskdg_cnv.length}}</td>
				                  <td><button @click=movePages_cnv(-1)><b-icon icon="chevron-left"></b-icon></button></td>
				                  
				                  <td><button class="float-right" @click=movePages_cnv(1)><b-icon icon="chevron-right"></b-icon></button></td>
				              </tr>
				            	</table>
				            	</div>  
				            	<div id="notepadDriversCNV">
									<textarea style="width: 80%"ref="driverNotes_cnv" placeholder="Notes">{{drivergenes_notes_cnv}}</textarea>
									<button class= 'butn' v-on:click="storeNotes('drivergenes', 'cnv');">Save</button>
									<p v-show="savedDrivergenesNotes_cnv"style="width: 50px" class="float-right">saved</p>
				            	</div>    	
				          	</b-card> 
				        </b-collapse>
				        <div v-if="visibleDrivers_cnv && visibleDrivergenes_cnv" class="embed-responsive embed-responsive-16by9 z-depth-1-half column">
							<iframe id="drivergenesVis_cnv" class="embed-responsive-item" src="http://localhost:3000/BioGraphVisart/drivergenes_cnv" allowfullscreen></iframe>
						</div>
					</div>	      
				    <div v-if="!cnvjson"ref = "content_direct_pharm_table" id="direct_pharm_table_content" class="row" style="margin-bottom: 1.5vw; margin-left: 10px;">
				    	<div id="tooltipdirectpharm" style="width:100%">
					    	<v-tooltip bottom attach="#tooltipdirectpharm">
		       					<template v-slot:activator="{ on, attrs }">
		       						
							        <b-button
							          :class="visiblePharma ? null : 'collapsed'"
							          :aria-expanded="visiblePharma ? 'true' : 'false'"
							          aria-controls="collapse-4"
							          @click="visiblePharma = !visiblePharma"
							          v-bind:style="{ background: 'orange', color:'white' }"
							          block variant="primary"
							          id="direct_pharm_butn"
							         >
							          <Strong style="color: white">Somatic Mutations with Known Pharmacogenetic Effect</Strong><b-icon data-html2canvas-ignore="true" icon="info-circle" style="margin-left: 10px" v-bind="attrs" v-on="on"></b-icon> <b-icon data-html2canvas-ignore="true" class="float-right"icon="arrows-expand" v-if="visiblePharma"></b-icon> <b-icon class="float-right" icon="arrows-collapse" v-else></b-icon>
							        </b-button>
						        
						        </template>
       							<span>List of drugs with the evidence of targeting the observed variant of the mutated gene, and the documented drug response for the given mutational profile. Evidence level letter represents: A = validated association, B = clinical evidence, C = case study, D = preclinical evidence, E = inferential association. Evidence level number represents the matching type between the observed variant and the database result: 1 = same variant, 2 = different variant, same consequence, 3 = different variant, different consequence, same gene. The information is obtained from CIViC, CGI and DrugBank. </span>
       						</v-tooltip>
       					</div>
				        <b-collapse id="collapse-4" v-model="visiblePharma" :class="{column:visiblePharmaco}">  
				          <b-card> 
				            <table class="table table-hover">
				              <thead>
				                <tr data-html2canvas-ignore="true">
				                  <!-- <td></td> -->
				                  <td>
				                    	<v-text-field v-model="genes2" type="string" label="Gene" clearable></v-text-field>
				                    	<button @click="sortPtpda('Gene')">
				                    		<b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirGene2 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
				                    	</button>
				                  </td>
				                  <td>
				                    	<v-text-field v-model="mutation2" type="string" label="Mutation" clearable :disabled="!hidedirect_pharm_tableMutation"></v-text-field>
				                    	<button id="checkbox7" @click="hidedirect_pharm_tableMutation = !hidedirect_pharm_tableMutation" style="margin-right: 10px;">
								        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidedirect_pharm_tableMutation"></b-icon> 
								           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>	
								        </button>
								        <button @click="sortPtpda('Mutation')" :disabled="!hidedirect_pharm_tableMutation"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirMut2 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></button>
				                  </td>
				                  <td>
				                    	<v-text-field :disabled="!hidedirect_pharm_tableTherapy" v-model="therapy2" type="string" label="Therapy" clearable></v-text-field>
				                    	<button id="checkbox8" @click="hidedirect_pharm_tableTherapy = !hidedirect_pharm_tableTherapy" style="margin-right: 10px;">
								        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidedirect_pharm_tableTherapy"></b-icon>
								           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
								        </button>
								        <button @click="sortPtpda('Therapy')" :disabled="!hidedirect_pharm_tableTherapy"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirTherapy2 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
								        </button>
				                  </td>
				                  <td>
				                    	<v-text-field :disabled="!hidedirect_pharm_tableEffect" v-model="effect2" type="string" label="Effect" clearable></v-text-field>
				                    	<button id="checkbox9" @click="hidedirect_pharm_tableEffect = !hidedirect_pharm_tableEffect" style="margin-right: 10px;">
								        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidedirect_pharm_tableEffect"></b-icon> 
								           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
								        </button>
								        <button @click="sortPtpda('Effect')" :disabled="!hidedirect_pharm_tableEffect"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirEffect2 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
								        </button>
				                  </td>
				                  <td>
				                    	<v-text-field :disabled="!hidedirect_pharm_tableDisease" v-model="disease2" type="string" label="Disease" clearable></v-text-field>
				                    	<button id="checkbox10" @click="hidedirect_pharm_tableDisease = !hidedirect_pharm_tableDisease" style="margin-right: 10px;">
								        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidedirect_pharm_tableDisease"></b-icon> 
								           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
								        </button>
								        <button @click="sortPtpda('Disease')" :disabled="!hidedirect_pharm_tableDisease"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirDisease2 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
								        </button>
				                  </td>	
				                  <td>
				                    	<v-text-field :disabled="!hidedirect_pharm_tableEvidence" v-model="evidence2" type="string" label="Evidence" clearable></v-text-field>
				                    	<button id="checkbox11" @click="hidedirect_pharm_tableEvidence= !hidedirect_pharm_tableEvidence" style="margin-right: 10px;">
								        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidedirect_pharm_tableEvidence"></b-icon> 
								           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
								        </button>
								        <button @click="sortPtpda('Evidence')" :disabled="!hidedirect_pharm_tableEvidence"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirEvidence2 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
								        </button>
				                  </td>	           
				                  <td>
				                    	<v-text-field :disabled="!hidedirect_pharm_tableReferences" v-model="reference2" type="string" label="Reference" clearable></v-text-field>
				                    	<button id="checkbox12" @click="hidedirect_pharm_tableReferences= !hidedirect_pharm_tableReferences" style="margin-right: 10px;">
								        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidedirect_pharm_tableReferences"></b-icon> 
								           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
								        </button>
								        <button @click="sortPtpda('References')" :disabled="!hidedirect_pharm_tableReferences"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirRef2 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
								        </button>
				                  </td>
				                  <td>
				                  		<button class="downloadbutn float-right " @click="exportToPDF_direct_pharm_table()"><b-icon class="float-left" icon="download" style="margin-right: 3px" data-html2canvas-ignore="true"></b-icon>
				                  		</button>
				                  </td>
				                </tr>
				                <tr>
				                  <!-- <th data-html2canvas-ignore="true">
				                    <label class="form-checkbox">
				                      <input type="checkbox" v-model="selectAll" @click="select(direct_pharm_table )">
				                      <i class="form-icon"></i>
				                    </label>
				                  </th> -->
				                  <th> Gene </th>
				                  <th v-show="hidedirect_pharm_tableMutation">Mutation</th>
				                  <th v-show="hidedirect_pharm_tableTherapy">Therapy</th>
				                  <th v-show="hidedirect_pharm_tableEffect">Effect</th>
				                  <th v-show="hidedirect_pharm_tableDisease">Disease</th>
				                  <th v-show="hidedirect_pharm_tableEvidence">Evidence </th>	
				                  <th v-show="hidedirect_pharm_tableReferences">Reference</th>
				                </tr>
				              </thead>
				              <tbody>
				                <tr v-for="(item, index) in sortedPtpda" :key="item.gene" v-if="index < startRowPtpda + rowsPerPagePtpda && index >= startRowPtpda ">
				                  <!-- <td class="text-xs-center" data-html2canvas-ignore="true">      
				                    <label class="form-checkbox">
				                        <input type="checkbox" :value="item.gene" v-model="checkedGenes">
				                        <i class="form-icon"></i>
				                    </label>
				                  </td> -->
				                  <td @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}">
				                    {{ item.gene}}
				                    <div v-if="item.network" class="dropdown_gene" data-html2canvas-ignore="true"><b-icon class="float-right dropbtn" icon="link"></b-icon>
						                    <div class="dropdown-content">
									            <a v-if = "item.eccode" class="page-link" :href="item.eccode" target="_blank">IntEnz</a>
									            <a v-if = "item.ensembl"class="page-link" :href="item.ensembl" target="_blank">Ensembl</a>
									            <a v-if = "item.hgnc" class="page-link" :href="item.hgnc" target="_blank">HGNC</a>
									            <!-- <a class="page-link" :href="item.omim">OMIM</a>
									            <a class="page-link" :href="item.entrez">Entrez</a> -->
									            <a v-if = "item.mdanderson"class="page-link" :href="item.mdanderson" target="_blank">MDAnderson</a>
									            <a v-if = "item.kegg"class="page-link" :href="item.kegg" target="_blank">KEGG</a>
									            <a v-if = "item.uniprot"class="page-link" :href="item.uniprot" target="_blank">UniProt</a>
								          	</div>
								        </div> 
				                  </td>
				                  <td v-show="hidedirect_pharm_tableMutation" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
				                    {{ item.variant }}
				                  </td>
				                  <td v-show="hidedirect_pharm_tableTherapy" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
				                    {{ item.drug_name }}
				                  </td>
				                  <td v-show="hidedirect_pharm_tableEffect" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
				                    {{ item.variant_drug_association }}
				                  </td>
				                  <td v-show="hidedirect_pharm_tableDisease" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
				                    {{ item.tumor_list}}
				                  </td>
				                  <td v-show="hidedirect_pharm_tableEvidence" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
				                    {{ item.match_level}}
				                  </td>
				                  <td v-show="hidedirect_pharm_tableReferences" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
				                    {{ item.ref_map}}
				                  </td>
				                </tr>
				              </tbody>
				            </table>
				            <div id="page-navigation" class="text-center" data-html2canvas-ignore="true">
				              <table>
				                <tr>
				                  <td>
				                    <select v-model="rowsPerPagePtpda" style="width: 10px">
				                      <option disabled value="">Rows per Page</option>
				                      <option>10</option>
				                      <option>20</option>
				                      <option>50</option>
				                    </select>
				                  </td>
				                  <td>{{startRowPtpda+1}}-{{rowsPerPagePtpda*currentPagePtpda}} out of {{sortedPtpda.length}}</td>
				                  <td><button @click=movePagesPtpda(-1)><b-icon icon="chevron-left"></b-icon></button></td>
				                  
				                  <td><button class="float-right" @click=movePagesPtpda(1)><b-icon icon="chevron-right"></b-icon></button></td>
				                </tr>
				              </table>
				            </div>
				            <div id="notepadPharmaco">
									<textarea style="width: 80%"ref="pharmacoNotes" placeholder="Notes">{{pharmaco_notes}}</textarea>
									<button class= 'butn' v-on:click="storeNotes('pharmaco');">Save</button>
									<p v-show="savedPharmacoNotes"style="width: 50px" class="float-right">saved</p>
				            	</div> 
				         </b-card>
				        </b-collapse>
				        <div v-if="visiblePharma && visiblePharmaco" class="embed-responsive embed-responsive-16by9 z-depth-1-half column">
							<iframe id="pharmacoVis" class="embed-responsive-item" src="http://localhost:3000/BioGraphVisart/pharmaco" allowfullscreen></iframe>
						</div>
				    	<br><br>
				    </div>
				    <div v-if="cnvjsonavailable" ref = "content_direct_pharm_table_cnv" id="direct_pharm_table_content_cnv" class="row" style="margin-bottom: 1.5vw; margin-left: 10px;">
				    	<div id="tooltipdirectpharm_cnv" style="width:100%">
				    		<v-tooltip bottom attach="#tooltipdirectpharm_cnv">
	       						<template v-slot:activator="{ on, attrs }">
	       						
							        <b-button
							          :class="visiblePharma_cnv ? null : 'collapsed'"
							          :aria-expanded="visiblePharma_cnv ? 'true' : 'false'"
							          aria-controls="collapse-4"
							          @click="visiblePharma_cnv = !visiblePharma_cnv"
							          v-bind:style="{ background: 'orange', color:'white' }"
							          block variant="primary"
							          id="direct_pharm_butn_cnv"
							         >
							          <Strong style="color: white">CNV: Somatic Mutations with Known Pharmacogenetic Effect</Strong><b-icon data-html2canvas-ignore="true" icon="info-circle" style="margin-left: 10px" v-bind="attrs" v-on="on"></b-icon> <b-icon data-html2canvas-ignore="true" class="float-right"icon="arrows-expand" v-if="visiblePharma_cnv"></b-icon> <b-icon class="float-right" icon="arrows-collapse" v-else></b-icon>
						        	</b-button>
					        
					        	</template>
       							<span>List of drugs with the evidence of targeting the observed variant of the mutated gene, and the documented drug response for the given mutational profile. </span>
       						</v-tooltip>
       					</div>
				        <b-collapse id="collapse-4" v-model="visiblePharma_cnv" :class="{column:visiblePharmaco_cnv}">  
				          <b-card> 
				            <table class="table table-hover">
				              <thead>
				                <tr data-html2canvas-ignore="true">
				                  <td>
				                    	<v-text-field v-model="genes2_cnv" type="string" label="Gene" clearable></v-text-field>
				                    	<button @click="sortPtpda_cnv('Gene')">
				                    		<b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirGene2_cnv == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
				                    	</button>
				                  </td>
				                  <td>
				                    	<v-text-field v-model="mutation2_cnv" type="string" label="Mutation" clearable :disabled="!hidedirect_pharm_tableMutation_cnv"></v-text-field>
				                    	<button id="checkbox7_cnv" @click="hidedirect_pharm_tableMutation_cnv = !hidedirect_pharm_tableMutation_cnv" style="margin-right: 10px;">
								        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidedirect_pharm_tableMutation_cnv"></b-icon> 
								           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>	
								        </button>
								        <button @click="sortPtpda_cnv('Mutation')" :disabled="!hidedirect_pharm_tableMutation_cnv"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirMut2_cnv == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></button>
				                  </td>
				                  <td>
				                    	<v-text-field :disabled="!hidedirect_pharm_tableTherapy_cnv" v-model="therapy2_cnv" type="string" label="Therapy" clearable></v-text-field>
				                    	<button id="checkbox8_cnv" @click="hidedirect_pharm_tableTherapy_cnv = !hidedirect_pharm_tableTherapy_cnv" style="margin-right: 10px;">
								        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidedirect_pharm_tableTherapy_cnv"></b-icon>
								           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
								        </button>
								        <button @click="sortPtpda_cnv('Therapy')" :disabled="!hidedirect_pharm_tableTherapy_cnv"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirTherapy2_cnv == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
								        </button>
				                  </td>
				                  <td>
				                    	<v-text-field :disabled="!hidedirect_pharm_tableEffect_cnv" v-model="effect2_cnv" type="string" label="Effect" clearable></v-text-field>
				                    	<button id="checkbox9" @click="hidedirect_pharm_tableEffect_cnv = !hidedirect_pharm_tableEffect_cnv" style="margin-right: 10px;">
								        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidedirect_pharm_tableEffect_cnv"></b-icon> 
								           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
								        </button>
								        <button @click="sortPtpda_cnv('Effect')" :disabled="!hidedirect_pharm_tableEffect_cnv"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirEffect2_cnv == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
								        </button>
				                  </td>
				                  <td>
				                    	<v-text-field :disabled="!hidedirect_pharm_tableDisease_cnv" v-model="disease2_cnv" type="string" label="Disease" clearable></v-text-field>
				                    	<button id="checkbox10" @click="hidedirect_pharm_tableDisease_cnv = !hidedirect_pharm_tableDisease_cnv" style="margin-right: 10px;">
								        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidedirect_pharm_tableDisease_cnv"></b-icon> 
								           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
								        </button>
								        <button @click="sortPtpda_cnv('Disease')" :disabled="!hidedirect_pharm_tableDisease_cnv"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirDisease2_cnv == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
								        </button>
				                  </td>	
				                  <td>
				                    	<v-text-field :disabled="!hidedirect_pharm_tableEvidence_cnv" v-model="evidence2" type="string" label="Evidence" clearable></v-text-field>
				                    	<button id="checkbox11" @click="hidedirect_pharm_tableEvidence_cnv= !hidedirect_pharm_tableEvidence_cnv" style="margin-right: 10px;">
								        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidedirect_pharm_tableEvidence_cnv"></b-icon> 
								           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
								        </button>
								        <button @click="sortPtpda_cnv('Evidence')" :disabled="!hidedirect_pharm_tableEvidence_cnv"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirEvidence2_cnv == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
								        </button>
				                  </td>	           
				                  <td>
				                    	<v-text-field :disabled="!hidedirect_pharm_tableReferences_cnv" v-model="reference2_cnv" type="string" label="Reference" clearable></v-text-field>
				                    	<button id="checkbox12_cnv" @click="hidedirect_pharm_tableReferences_cnv= !hidedirect_pharm_tableReferences_cnv" style="margin-right: 10px;">
								        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidedirect_pharm_tableReferences_cnv"></b-icon> 
								           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
								        </button>
								        <button @click="sortPtpda_cnv('References')" :disabled="!hidedirect_pharm_tableReferences_cnv"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirRef2_cnv == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
								        </button>
				                  </td>
				                  <td>
				                  		<button class="downloadbutn float-right " @click="exportToPDF_direct_pharm_table_cnv()"><b-icon class="float-left" icon="download" style="margin-right: 3px" data-html2canvas-ignore="true"></b-icon>
				                  		</button>
				                  </td>
				                </tr>
				                <tr>
				                 
				                  <th> Gene </th>
				                  <th v-show="hidedirect_pharm_tableMutation_cnv">Mutation</th>
				                  <th v-show="hidedirect_pharm_tableTherapy_cnv">Therapy</th>
				                  <th v-show="hidedirect_pharm_tableEffect_cnv">Effect</th>
				                  <th v-show="hidedirect_pharm_tableDisease_cnv">Disease</th>
				                  <th v-show="hidedirect_pharm_tableEvidence_cnv">Evidence </th>	
				                  <th v-show="hidedirect_pharm_tableReferences_cnv">Reference</th>
				                </tr>
				              </thead>
				              <tbody>
				                <tr v-for="(item, index) in sortedPtpda_cnv" :key="item.gene" v-if="index < startRowPtpda_cnv + rowsPerPagePtpda_cnv && index >= startRowPtpda_cnv ">
				                  <td @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}">
				                    {{ item.gene}}
				                    <div v-if="item.network" class="dropdown_gene" data-html2canvas-ignore="true"><b-icon class="float-right dropbtn" icon="link"></b-icon>
						                    <div class="dropdown-content">
									            <a v-if = "item.eccode" class="page-link" :href="item.eccode" target="_blank">IntEnz</a>
									            <a v-if = "item.ensembl"class="page-link" :href="item.ensembl" target="_blank">Ensembl</a>
									            <a v-if = "item.hgnc" class="page-link" :href="item.hgnc" target="_blank">HGNC</a>
									            <a v-if = "item.mdanderson"class="page-link" :href="item.mdanderson" target="_blank">MDAnderson</a>
									            <a v-if = "item.kegg"class="page-link" :href="item.kegg" target="_blank">KEGG</a>
									            <a v-if = "item.uniprot"class="page-link" :href="item.uniprot" target="_blank">UniProt</a>
								          	</div>
								        </div> 
				                  </td>
				                  <td v-show="hidedirect_pharm_tableMutation_cnv" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
				                    {{ item.variant }}
				                  </td>
				                  <td v-show="hidedirect_pharm_tableTherapy_cnv" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
				                    {{ item.drug_name }}
				                  </td>
				                  <td v-show="hidedirect_pharm_tableEffect_cnv" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
				                    {{ item.variant_drug_association }}
				                  </td>
				                  <td v-show="hidedirect_pharm_tableDisease_cnv" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
				                    {{ item.tumor_list}}
				                  </td>
				                  <td v-show="hidedirect_pharm_tableEvidence_cnv" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
				                    {{ item.match_level}}
				                  </td>
				                  <td v-show="hidedirect_pharm_tableReferences_cnv" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
				                    {{ item.ref_map}}
				                  </td>
				                </tr>
				              </tbody>
				            </table>
				            <div id="page-navigation" class="text-center" data-html2canvas-ignore="true">
				              <table>
				                <tr>
				                  <td>
				                    <select v-model="rowsPerPagePtpda_cnv" style="width: 10px">
				                      <option disabled value="">Rows per Page</option>
				                      <option>10</option>
				                      <option>20</option>
				                      <option>50</option>
				                    </select>
				                  </td>
				                  <td>{{startRowPtpda_cnv+1}}-{{rowsPerPagePtpda_cnv*currentPagePtpda_cnv}} out of {{sortedPtpda_cnv.length}}</td>
				                  <td><button @click=movePagesPtpda_cnv(-1)><b-icon icon="chevron-left"></b-icon></button></td>
				                  
				                  <td><button class="float-right" @click=movePagesPtpda_cnv(1)><b-icon icon="chevron-right"></b-icon></button></td>
				                </tr>
				              </table>
				            </div>
				            <div id="notepadPharmaco_cnv">
								<textarea style="width: 80%"ref="pharmacoNotes_cnv" placeholder="Notes">{{pharmaco_notes_cnv}}</textarea>
								<button class= 'butn' v-on:click="storeNotes('pharmaco', 'cnv');">Save</button>
								<p v-show="savedPharmacoNotes_cnv"style="width: 50px" class="float-right">saved</p>
			            	</div> 
				         </b-card>
				        </b-collapse>
				        <div v-if="visiblePharma_cnv && visiblePharmaco_cnv" class="embed-responsive embed-responsive-16by9 z-depth-1-half column">
							<iframe id="pharmacoVis_cnv" class="embed-responsive-item" src="http://localhost:3000/BioGraphVisart/pharmaco_cnv" allowfullscreen></iframe>
						</div>
				    	<br><br>
				    </div> 
				    <div v-if="!cnvjson"ref="content_smptag" style="margin-left: 10px; width : 100%;">
				        <b-button
				          :class="visibleAffect ? null : 'collapsed'"
				          :aria-expanded="visibleAffect ? 'true' : 'false'"
				          aria-controls="collapse-4"
				          @click="visibleAffect = !visibleAffect"
				          class="text-center" v-bind:style="{ background: 'blue', color:'white' }"
				          block variant="primary"
				          >
				        <Strong style="color: white">Somatic Mutations in Pharmaceutical Target Affected Genes</Strong><b-icon data-html2canvas-ignore="true" class="float-right"icon="arrows-expand" v-if="visibleAffect"></b-icon> <b-icon class="float-right" icon="arrows-collapse" v-else></b-icon>
				        </b-button>
				        <b-collapse id="collapse-4" v-model="visibleAffect" class="mt-2">
					        <div ref = "content_pharm_table" id="pharm_table_content" class="row" style="margin-top: 0.5vw; margin-left: 1px; margin-bottom: 0.5vw">
					        	<v-tooltip bottom attach="#pharm_table_content">
       							<template v-slot:activator="{ on, attrs }">
					            <b-button
					              :class="visibleAffectCivic ? null : 'collapsed'"
					              :aria-expanded="visibleAffectCivic ? 'true' : 'false'"
					              aria-controls="collapse-4"
					              @click="visibleAffectCivic = !visibleAffectCivic"
					              v-bind:style="{ color:'white' }"
					              block variant="primary"
					              >
					              <Strong style="color: white">Pharmacogenomics Summary of Drugs Targeting Affected Genes</Strong><b-icon data-html2canvas-ignore="true" icon="info-circle" style="margin-left: 10px" v-bind="attrs" v-on="on"></b-icon> <b-icon data-html2canvas-ignore="true" class="float-right"icon="arrows-expand" v-if="visibleAffectCivic"></b-icon> <b-icon class="float-right" icon="arrows-collapse" v-else></b-icon>
					            </b-button>
					        	</template>
					            <span >Therapies that have evidence of targeting the affected gene. Evidence level letter represents: A = validated association, B = clinical evidence, C = case study, D = preclinical evidence, E = inferential association. Evidence level number represents the matching type between the observed variant and the database result: 1 = same variant, 2 = different variant, same consequence, 3 = different variant, different consequence, same gene. The information is obtained from CIViC, CGI and DrugBank. </span>
					            </v-tooltip>
					            <b-collapse id="collapse-4" v-model="visibleAffectCivic" :class="{column:visibleCivic}">
							      <b-card> 
					                <table class="table table-hover">
					                  <thead>
					                    <tr data-html2canvas-ignore="true">
					                      <!-- <td></td> -->
					                      <td>
					                        	<v-text-field v-model="genes3" type="string" label="Gene"></v-text-field>
					                        	<button @click="sortPtpia('Gene')"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirGene3 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
					                        	</button>
					                      </td>
					                      <td>
					                        	<v-text-field :diabled="!hidepharm_tableMutation" v-model="mutations3" type="string" label="Mutation" clearable></v-text-field>
					                        	<button id="checkbox13" @click="hidepharm_tableMutation= !hidepharm_tableMutation" style="margin-right: 10px;">
										        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidepharm_tableMutation"></b-icon> 
										           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
										        </button>
										        <button @click="sortPtpia('Mutation')" :diabled="!hidepharm_tableMutation"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirMut3 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
										        </button>
					                      </td>
					                      <td>
					                        	<v-text-field :disabled="!hidepharm_tableTherapy" v-model="therapy3" type="string" label="Therapy" clearable></v-text-field>
					                        	<button id="checkbox13" @click="hidepharm_tableTherapy= !hidepharm_tableTherapy" style="margin-right: 10px;">
										        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidepharm_tableTherapy"></b-icon> 
										           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
										        </button>
										        <button @click="sortPtpia('Therapy')" :disabled="!hidepharm_tableTherapy" ><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirTherapy3 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
										        </button>
					                      </td>
					                      <td>
					                        	<v-text-field :disabled="!hidepharm_tableEffect" v-model="effect3" type="string" label="Effect" clearable></v-text-field>
					                        	<button id="checkbox14" @click="hidepharm_tableEffect= !hidepharm_tableEffect" style="margin-right: 10px;">
										        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidepharm_tableEffect"></b-icon> 
										           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
										        </button>
										        <button @click="sortPtpia('Effect')" :disabled="!hidepharm_tableEffect"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirEffect3 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
										        </button>
					                      </td>
					                      <td>
					                        	<v-text-field :disabled="!hidepharm_tableDisease" v-model="disease3" type="string" label="Disease" clearable></v-text-field>
					                        	<button id="checkbox15" @click="hidepharm_tableDisease= !hidepharm_tableDisease" style="margin-right: 10px;">
										        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidepharm_tableDisease"></b-icon> 
										           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
										        </button>
										        <button @click="sortPtpia('Disease')" :disabled="!hidepharm_tableDisease" > <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirDisease3 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
										        </button>
					                      </td>
					                      <td>
					                        	<v-text-field :disabled="!hidepharm_tableEvidence" v-model="evidence3" type="string" label="Evidence" clearable></v-text-field>
					                        	<button id="checkbox16" @click="hidepharm_tableEvidence= !hidepharm_tableEvidence" style="margin-right: 10px;">
										        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidepharm_tableEvidence"></b-icon> 
										           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
										        </button>
										        <button @click="sortPtpia('Evidence')" :disabled="!hidepharm_tableEvidence"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirEvidence3 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
										        </button>
					                      </td>
					                      <td>
					                        	<v-text-field :disabled="!hidepharm_tableReferences" v-model="reference3" type="string" label="Reference" clearable></v-text-field>
					                        	<button id="checkbox17" @click="hidepharm_tableReferences= !hidepharm_tableReferences" style="margin-right: 10px;">
										        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidepharm_tableReferences"></b-icon> 
										           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
										        </button>
										        <button @click="sortPtpia('References')" :disabled="!hidepharm_tableReferences"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirRef3 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
										        </button>
					                      </td>
					                      <td>
					                      	 <button class="downloadbutn float-right " @click="exportToPDF_pharm_table()"><b-icon class="float-left" icon="download" style="margin-right: 3px" data-html2canvas-ignore="true"></b-icon>
					                      	 </button>
					                      </td>
					                    </tr>
					                    <tr>
					                     <!--  <th data-html2canvas-ignore="true">
					                        <label class="form-checkbox">
					                          <input type="checkbox" v-model="selectAll" @click="select(pharm_table )">
					                          <i class="form-icon"></i>
					                        </label>
					                      </th> -->
					                      <th >Gene</th>
					                      <th v-show="hidepharm_tableMutation">Mutation</th>
					                      <th v-show="hidepharm_tableTherapy">Therapy</th>
					                      <th v-show="hidepharm_tableEffect" >Effect</th>
					                      <th v-show="hidepharm_tableDisease" >Disease</th>
					                      <th v-show="hidepharm_tableEvidence">Evidence</th>
					                      <th v-show="hidepharm_tableReferences">References</th>
					                    </tr>
					                  </thead>
					                  <tbody>
					                    <tr v-for="(item, index) in sortedPtpia" :key="item.gene" v-if="index < startRowPtpia + rowsPerPagePtpia && index >= startRowPtpia ">
					                      <!-- <td class="text-xs-center" data-html2canvas-ignore="true">      
					                        <label class="form-checkbox">
					                            <input type="checkbox" :value="item.gene" v-model="checkedGenes">
					                            <i class="form-icon"></i>
					                        </label>
					                      </td> -->
					                      <td @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}">
					                        {{ item.gene}}
					                        <div v-if="item.network" class="dropdown_gene" data-html2canvas-ignore="true"><b-icon class="float-right dropbtn" icon="link"></b-icon>
						                    <div class="dropdown-content">
									            <a v-if = "item.eccode" class="page-link" :href="item.eccode" target="_blank">IntEnz</a>
									            <a v-if = "item.ensembl"class="page-link" :href="item.ensembl" target="_blank">Ensembl</a>
									            <a v-if = "item.hgnc" class="page-link" :href="item.hgnc" target="_blank">HGNC</a>
									            <!-- <a class="page-link" :href="item.omim">OMIM</a>
									            <a class="page-link" :href="item.entrez">Entrez</a> -->
									            <a v-if = "item.mdanderson"class="page-link" :href="item.mdanderson" target="_blank">MDAnderson</a>
									            <a v-if = "item.kegg"class="page-link" :href="item.kegg" target="_blank">KEGG</a>
									            <a v-if = "item.uniprot"class="page-link" :href="item.uniprot" target="_blank">UniProt</a>
								          	</div>
								        </div> 
					                      </td>
					                      <td v-show="hidepharm_tableMutation" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
					                        {{ item.variant}}
					                      </td>
					                      <td v-show="hidepharm_tableTherapy" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
					                        {{ item.drug_name}}
					                      </td>
					                      <td v-show="hidepharm_tableEffect" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
					                        {{ item.variant_drug_association }}
					                      </td>
					                      <td v-show="hidepharm_tableDisease" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
					                        {{ item.tumor_list }}
					                      </td>
					                      <td v-show="hidepharm_tableEvidence" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
					                        {{ item.match_leve}}
					                      </td>
					                      <td v-show="hidepharm_tableReferences" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
					                        {{ item.ref_map }}
					                      </td>
					                    </tr>
					                  </tbody>
					                </table>
					                <div id="page-navigation" class="text-center" data-html2canvas-ignore="true">
					                  <table>
					                    <tr>
					                      <td>
					                        <select v-model="rowsPerPagePtpia" style="width: 10px">
					                          <option disabled value="">Rows per Page</option>
					                          <option>10</option>
					                          <option>20</option>
					                          <option>50</option>
					                        </select>
					                      </td>
					                      <td>{{startRowPtpia+1}}-{{rowsPerPagePtpia*currentPagePtpia}} out of {{sortedPtpia.length}}</td>
					                      <td><button @click=movePagesPtpia(-1)><b-icon icon="chevron-left"></b-icon></button></td>
					                      
					                      <td><button class="float-right" @click=movePagesPtpia(1)><b-icon icon="chevron-right"></b-icon></button></td>
					                    </tr>
					                  </table>
					                </div>
					                <div id="notepadCivic">
									<textarea ref="civicNotes" style="width: 80%" placeholder="Notes">{{civic_notes}}</textarea>
									<button class= 'butn' v-on:click="storeNotes('civic');">Save</button>
									<p v-show="savedCivicNotes"style="width: 50px" class="float-right">saved</p>
				            	</div> 
					            	</b-card>
					          	</b-collapse>
					          	<div v-if="visibleAffectCivic && visibleCivic" class="embed-responsive embed-responsive-16by9 z-depth-1-half column">
									<iframe id="civicVis" class="embed-responsive-item" src="http://localhost:3000/BioGraphVisart/civic" allowfullscreen></iframe>
								</div>
								<br>
					    		<br>
					        </div>
					       	<div ref = "content_mechanistic_drug_table" id="mechanistic_drug_table_content" class="row" style="margin-bottom: 1.5vw; margin-left: 1px;" >
					       		<v-tooltip bottom attach="#mechanistic_drug_table_content">
       							<template v-slot:activator="{ on, attrs }">
					          	<b-button
						            :class="visibleAffectCancer ? null : 'collapsed'"
						            :aria-expanded="visibleAffectCancer ? 'true' : 'false'"
						            aria-controls="collapse-4"
						            @click="visibleAffectCancer = !visibleAffectCancer"
						            block variant="primary"
						            v-bind:style="{ color:'white' }"
						            >
					            	<Strong style="color: white">Summary of Cancer Drugs Targeting Affected Genes</Strong><b-icon data-html2canvas-ignore="true" icon="info-circle" style="margin-left: 10px" v-bind="attrs" v-on="on"></b-icon> <b-icon data-html2canvas-ignore="true" class="float-right"icon="arrows-expand" v-if="visibleAffectCancer"></b-icon> <b-icon class="float-right" icon="arrows-collapse" v-else></b-icon>
					          	</b-button>
					          	</template>
					            <span > List of cancer drugs targeting the mutated gene. Information is obtained from DrugBank, Therapeutic Target Database, IUPHAR, and Santos <em>et al.</em>.</span>
					        	</v-tooltip>
					          	<b-collapse id="collapse-4" v-model="visibleAffectCancer" :class="{column:visibleCancer}" >
						            <b-card> 
						                <table class="table table-hover">
						                  <thead>
						                    <tr data-html2canvas-ignore="true">
						                      <td>
						                        	<v-text-field v-model="genes4" type="string" label="Gene"></v-text-field>
						                        	<button @click="sortMskpe('Gene')"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirGene4 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
						                        	</button>
						                      </td>
						                      <td>
						                        	<v-text-field :disabled="!hidemechanistic_drug_tableStatus" v-model="status4" type="string" label="Status" clearable></v-text-field>
						                        	<button id="checkbox18" @click="hidemechanistic_drug_tableStatus= !hidemechanistic_drug_tableStatus" style="margin-right: 10px;">
											        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidemechanistic_drug_tableStatus"></b-icon> 
											           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
											        </button>
											        <button @click="sortMskpe('Status')" :disabled="!hidemechanistic_drug_tableStatus"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirStatus4 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
											        </button>
						                      </td>
						                      <td>
						                        	<v-text-field :disabled="!hidemechanistic_drug_tableTherapy" v-model="therapy4" type="string" label="Therapy" clearable></v-text-field>
						                        	<button id="checkbox19" @click="hidemechanistic_drug_tableTherapy= !hidemechanistic_drug_tableTherapy" style="margin-right: 10px;">
											        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidemechanistic_drug_tableTherapy"></b-icon> 
											           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
											        </button>
											        <button @click="sortMskpe('Therapy')" :disabled="!hidemechanistic_drug_tableTherapy"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirTherapy4 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
											        </button>
						                      </td>
						                      <td>
						                        	<v-text-field :disabled="!hidemechanistic_drug_tableReferences" v-model="reference4" type="string" label="Reference" clearable></v-text-field>	
											        <button id="checkbox20" @click="hidemechanistic_drug_tableReferences= !hidemechanistic_drug_tableReferences" style="margin-right: 10px;">
											        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidemechanistic_drug_tableReferences"></b-icon> 
											           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
								        			</button>
								        			<button @click="sortMskpe('References')" :disabled="!hidemechanistic_drug_tableReferences"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirRef4 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
								        			</button>
						                      </td>
						                      <td>
						                      		<button class="downloadbutn float-right " @click="exportToPDF_mechanistic_drug_table()"><b-icon class="float-left" icon="download" style="margin-right: 3px" data-html2canvas-ignore="true"></b-icon>
						                      		</button>
						                      </td>
						                    </tr>
						                    <tr>
						                      <!-- <th data-html2canvas-ignore="true">
						                        <label class="form-checkbox">
						                          <input type="checkbox" v-model="selectAll" @click="select(mechanistic_drug_table)">
						                          <i class="form-icon"></i>
						                        </label>
						                      </th> -->
						                      <th >Gene</th>
						                      <th v-show="hidemechanistic_drug_tableStatus">Status</th>
						                      <th v-show="hidemechanistic_drug_tableTherapy" >Therapy</th>
						                      <th v-show="hidemechanistic_drug_tableReferences" >References</th>
						                    </tr>
						                  </thead>
						                  <tbody>
						                    <tr v-for="(item, index) in sortedMskpe" :key="item.gene" v-if="index < startRowMskpe + rowsPerPageMskpe && index >= startRowMskpe ">
						                      <!-- <td class="text-xs-center" data-html2canvas-ignore="true">      
						                        <label class="form-checkbox">
						                            <input type="checkbox" :value="item.gene" v-model="checkedGenes">
						                            <i class="form-icon"></i>
						                        </label>
						                      </td> -->
						                      <td @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}">
						                        {{ item.gene }}
						                        <div v-if="item.network" class="dropdown_gene" data-html2canvas-ignore="true"><b-icon class="float-right dropbtn" icon="link"></b-icon>
								                    <div class="dropdown-content">
											            <a v-if = "item.eccode" class="page-link" :href="item.eccode" target="_blank">IntEnz</a>
											            <a v-if = "item.ensembl"class="page-link" :href="item.ensembl" target="_blank">Ensembl</a>
											            <a v-if = "item.hgnc" class="page-link" :href="item.hgnc" target="_blank">HGNC</a>
											            <!-- <a class="page-link" :href="item.omim">OMIM</a>
											            <a class="page-link" :href="item.entrez">Entrez</a> -->
											            <a v-if = "item.mdanderson"class="page-link" :href="item.mdanderson" target="_blank">MDAnderson</a>
											            <a v-if = "item.kegg"class="page-link" :href="item.kegg" target="_blank">KEGG</a>
											            <a v-if = "item.uniprot"class="page-link" :href="item.uniprot" target="_blank">UniProt</a>
										          	</div>
										        </div> 
						                      </td>
						                      <td v-show="hidemechanistic_drug_tableStatus" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4} " class=text-xs-right>
						                        {{ item.approval_status }}
						                      </td>
						                      <td v-show="hidemechanistic_drug_tableTherapy" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4} " class=text-xs-right>
						                        {{ item.drug_name}}
						                      </td>
						                      <td v-show="hidemechanistic_drug_tableReferences" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4} " class=text-xs-right>
						                        {{ item.ref_map }}
						                      </td>
						                    </tr>
						                  </tbody>
						                </table>
						                <div id="page-navigation" class="text-center" data-html2canvas-ignore="true">
						                  <table>
						                    <tr>
						                      <td>
						                        <select v-model="rowsPerPageMskpe" style="width: 10px">
						                          <option disabled value="">Rows per Page</option>
						                          <option>10</option>
						                          <option>20</option>
						                          <option>50</option>
						                        </select>
						                      </td>
						                      <td>{{startRowMskpe+1}}-{{rowsPerPageMskpe*currentPageMskpe}} out of {{sortedMskpe.length}}</td>
						                      <td><button @click=movePagesMskpe(-1)><b-icon icon="chevron-left"></b-icon></button></td>
						                      
						                      <td><button class="float-right" @click=movePagesMskpe(1)><b-icon icon="chevron-right"></b-icon></button></td>
						                    </tr>
						                  </table>
						                </div>
						            	<div id="notepadCancer">
											<textarea style="width: 80%"ref="cancerNotes" placeholder="Notes">{{cancer_notes}}</textarea>
											<button class= 'butn' v-on:click="storeNotes('cancer');">Save</button>
											<p v-show="savedCancerNotes"style="width: 50px" class="float-right">saved</p>
				            			</div> 
						          </b-card>
					          </b-collapse>
					          <div v-if="visibleAffectCancer && visibleCancer" class="embed-responsive embed-responsive-16by9 z-depth-1-half column">
								<iframe id="cancerVis" class="embed-responsive-item" src="http://localhost:3000/BioGraphVisart/cancer" allowfullscreen></iframe>
							</div>
					        </div>
				        </b-collapse>
				    </div>  
				    <div v-if="cnvjsonavailable" ref="content_smptag_cnv" style="margin-left: 10px; width : 100%;">
				        <b-button
				          :class="visibleAffect_cnv ? null : 'collapsed'"
				          :aria-expanded="visibleAffect_cnv ? 'true' : 'false'"
				          aria-controls="collapse-4"
				          @click="visibleAffect_cnv = !visibleAffect_cnv"
				          class="text-center" v-bind:style="{ background: 'blue', color:'white' }"
				          block variant="primary"
				          >
				        <Strong style="color: white">CNV: Somatic Mutations in Pharmaceutical Target Affected Genes</Strong><b-icon data-html2canvas-ignore="true" class="float-right"icon="arrows-expand" v-if="visibleAffect_cnv"></b-icon> <b-icon class="float-right" icon="arrows-collapse" v-else></b-icon>
				        </b-button>
				        <b-collapse id="collapse-4" v-model="visibleAffect_cnv" class="mt-2">
					        <div v-if="cnvjsonavailable" ref = "content_pharm_table_cnv" id="pharm_table_content_cnv" class="row" style="margin-top: 0.5vw; margin-left: 1px; margin-bottom: 0.5vw">
					        	<v-tooltip bottom attach="#pharm_table_content_cnv">
       							<template v-slot:activator="{ on, attrs }">
					            <b-button
					              :class="visibleAffectCivic_cnv ? null : 'collapsed'"
					              :aria-expanded="visibleAffectCivic_cnv ? 'true' : 'false'"
					              aria-controls="collapse-4"
					              @click="visibleAffectCivic_cnv = !visibleAffectCivic_cnv"
					              v-bind:style="{ color:'white' }"
					              block variant="primary"
					              >
					              <Strong style="color: white">CNV: Pharmacogenomics Summary of Drugs Targeting Affected Genes</Strong><b-icon data-html2canvas-ignore="true" icon="info-circle" style="margin-left: 10px" v-bind="attrs" v-on="on"></b-icon> <b-icon data-html2canvas-ignore="true" class="float-right"icon="arrows-expand" v-if="visibleAffectCivic_cnv"></b-icon> <b-icon class="float-right" icon="arrows-collapse" v-else></b-icon>
					            </b-button>
					        	</template>
					            <span >Therapies that have evidence of targeting the affected gene. Evidence level letter represents: A = validated association, B = clinical evidence, C = case study, D = preclinical evidence, E = inferential association. Evidence level number represents the matching type between the observed variant and the database result: 1 = same variant, 2 = different variant, same consequence, 3 = different variant, different consequence, same gene. The information is obtained from CIViC, CGI and DrugBank. </span>
					            </v-tooltip>
					            <b-collapse id="collapse-4" v-model="visibleAffectCivic_cnv" :class="{column:visibleCivic_cnv}">
							      <b-card> 
					                <table class="table table-hover">
					                  <thead>
					                    <tr data-html2canvas-ignore="true">
					                      <td>
					                        	<v-text-field v-model="genes3_cnv" type="string" label="Gene"></v-text-field>
					                        	<button @click="sortPtpia_cnv('Gene')"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirGene3_cnv == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
					                        	</button>
					                      </td>
					                      <td>
					                        	<v-text-field :diabled="!hidepharm_tableMutation_cnv" v-model="mutations3_cnv" type="string" label="Mutation" clearable></v-text-field>
					                        	<button id="checkbox13" @click="hidepharm_tableMutation_cnv= !hidepharm_tableMutation_cnv" style="margin-right: 10px;">
										        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidepharm_tableMutation_cnv"></b-icon> 
										           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
										        </button>
										        <button @click="sortPtpia_cnvcurrentSortDirGene5_cnv('Mutation')" :diabled="!hidepharm_tableMutation_cnv"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirMut3_cnv == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
										        </button>
					                      </td>
					                      <td>
					                        	<v-text-field :disabled="!hidepharm_tableTherapy_cnv" v-model="therapy3_cnv" type="string" label="Therapy" clearable></v-text-field>
					                        	<button id="checkbox13" @click="hidepharm_tableTherapy_cnv= !hidepharm_tableTherapy_cnv" style="margin-right: 10px;">
										        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidepharm_tableTherapy_cnv"></b-icon> 
										           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
										        </button>
										        <button @click="sortPtpia_cnv('Therapy')" :disabled="!hidepharm_tableTherapy_cnv" ><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirTherapy3_cnv == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
										        </button>
					                      </td>
					                      <td>
					                        	<v-text-field :disabled="!hidepharm_tableEffect_cnv" v-model="effect3_cnv" type="string" label="Effect" clearable></v-text-field>
					                        	<button id="checkbox14" @click="hidepharm_tableEffect_cnv= !hidepharm_tableEffect_cnv" style="margin-right: 10px;">
										        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidepharm_tableEffect_cnv"></b-icon> 
										           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
										        </button>
										        <button @click="sortPtpia_cnv('Effect')" :disabled="!hidepharm_tableEffect_cnv"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirEffect3_cnv == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
										        </button>
					                      </td>
					                      <td>
					                        	<v-text-field :disabled="!hidepharm_tableDisease_cnv" v-model="disease3_cnv" type="string" label="Disease" clearable></v-text-field>
					                        	<button id="checkbox15" @click="hidepharm_tableDisease_cnv= !hidepharm_tableDisease_cnv" style="margin-right: 10px;">
										        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidepharm_tableDisease_cnv"></b-icon> 
										           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
										        </button>
										        <button @click="sortPtpia_cnv('Disease')" :disabled="!hidepharm_tableDisease_cnv" > <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirDisease3_cnv == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
										        </button>
					                      </td>
					                      <td>
					                        	<v-text-field :disabled="!hidepharm_tableEvidence_cnv" v-model="evidence3_cnv" type="string" label="Evidence" clearable></v-text-field>
					                        	<button id="checkbox16" @click="hidepharm_tableEvidence_cnv= !hidepharm_tableEvidence_cnv" style="margin-right: 10px;">
										        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidepharm_tableEvidence_cnv"></b-icon> 
										           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
										        </button>
										        <button @click="sortPtpia_cnv('Evidence')" :disabled="!hidepharm_tableEvidence_cnv"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirEvidence3_cnv == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
										        </button>
					                      </td>
					                      <td>
					                        	<v-text-field :disabled="!hidepharm_tableReferences_cnv" v-model="reference3_cnv" type="string" label="Reference" clearable></v-text-field>
					                        	<button id="checkbox17" @click="hidepharm_tableReferences_cnv= !hidepharm_tableReferences_cnv" style="margin-right: 10px;">
										        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidepharm_tableReferences_cnv"></b-icon> 
										           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
										        </button>
										        <button @click="sortPtpia_cnv('References')" :disabled="!hidepharm_tableReferences_cnv"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirRef3_cnv == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
										        </button>
					                      </td>
					                      <td>
					                      	 <button class="downloadbutn float-right " @click="exportToPDF_pharm_table_cnv()"><b-icon class="float-left" icon="download" style="margin-right: 3px" data-html2canvas-ignore="true"></b-icon>
					                      	 </button>
					                      </td>
					                    </tr>
					                    <tr>
					                      <th >Gene</th>
					                      <th v-show="hidepharm_tableMutation_cnv">Mutation</th>
					                      <th v-show="hidepharm_tableTherapy_cnv">Therapy</th>
					                      <th v-show="hidepharm_tableEffect_cnv" >Effect</th>
					                      <th v-show="hidepharm_tableDisease_cnv" >Disease</th>
					                      <th v-show="hidepharm_tableEvidence_cnv">Evidence</th>
					                      <th v-show="hidepharm_tableReferences_cnv">References</th>
					                    </tr>
					                  </thead>
					                  <tbody>
					                    <tr v-for="(item, index) in sortedPtpia_cnv" :key="item.gene" v-if="index < startRowPtpia_cnv + rowsPerPagePtpia_cnv && index >= startRowPtpia_cnv ">
					                      <td @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}">
					                        {{ item.gene}}
					                        <div v-if="item.network" class="dropdown_gene" data-html2canvas-ignore="true"><b-icon class="float-right dropbtn" icon="link"></b-icon>
						                    <div class="dropdown-content">
									            <a v-if = "item.eccode" class="page-link" :href="item.eccode" target="_blank">IntEnz</a>
									            <a v-if = "item.ensembl"class="page-link" :href="item.ensembl" target="_blank">Ensembl</a>
									            <a v-if = "item.hgnc" class="page-link" :href="item.hgnc" target="_blank">HGNC</a>
									            <a v-if = "item.mdanderson"class="page-link" :href="item.mdanderson" target="_blank">MDAnderson</a>
									            <a v-if = "item.kegg"class="page-link" :href="item.kegg" target="_blank">KEGG</a>
									            <a v-if = "item.uniprot"class="page-link" :href="item.uniprot" target="_blank">UniProt</a>
								          	</div>
								        </div> 
					                      </td>
					                      <td v-show="hidepharm_tableMutation_cnv" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
					                        {{ item.variant}}
					                      </td>
					                      <td v-show="hidepharm_tableTherapy_cnv" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
					                        {{ item.drug_name}}
					                      </td>
					                      <td v-show="hidepharm_tableEffect_cnv" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
					                        {{ item.variant_drug_association }}
					                      </td>
					                      <td v-show="hidepharm_tableDisease_cnv" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
					                        {{ item.tumor_list }}
					                      </td>
					                      <td v-show="hidepharm_tableEvidence_cnv" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
					                        {{ item.match_leve}}
					                      </td>
					                      <td v-show="hidepharm_tableReferences_cnv" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
					                        {{ item.ref_map }}
					                      </td>
					                    </tr>
					                  </tbody>
					                </table>
					                <div id="page-navigation" class="text-center" data-html2canvas-ignore="true">
					                  <table>
					                    <tr>
					                      <td>
					                        <select v-model="rowsPerPagePtpia_cnv" style="width: 10px">
					                          <option disabled value="">Rows per Page</option>
					                          <option>10</option>
					                          <option>20</option>
					                          <option>50</option>
					                        </select>
					                      </td>
					                      <td>{{startRowPtpia_cnv+1}}-{{rowsPerPagePtpia_cnv*currentPagePtpia_cnv}} out of {{sortedPtpia_cnv.length}}</td>
					                      <td><button @click=movePagesPtpia_cnv(-1)><b-icon icon="chevron-left"></b-icon></button></td>
					                      
					                      <td><button class="float-right" @click=movePagesPtpia_cnv(1)><b-icon icon="chevron-right"></b-icon></button></td>
					                    </tr>
					                  </table>
					                </div>
					                <div id="notepadCivic_cnv">
											<textarea style="width: 80%"ref="civicNotes_cnv" placeholder="Notes">{{civic_notes_cnv}}</textarea>
											<button class= 'butn' v-on:click="storeNotes('civic', 'cnv');">Save</button>
											<p v-show="savedCivicNotes_cnv"style="width: 50px" class="float-right">saved</p>
				            			</div> 
					            	</b-card>
					          	</b-collapse>
					          	<div v-if="visibleAffectCivic_cnv && visibleCivic_cnv" class="embed-responsive embed-responsive-16by9 z-depth-1-half column">
									<iframe id="civicVis_cnv" class="embed-responsive-item" src="http://localhost:3000/BioGraphVisart/civic_cnv" allowfullscreen></iframe>
								</div>
								<br>
					    		<br>
					        </div>
					       	<div v-if="cnvjsonavailable" ref = "content_mechanistic_drug_table_cnv" id="mechanistic_drug_table_content_cnv" class="row" style="margin-bottom: 1.5vw; margin-left: 1px;" >
					       		<v-tooltip bottom attach="#mechanistic_drug_table_content_cnv">
       							<template v-slot:activator="{ on, attrs }">
					          	<b-button
						            :class="visibleAffectCancer_cnv ? null : 'collapsed'"
						            :aria-expanded="visibleAffectCancer_cnv ? 'true' : 'false'"
						            aria-controls="collapse-4"
						            @click="visibleAffectCancer_cnv = !visibleAffectCancer_cnv"
						            block variant="primary"
						            v-bind:style="{ color:'white' }"
						            >
					            	<Strong style="color: white">CNV: Summary of Cancer Drugs Targeting Affected Genes</Strong><b-icon data-html2canvas-ignore="true" icon="info-circle" style="margin-left: 10px" v-bind="attrs" v-on="on"></b-icon> <b-icon data-html2canvas-ignore="true" class="float-right"icon="arrows-expand" v-if="visibleAffectCancer_cnv"></b-icon> <b-icon class="float-right" icon="arrows-collapse" v-else></b-icon>
					          	</b-button>
					          	</template>
					            <span > List of cancer drugs targeting the mutated gene. Information is obtained from DrugBank, Therapeutic Target Database, IUPHAR, and Santos <em>et al.</em>.</span>
					        	</v-tooltip>
					          	<b-collapse id="collapse-4" v-model="visibleAffectCancer_cnv" :class="{column:visibleCancer_cnv}" >
						            <b-card> 
						                <table class="table table-hover">
						                  <thead>
						                    <tr data-html2canvas-ignore="true">
						                      <td>
						                        	<v-text-field v-model="genes4_cnv" type="string" label="Gene"></v-text-field>
						                        	<button @click="sortMskpe_cnv('Gene')"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirGene4_cnv == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
						                        	</button>
						                      </td>
						                      <td>
						                        	<v-text-field :disabled="!hidemechanistic_drug_tableStatus_cnv" v-model="status4" type="string" label="Status" clearable></v-text-field>
						                        	<button id="checkbox18" @click="hidemechanistic_drug_tableStatus_cnv= !hidemechanistic_drug_tableStatus_cnv" style="margin-right: 10px;">
											        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidemechanistic_drug_tableStatus_cnv"></b-icon> 
											           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
											        </button>
											        <button @click="sortMskpe_cnv('Status')" :disabled="!hidemechanistic_drug_tableStatus_cnv"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirStatus4_cnv == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
											        </button>
						                      </td>
						                      <td>
						                        	<v-text-field :disabled="!hidemechanistic_drug_tableTherapy_cnv" v-model="therapy4_cnv" type="string" label="Therapy" clearable></v-text-field>
						                        	<button id="checkbox19" @click="hidemechanistic_drug_tableTherapy_cnv= !hidemechanistic_drug_tableTherapy_cnv" style="margin-right: 10px;">
											        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidemechanistic_drug_tableTherapy_cnv"></b-icon> 
											           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
											        </button>
											        <button @click="sortMskpe_cnv('Therapy')" :disabled="!hidemechanistic_drug_tableTherapy_cnv"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirTherapy4_cnv == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
											        </button>
						                      </td>
						                      <td>
						                        	<v-text-field :disabled="!hidemechanistic_drug_tableReferences_cnv" v-model="reference4_cnv" type="string" label="Reference" clearable></v-text-field>	
											        <button id="checkbox20" @click="hidemechanistic_drug_tableReferences_cnv= !hidemechanistic_drug_tableReferences_cnv" style="margin-right: 10px;">
											        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidemechanistic_drug_tableReferences_cnv"></b-icon> 
											           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
								        			</button>
								        			<button @click="sortMskpe_cnv('References')" :disabled="!hidemechanistic_drug_tableReferences_cnv"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirRef4_cnv == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
								        			</button>
						                      </td>
						                      <td>
						                      		<button class="downloadbutn float-right " @click="exportToPDF_mechanistic_drug_table_cnv()"><b-icon class="float-left" icon="download" style="margin-right: 3px" data-html2canvas-ignore="true"></b-icon>
						                      		</button>
						                      </td>
						                    </tr>
						                    <tr>
						                      <th >Gene</th>
						                      <th v-show="hidemechanistic_drug_tableStatus_cnv">Status</th>
						                      <th v-show="hidemechanistic_drug_tableTherapy_cnv" >Therapy</th>
						                      <th v-show="hidemechanistic_drug_tableReferences_cnv" >References</th>
						                    </tr>
						                  </thead>
						                  <tbody>
						                    <tr v-for="(item, index) in sortedMskpe_cnv" :key="item.gene" v-if="index < startRowMskpe_cnv + rowsPerPageMskpe_cnv && index >= startRowMskpe_cnv ">
						                      <td @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}">
						                        {{ item.gene }}
						                        <div v-if="item.network" class="dropdown_gene" data-html2canvas-ignore="true"><b-icon class="float-right dropbtn" icon="link"></b-icon>
								                    <div class="dropdown-content">
											            <a v-if = "item.eccode" class="page-link" :href="item.eccode" target="_blank">IntEnz</a>
											            <a v-if = "item.ensembl"class="page-link" :href="item.ensembl" target="_blank">Ensembl</a>
											            <a v-if = "item.hgnc" class="page-link" :href="item.hgnc" target="_blank">HGNC</a>
											            <a v-if = "item.mdanderson"class="page-link" :href="item.mdanderson" target="_blank">MDAnderson</a>
											            <a v-if = "item.kegg"class="page-link" :href="item.kegg" target="_blank">KEGG</a>
											            <a v-if = "item.uniprot"class="page-link" :href="item.uniprot" target="_blank">UniProt</a>
										          	</div>
										        </div> 
						                      </td>
						                      <td v-show="hidemechanistic_drug_tableStatus_cnv" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4} " class=text-xs-right>
						                        {{ item.approval_status }}
						                      </td>
						                      <td v-show="hidemechanistic_drug_tableTherapy_cnv" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4} " class=text-xs-right>
						                        {{ item.drug_name}}
						                      </td>
						                      <td v-show="hidemechanistic_drug_tableReferences_cnv" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4} " class=text-xs-right>
						                        {{ item.ref_map }}
						                      </td>
						                    </tr>
						                  </tbody>
						                </table>
						                <div id="page-navigation" class="text-center" data-html2canvas-ignore="true">
						                  <table>
						                    <tr>
						                      <td>
						                        <select v-model="rowsPerPageMskpe_cnv" style="width: 10px">
						                          <option disabled value="">Rows per Page</option>
						                          <option>10</option>
						                          <option>20</option>
						                          <option>50</option>
						                        </select>
						                      </td>
						                      <td>{{startRowMskpe_cnv+1}}-{{rowsPerPageMskpe_cnv*currentPageMskpe_cnv}} out of {{sortedMskpe_cnv.length}}</td>
						                      <td><button @click=movePagesMskpe_cnv(-1)><b-icon icon="chevron-left"></b-icon></button></td>
						                      
						                      <td><button class="float-right" @click=movePagesMskpe_cnv(1)><b-icon icon="chevron-right"></b-icon></button></td>
						                    </tr>
						                  </table>
						                </div>
						                <div id="notepadCancer_cnv">
											<textarea style="width: 80%"ref="cancerNotes_cnv" placeholder="Notes">{{cancer_notes_cnv}}</textarea>
											<button class= 'butn' v-on:click="storeNotes('cancer','cnv');">Save</button>
											<p v-show="savedCancerNotes_cnv"style="width: 50px" class="float-right">saved</p>
				            			</div> 
						          </b-card>
					          </b-collapse>
					          <div v-if="visibleAffectCancer_cnv && visibleCancer_cnv" class="embed-responsive embed-responsive-16by9 z-depth-1-half column">
								<iframe id="cancerVis_cnv" class="embed-responsive-item" src="http://localhost:3000/BioGraphVisart/cancer_cnv" allowfullscreen></iframe>
							</div> 
					        </div>
				        </b-collapse>
				    </div>
				    <div v-if="!cnvjson"ref = "content_adverse_table" id="adverse_table_content" class="row" style="margin-left: 10px; margin-bottom: 1.5vw">
				    	<v-tooltip bottom attach="#adverse_table_content">
       					<template v-slot:activator="{ on, attrs }">
				        <b-button
				          :class="visibleEffect ? null : 'collapsed'"
				          :aria-expanded="visibleEffect ? 'true' : 'false'"
				          aria-controls="collapse-4"
				          @click="visibleEffect = !visibleEffect"
				          v-bind:style="{ background: '#A9C0CB', color:'white' }"
				          block variant="primary"
				          >
				          <Strong style="color: white">Adverse Effect</Strong><b-icon data-html2canvas-ignore="true" icon="info-circle" style="margin-left: 10px" v-bind="attrs" v-on="on"></b-icon> <b-icon data-html2canvas-ignore="true" class="float-right"icon="arrows-expand" v-if="visibleEff"></b-icon> <b-icon class="float-right" icon="arrows-collapse" v-else></b-icon>
				        </b-button>
				        </template>
					            <span >List of drugs with known adverse effects.</span>
					        </v-tooltip>
				        <b-collapse id="collapse-4" v-model="visibleEffect" class="mt-2">
						   <b-card> 
				            <table class="table table-hover">
				              <thead>
				                <tr data-html2canvas-ignore="true">
				                  <td>
				                    	<v-text-field v-model="genes5" type="string" label="Gene"></v-text-field>
				                    	<button @click="sortadEff('Gene')"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirGene5 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
				                    	</button>
				                  </td>
				                  <td>
				                    	<v-text-field :disabled="!hide_adverse_tableMutation" v-model="status5" type="string" label="Mutation" clearable></v-text-field>
				                    	<button id="checkbox21" @click="hide_adverse_tableMutation= !hide_adverse_tableMutation" style="margin-right: 10px;">
								        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hide_adverse_tableMutation"></b-icon> 
								           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>	        
								           </button>
								        <button @click="sortadEff('Mutation')" :disabled="!hide_adverse_tableMutation"> <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirMut5 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
								        </button>
				                  </td>
				                  <td>
				                    	<v-text-field :disabled="!hide_adverse_tableTherapy" v-model="therapy5" type="string" label="Therapy" clearable></v-text-field>
				                    	<button id="checkbox22" @click="hide_adverse_tableTherapy= !hide_adverse_tableTherapy" style="margin-right: 10px;">
								        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hide_adverse_tableTherapy"></b-icon> 
								           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
								        </button>
								        <button @click="sortadEff('Therapy')" :disabled="!hide_adverse_tableTherapy"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirTherapy5 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon><
								        </button>
				                  </td>
				                  <td>
				                    	<v-text-field :disabled="!hide_adverse_tableEffect" v-model="effect5" type="number" label="Effect" clearable></v-text-field>
				                    	<button id="checkbox23" @click="hide_adverse_tableEffect= !hide_adverse_tableEffect" style="margin-right: 10px;">
								        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hide_adverse_tableEffect"></b-icon> 
								           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
								        </button>
								        <button @click="sortadEff('Effect')" :disabled="!hide_adverse_tableEffect"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirEffect5 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
								        </button>
				                  </td>
				                  <td>
				                    	<v-text-field :disabled="!hide_adverse_tableVariantType" v-model="variantType5" type="number" label="VariantType" clearable></v-text-field>
				                    	<button id="checkbox24" @click="hide_adverse_tableVariantType= !hide_adverse_tableVariantType" style="margin-right: 10px;">
								        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hide_adverse_tableVariantType"></b-icon>
								           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
								        </button>
								        <button @click="sortadEff('Disease')" :disabled="!hide_adverse_tableVariantType"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirDisease5 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
								        </button>
				                  </td>	
				                  <td>
				                    	<v-text-field :disabled="hide_adverse_tableEvidence" v-model="evidence5" type="number" label="Evidence" clearable></v-text-field>
				                    	<button id="checkbox25" @click="hide_adverse_tableEvidence= !hide_adverse_tableEvidence" style="margin-right: 10px;">
								        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hide_adverse_tableEvidence"></b-icon> 
								           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
								        </button>
								        <button @click="sortadEff('Evidence')" :disabled="hide_adverse_tableEvidence"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirEvidence5 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
								        </button>
				                  </td>	           
				                  <td>
				                    	<v-text-field :disabled="hide_adverse_tableReferences" v-model="reference5" type="string" label="Reference" clearable></v-text-field>
				                    	<button id="checkbox26" @click="hide_adverse_tableReferences= !hide_adverse_tableReferences" style="margin-right: 10px;">
								        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hidepharm_tableReferences"></b-icon> 
								           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
								        </button>
								        <button @click="sortadEff('References')" :disabled="hide_adverse_tableReferences" > <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirRef5 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
								        </button>
				                  </td>
				                  <td>
				                  		<button class="downloadbutn float-right " @click="exportToPDF_adverse_table()"><b-icon class="float-left" icon="download" style="margin-right: 3px" data-html2canvas-ignore="true"></b-icon>
				                  		</button>
				                  </td>
				                </tr>
				                <tr>
				                 <!--  <th data-html2canvas-ignore="true">
				                    <label class="form-checkbox">
				                      <input type="checkbox" v-model="selectAll" @click="select(direct_pharm_table )">
				                      <i class="form-icon"></i>
				                    </label>
				                  </th> -->
				                  <th>Gene</th>
				                  <th v-show="hide_adverse_tableMutation">Mutation</th>
				                  <th v-show="hide_adverse_tableTherapy">Therapy </th>
				                  <th v-show="hide_adverse_tableEffect" >Effect</th>
				                  <th v-show="hide_adverse_tableDisease">Disease </th>
				                  <th v-show="hide_adverse_tableEvidence">Evidence  </th>	
				                  <th v-show="hide_adverse_tableReferences" >References</th>
				                </tr>
				              </thead>
				              <tbody>
				                <tr v-for="(item, index) in sortedadEff" :key="item.gene" v-if="index < startRowadEff + rowsPerPageadEff && index >= startRowadEff ">
				                  <!-- <td class="text-xs-center" data-html2canvas-ignore="true">      
				                    <label class="form-checkbox">
				                        <input type="checkbox" :value="item.gene" v-model="checkedGenes">
				                        <i class="form-icon"></i>
				                    </label>
				                  </td> -->
				                  <td @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4} ">
				                    {{ item.gene}}
				                  </td>
				                  <td v-show="hide_adverse_tableMutation" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4} " class=text-xs-right>
				                    {{ item.variant }}
				                  </td>
				                  <td v-show="hide_adverse_tableTherapy" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4} " class=text-xs-right>
				                    {{ item.drug_name }}
				                  </td>
				                  <td v-show="hide_adverse_tableEffect" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4} " class=text-xs-right>
				                    {{ item.variant_drug_association }}
				                  </td>
				                  <td v-show="hide_adverse_tableDisease" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4} " class=text-xs-right>
				                    {{ item.variant_type}}
				                  </td>
				                  <td v-show="hide_adverse_tableEvidence" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4} " class=text-xs-right>
				                    {{ item.match_level}}
				                  </td>
				                  <td v-show="hide_adverse_tableReferences" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4} " class=text-xs-right>
				                    {{ item.ref_map}}
				                  </td>
				                </tr>
				              </tbody>
				            </table>
				            <div id="page-navigation" class="text-center" data-html2canvas-ignore="true">
				              <table>
				                <tr>
				                  <td>
				                    <select v-model="rowsPerPageadEff" style="width: 10px">
				                      <option disabled value="">Rows per Page</option>
				                      <option>10</option>
				                      <option>20</option>
				                      <option>50</option>
				                    </select>
				                  </td>
				                  <td>{{startRowadEff+1}}-{{rowsPerPageadEff*currentPageadEff}} out of {{sortedadEff.length}}</td>
				                  <td><button @click=movePagesadEff(-1)><b-icon icon="chevron-left"></b-icon></button></td>
				                  
				                  <td><button class="float-right" @click=movePagesadEff(1)><b-icon icon="chevron-right"></b-icon></button></td>
				                </tr>
				              </table>
				            </div>
				         </b-card>
				        </b-collapse>
				    </div>
				    <div v-if="!cnvjson"ref="content_ref" id="ref_content" class="row" style="margin-left: 10px; margin-bottom: 1.5vw">
				      <b-button
				        :class="visibleRef ? null : 'collapsed'"
				        :aria-expanded="visibleRef ? 'true' : 'false'"
				        aria-controls="collapse-4"
				        @click="visibleRef = !visibleRef"
				        class="text-center" 
				        block variant="primary"
				        v-bind:style="{ background: 'grey', color:'white' }"
				       >
				        <Strong style="color: white">References</Strong><b-icon class="float-right"icon="arrows-expand" v-if="visibleRef"></b-icon> <b-icon class="float-right"icon="arrows-collapse" v-else></b-icon>
				      </b-button>
				      <b-collapse id="collapse-4" v-model="visibleRef" class="mt-2">
				        <p data-html2canvas-ignore="true">The publications of the IDs given in the tables above. <button class="downloadbutn float-right " @click="exportToPDF_ref()"><b-icon class="float-left" icon="download" style="margin-right: 3px" data-html2canvas-ignore="true"></b-icon></button></p>
				        <b-card> 
				          <div data-html2canvas-ignore="true">
				              <v-text-field
				              v-model="search5"
				              append-icon="mdi-magnify"
				              label="Search"
				              single-line
				              hide-details
				              ></v-text-field>
				            </div>
				            <v-data-table
				              :search="search5"
				            :headers="refHeaders"
				            :items="appendix_reference_table"
				            item-key="rowid"
				            multi-sort
				            :items-per-page="-1"
				            class="elevation-1"
				            ref="refTable"
				          >
				          <template v-slot:item ="{ item }">
				          	<tr>
					          	<td>{{item.index}}</td>
					          	<td>{{item.combined}}</td>
					          	<td><a :href=item.url target="_blank">PubMed</a></td>
					        </tr>
				          </template>
				          </v-data-table>    
				        </b-card>
				      </b-collapse>
				    </div>
				    <div v-if="cnvjsonavailable" ref="content_ref_cnv" id="ref_content_cnv" class="row" style="margin-left: 10px; margin-bottom: 1.5vw">
				      <b-button
				        :class="visibleRef_cnv ? null : 'collapsed'"
				        :aria-expanded="visibleRef_cnv ? 'true' : 'false'"
				        aria-controls="collapse-4"
				        @click="visibleRef_cnv = !visibleRef_cnv"
				        class="text-center" 
				        block variant="primary"
				        v-bind:style="{ background: 'grey', color:'white' }"
				       >
				        <Strong style="color: white">CNV: References</Strong><b-icon class="float-right"icon="arrows-expand" v-if="visibleRef_cnv"></b-icon> <b-icon class="float-right"icon="arrows-collapse" v-else></b-icon>
				      </b-button>
				      <b-collapse id="collapse-4" v-model="visibleRef_cnv" class="mt-2">
				        <p data-html2canvas-ignore="true">The publications of the IDs given in the tables above. <button class="downloadbutn float-right " @click="exportToPDF_ref_cnv()"><b-icon class="float-left" icon="download" style="margin-right: 3px" data-html2canvas-ignore="true"></b-icon></button></p>
				        <b-card> 
				          <div data-html2canvas-ignore="true">
				              <v-text-field
				              v-model="search5_cnv"
				              append-icon="mdi-magnify"
				              label="Search"
				              single-line
				              hide-details
				              ></v-text-field>
				            </div>
				            <v-data-table
				              :search="search5_cnv"
				            :headers="refHeaders"
				            :items="appendix_reference_table_cnv"
				            item-key="rowid"
				            multi-sort
				            :items-per-page="-1"
				            class="elevation-1"
				            ref="refTable_cnv"
				          >
				          <template v-slot:item ="{ item }">
				          	<tr>
					          	<td>{{item.index}}</td>
					          	<td>{{item.combined}}</td>
					          	<td><a :href=item.url target="_blank">PubMed</a></td>
					        </tr>
				          </template>
				          </v-data-table>    
				        </b-card>
				      </b-collapse>
				    </div>
				    <div v-if="!cnvjson"ref="content_appendix_variant_table" id="appendix_variant_table_content" class="row" style="margin-bottom: 1.5vw; margin-left: 10px;">
				    	<v-tooltip bottom attach="#appendix_variant_table_content">
       					<template v-slot:activator="{ on, attrs }">
				      <b-button
				        :class="visibleAppendix ? null : 'collapsed'"
				        :aria-expanded="visibleAppendix ? 'true' : 'false'"
				        aria-controls="collapse-4"
				        @click="visibleAppendix = !visibleAppendix"
				        class="text-center" 
				        v-bind:style="{ background: 'grey', color:'white' }" 
				        block variant="primary"
				        >
				        <Strong style="color: white">Appendix</Strong><b-icon data-html2canvas-ignore="true" icon="info-circle" style="margin-left: 10px" v-bind="attrs" v-on="on"></b-icon><b-icon class="float-right"icon="arrows-expand" v-if="visibleAppendix"></b-icon> <b-icon class="float-right" icon="arrows-collapse" v-else></b-icon>
				      </b-button>
				      </template>
					            <span >All the somatic variants of the patient with their dbSNP and COSMIC IDs.</span>
					            </v-tooltip> 
				      <b-collapse id="collapse-4" v-model="visibleAppendix" class="mt-2">
						  <b-card>
				            <table class="table table-hover">
				                  <thead>
				                    <tr data-html2canvas-ignore="true">
				                      <!-- <td></td> -->
				                      <td>
				                        	<v-text-field v-model="genes6" type="string" label="Gene"></v-text-field>
				                        	<button @click="sortAppendix('Gene')"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirGene6 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
				                        	</button>
				                      </td>
				                      <td>
				                        	<v-text-field :disabled="!hideappendix_variant_tableMutation" v-model="mutations6" type="string" label="Mutation" clearable></v-text-field>
				                        	<button id="checkbox27" @click="hideappendix_variant_tableMutation= !hideappendix_variant_tableMutation" style="margin-right: 10px;">
								        		<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hideappendix_variant_tableMutation"></b-icon> 
								           		<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
								        	</button>
								        	<button @click="sortAppendix('Mutation')"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirMut6 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
								        	</button>
				                      </td>
				                     <td>
				                        	<v-text-field :disabled="!hideappendix_variant_tableConsequence" v-model="consequence6" type="string" label="Consequence" clearable></v-text-field>
				                        	<button id="checkbox28" @click="hideappendix_variant_tableConsequence= !hideappendix_variant_tableConsequence" style="margin-right: 10px;">
									        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hideappendix_variant_tableConsequence"></b-icon> 
									           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
									        </button>
									        <button @click="sortAppendix('Consequence')"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirConsequence6 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
									        </button>
				                      </td>
				                      <td>
				                        	<v-text-field :disabled="!hideappendix_variant_tableVAF" v-model="vaf6" type="string" label="VAF" clearable></v-text-field>
				                        	<button id="checkbox29" @click="hideappendix_variant_tableVAF= !hideappendix_variant_tableVAF" style="margin-right: 10px;">
									        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hideappendix_variant_tableVAF"></b-icon> 
									           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
									        </button>
									        <button @click="sortAppendix('VAF')"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirVaf6 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></button>
				                      </td>
				                      <td>
				                        	<v-text-field :disabled="!hideappendix_variant_tabledbSNP" v-model="dbSNP6" type="string" label="dbSNP" clearable></v-text-field>
				                        	<button id="checkbox30" @click="hideappendix_variant_tabledbSNP= !hideappendix_variant_tabledbSNP" style="margin-right: 10px;">
									        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hideappendix_variant_tabledbSNP"></b-icon> 
									           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
									        </button>
									        <button @click="sortAppendix('dbSNP')"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirdbSNP6 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></button>
				                      </td>
				                      <td>
				                        	<v-text-field :disabled="!hideappendix_variant_tableCosmic" v-model="cosmic6" type="string" label="COSMIC" clearable></v-text-field>
				                        	<button id="checkbox31" @click="hideappendix_variant_tableCosmic= !hideappendix_variant_tableCosmic" style="margin-right: 10px;">
									        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hideappendix_variant_tableCosmic"></b-icon> 
									           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
									        </button>
									        <button @click="sortAppendix('COSMIC')"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirCosmic6 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
									        </button>
				                      </td>
				                      <td>
					                      	<button class="downloadbutn float-right " @click="exportToPDF_appendix_variant_table()"><b-icon class="float-left" icon="download" style="margin-right: 3px" data-html2canvas-ignore="true"></b-icon>
					                      	</button>
				                      </td>
				                    </tr>
				                    <tr>
				                      <!-- <th data-html2canvas-ignore="true">
				                        <label class="form-checkbox">
				                          <input type="checkbox" v-model="selectAll" @click="select(appendix_variant_table)">
				                          <i class="form-icon"></i>
				                        </label>
				                      </th> -->
				                      <th >Gene</th>
				                      <th v-show="hideappendix_variant_tableMutation">Mutation</th>
				                      <th v-show="hideappendix_variant_tableConsequence">Consequence</th>
				                      <th v-show="hideappendix_variant_tableVAF">VAF</th>
				                      <th v-show="hideappendix_variant_tabledbSNP">dbSNP</th>
				                      <th v-show="hideappendix_variant_tableCosmic">COSMIC</th>
				                    </tr>
				                  </thead>
				                  <tbody>
				                    <tr v-for="(item, index) in sortedAppendix" :key="item.gene" v-if="index < startRowAppendix + rowsPerPageAppendix && index >= startRowAppendix ">
										<!-- <td class="text-xs-center" data-html2canvas-ignore="true">      
				                        <label class="form-checkbox">
				                            <input type="checkbox" :value="item.gene" v-model="checkedGenes">
				                            <i class="form-icon"></i>
				                        </label>
				                      </td> -->
				                      <td @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4} ">
				                        {{ item.gene }}
				                      </td>
				                      <td v-show="hideappendix_variant_tableMutation" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4} " class=text-xs-right>
				                        {{ item.mutation }}
				                      </td>
				                      <td v-show="hideappendix_variant_tableConsequence" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4} " class=text-xs-right>
				                        {{ item.Consequence}}
				                      </td>
				                      <td v-show="hideappendix_variant_tableVAF" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4} " class=text-xs-right>
				                        {{ item.vaf}}
				                      </td>
				                      <td v-show="hideappendix_variant_tabledbSNP" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4} " class=text-xs-right>
				                        {{ item.dbSNP }}
				                      </td>
				                      <td v-show="hideappendix_variant_tableCosmic" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4} " class=text-xs-right>
				                        {{ item.COSMIC }}
				                      </td>
				                    </tr>
				                  </tbody>
				                </table>
				                <div id="page-navigation" class="text-center" data-html2canvas-ignore="true">
				                  <table>
				                    <tr>
				                      <td>
				                        <select v-model="rowsPerPageAppendix" style="width: 10px">
				                          <option disabled value="">Rows per Page</option>
				                          <option>10</option>
				                          <option>20</option>
				                          <option>50</option>
				                        </select>
				                      </td>
				                      <td>{{startRowAppendix+1}}-{{rowsPerPageAppendix*currentPageAppendix}} out of {{sortedAppendix.length}}</td>
				                      <td><button @click=movePagesAppendix(-1)><b-icon icon="chevron-left"></b-icon></button></td>
				                      
				                      <td><button class="float-right" @click=movePagesAppendix(1)><b-icon icon="chevron-right"></b-icon></button></td>
				                    </tr>
				                  </table>
				                </div>
				          </b-card>
				      </b-collapse>
				    </div>
				    <div v-if="cnvjsonavailable" ref="content_appendix_variant_table_cnv" id="appendix_variant_table_content_cnv" class="row" style="margin-left: 10px;">
				    	<v-tooltip bottom attach="#appendix_variant_table_content_cnv">
       					<template v-slot:activator="{ on, attrs }">
				      <b-button
				        :class="visibleAppendix_cnv ? null : 'collapsed'"
				        :aria-expanded="visibleAppendix_cnv ? 'true' : 'false'"
				        aria-controls="collapse-4"
				        @click="visibleAppendix_cnv = !visibleAppendix_cnv"
				        class="text-center" 
				        v-bind:style="{ background: 'grey', color:'white' }" 
				        block variant="primary"
				        >
				        <Strong style="color: white">CNV: Appendix</Strong><b-icon data-html2canvas-ignore="true" icon="info-circle" style="margin-left: 10px" v-bind="attrs" v-on="on"></b-icon><b-icon class="float-right"icon="arrows-expand" v-if="visibleAppendix_cnv"></b-icon> <b-icon class="float-right" icon="arrows-collapse" v-else></b-icon>
				      </b-button>
				      </template>
					  <span >All the somatic variants of the patient with their dbSNP and COSMIC IDs.</span>
					  </v-tooltip> 
				      <b-collapse id="collapse-4" v-model="visibleAppendix_cnv" class="mt-2">
						  <b-card>
				            <table class="table table-hover">
				                  <thead>
				                    <tr data-html2canvas-ignore="true">
				                      <td>
				                        	<v-text-field v-model="genes6_cnv" type="string" label="Gene"></v-text-field>
				                        	<button @click="sortAppendix('Gene')"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirGene6_cnv == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
				                        	</button>
				                      </td>
				                      <td>
				                        	<v-text-field :disabled="!hideappendix_variant_tableType_cnv" v-model="type6_cnv" type="string" label="Type" clearable></v-text-field>
				                        	<button id="checkbox27" @click="hideappendix_variant_tableType_cnv= !hideappendix_variant_tableType_cnv" style="margin-right: 10px;">
								        		<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hideappendix_variant_tableType_cnv"></b-icon> 
								           		<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
								        	</button>
								        	<button @click="sortAppendix_cnv('Type')"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirType6_cnv == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
								        	</button>
				                      </td>
				                     <td>
				                        	<v-text-field :disabled="!hideappendix_variant_tableCopy_cnv" v-model="copy6_cnv" type="string" label="CopyNumber" clearable></v-text-field>
				                        	<button id="checkbox28" @click="hideappendix_variant_tableConpy_cnv= !hideappendix_variant_tableCopy_cnv" style="margin-right: 10px;">
									        	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-fill" v-if="hideappendix_variant_tableCopy_cnv"></b-icon> 
									           	<b-icon data-html2canvas-ignore="true" class="float-right" icon="eye-slash" v-else></b-icon>
									        </button>
									        <button @click="sortAppendix_cnv('Copy Number')"><b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirConpy6_cnv == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon>
									        </button>
				                      </td>
				                      <td>
					                      	<button class="downloadbutn float-right " @click="exportToPDF_appendix_variant_table_cnv()"><b-icon class="float-left" icon="download" style="margin-right: 3px" data-html2canvas-ignore="true"></b-icon>
					                      	</button>
				                      </td>
				                    </tr>
				                    <tr>
				                      <th >Gene</th>
				                      <th v-show="hideappendix_variant_tableType_cnv">Type</th>
				                      <th v-show="hideappendix_variant_tableCopy_cnv">Copy Number</th>
				                    </tr>
				                  </thead>
				                  <tbody>
				                    <tr v-for="(item, index) in sortedAppendix_cnv" :key="item.gene" v-if="index < startRowAppendix_cnv + rowsPerPageAppendix_cnv && index >= startRowAppendix_cnv ">
				                      <td @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4} ">
				                        {{ item.gene }}
				                      </td>
				                      <td v-show="hideappendix_variant_tableType_cnv" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4} " class=text-xs-right>
				                        {{ item.type }}
				                      </td>
				                      <td v-show="hideappendix_variant_tableCopy_cnv" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4} " class=text-xs-right>
				                        {{ item.copy_number}}
				                      </td>
				                    </tr>
				                  </tbody>
				                </table>
				                <div id="page-navigation" class="text-center" data-html2canvas-ignore="true">
				                  <table>
				                    <tr>
				                      <td>
				                        <select v-model="rowsPerPageAppendix_cnv" style="width: 10px">
				                          <option disabled value="">Rows per Page</option>
				                          <option>10</option>
				                          <option>20</option>
				                          <option>50</option>
				                        </select>
				                      </td>
				                      <td>{{startRowAppendix_cnv+1}}-{{rowsPerPageAppendix_cnv*currentPageAppendix_cnv}} out of {{sortedAppendix_cnv.length}}</td>
				                      <td><button @click=movePagesAppendix_cnv(-1)><b-icon icon="chevron-left"></b-icon></button></td>
				                      
				                      <td><button class="float-right" @click=movePagesAppendix_cnv(1)><b-icon icon="chevron-right"></b-icon></button></td>
				                    </tr>
				                  </table>
				                </div>
				          </b-card>
				      </b-collapse>
				    </div>
			  	</div>
			  	<br><br><br>
			  	<footer>
			      <div class="footerIndex">
			          <a class="page-link border-0 border-dark" href="/imprint/">Imprint</a>
			          <a class="page-link border-0 border-dark" href="/datenschutzerklarung/" aria-current="page">Datenschutzerklärung</a>   
			          <p style="color:grey;"><b>Disclaimer</b> The report created by ClinVAP is intended as a hypothesis generating framework and thus for research use only, and not for diagnostic or clinical purposes. Information provided in the report does not replace a physician's medical judgment and usage is entirely at your own risk. The providers of this resource shall in no event be liable for any direct, indirect, incidental, consequential, or exemplary damages.</p>
			      </div> 
				</footer>
			</v-flex>
	  	</v-layout>
  	</v-container>
</template>


<script>
  import axios from "axios";
  import html2pdf from 'html2pdf.js'
  import pecaxdb from '../src/db'
  import arangodb from 'arangojs'

  export default {
    head: {
      title: 'PeCax'
    },
    components: {
        },
    data (){
      return {    
      	timer:'',
        vcffile:"",
        assembly:"",
        status:"",
        jobid:"",
        filename:"",
        showNetwork:false,
        jsongenerated:false,
        jsonReport:"",
        cnvjsonavailable:false,
        cnvjsonReport:"",
        drivertypes_cnv : {},
        icd10:"",
        diagnosisfilter:"",
        cnvjson:false,

        currentSort:'Gene',
        currentSortDir:'asc',
        currentSortDirGene1:'asc',
        currentSortDirMut1:'asc',
        currentSortDirType1:'asc',
        currentSortDirConf1:'asc',
        currentSortDirRef1:'asc',

        currentSort_cnv:'Gene',
        currentSortDir_cnv:'asc',
        currentSortDirGene1_cnv:'asc',
        currentSortDirType1_cnv:'asc',
        currentSortDirTumorList1_cnv:'asc',
        currentSortDirDriverType1_cnv:'asc',
        currentSortDirRef1_cnv:'asc',

        currentSortPtpda:'Gene',
        currentSortDirPtpda:'asc',
        currentSortDirGene2:'asc',
        currentSortDirStat2:'asc',
        currentSortDirTherapy2:'asc',
        currentSortDirConf2:'asc',
        currentSortDirRef2:'asc',

        currentSortPtpda_cnv:'Gene',
        currentSortDirPtpda_cnv:'asc',
        currentSortDirGene2_cnv:'asc',
        currentSortDirStat2_cnv:'asc',
        currentSortDirTherapy2_cnv:'asc',
        currentSortDirConf2_cnv:'asc',
        currentSortDirRef2_cnv:'asc',

        currentSortPtpia:'Gene',
        currentSortDirPtpia:'asc',
        currentSortDirGene3:'asc',
        currentSortDirMut3:'asc',
        currentSortDirEffect3:'asc',
        currentSortDirDisease3:'asc',
        currentSortDirTherapy3:'asc',
        currentSortDirEvidence3:'asc',
        currentSortDirRef3:'asc',

        currentSortMskpe:'Gene',
        currentSortDirMskpe:'asc',
        currentSortDirGene4:'asc',
        currentSortDirMut4:'asc',
        currentSortDirEffect4:'asc',
        currentSortDirDisease4:'asc',
        currentSortDirTherapy4:'asc',
        currentSortDirEvidence4:'asc',
        currentSortDirRef4:'asc',

        currentSortPtpia_cnv:'Gene',
        currentSortDirPtpia_cnv:'asc',
        currentSortDirGene3_cnv:'asc',
        currentSortDirMut3_cnv:'asc',
        currentSortDirEffect3_cnv:'asc',
        currentSortDirDisease3_cnv:'asc',
        currentSortDirTherapy3_cnv:'asc',
        currentSortDirEvidence3_cnv:'asc',
        currentSortDirRef3_cnv:'asc',

        currentSortMskpe_cnv:'Gene',
        currentSortDirMskpe_cnv:'asc',
        currentSortDirGene4_cnv:'asc',
        currentSortDirMut4_cnv:'asc',
        currentSortDirEffect4_cnv:'asc',
        currentSortDirDisease4_cnv:'asc',
        currentSortDirTherapy4_cnv:'asc',
        currentSortDirEvidence4_cnv:'asc',
        currentSortDirRef4_cnv:'asc',

        currentSortadEff:'Gene',
        currentSortDiradEff:'asc',
        currentSortDirGene5:'asc',
        currentSortDirMut5:'asc',
        currentSortDirTherapy5:'asc',
        currentSortDirEffect5:'asc',
        currentSortDirVariantType5:'asc',
        currentSortDirEvidence5:'asc',
        currentSortDirRef5:'asc',

        currentSortAppendix:'Gene',
        currentSortDirAppendix:'asc',
        currentSortDirGene5:'asc',
        currentSortDirMut5:'asc',
        currentSortDirdbSNP5:'asc',
        currentSortDirCosmic5:'asc',

        currentSortAppendix_cnv:'Gene',
        currentSortDirAppendix_cnv:'asc',
        currentSortDirGene6_cnv:'asc',
        currentSortDirType6_cnv:'asc',
        currentSortDirConpy6_cnv:'asc',

        startRow: 0,
        currentPage: 1,
        rowsPerPage: 10,

        startRow_cnv: 0,
        currentPage_cnv: 1,
        rowsPerPage_cnv: 10,

        startRowPtpda: 0,
        currentPagePtpda: 1,
        rowsPerPagePtpda: 10,

        startRowPtpda_cnv: 0,
        currentPagePtpda_cnv: 1,
        rowsPerPagePtpda_cnv: 10,

        startRowPtpia: 0,
        currentPagePtpia: 1,
        rowsPerPagePtpia: 10,

        startRowMskpe: 0,
        currentPageMskpe: 1,
        rowsPerPageMskpe: 10,

        startRowPtpia_cnv: 0,
        currentPagePtpia_cnv: 1,
        rowsPerPagePtpia_cnv: 10,

        startRowMskpe_cnv: 0,
        currentPageMskpe_cnv: 1,
        rowsPerPageMskpe_cnv: 10,

        startRowadEff: 0,
        currentPageadEff: 1,
        rowsPerPageadEff: 10,

        startRowAppendix: 0,
        currentPageAppendix: 1,
        rowsPerPageAppendix: 10,

        startRowadEff_cnv: 0,
        currentPageadEff_cnv: 1,
        rowsPerPageadEff_cnv: 10,

        startRowAppendix_cnv: 0,
        currentPageAppendix_cnv: 1,
        rowsPerPageAppendix_cnv: 10,

        visibleDrivers: true,
        visibleDrivers_cnv: true,
        visibleDrivergenes : false,
        visibleDrivergenes_cnv: false,
        visiblePharma: true,
        visiblePharma_cnv: true,
        visiblePharmaco_cnv:false,
        visiblePharmaco:false,
        visibleAffect: true,
        visibleAffectCivic: true,
        visibleCivic:false,
        visibleAffectCancer: true,
        visibleCancer:false,
        visibleAffect_cnv: true,
        visibleAffectCivic_cnv: true,
        visibleCivic_cnv:false,
        visibleAffectCancer_cnv: true,
        visibleCancer_cnv:false,
        visibleEffect: false,
        visibleRef: false,
        visibleAppendix: false,
        visibleRef_cnv: false,
        visibleAppendix_cnv: false,

        showTable:false,
        showStatus:true,
        showFileLoad:true,
        driver_table: [],
        driver_table_cnv: [],
        direct_pharm_table : [],
        direct_pharm_table_cnv : [],
        pharm_table : [],
        mechanistic_drug_table: [],
        pharm_table_cnv : [],
        mechanistic_drug_table_cnv: [],
        adEff: [],
        appendix_reference_table: [],
        appendix_reference_table_cnv: [],
        appendix_variant_table_cnv: [],
        refHeaders: [
            {text: 'Id',
             align:'left',
             sortable: false,
             value: 'rowid'},
            {text: 'Citation', value: 'citation'},
            {text: 'url', value: 'url'},
        ],
        appendix_variant_table: [],

        genesall:'',
        therapyall:'',
        diseaseall:'',
        mutationall:'',

        genes1:'',
        mutations1:'',
        consequence1:'',
        driverType1:'',
        tumorType1:'',
        vaf1:'',
        reference1:'',

        genes1_cnv:'',
        type1_cnv:'',
        copy1_cnv:'',
        driverType1_cnv:'',
        tumorList_cnv:'',
        effect1_cnv:'',
        reference1_cnv:'',

        genes2:'',
        mutation2:'',
        therapy2:'',
        effect2:'',
        disease2:'',
        evidence2:'',
        reference2:'',

        genes2_cnv:'',
        mutation2_cnv:'',
        therapy2_cnv:'',
        effect2_cnv:'',
        disease2_cnv:'',
        evidence2_cnv:'',
        reference2_cnv:'',

        genes3:'',
        mutations3:'',
        therapy3:'',
        effect3:'',
        disease3:'',
        reference3:'',
        evidence3:'',

        genes4:'',
        status4:'',
        therapy4:'',
        reference4:'',

        genes3_cnv:'',
        mutations3_cnv:'',
        therapy3_cnv:'',
        effect3_cnv:'',
        disease3_cnv:'',
        reference3_cnv:'',
        evidence3_cnv:'',

        genes4_cnv:'',
        status4_cnv:'',
        therapy4_cnv:'',
        reference4_cnv:'',

        genes5:'',
        mutations5:'',
        therapy5:'',
        effect5:'',
        variantType5:'',
        reference5:'',
        evidence5:'',

        search5: '',
      
        genes6:'',
        mutations6:'',
        consequence6:'',
        vaf6:'',
        dbSNP6:'',
        cosmic6:'',

        search5_cnv: '',
      
        genes6_cnv:'',
        type6_cnv:'',
        copy6_cnv:'',

        selected: [],
        checkedGenes:[],
        selectAll:false,
        hideColumns:true,
        hidedriver_tableMutation:true,
        hidedriver_tableDriverType:true,
        hidedriver_tableConsequence:true,
        hidedriver_tableVAF:true,
        hidedriver_tableTumorType:true,
        hidedriver_tableReferences:true,

        hidedriver_tableType_cnv:true,
        hidedriver_tableDriverType_cnv:true,
        hidedriver_tableTumorList_cnv:true,
        hidedriver_tableReferences_cnv:true,

        hidedirect_pharm_tableMutation:true,
        hidedirect_pharm_tableTherapy:true,
        hidedirect_pharm_tableEffect:true,
        hidedirect_pharm_tableDisease:true,
        hidedirect_pharm_tableEvidence:true,
        hidedirect_pharm_tableReferences:true,

        hidedirect_pharm_tableMutation_cnv:true,
        hidedirect_pharm_tableTherapy_cnv:true,
        hidedirect_pharm_table:true,
        hidedirect_pharm_tableDisease_cnv:true,
        hidedirect_pharm_tableEvidence_cnv:true,
        hidedirect_pharm_tableReferences_cnv:true,
        hidedirect_pharm_tableEffect_cnv:true,

        hidepharm_tableMutation:true,
        hidepharm_tableEffect:true,
        hidepharm_tableDisease:true,
        hidepharm_tableEvidence:true,
        hidepharm_tableReferences:true,
        hidepharm_tableTherapy:true,
        hidemechanistic_drug_tableStatus:true,
        hidemechanistic_drug_tableTherapy:true,
        hidemechanistic_drug_tableReferences:true,

         hidepharm_tableMutation_cnv:true,
        hidepharm_tableEffect_cnv:true,
        hidepharm_tableDisease_cnv:true,
        hidepharm_tableEvidence_cnv:true,
        hidepharm_tableReferences_cnv:true,
        hidepharm_tableTherapy_cnv:true,
        hidemechanistic_drug_tableStatus_cnv:true,
        hidemechanistic_drug_tableTherapy_cnv:true,
        hidemechanistic_drug_tableReferences_cnv:true,

        hide_adverse_tableMutation:true,
        hide_adverse_tableTherapy:true,
        hide_adverse_tableEffect:true,
        hide_adverse_tableVariantType:true,
        hide_adverse_tableEvidence:true,
        hide_adverse_tableReferences:true,
        hideappendix_variant_tableMutation:true,
        hideappendix_variant_tableConsequence:true,
        hideappendix_variant_tableVAF:true,
        hideappendix_variant_tabledbSNP:true,
        hideappendix_variant_tableCosmic:true,

        hideappendix_variant_tableType_cnv:true,
        hideappendix_variant_tableCopy_cnv:true,

        drivergenes_notes:"Notes",
        savedDrivergenesNotes:false,
        pharmaco_notes:"Notes",
        savedPharmacoNotes:false,
        civic_notes:"Notes",
        savedCivicNotes:false,
        cancer_notes:"Notes",
        savedCancerNotes:false,
        drivergenes_notes_cnv:"Notes",
        savedDrivergenesNotes_cnv:false,
        pharmaco_notes_cnv:"Notes",
        savedPharmacoNotes_cnv:false,
        civic_notes_cnv:"Notes",
        savedCivicNotes_cnv:false,
        cancer_notes_cnv:"Notes",
        savedCancerNotes_cnv:false,
      }
    },
    methods: {
    	startAnalysis(){
    		var url = document.location.href;
		    var params = url.split('?')[1].split('&');
		    var data = {}; 
		    var tmp;
    		for (var i = 0, l = params.length; i < l; i++) {
		         tmp = params[i].split('=');
		         data[tmp[0]] = tmp[1];
		    }
		    // new analysis
		    if(data["username"] == localStorage.getItem("username") && data["jobid"] == localStorage.getItem("jobid") && data["assembly"] && data["assembly"] == localStorage.getItem("assembly")){	
		    	this.username = localStorage.getItem("username")
				this.jobid = localStorage.getItem("jobid");
				pecaxdb.getJsonFromJobID(new arangodb.Database('/db/'), arangodb.aqlQuery, this.username, this.jobid).then(json => { 
					if(Object.keys(json._result[0].json_file).length > 0){
						this.showStatus = false;
						this.showNetwork = false;
			    		this.getJsonFromJobID(this.jobid, this.username)
			    	}
			    	else{
			    		this.assembly = localStorage.getItem("assembly");
			    		this.getVcfStatus(this.jobid, this.username, false)
			    		this.icd10 = localStorage.getItem("diagnosis")
			    		this.diagnosisfilter = localStorage.getItem("filter")
			    	}
			    })
	    	}
	    	// json as input
	    	else if(data["username"] == localStorage.getItem("username") && localStorage.getItem("json") && !data["jobid"] && data["json"]){
	    		this.showStatus = false;
	    		this.username = localStorage.getItem("username")
	    		var newjob = pecaxdb.enterdb(new arangodb.Database('/db/'), this.username, "")
		    		.then(res => {return res});
		    	newjob.then(res => {
		    		var as = res[0]; 
		    		this.jobid = res[1];
		    		var ids = localStorage.getItem("jobids");
		    		if(ids == "undefined"){
		    			ids = "";
		    		}
					localStorage.setItem("jobids", ids+","+this.jobid)
					this.cnvjson =(localStorage.getItem("cnvjson") == 'true'); 
					if(this.cnvjson){
						this.storeJsonInDB(JSON.parse(localStorage.getItem("json")), this.jobid, this.username, "", "",'cnv')
						this.showJSON_cnv(this.username, JSON.parse(localStorage.getItem("json")), this.jobid)
					}
					else{
						this.storeJsonInDB(JSON.parse(localStorage.getItem("json")), this.jobid, this.username);
					
		    			this.showJSON(this.username, JSON.parse(localStorage.getItem("json")), this.jobid)
		    		}
	    			this.showNetwork=true;
	    			this.$refs.loader1.style.visibility="visible";
		    	}) 	
	    		
	    	}
	    	// uuid known
	    	else if(data["username"] ==  localStorage.getItem("username") && data["json"] &&  localStorage.getItem("json") && data["jobid"] ==localStorage.getItem("jobid") && (localStorage.getItem("drivergenes") || localStorage.getItem("pharmaco") || localStorage.getItem("civic") || localStorage.getItem("cancer"))){
	    		this.username = localStorage.getItem("username")
	    		this.jobid = localStorage.getItem("jobid");
	    		this.showStatus = false;
	    		let uuids = [localStorage.getItem("drivergenes"),localStorage.getItem("pharmaco"), localStorage.getItem("civic"), localStorage.getItem("cancer")]
	    		this.showJSON(this.username, Json.parse(localStorage.getItem("json")), this.jobid, uuids)
	    	}
	    	// jobid known
	    	else if(data["username"] == localStorage.getItem("username") && data["jobid"] == localStorage.getItem("jobid")){
	    		this.username = localStorage.getItem("username")
	    		this.jobid = localStorage.getItem("jobid");
	    		this.showStatus = false;
				this.showNetwork=false;

	    		this.getJsonFromJobID(this.jobid, this.username)
	    	}
    	},
    	getVcfStatus(jobid, username, stop = false){
			var status = axios.get('/clinvap/results/'+username+'_'+jobid+'.vcf'+'/status')
				.then(function (response) {
				   	return response.data.Status;
				})
				.catch(error => {
			    	if(error.response.status == 404 || error.response.status == 502){
			    		this.timer = setTimeout(function(scope){scope.getVcfStatus(jobid, username, stop)}, 10000, this);
			    	}
			    	else{
			    		console.log(error);
			    		clearTimeout(this.timer)
			    		return error.response;
			    	}
		 		})
			status.then(res => {
			  	if(res == "Success,Finished"  && this.status != "Success,Finished" && !stop){
			  		clearTimeout(this.timer)
			  		this.displayJSON(jobid, username);
			  		this.status = res;
			  		this.showNetwork=true;
			  		stop = true
			  		return
			  	}
			  	else if(res == "Failed,Finished" && this.status != "Failed,Finished" && !stop){
			  		this.status = res;
			  		stop= true
			  		clearTimeout(this.timer)
			  		return
			  	}
			  	else{
			  		this.status=res;
			  		clearTimeout(this.timer)
			  		this.timer = setTimeout(function(scope){scope.getVcfStatus(jobid, username, stop)}, 30000,this);
			  	}})
			return
	    },
	    showJSON(username, jsonfile=null, jobid=null, uuids = null){
	    	// info from json
    		this.jsongenerated = true;
    		this.driver_table= jsonfile.driver_table;
    		var drivertypes = {}
    		for(let item  of this.driver_table){
    			item.tumor_list = item.tumor_list.replaceAll("|", " | ")
    			item.Consequence = item.Consequence.replaceAll("_", " ")
    			item.ref_map = item.ref_map.replaceAll(",", ", ")
    			if(!drivertypes.hasOwnProperty(item.gene)){
    				drivertypes[item.gene] = item.driver_role
    			}
	    	}
	        this.direct_pharm_table  = jsonfile.direct_pharm_table ;
	        for(let item  of this.direct_pharm_table){
	        	item.drug_name = item.drug_name.replaceAll("|", " | ")
    			item.tumor_list = item.tumor_list.replaceAll("|", " | ")
    			item.ref_map = item.ref_map.replaceAll(",", ", ")
	    	}
	        this.pharm_table  = jsonfile.pharm_table ;
	        for(let item  of this.pharm_table){
    			item.tumor_list = item.tumor_list.replaceAll("|", " | ")
    			item.ref_map = item.ref_map.replaceAll(",", ", ")
	    	}
	        this.mechanistic_drug_table = jsonfile.mechanistic_drug_table;
	        for(let item  of this.mechanistic_drug_table){
    			item.approval_status  = item.approval_status .replaceAll("|", " | ")
    			item.ref_map = item.ref_map.replaceAll(",", ", ")
	    	}
	        this.adEff = jsonfile.adverse_table;
	        this.appendix_reference_table = jsonfile.appendix_reference_table;
	        for(let item  of this.appendix_reference_table){
	        	if(item.combined.includes("et al")){
		        	item.url =  "https://www.ncbi.nlm.nih.gov/pubmed/?term="+[item.combined.split('et al')[0],item.combined.split('.')[1].split(',')[1].trim().split(' ').join('+'), item.combined.split(',').slice(-1)[0]].join('+')
		        }
	        }
	        this.appendix_variant_table = jsonfile.appendix_variant_table;
	        for(let item  of this.appendix_variant_table){
    			item.Consequence = item.Consequence.replaceAll("_", " ")
    			item.COSMIC = item.COSMIC.replaceAll(",", ", ")
	    	}
	    	this.showTable = true;
	    	if(jobid == null){
	    		return
	    	}
	    	if(localStorage.getItem("cnvfileavailable") == "true" && !this.cnvjsonavailable){
		    	var cnvjsonReportjson = axios.get('/clinvap/results/'+username+'_'+jobid+'.cnv.json')
		    		.then(res=>{return res.data})
		    	cnvjsonReportjson.then(res => {
			    	if(res){
		    			this.cnvjsonReport = res;
		    			this.cnvjsonavailable = true;
		    			this.storeJsonInDB(res, jobid, username, "", "",'cnv')
		    			this.showJSON_cnv(username, res, jobid)
		    		}
		    	})
		    }
	    	// get uuids
	    	if(!uuids){
		        var drivergeneslist = this.driver_table.map(a => a.gene); 
	    		var res_driver = this.getGraphFromGenes(drivergeneslist, jobid, username, "drivergene", "Drivergene network", "drivergenes", "Somatic Mutations in Known Driver Genes","", drivertypes)
	    		res_driver.then(res => {
	    			var pharmacogeneslist = this.direct_pharm_table.map(a => a.gene); 
		    		var res_pharmaco = this.getGraphFromGenes(pharmacogeneslist, jobid, username, "pharmacogenetic_effect", "Pharmacogenetic network", "pharmaco", "Somatic Mutations with Known Pharmacogenetic Effect")
		    		res_pharmaco.then(res => {
		    			var pharmgeneslist = this.pharm_table.map(a => a.gene); 
			    		var res_civic = this.getGraphFromGenes(pharmgeneslist, jobid, username, "targeted_gene", "Mechanistic drug network", "civic", "Pharmacogenomics Summary of Drugs Targeting Affected Genes")
			    		res_civic.then(res => {
			    			var mechanisticgeneslist = this.mechanistic_drug_table.map(a => a.gene); 
			    			var res_cancer = this.getGraphFromGenes(mechanisticgeneslist, jobid, username, "targeted_gene", "Cancer drug network", "cancer", "Summary of Cancer Drugs Targeting Affected Genes")
			    			res_cancer.then(res => {
							    if(localStorage.getItem("cnvfileavailable") != "true" || !this.cnvjsonavailable){
							    	this.showNetwork = false;
									this.$refs.loader1.style.visibility="hidden";
							    }
			    			})
			    		})
			    		
		    		})
		    		
	    		})
		    }
		    // uuids known
		    else if(uuids){
		    	this.visibleDrivergenes = false;
		    	this.visiblePharmaco = false;
		    	this.visibleCivic = false;
		    	this.visibleCancer = false;
		    	var res_driver = this.getGraphFromUUID(jobid, {"drivergenes":uuids[0]}, username)
		    	res_driver.then(res => {
		    		var res_pharmaco = this.getGraphFromUUID(jobid, {"pharmaco":uuids[1]}, username)
		    		res_pharmaco.then(res=>{
		    			var res_civic = this.getGraphFromUUID(jobid, {"civic":uuids[2]}, username)
		    			res_civic.then(res => {
		    				var res_cancer = this.getGraphFromUUID(jobid, {"cancer":uuids[3]}, username)
		    				res_cancer.then(res => {
		    				})
		    			})
		    		})
		    	})
		    }
	    },
	    showJSON_cnv(username, jsonfile, jobid=null, uuids = null){
	    	this.showTable = true;
	    	this.cnvjsonavailable = true
	    	// info from json
    		this.driver_table_cnv= jsonfile.driver_table;
    		for(let item  of this.driver_table_cnv){
    			item.tumor_list = item.tumor_list.replaceAll("|", " | ")
    			item.ref_map = item.ref_map.replaceAll(",", ", ")
    			if(!this.drivertypes_cnv.hasOwnProperty(item.gene)){
    				this.drivertypes_cnv[item.gene] = item.driver_role
    			}
	    	}
	    	this.direct_pharm_table_cnv = jsonfile.direct_pharm_table;
	        for(let item  of this.direct_pharm_table_cnv){
	        	item.drug_name = item.drug_name.replaceAll("|", " | ")
    			item.tumor_list = item.tumor_list.replaceAll("|", " | ")
    			item.ref_map = item.ref_map.replaceAll(",", ", ")
	    	}

	        this.pharm_table_cnv  = jsonfile.pharm_table ;
	        for(let item  of this.pharm_table_cnv){
    			item.tumor_list = item.tumor_list.replaceAll("|", " | ")
    			item.ref_map = item.ref_map.replaceAll(",", ", ")
	    	}
	        this.mechanistic_drug_table_cnv = jsonfile.mechanistic_drug_table;
	        for(let item  of this.mechanistic_drug_table_cnv){
    			item.approval_status  = item.approval_status .replaceAll("|", " | ")
    			item.ref_map = item.ref_map.replaceAll(",", ", ")
	    	}
	    	this.appendix_reference_table_cnv = jsonfile.appendix_reference_table;
	        this.appendix_variant_table_cnv = jsonfile.appendix_variant_table;

	        if(!uuids){
		    	var drivergeneslist_cnv = this.driver_table_cnv.map(a => a.gene); 
		        var res_driver_cnv = this.getGraphFromGenes(drivergeneslist_cnv, jobid, username, "drivergene", "CNV Drivergene network", "drivergenes", "CNV: Somatic Mutations in Known Driver Genes", "_cnv", this.drivertypes_cnv);
		        res_driver_cnv .then(res => {
		        	var pharmacogeneslist_cnv = this.direct_pharm_table_cnv.map(a => a.gene); 
	    			var res_pharmaco_cnv  = this.getGraphFromGenes(pharmacogeneslist_cnv, jobid, username, "pharmacogenetic_effect", "CNV Pharmacogenetic network", "pharmaco", "CNV: Somatic Mutations with Known Pharmacogenetic Effect", "_cnv")
	    			res_pharmaco_cnv .then(res => {
	    				var pharmgeneslist_cnv = this.pharm_table_cnv.map(a => a.gene); 
			    		var res_civic_cnv  = this.getGraphFromGenes(pharmgeneslist_cnv, jobid, username, "targeted_gene", "CNV Mechanistic drug network", "civic", "CNV: Pharmacogenomics Summary of Drugs Targeting Affected Genes", "_cnv")
			    		res_civic_cnv.then(res => {
			    			var mechanisticgeneslist_cnv = this.mechanistic_drug_table_cnv.map(a => a.gene); 
			    			var res_cancer_cnv  = this.getGraphFromGenes(mechanisticgeneslist_cnv, jobid, username, "targeted_gene", "CNV Cancer drug network", "cancer", "CNV: Summary of Cancer Drugs Targeting Affected Genes", "_cnv")
			    			res_cancer_cnv.then(res => {
			    				this.showNetwork = false;
								this.$refs.loader1.style.visibility="hidden";
			    			})
			    		})
	    			})		    		
		        })	    	
		    }
		    if(uuids){
		    	this.visibleDrivergenes_cnv = false;
		    	this.visiblePharmaco_cnv = false;
		    	this.visibleCivic_cnv = false;
		    	this.visibleCancer_cnv = false;
		    	var res_driver_cnv = this.getGraphFromUUID(jobid, {"drivergenes":uuids[0]}, username, "_cnv")
		    	res_driver_cnv.then(res => {
		    		var res_pharmaco_cnv = this.getGraphFromUUID(jobid, {"pharmaco":uuids[1]}, username, "_cnv")
		    		res_pharmaco_cnv.then(res => {
		    			var res_civic_cnv = this.getGraphFromUUID(jobid, {"civic":uuids[2]}, username, "_cnv")
		    			res_civic_cnv.then(res => {
		    				var res_cancer_cnv = this.getGraphFromUUID(jobid, {"cancer":uuids[3]}, username, "_cnv")
		    			})
		    		})
		    	})
	    	}
	    },
	    getGraphFromGenes(genes, jobid, username, annotationName, networkName, subpage, tableheader, cnv="",drivertypes = null){
	    	var graphml = this.getGraphforGene(jobid, genes, username, annotationName, networkName, subpage, cnv, drivertypes)
	    		.then(response => {return response})
			return graphml.then(response => {
				if(response == undefined){
					return "error"
				}
				else{
					if(subpage == "drivergenes"){
						if(cnv != ""){
							this.visibleDrivergenes_cnv = true;
						}
						else{
							this.visibleDrivergenes = true;

						}
					}
					else if(subpage == "pharmaco"){	
						if(cnv != ""){
							this.visiblePharmaco_cnv = true;
						}
						else{
							this.visiblePharmaco = true;
						}
					}
					else if(subpage == "civic"){
						if(cnv != ""){
							this.visibleCivic_cnv = true;
						}
						else{
							this.visibleCivic = true;
						}
					}
					else if(subpage == "cancer"){
						if(cnv != ""){
							this.visibleCancer_cnv = true;
						}
						else{
							this.visibleCancer = true;
						}
					}
					axios.post('/visualization/'+subpage+cnv, response)
				  	.then(response => {
						var iframe = document.getElementById(subpage+'Vis'+cnv);
						iframe.src = iframe.src
				  	
				  	})
				  	.catch(function (error) {
				    	console.log(error);
				  	});
				}
				return "Success"
			})
		},
		getGraphforGene(jobid, names, username, annotationName, networkName, subpage, cnv="", drivertypes = null){		
			var genelist = Array.from(new Set(names))
		  	return axios.post('/network/overview', 

		  		{	genes: genelist, 
		  			annotationName: annotationName, 
		  			networkName: networkName}, 
		  			{
					    headers:{
					      	'user':username+'/'+jobid.toString()
					    },
					    method: 'POST'
			  		})
		  		.then(response => { 
		  			var uuidobj ={}
		  			uuidobj[subpage+cnv] = response.data.UUID
		  			this.updateDbEntry(jobid, uuidobj, username)
		  			if(drivertypes != null){
		  				var uuid = response.data.UUID
			  			return	axios.post("/networks/"+uuid+"/annotation?derive=false", {
			  				nodeAnnotationName: "DriverType",
						 	nodeAnnotationType: "string",
						  	nodeAnnotation:drivertypes
							  },
							{headers:{
			  					'user':username+'/'+jobid.toString()
			  				},
			  				method:'POST'}
			  			).then(response => {
			  				return axios.get('/network/networks/'+uuid, {
							    headers:{
							      	'user':username+'/'+jobid.toString()
							    },
							    method: 'GET'
						  	}).then(res => {
						  		var table;
								if(subpage == "drivergenes"){
									if(cnv != ""){
										table = this.driver_table_cnv
									}
									else{
										table = this.driver_table
									}
								}
								else if(subpage == "pharmaco"){
									if(cnv != ""){
										table = this.direct_pharm_table_cnv
									}
									else{
										table = this.direct_pharm_table
									}
								}
								else if(subpage == "civic"){
									if(cnv != ""){
										table = this.pharm_table_cnv
									}
									else{
										table = this.pharm_table
									}
								}
								else if(subpage == "cancer"){
									if(cnv != ""){
										table = this.mechanistic_drug_table_cnv
									}
									else{
										table = this.mechanistic_drug_table
									}
								}
						  		this.addGeneLinks(res.data.replace(/&ge;/g, 'greater than or equal to').replace(/&le;/g, 'less than or equal to').replace(/&prime/g,"'").replace(/&beta/g,"beta").replace(/&alpha/g,"alpha").replace(/&szlig;/g, "ss"), table)
						  		return res.data.replace(/&ge;/g, 'greater than or equal to').replace(/&le;/g, 'less than or equal to').replace(/&prime/g,"'").replace(/&beta/g,"beta").replace(/&alpha/g,"alpha").replace(/&szlig;/g, "ss")
							})
							.catch(error => {
						    	console.log(error.response)
							});
			  			})
			  			.catch(error => {
						    console.log(error.response)
						});
			  		}
			  		else{
						return axios.get('/network/networks/'+response.data.UUID, {
						    headers:{
						      	'user':username+'/'+jobid.toString()
						    },
						    method: 'GET'
					  	}).then(res => {
					  		var table;
							if(subpage == "drivergenes"){
								if(cnv != ""){
										table = this.driver_table_cnv
									}
									else{
										table = this.driver_table
									}
								}
								else if(subpage == "pharmaco"){
									if(cnv != ""){
										table = this.direct_pharm_table_cnv
									}
									else{
										table = this.direct_pharm_table
									}
								}
								else if(subpage == "civic"){
									if(cnv != ""){
										table = this.pharm_table_cnv
									}
									else{
										table = this.pharm_table
									}
								}
								else if(subpage == "cancer"){
									if(cnv != ""){
										table = this.mechanistic_drug_table_cnv
									}
									else{
										table = this.mechanistic_drug_table
									}
								}
					  		this.addGeneLinks(res.data.replace(/&ge;/g, 'greater than or equal to').replace(/&le;/g, 'less than or equal to').replace(/&prime/g,"'").replace(/&beta/g,"beta").replace(/&alpha/g,"alpha").replace(/&szlig;/g, "ss"), table)
					  		return res.data.replace(/&ge;/g, 'greater than or equal to').replace(/&le;/g, 'less than or equal to').replace(/&prime/g,"'").replace(/&beta/g,"beta").replace(/&alpha/g,"alpha").replace(/&szlig;/g, "ss")
						})
						.catch(error => {
						    console.log(error.response)
						});
					}
				})
				.catch(error => {
				    console.log(subpage+cnv, error.response)
				});
		},
	    getGraphFromUUID(jobid, uuidobj, username, cnv =""){
	    	var jobid = jobid
    		var subpage = Object.keys(uuidobj)[0]
    		var uuid = uuidobj[subpage]
    		if(uuid != ""){
				var graphml =  axios.get('/network/networks/'+uuid, {
				    headers:{
				      	'user':username+'/'+jobid
				    },
				    method: 'GET'
			  	}).then(
					res => {
						var table;
						if(subpage == "drivergenes"){
							if(cnv != ""){
								this.visibleDrivergenes_cnv = true;
								table = this.driver_table_cnv
							}
							else{
								this.visibleDrivergenes = true;
								table = this.driver_table

							}
						}
						else if(subpage == "pharmaco"){
							if(cnv != ""){
								this.visiblePharmaco_cnv = true;
								table = this.direct_pharm_table_cnv
							}
							else{
								this.visiblePharmaco = true;
								table = this.direct_pharm_table
							}
						}
						else if(subpage == "civic"){
							if(cnv != ""){
								this.visibleCivic_cnv = true;
								table = this.pharm_table_cnv
							}
							else{
								this.visibleCivic = true;
								table = this.pharm_table
							}
						}
						else if(subpage == "cancer"){
							if(cnv != ""){
								this.visibleCancer_cnv = true;
								table = this.mechanistic_drug_table_cnv
							}
							else{
								this.visibleCancer = true;
								table = this.mechanistic_drug_table
							}
						}
						this.addGeneLinks(res.data.replace(/&ge;/g, 'greater than or equal to').replace(/&le;/g, 'less than or equal to').replace(/&prime/g,"'").replace(/&beta/g,"beta").replace(/&alpha/g,"alpha").replace(/&szlig;/g, "ss"), table)
						axios.post('/visualization/'+subpage+cnv, res.data.replace(/&ge;/g, 'greater than or equal to').replace(/&le;/g, 'less than or equal to').replace(/&prime/g,"'").replace(/&beta/g,"beta").replace(/&alpha/g,"alpha").replace(/&szlig;/g, "ss"))
						  .then(function () {
						  	var iframe = document.getElementById(subpage+'Vis'+cnv);
							iframe.src = iframe.src;
						  })
						  .catch(function (error) {
						    console.log(error);
						  });	
						  return "Success"
						  
					})
			  	.catch(function (error) {
				    console.log(error);
				    return "error"
			 	});	
			 	return graphml	 
			 }   	
	    },
	    addGeneLinks(data, table){
	    	var parser = new DOMParser();
			var xmlDoc = parser.parseFromString(data,"text/xml");
			var nodes = xmlDoc.getElementsByTagName("node")
			for(let node of nodes){
				for(let child of node.getElementsByTagName("data")){
					var attribute = child.getAttribute("key")
					if(attribute == "v_drivergene" || attribute == "v_pharmacogenetic_effect" || attribute == "v_targeted_gene"){ // find drivergenes in network
						var drivergene = child.textContent
						for(let childnode of node.getElementsByTagName("data")){
							if(childnode.getAttribute("key") == "v_name" && drivergene){
								var gene = childnode.textContent
								for(var item of table){
									if(item.gene == gene){
										item.network = true
									}
								}
							}
							else if(childnode.getAttribute("key") == "v_ec-code" && drivergene ){
								for(var item of table){
									if(item.gene == gene){
										item.eccode = childnode.textContent
									}
								}
							}
							else if(childnode.getAttribute("key") == "v_ensembl" && drivergene){
								for(item of table){
									if(item.gene == gene){
										item.ensembl = childnode.textContent
									}
								}
							}
							else if(childnode.getAttribute("key") == "v_hgnc" && drivergene){
								for(item of table){
									if(item.gene == gene){
										item.hgnc = childnode.textContent
									}
								}
							}
							// else if(childnode.getAttribute("key") == "v_omim" && drivergene){
							// 	for(item of sortedMskdg){
							// 		if(item.gene == gene){
							// 			item.omim = childnode.textContent
							// 		}
							// 	}
							// }
							// else if(childnode.getAttribute("key") == "v_entrez_gene" && drivergene){
							// 	for(item of sortedMskdg){
							// 		if(item.gene == gene){
							// 			item.entrez = childnode.textContent.split("/").pop()
							// 		}
							// 	}
							// }
							else if(childnode.getAttribute("key") == "mdanderson" && drivergene){
								for(item of table){
									if(item.gene == gene){
										item.mdanderson = childnode.textContent
									}
								}
							}
							else if(childnode.getAttribute("key") == "v_kegg_genes" && drivergene){
								for(item of table){
									if(item.gene == gene){
										if(childnode.textContent.includes("+")){
											item.kegg = childnode.textContent.split("+")[0]
										}
										else{
											item.kegg = childnode.textContent
										}
									}
								}
							}
							else if(childnode.getAttribute("key") == "v_uniprot" && drivergene){
								for(item of table){
									if(item.gene == gene){
										item.uniprot = childnode.textContent
									}
								}
							}
						}
					}	
				}
			}
			this.$forceUpdate()
	    },
	    updateDbEntry(jobid, uuid, username){
	    	pecaxdb.updateEntry(new arangodb.Database('/db/'), username, jobid, uuid)
	    },
	    displayJSON(jobid, username){
	    	this.showTable=true;
	    	var jsonReport = axios.get('/clinvap/results/'+username+'_'+jobid+'.json')
	    		.then(res=>{return res.data})
	    	jsonReport.then(res => {
	    		this.showJSON(username, res, jobid);
	    	 	this.jsonReport = res;
	    		this.storeJsonInDB(res, jobid, username, this.icd10, this.diagnosisfilter);
		    })
	    },
	    download_json(){
	    	var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.jsonReport));
		    var downloadAnchorNode = document.createElement('a');
		    downloadAnchorNode.setAttribute("href", dataStr);
		    downloadAnchorNode.setAttribute("download", this.jobid + ".json");
		    document.body.appendChild(downloadAnchorNode); // required for firefox
		    downloadAnchorNode.click();
		    downloadAnchorNode.remove();
		    if(this.cnvjsonavailable){
			    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.cnvjsonReport));
			    var downloadAnchorNode = document.createElement('a');
			    downloadAnchorNode.setAttribute("href",     dataStr);
			    downloadAnchorNode.setAttribute("download", this.jobid + ".cnv.json");
			    document.body.appendChild(downloadAnchorNode); // required for firefox
			    downloadAnchorNode.click();
			    downloadAnchorNode.remove();
			}
	    },
	    getJsonFromJobID(jobid, username){
	    	pecaxdb.getJsonFromJobID(new arangodb.Database('/db/'), arangodb.aqlQuery, username, jobid).then(json => { 
	    		if(Object.keys(json._result[0].json_file_cnv).length > 0){
	    			if(Object.keys(json._result[0].json_file).length == 0){
		    			this.cnvjson = true;
		    		}
	    			this.cnvjsonavailable = true;
	    			this.showJSON_cnv(username, json._result[0].json_file_cnv, json._result[0]._key, [json._result[0].drivergenes_cnv, json._result[0].pharmaco_cnv, json._result[0].civic_cnv, json._result[0].cancer_cnv])
	    			this.drivergenes_notes_cnv = json._result[0].drivergenes_notes_cnv
		    		this.pharmaco_notes_cnv = json._result[0].pharmaco_notes_cnv
		    		this.civic_notes_cnv = json._result[0].civic_notes_cnv
		    		this.cancer_notes_cnv = json._result[0].cancer_notes_cnv
	    		}
	    		if(Object.keys(json._result[0].json_file).length>0){
		    		this.jsonReport = json._result[0].json_file
		    		this.showJSON(username, json._result[0].json_file, json._result[0]._key, [json._result[0].drivergenes, json._result[0].pharmaco, json._result[0].civic, json._result[0].cancer])
	    			this.drivergenes_notes = json._result[0].drivergenes_notes
	    			this.pharmaco_notes = json._result[0].pharmaco_notes
	    			this.civic_notes = json._result[0].civic_notes
	    			this.cancer_notes = json._result[0].cancer_notes
	    			this.icd10 = json._result[0].icd10
	    			this.diagnosisfilter = json._result[0].diagnosisfilter
	    		}
	    	});
	    },
	    storeJsonInDB(jsonReport, jobid, username, icd10="", diagnosisfilter ="",cnv=""){
	    	pecaxdb.addJson(new arangodb.Database('/db/'), username, jobid, jsonReport, icd10, diagnosisfilter, cnv);
	    },
	    storeNotes(subpage, cnv=""){
	    	var self = this
	    	if(subpage+cnv == "drivergenes"){
	    		var notes = this.$refs.driverNotes.value
	    		this.savedDrivergenesNotes = true
	    		setTimeout(function(){
	    			self.savedDrivergenesNotes = false
	    		}, 10000)
	    	}
	    	else if(subpage+cnv == "drivergenescnv"){
	    		var notes = this.$refs.driverNotes_cnv.value
	    		this.savedDrivergenesNotes_cnv = true
	    		setTimeout(function(){
	    			self.savedDrivergenesNotes_cnv = false
	    		}, 10000)
	    	}
	    	else if(subpage+cnv == "pharmaco"){
	    		var notes = this.$refs.pharmacoNotes.value
	    		this.savedPharmacoNotes = true
	    		setTimeout(function(){
	    			self.savedPharmacoNotes = false
	    		}, 10000)
	    	}
	    	else if(subpage+cnv == "pharmacocnv"){
	    		var notes = this.$refs.pharmacoNotes_cnv.value
	    		this.savedPharmacoNotes_cnv = true
	    		setTimeout(function(){
	    			self.savedPharmacoNotes_cnv = false
	    		}, 10000)
	    	}
	    	else if(subpage+cnv == "civic"){
	    		var notes = this.$refs.civicNotes.value
	    		this.savedCivicNotes = true
	    		setTimeout(function(){
	    			self.savedCivicNotes = false
	    		}, 10000)
	    	}
	    	else if(subpage+cnv == "civiccnv"){
	    		var notes = this.$refs.civicNotes_cnv.value
	    		this.savedCivicNotes_cnv = true
	    		setTimeout(function(){
	    			self.savedCivicNotes_cnv = false
	    		}, 10000)
	    	}
	    	else if(subpage+cnv == "cancer"){
	    		var notes = this.$refs.cancerNotes.value
	    		this.savedCancerNotes = true
	    		setTimeout(function(){
	    			self.savedCancerNotes = false
	    		}, 10000)
	    	}
	    	else if(subpage+cnv == "cancercnv"){
	    		var notes = this.$refs.cancerNotes_cnv.value
	    		this.savedCancerNotes_cnv = true
	    		setTimeout(function(){
	    			self.savedCancerNotes_cnv = false
	    		}, 10000)
	    	}
	    	pecaxdb.addNote(new arangodb.Database('/db/'), this.username, this.jobid, notes, subpage, cnv);
	    },
	    exportToPDF_all() {
	        this.visibleDrivers = true;
	        this.visiblePharma = true;
	        this.visibleAffectCivic = true;
	        this.visibleAffectCancer = true;
	        this.visibleEffect = true;
	        this.visibleAffect = true;
	        this.visibleRef = true;
	        this.visibleAppendix = true;
	        this.visibleDrivergenes = false;
	        this.visiblePharmaco = false;
	        this.visibleCivic = false;
	        this.visibleCancer = false;
	        var self = this;
	        setTimeout(function(){
	          window.scrollTo(0,0);
	          html2pdf().set({
	            margin: 0.25,
	            filename: 'ClinVAPReport.pdf',
	            image: { type: 'jpeg', quality: 0.98 },
	            html2canvas: {},
	            pagebreak: {mode: ['legacy']},
	            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape'}
	           }).from(self.$refs.content_driver_table).toPdf().get('pdf').then(function (pdf) {
	            pdf.addPage();
	          }).from(self.$refs.content_direct_pharm_table).toContainer().toCanvas().toPdf().get('pdf').then(function (pdf) {
	              pdf.addPage();
	          }).from(self.$refs.content_smptag).toContainer().toCanvas().toPdf().get('pdf').then(function (pdf) {
	              pdf.addPage();
	          }).from(self.$refs.content_adverse_table).toContainer().toCanvas().toPdf().get('pdf').then(function (pdf) {
	              pdf.addPage();
	          }).from(self.$refs.content_ref).toContainer().toCanvas().toPdf().get('pdf').then(function (pdf) {
	              pdf.addPage();
	          }).from(self.$refs.content_appendix_variant_table).toContainer().toCanvas().toPdf().save();
	        },1);
	        setTimeout(function(){
	        	self.visibleDrivergenes = true;
	        	self.visiblePharmaco = true;
	        	self.visibleCivic = true;
	        	self.visibleCancer = true;
	        },15000)
	        if(self.cnvjsonavailable){
	        	self.visibleDrivers_cnv = true;
		        self.visiblePharma_cnv = true;
		        self.visibleAffectCivic_cnv = true;
		        self.visibleAffectCancer_cnv = true;
		        self.visibleAffect_cnv = true;
		        self.visibleRef_cnv = true;
		        self.visibleAppendix_cnv = true;
		        self.visibleDrivergenes_cnv = false;
		        self.visiblePharmaco_cnv = false;
		        self.visibleCivic_cnv = false;
		        self.visibleCancer_cnv = false;
		        setTimeout(function(){
		          // self.$refs['refTable'].hideDefaultFooter=true;
		          window.scrollTo(0,0);
		          html2pdf().set({
		            margin: 0.25,
		            filename: 'ClinVAPReport_CNV.pdf',
		            image: { type: 'jpeg', quality: 0.98 },
		            html2canvas: {},
		            pagebreak: {mode: ['legacy']},
		            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape'}
		           }).from(self.$refs.content_driver_table_cnv).toPdf().get('pdf').then(function (pdf) {
		            pdf.addPage();
		          }).from(self.$refs.content_direct_pharm_table_cnv).toContainer().toCanvas().toPdf().get('pdf').then(function (pdf) {
		              pdf.addPage();
		          }).from(self.$refs.content_smptag_cnv).toContainer().toCanvas().toPdf().get('pdf').then(function (pdf) {
		              pdf.addPage();
		          }).from(self.$refs.content_ref_cnv).toContainer().toCanvas().toPdf().get('pdf').then(function (pdf) {
		              pdf.addPage();
		          }).from(self.$refs.content_appendix_variant_table_cnv).toContainer().toCanvas().toPdf().save();
		        },1);
		        setTimeout(function(){
		          self.visibleDrivergenes_cnv = true;
		          self.visiblePharmaco_cnv = true;
		          self.visibleCivic_cnv = true;	
		          self.visibleCancer_cnv = true;
	          	},15000)
	        }  

	    },
	    exportToPDF_driver_table() {
	    	this.visibleDrivergenes = false;
	        var self = this;
	        setTimeout(function(){
	          window.scrollTo(0,0);
	          html2pdf(self.$refs.content_driver_table, {
	            margin: 0.5,
	            filename: 'driver_table.pdf',
	            image: { type: 'jpeg', quality: 0.98 },
	            html2canvas: {},
	            pagebreak: { mode: ['legacy'] },
	            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape'}
	           });
	        }, 1);
	        setTimeout(function(){
	        	self.visibleDrivergenes = true;
	        },5000)
	    },
	    exportToPDF_driver_table_cnv() {
	    	this.visibleDrivergenes_cnv = false;
	        var self = this;
	        setTimeout(function(){
	          window.scrollTo(0,0);
	          html2pdf(self.$refs.content_driver_table_cnv, {
	            margin: 0.5,
	            filename: 'driver_table_cnv.pdf',
	            image: { type: 'jpeg', quality: 0.98 },
	            html2canvas: {},
	            pagebreak: { mode: ['legacy'] },
	            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape'}
	           });
	        }, 1);
	        setTimeout(function(){
	        	self.visibleDrivergenes_cnv = true;
	        },5000)
	    },
	    exportToPDF_direct_pharm_table() {
	        this.visiblePharmaco =false;
	        var self = this;
	        setTimeout(function(){
	          window.scrollTo(0,0);
	          html2pdf(self.$refs.content_direct_pharm_table, {
	            margin: 0.5,
	            filename: 'direct_pharm_table.pdf',
	            image: { type: 'jpeg', quality: 0.98 },
	            html2canvas: { },
	            pagebreak: { mode: ['legacy'] },
	            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape'}
	           })
	        }, 1);
	        setTimeout(function(){
	        	self.visiblePharmaco = true;
	        },5000)
	    }, 
	    exportToPDF_direct_pharm_table_cnv() {
	        this.visiblePharmaco_cnv =false;
	        var self = this;
	        setTimeout(function(){
	          window.scrollTo(0,0);
	          html2pdf(self.$refs.content_direct_pharm_table_cnv, {
	            margin: 0.5,
	            filename: 'direct_pharm_table_cnv.pdf',
	            image: { type: 'jpeg', quality: 0.98 },
	            html2canvas: { },
	            pagebreak: { mode: ['legacy'] },
	            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape'}
	           })
	        }, 1);
	        setTimeout(function(){
	        	self.visiblePharmaco_cnv = true;
	        },5000)
	    },
	    exportToPDF_pharm_table() {
	        this.visibleCivic = false;
	        var self = this;
	        setTimeout(function(){
	          window.scrollTo(0,0);
	          html2pdf(self.$refs.content_pharm_table, {
	            margin: 0.45,
	            filename: 'pharm_table.pdf',
	            image: { type: 'jpeg', quality: 0.98 },
	            html2canvas: { },
	            pagebreak: { mode:['legacy']},
	            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape'}
	           })
	        }, 1);
	        setTimeout(function(){
	        	self.visibleCivic = true;
	        },5000)
	    },
	    exportToPDF_mechanistic_drug_table() {
	        this.visibleCancer = false;
	        var self = this;
	        setTimeout(function(){
	          window.scrollTo(0,0);
	          html2pdf(self.$refs.content_mechanistic_drug_table, {
	            margin: 0.2,
	            filename: 'mechanistic_drug_table.pdf',
	            image: { type: 'jpeg', quality: 0.98 },
	            html2canvas: { },
	            pagebreak: { mode: ['legacy'] },
	            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape'}
	           })
	        }, 1);
	        setTimeout(function(){
	        	self.visibleCancer = true;
	        },5000)
	    },
	    exportToPDF_pharm_table_cnv() {
	        this.visibleCivic_cnv = false;
	        var self = this;
	        setTimeout(function(){
	          window.scrollTo(0,0);
	          html2pdf(self.$refs.content_pharm_table_cnv, {
	            margin: 0.45,
	            filename: 'pharm_table_cnv.pdf',
	            image: { type: 'jpeg', quality: 0.98 },
	            html2canvas: { },
	            pagebreak: { mode:['legacy']},
	            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape'}
	           })
	        }, 1);
	        setTimeout(function(){
	        	self.visibleCivic_cnv = true;
	        },5000)
	    },
	    exportToPDF_mechanistic_drug_table_cnv() {
	        this.visibleCancer_cnv = false;
	        var self = this;
	        setTimeout(function(){
	          window.scrollTo(0,0);
	          html2pdf(self.$refs.content_mechanistic_drug_table_cnv, {
	            margin: 0.2,
	            filename: 'mechanistic_drug_table_cnv.pdf',
	            image: { type: 'jpeg', quality: 0.98 },
	            html2canvas: { },
	            pagebreak: { mode: ['legacy'] },
	            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape'}
	           })
	        }, 1);
	        setTimeout(function(){
	        	self.visibleCancer_cnv = true;
	        },5000)
	    },
	    exportToPDF_adverse_table() {
	        var self = this;
	        setTimeout(function(){
	          window.scrollTo(0,0);
	          html2pdf(self.$refs.content_adverse_table, {
	            margin: 0.45,
	            filename: 'adverseEffect.pdf',
	            image: { type: 'jpeg', quality: 0.98 },
	            html2canvas: { },
	            pagebreak: { mode:['legacy']},
	            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape'}
	           })
	        }, 1);
	    },
	    exportToPDF_ref() {
	        var self = this;
	        setTimeout(function(){
	          self.$refs['refTable'].dense = true;
	          self.$refs['refTable'].hideDefaultFooter=true;
	          window.scrollTo(0,0);
	          html2pdf(self.$refs.content_ref, {
	            margin: 0.1,
	            filename: 'references.pdf',
	            image: { type: 'jpeg', quality: 0.98 },
	            html2canvas: { },
	            pagebreak: { mode: ['avoid-all'] },
	            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape'}
	           })
	        }, 1);
	    },
	    exportToPDF_appendix_variant_table() {
	        var self = this;
	        setTimeout(function(){
	          window.scrollTo(0,0);
	          html2pdf(self.$refs.content_appendix_variant_table, {
	            margin: 0.5,
	            filename: 'appendix_variant_table.pdf',
	            image: { type: 'jpeg', quality: 0.98 },
	            html2canvas: { },
	            pagebreak: { mode: ['legacy'] },
	            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape'}
	           })
	        }, 1);
	    },
	    exportToPDF_ref_cnv() {
	        var self = this;
	        setTimeout(function(){
	          self.$refs['refTable'].dense = true;
	          self.$refs['refTable'].hideDefaultFooter=true;
	          window.scrollTo(0,0);
	          html2pdf(self.$refs.content_ref_cnv, {
	            margin: 0.1,
	            filename: 'references_cnv.pdf',
	            image: { type: 'jpeg', quality: 0.98 },
	            html2canvas: { },
	            pagebreak: { mode: ['avoid-all'] },
	            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape'}
	           })
	        }, 1);
	    },
	    exportToPDF_appendix_variant_table_cnv() {
	        var self = this;
	        setTimeout(function(){
	          window.scrollTo(0,0);
	          html2pdf(self.$refs.content_appendix_variant_table_cnv, {
	            margin: 0.5,
	            filename: 'appendix_variant_table_cnv.pdf',
	            image: { type: 'jpeg', quality: 0.98 },
	            html2canvas: { },
	            pagebreak: { mode: ['legacy'] },
	            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape'}
	           })
	        }, 1);
	    },
	    download_Networks(){
	    	var uuids = {}
	    	uuids = pecaxdb.getJsonFromJobID(new arangodb.Database('/db/'), arangodb.aqlQuery, this.username, this.jobid).then(json => { 
	    		let uuidsobj = {"drivergenes":json._result[0].drivergenes, "pharmacogenetic":json._result[0].pharmaco, "pharmacogenomics":json._result[0].civic, "cancer":json._result[0].cancer}
	    		if(Object.keys(json._result[0].json_file_cnv).length){
	    			uuidsobj["drivergenes_cnv"]=json._result[0].drivergenes_cnv
	    			uuidsobj["pharmacogenetic_cnv"]=json._result[0].pharmaco_cnv
	    			uuidsobj["pharmacogenomics_cnv"]=json._result[0].civic_cnv
	    			uuidsobj["cancer_cnv"]=json._result[0].cancer_cnv
	    		}
	    		return uuidsobj
	    	});
	    	uuids.then(uuids => {
	    		for(const [key, value] of Object.entries(uuids)){
			    	var graphml = axios.get('/network/networks/'+value, {
					    headers:{
					      	'user':this.username+'/'+this.jobid
					    },
					    method: 'GET'
				  	}).then(
						response => {
					// else{
						var element = document.createElement('a');
						element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(response.data));
						element.setAttribute('download', key+".graphml");

						element.style.display = 'none';
						document.body.appendChild(element);

						element.click();

						document.body.removeChild(element);
					// }
				})
				}
	    	})
	    	
	    },
	    selectItem (item) {
	        if(this.selected.includes(item.gene)){
	          this.selected.splice(this.selected.indexOf(item.gene),1)
	        }
	        else if(this.selected.length < 5 && !this.selected.includes(item.gene)){
	          this.selected.push(item.gene)
	        }
	    },
	    select(data) {
	        this.checkedGenes = [];
	        if (!this.selectAll) {
	          for (let i in data) {
	            this.checkedGenes.push(data[i].gene);
	          }
	        }
	    },
	    sortMskdg:function(s) {
	        //if s == current sort, reverse
	        if(s === "Gene") {
	          this.currentSortDirGene1 = this.currentSortDirGene1==='asc'?'desc':'asc';
	          this.currentSortDir = this.currentSortDirGene1;
	          this.currentSort = "gene";
	        }
	        else if(s === "Mutation") {
	          this.currentSortDirMut1 = this.currentSortDirMut1==='asc'?'desc':'asc';
	          this.currentSortDir = this.currentSortDirMut1;
	          this.currentSort = "one_letter_repr";
	        }
	        else if(s === "Consequence") {
	          this.currentSortDirCons1 = this.currentSortDirCons1==='asc'?'desc':'asc';
	          this.currentSortDir = this.currentSortDirCons1;
	          this.currentSort = "Consequence";
	        }
	        else if(s === "Driver Type") {
	          this.currentSortDirDriverType1 = this.currentSortDirDriverType1==='asc'?'desc':'asc';
	          this.currentSortDir = this.currentSortDirDriverType1;
	          this.currentSort = "driver_role";
	        }
	        else if(s === "Tumor Type") {
	          this.currentSortDirTumorType1 = this.currentSortDirTumorType1==='asc'?'desc':'asc';
	          this.currentSortDir = this.currentSortDirTumorType1;
	          this.currentSort = "tumor_list";
	        }
	        else if(s === "VAF") {
	          this.currentSortDirVAF1 = this.currentSortDirVAF1==='asc'?'desc':'asc';
	          this.currentSortDir = this.currentSortDirVAF1;
	          this.currentSort = "vaf";
	        }
	        else if(s === "References") {
	          this.currentSortDirRef1 = this.currentSortDirRef1==='asc'?'desc':'asc';
	          this.currentSortDir = this.currentSortDirRef1;
	          this.currentSort = "ref_map";
	        }	        
	    },
	    sortMskdg_cnv:function(s) {
	    	//if s == current sort, reverse
	        if(s === "Gene") {
	          this.currentSortDirGene1_cnv = this.currentSortDirGene1_cnv==='asc'?'desc':'asc';
	          this.currentSortDir_cnv = this.currentSortDirGene1_cnv;
	          this.currentSort_cnv = "gene";
	        }
	        else if(s === "Type") {
	          this.currentSortDirType1_cnv = this.currentSortDirType1_cnv==='asc'?'desc':'asc';
	          this.currentSortDir_cnv = this.currentSortDirType1_cnv;
	          this.currentSort_cnv = "type";
	        }
	        // else if(s === "Copy Number") {
	        //   this.currentSortDirCopy1_cnv = this.currentSortDirCopy1_cnv==='asc'?'desc':'asc';
	        //   this.currentSortDir_cnv = this.currentSortDirCons1_cnv;
	        //   this.currentSort_cnv = "copy_number";
	        // }
	        else if(s === "Driver Type") {
	          this.currentSortDirDriverType1_cnv = this.currentSortDirDriverType1_cnv==='asc'?'desc':'asc';
	          this.currentSortDir_cnv = this.currentSortDirDriverType1_cnv;
	          this.currentSort_cnv = "driver_type";
	        }
	        else if(s === "Tumor List") {
	          this.currentSortDirTumorList1_cnv = this.currentSortDirTumorList1_cnv==='asc'?'desc':'asc';
	          this.currentSortDir_cnv = this.currentSortDirTumorList1_cnv;
	          this.currentSort_cnv = "tumor_list";
	        }
	        // else if(s === "Effect") {
	        //   this.currentSortDirEffect1_cnv = this.currentSortDirEffect1_cnv==='asc'?'desc':'asc';
	        //   this.currentSortDir_cnv = this.currentSortDirEffect1_cnv;
	        //   this.currentSort_cnv = "effect";
	        // }
	        else if(s === "References") {
	          this.currentSortDirRef1_cnv = this.currentSortDirRef1_cnv==='asc'?'desc':'asc';
	          this.currentSortDir_cnv = this.currentSortDirRef1_cnv;
	          this.currentSort_cnv = "ref_map";
	        }	        
	    },
	    sortPtpda:function(s) {
	        //if s == current sort, reverse
	        if(s === "Gene") {
	          this.currentSortDirGene2 = this.currentSortDirGene2==='asc'?'desc':'asc';
	          this.currentSortDirPtpda = this.currentSortDirGene2;
	          this.currentSortPtpda = "gene";
	        }
	        else if(s === "Mutation") {
	          this.currentSortDirMut2 = this.currentSortDirMut2==='asc'?'desc':'asc';
	          this.currentSortDirPtpda = this.currentSortDirMut2;
	          this.currentSortPtpda = "variant";
	        }
	        else if(s === "Therapy") {
	          this.currentSortDirTherapy2 = this.currentSortDirTherapy2==='asc'?'desc':'asc';
	          this.currentSortDirPtpda = this.currentSortDirTherapy2;
	          this.currentSortPtpda = "drug_name";
	        }
	        else if(s === "Effect") {
	          this.currentSortDirEffect2 = this.currentSortDirEffect2==='asc'?'desc':'asc';
	          this.currentSortDirPtpda = this.currentSortDirEffect2;
	          this.currentSortPtpda = "variant_drug_association";
	        }
	        else if(s === "Disease") {
	          this.currentSortDirDisease2 = this.currentSortDirDisease2==='asc'?'desc':'asc';
	          this.currentSortDirPtpda = this.currentSortDirDisease2;
	          this.currentSortPtpda = "tumor_list";
	        }
	        else if(s === "Evidence") {
	          this.currentSortDirEvidence2 = this.currentSortDirEvidence2==='asc'?'desc':'asc';
	          this.currentSortDirPtpda = this.currentSortDirEvidence2;
	          this.currentSortPtpda = "match_level";
	        }
	        else if(s === "References") {
	          this.currentSortDirRef2 = this.currentSortDirRef2==='asc'?'desc':'asc';
	          this.currentSortDirPtpda = this.currentSortDirRef2;
	          this.currentSortPtpda = "ref_map";
	        }
	    },
	    sortPtpda_cnv:function(s) {
	        //if s == current sort, reverse
	        if(s === "Gene") {
	          this.currentSortDirGene2_cnv = this.currentSortDirGene2_cnv==='asc'?'desc':'asc';
	          this.currentSortDirPtpda_cnv = this.currentSortDirGene2_cnv;
	          this.currentSortPtpda_cnv = "gene";
	        }
	        else if(s === "Mutation") {
	          this.currentSortDirMut2_cnv = this.currentSortDirMut2_cnv==='asc'?'desc':'asc';
	          this.currentSortDirPtpda_cnv = this.currentSortDirMut2_cnv;
	          this.currentSortPtpda_cnv = "variant";
	        }
	        else if(s === "Therapy") {
	          this.currentSortDirTherapy2_cnv = this.currentSortDirTherapy2_cnv==='asc'?'desc':'asc';
	          this.currentSortDirPtpda_cnv = this.currentSortDirTherapy2_cnv;
	          this.currentSortPtpda_cnv = "drug_name";
	        }
	        else if(s === "Effect") {
	          this.currentSortDirEffect2_cnv = this.currentSortDirEffect2_cnv==='asc'?'desc':'asc';
	          this.currentSortDirPtpda_cnv = this.currentSortDirEffect2_cnv;
	          this.currentSortPtpda_cnv = "variant_drug_association";
	        }
	        else if(s === "Disease") {
	          this.currentSortDirDisease2_cnv = this.currentSortDirDisease2_cnv==='asc'?'desc':'asc';
	          this.currentSortDirPtpda_cnv = this.currentSortDirDisease2_cnv;
	          this.currentSortPtpda_cnv = "tumor_list";
	        }
	        else if(s === "Evidence") {
	          this.currentSortDirEvidence2_cnv = this.currentSortDirEvidence2_cnv==='asc'?'desc':'asc';
	          this.currentSortDirPtpda_cnv = this.currentSortDirEvidence2_cnv;
	          this.currentSortPtpda_cnv = "match_level";
	        }
	        else if(s === "References") {
	          this.currentSortDirRef2_cnv = this.currentSortDirRef2_cnv==='asc'?'desc':'asc';
	          this.currentSortDirPtpda_cnv = this.currentSortDirRef2_cnv;
	          this.currentSortPtpda_cnv = "ref_map";
	        }
	    },
	    sortPtpia:function(s) {
	        //if s == current sort, reverse
	        if(s === "Gene") {
	          this.currentSortDirGene3 = this.currentSortDirGene3==='asc'?'desc':'asc';
	          this.currentSortDirPtpia = this.currentSortDirGene3;
	        	this.currentSortPtpia = "gene";
	        }
	        else if(s === "Mutation") {
	          this.currentSortDirMut3 = this.currentSortDirMut3==='asc'?'desc':'asc';
	          this.currentSortDirPtpia = this.currentSortDirMut3;
	          this.currentSortPtpia = "variant"
	        }
	        else if(s === "Therapy") {
	          this.currentSortDirTherapy3 = this.currentSortDirTherapy3==='asc'?'desc':'asc';
	          this.currentSortDirPtpia = this.currentSortDirTherapy3;
	          this.currentSortPtpia = "drug_name"
	        }
	        else if(s === "Effect") {
	          this.currentSortDirEffect3 = this.currentSortDirEffect3==='asc'?'desc':'asc';
	          this.currentSortDirPtpia = this.currentSortDirEffect3;
	          this.currentSortPtpia = "variant_drug_association"
	        }
	        else if(s === "Evidence") {
	          this.currentSortDirEvidence3 = this.currentSortDirEvidence3==='asc'?'desc':'asc';
	          this.currentSortDirPtpia = this.currentSortDirEvidence3;
	          this.currentSortPtpia = "match_level"
	        }
	        else if(s === "Disease") {
	          this.currentSortDirDisease3 = this.currentSortDirDisease3==='asc'?'desc':'asc';
	          this.currentSortDirPtpia = this.currentSortDirDisease3;
	          this.currentSortPtpia = "tumor_list"
	        }
	        else if(s === "References") {
	          this.currentSortDirRef3 = this.currentSortDirRef3==='asc'?'desc':'asc';
	          this.currentSortDirPtpia = this.currentSortDirRef3;
	          this.currentSortPtpia = "ref_map"
	        }
	    },
	    sortMskpe:function(s) {
	        //if s == current sort, reverse
	        if(s === "Gene") {
	          this.currentSortDirGene4 = this.currentSortDirGene4==='asc'?'desc':'asc';
	          this.currentSortDirMskpe = this.currentSortDirGene4;
	          this.currentSortMskpe = "gene";
	        }
	        else if(s === "Status") {
	          this.currentSortDirStatus4 = this.currentSortDirStatus4==='asc'?'desc':'asc';
	          this.currentSortDirMskpe = this.currentSortDirStatus4;
	          this.currentSortMskpe = "approval_status"
	        }
	        else if(s === "Therapy") {
	          this.currentSortDirTherapy4 = this.currentSortDirTherapy4==='asc'?'desc':'asc';
	          this.currentSortDirMskpe = this.currentSortDirTherapy4;
	          this.currentSortMskpe = "drug_name"
	        }
	        else if(s === "References") {
	          this.currentSortDirRef4 = this.currentSortDirRef4==='asc'?'desc':'asc';
	          this.currentSortDirMskpe = this.currentSortDirRef4;
	          this.currentSortMskpe = "ref_map"
	        }
	    },
	    sortPtpia_cnv:function(s) {
	        //if s == current sort, reverse
	        if(s === "Gene") {
	          this.currentSortDirGene3_cnv = this.currentSortDirGene3_cnv==='asc'?'desc':'asc';
	          this.currentSortDirPtpia_cnv = this.currentSortDirGene3_cnv;
	        	this.currentSortPtpia_cnv = "gene";
	        }
	        else if(s === "Mutation") {
	          this.currentSortDirMut3_cnv = this.currentSortDirMut3_cnv==='asc'?'desc':'asc';
	          this.currentSortDirPtpia_cnv = this.currentSortDirMut3_cnv;
	          this.currentSortPtpia_cnv = "variant"
	        }
	        else if(s === "Therapy") {
	          this.currentSortDirTherapy3_cnv = this.currentSortDirTherapy3_cnv==='asc'?'desc':'asc';
	          this.currentSortDirPtpia_cnv = this.currentSortDirTherapy3_cnv;
	          this.currentSortPtpia_cnv = "drug_name"
	        }
	        else if(s === "Effect") {
	          this.currentSortDirEffect3_cnv = this.currentSortDirEffect3_cnv==='asc'?'desc':'asc';
	          this.currentSortDirPtpia_cnv = this.currentSortDirEffect3_cnv;
	          this.currentSortPtpia_cnv = "variant_drug_association"
	        }
	        else if(s === "Evidence") {
	          this.currentSortDirEvidence3_cnv = this.currentSortDirEvidence3_cnv==='asc'?'desc':'asc';
	          this.currentSortDirPtpia_cnv = this.currentSortDirEvidence3_cnv;
	          this.currentSortPtpia_cnv = "match_level"
	        }
	        else if(s === "Disease") {
	          this.currentSortDirDisease3_cnv = this.currentSortDirDisease3_cnv==='asc'?'desc':'asc';
	          this.currentSortDirPtpia_cnv = this.currentSortDirDisease3_cnv;
	          this.currentSortPtpia_cnv = "tumor_list"
	        }
	        else if(s === "References") {
	          this.currentSortDirRef3_cnv = this.currentSortDirRef3_cnv==='asc'?'desc':'asc';
	          this.currentSortDirPtpia_cnv = this.currentSortDirRef3_cnv;
	          this.currentSortPtpia_cnv = "ref_map"
	        }
	    },
	    sortMskpe_cnv:function(s) {
	        //if s == current sort, reverse
	        if(s === "Gene") {
	          this.currentSortDirGene4_cnv = this.currentSortDirGene4_cnv==='asc'?'desc':'asc';
	          this.currentSortDirMskpe_cnv = this.currentSortDirGene4_cnv;
	          this.currentSortMskpe_cnv = "gene";
	        }
	        else if(s === "Status") {
	          this.currentSortDirStatus4_cnv = this.currentSortDirStatus4_cnv==='asc'?'desc':'asc';
	          this.currentSortDirMskpe_cnv = this.currentSortDirStatus4_cnv;
	          this.currentSortMskpe_cnv = "approval_status"
	        }
	        else if(s === "Therapy") {
	          this.currentSortDirTherapy4_cnv = this.currentSortDirTherapy4_cnv==='asc'?'desc':'asc';
	          this.currentSortDirMskpe_cnv = this.currentSortDirTherapy4_cnv;
	          this.currentSortMskpe_cnv = "drug_name"
	        }
	        else if(s === "References") {
	          this.currentSortDirRef4_cnv = this.currentSortDirRef4_cnv==='asc'?'desc':'asc';
	          this.currentSortDirMskpe_cnv = this.currentSortDirRef4_cnv;
	          this.currentSortMskpe_cnv = "ref_map"
	        }
	    },
	    sortadEff:function(s) {
	        //if s == current sort, reverse
	        if(s === "Gene") {
	          this.currentSortDirGene5 = this.currentSortDirGene5==='asc'?'desc':'asc';
	          this.currentSortDiradEff = this.currentSortDirGene5;
	          this.currentSortadEff = "gene"
	        }
	        else if(s === "Mutation") {
	          this.currentSortDirMut5 = this.currentSortDirMut5==='asc'?'desc':'asc';
	          this.currentSortDiradEff = this.currentSortDirMut5;
	          this.currentSortadEff = "variant"
	        }
	        else if(s === "Therapy") {
	          this.currentSortDirTherapy5 = this.currentSortDirTherapy5==='asc'?'desc':'asc';
	          this.currentSortDiradEff = this.currentSortDirTherapy5;
	          this.currentSortadEff ="drug_name"
	        }
	        else if(s === "Effect") {
	          this.currentSortDirEffect5 = this.currentSortDirEffect5==='asc'?'desc':'asc';
	          this.currentSortDiradEff = this.currentSortDirEffect5;
	          this.currentSortadEff ="variant_drug_association"
	        }
	        else if(s === "Variant Type") {
	          this.currentSortDirVariantType5 = this.currentSortDirVariantType5==='asc'?'desc':'asc';
	          this.currentSortDiradEff = this.currentSortDirVariantType5;
	          this.currentSortadEff ="variant_type"
	        }
	        else if(s === "Evidence") {
	          this.currentSortDirEvidence5 = this.currentSortDirEvidence5==='asc'?'desc':'asc';
	          this.currentSortDiradEff = this.currentSortDirEvidence5;
	          this.currentSortadEff ="match_level"
	        }
	        else if(s === "References") {
	          this.currentSortDirRef5 = this.currentSortDirRef5==='asc'?'desc':'asc';
	          this.currentSortDiradEff = this.currentSortDirRef5;
	          this.currentSortadEff = "ref_map"
	        }
	    },
	    sortAppendix:function(s) {
	        //if s == current sort, reverse
	        if(s === "Gene") {
	          this.currentSortDirGene6 = this.currentSortDirGene6==='asc'?'desc':'asc';
	          this.currentSortDirAppendix = this.currentSortDirGene6;
	          this.currentSortAppendix = "gene"
	        }
	        else if(s === "Mutation") {
	          this.currentSortDirMut6 = this.currentSortDirMut6==='asc'?'desc':'asc';
	          this.currentSortDirAppendix = this.currentSortDirMut6;
	          this.currentSortAppendix ="mutation"
	        }
	        else if(s === "Consequence") {
	          this.currentSortDirConsequence6 = this.currentSortDirConsequence6==='asc'?'desc':'asc';
	          this.currentSortDirAppendix = this.currentSortDirConsequence6;
	          this.currentSortAppendix ="Consequence"
	        }
	        else if(s === "VAF") {
	          this.currentSortDirVaf6 = this.currentSortDirVaf6==='asc'?'desc':'asc';
	          this.currentSortDirAppendix = this.currentSortDirVaf6;
	          this.currentSortAppendix ="vaf"
	        }
	        else if(s === "dbSNP") {
	          this.currentSortDirdbSNP5 = this.currentSortDirdbSNP5==='asc'?'desc':'asc';
	          this.currentSortDirAppendix = this.currentSortDirdbSNP5;
	          this.currentSortAppendix ="dbSNP"
	        }
	        else if(s === "COSMIC") {
	          this.currentSortDirCosmic5 = this.currentSortDirCosmic5==='asc'?'desc':'asc';
	          this.currentSortDirAppendix = this.currentSortDirCosmic5;
	          this.currentSortAppendix ="COSMIC"
	        }
	    },
	    sortAppendix_cnv:function(s) {
	        //if s == current sort, reverse
	        if(s === "Gene") {
	          this.currentSortDirGene6_cnv = this.currentSortDirGene6_cnv==='asc'?'desc':'asc';
	          this.currentSortDirAppendix_cnv = this.currentSortDirGene6_cnv;
	          this.currentSortAppendix_cnv = "gene"
	        }
	        else if(s === "Type") {
	          this.currentSortDirType6_cnv = this.currentSortDirType6_cnv==='asc'?'desc':'asc';
	          this.currentSortDirAppendix_cnv = this.currentSortDirType6_cnv;
	          this.currentSortAppendix_cnv ="type"
	        }
	        else if(s === "Copy Number") {
	          this.currentSortDirCopy6_cnv = this.currentSortDirCopy6_cnv==='asc'?'desc':'asc';
	          this.currentSortDirAppendix_cnv = this.currentSortDirCopy6_cnv;
	          this.currentSortAppendix_cnv ="copy_number"
	        }
	    },
	    movePages: function(amount) {
	        var newStartRow = this.startRow + (amount * this.rowsPerPage);
	        if (newStartRow >= 0 && newStartRow < this.sortedMskdg.length) {
	          this.startRow = newStartRow;
	        }
	        if( (amount == 1 || this.currentPage > 1) && (this.currentPage+amount)*this.rowsPerPage <= Math.ceil(this.sortedMskdg.length / 10) * 10){
	          this.currentPage += amount
	        }
	    },
	    movePages_cnv: function(amount) {
	        var newStartRow = this.startRow_cnv + (amount * this.rowsPerPage_cnv);
	        if (newStartRow >= 0 && newStartRow < this.sortedMskdg_cnv.length) {
	          this.startRow_cnv = newStartRow;
	        }
	        if( (amount == 1 || this.currentPage_cnv > 1) && (this.currentPage_cnv+amount)*this.rowsPerPage_cnv <= Math.ceil(this.sortedMskdg_cnv.length / 10) * 10){
	          this.currentPage_cnv += amount
	        }
	    },
	    movePagesPtpda: function(amount) {
	        var newStartRow = this.startRowPtpda + (amount * this.rowsPerPagePtpda);
	        if (newStartRow >= 0 && newStartRow < this.sortedPtpda.length) {
	          this.startRowPtpda = newStartRow;
	        }
	        if( (amount == 1 || this.currentPagePtpda > 1) && (this.currentPagePtpda+amount)*this.rowsPerPagePtpda <= Math.ceil(this.sortedPtpda.length / 10) * 10){
	          this.currentPagePtpda += amount
	        }
	    },
	    movePagesPtpda_cnv: function(amount) {
	        var newStartRow = this.startRowPtpda_cnv + (amount * this.rowsPerPagePtpda_cnv);
	        if (newStartRow >= 0 && newStartRow < this.sortedPtpda_cnv.length) {
	          this.startRowPtpda_cnv = newStartRow;
	        }
	        if( (amount == 1 || this.currentPagePtpda_cnv > 1) && (this.currentPagePtpda_cnv+amount)*this.rowsPerPagePtpda_cnv <= Math.ceil(this.sortedPtpda_cnv.length / 10) * 10){
	          this.currentPagePtpda_cnv += amount
	        }
	    },
	    movePagesPtpia: function(amount) {
	        var newStartRow = this.startRowPtpia + (amount * this.rowsPerPagePtpia);
	        if (newStartRow >= 0 && newStartRow < this.sortedPtpia.length) {
	          this.startRowPtpia = newStartRow;
	        }
	        if( (amount == 1 || this.currentPagePtpia > 1) && (this.currentPagePtpia+amount)*this.rowsPerPagePtpia <= Math.ceil(this.sortedPtpia.length / 10) * 10){
	          this.currentPagePtpia += amount
	        }
	    },
	    movePagesMskpe: function(amount) {
	        var newStartRow = this.startRowMskpe + (amount * this.rowsPerPageMskpe);
	        if (newStartRow >= 0 && newStartRow < this.sortedMskpe.length) {
	          this.startRowMskpe = newStartRow;
	        }
	        if( (amount == 1 || this.currentPageMskpe > 1) && (this.currentPageMskpe+amount)*this.rowsPerPageMskpe <= Math.ceil(this.sortedMskpe.length / 10) * 10){
	          this.currentPageMskpe += amount
	        }
	    },
	    movePagesPtpia_cnv: function(amount) {
	        var newStartRow = this.startRowPtpia_cnv + (amount * this.rowsPerPagePtpia_cnv);
	        if (newStartRow >= 0 && newStartRow < this.sortedPtpia_cnv.length) {
	          this.startRowPtpia_cnv = newStartRow;
	        }
	        if( (amount == 1 || this.currentPagePtpia_cnv > 1) && (this.currentPagePtpia_cnv+amount)*this.rowsPerPagePtpia_cnv <= Math.ceil(this.sortedPtpia_cnv.length / 10) * 10){
	          this.currentPagePtpia_cnv += amount
	        }
	    },
	    movePagesMskpe_cnv: function(amount) {
	        var newStartRow = this.startRowMskpe_cnv + (amount * this.rowsPerPageMskpe_cnv);
	        if (newStartRow >= 0 && newStartRow < this.sortedMskpe_cnv.length) {
	          this.startRowMskpe_cnv = newStartRow;
	        }
	        if( (amount == 1 || this.currentPageMskpe_cnv > 1) && (this.currentPageMskpe_cnv+amount)*this.rowsPerPageMskpe_cnv <= Math.ceil(this.sortedMskpe_cnv.length / 10) * 10){
	          this.currentPageMskpe_cnv += amount
	        }
	    },
	    movePagesadEff: function(amount) {
	        var newStartRow = this.startRowadEff + (amount * this.rowsPerPageadEff);
	        if (newStartRow >= 0 && newStartRow < this.sortedadEff.length) {
	          this.startRowadEff = newStartRow;
	        }
	        if( (amount == 1 || this.currentPageadEff > 1) && (this.currentPageadEff+amount)*this.rowsPerPageadEff <= Math.ceil(this.sortedadEff.length / 10) * 10){
	          this.currentPageadEff += amount
	        }
	    },
	    movePagesAppendix: function(amount) {
	        var newStartRow = this.startRowAppendix + (amount * this.rowsPerPageAppendix);
	        if (newStartRow >= 0 && newStartRow < this.sortedAppendix.length) {
	          this.startRowAppendix = newStartRow;
	        }
	        if( (amount == 1 || this.currentPageAppendix > 1) && (this.currentPageAppendix+amount)*this.rowsPerPageAppendix <= Math.ceil(this.sortedAppendix.length / 10) * 10){
	          this.currentPageAppendix += amount
	        }
	    },
	    movePagesAppendix_cnv: function(amount) {
	        var newStartRow = this.startRowAppendix_cnv + (amount * this.rowsPerPageAppendix_cnv);
	        if (newStartRow >= 0 && newStartRow < this.sortedAppendix_cnv.length) {
	          this.startRowAppendix_cnv = newStartRow;
	        }
	        if( (amount == 1 || this.currentPageAppendix_cnv > 1) && (this.currentPageAppendix_cnv+amount)*this.rowsPerPageAppendix_cnv <= Math.ceil(this.sortedAppendix_cnv.length / 10) * 10){
	          this.currentPageAppendix_cnv += amount
	        }
	    },
	    showMore: function(item){
		    document.getElementById(item.Overflow).className='';
		    document.getElementById(item.MoreLink).className='hidden';
		    document.getElementById(item.LessLink).className='';
		}, 
		showLess: function(item){
		    document.getElementById(item.Overflow).className='hidden';
		    document.getElementById(item.MoreLink).className='';
		    document.getElementById(item.LessLink).className='hidden';
		}
	},
	created(){
	   this.startAnalysis();
	},
	computed: {
	    sortedMskdg:function() {
	        var sorted = this.driver_table.sort((a,b) => {
	          let modifier = 1;
	          if(this.currentSortDir === 'desc') modifier = -1;
	          if(a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
	          if(a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
	          return 0;
	        });
	        var filtered_sorted = []
	        var i = 0;
	        for(var item of sorted){
	        	var shrinkable = item.tumor_list;
				if (shrinkable.length > 0) {
			        	var fullText = shrinkable;
			        	if(fullText.length > 20){
			            	var trunc = fullText.substring(0, 20);
			            	var index = trunc.lastIndexOf("|");
			            	trunc = fullText.substring(0, index+1);
			            	var remainder = "";
			            	remainder = fullText.substring(index+1, fullText.length);
			            	item.trunc = trunc;
			            	item.remainder = remainder;
			            	item.MoreLink = "itemMoreLink"+i
			            	item.LessLink = "itemLessLink" +i
			            	item.Overflow = "itemOverflow"+i
			            	i++;
			        	}
			        	else{
			        		item.trunc = fullText;
			        	}
				}
	          if((this.genes1 == null || this.genes1 == undefined || this.genes1 == '' || item.gene.toLowerCase().includes(this.genes1.toLowerCase())) &&
	                (this.mutations1 == '' || this.mutations1 == null || this.mutations1 == undefined || item.one_letter_repr.toLowerCase().includes(this.mutations1.toLowerCase())) && 
	                (this.driverType1 == null ||this.driverType1 == '' || this.driverType1 == undefined|| item.driver_role.toLowerCase().includes(this.driverType1.toLowerCase())) && 
	                (this.consequence1 == '' ||this.consequence1 == null || this.consequence1 ==undefined || item.Consequence.toLowerCase().includes(this.consequence1.toLowerCase())) && (this.tumorType1 == null || this.tumorType1 == undefined || item.tumor_list.includes(this.tumorType1)) &&
	                (this.vaf1 == '' ||this.vaf1 == undefined ||this.vaf1 == null || item.vaf.includes(this.vaf1) )&&  
	                (this.reference1 == ''||this.reference1 == null || this.reference1 == undefined || item.ref_map.includes(this.reference1)) &&
	                (this.genesall == '' ||this.genesall == null || this.genesall == undefined || item.gene.toLowerCase().includes(this.genesall.toLowerCase()))&&
	                (this.mutationall == null | this.mutationall == undefined|| this.mutationall == ''|| item.one_letter_repr.toLowerCase().includes(this.mutationall.toLowerCase()))){
	            filtered_sorted.push(item)
	          }
	        }
	        return filtered_sorted
	    },
	    sortedMskdg_cnv:function() {
	        var sorted = this.driver_table_cnv.sort((a,b) => {
	          let modifier = 1;
	          if(this.currentSortDir_cnv === 'desc') modifier = -1;
	          if(a[this.currentSort_cnv] < b[this.currentSort_cnv]) return -1 * modifier;
	          if(a[this.currentSort_cnv] > b[this.currentSort_cnv]) return 1 * modifier;
	          return 0;
	        });
	        var filtered_sorted = []
	        var i = 0;
	        for(var item of sorted){
	        	var shrinkable = item.tumor_list;
				if (shrinkable.length > 0) {
			        	var fullText = shrinkable;
			        	if(fullText.length > 20){
			            	var trunc = fullText.substring(0, 20);
			            	var index = trunc.lastIndexOf("|");
			            	trunc = fullText.substring(0, index+1);
			            	var remainder = "";
			            	remainder = fullText.substring(index+1, fullText.length);
			            	item.trunc = trunc;
			            	item.remainder = remainder;
			            	item.MoreLink = "itemMoreLink"+i
			            	item.LessLink = "itemLessLink" +i
			            	item.Overflow = "itemOverflow"+i
			            	i++;
			        	}
			        	else{
			        		item.trunc = fullText;
			        	}
				}
	          if((this.genes1_cnv == null || this.genes1_cnv == undefined || this.genes1_cnv == '' || item.gene.toLowerCase().includes(this.genes1_cnv.toLowerCase())) &&
	                (this.type1_cnv == '' || this.type1_cnv == null || this.type1_cnv == undefined || item.type.toLowerCase().includes(this.type1_cnv.toLowerCase())) && 
	                (this.driverType1_cnv == null ||this.driverType1_cnv == '' || this.driverType1_cnv == undefined|| item.driver_role.toLowerCase().includes(this.driverType1_cnv.toLowerCase())) && 
	                (this.reference1_cnv == ''||this.reference1_cnv == null || this.reference1_cnv == undefined || item.ref_map.includes(this.reference1_cnv)) &&
	                (this.genesall == '' ||this.genesall == null || this.genesall == undefined || item.gene.toLowerCase().includes(this.genesall.toLowerCase()))){
	            filtered_sorted.push(item)
	          }
	        }
	        return filtered_sorted
	    },
	    sortedPtpda:function() {
	        var sorted = this.direct_pharm_table.sort((a,b) => {
	          let modifier = 1;
	          if(this.currentSortDirPtpda === 'desc') modifier = -1;
	          if(a[this.currentSortPtpda] < b[this.currentSortPtpda]) return -1 * modifier;
	          if(a[this.currentSortPtpda] > b[this.currentSortPtpda]) return 1 * modifier;
	          return 0;
	        });
	        var filtered_sorted = [];
	        for(var item of sorted){
	          if((item.gene.toLowerCase().includes(this.genes2.toLowerCase()) || this.genes2 == null || this.genes2 == undefined) && 
	                (item.variant.toLowerCase().includes(this.mutation2.toLowerCase()) || this.mutation2== null | this.mutation2== undefined) && 
	                (this.therapy2 == null || this.therapy2 == undefined|| item.drug_name.toLowerCase().includes(this.therapy2.toLowerCase())) && 
	                (this.effect2 == null || this.effect2 == undefined || item.variant_drug_association.toLowerCase().includes(this.effect2.toLowerCase())) && 
	                (this.disease2 == null || this.disease2 == undefined || item.tumor_list.toLowerCase().includes(this.disease2.toLowerCase())) &&
	                (this.evidence2 == null || this.evidence2 ==undefined|| item.match_level.toLowerCase().includes(this.evidence2.toLowerCase())) &&  
	                (this.reference2 == null || this.reference2 ==undefined|| item.ref_map.includes(this.reference2))&&
	                (item.gene.toLowerCase().includes(this.genesall.toLowerCase()) || this.genesall == null || this.genesall == undefined)&&
	                (this.therapyall == null || this.therapyall ==undefined|| item.drug_name.toLowerCase().includes(this.therapyall.toLowerCase()))&&
	                (item.variant.toLowerCase().includes(this.mutationall.toLowerCase()) || this.mutationall == null || this.mutationall == undefined)&&
	                (item.tumor_list.toLowerCase().includes(this.diseaseall.toLowerCase()) || this.diseaseall == null || this.diseaseall == undefined)){
	            filtered_sorted.push(item)
	          }
	        }
	        return filtered_sorted;
	    },
	    sortedPtpda_cnv:function() {
	        var sorted = this.direct_pharm_table_cnv.sort((a,b) => {
	          let modifier = 1;
	          if(this.currentSortDirPtpda_cnv === 'desc') modifier = -1;
	          if(a[this.currentSortPtpda_cnv] < b[this.currentSortPtpda_cnv]) return -1 * modifier;
	          if(a[this.currentSortPtpda_cnv] > b[this.currentSortPtpda_cnv]) return 1 * modifier;
	          return 0;
	        });
	        var filtered_sorted = [];
	        for(var item of sorted){
	          if((item.gene.toLowerCase().includes(this.genes2_cnv.toLowerCase()) || this.genes2_cnv == null || this.genes2_cnv == undefined) && 
	                (item.variant.toLowerCase().includes(this.mutation2_cnv.toLowerCase()) || this.mutation2_cnv== null | this.mutation2_cnv== undefined) && 
	                (this.therapy2_cnv == null || this.therapy2_cnv == undefined|| item.drug_name.toLowerCase().includes(this.therapy2_cnv.toLowerCase())) && 
	                (this.effect2_cnv == null || this.effect2_cnv == undefined || item.variant_drug_association.toLowerCase().includes(this.effect2_cnv.toLowerCase())) && 
	                (this.disease2_cnv == null || this.disease2_cnv == undefined || item.tumor_list.toLowerCase().includes(this.disease2_cnv.toLowerCase())) &&
	                (this.evidence2_cnv == null || this.evidence2_cnv ==undefined|| item.match_level.toLowerCase().includes(this.evidence2_cnv.toLowerCase())) &&  
	                (this.reference2_cnv == null || this.reference2_cnv ==undefined|| item.ref_map.includes(this.reference2_cnv))&&
	                (item.gene.toLowerCase().includes(this.genesall.toLowerCase()) || this.genesall == null || this.genesall == undefined) //&&
	                // (this.therapyall == null || this.therapyall ==undefined|| item.drug_name.toLowerCase().includes(this.therapyall.toLowerCase())) &&
	                // (item.variant.toLowerCase().includes(this.mutationall.toLowerCase()) || this.mutationall == null || this.mutationall == undefined)&&
	                // (item.tumor_list.toLowerCase().includes(this.diseaseall.toLowerCase()) || this.diseaseall == null || this.diseaseall == undefined)
	                ){
	            filtered_sorted.push(item)
	          }
	        }
	        return filtered_sorted;
	    },
	    sortedPtpia:function() {
	        var sorted = this.pharm_table.sort((a,b) => {
	          let modifier = 1;
	          if(this.currentSortDirPtpia === 'desc') modifier = -1;
	          if(a[this.currentSortPtpia] < b[this.currentSortPtpia]) return -1 * modifier;
	          if(a[this.currentSortPtpia] > b[this.currentSortPtpia]) return 1 * modifier;
	          return 0;
	        });
	        var filtered_sorted = [];
	        for(var item of sorted){
	          if((item.gene.toLowerCase().includes(this.genes3.toLowerCase()) || this.genes3 == null || this.genes3 == undefined) && 
	                    (item.variant.toLowerCase().includes(this.mutations3.toLowerCase()) || this.mutations3 == null || this.mutations3 ==undefined) &&
	                    (this.therapy3 == null || this.therapy3 ==undefined|| item.drug_name.toLowerCase().includes(this.therapy3.toLowerCase())) && 
	                    (this.effect3 == null || this.effect3 ==undefined|| item.variant_drug_association.toLowerCase().includes(this.effect3.toLowerCase())) && 
	                    (this.disease3 == null ||this.disease3 ==undefined|| item.tumor_list.toLowerCase().includes(this.disease3.toLowerCase())) && 
	                    (this.evidence3 == '' ||this.evidence3 == null || this.evidence3 ==undefined|| item.match_level.toLowerCase() == this.evidence3.toLowerCase()) && 
	                    (this.reference3 == null || this.reference3 ==undefined|| item.ref_map.includes(this.reference3))&&
	                    (item.gene.toLowerCase().includes(this.genesall.toLowerCase()) || this.genesall == null || this.genesall == undefined)&&
	                    (this.therapyall == null || this.therapyall ==undefined|| item.drug_name.toLowerCase().includes(this.therapyall.toLowerCase()))&&
	                    (this.diseaseall == null || this.diseaseall ==undefined|| item.tumor_list.toLowerCase().includes(this.diseaseall.toLowerCase()))&& (this.mutationall == null ||this.mutationall ==undefined||  item.variant.toLowerCase().includes(this.mutationall.toLowerCase()))){
	            filtered_sorted.push(item);
	          }
	        }
	        return filtered_sorted
	    },
	    sortedMskpe:function() {
	        var sorted = this.mechanistic_drug_table.sort((a,b) => {
	          let modifier = 1;
	          if(this.currentSortDirMskpe === 'desc') modifier = -1;
	          if(a[this.currentSortMskpe] < b[this.currentSortMskpe]) return -1 * modifier;
	          if(a[this.currentSortMskpe] > b[this.currentSortMskpe]) return 1 * modifier;
	          return 0;
	        });
	        var filtered_sorted = [];
	        for(var item of sorted){
	          if((this.genes4 == null || this.genes4 == undefined||item.gene.toLowerCase().includes(this.genes4.toLowerCase())) && 
	                    (this.status4 == null || this.status4==undefined||item.approval_status.toLowerCase().includes(this.status4.toLowerCase())) && 
	                    (this.therapy4 == null || this.therapy4 == undefined|| item.drug_name.toLowerCase().includes(this.therapy4.toLowerCase())) && 
	                    (this.reference4 == null || this.reference4 ==undefined|| item.ref_map.includes(this.reference4))&&
	                    (this.genesall == null || this.genesall == undefined||item.gene.toLowerCase().includes(this.genesall.toLowerCase()))&&
	                    (this.therapyall == null || this.therapyall ==undefined|| item.drug_name.toLowerCase().includes(this.therapyall.toLowerCase()))){
	            filtered_sorted.push(item);
	          }
	        }
	        return filtered_sorted
	    },
	    sortedPtpia_cnv:function() {
	        var sorted = this.pharm_table_cnv.sort((a,b) => {
	          let modifier = 1;
	          if(this.currentSortDirPtpia_cnv === 'desc') modifier = -1;
	          if(a[this.currentSortPtpia_cnv] < b[this.currentSortPtpia_cnv]) return -1 * modifier;
	          if(a[this.currentSortPtpia_cnv] > b[this.currentSortPtpia_cnv]) return 1 * modifier;
	          return 0;
	        });
	        var filtered_sorted = [];
	        for(var item of sorted){
	          if((item.gene.toLowerCase().includes(this.genes3_cnv.toLowerCase()) || this.genes3_cnv == null || this.genes3_cnv == undefined) && 
	                    (item.variant.toLowerCase().includes(this.mutations3_cnv.toLowerCase()) || this.mutations3_cnv == null || this.mutations3_cnv ==undefined) &&
	                    (this.therapy3_cnv == null || this.therapy3_cnv ==undefined|| item.drug_name.toLowerCase().includes(this.therapy3_cnv.toLowerCase())) && 
	                    (this.effect3_cnv == null || this.effect3_cnv ==undefined|| item.variant_drug_association.toLowerCase().includes(this.effect3_cnv.toLowerCase())) &&(this.disease3_cnv == null ||this.disease3_cnv ==undefined|| item.tumor_list.toLowerCase().includes(this.disease3_cnv.toLowerCase())) && 
	                    (this.evidence3_cnv == '' ||this.evidence3_cnv == null || this.evidence3_cnv ==undefined|| item.match_level.toLowerCase() == this.evidence3_cnv.toLowerCase()) && 
	                    (this.reference3_cnv == null || this.reference3_cnv ==undefined|| item.ref_map.includes(this.reference3_cnv))&&
	                    (item.gene.toLowerCase().includes(this.genesall.toLowerCase()) || this.genesall == null || this.genesall == undefined) //&&
	                    // (this.therapyall == null || this.therapyall ==undefined|| item.drug_name.toLowerCase().includes(this.therapyall.toLowerCase()))&&
	                    // (this.diseaseall == null || this.diseaseall ==undefined|| item.tumor_list.toLowerCase().includes(this.diseaseall.toLowerCase()))&& (this.mutationall == null ||this.mutationall ==undefined||  item.variant.toLowerCase().includes(this.mutationall.toLowerCase()))
	                    ){
	            filtered_sorted.push(item);
	          }
	        }
	        return filtered_sorted
	    },
	    sortedMskpe_cnv:function() {
	        var sorted = this.mechanistic_drug_table_cnv.sort((a,b) => {
	          let modifier = 1;
	          if(this.currentSortDirMskpe_cnv === 'desc') modifier = -1;
	          if(a[this.currentSortMskpe_cnv] < b[this.currentSortMskpe_cnv]) return -1 * modifier;
	          if(a[this.currentSortMskpe_cnv] > b[this.currentSortMskpe_cnv]) return 1 * modifier;
	          return 0;
	        });
	        var filtered_sorted = [];
	        for(var item of sorted){
	          if((this.genes4_cnv == null || this.genes4_cnv == undefined||item.gene.toLowerCase().includes(this.genes4_cnv.toLowerCase())) && 
	                    (this.status4_cnv == null || this.status4_cnv==undefined||item.approval_status.toLowerCase().includes(this.status4_cnv.toLowerCase())) && 
	                    (this.therapy4_cnv == null || this.therapy4_cnv == undefined|| item.drug_name.toLowerCase().includes(this.therapy4_cnv.toLowerCase())) && 
	                    (this.reference4_cnv == null || this.reference4_cnv ==undefined|| item.ref_map.includes(this.reference4_cnv))&&
	                    (this.genesall == null || this.genesall == undefined||item.gene.toLowerCase().includes(this.genesall.toLowerCase()))&&
	                    (this.therapyall == null || this.therapyall ==undefined|| item.drug_name.toLowerCase().includes(this.therapyall.toLowerCase()))){
	            filtered_sorted.push(item);
	          }
	        }
	        return filtered_sorted
	    },
	    sortedadEff:function() {
	        var sorted = this.adEff.sort((a,b) => {
	          let modifier = 1;
	          if(this.currentSortDiradEff === 'desc') modifier = -1;
	          if(a[this.currentSortadEff] < b[this.currentSortadEff]) return -1 * modifier;
	          if(a[this.currentSortadEff] > b[this.currentSortadEff]) return 1 * modifier;
	          return 0;
	        });
	        var filtered_sorted = [];
	        for(var item of sorted){
	          if((item.gene.toLowerCase().includes(this.genes5.toLowerCase()) || this.genes5 == null || this.genes5 ==undefined) && 
	                (item.variant.toLowerCase().includes(this.mutations5.toLowerCase()) || this.mutations5 == null || this.mutations5==undefined) && 
	                (this.therapy5 == null ||this.therapy5 == undefined|| item.drug_name.toLowerCase().includes(this.therapy5.toLowerCase())) && 
	                (this.effect5 == null ||this.effect5 == undefined|| item.variant_drug_association == this.effect5) && 
	                (this.variantType5 == null || this.variantType5 == undefined|| item.variant_type == this.variantType5) && 
	                (this.evidence5 == null ||this.evidence5 == undefined|| item.match_level == this.evidence5) && 
	                (this.reference5 == null || this.reference5 == undefined|| item.ref_map.includes(this.reference5))&&
	                (item.gene.toLowerCase().includes(this.genesall.toLowerCase()) || this.genesall == null || this.genesall == undefined)&&
	                (this.therapyall == null || this.therapyall == undefined|| item.Therapy.toLowerCase().includes(this.therapyall.toLowerCase()))&&
	                (item.variant.toLowerCase().includes(this.mutationall.toLowerCase()) || this.mutationall == null|| this.mutationall == undefined)){
	            filtered_sorted.push(item)
	          }
	        }
	        return filtered_sorted;
	    },
	   	sortedAppendix:function() {
	        var sorted = this.appendix_variant_table.sort((a,b) => {
	          let modifier = 1;
	          if(this.currentSortDirAppendix === 'desc') modifier = -1;
	          if(a[this.currentSortAppendix] < b[this.currentSortAppendix]) return -1 * modifier;
	          if(a[this.currentSortAppendix] > b[this.currentSortAppendix]) return 1 * modifier;
	          return 0;
	        });
	        var filtered_sorted = [];
	        for(var item of sorted){
	          if( (item.gene.toLowerCase().includes(this.genes6.toLowerCase()) || this.genes6 == null| this.genes6 == undefined) && 
	                      (item.mutation.toLowerCase().includes(this.mutations6.toLowerCase()) || this.mutations6 == null|| this.mutations6 == undefined) && 
	                      (item.Consequence.toLowerCase().includes(this.consequence6.toLowerCase()) || this.consequence6 == null || this.consequence6 == undefined) && 
	                      (item.vaf.toLowerCase().includes(this.vaf6.toLowerCase()) || this.vaf6 == null || this.vaf6 == undefined) && 
	                      (this.dbSNP6 == null ||this.dbSNP6 == undefined|| item.dbSNP.includes(this.dbSNP6)) && 
	                      (this.cosmic6 == null ||this.cosmic6 == undefined|| item.COSMIC.toLowerCase().includes(this.cosmic6.toLowerCase()))&&
	                      (item.gene.toLowerCase().includes(this.genesall.toLowerCase()) || this.genesall == null|| this.genesall == undefined)&& 
	                      (this.mutationall == null ||this.mutationall == undefined|| item.mutation.toLowerCase().includes(this.mutationall.toLowerCase()))){
	            item.dbSNP=JSON.stringify(item.dbSNP).replace(/[\[\]']+/g,'').replace(/^"|"$/g, '')
	            item.COSMIC = JSON.stringify(item.COSMIC).replace(/[\[\]']+/g,'').replace(/"/g, '').replace(/,/g,', ')
	            filtered_sorted.push(item)
	          }
	        }
	        return filtered_sorted;
	    },
	    sortedAppendix_cnv:function() {
	        var sorted = this.appendix_variant_table_cnv.sort((a,b) => {
	          let modifier = 1;
	          if(this.currentSortDirAppendix_cnv === 'desc') modifier = -1;
	          if(a[this.currentSortAppendix_cnv] < b[this.currentSortAppendix_cnv]) return -1 * modifier;
	          if(a[this.currentSortAppendix_cnv] > b[this.currentSortAppendix_cnv]) return 1 * modifier;
	          return 0;
	        });
	        var filtered_sorted = [];
	        for(var item of sorted){
	          if( (item.gene.toLowerCase().includes(this.genes6_cnv.toLowerCase()) || this.genes6_cnv == null| this.genes6_cnv == undefined) && 
	                      (item.type.toLowerCase().includes(this.type6_cnv.toLowerCase()) || this.type6_cnv == null|| this.type6_cnv == undefined) && 
	                      (item.copy_number == this.copy6_cnv || this.copy6_cnv == null || this.copy6_cnv == undefined || this.copy6_cnv == '') && 
	                      (item.gene.toLowerCase().includes(this.genesall.toLowerCase()) || this.genesall == null|| this.genesall == undefined)){
	            filtered_sorted.push(item)
	          }
	        }
	        return filtered_sorted;
	    },
    },
    updated() {

    }
  }
</script>
