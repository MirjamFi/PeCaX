<script type="text/javascript">
	export default{
	  head: {
	    title: 'Documentation'
	  },
	  head () {
	    return {
	    	link: [,
	        {
	        	rel:"alternate", type:"application/html", title:"PeCaX", href:"/"
	        }
	      ]
	    }
	  }
  }
	
    window.onNuxtReady((app) => {
    // Add active class to the current button (highlight it)
    var header = document.getElementById("nav");
    var btns = header.getElementsByClassName("page-link");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function() {
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
      });
    }
  })
  
</script>

<template>
<div>

<style type="text/css">
 .tab { margin-left: 20px; }
 .tab2 { margin-left: 40px; }
 .tab3 { margin-left: 60px; }
</style>
    <div class="page-content">
      <div class="wrapper">
        <div class="post">
<div class="entry-content">
  <article class="post-content">


<p style="width: 25%;margin-top:40px; float: left">
  <a href="#GeneralDoc" style="color:black; font-weight: 600; font-size: 18px;">General</a><br>
  <a href="#Input" class="tab"style="color:black; font-weight: 600; font-size: 18px;">Input</a><br>
  <a href="#VCF" class="tab2"style="color:black; font-weight: 500; font-size: 16px;">VCF</a><br>
  <a href="#CNV" class="tab3"style="color:black; font-weight: 400; font-size: 14px;">CNV</a><br>
  <a href="#Assembly" class="tab3"style="color:black; font-weight: 400; font-size: 14px;">Assembly</a><br>
  <a href="#Diagnosis" class="tab3"style="color:black; font-weight: 400; font-size: 14px;">Diagnosis</a><br>
  <a href="#DiagnosisFilter" class="tab3"style="color:black; font-weight: 400; font-size: 14px;">Diagnosis Filter</a><br>
  <a href="#JSON" class="tab2"style="color:black; font-weight: 500; font-size: 16px;">JSON</a><br>
  <a href="#JobID" class="tab2"style="color:black; font-weight: 500; font-size: 16px;">Job ID</a><br>
  <a href="#ClinVAP" class="tab"style="color:black; font-weight: 600; font-size: 18px;">ClinVAP</a><br>
  <a href="#Citation" class="tab2"style="color:black; font-weight: 500; font-size: 16px;">Citation</a><br>
  <a href="#ClinVAPReport" class="tab"style="color:black; font-weight: 600; font-size: 18px;">ClinVAP Report</a><br>
  <a href="#SBML4j" class="tab"style="color:black; font-weight: 600; font-size: 18px;">SBML4j</a><br>
  <a href="#BioGraphVisart" class="tab"style="color:black; font-weight: 600; font-size: 18px;">BioGraphVisart</a><br>
  


</p>
 
  <p style="width: 50%; margin-left:25%; font-size:30px;margin-top:40px" id="GeneralDoc">General</p>
  <p style="width: 50%; margin-left:25%">

  Personalized Cancer and Network Explorer (PeCax) is a tool for identifying patient specific cancer mechanisms by providing a complete mutational profile from variants to networks. It employs <a href="#ClinVAP">ClinVAP</a> to perform clinical variant annotation which focuses on processing, filtering and prioritization of the variants to find the disrupted genes that are involved in carcinogenesis and to identify actionable variants from the mutational landscape of a patient. In addition it creates networks showing the connections between the driver genes and the genes in their neighbourhood and automatically performs pathway enrichment analysis using pathway resources (<a href="#SBML4j">SBML4j</a>). Its interactive visualisation (<a href="#BioGraphVisart">BioGraphVisart</a>) supports easy network exploration and patient similarity (node overlap) and a merged network graph of two patient-specific networks can be calculated.
