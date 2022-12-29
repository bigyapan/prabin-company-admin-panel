<template>
    <v-container fluid>
        <h1 class="display-1 font-weight-bold mb-8">Quote Requests</h1>
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
                            Add Quote
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-data-table
                            :items="quotes"
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
                            <template v-slot:item.product="{ item }">
                                <v-list-item class="ma-0 pa-0">
                                    <v-list-item-content>
                                        <v-list-item-title>{{
                                                !!item.brand ? item.brand.title : 'N/A'
                                            }}
                                            <v-chip small color="primary"
                                                    v-if="!!item.brand ? item.brand.is_customer:false">Custom
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
                                        <v-list-item-subtitle>{{ formatDate(item.created_at) }}</v-list-item-subtitle>
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
                    <h3><b>{{ quote.brand.title }}</b></h3>
                    <v-spacer></v-spacer>
                    <v-col v-if="!!quote.created_at" cols="auto">
                        <v-icon left>fa-solid fa-calendar-alt</v-icon>
                        {{ formatDate(quote.created_at) }}
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
                                            <v-img @click="overlay = !overlay"
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
                        <v-container fluid>
                            <v-row>
                                <v-spacer></v-spacer>
                                <v-col cols="auto">
                                    <v-btn @click.stop.prevent="overlay = false" depressed fab x-small color="error">
                                        <v-icon>fa-solid fa-xmark</v-icon>
                                    </v-btn>
                                </v-col>
                                <v-col cols="12">
                                    <v-img contain height="90vh"
                                           :src="`/storage/images/gautam-rice-mill/brands/${quote.brand.image}`"
                                           alt="Brand Image"></v-img>
                                </v-col>
                            </v-row>

                        </v-container>
                    </v-overlay>
                </v-card-text>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    name: "GautamRiceMillQuotations",
    data() {
        return {
            quotes: [],
            headers: [
                {text: "From", value: "from", width: "20%"},
                {text: "Product", value: "product", width: "30%"},
                {text: "Incoterms", value: "incoterm.title", width: "10%"},
                {text: "Container Size", value: "container.size", width: "10%"},
                {text: "Port", value: "port", width: "15%"},
                {text: "Received On", value: "receivedOn", width: "15%"},
                {text: "Actions", value: "actions", width: "15%"},
            ],
            isLoading: false,
            search: null,
            viewQuote: false,
            quote: {
                brand: {},
                incoterm: {},
                packaging: {},
                container: {},
            },
            selected: [],
            overlay: false,
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
        getQuotes() {
            const here = this;
            this.isLoading = true;
            axios.get(process.env.MIX_BACKEND_API_URL + 'grm-quotes', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + here.accessToken
                }
            }).then(response => {
                here.quotes = response.data.data;
                this.isLoading = false;
            }).catch(error => {
                this.isLoading = false;
            })
        },
        show(e) {
            const here = this;
            this.getQuote(e);
        },
        getQuote(e) {
            const here = this;
            this.isLoading = true;
            axios.get(process.env.MIX_BACKEND_API_URL + 'grm-quotes/' + e.id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + here.accessToken
                }
            }).then(response => {
                here.quote = response.data.data;
                this.viewQuote = true;
                this.isLoading = false;
            }).catch(error => {
                this.isLoading = false;
            })
        },
        destroy(e) {
            const here = this;
            this.$root.confirm('Confirm Delete', 'Are you sure you want to delete this message ?', {color: 'red'}).then((confirm) => {
                axios.delete(process.env.MIX_BACKEND_API_URL + 'grm-quotes/' + e.id, {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer " + here.accessToken
                    }
                })
                    .then(response => {
                        here.getQuotes();
                    });
            }).catch((error) => {
                console.log(error);
            });
        }
    },
    mounted() {
        this.getQuotes();
    }

}
</script>

<style scoped>

</style>
