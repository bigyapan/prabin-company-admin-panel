<template>
    <v-app-bar app :color="bg" fixed flat>
        <v-row align="center" justify="center" no-gutters>
            <v-spacer></v-spacer>
            <v-col cols="auto">
                    <v-menu v-if="isAuthenticated" :close-on-content-click="true" offset-overflow offset-y
                            transition="slide-x-reverse-transition">
                        <template v-slot:activator="{on,attrs}">
                            <div v-bind="attrs" v-on="on">
                                <v-avatar >
                                    <img
                                        alt="user-image"
                                        src="/images/user_image_placeholder.png"
                                    >
                                </v-avatar>
                                <span>{{user.name}}</span>
                            </div>
                        </template>
                        <v-card>
                            <v-list>
                                <v-list-item>
                                    <v-list-item-avatar>
                                        <img
                                            alt="user-image"
                                            src="/images/user_image_placeholder.png"
                                        >
                                    </v-list-item-avatar>

                                    <v-list-item-content>
                                        <v-list-item-title>{{ user.name }}</v-list-item-title>
                                        <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-divider/>
                                <v-list-item link to="/settings">
                                    <v-list-item-icon>
                                        <v-icon>fa-solid fa-gear</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Settings</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item @click="logout">
                                    <v-list-item-icon>
                                        <v-icon>fa-solid fa-right-from-bracket</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>Logout</v-list-item-title>

                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-card>
                    </v-menu>
            </v-col>
        </v-row>
    </v-app-bar>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    name:"AppBar",

    data() {
        return {
            locale:'en',
            bg: '#f5f5f5',
        }
    },
    computed: {
        ...mapGetters("auth",["isAuthenticated", "user"]),
    },
    methods: {
        logout() {
            let temp = this;
            this.$store
                .dispatch("auth/logout")
                .then(function (response) {
                    if (response.status === 200) {
                        temp.$router.push("/login");
                    }
                }).catch(function (error) {
                console.log(error)
            });
        },
    },

    mounted() {
    },

};
</script>

<style lang="scss">
.v-btn{
    text-transform: unset !important;
}
</style>
