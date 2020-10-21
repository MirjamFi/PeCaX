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
<!--
 .tab { margin-left: 20px; }
-->
</style>
<style type="text/css">
<!--
 .tab2 { margin-left: 40px; }
-->
</style>
    <div class="page-content">
      <div class="wrapper">
        <div class="post">
<div class="entry-content">
  <article class="post-content">


<p style="width: 25%;margin-top:40px; float: left">
  <a href="#GeneralDoc" style="color:black; font-weight: 600; font-size: 18px;">General</a><br>
  <a href="#Input" class="tab"style="color:black; font-weight: 500; font-size: 16px;">Input</a><br>
  <a href="#VCF" class="tab2"style="color:black; font-weight: 400; font-size: 14px;">VCF</a><br>
  <a href="#JSON" class="tab2"style="color:black; font-weight: 400; font-size: 14px;">JSON</a><br>
  <a href="#ClinVAP" class="tab"style="color:black; font-weight: 500; font-size: 16px;">ClinVAP</a><br>
  <a href="#BioGraphVisart" class="tab"style="color:black; font-weight: 500; font-size: 16px;">BioGraphVisart</a><br>
  <a href="#SBML4j" class="tab"style="color:black; font-weight: 500; font-size: 16px;">SBML4j</a><br>

</p>
 
  <p style="width: 50%; margin-left:25%; font-size:30px;margin-top:40px" id="GeneralDoc">General</p>
  <p style="width: 50%; margin-left:25%">

  Personalized Cancer and Network Explorer (PeCax) is a tool for identifying patient specific cancer mechanisms by providing a complete mutational profile from variants to networks. It employs ClinVAP to perform clinical variant annotation which focuses on processing, filtering and prioritization of the variants to find the disrupted genes that are involved in carcinogenesis and to identify actionable variants from the mutational landscape of a patient. In addition it creates networks showing the connections between the driver genes and the genes in their neighbourhood and automatically performs pathway enrichment analysis using pathway resources (SBML4j). Its interactive visualisation (BioGraphVisart) supports easy network exploration and patient similarity (node overlap) and a merged network graph of two patient-specific networks can be calculated.
</p>
<hr style="width: 50%; margin-left:25%;">
  <p style="width: 50%; margin-left:25%; font-size:20px;" id="Input">Input</p>
  <p style="width: 50%; margin-left:25%">There are multiple options for input to use PeCaX.</p>
  <p style="width: 50%; margin-left:25%; font-size:16px;" id="VCF">VCF</p>
  <p style="width: 50%; margin-left:25%">
    For a .vcf-file it will be analyzed and anntated with <a href="#ClinVAP">ClinVAP</a>. 
    The report (.json-format) will be structured and displayed in interactive tables once the pipeline is finished.
    The tables contain information about:<br>
    <table>
      <tr style="padding-bottom: 2em">
        <td style="width: 30%"><strong>Somatic Mutations in Known Driver Genes</strong></td>
        <td style="width: 70%">List of cancer driver genes along with the mutations observed in the patient. Confidence column shows the number of the driver gene sources that catalogued the corresponding gene as driver and Reference column gives the list of those sources.</td>
      </tr>
      <tr style="padding-bottom: 2em">
        <td style="width: 30%"><strong>Somatic Mutations with Known Pharmacogenetic Effect</strong></td>
        <td style="width: 70%">List of drugs with the evidence of targeting the observed variant of the mutated gene regardless of the cancer type. The information is obtained from CIViC, CGI and DrugBank</td>
      </tr>
      <tr style="padding-bottom: 2em">
        <td style="width: 30%"><strong>Somatic Mutations in Pharmaceutical Target proteins</strong></td>
        <td style="width: 70%"><table>
          <tr style="padding-bottom: 2em">
            <td style="width: 30%"><strong>Pharmacogenomics Summary of Drugs Targeting Affected Genes</strong></td>
            <td style="width: 70%">Therapies that have evidence of targeting the affected gene. The information is obtained from CIViC, CGI and DrugBank. Results are filtered according to cancer type, if it is provided in metadata.</td>
          </tr>
          <tr style="padding-bottom: 2em">
            <td style="width: 30%"><strong>Summary of Cancer Drugs Targeting Affected Genes</strong></td>
            <td style="width: 70%">List of cancer drugs targeting the mutated gene. Information is obtained from DrugBank, Therapeutic Target Database, IUPHAR, and Santos et al. </td>
          </tr>
        </table></td>
      </tr>
        <tr style="padding-bottom: 2em">
          <td style="width: 30%"><strong>Adverse Effects</strong></td>
          <td style="width: 70%">List of drugs with known adverse effects.</td>
        </tr>
        <tr style="padding-bottom: 2em">
          <td style="width: 30%"><strong>References</strong></td>
          <td style="width: 70%">The publications of the reference IDs given in the tables.</td>
        </tr>
        <tr style="padding-bottom: 2em">
          <td style="width: 30%"><strong>Appendix</strong></td>
          <td style="width: 70%">All the somatic variants of the patient with their dbSNP and COSMIC IDs.</td>
        </tr>
    </table>
    <br>
  </p>
  <p style="width: 50%; margin-left:25%; font-size:16px;" id="JSON">JSON</p>
  <p style="width: 50%; margin-left:25%">
    The report of a analyzed vcf-file can be downloaded as a json-file. This file can be loaded again and the tables are displayed again.
  </p>
  <p style="width: 50%; margin-left:25%; font-size:16px;" id="JobID">JobID</p>
  <p style="width: 50%; margin-left:25%">
    Each user 
  </p>
  <hr style="width: 50%; margin-left:25%;">
  <p style="width: 50%; margin-left:25%; font-size:20px;" id="ClinVAP">ClinVAP</p>
  <p style="width: 50%; margin-left:25%">
  
