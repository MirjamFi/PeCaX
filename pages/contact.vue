<script type="text/javascript">
  export default{
    head: {
      title: 'About'
    },
    head () {
      return {
        link: [
          {
          },
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
  <div class="page-content">
        <div class="wrapper">
          <div class="post">

    <header class="post-header">
      <h1 class="post-title">Contact</h1>
    </header>
  <div class="entry-content">
    <article class="post-content">

  <p style="margin-top:40px"></p>
  <p style="width: 50%; margin-left:25%"><strong>ClinVAP Report Network</strong> was developed at <a href="https://kohlbacherlab.org/">Applied Bioinformatics Group, Universität Tübingen</a>. It is published under the <a href="https://opensource.org/licenses/MIT">MIT license</a>. <br><br>

    For questions, comments, problems regarding <strong>ClinVAP Report Network</strong>, please contact <a href="mailto:sueruen@informatik.uni-tuebingen.de">Bilge Sürün</a> (ClinVAP), <a href="mailto:figasch@informatik.uni-tuebingen.de">Mirjam Figaschewski</a> (Webpage and BioGraphVisart), <a href="mailto:tiede@informatik.uni-tuebingen.de">Thorsten Tiede</a> (SBML4j).</p>

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

