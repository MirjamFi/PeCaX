<template>
  <div class="topnav" id ="nav">
    <div class="dropdown topnav-left" id="navAbout">  
      <button class="dropbtn"><b-icon data-html2canvas-ignore="true" icon="list"></b-icon>
        <div class="dropdown-content">
          <a href="/about" class="page-link">About </a>
          <a class="page-link" href="/documentation">Documentation</a>
          <a class="page-link" href="/contact">Contact</a>
        </div>
      </button> 
    </div>
    <div class="topnav-centered">
      <a class="page-link active border-0 border-dark" href="/">PeCaX</a>
    </div>
    <div class="topnav-right" id="new">
       <a class="page-link border-0 border-dark" href="/profile">My Account</a>
      <!-- <button class="dropdown dropbtn">My Account<b-icon data-html2canvas-ignore="true" icon="list"></b-icon> -->
        <!-- <div class="dropdown-content"> -->
          <!-- <a href="/profile" class="page-link">My Account</a> -->
<!--           <a class="page-link" href="/">Logout</a> -->
        <!-- </div> -->
      <!-- </button> -->
    </div>    
  </div>
</template>