The Clinical Variant Annotation Pipeline (ClinVAP) extracts information from simple somatic mutations (SNVs) of a patient given in VCF files and creates structured clinical reports by annotating, prioritizing and filtering the genomic variants. The report is designed to provide assistance for Molecular Tumor Boards (MTB) in making therapeutic decisions by equipping them with the molecular mechanisms initiating carcinogenesis and actionable genes.<br>
For more details have a look at <a href="https://github.com/sbilge/nf-core-clinvap">ClinVAP documentation</a>.<br><br>

<b>Disclaimer</b> The report created by ClinVAP is intended as a hypothesis generating framework and thus for research use only, and not for diagnostic or clinical purposes. Information provided in the report does not replace a physician's medical judgment and usage is entirely at your own risk. The providers of this resource shall in no event be liable for any direct, indirect, incidental, consequential, or exemplary damages.
  </p>
    <hr style="width: 50%; margin-left:25%;">
  <p style="width: 50%; margin-left:25%; font-size:20px;" id="BioGraphVisart">BioGraphVisart</p>
  <p style="width: 50%; margin-left:25%">
  <strong>BioGraphVisart</strong> is a web-based tool to interactively visualize networks, especially with biological background. It is written in javascript based on <a href="http://js.cytoscape.org">Cytoscape.js</a>. <br> BioGraphVisart currently can read generic networks from various sources through a standardized file format (graphML), which can be generated by many other tools. <br> It offers different automated layout options for the graph and mapping of generic attributes (e.g., expression levels) onto nodes and edges. Node and edge styles for different interaction types according to KEGG, the generation of legends for edge styles and the node coloring by easy selection of an attribute by the user, and grouping with respect to predefined pathways (e.g., from KEGG) are additional features currently implemented. For more details have a look at <a href="/BioGraphVisart/Documentation">BioGraphVisart Documentation</a>.</p>
    <hr style="width: 50%; margin-left:25%;">
  <p style="width: 50%; margin-left:25%; font-size:20px;" id="SBML4j">SBML4j</p>
  <p style="width: 50%; margin-left:25%">
  SBML4j is a service for persisting SBML models in a neo4j graph database, create network mappings on these models and interactively annotate and explore those networks. Communication with the service is JSON based and networks are provided in the GraphML format. Find out more at <a href="https://github.com/KohlbacherLab/sbml4j">GitHub</a> or get started with the <a href="https://hub.docker.com/repository/docker/thortiede/sbml4j">pre-built docker image</a>.
  </p>
  </article>


</div>

      </div>
    </div>
</div>
<br><br>
<footer>
      <div class="containerMerged">
          <a class="page-link border-0 border-dark" href="/imprint/">Imprint</a>
          <a class="page-link border-0 border-dark" href="/datenschutzerklarung/" aria-current="page">Datenschutzerklärung</a>   
      </div> 
</footer>
</div>
</template>