</p>
<hr style="width: 50%; margin-left:25%;">
  <p style="width: 50%; margin-left:25%; font-size:30px;" id="Input">Input</p>
  <p style="width: 50%; margin-left:25%">There are multiple options for input to use PeCaX.</p>
  <p style="width: 50%; margin-left:25%; font-size:20px;" id="VCF">VCF</p>
  <p style="width: 50%; margin-left:25%">
    A mandatory Variant Call Format (VCF) file containing somatic variant (SNV) will be analyzed and annotated with <a href="#ClinVAP">ClinVAP</a>. 
    The results will be structured in a report (.json-format) and displayed in interactive <a href="#ClinVAPReport">tables</a> once the pipeline is finished.
    An example file can be found from here (link).
  </p>
  <p style="width: 50%; margin-left:25%; font-size:20px;" id="CNV">CNV</p>
  <p style="width: 50%; margin-left:25%">
    In addition to the SNV information, CNV information can be annalyzed and annotated. They can be given in an optional .tsv-file. An example file can be found from here (link)
  </p>
  <p style="width: 50%; margin-left:25%; font-size:20px;" id="Assembly">Assembly</p>
  <p style="width: 50%; margin-left:25%">
  The human genome assembly version that was used in the original NGS pipeline while calling the variants needs to be given. The default value is GRCh37.
  </p>
  <p style="width: 50%; margin-left:25%; font-size:20px;" id="Diagnosis">Diagnosis</p>
  <p style="width: 50%; margin-left:25%">
    ClinVAP can analyse the SNV information according to a diagnosis. This should be entered as an ICD10 code. 
  </p>
  <p style="width: 50%; margin-left:25%; font-size:20px;" id="DiagnosisFilter">DiagnosisFilter</p>
  <p style="width: 50%; margin-left:25%">
    This is an optional field only necessary if diagnosis is provided. The default value is sort.

    <ul>
      <li>sort: Option to sort results based on their diagnosis similarity score.</li>
      <li>filter: Option to only get the results of a certain cancer type given as diagnosis.</li>
      <li>sort, filter, prioritize: Option to get sorted results for evidence level A, B and C, filtered results for evdence level D and E.</li>
    </ul>
  </p>
  <p style="width: 50%; margin-left:25%; font-size:20px;" id="JSON">JSON</p>
  <p style="width: 50%; margin-left:25%">
    The report of a analyzed vcf-file can be downloaded as a json-file. This file can be loaded again and the contained tables are displayed.
  </p>
  <p style="width: 50%; margin-left:25%; font-size:20px;" id="JobID">Job ID</p>
  <p style="width: 50%; margin-left:25%">
    For each .vcf-file analyzed with PeCaX a job id is assigned and the results are stored in a database. The results can be accessed by this job id afterwards.
  </p>
  <hr style="width: 50%; margin-left:25%;">
  <p style="width: 50%; margin-left:25%; font-size:30px;" id="ClinVAP">ClinVAP</p>
  <p style="width: 50%; margin-left:25%">
