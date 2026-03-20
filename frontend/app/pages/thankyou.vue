<script setup>

import miner from "../../miner.json"
import carer from "../../carer.json"
import careleaver from "../../careleaver.json"
import disabled from "../../disabled.json"
import millionaire from "../../millionaire.json"
import farmer from "../../farmer.json"
import student from "../../student.json"
import refugee from "../../refugee.json"

const headers = [
    {
      align: 'center',
      key: 'name',
      sortable: false,
      title: 'Profile',
    },
    { align: 'center', key: 'yes', title: 'Yes' },
    { align: 'center', key: 'no', title: 'No' }
  ]
const results = ref([
  {
    "name": "Miner",
    "yes": parseInt(miner.Items[0].yes.N),
    "no": parseInt(miner.Items[0].no.N)
  },
  {
    "name": "Student",
    "yes": parseInt(student.Items[0].yes.N),
    "no": parseInt(student.Items[0].no.N)
  },
  {
    "name": "Carer",
    "yes": parseInt(carer.Items[0].yes.N),
    "no": parseInt(carer.Items[0].no.N)
  },
  {
    "name": "Care Leaver",
    "yes": parseInt(careleaver.Items[0].yes.N),
    "no": parseInt(careleaver.Items[0].no.N)
  },
  {
    "name": "Farmer",
    "yes": parseInt(farmer.Items[0].yes.N),
    "no": parseInt(farmer.Items[0].no.N)
  },
  {
    "name": "Disabled person",
    "yes": parseInt(disabled.Items[0].yes.N),
    "no": parseInt(disabled.Items[0].no.N)
  },
  {
    "name": "Refugee",
    "yes": parseInt(refugee.Items[0].yes.N),
    "no": parseInt(refugee.Items[0].no.N)
  },
  {
    "name": "Millionaire",
    "yes": parseInt(millionaire.Items[0].yes.N),
    "no": parseInt(millionaire.Items[0].no.N)
  }
])

//console.log(results)
</script>

<style>
.tableclass {
  border:1px solid black ; 
  margin-top:20px; 
  margin-bottom: 20px;
}

.v-data-table-header__content {
  font-weight: bold;
}

</style>

<template>
  <v-container>
    <div class="pb-2">
      <v-progress-linear model-value="100" height="25" color="cyan">
        <small class="text-black">All votes cast</small>
      </v-progress-linear>
    </div>
    <v-row class="text-center">
      <v-col cols="6">
        <img src="/assets/studentport.jpg" class="my-3" contain height="200" />
      </v-col>
      <v-col cols="6">
        <img src="/assets/farmer.jpg" class="my-3" contain height="200" />
      </v-col>
      <v-col class="mb-4">
        <h1 class="text-h3 font-weight-bold mb-3">Thank you for voting!</h1>
        <h3>The results so far (updated every 24 hours)</h3>
          <v-data-table class="tableclass" hide-default-footer :headers="headers" :items="results"></v-data-table>
        <v-btn href="https://forms.gle/VVTP6pkSHE83b31n8" target="_blank">What did you think of this quiz?
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>