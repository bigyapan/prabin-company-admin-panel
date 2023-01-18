<template>
    <v-container fluid>
        <h1 class="display-1 font-weight-bold mb-8">Quote Requests</h1>
        <v-card flat color="accent" class="pa-4">
            <v-container fluid>
                <v-row>
                    <v-col>
                        <v-data-table
                            :hide-default-footer="true"
                            :items="quotesPaginatedData.data"
                            :items-per-page="query.perPage"
                            :headers="headers"
                            :options.sync="options"
                            :page="query.page"
                            :pageCount="quotesPaginatedData.pagination.total_pages"
                            :server-items-length="quotesPaginatedData.pagination.total"
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
                                            <v-text-field hide-details="auto" v-model="query.search" append-icon="fas fa-search" dense
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
                                <v-btn @click.prevent.stop="show(item)" icon>
                                    <v-icon>fa-solid fa-eye</v-icon>
                                </v-btn>
                                <v-btn :to="`/grm-quotes/edit/${item.id}`" v-show="false" icon>
                                    <v-icon>fa-solid fa-pencil-alt</v-icon>
                                </v-btn>
                                <v-btn @click.stop.prevent="confirm(item)" color="error" icon>
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
                            <template v-slot:item.product="{ item }">
                                <v-list-item class="ma-0 pa-0">
                                    <v-list-item-content>
                                        <v-list-item-title>{{
                                                !!item.brand ? item.brand.title : 'N/A'
                                            }}
                                            <v-chip small color="primary"
                                                    v-if="!!item.brand ? parseInt(item.brand.is_customer)===1:false">
                                                Custom
                                            </v-chip>
                                        </v-list-item-title>
                                        <v-list-item-subtitle>{{
                                                !!item.packaging ? item.packaging.title : 'N/A'
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
        <v-dialog width="55vw" v-model="viewQuote">
            <v-toolbar dark flat color="primary">
                <span class="headline">Quote Request Details</span>
                <v-spacer></v-spacer>
                <v-btn @click="viewQuote=false" depressed fab x-small color="error">
                    <v-icon>fa-solid fa-xmark</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card tile>
                <v-card-title>
                    <h3><b>{{!!quote.brand? quote.brand.title:'' }}</b></h3>
                    <v-spacer></v-spacer>
                    <v-col v-if="!!quote.created_at" cols="auto">
                        <v-icon left>fa-solid fa-calendar-alt</v-icon>
                        {{ new Date(quote.created_at).toLocaleString() }}
                    </v-col>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-container fluid>
                        <v-row>
                            <v-col cols="12">
                                <v-row>
                                    <v-col cols="7">
                                        <v-card flat color="accent">
                                            <v-card-text>
                                                <v-container class="ma-0 pa-0" fluid>
                                                    <v-row>
                                                        <v-col cols="12">
                                                            <h2 class="title">Personal Details</h2>
                                                            <v-divider></v-divider>
                                                        </v-col>
                                                        <v-col v-if="!!quote.name" cols="12">
                                                            <v-icon left>fa-solid fa-user</v-icon>
                                                            <span><b>Name: </b>{{ quote.name }}</span>
                                                        </v-col>
                                                        <v-col v-if="!!quote.phone" cols="12">
                                                            <v-icon left>fa-solid fa-phone</v-icon>
                                                            <span><b>Phone: </b>{{ quote.phone }}</span>
                                                        </v-col>
                                                        <v-col v-if="!!quote.email" cols="12">
                                                            <v-icon left>fa-solid fa-envelope</v-icon>
                                                            <span><b>E-mail: </b>{{ quote.email }}</span>
                                                        </v-col>

                                                    </v-row>
                                                </v-container>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="5">
                                        <v-card flat color="accent" class="pa-2">
                                            <v-img v-if="!!quote.brand" @click="overlay = !overlay"
                                                   :src="`/storage/images/gautam-rice-mill/brands/${quote.brand.image}`"
                                                   alt="Brand Image" height="205"></v-img>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12">
                                <v-card flat color="accent">
                                    <v-card-text>
                                        <v-container class="ma-0 pa-0" fluid>
                                            <v-row>
                                                <v-col cols="12">
                                                    <h2 class="title">Order Details</h2>
                                                    <v-divider></v-divider>
                                                </v-col>
                                                <v-col v-if="!!quote.brand" cols="auto">
                                                    <span><b>Brand: </b>{{ quote.brand.title }}</span>
                                                </v-col>
                                                <v-col v-if="!!quote.packaging" cols="auto">
                                                    <span><b>Packaging: </b>{{ quote.packaging.title }}</span>
                                                </v-col>
                                                <v-col v-if="!!quote.container" cols="auto">
                                                    <span><b>Container: </b>{{ quote.container.size }}'</span>
                                                </v-col>
                                                <v-col v-if="!!quote.incoterm" cols="auto">
                                                    <span><b>Incoterm: </b>{{ quote.incoterm.title }}</span>
                                                </v-col>
                                                <v-col v-if="!!quote.port" cols="auto">
                                                    <span><b>Port: </b>{{ quote.port }}</span>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-overlay @click="overlay = false" opacity="0.95" :value="overlay">
                        <v-container style="width:100vw" fluid>
                            <v-card flat color="transparent">
                                <v-card-title>
                                    <v-spacer></v-spacer>
                                    <v-btn @click.stop.prevent="overlay = false" depressed fab x-small color="error">
                                        <v-icon>fas fa-xmark</v-icon>
                                    </v-btn>
                                </v-card-title>
                                <v-card-text>
                                    <v-img v-if="!!quote.brand" contain height="88vh"
                                           :src="`/storage/images/gautam-rice-mill/brands/${quote.brand.image}`"
                                           alt="Brand Image"></v-img>
                                </v-card-text>
                            </v-card>
                        </v-container>
                    </v-overlay>
                </v-card-text>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: "GautamRiceMillQuotations",
    data() {
        return {
            query: {
                page: 1,
                search: '',
                perPage: 10,
            },
            headers: [
                {text: "From", value: "from", width: "20%"},
                {text: "Product", value: "product", width: "30%"},
                {text: "Incoterms", value: "incoterm.title", width: "10%"},
                {text: "Container Size", value: "container.size", width: "10%"},
                {text: "Port", value: "port", width: "15%"},
                {text: "Received On", value: "receivedOn", width: "15%"},
                {text: "Actions", value: "actions", width: "15%"},
            ],
            options: {},
            viewQuote: false,
            overlay:false,
        }
    },
    computed: {
        ...mapGetters({
            accessToken: 'auth/accessToken'
        }),
        ...mapGetters("quotes", [
            "quoteList", "quotesPaginatedData", "isLoading", "isDeleting", "quote"
        ])
    },
    watch: {
        //this one will populate new data set when quote changes current page.
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
        ...mapActions("quotes", [
            "fetchAllQuotes", "deleteQuote", "fetchDetailQuote"
        ]),
        getDataFromApi() {
            this.fetchAllQuotes(this.query);
        },
        confirm(item) {
            const temp = this;
            this.$root.confirm('Confirm Delete', 'Are you sure you want to delete this message ?', {color: 'red'}).then((confirm) => {
                temp.deleteQuote(item.id);
                temp.getDataFromApi();
            }).catch((error) => {
                console.log(error);
            });
        },
        show(e) {
            const temp = this;
            this.fetchDetailQuote(e.id).then(function (response) {
                temp.viewQuote = true;
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
