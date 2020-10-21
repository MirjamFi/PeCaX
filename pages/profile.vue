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
              <a v-on:click="showJob(jobid)" style="color: blue"> {{jobid }} </a><!--v-if="jobid!=[]" v-bind:href="'/results?username='+username+'&jobid='+jobid"-->
            </td>
          </tr>
        </table>
      </div>
      <br>
      <div style="float: right;">
        <input v-show="allowdeleteJobId" type="text" name="deleteId" ref="deleteId" placeholder="Job ID" style="width: 250px"/>
        <button v-show="allowdeleteJobId" class= 'butn' v-on:click="
          deleteJobID();">
          Delete
        </button>
      </div>
    </div>
  </section>
</template>

<script>
  import axios from "axios";
  import pecaxdb from '../src/db'
  import arangodb from 'arangojs'
  export default {
    data(){
      return {
        username:'',
        jobids:[],
        allowdeleteJobId:true
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
            this.jobids.push(id)
          }
        }
      },
      showJob(jobid){
        localStorage.setItem("username", this.username);
        localStorage.setItem("jobid", jobid)
        var url = '/results?username='+this.username+'&jobid='+jobid
        document.location.href = url;
      },
      deleteJobID(){
        var jobid = this.$refs.deleteId.value
        var index = this.jobids.indexOf(jobid);
        if(index!==(-1)){
          this.jobids.splice(index, 1);
          // get list of networks
          axios.get('/network/networks', {
            headers:{
                    'user':this.username+'/'+jobid.toString()
                },
                method:'GET'
          }).then(res => {
                //delete networks
                for (const [key, value] of Object.entries(res.data)){
                    axios.delete('/network/networks/'+value.uuid, {
                      headers:{
                          'user':this.username+'/'+jobid.toString()
                      },
                      method: 'DELETE'
                    }).then(()=>{
                      axios.get('/network/networks', {
                        headers:{
                                'user':this.username+'/'+jobid.toString()
                            },
                            method:'GET'
                      }).then(res => {
                        pecaxdb.deleteDoc(new arangodb.Database('/db/'), jobid, this.username);
                        localStorage.setItem("jobids", this.jobids)
                        this.getInfo()
                      })
                    })
                }
                
          })
        }
        
        
      }
    },
    created(){
      this.getInfo();
    }
    
  }
</script>