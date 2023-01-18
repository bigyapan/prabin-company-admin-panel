<template>
    <v-app>
        <navigation-drawer/>
        <app-bar/>
        <v-main>
            <v-container fluid>
                <router-view></router-view>
            </v-container>
        </v-main>
        <confirm-dialog ref="confirm"/>
    </v-app>
</template>

<script>
import NavigationDrawer from "./components/NavigationDrawer";
import AppBar from "./components/AppBar";
import ConfirmDialog from "./components/ConfirmDialog";

export default {
    name: "App",
    components: {ConfirmDialog, AppBar, NavigationDrawer},
    mounted() {
        this.$root.confirm = this.$refs.confirm.open;
    }
}
</script>

<style >
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: #f5f5f5;
}

::-webkit-scrollbar-track {
    background-color: #f5f5f5;
}

::-webkit-scrollbar-thumb {
    background-color: #9e9e9e;
}

.v-data-footer {
    border-top: 0 !important;
}
</style>