Clinical Variant Annotation Pipeline (ClinVAP) generates concise case reports from long list of somatic mutations by first annotating them functionally and clinically, then by prioritizing and filtering them based on their variant effect together with clinical actionability (<a href="https://doi.org/10.1093/bioinformatics/btz924">https://doi.org/10.1093/bioinformatics/btz924</a>). For more information visit the <a href="https://github.com/sbilge/nf-core-clinvap">ClinVAP documentation</a>.<br><br>

With functional annotation it achieves to predict the effect of mutations on protein level and prioritize the variants based on their effect or importance. For this we use Ensemble Variant Effect Predictor.<br><br>

Clinical annotation includes the selection of clinically relevant variants or mutated genes together with the targeting therapeutics mechanistically or with the clinical evidence. It uses background knowledgebase developed in-house using various publicly available data sources.<br><br>

Variant annotation is done with Ensemble VEP in offline mode to ensure data privacy. VEP plugins SIFT and PolyPhen are used to predict variant effect on protein. Variants are filtered based on passing quality measures of the NGS pipeline used to generate VCF files, their predicted effects by VEP, SIFT and PolyPhen. The remaining variants are passed to the reporting application.<br><br>

The reporting application uses background knowledgebase to do the clinical annotation. It is created by integrating publicly available databases to contain information of driver gene annotation, clinicaly relevant known pharmacogenomics effects information, adverse effect information, mechanistic drug targets.<br><br>

The database is queried with observed variants to identify therapeutics with known effects directly on the variants, and with the gene name to identify driver genes and the therapeutics with known effect on the distrupted genes.<br><br>

It also enables users to filter results more providing the diagnosis information as ICD10 code format. It provides one more layer of prioritization by selecting the results associated with the provided cancer type.<br><br>

Evidence level is also calculated for the results to show the significance of the associations between reported targets and drugs and their observed effect.<br><br>

After completing variant and clinical annotation, the ClinVAP Report is shown in the GUI and it can be downloaded as JSON or PDF formats.<br><br>
  </p>

<hr style="width: 50%; margin-left:25%;">
  <p style="width: 50%; margin-left:25%; font-size:30px;" id="ClinVAPReport">ClinVap Report</p>
  <p style="width: 50%; margin-left:25%">

    The results of the annotation and analysis with ClinVAP are represented in interactive tables (see table below). If information from external sources is available for a gene in the table, the related web links are listed next to the gene name in a dropdown menu with the icon <b-icon icon="link"></b-icon>. Next to each table, the related gene network is displayed, if applicable. Each table can be downloaded aas a .pdf-file.
    These contain information about:<br>
    <dl>
      <dt><b>Somatic Mutations in Known Driver Genes</b></dt>
        <dd>List of cancer driver genes along with the mutations observed in the patient. Consequence column provides the predicted effects of the variants on the protein sequence. Tumor type column gives the list of cohorts in which the gene is identified as driver. VAF (variant allele frequency) column shows the proportion of the variant allele to the coverage of that loci. Reference column represents the driver gene sources that catalogued the corresponding gene as driver. Driver gene information is obtained from Vogelstein et. al, Uniprot, TSGene, IntoGen and COSMIC.
        </dd><br><br>
      <dt><b>Somatic Mutations with Known Pharmacogenetic Effect</b></dt>
        <dd>List of drugs with the evidence of targeting the observed variant of the mutated gene, and the documented drug response for the given mutational profile. Evidence level letter represents: A = validated association, B = clinical evidence, C = case study, D = preclinical evidence, E = inferential association. Evidence level number represents the matching type between the observed variant and the database result: 1 = same variant, 2 = different variant, same consequence, 3 = different variant, different consequence, same gene. The information is obtained from CIViC, CGI and DrugBank.
      </dd><br><br>
      <dt><b>Somatic Mutations in Pharmaceutical Target proteins</b></dt>
          <dt><b>Pharmacogenomics Summary of Drugs Targeting Affected Genes</b></dt>
            <dd>Therapies that have evidence of targeting the affected gene. Evidence level letter represents: A = validated association, B = clinical evidence, C = case study, D = preclinical evidence, E = inferential association. Evidence level number represents the matching type between the observed variant and the database result: 1 = same variant, 2 = different variant, same consequence, 3 = different variant, different consequence, same gene. The information is obtained from CIViC, CGI and DrugBank.
          </dd><br><br>
          <dt><b>Summary of Cancer Drugs Targeting Affected Genes</b></dt>
            <dd>List of cancer drugs targeting the mutated gene. Information is obtained from DrugBank, Therapeutic Target Database, IUPHAR, and Santos et al.
            </dd><br>
        <dt><b>Adverse Effects</b></dt>
          <dd>List of drugs with known adverse effects on observed variant and distrupted genes.
        </dd><br><br>
        <dt><b>References</b></dt>
          <dd>The publications of the reference IDs given in the tables.</dd>
        </tr><br><br>
        <dt><b>Appendix</b></dt>
          <dd>All the somatic variants of the patient with their dbSNP and COSMIC IDs.</dd><br><br>
    </dl>
  </p>
  <p style="width: 50%; margin-left:25%; font-size:20px;" id="Citation">Citation</p>
  <p style="width: 50%; margin-left:25%">
    If you use ClinVAP in your work, please cite the following article:<br><br>

Sürün, B., Schärfe, C.P., Divine, M.R., Heinrich, J., Toussaint, N.C., Zimmermann, L., Beha, J. and Kohlbacher, O., 2020. ClinVAP: a reporting strategy from variants to therapeutic options. Bioinformatics, 36(7), pp.2316-2317.
  </p>
      <hr style="width: 50%; margin-left:25%;">
  <p style="width: 50%; margin-left:25%; font-size:20px;" id="SBML4j">SBML4j</p>
  <p style="width: 50%; margin-left:25%">
  SBML4j is a service for persisting SBML models in a Neo4j graph database, create network mappings on these models and interactively annotate and explore those networks. Communication with the service is JSON based and networks are provided in the GraphML format. Find out more at <a href="https://github.com/KohlbacherLab/sbml4j">GitHub</a>.
  </p>
    <hr style="width: 50%; margin-left:25%;">
  <p style="width: 50%; margin-left:25%; font-size:20px;" id="BioGraphVisart">BioGraphVisart</p>
  <p style="width: 50%; margin-left:25%">
  BioGraphVisart is a web-based tool to interactively visualize networks, especially with biological background. 
  It receives the network from SBML4j as a GraphML-file and displays it.<br><br>
  The nodes of the network represent the genes and related drugs targeting those genes. 
  If multiple drugs have the same gene as target, they are collapsed into one squared node, which can be extended by clicking on it
  The nodes are colored according to the information if they are stored in the related table.
  For the table <em>Somatic Mutations in Known Driver Genes</em> the driver genes in the network are additionally annotated with information of what driver type they are of, which is displayed when the mouse is moved over a node.<br><br>
  The edges between nodes represent the interaction(s) between two genes or a drug and a gene.
  The type of interaction can be seen in the interaction legend or by moving the mouse over an edge of interest.
  Multiple edges between two nodes are by default collapsed into one. 
  This can be disabled in the interactions legend.
  <br><br>
  The most common KEGG Pathways for the displayed genes can be calculated and the according genes can be grouped by them, highlighted by coloured squares.
  <br><br>
  The network can be downloaded in the file formats PDF, PNG and SVG.<br><br>
  BioGraphVisart can also be used as standalone application via <a href="https://localhost:3000">https://localhost:3000</a>.<br><br>
  For more details have a look at the <a href="/BioGraphVisart/Documentation">BioGraphVisart Documentation</a>.</p>

  </article>


</div>

      </div>
    </div>
</div>
<br><br>
<footer>
  <p><b>Disclaimer</b> The report created by ClinVAP is intended as a hypothesis generating framework and thus for research use only, and not for diagnostic or clinical purposes. Information provided in the report does not replace a physician's medical judgment and usage is entirely at your own risk. The providers of this resource shall in no event be liable for any direct, indirect, incidental, consequential, or exemplary damages.</p>
      <div class="containerMerged">
          <a class="page-link border-0 border-dark" href="/imprint/">Imprint</a>
          <a class="page-link border-0 border-dark" href="/datenschutzerklarung/" aria-current="page">Datenschutzerklärung</a>   
      </div> 
</footer>
</div>
</template>