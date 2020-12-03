<script type="text/javascript">
	export default{
	  head: {
	    title: 'About'
	  },
	  head () {
	    return {
	    	link: [
	        {
	        	rel:"stylesheet", type:"text/css", href:"subgraphCss.css"
	        },
	        {
	        	rel:"alternate", type:"application/html", title:"CPeCaX", href:"/"
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
<div id="about">
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
          <div class="topnav-right">
              <button style="margin-top: 2vw;">
                <a href="/"><b-icon icon="file-earmark-plus" class="h3" variant="dark"></b-icon></a>
            </button>
          </div>
      </div>
    <div class="page-content">
      <div class="wrapper">
        <div class="post">

	  <header class="post-header">
	    <h1 class="post-title"><font face="verdana">About</font></h1>
	  </header>
	<div class="entry-content">
	  <article class="post-content">

	<p style="margin-top:40px"></p>
	<p style="width: 50%; margin-left:25%">Personalized Cancer and Network Explorer (PeCax) is a tool for identifying patient specific cancer mechanisms by providing a complete mutational profile from variants to networks. It employs ClinVAP to perform clinical variant annotation which focuses on processing, filtering and prioritization of the variants to find the disrupted genes that are involved in carcinogenesis and to identify actionable variants from the mutational landscape of a patient. In addition it creates networks showing the connections between the driver genes and the genes in their neighbourhood and automatically performs pathway enrichment analysis using pathway resources (SBML4j). Its interactive visualisation (BioGraphVisart) supports easy network exploration and patient similarity (node overlap) and a merged network graph of two patient-specific networks can be calculated. <br>

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