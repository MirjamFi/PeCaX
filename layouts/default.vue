<template>
  <v-app dark>
    <!-- <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer> -->
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
   <!--  <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
    </v-navigation-drawer> -->
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
    }
  }
}
</script>
