<template>
    <v-container fluid>
        <h1 class="display-1 font-weight-bold mb-8">Incoterms</h1>
        <v-card flat color="accent" class="pa-4">
            <v-container fluid>
                <v-row>
                    <v-col>
                        <v-data-table
                            :hide-default-footer="true"
                            :items="incotermsPaginatedData.data"
                            :items-per-page="query.perPage"
                            :headers="headers"
                            :options.sync="options"
                            :page="query.page"
                            :pageCount="incotermsPaginatedData.pagination.total_pages"
                            :server-items-length="incotermsPaginatedData.pagination.total"
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
                                        <v-col cols="2">
                                            <v-btn @click="add" depressed color="primary">
                                                <v-icon left>fas fa-add</v-icon>
                                                <span>Add Incoterm</span>
                                            </v-btn>
                                        </v-col>
                                        <v-spacer></v-spacer>
                                        <v-col cols="6">
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
                                <v-btn @click.stop.prevent="edit(item)" icon>
                                    <v-icon>fa-solid fa-pencil-alt</v-icon>
                                </v-btn>
                                <v-btn @click.stop.prevent="confirm(item)" color="error" icon>
                                    <v-icon>fa-solid fa-trash-alt</v-icon>
                                </v-btn>
                            </template>
                            <template v-slot:item.created_at="{ item }">
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
        <v-dialog scrollable width="45vw" v-model="viewIncoterm">
            <v-card tile>
                <v-toolbar dark flat color="primary">
                    <span class="headline">View Incoterm</span>
                    <v-spacer></v-spacer>
                    <v-btn @click="viewIncoterm=false" depressed fab x-small color="error">
                        <v-icon>fa-solid fa-xmark</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-container fluid>
                        <v-row align="stretch">
                            <v-col cols="12">
                                <v-card height="100%" flat color="accent">
                                    <v-card-title>
                                        <h3><b>{{ incoterm.title }}</b>
                                        </h3>
                                    </v-card-title>
                                    <v-card-subtitle>
                                        <template v-if="!!incoterm.created_at">
                                            <v-icon small left>fa-solid fa-calendar-alt</v-icon>
                                            {{ new Date(incoterm.created_at).toLocaleDateString() }}
                                        </template>
                                    </v-card-subtitle>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog scrollable width="45vw" v-model="editIncoterm">
            <v-card tile>
                <v-toolbar dark flat color="primary">
                    <span v-if="mode==='create'" class="headline">Add Incoterm</span>
                    <span v-else class="headline">Edit Incoterm</span>
                    <v-spacer></v-spacer>
                    <v-btn @click="editIncoterm=false" depressed fab x-small color="error">
                        <v-icon>fa-solid fa-xmark</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="pt-4">
                    <v-form>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="incoterm.title"
                                    :error-messages="getErrors('title',$v.incoterm.title)"
                                    filled
                                    label="Title"
                                    placeholder="Enter your incoterm title here..."
                                    append-icon="fas fa-heading"
                                    title="title"
                                    @blur="$v.incoterm.title.$touch()"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="submit" class="px-4" x-large depressed color="primary">
                        Submit
                        <v-icon right>fas fa-paper-plane</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {validationMixin} from "vuelidate";
import {required} from "vuelidate/lib/validators";

export default {
    name: "GrmIncoterms",
    data() {
        return {
            query: {
                page: 1,
                search: '',
                perPage: 10,
            },
            options: {},
            headers: [
                {text: "Incoterm Title", value: "title"},
                {text: "Created At", value: "created_at"},
                {text: "Actions", value: "actions", width: "15%"},
            ],
            viewIncoterm: false,
            editIncoterm: false,
            mode: ""
        };
    },
    mixins: [validationMixin],
    validations: {
        incoterm: {
            title: {
                required
            },
        },
    },
    watch: {
        //this one will populate new data set when incoterm changes current page.
        options: {
            handler(e) {
                this.query.page = e.page;
                this.query.perPage = e.itemsPerPage;
                this.getDataFromApi();
            },
            deep: true,
        },
        editIncoterm: {
            handler(e) {
                if (!e) {
                    this.mode = "";
                }
            }
        },
    },
    computed: {
        ...mapGetters("incoterms", [
            "incotermList", "incotermsPaginatedData", "isLoading", "isDeleting", "incoterm", "isUpdating", "updatedData", "isCreating"
        ]),
    },
    methods: {
        ...mapActions("incoterms", [
            "fetchAllIncoterms", "deleteIncoterm", "fetchDetailIncoterm", "updateIncoterm", "storeIncoterm"
        ]),
        getErrors(name, model) {
            const errors = [];
            if (!model.$dirty) return errors;
            switch (name) {
                case "title":
                    !model.required && errors.push("Title is required");
                    break;
                default:
                    break;
            }
            return errors;
        },
        getDataFromApi() {
            this.fetchAllIncoterms(this.query);
        },
        confirm(item) {
            const temp = this;
            this.$root.confirm('Confirm Delete', `Are you sure you want to delete ${item.title} ?`, {color: 'red'}).then((confirm) => {
                temp.deleteIncoterm(item.id);
                temp.getDataFromApi();
            }).catch((error) => {
                console.log(error);
            });
        },
        show(e) {
            const temp = this;
            this.fetchDetailIncoterm(e.id).then(function (response) {
                temp.viewIncoterm = true;
            }).catch(function (error) {
            });
        },
        edit(e) {
            const temp = this;
            this.fetchDetailIncoterm(e.id).then(async function (response) {
                temp.editIncoterm = true;
            }).catch(function (error) {
            });
        },
        onUpdate() {
            const temp = this;
            this.$v.$touch();
            if (!this.$v.$invalid) {
                const {id, title} = this.incoterm;
                this.updateIncoterm({
                    id: !!id ? id : null,
                    title: !!title ? title : "",
                }).then(function (response) {

                    temp.getDataFromApi();
                    temp.editIncoterm = false;
                }).catch(function (error) {
                });
            }
        },
        onCreate() {
            const temp = this;
            this.$v.$touch();
            if (!this.$v.$invalid) {
                const {title} = this.incoterm;
                this.storeIncoterm({
                    title: !!title ? title : "",
                }).then(function (response) {
                    temp.getDataFromApi();
                    temp.editIncoterm = false;
                }).catch(function (error) {
                });
            }
        },
        add() {
            const here = this;
            here.mode = "create";
            here.$store.commit('incoterms/setIncotermDetail', {
                title: "",
            });
            here.editIncoterm = true;
        },
        submit() {
            if (this.mode === "create") {
                this.onCreate();
            } else {
                this.onUpdate();
            }
        }
    },
    mounted() {
        this.getDataFromApi();
    }

}
</script>

<style scoped>

</style>
