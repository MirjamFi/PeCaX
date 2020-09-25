<template>
  <section class="section">
    <div class="container">
      <h2 class="title">My Account</h2>
      <div>
        <table class="float-left">
          <tr>
            <td style="padding:0 15px;">User: </td>
            <td> {{ username }}</td>
          </tr>
          <tr>
            <td style="padding:0 15px;"> Job IDs:</td>
            <td v-for="jobid of jobids" style="padding:0 10px;">
              <a v-on:click="showJob(jobid)"> {{jobid }} </a><!--v-if="jobid!=[]" v-bind:href="'/results?username='+username+'&jobid='+jobid"-->
            </td>
          </tr>
        </table>
      </div>
    </div>
  </section>
</template>

<script>

export default {
  data(){
    return {
      username:'',
      jobids:[]
    }
  },
  methods: {
    getInfo(){
      this.username = localStorage.getItem("username");
      var ids = localStorage.getItem("jobids")
      if(ids == false || ids == [] || ids == "undefined" || ids == null){
        this.jobids = []
      }
      else{
        ids = ids.split(",")
        for(let id of ids){
          this.jobids.push(id.split(".")[0])
        }
      }
    },
    showJob(jobid){
      localStorage.setItem("username", this.username);
      localStorage.setItem("jobid", jobid)
      var url = '/results?username='+this.username+'&jobid='+jobid
      document.location.href = url;
    }
  },
  created(){
    this.getInfo();
  }
  
}
</script>