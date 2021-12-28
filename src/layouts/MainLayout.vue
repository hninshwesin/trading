<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="primary">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Trading App
        </q-toolbar-title>

        <!-- <div>Quasar v{{ $q.version }}</div> -->
      </q-toolbar>
    </q-header>

    <q-footer
      elevated
      class="bg-white text-primary"
      style="height:65px;"
    >
      <q-tabs
        no-caps
        active-color="primary"
        indicator-color="transparent"
        class="text-grey"
      >
        <q-route-tab
          icon="assessment"
          to="/home"
          replace
          hide="icon"
          label="Chart"
          class="q-mr-md"
        />
        <q-route-tab
          icon="account_balance_wallet"
          to="/wallet"
          replace
          hide="icon"
          label="Wallet"
          class="q-mr-md"
        />
      </q-tabs>
    </q-footer>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Menu Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'HomePage',
    // caption: 'quasar.dev',
    icon: 'emoji_people',
    link: '#/home'
  },
  {
    title: 'Client Registration Secret Code',
    // caption: 'quasar.dev',
    icon: 'pin',
    link: '#/registration_code'
  },
  {
    title: 'My Wallet',
    // caption: 'github.com/quasarframework',
    icon: 'account_balance_wallet',
    link: '#/wallet'
  },
  {
    title: 'Sign Out',
    // caption: 'github.com/quasarframework',
    icon: 'lock',
    link: '#/signout'
  },
];

import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
