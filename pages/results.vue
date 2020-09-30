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
  <v-layout justify-center align-center width=100%>
    <v-flex xs12 sm8 md12>
	<div v-show="showStatus">
		<!-- <h1>Clinical Variant Annotation Pipeline</h1> -->
		<p style="border:3px; border-style:solid; border-color:#BDBDBD; padding: 1em;" class="text-center" >Job ID: {{this.jobid}} <br> Status of analyzing {{this.filename}} with ClinVAP: {{this.status}}
		<p v-show="showNetwork" style="border:3px; border-style:solid; border-color:#BDBDBD; padding: 1em;" class="text-center" >Calculating driver genes network</p> 
		</p>
		<div class="loader" ref="loader1"></div>
	</div>
    <div  v-show="showTable" width=100% ref="all">
      	<div>
	      	<table data-html2canvas-ignore="true" class="float-left">
	        	<tr>
		          	<td>Filter for </td>
		          	<td style="padding:0 15px 0 15px;">
		            	<v-text-field v-model="genesall" type="string" label="Gene"></v-text-field>
		         	</td>
		         	<td style="padding:0 15px 0 15px;">
		            	<v-text-field v-model="mutationall" type="string" label="Mutation"></v-text-field>
		          	</td>
		          	<td style="padding:0 15px 0 15px;">
		            	<v-text-field v-model="therapyall" type="string" label="Therapy"></v-text-field>
		          	</td>
		          	<td style="padding:0 15px 0 15px;">
		            	<v-text-field v-model="diseaseall" type="string" label="Disease"></v-text-field>
		          	</td>
		          	<td style="padding:0 15px 0 15px;" v-show="jsongenerated"> 
		            	<button class="downloadbutn float-right " @click="download_json()"><b-icon class="float-left" icon="download" style="margin-right: 3px"></b-icon>JSON</button>
		          	</td>
		          	<td style="padding:0 15px 0 15px;">
		          		<button class="downloadbutn float-right " @click="exportToPDF_all()"><b-icon class="float-left" icon="download" style="margin-right: 3px"></b-icon> PDF</button><br>
		          	</td>
		          	<td style="padding:0 15px 0 15px;"> 
		            	<button class="downloadbutn float-right " @click="download_DriverNetwork()"><b-icon class="float-left" icon="download" style="margin-right: 3px"></b-icon> Driver Network</button>
		          	</td>
		          	<td style="padding:0 15px 0 15px;"> 
		            	<button class="downloadbutn float-right " @click="show_DriverNetwork()" ref="shownetworks" v-show="hasdrivergenes">Show Networks</button>
		          	</td>
		        </tr>
	      	</table>
	      	<!-- <button data-html2canvas-ignore="true" class="butn float-right "@click=function(){getGenes(checkedGenes)}>Network</button> -->
      	</div>
    	<div ref = "content_driver_table" id="driver_table_content">
	        <b-button
	          :class="visibleDrivers ? null : 'collapsed'"
	          :aria-expanded="visibleDrivers ? 'true' : 'false'"
	          aria-controls="collapse-4"
	          @click="visibleDrivers = !visibleDrivers"
	          v-bind:style="{ background: 'green', color:'white' }" 
	          @mouseover="activeDrivers = true" 
	          @mouseleave="activeDrivers = false"
	          block variant="primary"
	         >
          		<Strong class="text-center" style="color: white">Somatic Mutations in Known Driver Genes </Strong><b-icon data-html2canvas-ignore="true" icon="info-circle" style="margin-left: 10px"></b-icon> <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrows-expand" v-if="visibleDrivers"></b-icon> <b-icon class="float-right" icon="arrows-collapse" v-else></b-icon>
        	</b-button>
        	<p  v-show="activeDrivers">List of cancer driver genes along with the mutations observed in the patient. Consequence column provides the predicted effects of the variants on the protein sequence. Tumor type column gives the list of cohorts in which the gene is identified as driver. VAF (variant allele frequency) column shows the proportion of the variant allele to the coverage of that loci. Reference column represents the driver gene sources that catalogued the corresponding gene as driver. Driver gene information is obtained from Vogelstein et. al, Uniprot, TSGene, IntoGen and COSMIC. </p>
       		<b-collapse id="collapse-4" v-model="visibleDrivers" class="mt-2">
		        <div data-html2canvas-ignore="true">
		            <input type="checkbox" id="checkbox1" v-model="hidedriver_tableMutation">
		              <label for="checkbox1">Mutation</label>
		            <input type="checkbox" id="checkbox1" v-model="hidedriver_tableConsequence">
		              <label for="checkbox2">Consequence</label>
		            <input type="checkbox" id="checkbox2" v-model="hidedriver_tableDriverType">
		              <label for="checkbox3">Driver Type</label>
		            <input type="checkbox" id="checkbox3" v-model="hidedriver_tableTumorType">
		              <label for="checkbox4">Tumor Type</label>
		            <input type="checkbox" id="checkbox3" v-model="hidedriver_tableVAF">
		              <label for="checkbox5">VAF</label>
		            <input type="checkbox" id="checkbox4" v-model="hidedriver_tableReferences">
		              <label for="checkbox6">References</label>
		              <button class="downloadbutn float-right " @click="exportToPDF_driver_table()"><b-icon class="float-left" icon="download" style="margin-right: 3px"></b-icon> PDF</button>
		        </div>
	          <b-card>
	            <table class="table table-hover">
	              <thead>
	                <tr data-html2canvas-ignore="true">
	                  <td></td>
	                  <td>
	                    <v-text-field v-model="genes1" type="string" label="Gene"></v-text-field>
	                  </td>
	                  <td>
	                    <v-text-field v-show="hidedriver_tableMutation" v-model="mutations1" type="string" label="Mutation"></v-text-field>
	                  </td>
	                  <td>
	                    <v-text-field v-show="hidedriver_tableConsequence" v-model="consequence1" type="string" label="Consequence"></v-text-field>
	                  </td>
	                  <td>
	                    <v-text-field v-show="hidedriver_tableDriverType" v-model="driverType1" type="string" label="DriverType"></v-text-field>
	                  </td>
	                  <td>
	                    <v-text-field v-show="hidedriver_tableTumorType" v-model="tumorType1" type="string" label="TumorType"></v-text-field>
	                  </td>
	                 <td>
	                    <v-text-field v-show="hidedriver_tableVAF" v-model="vaf1" type="double" label="VAF"></v-text-field>
	                  </td>
	                  <td>
	                    <v-text-field v-show="hidedriver_tableReferences" v-model="reference1" type="string" label="References"></v-text-field>
	                  </td>
	                </tr>
	                <tr>
	                  <th data-html2canvas-ignore="true">
	                    <label class="form-checkbox">
	                      <input type="checkbox" v-model="selectAll" @click="select(driver_table)">
	                      <i class="form-icon"></i>
	                    </label>
	                  </th>
	                  <th @click="sortMskdg('Gene')">Gene <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirGene1 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                  <th v-show="hidedriver_tableMutation" @click="sortMskdg('Mutation')">Mutation <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirMut1 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                  <th v-show="hidedriver_tableConsequence" @click="sortMskdg('Consequence')">Consequence <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirCons1 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                  <th v-show="hidedriver_tableDriverType" @click="sortMskdg('Driver Type')">Driver Type <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirDriverType1 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                  <th v-show="hidedriver_tableTumorType" @click="sortMskdg('Tumor Type')">Tumor Type <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirTumorType1 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                  <th v-show="hidedriver_tableVAF" @click="sortMskdg('VAF')">VAF <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirVAF1 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                  <th v-show="hidedriver_tableReferences" @click="sortMskdg('References')">References <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirRef1 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                </tr>
	              </thead>
	              <tbody>
	                <tr v-for="(item, index) in sortedMskdg" :key="item.gene" v-if="index < startRow + rowsPerPage && index >= startRow">
	                  <td class="text-xs-center" data-html2canvas-ignore="true">      
	                    <label class="form-checkbox">
	                        <input type="checkbox" :value="item.gene" v-model="checkedGenes">
	                        <i class="form-icon"></i>
	                    </label>
	                  </td>
	                  <td @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.ene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}">
	                    {{ item.gene}}
	                   	<div class="dropdown" data-html2canvas-ignore="true"><b-icon class="float-right dropbtn" icon="globe2"></b-icon>
	                    <div class="dropdown-content">
				            <a class="page-link" href="/documentation">Documentation</a>
				            <a class="page-link" href="/contact">Contact</a>
				          </div>
				        </div> 
	                  </td>
	                  <td v-show="hidedriver_tableMutation" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
	                    {{ item.one_letter_repr}}
	                  </td>
	                  <td v-show="hidedriver_tableConsequence" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
	                    {{ item.Consequence }}
	                  </td>	                  
	                  <td v-show="hidedriver_tableDriverType" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
	                    {{ item.driver_role}}
	                  </td>
	                  <td v-show="hidedriver_tableTumorType" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
	                    {{ item.tumor_list}}
	                  </td>
	                  <td v-show="hidedriver_tableVAF" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
	                    {{ item.vaf}}
	                  </td>	                  
	                  <td v-show="hidedriver_tableReferences" @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
	                    {{ item.ref_map}}
	                  </td>
	                </tr>
	              </tbody>
	            </table>
	                   
	            <div id="page-navigation" class="float-right" data-html2canvas-ignore="true">
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
	          </b-card>
	        </b-collapse>
	    </div>
	    <div class="embed-responsive embed-responsive-16by9 z-depth-1-half">
			<iframe class="embed-responsive-item" src="http://localhost:3000/BioGraphVisart" allowfullscreen></iframe>
		</div>  
	      <br>

	    <div ref = "content_direct_pharm_table" id="direct_pharm_table_content">
	        <b-button
	          :class="visiblePharma ? null : 'collapsed'"
	          :aria-expanded="visiblePharma ? 'true' : 'false'"
	          aria-controls="collapse-4"
	          @click="visiblePharma = !visiblePharma"
	          v-bind:style="{ background: 'orange', color:'white' }"
	          @mouseover="activePharma = true" 
	          @mouseleave="activePharma = false"
	          block variant="primary"
	         >
	          <Strong style="color: white">Somatic Mutations with Known Pharmacogenetic Effect</Strong><b-icon data-html2canvas-ignore="true" icon="info-circle" style="margin-left: 10px"></b-icon> <b-icon data-html2canvas-ignore="true" class="float-right"icon="arrows-expand" v-if="visiblePharma"></b-icon> <b-icon class="float-right" icon="arrows-collapse" v-else></b-icon>
	        </b-button>
	        <p  v-show="activePharma">List of drugs with the evidence of targeting the observed variant of the mutated gene, and the documented drug response for the given mutational profile. Evidence level letter represents: A = validated association, B = clinical evidence, C = case study, D = preclinical evidence, E = inferential association. Evidence level number represents the matching type between the observed variant and the database result: 1 = same variant, 2 = different variant, same consequence, 3 = different variant, different consequence, same gene. The information is obtained from CIViC, CGI and DrugBank. </p>
	        <b-collapse id="collapse-4" v-model="visiblePharma" class="mt-2">
	          <div data-html2canvas-ignore="true">
	            <input type="checkbox" id="checkbox5" v-model="hidedirect_pharm_tableMutation">
	              <label for="checkbox7">Mutation</label>
	            <input type="checkbox" id="checkbox6" v-model="hidedirect_pharm_tableTherapy">
	              <label for="checkbox8">Therapy</label>
	            <input type="checkbox" id="checkbox7" v-model="hidedirect_pharm_tableEffect">
	              <label for="checkbox9">Effect</label>
	            <input type="checkbox" id="checkbox7" v-model="hidedirect_pharm_tableDisease">
	              <label for="checkbox10">Disease</label>
	            <input type="checkbox" id="checkbox7" v-model="hidedirect_pharm_tableEvidence">
	              <label for="checkbox11">Evidence</label>
	            <input type="checkbox" id="checkbox8" v-model="hidedirect_pharm_tableReferences">
	              <label for="checkbox12">References</label>
	            <button class="downloadbutn float-right " @click="exportToPDF_direct_pharm_table()"><b-icon class="float-left" icon="download" style="margin-right: 3px" data-html2canvas-ignore="true"></b-icon> PDF</button>
	          </div>
	          <b-card> 
	            <table class="table table-hover">
	              <thead>
	                <tr data-html2canvas-ignore="true">
	                  <td></td>
	                  <td>
	                    <v-text-field v-model="genes2" type="string" label="Gene"></v-text-field>
	                  </td>
	                  <td>
	                    <v-text-field v-show="hidedirect_pharm_tableMutation" v-model="mutation2" type="string" label="Mutation"></v-text-field>
	                  </td>
	                  <td>
	                    <v-text-field v-show="hidedirect_pharm_tableTherapy" v-model="therapy2" type="string" label="Therapy"></v-text-field>
	                  </td>
	                  <td>
	                    <v-text-field v-show="hidedirect_pharm_tableEffect" v-model="effect2" type="string" label="Effect"></v-text-field>
	                  </td>
	                  <td>
	                    <v-text-field v-show="hidedirect_pharm_tableDisease" v-model="disease2" type="string" label="Disease"></v-text-field>
	                  </td>	
	                  <td>
	                    <v-text-field v-show="hidedirect_pharm_tableEvidence" v-model="evidence2" type="string" label="Evidence"></v-text-field>
	                  </td>	           
	                  <td>
	                    <v-text-field v-show="hidedirect_pharm_tableReferences" v-model="reference2" type="string" label="Reference"></v-text-field>
	                  </td>
	                </tr>
	                <tr>
	                  <th data-html2canvas-ignore="true">
	                    <label class="form-checkbox">
	                      <input type="checkbox" v-model="selectAll" @click="select(direct_pharm_table )">
	                      <i class="form-icon"></i>
	                    </label>
	                  </th>
	                  <th @click="sortPtpda('Gene')">Gene <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirGene2 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                  <th v-show="hidedirect_pharm_tableMutation" @click="sortPtpda('Mutation')">Mutation <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirMut2 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                  <th v-show="hidedirect_pharm_tableTherapy" @click="sortPtpda('Therapy')">Therapy <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirTherapy2 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                  <th v-show="hidedirect_pharm_tableEffect" @click="sortPtpda('Effect')">Effect <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirEffect2 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                  <th v-show="hidedirect_pharm_tableDisease" @click="sortPtpda('Disease')">Disease <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirDisease2 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                  <th v-show="hidedirect_pharm_tableEvidence" @click="sortPtpda('Evidence')">Evidence <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirEvidence2 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>	
	                  <th v-show="hidedirect_pharm_tableReferences" @click="sortPtpda('References')">Reference <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirRef2 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                </tr>
	              </thead>
	              <tbody>
	                <tr v-for="(item, index) in sortedPtpda" :key="item.gene" v-if="index < startRowPtpda + rowsPerPagePtpda && index >= startRowPtpda ">
	                  <td class="text-xs-center" data-html2canvas-ignore="true">      
	                    <label class="form-checkbox">
	                        <input type="checkbox" :value="item.gene" v-model="checkedGenes">
	                        <i class="form-icon"></i>
	                    </label>
	                  </td>
	                  <td @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}">
	                    {{ item.gene}}
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
	            <div id="page-navigation" class="float-right" data-html2canvas-ignore="true">
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
	            <!-- <template v-slot:footer>
	              <div>
	                CIViC evidence levels are used. A = Validated association, B = Clinical evidence, C = Case study, D = Preclinical evidence, E = Inferential association
	              </div>
	            </template> -->
	         </b-card>
	        </b-collapse>
	    </div>
	      <br>
	      <br>
	    <div ref="content_smptag">
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
	        <br>
	        <b-collapse id="collapse-4" v-model="visibleAffect" class="mt-2">
	          <p></p>
	        <div ref = "content_pharm_table" id="pharm_table_content">
	            <b-button
	              :class="visibleAffectCivic ? null : 'collapsed'"
	              :aria-expanded="visibleAffectCivic ? 'true' : 'false'"
	              aria-controls="collapse-4"
	              @click="visibleAffectCivic = !visibleAffectCivic"
	              @mouseover="activeCivic = true" @mouseleave="activeCivic = false"
	              v-bind:style="{ color:'white' }"
	              block variant="primary"
	              >
	              <Strong style="color: white">Pharmacogenomics Summary of Drugs Targeting Affected Genes</Strong><b-icon data-html2canvas-ignore="true" icon="info-circle" style="margin-left: 10px"></b-icon> <b-icon data-html2canvas-ignore="true" class="float-right"icon="arrows-expand" v-if="visibleAffectCivic"></b-icon> <b-icon class="float-right" icon="arrows-collapse" v-else></b-icon>
	            </b-button>
	            <p  v-show="activeCivic">Therapies that have evidence of targeting the affected gene. Evidence level letter represents: A = validated association, B = clinical evidence, C = case study, D = preclinical evidence, E = inferential association. Evidence level number represents the matching type between the observed variant and the database result: 1 = same variant, 2 = different variant, same consequence, 3 = different variant, different consequence, same gene. The information is obtained from CIViC, CGI and DrugBank. </p>
	            <b-collapse id="collapse-4" v-model="visibleAffectCivic" class="mt-2">
	              <div data-html2canvas-ignore="true">
	                <input type="checkbox" id="checkbox5" v-model="hidepharm_tableMutation">
	                  <label for="checkbox13">Mutation</label>
	                <input type="checkbox" id="checkbox6" v-model="hidepharm_tableTherapy">
	                  <label for="checkbox14">Therapy</label>
	                <input type="checkbox" id="checkbox7" v-model="hidepharm_tableEffect">
	                  <label for="checkbo157">Effect</label>
	                <input type="checkbox" id="checkbox7" v-model="hidepharm_tableDisease">
	                  <label for="checkbox16">Disease</label>
	                <input type="checkbox" id="checkbox7" v-model="hidepharm_tableEvidence">
	                  <label for="checkbox17">Evidence</label>
	                <input type="checkbox" id="checkbox8" v-model="hidepharm_tableReferences">
	                  <label for="checkbox18">References</label>
	                <button class="downloadbutn float-right " @click="exportToPDF_pharm_table()"><b-icon class="float-left" icon="download" style="margin-right: 3px" data-html2canvas-ignore="true"></b-icon> PDF</button>
	              </div>
	              <b-card> 
	                <table class="table table-hover">
	                  <thead>
	                    <tr data-html2canvas-ignore="true">
	                      <td></td>
	                      <td>
	                        <v-text-field v-model="genes3" type="string" label="Gene"></v-text-field>
	                      </td>
	                      <td>
	                        <v-text-field v-show="hidepharm_tableMutation" v-model="mutations3" type="string" label="Mutation"></v-text-field>
	                      </td>
	                      <td>
	                        <v-text-field v-show="hidepharm_tableTherapy" v-model="therapy3" type="string" label="Therapy"></v-text-field>
	                      </td>
	                      <td>
	                        <v-text-field v-show="hidepharm_tableEffect" v-model="effect3" type="string" label="Effect"></v-text-field>
	                      </td>
	                      <td>
	                        <v-text-field v-show="hidepharm_tableDisease" v-model="disease3" type="string" label="Disease"></v-text-field>
	                      </td>
	                      <td>
	                        <v-text-field v-show="hidepharm_tableEvidence" v-model="evidence3" type="string" label="Evidence"></v-text-field>
	                      </td>
	                      <td>
	                        <v-text-field v-show="hidepharm_tableReferences" v-model="reference3" type="string" label="Reference"></v-text-field>
	                      </td>
	                    </tr>
	                    <tr>
	                      <th data-html2canvas-ignore="true">
	                        <label class="form-checkbox">
	                          <input type="checkbox" v-model="selectAll" @click="select(pharm_table )">
	                          <i class="form-icon"></i>
	                        </label>
	                      </th>
	                      <th @click="sortPtpia('Gene')">Gene <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirGene3 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hidepharm_tableMutation" @click="sortPtpia('Mutation')">Mutation <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirMut3 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hidepharm_tableTherapy" @click="sortPtpia('Therapy')">Therapy<b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirTherapy3 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hidepharm_tableEffect" @click="sortPtpia('Effect')">Effect <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirEffect3 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hidepharm_tableDisease" @click="sortPtpia('Disease')">Disease <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirDisease3 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hidepharm_tableEvidence" @click="sortPtpia('Evidence')">Evidence <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirEvidence3 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hidepharm_tableReferences" @click="sortPtpia('References')">Reference <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirRef3 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                    </tr>
	                  </thead>
	                  <tbody>
	                    <tr v-for="(item, index) in sortedPtpia" :key="item.gene" v-if="index < startRowPtpia + rowsPerPagePtpia && index >= startRowPtpia ">
	                      <td class="text-xs-center" data-html2canvas-ignore="true">      
	                        <label class="form-checkbox">
	                            <input type="checkbox" :value="item.gene" v-model="checkedGenes">
	                            <i class="form-icon"></i>
	                        </label>
	                      </td>
	                      <td @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}">
	                        {{ item.gene}}
	                      </td>
	                      <td v-show="hidepharm_tableMutation" @click="selectItem(item)" ::class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}" class=text-xs-right>
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
	                <div id="page-navigation" class="float-right" data-html2canvas-ignore="true">
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
	            </b-card>
	          </b-collapse>
	        </div>

	        <p></p>
	       	<div ref = "content_mechanistic_drug_table" id="mechanistic_drug_table_content">
	          <b-button
	            :class="visibleAffectCancer ? null : 'collapsed'"
	            :aria-expanded="visibleAffectCancer ? 'true' : 'false'"
	            aria-controls="collapse-4"
	            @click="visibleAffectCancer = !visibleAffectCancer"
	            class="text-center" 
	            @mouseover="activeSum = true" @mouseleave="activeSum = false"
	            block variant="primary"
	            v-bind:style="{ color:'white' }"
	           >
	            <Strong style="color: white">Summary of Cancer Drugs Targeting Affected Genes</Strong><b-icon data-html2canvas-ignore="true" icon="info-circle" style="margin-left: 10px"></b-icon> <b-icon class="float-right"icon="arrows-expand" v-if="visibleAffectCancer"></b-icon> <b-icon class="float-right" icon="arrows-collapse" v-else></b-icon>
	          </b-button>
	          <p  v-show="activeSum">List of cancer drugs targeting the mutated gene. Information is obtained from DrugBank, Therapeutic Target Database, IUPHAR, and Santos et al.</p>
	          <b-collapse id="collapse-4" v-model="visibleAffectCancer" class="mt-2">
	            <div data-html2canvas-ignore="true">
	              <input type="checkbox" id="checkbox9" v-model="hidemechanistic_drug_tableStatus">
	                  <label for="checkbox19">Status</label>
	                <input type="checkbox" id="checkbox10" v-model="hidemechanistic_drug_tableTherapy">
	                  <label for="checkbox20">Therapy</label>
	                <input type="checkbox" id="checkbox11" v-model="hidemechanistic_drug_tableReferences">
	                  <label for="checkbox21">References</label>
	                <button class="downloadbutn float-right " @click="exportToPDF_mechanistic_drug_table()"><b-icon class="float-left" icon="download" style="margin-right: 3px" data-html2canvas-ignore="true"></b-icon> PDF</button>
	              </div>
	            <b-card> 
	                <table class="table table-hover">
	                  <thead>
	                    <tr data-html2canvas-ignore="true">
	                      <td></td>
	                      <td>
	                        <v-text-field v-model="genes4" type="string" label="Gene"></v-text-field>
	                      </td>
	                      <td>
	                        <v-text-field v-show="hidemechanistic_drug_tableStatus" v-model="status4" type="string" label="Status"></v-text-field>
	                      </td>
	                      <td>
	                        <v-text-field v-show="hidemechanistic_drug_tableTherapy" v-model="therapy4" type="string" label="Therapy"></v-text-field>
	                      </td>
	                      <td>
	                        <v-text-field v-show="hidemechanistic_drug_tableReferences" v-model="reference4" type="string" label="Reference"></v-text-field>
	                      </td>
	                    </tr>
	                    <tr>
	                      <th data-html2canvas-ignore="true">
	                        <label class="form-checkbox">
	                          <input type="checkbox" v-model="selectAll" @click="select(mechanistic_drug_table)">
	                          <i class="form-icon"></i>
	                        </label>
	                      </th>
	                      <th @click="sortMskpe('Gene')">Gene <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirGene4 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hidemechanistic_drug_tableStatus" @click="sortMskpe('Status')">Status<b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirStatus4 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hidemechanistic_drug_tableTherapy" @click="sortMskpe('Therapy')">Therapy<b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirTherapy4 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hidemechanistic_drug_tableReferences" @click="sortMskpe('References')">Reference <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirRef4 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                    </tr>
	                  </thead>
	                  <tbody>
	                    <tr v-for="(item, index) in sortedMskpe" :key="item.gene" v-if="index < startRowMskpe + rowsPerPageMskpe && index >= startRowMskpe ">
	                      <td class="text-xs-center" data-html2canvas-ignore="true">      
	                        <label class="form-checkbox">
	                            <input type="checkbox" :value="item.gene" v-model="checkedGenes">
	                            <i class="form-icon"></i>
	                        </label>
	                      </td>
	                      <td @click="selectItem(item)" :class="{'first': selected.includes(item.gene) && selected.indexOf(item.gene) == 0, 'second': selected.includes(item.gene) && selected.indexOf(item.gene) == 1,'third': selected.includes(item.gene) && selected.indexOf(item.gene) == 2, 'fourth': selected.includes(item.gene) && selected.indexOf(item.gene) == 3, 'fifth': selected.includes(item.gene) && selected.indexOf(item.gene) == 4}">
	                        {{ item.gene }}
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
	                <div id="page-navigation" class="float-right" data-html2canvas-ignore="true">
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
	          </b-card>
	          </b-collapse>
	        </div>
	        </b-collapse>
	    </div>
	    <br>
	    <br>
	    <div ref = "content_adverse_table" id="adverse_table_content">
	        <b-button
	          :class="visibleEffect ? null : 'collapsed'"
	          :aria-expanded="visibleEffect ? 'true' : 'false'"
	          aria-controls="collapse-4"
	          @click="visibleEffect = !visibleEffect"
	          v-bind:style="{ background: 'blue-grey', color:'white' }"
	          @mouseover="activeEffect = true" 
	          @mouseleave="activeEffect = false"
	          block variant="primary"
	         >
	          <Strong style="color: white">Adverse Effect</Strong><b-icon data-html2canvas-ignore="true" icon="info-circle" style="margin-left: 10px"></b-icon> <b-icon data-html2canvas-ignore="true" class="float-right"icon="arrows-expand" v-if="visibleEff"></b-icon> <b-icon class="float-right" icon="arrows-collapse" v-else></b-icon>
	        </b-button>
	        <p  v-show="activeEffect">List of drugs with known adverse effects.</p>
	        <b-collapse id="collapse-4" v-model="visibleEffect" class="mt-2">
	          <div data-html2canvas-ignore="true">
	            <input type="checkbox" id="checkbox5" v-model="hide_adverse_tableMutation">
	              <label for="checkbox22">Mutation</label>
	            <input type="checkbox" id="checkbox6" v-model="hide_adverse_tableTherapy">
	              <label for="checkbox23">Therapy</label>
	            <input type="checkbox" id="checkbox7" v-model="hide_adverse_tableEffect">
	              <label for="checkbox24">Effect</label>
	            <input type="checkbox" id="checkbox7" v-model="hide_adverse_tableVariantType">
	              <label for="checkbox25">Variant Type</label>
	            <input type="checkbox" id="checkbox7" v-model="hide_adverse_tableEvidence">
	              <label for="checkbox26">Evidence</label>
	            <input type="checkbox" id="checkbox8" v-model="hide_adverse_tableReferences">
	              <label for="checkbox27">References</label>
	            <button class="downloadbutn float-right " @click="exportToPDF_adverse_table()"><b-icon class="float-left" icon="download" style="margin-right: 3px" data-html2canvas-ignore="true"></b-icon> PDF</button>
	          </div>
	          <b-card> 
	            <table class="table table-hover">
	              <thead>
	                <tr data-html2canvas-ignore="true">
	                  <td></td>
	                  <td>
	                    <v-text-field v-model="genes5" type="string" label="Gene"></v-text-field>
	                  </td>
	                  <td>
	                    <v-text-field v-show="hide_adverse_tableMutation" v-model="status5" type="string" label="Mutation"></v-text-field>
	                  </td>
	                  <td>
	                    <v-text-field v-show="hide_adverse_tableTherapy" v-model="therapy5" type="string" label="Therapy"></v-text-field>
	                  </td>
	                  <td>
	                    <v-text-field v-show="hide_adverse_tableEffect" v-model="effect5" type="number" label="Effect"></v-text-field>
	                  </td>
	                  <td>
	                    <v-text-field v-show="hide_adverse_tableVariantType" v-model="variantType5" type="number" label="VariantType"></v-text-field>
	                  </td>	
	                  <td>
	                    <v-text-field v-show="hide_adverse_tableEvidence" v-model="evidence5" type="number" label="Evidence"></v-text-field>
	                  </td>	           
	                  <td>
	                    <v-text-field v-show="hide_adverse_tableReferences" v-model="reference5" type="string" label="Reference"></v-text-field>
	                  </td>
	                </tr>
	                <tr>
	                  <th data-html2canvas-ignore="true">
	                    <label class="form-checkbox">
	                      <input type="checkbox" v-model="selectAll" @click="select(direct_pharm_table )">
	                      <i class="form-icon"></i>
	                    </label>
	                  </th>
	                  <th @click="sortadEff('Gene')">Gene <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirGene5 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                  <th v-show="hide_adverse_tableMutation" @click="sortadEff('Mutation')">Mutation <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirMut5 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                  <th v-show="hide_adverse_tableTherapy" @click="sortadEff('Therapy')">Therapy <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirTherapy5 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                  <th v-show="hide_adverse_tableEffect" @click="sortadEff('Effect')">Effect <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirEffect5 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                  <th v-show="hide_adverse_tableDisease" @click="sortadEff('Disease')">Variant Type <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirDisease5 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                  <th v-show="hide_adverse_tableEvidence" @click="sortadEff('Evidence')">Evidence <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirEvidence5 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>	
	                  <th v-show="hide_adverse_tableReferences" @click="sortadEff('References')">Reference <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirRef5 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                </tr>
	              </thead>
	              <tbody>
	                <tr v-for="(item, index) in sortedadEff" :key="item.gene" v-if="index < startRowadEff + rowsPerPageadEff && index >= startRowadEff ">
	                  <td class="text-xs-center" data-html2canvas-ignore="true">      
	                    <label class="form-checkbox">
	                        <input type="checkbox" :value="item.gene" v-model="checkedGenes">
	                        <i class="form-icon"></i>
	                    </label>
	                  </td>
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
	            <div id="page-navigation" class="float-right" data-html2canvas-ignore="true">
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
	    <br>
	    <br>
	    <div ref="content_ref" id="ref_content">
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
	        <p data-html2canvas-ignore="true">The publications of the IDs given in the tables above. <button class="downloadbutn float-right " @click="exportToPDF_ref()"><b-icon class="float-left" icon="download" style="margin-right: 3px" data-html2canvas-ignore="true"></b-icon> PDF</button></p>
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
	    <br>
	    <br>
	    <div ref="content_appendix_variant_table" id="appendix_variant_table_content">
	      <b-button
	        :class="visibleAppendix ? null : 'collapsed'"
	        :aria-expanded="visibleAppendix ? 'true' : 'false'"
	        aria-controls="collapse-4"
	        @click="visibleAppendix = !visibleAppendix"
	        @mouseover="activeAppendix = true" 
	          @mouseleave="activeAppendix = false"
	        class="text-center" 
	        v-bind:style="{ background: 'grey', color:'white' }" 
	        block variant="primary"
	        >
	        <Strong style="color: white">Appendix</Strong><b-icon data-html2canvas-ignore="true" icon="info-circle" style="margin-left: 10px"></b-icon><b-icon class="float-right"icon="arrows-expand" v-if="visibleAppendix"></b-icon> <b-icon class="float-right" icon="arrows-collapse" v-else></b-icon>
	      </b-button>
	      <p v-show="activeAppendix">All the somatic variants of the patient with their dbSNP and COSMIC IDs.</p> 
	      <b-collapse id="collapse-4" v-model="visibleAppendix" class="mt-2">
	        <div data-html2canvas-ignore="true">
	          <input type="checkbox" id="checkbox15" v-model="hideappendix_variant_tableMutation">
	            <label for="checkbox28">Mutation</label>
	          <input type="checkbox" id="checkbox16" v-model="hideappendix_variant_tableConsequence">
	            <label for="checkbox29">Consequence</label>
	         <input type="checkbox" id="checkbox16" v-model="hideappendix_variant_tableVAF">
	            <label for="checkbox30">VAF</label>
	         <input type="checkbox" id="checkbox16" v-model="hideappendix_variant_tabledbSNP">
	            <label for="checkbox31">dbSNP</label>
	          <input type="checkbox" id="checkbox17" v-model="hideappendix_variant_tableCosmic">
	            <label for="checkbox32">COSMIC</label>
	         <button class="downloadbutn float-right " @click="exportToPDF_appendix_variant_table()"><b-icon class="float-left" icon="download" style="margin-right: 3px" data-html2canvas-ignore="true"></b-icon> PDF</button>
	        </div>
	          <b-card>
	            <table class="table table-hover">
	                  <thead>
	                    <tr data-html2canvas-ignore="true">
	                      <td></td>
	                      <td>
	                        <v-text-field v-model="genes6" type="string" label="Gene"></v-text-field>
	                      </td>
	                      <td>
	                        <v-text-field v-show="hideappendix_variant_tableMutation" v-model="mutations6" type="string" label="Mutation"></v-text-field>
	                      </td>
	                     <td>
	                        <v-text-field v-show="hideappendix_variant_tableConsequence" v-model="consequence6" type="string" label="Consequence"></v-text-field>
	                      </td>
	                      <td>
	                        <v-text-field v-show="hideappendix_variant_tableVAF" v-model="vaf6" type="string" label="VAF"></v-text-field>
	                      </td>
	                      <td>
	                        <v-text-field v-show="hideappendix_variant_tabledbSNP" v-model="dbSNP6" type="string" label="dbSNP"></v-text-field>
	                      </td>
	                      <td>
	                        <v-text-field v-show="hideappendix_variant_tableCosmic" v-model="cosmic6" type="string" label="COSMIC"></v-text-field>
	                      </td>
	                    </tr>
	                    <tr>
	                      <th data-html2canvas-ignore="true">
	                        <label class="form-checkbox">
	                          <input type="checkbox" v-model="selectAll" @click="select(appendix_variant_table)">
	                          <i class="form-icon"></i>
	                        </label>
	                      </th>
	                      <th @click="sortAppendix('Gene')">Gene <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirGene6 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hideappendix_variant_tableMutation" @click="sortAppendix('Mutation')">Mutation <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirMut6 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hideappendix_variant_tableConsequence" @click="sortAppendix('Consequence')">Consequence <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirConsequence6 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hideappendix_variant_tableVAF" @click="sortAppendix('VAF')">VAF<b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirVaf6 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hideappendix_variant_tabledbSNP" @click="sortAppendix('dbSNP')">dbSNP<b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirdbSNP6 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hideappendix_variant_tableCosmic" @click="sortAppendix('COSMIC')">COSMIC <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirCosmic6 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                    </tr>
	                  </thead>
	                  <tbody>
	                    <tr v-for="(item, index) in sortedAppendix" :key="item.gene" v-if="index < startRowAppendix + rowsPerPageAppendix && index >= startRowAppendix ">
	                      <td class="text-xs-center" data-html2canvas-ignore="true">      
	                        <label class="form-checkbox">
	                            <input type="checkbox" :value="item.gene" v-model="checkedGenes">
	                            <i class="form-icon"></i>
	                        </label>
	                      </td>
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
	                <div id="page-navigation" class="float-right" data-html2canvas-ignore="true">
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

        vcffile:"",
        assembly:"",
        status:"",
        jobid:"",
        filename:"",
        showNetwork:false,

        jsongenerated:false,
        hasdrivergenes:true,
        drivergenes:[],

        currentSort:'Gene',
        currentSortDir:'asc',
        currentSortDirGene1:'asc',
        currentSortDirMut1:'asc',
        currentSortDirType1:'asc',
        currentSortDirConf1:'asc',
        currentSortDirRef1:'asc',

        currentSortPtpda:'Gene',
        currentSortDirPtpda:'asc',
        currentSortDirGene2:'asc',
        currentSortDirStat2:'asc',
        currentSortDirTherapy2:'asc',
        currentSortDirConf2:'asc',
        currentSortDirRef2:'asc',

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

        startRow: 0,
        currentPage: 1,
        rowsPerPage: 10,

        startRowPtpda: 0,
        currentPagePtpda: 1,
        rowsPerPagePtpda: 10,

        startRowPtpia: 0,
        currentPagePtpia: 1,
        rowsPerPagePtpia: 10,

        startRowMskpe: 0,
        currentPageMskpe: 1,
        rowsPerPageMskpe: 10,

        startRowadEff: 0,
        currentPageadEff: 1,
        rowsPerPageadEff: 10,

        startRowAppendix: 0,
        currentPageAppendix: 1,
        rowsPerPageAppendix: 10,

        visibleDrivers: true,
        visiblePharma: true,
        visibleAffect: true,
        visibleAffectCivic: false,
        visibleAffectCancer: false,
        visibleEffect: true,
        visibleRef: false,
        visibleAppendix: false,
        activeDrivers: false,
        activePharma: false,
        activeCivic:false,
        activeSum: false,
        activeEffect:false,
        activeAppendix:false,
        showTable:false,
        showStatus:true,
        showFileLoad:true,
        driver_table: [],
        direct_pharm_table : [],
        pharm_table : [],
        mechanistic_drug_table: [],
        adEff: [],
        appendix_reference_table: [],
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

        genes2:'',
        mutation2:'',
        therapy2:'',
        effect2:'',
        disease2:'',
        evidence2:'',
        reference2:'',

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
        hidedirect_pharm_tableMutation:true,
        hidedirect_pharm_tableTherapy:true,
        hidedirect_pharm_tableEffect:true,
        hidedirect_pharm_tableDisease:true,
        hidedirect_pharm_tableEvidence:true,
        hidedirect_pharm_tableReferences:true,
        hidepharm_tableMutation:true,
        hidepharm_tableEffect:true,
        hidepharm_tableDisease:true,
        hidepharm_tableEvidence:true,
        hidepharm_tableReferences:true,
        hidepharm_tableTherapy:true,
        hidemechanistic_drug_tableStatus:true,
        hidemechanistic_drug_tableTherapy:true,
        hidemechanistic_drug_tableReferences:true,
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

        uuids:[] 
      }
    },
    methods: {
    	startAnalysis(){
		    if(localStorage.getItem("username") && localStorage.getItem("jobid") && localStorage.getItem("assembly")){
		    	this.username = localStorage.getItem("username")
			    this.jobid = localStorage.getItem("jobid");
	    		this.assembly = localStorage.getItem("assembly");
	    		this.getVcfStatus(this.jobid+'.vcf', this.username)
	    	}
	    	else if( localStorage.getItem("username") && localStorage.getItem("json") && !localStorage.getItem("jobid")){
	    		this.username = localStorage.getItem("username")
	    		this.showStatus = false;
	    		this.hasdrivergenes = false;
	    		this.showJSON(this.username, JSON.parse(localStorage.getItem("json")))
	    	}
	    	else if( localStorage.getItem("username") && localStorage.getItem("json") && localStorage.getItem("jobid") && localStorage.getItem("uudis")){
	    		this.username = localStorage.getItem("username")
	    		this.jobid = localStorage.getItem("jobid");
	    		this.showStatus = false;
	    		this.showJSON(this.username, Json.parse(localStorage.getItem("json")), this.username, localStorage.getItem("uudis"))
	    	}
	    	else if(localStorage.getItem("username") && localStorage.getItem("jobid")){
	    		this.username = localStorage.getItem("username")
	    		this.jobid = localStorage.getItem("jobid");
	    		this.showStatus = false;
	    		this.getJsonFromJobID(this.jobid, this.username)
	    	}
    	},
    	getVcfStatus(jobid, username){
			var status = axios.get('/clinvap/results/'+username+'_'+jobid+'/status')
				.then(function (response) {
				   	return response.data.Status;
				})
				.catch(error => {
				    console.log(error);
			    	if(error.response.status == 404 || error.response.status == 502){
			    		setTimeout(function(scope){scope.getVcfStatus(jobid, username)}, 10000, this);
			    	}
			    	else{
			    		return error.response;
			    	}
		 		})
			status.then(res => {
				var stop = false
			  	if(res == "Success,Finished"  && this.status != "Finished" && !stop){
			  		this.displayJSON(jobid.split(".")[0], username);
			  		this.status = res;
			  		this.showNetwork=true;
			  		stop = true
			  		return
			  	}
			  	else if(res == "Failed,Finished" && this.status != "Finished" && !stop){
			  		this.status = res;
			  		stop = true;
			  		return
			  	}
			  	else{
			  		this.status=res;
			  		setTimeout(function(scope){scope.getVcfStatus(jobid, username)}, 30000,this);
			  	}})
	    },
	    showJSON(username, jsonfile=null, jobid=null, uuids = null){
    		this.jsongenerated = true;
    		this.driver_table= jsonfile.driver_table;
	        this.direct_pharm_table  = jsonfile.direct_pharm_table ;
	        this.pharm_table  = jsonfile.pharm_table ;
	        this.mechanistic_drug_table = jsonfile.mechanistic_drug_table;
	        this.adEff = jsonfile.adverse_table;
	        this.appendix_reference_table = jsonfile.appendix_reference_table;
	        this.appendix_variant_table = jsonfile.appendix_variant_table;
	        for(let item  of this.appendix_reference_table){
	        	if(item.combined.includes("et al")){
		        	item.url =  "https://www.ncbi.nlm.nih.gov/pubmed/?term="+[item.combined.split('et al')[0],item.combined.split('.')[1].split(',')[1].trim().split(' ').join('+'), item.combined.split(',').slice(-1)[0]].join('+')
		        }
	        }

	    	this.showTable = true;
	    	if(jobid == null){
	    		return
	    	}
	    	// this.getGraphVis();
	    	if(!uuids){
		        var drivergenes = axios.get('clinvap/results/'+username+'_'+jobid.split(".")[0] + ".json"+'/tables/driver-genes')
		    		.then(res => {console.log(res.data);return res.data})
		    	drivergenes.then(res => { 
		    		let result = res.map(a => a.gene); 
		    		drivergenes = result;})
		    	drivergenes.then(res=>{
		    		this.getGraphFromGenes(drivergenes, jobid, username)})
		    }
		    else if(uuids){
		    	this.uuids = uuids
		    	this.getGraphFromUUID(jobid, uuids, username)
		    }
	    },
	    getGraphFromGenes(genes, jobid, username){
	    	var graphml = this.getGraphforGene(jobid, genes, username)
	    		.then(response => {return response})
			graphml.then(response => {
				if(response == undefined){
					alert("No network found for "+genes)
					return
				}
				axios.post('/visualization/vis?username='+username+"&jobid="+jobid, response)
				  .then(function (response) {
				  })
				  .catch(function (error) {
				    console.log(error);
				  });
				this.showNetwork = false;
			  	this.$refs.loader1.style.visibility="hidden";		
				// window.open("http://localhost:3000/BioGraphVisart?username="+username+"&jobid="+jobid)

			})
		},
		getGraphforGene(jobid, names, username){
		  	if(names){
			  	return axios.post('/network/drivergenes', {genes: names}, {
						    headers:{
						      	'user':username+'/'+jobid.toString()
						    },
						    method: 'POST'
				  		})
			  		.then(response => { 
			  			this.uuids.push(response.data.uuid);
			  			this.updateDbEntry(jobid, response.data.uuid, username)
						return axios.get('/network/networks/'+response.data.uuid, {
						    headers:{
						      	'user':username+'/'+jobid.toString()
						    },
						    method: 'GET'
					  	}).then(res => {
								return res.data
						})
					})
					.catch(error => {
					    console.log(error.response)
					});
			}
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
	    getGraphFromUUID(jobid, uuids, username){
	    	var jobid = jobid.split(".")[0]
	    	for(let uuid of uuids){
				var graphml =  axios.get('/network/networks/'+uuid, {
				    headers:{
				      	'user':username+'/'+jobid
				    },
				    method: 'GET'
			  	}).then(
					res => {
						axios.post('/visualization/vis?username='+username+"&uuid="+uuid, res.data) 
						.then(function (response) {
							console.log(response)
						})
						.catch(function (error) {
						    console.log(error);
					 	});		
						// window.open("http://localhost:3000/BioGraphVisart/?username="+username+"&uuid="+uuid) 
					})
			  	.catch(function (error) {
				    console.log(error);
			 	});	
			}
	    },
	    updateDbEntry(jobid, uuid, username){
	    	if(jobid.endsWith(".vcf")){
	    		jobid = jobid.spit(".")[0]
	    	}
	    	pecaxdb.updateEntry(new arangodb.Database('/db/'), username, jobid, uuid)
	    },
	    displayJSON(jobid, username){
	    	this.showTable=true;
	    	var jsonReport = axios.get('/clinvap/results/'+username+'_'+jobid+'.json')
	    		.then(res=>{console.log(res.data);return res.data})
	    	jsonReport.then(res => {
	    		console.log(res)
	    		this.showJSON(username, res, jobid);
	    	 	this.jsonReport = res;
	    		this.storeJsonInDB(res, jobid, username)})
	    },
	    download_json(){
	    	this.jsonReport.then(res => {var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res));
		    var downloadAnchorNode = document.createElement('a');
		    downloadAnchorNode.setAttribute("href",     dataStr);
		    downloadAnchorNode.setAttribute("download", this.vcffile.name.split(".")[0] + ".json");
		    document.body.appendChild(downloadAnchorNode); // required for firefox
		    downloadAnchorNode.click();
		    downloadAnchorNode.remove();})
	    },
	    getJsonFromJobID(jobid, username){

	    	pecaxdb.getJsonFromJobID(new arangodb.Database('/db/'), arangodb.aqlQuery, username, jobid).then(json => {
	    		this.showJSON(username, json._result[0].json_file, json._result[0]._key, json._result[0].uuids)
	    	});
	    },
	    storeJsonInDB(jsonReport, jobid, username){
	    	pecaxdb.addJson(new arangodb.Database('/db/'), username, jobid+".vcf", jsonReport, this.assembly);
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
	        this.activeDrivers = true;
	        this.activePharma = true;
	        this.activeCivic = true;
	        this.activeEffect=true;
	        this.activeSum = true;
	        this.activeAppendix=true;
	        var self = this;
	        setTimeout(function(){
	          self.$refs['refTable'].hideDefaultFooter=true;
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
	    },
	    exportToPDF_driver_table() {
	        this.activeDrivers = true;
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
	    },
	    exportToPDF_direct_pharm_table() {
	        this.visibleDrivers = false;
	        this.activePharma = true;
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
	    },
	    exportToPDF_pharm_table() {
	        this.visibleDrivers = false;
	        this.visiblePharma = false;
	        this.activeCivic = true;
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
	    },
	    exportToPDF_mechanistic_drug_table() {
	        this.visibleDrivers = false;
	        this.visiblePharma = false;
	        this.visibleAffectCivic = false;
	        this.activeSum = true;
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
	    },
	    exportToPDF_adverse_table() {
	        this.visibleDrivers = false;
	        this.visiblePharma = false;
	        this.visibleAffectCivic = false;
	        this.visibleAffectCancer = false;
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
	        this.visibleDrivers = false;
	        this.visiblePharma = false;
	        this.visibleAffectCivic = false;
	        this.visibleAffectCancer = false;
	        this.visibleEffect = false;
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
	        this.visibleDrivers = false;
	        this.visiblePharma = false;
	        this.visibleAffectCivic = false;
	        this.visibleAffectCancer = false;
	        this.visibleRef = false;
	        this.visibleEffect = false;
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
	    download_DriverNetwork(){
	    	var graphml = this.getGraphforGene(this.jobid, this.drivergenes, this.username)
	    		.then(response => graphml = response)
	    	graphml.then(function(response){
				if(response == undefined){
					alert("No network found. ")
					this.$refs.loader1.style.visibility="hidden";
					this.showNetwork = false;
					return
				}
				else{
					var element = document.createElement('a');
					element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(response));
					element.setAttribute('download', "drivergenes.graphml");

					element.style.display = 'none';
					document.body.appendChild(element);

					element.click();

					document.body.removeChild(element);}})
	    },
	    show_DriverNetwork(){
	    	this.getGraphFromUUID(this.jobid, this.uuids, this.username)
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
	    sortPtpda:function(s) {
	        //if s == current sort, reverse
	        if(s === "Gene") {
	          this.currentSortDirGene2 = this.currentSortDirGene2==='asc'?'desc':'asc';
	          this.currentSortDirPtpda = this.currentSortDirGene2;
	          this.currentSort = "gene";
	        }
	        else if(s === "Mutation") {
	          this.currentSortDirMut2 = this.currentSortDirMut2==='asc'?'desc':'asc';
	          this.currentSortDirPtpda = this.currentSortDirMut2;
	          this.currentSort = "variant";
	        }
	        else if(s === "Therapy") {
	          this.currentSortDirTherapy2 = this.currentSortDirTherapy2==='asc'?'desc':'asc';
	          this.currentSortDirPtpda = this.currentSortDirTherapy2;
	          this.currentSort = "drug_name";
	        }
	        else if(s === "Effect") {
	          this.currentSortDirEffect2 = this.currentSortDirEffect2==='asc'?'desc':'asc';
	          this.currentSortDirPtpda = this.currentSortDirEffect2;
	          this.currentSort = "variant_drug_association";
	        }
	        else if(s === "Disease") {
	          this.currentSortDirDisease2 = this.currentSortDirDisease2==='asc'?'desc':'asc';
	          this.currentSortDirPtpda = this.currentSortDirDisease2;
	          this.currentSort = "tumor_list";
	        }
	        else if(s === "Evidence") {
	          this.currentSortDirEvidence2 = this.currentSortDirEvidence2==='asc'?'desc':'asc';
	          this.currentSortDirPtpda = this.currentSortDirEvidence2;
	          this.currentSort = "match_level";
	        }
	        else if(s === "References") {
	          this.currentSortDirRef2 = this.currentSortDirRef2==='asc'?'desc':'asc';
	          this.currentSortDirPtpda = this.currentSortDirRef2;
	          this.currentSort = "ref_map";
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
	    movePages: function(amount) {
	        var newStartRow = this.startRow + (amount * this.rowsPerPage);
	        if (newStartRow >= 0 && newStartRow < this.sortedMskdg.length) {
	          this.startRow = newStartRow;
	        }
	        if( (amount == 1 || this.currentPage > 1) && (this.currentPage+amount)*this.rowsPerPage <= Math.ceil(this.sortedMskdg.length / 10) * 10){
	          this.currentPage += amount
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
	},
	created(){
	   this.startAnalysis();
	},
	computed: {
	    sortedMskdg:function() {
	    	console.log(this.currentSort)
	        var sorted = this.driver_table.sort((a,b) => {
	        	console.log(a, b)
	          let modifier = 1;
	          if(this.currentSortDir === 'desc') modifier = -1;
	          if(a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
	          if(a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
	          return 0;
	        });
	        var filtered_sorted = []
	        for(var item of sorted){
	          if((item.gene.toLowerCase().includes(this.genes1.toLowerCase()) || this.genes1 == '') && 
	                (item.one_letter_repr.toLowerCase().includes(this.mutations1.toLowerCase()) || this.mutations1 == '') && 
	                (this.driverType1 == '' || item.driver_role.toLowerCase().includes(this.driverType1.toLowerCase())) && 
	                (this.consequence1 == '' || item.Consequence.toLowerCase().includes(this.consequence1.toLowerCase())) && 
	                (this.tumorType1 == '' || item.tumor_list.includes(this.tumorType1)) &&
	                (this.vaf1 == '' || item.vaf.includes(this.vaf1) )&&  
	                (this.reference1 == '' || item.ref_map.includes(this.reference1)) &&
	                (item.gene.toLowerCase().includes(this.genesall.toLowerCase()) || this.genesall == '')&&
	                (item.one_letter_repr.toLowerCase().includes(this.mutationall.toLowerCase()) || this.mutationall == '')){
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
	          if((item.gene.toLowerCase().includes(this.genes2.toLowerCase()) || this.genes2 == '') && 
	                (item.variant.toLowerCase().includes(this.mutation2.toLowerCase()) || this.mutation2== '') && 
	                (this.therapy2 == '' || item.drug_name.toLowerCase().includes(this.therapy2.toLowerCase())) && 
	                (this.effect2 == '' || item.variant_drug_association.toLowerCase().includes(this.effect2.toLowerCase())) && 
	                (this.disease2 == '' || item.tumor_list.toLowerCase().includes(this.disease2.toLowerCase())) &&
	                (this.evidence2 == '' || item.match_level.toLowerCase().includes(this.evidence2.toLowerCase())) &&  
	                (this.reference2 == '' || item.ref_map.includes(this.reference2))&&
	                (item.gene.toLowerCase().includes(this.genesall.toLowerCase()) || this.genesall == '')&&
	                (this.therapyall == '' || item.drug_name.toLowerCase().includes(this.therapyall.toLowerCase()))&&
	                (item.variant.toLowerCase().includes(this.mutationall.toLowerCase()) || this.mutationall == '')&&
	                (item.tumor_list.toLowerCase().includes(this.diseaseall.toLowerCase()) || this.diseaseall == '')){
	            filtered_sorted.push(item)
	          }
	        }
	        return filtered_sorted;
	    },
	    sortedPtpia:function() {
	        var sorted = this.pharm_table .sort((a,b) => {
	          let modifier = 1;
	          if(this.currentSortDirPtpia === 'desc') modifier = -1;
	          if(a[this.currentSortPtpia] < b[this.currentSortPtpia]) return -1 * modifier;
	          if(a[this.currentSortPtpia] > b[this.currentSortPtpia]) return 1 * modifier;
	          return 0;
	        });
	        var filtered_sorted = [];
	        for(var item of sorted){
	          if((item.gene.toLowerCase().includes(this.genes3.toLowerCase()) || this.genes3 == '') && 
	                    (item.variant.toLowerCase().includes(this.mutations3.toLowerCase()) || this.mutations3 == '') && 
	                    (this.therapy3 == '' || item.drug_name.toLowerCase().includes(this.therapy3.toLowerCase())) && 
	                    (this.effect3 == '' || item.variant_drug_association.toLowerCase().includes(this.effect3.toLowerCase())) && 
	                    (this.disease3 == '' || item.tumor_list.toLowerCase().includes(this.disease3.toLowerCase())) && 
	                    (this.evidence3 == '' || item.match_level.toLowerCase() == this.evidence3.toLowerCase()) && 
	                    (this.reference3 == '' || item.ref_map.includes(this.reference3))&&
	                    (item.gene.toLowerCase().includes(this.genesall.toLowerCase()) || this.genesall == '')&&
	                    (this.therapyall == '' || item.drug_name.toLowerCase().includes(this.therapyall.toLowerCase()))&&
	                    (this.diseaseall == '' || item.tumor_list.toLowerCase().includes(this.diseaseall.toLowerCase()))&&
	                    (this.mutationall == '' || item.variant.toLowerCase().includes(this.mutationall.toLowerCase()))){
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
	          if((item.gene.toLowerCase().includes(this.genes4.toLowerCase()) || this.genes4 == '') && 
	                    (item.approval_status.toLowerCase().includes(this.status4.toLowerCase()) || this.status4 == '') && 
	                    (this.therapy4 == '' || item.drug_name.toLowerCase().includes(this.therapy4.toLowerCase())) && 
	                    (this.reference4 == '' || item.ref_map.includes(this.reference4))&&
	                    (item.gene.toLowerCase().includes(this.genesall.toLowerCase()) || this.genesall == '')&&
	                    (this.therapyall == '' || item.Therapy.toLowerCase().includes(this.therapyall.toLowerCase()))){
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
	          if((item.gene.toLowerCase().includes(this.genes5.toLowerCase()) || this.genes5 == '') && 
	                (item.variant.toLowerCase().includes(this.mutations5.toLowerCase()) || this.mutations5 == '') && 
	                (this.therapy5 == '' || item.drug_name.toLowerCase().includes(this.therapy5.toLowerCase())) && 
	                (this.effect5 == '' || item.variant_drug_association == this.effect5) && 
	                (this.variantType5 == '' || item.variant_type == this.variantType5) && 
	                (this.evidence5 == '' || item.match_level == this.evidence5) && 
	                (this.reference5 == '' || item.ref_map.includes(this.reference5))&&
	                (item.gene.toLowerCase().includes(this.genesall.toLowerCase()) || this.genesall == '')&&
	                (this.therapyall == '' || item.Therapy.toLowerCase().includes(this.therapyall.toLowerCase()))&&
	                (item.variant.toLowerCase().includes(this.mutationall.toLowerCase()) || this.mutationall == '')){
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
	          if( (item.gene.toLowerCase().includes(this.genes6.toLowerCase()) || this.genes6 == '') && 
	                      (item.mutation.toLowerCase().includes(this.mutations6.toLowerCase()) || this.mutations6 == '') && 
	                      (item.Consequence.toLowerCase().includes(this.consequence6.toLowerCase()) || this.consequence6 == '') && 
	                      (item.vaf.toLowerCase().includes(this.vaf6.toLowerCase()) || this.vaf6 == '') && 
	                      (this.dbSNP6 == '' || item.dbSNP.includes(this.dbSNP6)) && 
	                      (this.cosmic6 == '' || item.COSMIC.toLowerCase().includes(this.cosmic6.toLowerCase()))&&
	                      (item.gene.toLowerCase().includes(this.genesall.toLowerCase()) || this.genesall == '')&& 
	                      (this.mutationall == '' || item.mutation.toLowerCase().includes(this.mutationall.toLowerCase()))){
	            item.dbSNP=JSON.stringify(item.dbSNP).replace(/[\[\]']+/g,'').replace(/^"|"$/g, '')
	            item.COSMIC = JSON.stringify(item.COSMIC).replace(/[\[\]']+/g,'').replace(/"/g, '').replace(/,/g,', ')
	            filtered_sorted.push(item)
	          }
	        }
	        return filtered_sorted;
	    },
    },
  }
</script>
