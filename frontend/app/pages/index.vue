<script setup>
const route = useRoute()
const runtimeConfig = useRuntimeConfig()

setTimeout(async function () {

  if (route.query.campaignid) {
    let r
    try {

      r = await useFetch(runtimeConfig.public.getCampaignFunctionUrl.value,
        {
          body: {
            'campaignid': route.query.campaignid
          },
          method: 'post'
        })
      if (!r.data.value) {
        throw new Error("Invalid campaignid")
      }
      // if you get here, the campaign is valid.. store it and then  fetch the profiles and put them in local storage as well 

      localStorage.setItem("campaignid", route.query.campaignid)

      r = await useFetch(runtimeConfig.public.getProfilesFunctionUrl.value,
        {
          method: 'post'
        })

      console.log(r.data.value)
      if (r.data.value.message.length === 0) {
        //no profiles
        throw new Error("No profiles available")
      }

      localStorage.setItem("profiles", JSON.stringify(r.data.value.message))

      //now check whether you already have a user on this device. If not, create a user and put it in local storage


      let userid

      userid = localStorage.getItem("userid")

      if (!userid) {
        //create a new one 
        userid = crypto.randomUUID()
        localStorage.setItem("userid", userid)
      }

      //now you have all the data.. go to first profile to start voting!

      await navigateTo('/profile/1')

    } catch (e) {
      console.error('failed to fetch campaign', e)
      await navigateTo('/error')

    }
  }
  else {
    await navigateTo('/error')
  }

}, 10)

</script>

<template>
  Loading.. Please wait
  <v-progress-linear color="green" indeterminate></v-progress-linear>
</template>