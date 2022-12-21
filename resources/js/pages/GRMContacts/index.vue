<template>
    <v-container fluid>
        <h1 class="display-1 font-weight-bold mb-8">Contacts</h1>
        <v-card flat color="accent" class="pa-4">
            <v-container fluid>
                <v-row>
                    <v-col cols="auto">
                        <v-text-field
                            v-model="search"
                            append-icon="fa-solid fa-magnifying-glass"
                            label="Search"
                            color="secondary"
                            single-line
                            filled
                            rounded
                            dense
                            hide-details></v-text-field>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="auto">
                        <v-btn v-show="false" depressed color="secondary">
                            <v-icon left>fa-solid fa-address-book</v-icon>
                            Add Contact
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-data-table
                            :items="contacts"
                            :headers="headers"
                            :loading="isLoading"
                            calculate-widths
                            :search="search"
                            show-select
                            v-model="selected"
                            @click:row="show($event)"
                        >
                            <template v-slot:item.actions="{ item }">
                                <v-btn @click.stop.prevent="show(item)" icon>
                                    <v-icon>fa-solid fa-eye</v-icon>
                                </v-btn>
                                <v-btn v-show="false" icon>
                                    <v-icon>fa-solid fa-pencil-alt</v-icon>
                                </v-btn>
                                <v-btn @click.stop.prevent="destroy(item)" color="error" icon>
                                    <v-icon>fa-solid fa-trash-alt</v-icon>
                                </v-btn>
                            </template>
                            <template v-slot:item.from="{ item }">
                                <v-list-item class="ma-0 pa-0">
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            <v-icon small left>fa-solid fa-user</v-icon>
                                            {{ item.name }}
                                        </v-list-item-title>
                                        <v-list-item-subtitle v-if="item.email">
                                            <v-icon small left>fa-solid fa-envelope</v-icon>
                                            {{ item.email }}
                                        </v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="item.phone">
                                            <v-icon small left>fa-solid fa-phone</v-icon>
                                            {{ item.phone }}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </template>
                            <template v-slot:item.contactMessage="{ item }">
                                <v-list-item class="ma-0 pa-0">
                                    <v-list-item-content>
                                        <v-list-item-title>{{ item.subject }}</v-list-item-title>
                                        <v-list-item-subtitle>{{
                                                item.message.length > 60 ? item.message.substring(0, 60) + " ..." : item.message
                                            }}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </template>
                            <template v-slot:item.receivedOn="{ item }">
                                <v-list-item class="ma-0 pa-0">
                                    <v-list-item-content>
                                        <v-list-item-subtitle>{{ formatDate(item.created_at) }}</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
        <v-dialog width="50vw" v-model="viewContact">
            <v-toolbar dark flat color="primary">
                <span class="headline">Contact Message</span>
                <v-spacer></v-spacer>
                <v-btn @click="viewContact=false" depressed fab x-small color="error">
                    <v-icon>fa-solid fa-xmark</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card tile class="py-4">
                <v-card-title>
                    <h3><b>{{ contact.subject }}</b></h3>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-subtitle>
                    <v-container fluid>
                        <v-row>
                            <v-col v-if="!!contact.name" cols="auto">
                                <v-icon small left>fa-solid fa-user</v-icon>
                                {{ contact.name }}
                            </v-col>
                            <v-col v-if="!!contact.phone" cols="auto">
                                <v-icon small left>fa-solid fa-phone</v-icon>
                                {{ contact.phone }}
                            </v-col>
                            <v-col v-if="!!contact.email" cols="auto">
                                <v-icon small left>fa-solid fa-envelope</v-icon>
                                {{ contact.email }}
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col v-if="!!contact.created_at" cols="auto">
                                <v-icon small left>fa-solid fa-calendar-alt</v-icon>
                                {{ formatDate(contact.created_at) }}
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-subtitle>
                <v-card-text>
                    <v-container>

                        <v-row>
                            <v-col cols="12">
                                {{ contact.message }}

                            </v-col>
                        </v-row>

                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    name: "GautamRiceMill",
    data() {
        return {
            contacts: [],
            headers: [
                {text: "From", value: "from", width: "20%"},
                {text: "Contact Message", value: "contactMessage", width: "55%"},
                {text: "Received On", value: "receivedOn", width: "10 %"},
                {text: "Actions", value: "actions", width: "15%"},
            ],
            isLoading: false,
            search: null,
            viewContact: false,
            contact: {},
            selected: []
        }
    },
    computed: {
        ...mapGetters({
            accessToken: 'auth/accessToken'
        })
    },
    methods: {
        formatDate(input) {
            var d = new Date(input);
            var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct',
                'Nov', 'Dec'];
            var date = d.getDay().toString() + " " + month[d.getMonth().toString()] + ", " +
                d.getFullYear().toString();
            return (date);
        },
        getContacts() {
            const here = this;
            this.isLoading = true;
            axios.get(process.env.MIX_BACKEND_API_URL + 'grm-contacts', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + here.accessToken
                }
            }).then(response => {
                here.contacts = response.data.data;
                this.isLoading = false;
            }).catch(error => {
                this.isLoading = false;
            })
        },
        show(e) {
            const here = this;
            this.getContact(e);
        },
        getContact(e) {
            const here = this;
            this.isLoading = true;
            axios.get(process.env.MIX_BACKEND_API_URL + 'grm-contacts/' + e.id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + here.accessToken
                }
            }).then(response => {
                here.contact = response.data.data;
                this.viewContact = true;
                this.isLoading = false;
            }).catch(error => {
                this.isLoading = false;
            })
        },
        destroy(e) {
            const here = this;
            this.$root.confirm('Confirm Delete', 'Are you sure you want to delete this message ?', {color: 'red'}).then((confirm) => {
                axios.delete(process.env.MIX_BACKEND_API_URL + 'grm-contacts/' + e.id, {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer " + here.accessToken
                    }
                })
                    .then(response => {
                        here.getContacts();
                    });
            }).catch((error) => {
                console.log(error);
            });
        }
    },
    mounted() {
        this.getContacts();
    }

}
</script>

<style scoped>

</style>
