<template>
  <v-layout justify-center align-center width=90%>
      <v-flex xs12 sm8 md12>
  <div class="topnav" id ="nav">
          <div class="topnav-centered">
            <a class="page-link active border-0 border-dark" href="/"><font face="verdana">PeCaX</font></a>
          </div>
          <div class="dropdown topnav-left" id="navAbout">  
            <button class="dropbtn"><b-icon data-html2canvas-ignore="true" icon="list" class="h3"></b-icon>
              <div class="dropdown-content">
                <div class="dropdown-content">
                  <a class="page-link" href="/about" ><font face="verdana">About</font></a>
                    <a class="page-link" href="/documentation"><font face="verdana">Documentation</font></a>
                    <a class="page-link" href="/contact"><font face="verdana">Contact</font></a>
              </div>
            </div>
            </button> 
          </div>
          <div class="topnav-right">
              <button style="margin-top: 2vw;">
                <a href="/"><b-icon icon="file-earmark-plus" class="h3" variant="dark"></b-icon></a>
            </button>
          </div>
      </div>
    <div >
      <header class="site-header">
      <h1 class="title"><font face="verdana">My Jobs</font></h1>
    </header>
      <div style="margin-left: 10%">
        <table class="float-left">
          <tr>
            <td style="padding:0 15px;">User: </td>
            <td> {{ username }}</td>
          </tr>
          <tr>
            <td style="padding:0 15px;"> Job IDs:</td>
            <td >
              <table>
                <tr  v-for="chunk in chunks">
                  <td style="padding:0 10px;" v-for="jobid in chunk">
                    <a v-on:click="showJob(jobid)" style="color: blue"> {{jobid }} </a>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
        </table>
      </div>
      <br>
      <div style="margin-left:50%">
        <input v-show="allowdeleteJobId" type="text" name="deleteId" ref="deleteId" placeholder="Job ID" style="width: 250px"/>
        <button v-show="allowdeleteJobId" class= 'butn' v-on:click="
          deleteJobID();">
          Delete
        </button>
      </div>
    </div>
</v-flex>
</v-layout>
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
        allowdeleteJobId:true,
        chunks :[]
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
        this.chunks=this.chunk(this.jobids)
        console.log(this.chunks)

      },
      chunk(ids, chunk1 = 5,) {
        let i
        const l = Math.ceil(ids.length / 10)
        const items = ids.slice()
        const result = []
        for (i = 1; i <= l; i++) {
          const chunk1 = items.splice(0, 10)
          result.push(chunk1)
          // if (items.length > 0) {
          //    const chunk2 = items.splice(0, 5)
          //    result.push(chunk2)
          // }
        }
        return result
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
    },
  }
</script>