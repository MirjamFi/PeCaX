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
		            	<v-text-field v-model="therapyall" type="string" label="Therapy"></v-text-field>
		          	</td>
		          	<td style="padding:0 15px 0 15px;">
		            	<v-text-field v-model="diseaseall" type="string" label="Disease"></v-text-field>
		          	</td>
		          	<td style="padding:0 15px 0 15px;">
		            	<v-text-field v-model="confidenceall" type="number" label="Confidence"></v-text-field>
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
    	<div ref = "content_mskdg" id="mskdg_content">
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
          		<Strong class="text-center" >Somatic Mutations in Known Driver Genes </Strong><b-icon data-html2canvas-ignore="true" icon="info-circle" style="margin-left: 10px"></b-icon> <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrows-expand" v-if="visibleDrivers"></b-icon> <b-icon class="float-right" icon="arrows-collapse" v-else></b-icon>
        	</b-button>
        	<p  v-show="activeDrivers">List of cancer driver genes along with the mutations observed in the patient. Confidence column shows the number of the driver gene sources that cataloged the corresponding gene as driver and Reference column gives the list of those sources.</p>
       		<b-collapse id="collapse-4" v-model="visibleDrivers" class="mt-2">
		        <div data-html2canvas-ignore="true">
		            <input type="checkbox" id="checkbox1" v-model="hidemskdgMutation">
		              <label for="checkbox1">Mutation</label>
		            <input type="checkbox" id="checkbox2" v-model="hidemskdgType">
		              <label for="checkbox2">Driver Type</label>
		            <input type="checkbox" id="checkbox3" v-model="hidemskdgConfidence">
		              <label for="checkbox3">Confidence</label>
		            <input type="checkbox" id="checkbox4" v-model="hidemskdgReferences">
		              <label for="checkbox4">Reference</label>
		              <button class="downloadbutn float-right " @click="exportToPDF_mskdg()"><b-icon class="float-left" icon="download" style="margin-right: 3px"></b-icon> PDF</button>
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
	                    <v-text-field v-show="hidemskdgMutation" v-model="mutations1" type="string" label="Mutation"></v-text-field>
	                  </td>
	                  <td>
	                    <v-text-field v-show="hidemskdgType" v-model="type1" type="string" label="Driver Type"></v-text-field>
	                  </td>
	                  <td>
	                    <v-text-field v-show="hidemskdgConfidence" v-model="confidence1" type="number" label="Confidence"></v-text-field>
	                  </td>
	                  <td>
	                    <v-text-field v-show="hidemskdgReferences" v-model="reference1" type="string" label="Reference"></v-text-field>
	                  </td>
	                </tr>
	                <tr>
	                  <th data-html2canvas-ignore="true">
	                    <label class="form-checkbox">
	                      <input type="checkbox" v-model="selectAll" @click="select(mskdg)">
	                      <i class="form-icon"></i>
	                    </label>
	                  </th>
	                  <th @click="sortMskdg('Gene')">Gene <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirGene1 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                  <th v-show="hidemskdgMutation" @click="sortMskdg('Mutation')">Mutation <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirMut1 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                  <th v-show="hidemskdgType" @click="sortMskdg('Type')">Driver Type <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirType1 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                  <th v-show="hidemskdgConfidence" @click="sortMskdg('Confidence')">Confidence <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirConf1 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                  <th v-show="hidemskdgReferences" @click="sortMskdg('References')">Reference <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirRef1 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                </tr>
	              </thead>
	              <tbody>
	                <tr v-for="(item, index) in sortedMskdg" :key="item.Gene" v-if="index < startRow + rowsPerPage && index >= startRow">
	                  <td class="text-xs-center" data-html2canvas-ignore="true">      
	                    <label class="form-checkbox">
	                        <input type="checkbox" :value="item.Gene" v-model="checkedGenes">
	                        <i class="form-icon"></i>
	                    </label>
	                  </td>
	                  <td @click="selectItem(item)" :class="{'first': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 0, 'second': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 1,'third': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 2, 'fourth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 3, 'fifth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 4}">
	                    {{ item.Gene }}
	                   	<div class="dropdown"><b-icon class="float-right dropbtn" icon="globe2"></b-icon>
	                    <div class="dropdown-content">
				            <a class="page-link" href="/documentation">Documentation</a>
				            <a class="page-link" href="/contact">Contact</a>
				          </div>
				        </div> 
	                  </td>
	                  <td v-show="hidemskdgMutation" @click="selectItem(item)" :class="{'first': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 0, 'second': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 1,'third': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 2, 'fourth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 3, 'fifth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 4}" class=text-xs-right>
	                    {{ item.Mutation }}
	                  </td>
	                  <td v-show="hidemskdgType" @click="selectItem(item)" :class="{'first': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 0, 'second': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 1,'third': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 2, 'fourth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 3, 'fifth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 4}" class=text-xs-right>
	                    {{ item.Type}}
	                  </td>
	                  <td v-show="hidemskdgConfidence" @click="selectItem(item)" :class="{'first': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 0, 'second': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 1,'third': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 2, 'fourth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 3, 'fifth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 4}" class=text-xs-right>
	                    {{ item.Confidence }}
	                  </td>
	                  <td v-show="hidemskdgReferences" @click="selectItem(item)" :class="{'first': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 0, 'second': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 1,'third': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 2, 'fourth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 3, 'fifth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 4}" class=text-xs-right>
	                    {{ item.References }}
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
	            <template v-slot:footer>
	              <div>
	                Confidence shows the number of driver gene sources that includes the gene. The sources are Vogelstein et al., Rubio-Perez et al., TSGene DB, COSMIC DB, UniProt.
	              </div>
	            </template>       	
	          </b-card>
	        </b-collapse>
	    </div>
	    	    <div class="embed-responsive embed-responsive-16by9 z-depth-1-half">
					<iframe class="embed-responsive-item" src="http://localhost:3000/BioGraphVisart" allowfullscreen></iframe>
				</div>  
	      <br>

	    <div ref = "content_ptpda" id="ptpda_content">
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
	          <Strong>Somatic Mutations with Known Pharmacogenetic Effect</Strong><b-icon data-html2canvas-ignore="true" icon="info-circle" style="margin-left: 10px"></b-icon> <b-icon data-html2canvas-ignore="true" class="float-right"icon="arrows-expand" v-if="visiblePharma"></b-icon> <b-icon class="float-right" icon="arrows-collapse" v-else></b-icon>
	        </b-button>
	        <p  v-show="activePharma">List of drugs with the evidence of targeting the observed variant of the mutated gene regardless of the cancer type. The information is obtained from CIViC database. CIViC evidence levels are given in the Evidence column.</p>
	        <b-collapse id="collapse-4" v-model="visiblePharma" class="mt-2">
	          <div data-html2canvas-ignore="true">
	            <input type="checkbox" id="checkbox5" v-model="hideptp_daStatus">
	              <label for="checkbox5">Status</label>
	            <input type="checkbox" id="checkbox6" v-model="hideptp_daTherapy">
	              <label for="checkbox6">Therapy</label>
	            <input type="checkbox" id="checkbox7" v-model="hideptp_daConfidence">
	              <label for="checkbox7">Confidence</label>
	            <input type="checkbox" id="checkbox8" v-model="hideptp_daReferences">
	              <label for="checkbox8">References</label>
	            <button class="downloadbutn float-right " @click="exportToPDF_ptpda()"><b-icon class="float-left" icon="download" style="margin-right: 3px" data-html2canvas-ignore="true"></b-icon> PDF</button>
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
	                    <v-text-field v-show="hideptp_daStatus" v-model="status2" type="string" label="Status"></v-text-field>
	                  </td>
	                  <td>
	                    <v-text-field v-show="hideptp_daTherapy" v-model="therapy2" type="string" label="Therapy"></v-text-field>
	                  </td>
	                  <td>
	                    <v-text-field v-show="hideptp_daConfidence" v-model="confidence2" type="number" label="Confidence"></v-text-field>
	                  </td>
	                  <td>
	                    <v-text-field v-show="hideptp_daReferences" v-model="reference2" type="string" label="Reference"></v-text-field>
	                  </td>
	                </tr>
	                <tr>
	                  <th data-html2canvas-ignore="true">
	                    <label class="form-checkbox">
	                      <input type="checkbox" v-model="selectAll" @click="select(ptp_da)">
	                      <i class="form-icon"></i>
	                    </label>
	                  </th>
	                  <th @click="sortPtpda('Gene')">Gene <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirGene2 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                  <th v-show="hideptp_daStatus" @click="sortPtpda('Status')">Status <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirStat2 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                  <th v-show="hideptp_daTherapy" @click="sortPtpda('Therapy')">Therapy <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirTherapy2 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                  <th v-show="hideptp_daConfidence" @click="sortPtpda('Confidence')">Confidence <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirConf2 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                  <th v-show="hideptp_daReferences" @click="sortPtpda('References')">Reference <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirRef2 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                </tr>
	              </thead>
	              <tbody>
	                <tr v-for="(item, index) in sortedPtpda" :key="item.Gene" v-if="index < startRowPtpda + rowsPerPagePtpda && index >= startRowPtpda ">
	                  <td class="text-xs-center" data-html2canvas-ignore="true">      
	                    <label class="form-checkbox">
	                        <input type="checkbox" :value="item.Gene" v-model="checkedGenes">
	                        <i class="form-icon"></i>
	                    </label>
	                  </td>
	                  <td @click="selectItem(item)" :class="{'first': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 0, 'second': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 1,'third': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 2, 'fourth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 3, 'fifth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 4} ">
	                    {{ item.Gene }}
	                  </td>
	                  <td v-show="hideptp_daStatus" @click="selectItem(item)" :class="{'first': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 0, 'second': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 1,'third': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 2, 'fourth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 3, 'fifth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 4}" class=text-xs-right>
	                    {{ item.Status }}
	                  </td>
	                  <td v-show="hideptp_daTherapy" @click="selectItem(item)" :class="{'first': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 0, 'second': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 1,'third': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 2, 'fourth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 3, 'fifth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 4}" class=text-xs-right>
	                    {{ item.Therapy}}
	                  </td>
	                  <td v-show="hideptp_daConfidence" @click="selectItem(item)" :class="{'first': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 0, 'second': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 1,'third': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 2, 'fourth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 3, 'fifth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 4}" class=text-xs-right>
	                    {{ item.Confidence }}
	                  </td>
	                  <td v-show="hideptp_daReferences" @click="selectItem(item)" :class="{'first': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 0, 'second': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 1,'third': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 2, 'fourth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 3, 'fifth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 4}" class=text-xs-right>
	                    {{ item.References }}
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
	            <template v-slot:footer>
	              <div>
	                Confidence shows the number of driver gene sources that includes the gene. The sources are Vogelstein et al., Rubio-Perez et al., TSGene DB, COSMIC DB, UniProt.
	              </div>
	            </template>
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
	        <Strong>Somatic Mutations in Pharmaceutical Target Affected Genes</Strong><b-icon data-html2canvas-ignore="true" class="float-right"icon="arrows-expand" v-if="visibleAffect"></b-icon> <b-icon class="float-right" icon="arrows-collapse" v-else></b-icon>
	        </b-button>
	        <br>
	        <b-collapse id="collapse-4" v-model="visibleAffect" class="mt-2">
	          <p></p>
	          <div ref = "content_ptpia" id="ptpia_content">
	            <!-- <br> -->
	            <b-button
	              :class="visibleAffectCivic ? null : 'collapsed'"
	              :aria-expanded="visibleAffectCivic ? 'true' : 'false'"
	              aria-controls="collapse-4"
	              @click="visibleAffectCivic = !visibleAffectCivic"
	              @mouseover="activeCivic = true" @mouseleave="activeCivic = false"
	              v-bind:style="{ color:'white' }"
	              block variant="primary"
	              >
	              <Strong>CIViC Summary of Drugs Targeting Affected Genes</Strong><b-icon data-html2canvas-ignore="true" icon="info-circle" style="margin-left: 10px"></b-icon> <b-icon data-html2canvas-ignore="true" class="float-right"icon="arrows-expand" v-if="visibleAffectCivic"></b-icon> <b-icon class="float-right" icon="arrows-collapse" v-else></b-icon>
	            </b-button>
	            <p  v-show="activeCivic">Therapies that have evidence of targeting the affected gene. The information is obtained from CIViC database. CIViC evidence levels are given in Evidence column. Results are filtered according to cancer type, if it is provided in metadata.</p>
	            <b-collapse id="collapse-4" v-model="visibleAffectCivic" class="mt-2">
	              <div data-html2canvas-ignore="true">
	                <input type="checkbox" id="checkbox5" v-model="hideptp_iaMutation">
	                  <label for="checkbox5">Mutation</label>
	                <input type="checkbox" id="checkbox6" v-model="hideptp_iaTherapy">
	                  <label for="checkbox6">Therapy</label>
	                <input type="checkbox" id="checkbox7" v-model="hideptp_iaEffect">
	                  <label for="checkbox7">Effect</label>
	                <input type="checkbox" id="checkbox7" v-model="hideptp_iaDisease">
	                  <label for="checkbox7">Disease</label>
	                <input type="checkbox" id="checkbox7" v-model="hideptp_iaEvidence">
	                  <label for="checkbox7">Evidence</label>
	                <input type="checkbox" id="checkbox8" v-model="hideptp_iaReferences">
	                  <label for="checkbox8">References</label>
	                <button class="downloadbutn float-right " @click="exportToPDF_ptpia()"><b-icon class="float-left" icon="download" style="margin-right: 3px" data-html2canvas-ignore="true"></b-icon> PDF</button>
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
	                        <v-text-field v-show="hideptp_iaMutation" v-model="mutations3" type="string" label="Mutation"></v-text-field>
	                      </td>
	                      <td>
	                        <v-text-field v-show="hideptp_iaTherapy" v-model="therapy3" type="string" label="Therapy"></v-text-field>
	                      </td>
	                      <td>
	                        <v-text-field v-show="hideptp_iaEffect" v-model="effect3" type="string" label="Effect"></v-text-field>
	                      </td>
	                      <td>
	                        <v-text-field v-show="hideptp_iaDisease" v-model="disease3" type="string" label="Disease"></v-text-field>
	                      </td>
	                      <td>
	                        <v-text-field v-show="hideptp_iaEvidence" v-model="evidence3" type="string" label="Evidence"></v-text-field>
	                      </td>
	                      <td>
	                        <v-text-field v-show="hideptp_iaReferences" v-model="reference3" type="string" label="Reference"></v-text-field>
	                      </td>
	                    </tr>
	                    <tr>
	                      <th data-html2canvas-ignore="true">
	                        <label class="form-checkbox">
	                          <input type="checkbox" v-model="selectAll" @click="select(ptp_ia)">
	                          <i class="form-icon"></i>
	                        </label>
	                      </th>
	                      <th @click="sortPtpia('Gene')">Gene <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirGene3 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hideptp_iaMutation" @click="sortPtpia('Mutation')">Mutation <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirMut3 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hideptp_iaTherapy" @click="sortPtpia('Therapy')">Therapy<b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirTherapy3 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hideptp_iaEffect" @click="sortPtpia('Effect')">Effect <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirEffect3 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hideptp_iaDisease" @click="sortPtpia('Disease')">Disease <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirDisease3 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hideptp_iaEvidence" @click="sortPtpia('Evidence')">Evidence <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirEvidence3 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hideptp_iaReferences" @click="sortPtpia('References')">Reference <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirRef3 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                    </tr>
	                  </thead>
	                  <tbody>
	                    <tr v-for="(item, index) in sortedPtpia" :key="item.Gene" v-if="index < startRowPtpia + rowsPerPagePtpia && index >= startRowPtpia ">
	                      <td class="text-xs-center" data-html2canvas-ignore="true">      
	                        <label class="form-checkbox">
	                            <input type="checkbox" :value="item.Gene" v-model="checkedGenes">
	                            <i class="form-icon"></i>
	                        </label>
	                      </td>
	                      <td @click="selectItem(item)" :class="{'first': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 0, 'second': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 1,'third': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 2, 'fourth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 3, 'fifth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 4} ">
	                        {{ item.Gene }}
	                      </td>
	                      <td v-show="hideptp_iaMutation" @click="selectItem(item)" :class="{'first': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 0, 'second': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 1,'third': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 2, 'fourth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 3, 'fifth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 4}" class=text-xs-right>
	                        {{ item.Mutation }}
	                      </td>
	                      <td v-show="hideptp_iaTherapy" @click="selectItem(item)" :class="{'first': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 0, 'second': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 1,'third': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 2, 'fourth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 3, 'fifth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 4}" class=text-xs-right>
	                        {{ item.Therapy }}
	                      </td>
	                      <td v-show="hideptp_iaEffect" @click="selectItem(item)" :class="{'first': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 0, 'second': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 1,'third': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 2, 'fourth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 3, 'fifth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 4}" class=text-xs-right>
	                        {{ item.Effect }}
	                      </td>
	                      <td v-show="hideptp_iaDisease" @click="selectItem(item)" :class="{'first': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 0, 'second': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 1,'third': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 2, 'fourth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 3, 'fifth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 4}" class=text-xs-right>
	                        {{ item.Disease}}
	                      </td>
	                      <td v-show="hideptp_iaEvidence" @click="selectItem(item)" :class="{'first': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 0, 'second': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 1,'third': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 2, 'fourth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 3, 'fifth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 4}" class=text-xs-right>
	                        {{ item.Evidence }}
	                      </td>
	                      <td v-show="hideptp_iaReferences" @click="selectItem(item)" :class="{'first': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 0, 'second': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 1,'third': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 2, 'fourth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 3, 'fifth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 4}" class=text-xs-right>
	                        {{ item.References }}
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
	               <template v-slot:footer>
	                <div>
	                  CIViC evidence levels are used. A = Validated association, B = Clinical evidence, C = Case study, D = Preclinical evidence, E = Inferential association.
	                </div>
	              </template>
	            </b-card>
	          </b-collapse>
	        </div>

	        <p></p>
	       	<div ref = "content_mskpe" id="mskpe_content">
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
	            <Strong>Summary of Cancer Drugs Targeting Affected Genes</Strong><b-icon data-html2canvas-ignore="true" icon="info-circle" style="margin-left: 10px"></b-icon> <b-icon class="float-right"icon="arrows-expand" v-if="visibleAffectCancer"></b-icon> <b-icon class="float-right" icon="arrows-collapse" v-else></b-icon>
	          </b-button>
	          <p  v-show="activeSum">List of cancer drugs targeting the mutated gene. Information is obtained from DrugBank, Therapeutic Target Database, IUPHAR, and Santos et al.</p>
	          <b-collapse id="collapse-4" v-model="visibleAffectCancer" class="mt-2">
	            <div data-html2canvas-ignore="true">
	              <input type="checkbox" id="checkbox9" v-model="hidemskpeMutation">
	                  <label for="checkbox9">Mutation</label>
	                <input type="checkbox" id="checkbox10" v-model="hidemskpeTherapy">
	                  <label for="checkbox10">Therapy</label>
	                <input type="checkbox" id="checkbox11" v-model="hidemskpeEffect">
	                  <label for="checkbox11">Effect</label>
	                <input type="checkbox" id="checkbox12" v-model="hidemskpeDisease">
	                  <label for="checkbox12">Disease</label>
	                <input type="checkbox" id="checkbox13" v-model="hidemskpeEvidence">
	                  <label for="checkbox13">Evidence</label>
	                <input type="checkbox" id="checkbox14" v-model="hidemskpeReferences">
	                  <label for="checkbox14">References</label>
	                <button class="downloadbutn float-right " @click="exportToPDF_mskpe()"><b-icon class="float-left" icon="download" style="margin-right: 3px" data-html2canvas-ignore="true"></b-icon> PDF</button>
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
	                        <v-text-field v-show="hidemskpeMutation" v-model="mutations4" type="string" label="Mutation"></v-text-field>
	                      </td>
	                      <td>
	                        <v-text-field v-show="hidemskpeTherapy" v-model="therapy4" type="string" label="Therapy"></v-text-field>
	                      </td>
	                      <td>
	                        <v-text-field v-show="hidemskpeEffect" v-model="effect4" type="string" label="Effect"></v-text-field>
	                      </td>
	                      <td>
	                        <v-text-field v-show="hidemskpeDisease" v-model="disease4" type="string" label="Disease"></v-text-field>
	                      </td>
	                      <td>
	                        <v-text-field v-show="hidemskpeEvidence" v-model="evidence4" type="string" label="Evidence"></v-text-field>
	                      </td>
	                      <td>
	                        <v-text-field v-show="hidemskpeReferences" v-model="reference4" type="string" label="Reference"></v-text-field>
	                      </td>
	                    </tr>
	                    <tr>
	                      <th data-html2canvas-ignore="true">
	                        <label class="form-checkbox">
	                          <input type="checkbox" v-model="selectAll" @click="select(mskpe)">
	                          <i class="form-icon"></i>
	                        </label>
	                      </th>
	                      <th @click="sortMskpe('Gene')">Gene <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirGene4 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hidemskpeMutation" @click="sortMskpe('Mutation')">Mutation <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirMut4 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hidemskpeTherapy" @click="sortMskpe('Therapy')">Therapy<b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirTherapy4 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hidemskpeEffect" @click="sortMskpe('Effect')">Effect <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirEffect4 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hidemskpeDisease" @click="sortMskpe('Disease')">Disease <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirDisease4 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hidemskpeEvidence" @click="sortMskpe('Evidence')">Evidence <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirEvidence4 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hidemskpeReferences" @click="sortMskpe('References')">Reference <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirRef4 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                    </tr>
	                  </thead>
	                  <tbody>
	                    <tr v-for="(item, index) in sortedMskpe" :key="item.Gene" v-if="index < startRowMskpe + rowsPerPageMskpe && index >= startRowMskpe ">
	                      <td class="text-xs-center" data-html2canvas-ignore="true">      
	                        <label class="form-checkbox">
	                            <input type="checkbox" :value="item.Gene" v-model="checkedGenes">
	                            <i class="form-icon"></i>
	                        </label>
	                      </td>
	                      <td @click="selectItem(item)" :class="{'first': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 0, 'second': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 1,'third': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 2, 'fourth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 3, 'fifth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 4} ">
	                        {{ item.Gene }}
	                      </td>
	                      <td v-show="hidemskpeMutation" @click="selectItem(item)" :class="{'first': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 0, 'second': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 1,'third': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 2, 'fourth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 3, 'fifth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 4}" class=text-xs-right>
	                        {{ item.Mutation }}
	                      </td>
	                      <td v-show="hidemskpeTherapy" @click="selectItem(item)" :class="{'first': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 0, 'second': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 1,'third': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 2, 'fourth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 3, 'fifth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 4}" class=text-xs-right>
	                        {{ item.Therapy }}
	                      </td>
	                      <td v-show="hidemskpeEffect" @click="selectItem(item)" :class="{'first': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 0, 'second': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 1,'third': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 2, 'fourth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 3, 'fifth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 4}" class=text-xs-right>
	                        {{ item.Effect }}
	                      </td>
	                      <td v-show="hidemskpeDisease" @click="selectItem(item)" :class="{'first': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 0, 'second': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 1,'third': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 2, 'fourth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 3, 'fifth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 4}" class=text-xs-right>
	                        {{ item.Disease}}
	                      </td>
	                      <td v-show="hidemskpeEvidence" @click="selectItem(item)" :class="{'first': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 0, 'second': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 1,'third': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 2, 'fourth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 3, 'fifth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 4}" class=text-xs-right>
	                        {{ item.Evidence }}
	                      </td>
	                      <td v-show="hidemskpeReferences" @click="selectItem(item)" :class="{'first': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 0, 'second': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 1,'third': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 2, 'fourth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 3, 'fifth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 4}" class=text-xs-right>
	                        {{ item.References }}
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
	               <template v-slot:footer>
	                <div>
	                  CIViC evidence levels are used. A = Validated association, B = Clinical evidence, C = Case study, D = Preclinical evidence, E = Inferential association.
	                </div>
	              </template>
	          </b-card>
	          </b-collapse>
	        </div>
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
	        <Strong>References</Strong><b-icon class="float-right"icon="arrows-expand" v-if="visibleRef"></b-icon> <b-icon class="float-right"icon="arrows-collapse" v-else></b-icon>
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
	            :items="ref"
	            item-key="rowid"
	            multi-sort
	            :items-per-page="-1"
	            class="elevation-1"
	            ref="refTable"
	          >
	            <template v-slot:item.url ="{ item }">
	                <td class="text-xs-right"><a :href="'https://www.ncbi.nlm.nih.gov/pubmed/?term='+[item.citation.split('et al')[0],item.citation.split('.')[1].split(',')[1].trim().split(' ').join('+'), item.citation.split(',').slice(-1)[0]].join('+')" target="_blank">PubMed</a></td> 
	            </template>
	          </v-data-table>    
	        </b-card>
	      </b-collapse>
	    </div>
	    <br>
	    <br>

	    <div ref="content_appendix" id="appendix_content">
	      <b-button
	        :class="visibleAppendix ? null : 'collapsed'"
	        :aria-expanded="visibleAppendix ? 'true' : 'false'"
	        aria-controls="collapse-4"
	        @click="visibleAppendix = !visibleAppendix"
	        class="text-center" 
	        v-bind:style="{ background: 'grey', color:'white' }" 
	        block variant="primary"
	        >
	        <Strong>Appendix</Strong><b-icon class="float-right"icon="arrows-expand" v-if="visibleAppendix"></b-icon> <b-icon class="float-right" icon="arrows-collapse" v-else></b-icon>
	      </b-button>
	      <b-collapse id="collapse-4" v-model="visibleAppendix" class="mt-2">
	        <div data-html2canvas-ignore="true">
	          <input type="checkbox" id="checkbox15" v-model="hideappendixMutation">
	            <label for="checkbox15">Mutation</label>
	          <input type="checkbox" id="checkbox16" v-model="hideappendixdbSNP">
	            <label for="checkbox16">dbSNP</label>
	          <input type="checkbox" id="checkbox17" v-model="hideappendixCosmic">
	            <label for="checkbox17">COSMIC</label>
	          <button class="downloadbutn float-right " @click="exportToPDF_appendix()"><b-icon class="float-left" icon="download" style="margin-right: 3px" data-html2canvas-ignore="true"></b-icon> PDF</button>
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
	                        <v-text-field v-show="hideappendixMutation" v-model="mutations5" type="string" label="Mutation"></v-text-field>
	                      </td>
	                      <td>
	                        <v-text-field v-show="hideappendixdbSNP" v-model="dbSNP5" type="string" label="dbSNP"></v-text-field>
	                      </td>
	                      <td>
	                        <v-text-field v-show="hideappendixCosmic" v-model="cosmic5" type="string" label="COSMIC"></v-text-field>
	                      </td>
	                    </tr>
	                    <tr>
	                      <th data-html2canvas-ignore="true">
	                        <label class="form-checkbox">
	                          <input type="checkbox" v-model="selectAll" @click="select(appendix)">
	                          <i class="form-icon"></i>
	                        </label>
	                      </th>
	                      <th @click="sortAppendix('Gene')">Gene <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirGene5 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hideappendixMutation" @click="sortAppendix('Mutation')">Mutation <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirMut5 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hideappendixdbSNP" @click="sortAppendix('dbSNP')">dbSNP<b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirdbSNP5 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                      <th v-show="hideappendixCosmic" @click="sortAppendix('COSMIC')">COSMIC <b-icon data-html2canvas-ignore="true" class="float-right" icon="arrow-down-short" v-if="currentSortDirCosmic5 == 'asc'"></b-icon> <b-icon class="float-right" icon="arrow-up-short" v-else></b-icon></th>
	                    </tr>
	                  </thead>
	                  <tbody>
	                    <tr v-for="(item, index) in sortedAppendix" :key="item.Gene" v-if="index < startRowAppendix + rowsPerPageAppendix && index >= startRowAppendix ">
	                      <td class="text-xs-center" data-html2canvas-ignore="true">      
	                        <label class="form-checkbox">
	                            <input type="checkbox" :value="item.Gene" v-model="checkedGenes">
	                            <i class="form-icon"></i>
	                        </label>
	                      </td>
	                      <td @click="selectItem(item)" :class="{'first': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 0, 'second': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 1,'third': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 2, 'fourth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 3, 'fifth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 4} ">
	                        {{ item.Gene }}
	                      </td>
	                      <td v-show="hideappendixMutation" @click="selectItem(item)" :class="{'first': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 0, 'second': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 1,'third': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 2, 'fourth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 3, 'fifth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 4}" class=text-xs-right>
	                        {{ item.Mutation }}
	                      </td>
	                      <td v-show="hideappendixdbSNP" @click="selectItem(item)" :class="{'first': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 0, 'second': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 1,'third': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 2, 'fourth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 3, 'fifth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 4}" class=text-xs-right>
	                        {{ item.dbSNP }}
	                      </td>
	                      <td v-show="hideappendixCosmic" @click="selectItem(item)" :class="{'first': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 0, 'second': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 1,'third': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 2, 'fourth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 3, 'fifth': selected.includes(item.Gene) && selected.indexOf(item.Gene) == 4}" class=text-xs-right>
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

        startRowAppendix: 0,
        currentPageAppendix: 1,
        rowsPerPageAppendix: 10,

        visibleDrivers: true,
        visiblePharma: true,
        visibleAffect: true,
        visibleAffectCivic: false,
        visibleAffectCancer: false,
        visibleRef: false,
        visibleAppendix: false,
        activeDrivers: false,
        activePharma: false,
        activeCivic:false,
        activeSum: false,
        showTable:false,
        showStatus:true,
        showFileLoad:true,
        mskdg: [],
        ptp_da: [],
        ptp_ia: [],
        mskpe: [],
        ref: [],
        refHeaders: [
            {text: 'Id',
             align:'left',
             sortable: false,
             value: 'rowid'},
            {text: 'Citation', value: 'citation'},
            {text: 'url', value: 'url'},
        ],
        appendix: [],

        genesall:'',
        therapyall:'',
        diseaseall:'',
        confidenceall:'',

        genes1:'',
        mutations1:'',
        type1:'',
        confidence1:'',
        reference1:'',

        genes2:'',
        status2:'',
        therapy2:'',
        confidence2:'',
        reference2:'',

        genes3:'',
        mutations3:'',
        therapy3:'',
        evidence3:'',
        disease3:'',
        reference3:'',
        effect3:'',

        genes4:'',
        mutations4:'',
        therapy4:'',
        evidence4:'',
        disease4:'',
        reference4:'',
        effect4:'',

        search5: '',
      
        genes5:'',
        mutations5:'',
        dbSNP5:'',
        cosmic5:'',

        selected: [],
        checkedGenes:[],
        selectAll:false,
        hideColumns:true,
        hidemskdgMutation:true,
        hidemskdgType:true,
        hidemskdgConfidence:true,
        hidemskdgReferences:true,
        hideptp_daStatus:true,
        hideptp_daTherapy:true,
        hideptp_daConfidence:true,
        hideptp_daReferences:true,
        hideptp_iaMutation:true,
        hideptp_iaEffect:true,
        hideptp_iaDisease:true,
        hideptp_iaEvidence:true,
        hideptp_iaReferences:true,
        hideptp_iaTherapy:true,
        hidemskpeMutation:true,
        hidemskpeEffect:true,
        hidemskpeDisease:true,
        hidemskpeEvidence:true,
        hidemskpeReferences:true,
        hidemskpeTherapy:true,
        hideappendixMutation:true,
        hideappendixdbSNP:true,
        hideappendixCosmic:true,

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
    		this.mskdg= jsonfile.mskdg;
	        this.ptp_da = jsonfile.ptp_da;
	        this.ptp_ia = jsonfile.ptp_ia;
	        this.mskpe = jsonfile.mskpe;
	        this.ref = jsonfile.ref;
	        this.appendix = jsonfile.appendix;
	    	this.showTable = true;
	    	if(jobid == null){
	    		return
	    	}
	    	// this.getGraphVis();
	    	if(!uuids){
		        var drivergenes = axios.get('clinvap/results/'+username+'_'+jobid.split(".")[0] + ".json"+'/tables/driver-genes')
		    		.then(res => {return res.data})
		    	drivergenes.then(res => { 
		    		let result = res.map(a => a.Gene); 
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
	        this.visibleAffect = true;
	        this.visibleRef = true;
	        this.visibleAppendix = true;
	        this.activeDrivers = true;
	        this.activePharma = true;
	        this.activeCivic = true;
	        this.activeSum = true;
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
	           }).from(self.$refs.content_mskdg).toPdf().get('pdf').then(function (pdf) {
	            pdf.addPage();
	          }).from(self.$refs.content_ptpda).toContainer().toCanvas().toPdf().get('pdf').then(function (pdf) {
	              pdf.addPage();
	          }).from(self.$refs.content_smptag).toContainer().toCanvas().toPdf().get('pdf').then(function (pdf) {
	              pdf.addPage();
	          // }).from(self.$refs.content_ptpia).toContainer().toCanvas().toPdf().get('pdf').then(function (pdf) {
	          //     pdf.addPage();
	          }).from(self.$refs.content_ref).toContainer().toCanvas().toPdf().get('pdf').then(function (pdf) {
	              pdf.addPage();
	          }).from(self.$refs.content_appendix).toContainer().toCanvas().toPdf().save();
	        },1);
	    },
	    exportToPDF_mskdg() {
	        this.activeDrivers = true;
	        var self = this;
	        setTimeout(function(){
	          window.scrollTo(0,0);
	          html2pdf(self.$refs.content_mskdg, {
	            margin: 0.5,
	            filename: 'mskdg.pdf',
	            image: { type: 'jpeg', quality: 0.98 },
	            html2canvas: {},
	            pagebreak: { mode: ['legacy'] },
	            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape'}
	           });
	        }, 1);
	      },
	      exportToPDF_ptpda() {
	        this.visibleDrivers = false;
	        this.activePharma = true;
	        var self = this;
	        setTimeout(function(){
	          window.scrollTo(0,0);
	          html2pdf(self.$refs.content_ptpda, {
	            margin: 0.5,
	            filename: 'ptpda.pdf',
	            image: { type: 'jpeg', quality: 0.98 },
	            html2canvas: { },
	            pagebreak: { mode: ['legacy'] },
	            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape'}
	           })
	        }, 1);
	    },
	    exportToPDF_ptpia() {
	        this.visibleDrivers = false;
	        this.visiblePharma = false;
	        this.activeCivic = true;
	        var self = this;
	        setTimeout(function(){
	          window.scrollTo(0,0);
	          html2pdf(self.$refs.content_ptpia, {
	            margin: 0.45,
	            filename: 'ptpia.pdf',
	            image: { type: 'jpeg', quality: 0.98 },
	            html2canvas: { },
	            pagebreak: { mode:['legacy']},
	            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape'}
	           })
	        }, 1);
	    },
	    exportToPDF_mskpe() {
	        this.visibleDrivers = false;
	        this.visiblePharma = false;
	        this.visibleAffectCivic = false;
	        this.activeSum = true;
	        var self = this;
	        setTimeout(function(){
	          window.scrollTo(0,0);
	          html2pdf(self.$refs.content_mskpe, {
	            margin: 0.2,
	            filename: 'mskpe.pdf',
	            image: { type: 'jpeg', quality: 0.98 },
	            html2canvas: { },
	            pagebreak: { mode: ['legacy'] },
	            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape'}
	           })
	        }, 1);
	    },
	    exportToPDF_ref() {
	        this.visibleDrivers = false;
	        this.visiblePharma = false;
	        this.visibleAffectCivic = false;
	        this.visibleAffectCancer = false;
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
	    exportToPDF_appendix() {
	        this.visibleDrivers = false;
	        this.visiblePharma = false;
	        this.visibleAffectCivic = false;
	        this.visibleAffectCancer = false;
	        this.visibleRef = false;
	        var self = this;
	        setTimeout(function(){
	          window.scrollTo(0,0);
	          html2pdf(self.$refs.content_appendix, {
	            margin: 0.5,
	            filename: 'appendix.pdf',
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
	        if(this.selected.includes(item.Gene)){
	          this.selected.splice(this.selected.indexOf(item.Gene),1)
	        }
	        else if(this.selected.length < 5 && !this.selected.includes(item.Gene)){
	          this.selected.push(item.Gene)
	        }
	    },
	    select(data) {
	        this.checkedGenes = [];
	        if (!this.selectAll) {
	          for (let i in data) {
	            this.checkedGenes.push(data[i].Gene);
	          }
	        }
	    },
	    sortMskdg:function(s) {
	        //if s == current sort, reverse
	        if(s === "Gene") {
	          this.currentSortDirGene1 = this.currentSortDirGene1==='asc'?'desc':'asc';
	          this.currentSortDir = this.currentSortDirGene1;
	        }
	        else if(s === "Mutation") {
	          this.currentSortDirMut1 = this.currentSortDirMut1==='asc'?'desc':'asc';
	          this.currentSortDir = this.currentSortDirMut1;
	        }
	        else if(s === "Type") {
	          this.currentSortDirType1 = this.currentSortDirType1==='asc'?'desc':'asc';
	          this.currentSortDir = this.currentSortDirType1;
	        }
	        else if(s === "Confidence") {
	          this.currentSortDirConf1 = this.currentSortDirConf1==='asc'?'desc':'asc';
	          this.currentSortDir = this.currentSortDirConf1;
	        }
	        else if(s === "References") {
	          this.currentSortDirRef1 = this.currentSortDirRef1==='asc'?'desc':'asc';
	          this.currentSortDir = this.currentSortDirRef1;
	        }
	        this.currentSort = s;
	    },
	    sortPtpda:function(s) {
	        //if s == current sort, reverse
	        if(s === "Gene") {
	          this.currentSortDirGene2 = this.currentSortDirGene2==='asc'?'desc':'asc';
	          this.currentSortDirPtpda = this.currentSortDirGene2;
	        }
	        else if(s === "Status") {
	          this.currentSortDirStat2 = this.currentSortDirStat2==='asc'?'desc':'asc';
	          this.currentSortDirPtpda = this.currentSortDirStat2;
	        }
	        else if(s === "Therapy") {
	          this.currentSortDirTherapy2 = this.currentSortDirTherapy2==='asc'?'desc':'asc';
	          this.currentSortDirPtpda = this.currentSortDirTherapy2;
	        }
	        else if(s === "Confidence") {
	          this.currentSortDirConf2 = this.currentSortDirConf2==='asc'?'desc':'asc';
	          this.currentSortDirPtpda = this.currentSortDirConf2;
	        }
	        else if(s === "References") {
	          this.currentSortDirRef2 = this.currentSortDirRef2==='asc'?'desc':'asc';
	          this.currentSortDirPtpda = this.currentSortDirRef2;
	        }
	        this.currentSortPtpda = s;
	      },
	      sortPtpia:function(s) {
	        //if s == current sort, reverse
	        if(s === "Gene") {
	          this.currentSortDirGene3 = this.currentSortDirGene3==='asc'?'desc':'asc';
	          this.currentSortDirPtpia = this.currentSortDirGene3;
	        }
	        else if(s === "Mutation") {
	          this.currentSortDirMut3 = this.currentSortDirMut3==='asc'?'desc':'asc';
	          this.currentSortDirPtpia = this.currentSortDirMut3;
	        }
	        else if(s === "Therapy") {
	          this.currentSortDirTherapy3 = this.currentSortDirTherapy3==='asc'?'desc':'asc';
	          this.currentSortDirPtpia = this.currentSortDirTherapy3;
	        }
	        else if(s === "Effect") {
	          this.currentSortDirEffect3 = this.currentSortDirEffect3==='asc'?'desc':'asc';
	          this.currentSortDirPtpia = this.currentSortDirEffect3;
	        }
	        else if(s === "Evidence") {
	          this.currentSortDirEvidence3 = this.currentSortDirEvidence3==='asc'?'desc':'asc';
	          this.currentSortDirPtpia = this.currentSortDirEvidence3;
	        }
	        else if(s === "Disease") {
	          this.currentSortDirDisease3 = this.currentSortDirDisease3==='asc'?'desc':'asc';
	          this.currentSortDirPtpia = this.currentSortDirDisease3;
	        }
	        else if(s === "References") {
	          this.currentSortDirRef3 = this.currentSortDirRef3==='asc'?'desc':'asc';
	          this.currentSortDirPtpia = this.currentSortDirRef3;
	        }
	        this.currentSortPtpia = s;
	      },
	      sortMskpe:function(s) {
	        //if s == current sort, reverse
	        if(s === "Gene") {
	          this.currentSortDirGene4 = this.currentSortDirGene4==='asc'?'desc':'asc';
	          this.currentSortDirMskpe = this.currentSortDirGene4;
	        }
	        else if(s === "Mutation") {
	          this.currentSortDirMut4 = this.currentSortDirMut4==='asc'?'desc':'asc';
	          this.currentSortDirMskpe = this.currentSortDirMut4;
	        }
	        else if(s === "Therapy") {
	          this.currentSortDirTherapy4 = this.currentSortDirTherapy4==='asc'?'desc':'asc';
	          this.currentSortDirMskpe = this.currentSortDirTherapy4;
	        }
	        else if(s === "Effect") {
	          this.currentSortDirEffect4 = this.currentSortDirEffect4==='asc'?'desc':'asc';
	          this.currentSortDirMskpe = this.currentSortDirEffect4;
	        }
	        else if(s === "Evidence") {
	          this.currentSortDirEvidence4 = this.currentSortDirEvidence4==='asc'?'desc':'asc';
	          this.currentSortDirMskpe = this.currentSortDirEvidence4;
	        }
	        else if(s === "Disease") {
	          this.currentSortDirDisease4 = this.currentSortDirDisease4==='asc'?'desc':'asc';
	          this.currentSortDirMskpe = this.currentSortDirDisease4;
	        }
	        else if(s === "References") {
	          this.currentSortDirRef4 = this.currentSortDirRef4==='asc'?'desc':'asc';
	          this.currentSortDirMskpe = this.currentSortDirRef4;
	        }
	        this.currentSortMskpe = s;
	      },
	      sortAppendix:function(s) {
	        //if s == current sort, reverse
	        if(s === "Gene") {
	          this.currentSortDirGene5 = this.currentSortDirGene5==='asc'?'desc':'asc';
	          this.currentSortDirAppendix = this.currentSortDirGene5;
	        }
	        else if(s === "Mutation") {
	          this.currentSortDirMut5 = this.currentSortDirMut5==='asc'?'desc':'asc';
	          this.currentSortDirAppendix = this.currentSortDirMut5;
	        }
	        else if(s === "dbSNP") {
	          this.currentSortDirdbSNP5 = this.currentSortDirdbSNP5==='asc'?'desc':'asc';
	          this.currentSortDirAppendix = this.currentSortDirdbSNP5;
	        }
	        else if(s === "COSMIC") {
	          this.currentSortDirCosmic5 = this.currentSortDirCosmic5==='asc'?'desc':'asc';
	          this.currentSortDirAppendix = this.currentSortDirCosmic5;
	        }
	        this.currentSortAppendix = s;
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
	        var sorted = this.mskdg.sort((a,b) => {
	          let modifier = 1;
	          if(this.currentSortDir === 'desc') modifier = -1;
	          if(a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
	          if(a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
	          return 0;
	        });
	        var filtered_sorted = []
	        for(var item of sorted){
	          if((item.Gene.toLowerCase().includes(this.genes1.toLowerCase()) || this.genes1 == '') && 
	                (item.Mutation.toLowerCase().includes(this.mutations1.toLowerCase()) || this.mutations1 == '') && 
	                (this.type1 == '' || item.Type.toLowerCase().includes(this.type1.toLowerCase())) && 
	                (this.confidence1 == '' || item.Confidence == this.confidence1) && 
	                (this.reference1 == '' || item.References.includes(this.reference1)) &&
	                (item.Gene.toLowerCase().includes(this.genesall.toLowerCase()) || this.genesall == '')&&
	                (this.confidenceall == '' || item.Confidence == this.confidenceall)){
	            filtered_sorted.push(item)
	          }
	        }
	        return filtered_sorted
	    },
	    sortedPtpda:function() {
	        var sorted = this.ptp_da.sort((a,b) => {
	          let modifier = 1;
	          if(this.currentSortDirPtpda === 'desc') modifier = -1;
	          if(a[this.currentSortPtpda] < b[this.currentSortPtpda]) return -1 * modifier;
	          if(a[this.currentSortPtpda] > b[this.currentSortPtpda]) return 1 * modifier;
	          return 0;
	        });
	        var filtered_sorted = [];
	        for(var item of sorted){
	          if((item.Gene.toLowerCase().includes(this.genes2.toLowerCase()) || this.genes2 == '') && 
	                (item.Status.toLowerCase().includes(this.status2.toLowerCase()) || this.status2 == '') && 
	                (this.therapy2 == '' || item.Therapy.toLowerCase().includes(this.therapy2.toLowerCase())) && 
	                (this.confidence2 == '' || item.Confidence == this.confidence2) && 
	                (this.reference2 == '' || item.References.includes(this.reference2))&&
	                (item.Gene.toLowerCase().includes(this.genesall.toLowerCase()) || this.genesall == '')&&
	                (this.confidenceall == '' || item.Confidence == this.confidenceall) &&
	                (this.therapyall == '' || item.Therapy.toLowerCase().includes(this.therapyall.toLowerCase()))){
	            filtered_sorted.push(item)
	          }
	        }
	        return filtered_sorted;
	    },
	    sortedPtpia:function() {
	        var sorted = this.ptp_ia.sort((a,b) => {
	          let modifier = 1;
	          if(this.currentSortDirPtpia === 'desc') modifier = -1;
	          if(a[this.currentSortPtpia] < b[this.currentSortPtpia]) return -1 * modifier;
	          if(a[this.currentSortPtpia] > b[this.currentSortPtpia]) return 1 * modifier;
	          return 0;
	        });
	        var filtered_sorted = [];
	        for(var item of sorted){
	          if((item.Gene.toLowerCase().includes(this.genes3.toLowerCase()) || this.genes3 == '') && 
	                    (item.Mutation.toLowerCase().includes(this.mutations3.toLowerCase()) || this.mutations3 == '') && 
	                    (this.therapy3 == '' || item.Therapy.toLowerCase().includes(this.therapy3.toLowerCase())) && 
	                    (this.effect3 == '' || item.Effect.toLowerCase().includes(this.effect3.toLowerCase())) && 
	                    (this.disease3 == '' || item.Disease.toLowerCase().includes(this.disease3.toLowerCase())) && 
	                    (this.evidence3 == '' || item.Evidence.toLowerCase() == this.evidence3.toLowerCase()) && 
	                    (this.reference3 == '' || item.References.includes(rthis.eference3))&&
	                    (item.Gene.toLowerCase().includes(this.genesall.toLowerCase()) || this.genesall == '')&&
	                    (this.therapyall == '' || item.Therapy.toLowerCase().includes(this.therapyall.toLowerCase()))&&
	                    (this.diseaseall == '' || item.Disease.toLowerCase().includes(this.diseaseall.toLowerCase()))){
	            filtered_sorted.push(item);
	          }
	        }
	        return filtered_sorted
	    },
	    sortedMskpe:function() {
	        var sorted = this.mskpe.sort((a,b) => {
	          let modifier = 1;
	          if(this.currentSortDirMskpe === 'desc') modifier = -1;
	          if(a[this.currentSortMskpe] < b[this.currentSortMskpe]) return -1 * modifier;
	          if(a[this.currentSortMskpe] > b[this.currentSortMskpe]) return 1 * modifier;
	          return 0;
	        });
	        var filtered_sorted = [];
	        for(var item of sorted){
	          if((item.Gene.toLowerCase().includes(this.genes4.toLowerCase()) || this.genes4 == '') && 
	                    (item.Mutation.toLowerCase().includes(this.mutations4.toLowerCase()) || this.mutations4 == '') && 
	                    (this.therapy4 == '' || item.Therapy.toLowerCase().includes(this.therapy4.toLowerCase())) && 
	                    (this.effect4 == '' || item.Effect.toLowerCase().includes(this.effect4.toLowerCase())) && 
	                    (this.disease4 == '' || item.Disease.toLowerCase().includes(this.disease4.toLowerCase())) && 
	                    (this.evidence4 == '' || item.Evidence.toLowerCase() == this.evidence4.toLowerCase()) && 
	                    (this.reference4 == '' || item.References.includes(this.reference4))&&
	                    (item.Gene.toLowerCase().includes(this.genesall.toLowerCase()) || this.genesall == '')&&
	                    (this.therapyall == '' || item.Therapy.toLowerCase().includes(this.therapyall.toLowerCase()))&&
	                    (this.diseaseall == '' || item.Disease.toLowerCase().includes(this.diseaseall.toLowerCase()))){
	            filtered_sorted.push(item);
	          }
	        }
	        return filtered_sorted
	    },
	   	sortedAppendix:function() {
	        var sorted = this.appendix.sort((a,b) => {
	          let modifier = 1;
	          if(this.currentSortDirAppendix === 'desc') modifier = -1;
	          if(a[this.currentSortAppendix] < b[this.currentSortAppendix]) return -1 * modifier;
	          if(a[this.currentSortAppendix] > b[this.currentSortAppendix]) return 1 * modifier;
	          return 0;
	        });
	        var filtered_sorted = [];
	        for(var item of sorted){
	          if( (item.Gene.toLowerCase().includes(this.genes5.toLowerCase()) || this.genes5 == '') && 
	                      (item.Mutation.toLowerCase().includes(this.mutations5.toLowerCase()) || this.mutations5 == '') && 
	                      (this.dbSNP5 == '' || item.dbSNP.includes(this.dbSNP5)) && 
	                      (this.cosmic5 == '' || item.COSMIC.toLowerCase().includes(this.cosmic5.toLowerCase()))&&
	                      (item.Gene.toLowerCase().includes(this.genesall.toLowerCase()) || this.genesall == '')){
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
