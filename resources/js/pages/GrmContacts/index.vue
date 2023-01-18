<template>
    <v-container fluid>
        <h1 class="display-1 font-weight-bold mb-8">Contacts</h1>
        <v-card flat color="accent" class="pa-4">
            <v-container fluid>
                <v-row>
                    <v-col>
                        <v-data-table
                            :hide-default-footer="true"
                            :items="contactsPaginatedData.data"
                            :items-per-page="query.perPage"
                            :headers="headers"
                            :options.sync="options"
                            :page="query.page"
                            :pageCount="contactsPaginatedData.pagination.total_pages"
                            :server-items-length="contactsPaginatedData.pagination.total"
                            :sort-by.sync="query.sortBy"
                            :sort-desc.sync="query.sortDesc"
                            :loading="isLoading"
                            calculate-widths
                            show-select
                            @click:row="show($event)"
                            fixed-header
                            loading-text="Fetching data. Please wait..."
                        >
                            <template v-slot:top="{ pagination, options, updateOptions }">
                                <v-container fluid>
                                    <v-row justify="center" align="center">
                                        <v-col cols="4">
                                            <v-text-field hide-details="auto" v-model="query.search"
                                                          append-icon="fas fa-search" dense
                                                          filled
                                                          label="Search..." @change="getDataFromApi"
                                                          @click:append="getDataFromApi"
                                            ></v-text-field>
                                        </v-col>
                                        <v-spacer></v-spacer>
                                        <v-col cols="8">
                                            <v-data-footer
                                                :items-per-page-options="[10,25,50,100]"
                                                :options.sync="options"
                                                :pagination="pagination"
                                                :show-first-last-page="true"
                                                first-icon="fas fa-angle-double-left"
                                                items-per-page-text="$vuetify.dataTable.itemsPerPageText"
                                                last-icon="fas fa-angle-double-right"
                                                next-icon="fas fa-angle-right"
                                                prev-icon="fas fa-angle-left"
                                                @update:options="updateOptions"
                                            />
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </template>
                            <template v-slot:item.actions="{ item }">
                                <v-btn @click.stop.prevent="show(item)" icon>
                                    <v-icon>fa-solid fa-eye</v-icon>
                                </v-btn>
                                <v-btn :to="`/grm-contacts/edit/${item.id}`" v-show="false" icon>
                                    <v-icon>fa-solid fa-pencil-alt</v-icon>
                                </v-btn>
                                <v-btn :loading="isDeleting" @click.stop.prevent="confirm(item)" color="error" icon>
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
                                            item.message.length > 60 ? item.message.substring(0, 60) + " ..." :
                                            item.message
                                            }}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </template>
                            <template v-slot:item.receivedOn="{ item }">
                                <v-list-item class="ma-0 pa-0">
                                    <v-list-item-content>
                                        <v-list-item-subtitle>{{
                                            new Date(item.created_at).toLocaleString()
                                            }}
                                        </v-list-item-subtitle>
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
                                {{ new Date(contact.created_at).toLocaleString() }}
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
import {mapActions, mapGetters} from "vuex";

export default {
    name: "GautamRiceMill",
    data() {
        return {
            query: {
                page: 1,
                search: '',
                perPage: 10,
            },
            options: {},
            headers: [
                {text: "From", value: "from", width: "20%"},
                {text: "Contact Message", value: "contactMessage", width: "55%"},
                {text: "Received On", value: "receivedOn", width: "10 %"},
                {text: "Actions", value: "actions", width: "15%"},
            ],
            viewContact: false
        }
    },
    computed: {
        ...mapGetters("contacts", [
            "contactList", "contactsPaginatedData", "isLoading", "isDeleting", "contact"
        ])
    },
    watch: {
        //this one will populate new data set when contact changes current page.
        options: {
            handler(e) {
                this.query.page = e.page;
                this.query.perPage = e.itemsPerPage;
                this.getDataFromApi();
            },
            deep: true,
        },
    },
    methods: {
        ...mapActions("contacts", [
            "fetchAllContacts", "deleteContact", "fetchDetailContact"
        ]),
        getDataFromApi() {
            this.fetchAllContacts(this.query);
        },
        confirm(item) {
            const temp = this;
            this.$root.confirm('Confirm Delete', 'Are you sure you want to delete this message ?', {color: 'red'}).then((confirm) => {
                temp.deleteContact(item.id);
                temp.getDataFromApi();
            }).catch((error) => {
            });
        },
        show(e) {
            const temp = this;
            this.fetchDetailContact(e.id).then(function (response) {
                temp.viewContact = true;
            }).catch(function (error) {
            });
        }
    },
    mounted() {
        this.getDataFromApi();
    }
}
</script>

<style scoped>

</style>
