<template>
  <v-app>
    <!-- Header -->
    <v-app-bar app>
      <v-app-bar-nav-icon
        v-if="$page.props.auth && $page.props.auth.user"
        @click="drawer = !drawer">
      </v-app-bar-nav-icon>
      <v-toolbar-title>
        <span
          @click="$page.props.auth && $page.props.auth.user ? navigateTo('/dashboard') : navigateTo('/')"
          class="cursor-pointer"
        >
        Grupo A
        </span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn
        v-if="$page.props.auth && $page.props.auth.user"
        @click="logout"
        color="error"
        prepend-icon="mdi-logout"
      >
        Sair
      </v-btn>
    </v-app-bar>

    <!-- Sidebar -->
    <v-navigation-drawer
      v-if="$page.props.auth && $page.props.auth.user"
      app v-model="drawer" permanent
    >
      <v-list>
        <v-list-item title="Menu" class="text-h6"></v-list-item>
        <v-divider></v-divider>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          @click="navigateTo(item.route); drawer = false"
          link
        >
          <div class="d-flex gap-2 align-center">
            <v-icon>{{ item.icon }}</v-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </div>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer
      v-if="!$page.props.auth || !$page.props.auth.user"
      app>
      <v-col class="text-center white--text">
        © 2025 Grupo A
      </v-col>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import { router } from '@inertiajs/vue3';

const drawer = ref(false);

const menuItems = ref([
  { title: "Dashboard", icon: "mdi-view-dashboard", route: "/dashboard" },
  { title: "Alunos", icon: "mdi-account", route: "/students" }
]);

const navigateTo = (route) => {
  router.visit(route);
}

const logout = () => {
  router.post('/logout')
}
</script>