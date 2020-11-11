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
			    <div  data-app v-show="showTable" ref="all" style="width:100%">
			      	<div style="width:100%">
				      	<table data-html2canvas-ignore="true" class="float-left">
				        	<tr>
					          	<td style="padding:20px 15px 0 15px;"><b-icon icon="funnel"></b-icon></td>
					          	<td style="padding:0 15px 0 15px;">
					            	<v-text-field v-model="genesall" type="string" label="Gene" style="border-style: none;"clearable></v-text-field>
					         	</td>
					        </tr>
				      	</table>
				      	<p class="dropdown" width="5vw" style="float:right; margin-right: 2vw">
			          		<button class="dropbtn"><b-icon icon="download"></b-icon>
			                    <div class="dropdown-content">
						           	<a class="page-link" @click="exportToPDF_all()" >PDF</a>
						           	<a class="page-link" @click="download_DriverNetwork()" >Driver Network</a>
						           	<a class="page-link" @click="download_json()">JSON</a>
					          	</div>
		          			</button>
			          	</p>
			      	</div>
			  		<div ref = "content_driver_table_cnv" id="driver_table_content_cnv" class="row" style="margin-bottom: 1.5vw; margin-left: 10px;">
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
									            <a v-if = "item.eccode" class="page-link" :href="item.eccode">IntEnz</a>
									            <a v-if = "item.ensembl"class="page-link" :href="item.ensembl">Ensembl</a>
									            <a v-if = "item.hgnc" class="page-link" :href="item.hgnc">HGNC</a>
									            <!-- <a class="page-link" :href="item.omim">OMIM</a>
									            <a class="page-link" :href="item.entrez">Entrez</a> -->
									            <a v-if = "item.mdanderson"class="page-link" :href="item.mdanderson">MDAnderson</a>
									            <a v-if = "item.kegg"class="page-link" :href="item.kegg">KEGG</a>
									            <a v-if = "item.uniprot"class="page-link" :href="item.uniprot">UniProt</a>
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
					                    <a v-if="item.remainder" v-bind:id="item.MoreLink" v-on:click="showMore(item)">More</a>
					                    <a v-if="item.remainder" class="hidden" v-bind:id="item.LessLink" v-on:click="showLess(item)">Less</a>
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
				                  <td style="width: 5px">
				                    <select v-model="rowsPerPage_cnv">
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
				          	</b-card> 
				        </b-collapse>
				        <div v-show="visibleDrivers_cnv && visibleDrivergenes_cnv" class="embed-responsive embed-responsive-16by9 z-depth-1-half column">
							<iframe id="drivergenesVis" class="embed-responsive-item" src="http://localhost:3000/BioGraphVisart/drivergenes" allowfullscreen></iframe>
						</div>
				    </div> 	      
				    <div ref = "content_direct_pharm_table_cnv" id="direct_pharm_table_content_cnv" class="row" style="margin-bottom: 1.5vw; margin-left: 10px;">
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
				          <Strong style="color: white">CNV: Somatic Mutations with Known Pharmacogenetic Effect</Strong><b-icon data-html2canvas-ignore="true" icon="info-circle" style="margin-left: 10px" v-bind="attrs" v-on="on"></b-icon> <b-icon data-html2canvas-ignore="true" class="float-right"icon="arrows-expand" v-if="visiblePharma"></b-icon> <b-icon class="float-right" icon="arrows-collapse" v-else></b-icon>
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
									            <a v-if = "item.eccode" class="page-link" :href="item.eccode">IntEnz</a>
									            <a v-if = "item.ensembl"class="page-link" :href="item.ensembl">Ensembl</a>
									            <a v-if = "item.hgnc" class="page-link" :href="item.hgnc">HGNC</a>
									            <a v-if = "item.mdanderson"class="page-link" :href="item.mdanderson">MDAnderson</a>
									            <a v-if = "item.kegg"class="page-link" :href="item.kegg">KEGG</a>
									            <a v-if = "item.uniprot"class="page-link" :href="item.uniprot">UniProt</a>
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
				            <div id="page-navigation" class="float-right" data-html2canvas-ignore="true">
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
				         </b-card>
				        </b-collapse>
				        <div v-show="visiblePharma_cnv && visiblePharmaco_cnv" class="embed-responsive embed-responsive-16by9 z-depth-1-half column">
							<iframe id="pharmacoVis" class="embed-responsive-item" src="http://localhost:3000/BioGraphVisart/pharmaco" allowfullscreen></iframe>
						</div>
				    	<br><br>
				    </div>
				    <div ref="content_smptag_cnv" style="margin-left: 10px; width : 100%;">
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
					        <div ref = "content_pharm_table_cnv" id="pharm_table_content_cnv" class="row" style="margin-top: 0.5vw; margin-left: 1px; margin-bottom: 0.5vw">
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
									            <a v-if = "item.eccode" class="page-link" :href="item.eccode">IntEnz</a>
									            <a v-if = "item.ensembl"class="page-link" :href="item.ensembl">Ensembl</a>
									            <a v-if = "item.hgnc" class="page-link" :href="item.hgnc">HGNC</a>
									            <a v-if = "item.mdanderson"class="page-link" :href="item.mdanderson">MDAnderson</a>
									            <a v-if = "item.kegg"class="page-link" :href="item.kegg">KEGG</a>
									            <a v-if = "item.uniprot"class="page-link" :href="item.uniprot">UniProt</a>
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
					                <div id="page-navigation" class="float-right" data-html2canvas-ignore="true">
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
					            	</b-card>
					          	</b-collapse>
					          	<div v-show="visibleAffectCivic_cnv && visibleCivic_cnv" class="embed-responsive embed-responsive-16by9 z-depth-1-half column">
									<iframe id="civicVis" class="embed-responsive-item" src="http://localhost:3000/BioGraphVisart/civic" allowfullscreen></iframe>
								</div>
								<br>
					    		<br>
					        </div>
					       	<div ref = "content_mechanistic_drug_table_cnv" id="mechanistic_drug_table_content_cnv" class="row" style="margin-bottom: 1.5vw; margin-left: 1px;" >
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
											            <a v-if = "item.eccode" class="page-link" :href="item.eccode">IntEnz</a>
											            <a v-if = "item.ensembl"class="page-link" :href="item.ensembl">Ensembl</a>
											            <a v-if = "item.hgnc" class="page-link" :href="item.hgnc">HGNC</a>
											            <a v-if = "item.mdanderson"class="page-link" :href="item.mdanderson">MDAnderson</a>
											            <a v-if = "item.kegg"class="page-link" :href="item.kegg">KEGG</a>
											            <a v-if = "item.uniprot"class="page-link" :href="item.uniprot">UniProt</a>
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
						                <div id="page-navigation" class="float-right" data-html2canvas-ignore="true">
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
						          </b-card>
					          </b-collapse>
					          <div v-show="visibleAffectCancer_cnv && visibleCancer_cnv" class="embed-responsive embed-responsive-16by9 z-depth-1-half column">
								<iframe id="cancerVis" class="embed-responsive-item" src="http://localhost:3000/BioGraphVisart/cancer" allowfullscreen></iframe>
							</div> 
					        </div>
				        </b-collapse>
				    </div>  
				    <div ref="content_ref_cnv" id="ref_content_cnv" class="row" style="margin-left: 10px; margin-bottom: 1.5vw">
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
				    <div ref="content_appendix_variant_table_cnv" id="appendix_variant_table_content_cnv" class="row" style="margin-left: 10px;">
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
				                <div id="page-navigation" class="float-right" data-html2canvas-ignore="true">
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
      title: 'PeCax - CNV'
    },
    components: {
        },
    data (){
      return {    
        cnvfile:new File([""], ""),
        jobid:"",
        showNetwork:false,
        cnvjsonReport:"",

        selected:[],
        refHeaders: [
            {text: 'Id',
             align:'left',
             sortable: false,
             value: 'rowid'},
            {text: 'Citation', value: 'citation'},
            {text: 'url', value: 'url'},
        ],

        genesall:'',
        therapyall:'',
        diseaseall:'',
        mutationall:'',

        cnvanalyzed:false,
        currentSort_cnv:'Gene',
        currentSortDir_cnv:'asc',
        currentSortDirGene1_cnv:'asc',
        currentSortDirType1_cnv:'asc',
        currentSortDirTumorList1_cnv:'asc',
        currentSortDirDriverType1_cnv:'asc',
        currentSortDirRef1_cnv:'asc',

        currentSortPtpda_cnv:'Gene',
        currentSortDirPtpda_cnv:'asc',
        currentSortDirGene2_cnv:'asc',
        currentSortDirStat2_cnv:'asc',
        currentSortDirTherapy2_cnv:'asc',
        currentSortDirConf2_cnv:'asc',
        currentSortDirRef2_cnv:'asc',

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

        currentSortAppendix_cnv:'Gene',
        currentSortDirAppendix_cnv:'asc',
        currentSortDirGene6_cnv:'asc',
        currentSortDirType6_cnv:'asc',
        currentSortDirConpy6_cnv:'asc',

        startRow_cnv: 0,
        currentPage_cnv: 1,
        rowsPerPage_cnv: 10,

        startRowPtpda_cnv: 0,
        currentPagePtpda_cnv: 1,
        rowsPerPagePtpda_cnv: 10,

        startRowPtpia_cnv: 0,
        currentPagePtpia_cnv: 1,
        rowsPerPagePtpia_cnv: 10,

        startRowMskpe_cnv: 0,
        currentPageMskpe_cnv: 1,
        rowsPerPageMskpe_cnv: 10,

        startRowadEff_cnv: 0,
        currentPageadEff_cnv: 1,
        rowsPerPageadEff_cnv: 10,

        startRowAppendix_cnv: 0,
        currentPageAppendix_cnv: 1,
        rowsPerPageAppendix_cnv: 10,

        visibleDrivers_cnv: true,
        visibleDrivergenes_cnv : true,
        visiblePharma_cnv: true,
        visiblePharmaco_cnv:true,
        visibleAffect_cnv: true,
        visibleAffectCivic_cnv: true,
        visibleCivic_cnv:true,
        visibleAffectCancer_cnv: true,
        visibleCancer_cnv:true,
        visibleRef_cnv: false,
        visibleAppendix_cnv: false,
        showTable:false,
        showFileLoad_cnv:true,
        driver_table_cnv: [],
        direct_pharm_table_cnv : [],
        pharm_table_cnv : [],
        mechanistic_drug_table_cnv: [],
        appendix_reference_table_cnv: [],
        refHeaders: [
            {text: 'Id',
             align:'left',
             sortable: false,
             value: 'rowid'},
            {text: 'Citation', value: 'citation'},
            {text: 'url', value: 'url'},
        ],
        appendix_variant_table_cnv: [],

        genes1_cnv:'',
        type1_cnv:'',
        copy1_cnv:'',
        driverType1_cnv:'',
        tumorList_cnv:'',
        effect1_cnv:'',
        reference1_cnv:'',

        genes2_cnv:'',
        mutation2_cnv:'',
        therapy2_cnv:'',
        effect2_cnv:'',
        disease2_cnv:'',
        evidence2_cnv:'',
        reference2_cnv:'',

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

        
        search5_cnv: '',
      
        genes6_cnv:'',
        type6_cnv:'',
        copy6_cnv:'',

        hidedriver_tableType_cnv:true,
        hidedriver_tableDriverType_cnv:true,
        hidedriver_tableTumorList_cnv:true,
        hidedriver_tableReferences_cnv:true,
        hidedirect_pharm_tableMutation_cnv:true,
        hidedirect_pharm_tableTherapy_cnv:true,
        hidedirect_pharm_table:true,
        hidedirect_pharm_tableDisease_cnv:true,
        hidedirect_pharm_tableEvidence_cnv:true,
        hidedirect_pharm_tableReferences_cnv:true,
        hidedirect_pharm_tableEffect_cnv:true,
        hidepharm_tableMutation_cnv:true,
        hidepharm_tableEffect_cnv:true,
        hidepharm_tableDisease_cnv:true,
        hidepharm_tableEvidence_cnv:true,
        hidepharm_tableReferences_cnv:true,
        hidepharm_tableTherapy_cnv:true,
        hidemechanistic_drug_tableStatus_cnv:true,
        hidemechanistic_drug_tableTherapy_cnv:true,
        hidemechanistic_drug_tableReferences_cnv:true,
        hideappendix_variant_tableType_cnv:true,
        hideappendix_variant_tableCopy_cnv:true,
      }
    },
    methods: {
	    showJSON_cnv(username, jsonfile, jobid=null, uuids = null){
	    	// info from json
    		this.driver_table_cnv= jsonfile.driver_table;
    		var drivertypes_cnv = {}
    		for(let item  of this.driver_table_cnv){
    			item.tumor_list = item.tumor_list.replaceAll("|", " | ")
    			item.ref_map = item.ref_map.replaceAll(",", ", ")
    			drivertypes_cnv[item.gene] = item.driver_role
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
	    	if(jobid == null){
	    		return
	    	}
	    	//get uuids
	    	if(!uuids){
		        var drivergeneslist_cnv = this.driver_table_cnv.map(a => a.gene); 
	    		this.getGraphFromGenes(drivergeneslist_cnv, jobid, username, "drivergene", "Drivergene network", "drivergenes", "Somatic Mutations in Known Driver Genes", "_cnv", drivertypes_cnv)
	    		var pharmacogeneslist_cnv = this.direct_pharm_table_cnv.map(a => a.gene); 
	    		this.getGraphFromGenes(pharmacogeneslist_cnv, jobid, username, "pharmacogenetic_effect", "Pharmacogeneti network", "pharmaco", "Somatic Mutations with Known Pharmacogenetic Effect", "_cnv")
	    		var pharmgeneslist_cnv = this.pharm_table_cnv.map(a => a.gene); 
	    		this.getGraphFromGenes(pharmgeneslist_cnv, jobid, username, "targeted_gene", "Mechanistic drug network", "civic", "Pharmacogenomics Summary of Drugs Targeting Affected Genes", "_cnv")
	    		var mechanisticgeneslist_cnv = this.mechanistic_drug_table_cnv.map(a => a.gene); 
	    		this.getGraphFromGenes(mechanisticgeneslist_cnv, jobid, username, "targeted_gene", "Cancer drug network", "cancer", "Summary of Cancer Drugs Targeting Affected Genes", "_cnv")
		    }
		    // uuids known
		    else if(uuids){
		    	this.visibleDrivergenes_cnv = false;
		    	this.getGraphFromUUID(jobid, {"drivergenes":uuids[0]}, username)
		    	this.visiblePharmaco_cnv = false;
		    	this.getGraphFromUUID(jobid, {"pharmaco":uuids[1]}, username)
		    	this.visibleCivic_cnv = false;
		    	this.getGraphFromUUID(jobid, {"civic":uuids[2]}, username)
		    	this.visibleCancer_cnv = false;
		    	this.getGraphFromUUID(jobid, {"cancer":uuids[3]}, username)
		    }
		    this.showTable=true;

	    },
	    getGraphFromGenes(genes, jobid, username, annotationName, networkName, subpage, tableheader, cnv="",drivertypes = null){
	    	var graphml = this.getGraphforGene(jobid, genes, username, annotationName, networkName, subpage, cnv, drivertypes)
	    		.then(response => {return response})
			graphml.then(response => {
				if(response == undefined){
					alert("No network found for "+tableheader)

					if(subpage == "drivergenes"){
						this.visibleDrivergenes_cnv = false;
					}
					else if(subpage == "pharmaco"){
						this.visiblePharmaco_cnv = false;
					}
					else if(subpage == "civic"){
						this.visibleCivic_cnv = false;
					}
					else if(subpage == "cancer"){
						this.visibleCancer_cnv = false;
						this.showNetwork = false;
					}
					return
				}
				axios.post('/visualization/'+subpage, response)
				  .then(response => {
				  	this.showNetwork = false;
					if(!this.showNetwork){
					  }
					setTimeout(function(){var iframe = document.getElementById(subpage+'Vis');
					iframe.src = iframe.src}, 5000);
				  	
				  })
				  .catch(function (error) {
				    console.log(error);
				  });

			})
		},
		getGraphforGene(jobid, names, username, annotationName, networkName, subpage, cnv="", drivertypes = null){
		  	return axios.post('/network/overview', 
		  		{	genes: names, 
		  			annotationName: annotationName, 
		  			networkName: networkName}, {
					    headers:{
					      	'user':username+'/'+jobid.toString()
					    },
					    method: 'POST'
			  		})
		  		.then(response => { 
		  			localStorage.setItem(subpage,response.data.UUID);
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
								table = this.driver_table_cnv
								}
								else if(subpage == "pharmaco"){
									table = this.direct_pharm_table_cnv
								}
								else if(subpage == "civic"){
									table = this.pharm_table_cnv
								}
								else if(subpage == "cancer"){
									table = this.mechanistic_drug_table_cnv
								}
						  		this.addGeneLinks(res.data, table)
						  		return res.data
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
							table = this.driver_table_cnv
							}
							else if(subpage == "pharmaco"){
								table = this.direct_pharm_table_cnv
							}
							else if(subpage == "civic"){
								table = this.pharm_table_cnv
							}
							else if(subpage == "cancer"){
								table = this.mechanistic_drug_table_cnv
							}
					  		this.addGeneLinks(res.data, table)
					  		return res.data
						})
						.catch(error => {
						    console.log(error.response)
						});
					}
				})
				.catch(error => {
				    console.log(error.response)
				});
		},
	    // getGenes(selected){
	    //     for(let i of selected){
	    //       if(selected.length==1){
	    //         this.linkGraphofGene(i)
	    //       }
	    //     }
	    // },
	    // linkGraphofGene(gene){
	    // 	window.open("http://localhost:3000/BioGraphVisart/vis?gene="+gene)
	    // },
	    // handleFileUpload(){
	    //     this.file = this.$refs.file.files[0];
	    // },
	    getGraphFromUUID(jobid, uuidobj, username){
	    	var jobid = jobid
    		var subpage = Object.keys(uuidobj)[0]
    		if(subpage.includes("_cnv")){
    			subpage=subpage.replace("_cnv","")
    		}
    		var uuid = uuidobj[subpage]
			var graphml =  axios.get('/network/networks/'+uuid, {
			    headers:{
			      	'user':username+'/'+jobid
			    },
			    method: 'GET'
		  	}).then(
				res => {
					var table;
					if(subpage == "drivergenes"){
						this.visibleDrivergenes_cnv = true;
						table = this.driver_table
					}
					else if(subpage == "pharmaco"){
						this.visiblePharmaco_cnv = true;
						table = this.direct_pharm_table_cnv
					}
					else if(subpage == "civic"){
						this.visibleCivic_cnv = true;
						table = this.pharm_table_cnv
					}
					else if(subpage == "cancer"){
						this.visibleCancer_cnv = true;
						table = this.mechanistic_drug_table_cnv
					}
					this.addGeneLinks(res.data, table)
					axios.post('/visualization/'+subpage, res.data)
					  .then(function () {
					  	setTimeout(function(){var iframe = document.getElementById(subpage+'Vis');
						iframe.src = iframe.src}, 5000);
					  })
					  .catch(function (error) {
					    console.log(error);
					  });	
					  
				})
		  	.catch(function (error) {
			    console.log(error);
		 	});		    	
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
										item.kegg = childnode.textContent
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
	    	if(localStorage.getItem("cnv") && !localStorage.getItem("cnvjsonavailable")){
		    	var cnvjsonReportjson = axios.get('/clinvap/results/'+username+'_'+jobid+'.cnv.json')
		    		.then(res=>{return res.data})
		    	cnvjsonReportjson.then(res => {
			    	if(res){
		    			this.cnvjsonReport = res;
		    			this.storeJsonInDB(res, jobid, username, 'cnv')
		    			this.showJSON_cnv(username, res, jobid)
		    		}
		    	})
		    }
		    else if(localStorage.getItem("cnv") && localStorage.getItem("cnvjsonavailable")){
		    	this.getJsonFromJobID(jobid, username)
		    }
	    },
	    download_json(){
		    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.cnvjsonReport));
		    var downloadAnchorNode = document.createElement('a');
		    downloadAnchorNode.setAttribute("href",     dataStr);
		    downloadAnchorNode.setAttribute("download", this.jobid + ".cnv.json");
		    document.body.appendChild(downloadAnchorNode); // required for firefox
		    downloadAnchorNode.click();
		    downloadAnchorNode.remove();
	    },
	    getJsonFromJobID(jobid, username){
	    	pecaxdb.getJsonFromJobID(new arangodb.Database('/db/'), arangodb.aqlQuery, username, jobid).then(json => {
	    		if(json._result[0].json_file_cnv){
	    			this.showJSON_cnv(username, json._result[0].json_file_cnv, json._result[0]._key, [json._result[0].drivergenes_cnv, json._result[0].pharmaco_cnv, json._result[0].civic_cnv, json._result[0].cancer_cnv])
	    		}
	    	});
	    },
	    storeJsonInDB(jsonReport, jobid, username, cnv=""){
	    	pecaxdb.addJson(new arangodb.Database('/db/'), username, jobid, jsonReport, cnv);
	    },
	    exportToPDF_driver_table_cnv() {
	        var self = this;
	        setTimeout(function(){
	          window.scrollTo(0,0);
	          html2pdf(self.$refs.content_driver_table_cnv, {
	            margin: 0.5,
	            filename: 'driver_table.pdf',
	            image: { type: 'jpeg', quality: 0.98 },
	            html2canvas: {},
	            pagebreak: { mode: ['legacy'] },
	            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape'}
	           });
	        }, 1);
	    },
	    exportToPDF_direct_pharm_table_cnv() {
	        this.visibleDrivers_cnv = false;
	        var self = this;
	        setTimeout(function(){
	          window.scrollTo(0,0);
	          html2pdf(self.$refs.content_direct_pharm_table_cnv, {
	            margin: 0.5,
	            filename: 'direct_pharm_table.pdf',
	            image: { type: 'jpeg', quality: 0.98 },
	            html2canvas: { },
	            pagebreak: { mode: ['legacy'] },
	            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape'}
	           })
	        }, 1);
	    },
	    exportToPDF_pharm_table_cnv() {
	        this.visibleDrivers_cnv = false;
	        this.visiblePharma_cnv = false;
	        var self = this;
	        setTimeout(function(){
	          window.scrollTo(0,0);
	          html2pdf(self.$refs.content_pharm_table_cnv, {
	            margin: 0.45,
	            filename: 'pharm_table.pdf',
	            image: { type: 'jpeg', quality: 0.98 },
	            html2canvas: { },
	            pagebreak: { mode:['legacy']},
	            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape'}
	           })
	        }, 1);
	    },
	    exportToPDF_mechanistic_drug_table_cnv() {
	        this.visibleDrivers_cnv = false;
	        this.visiblePharma_cnv = false;
	        this.visibleAffectCivic_cnv = false;
	        var self = this;
	        setTimeout(function(){
	          window.scrollTo(0,0);
	          html2pdf(self.$refs.content_mechanistic_drug_table_cnv, {
	            margin: 0.2,
	            filename: 'mechanistic_drug_table.pdf',
	            image: { type: 'jpeg', quality: 0.98 },
	            html2canvas: { },
	            pagebreak: { mode: ['legacy'] },
	            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape'}
	           })
	        }, 1);
	    },
	    exportToPDF_ref_cnv() {
	        this.visibleDrivers_cnv = false;
	        this.visiblePharma_cnv = false;
	        this.visibleAffectCivic_cnv = false;
	        this.visibleAffectCancer_cnv = false;
	        this.visibleEffect_cnv = false;
	        var self = this;
	        setTimeout(function(){
	          self.$refs['refTable'].dense = true;
	          self.$refs['refTable'].hideDefaultFooter=true;
	          window.scrollTo(0,0);
	          html2pdf(self.$refs.content_ref_cnv, {
	            margin: 0.1,
	            filename: 'references.pdf',
	            image: { type: 'jpeg', quality: 0.98 },
	            html2canvas: { },
	            pagebreak: { mode: ['avoid-all'] },
	            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape'}
	           })
	        }, 1);
	    },
	    exportToPDF_appendix_variant_table_cnv() {
	        this.visibleDrivers_cnv = false;
	        this.visiblePharma_cnv = false;
	        this.visibleAffectCivic_cnv = false;
	        this.visibleAffectCancer_cnv = false;
	        this.visibleRef_cnv = false;
	        this.visibleEffect_cnv = false;
	        var self = this;
	        setTimeout(function(){
	          window.scrollTo(0,0);
	          html2pdf(self.$refs.content_appendix_variant_table_cnv, {
	            margin: 0.5,
	            filename: 'appendix_variant_table.pdf',
	            image: { type: 'jpeg', quality: 0.98 },
	            html2canvas: { },
	            pagebreak: { mode: ['legacy'] },
	            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape'}
	           })
	        }, 1);
	    },
	    download_Networks(){
	    	var networknames = ["drivergenes", "pharmaco", "civic", "cancer"]
	    	for(let name of networknames){
		    	var graphml = axios.get('/network/networks/'+localStorage.getItem(name), {
				    headers:{
				      	'user':this.username+'/'+this.jobid
				    },
				    method: 'GET'
			  	}).then(
					response => {
				if(response.data == undefined){
					alert("No network found. ")
					this.showNetwork = false;
					return
				}
				else{
					var element = document.createElement('a');
					element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(response.data));
					element.setAttribute('download', name+".graphml");

					element.style.display = 'none';
					document.body.appendChild(element);

					element.click();

					document.body.removeChild(element);}})
			}
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
	    movePages_cnv: function(amount) {
	        var newStartRow = this.startRow_cnv + (amount * this.rowsPerPage_cnv);
	        if (newStartRow >= 0 && newStartRow < this.sortedMskdg_cnv.length) {
	          this.startRow_cnv = newStartRow;
	        }
	        if( (amount == 1 || this.currentPage_cnv > 1) && (this.currentPage_cnv+amount)*this.rowsPerPage_cnv <= Math.ceil(this.sortedMskdg_cnv.length / 10) * 10){
	          this.currentPage_cnv += amount
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
	   this.displayJSON(localStorage.getItem("jobid"), localStorage.getItem("username"));
	},
	computed: {
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
  }
</script>
