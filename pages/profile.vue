<template>
  <section class="section">
    <div class="container">
      <h2 class="title">My Account</h2>
      <div>
        <table class="float-left">
          <tr>
            <td style="margin-right: 3px">Username: </td>
            <td> {{ username }}</td>
          </tr>
          <tr>
            <td> Job IDs</td>
            <td v-for="jobid of jobids">
              <a v-bind:href="'/results?username='+username+'&jobid='+jobid">{{jobid }}</a>
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
      if(ids == false || ids == []){
        this.jobids = "none"
      }
      else{
        ids = ids.split(",")
        for(let id of ids){
          this.jobids.push(id.split(".")[0])
        }
      }
    }
  },
  created(){
    this.getInfo();
  }
  
}
</script>