<template>
    <v-container fluid>
        <h1 class="display-1 font-weight-bold mb-8">Containers</h1>
        <v-card flat color="accent" class="pa-4">
            <v-container fluid>
                <v-row>
                    <v-col>
                        <v-data-table
                            :hide-default-footer="true"
                            :items="containersPaginatedData.data"
                            :items-per-page="query.perPage"
                            :headers="headers"
                            :options.sync="options"
                            :page="query.page"
                            :pageCount="containersPaginatedData.pagination.total_pages"
                            :server-items-length="containersPaginatedData.pagination.total"
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
                                                <span>Add Container</span>
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
        <v-dialog scrollable width="45vw" v-model="viewContainer">
            <v-card tile>
                <v-toolbar dark flat color="primary">
                    <span class="headline">View Container</span>
                    <v-spacer></v-spacer>
                    <v-btn @click="viewContainer=false" depressed fab x-small color="error">
                        <v-icon>fa-solid fa-xmark</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-container fluid>
                        <v-row align="stretch">
                            <v-col cols="12">
                                <v-card height="100%" flat color="accent">
                                    <v-card-title>
                                        <h3><b>{{ container.size }}</b>
                                        </h3>
                                    </v-card-title>
                                    <v-card-subtitle>
                                        <template v-if="!!container.created_at">
                                            <v-icon small left>fa-solid fa-calendar-alt</v-icon>
                                            {{ new Date(container.created_at).toLocaleDateString() }}
                                        </template>
                                    </v-card-subtitle>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog scrollable width="45vw" v-model="editContainer">
            <v-card tile>
                <v-toolbar dark flat color="primary">
                    <span v-if="mode==='create'" class="headline">Add Container</span>
                    <span v-else class="headline">Edit Container</span>
                    <v-spacer></v-spacer>
                    <v-btn @click="editContainer=false" depressed fab x-small color="error">
                        <v-icon>fa-solid fa-xmark</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="pt-4">
                    <v-form>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="container.size"
                                    :error-messages="getErrors('size',$v.container.size)"
                                    filled
                                    label="Container Size"
                                    placeholder="Enter your container size here..."
                                    append-icon="fas fa-heading"
                                    title="size"
                                    @blur="$v.container.size.$touch()"
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
    name: "GrmContainers",
    data() {
        return {
            query: {
                page: 1,
                search: '',
                perPage: 10,
            },
            options: {},
            headers: [
                {text: "Container Size", value: "size"},
                {text: "Created At", value: "created_at"},
                {text: "Actions", value: "actions", width: "15%"},
            ],
            viewContainer: false,
            editContainer: false,
            mode: ""
        };
    },
    mixins: [validationMixin],
    validations: {
        container: {
            size: {
                required
            },
        },
    },
    watch: {
        //this one will populate new data set when container changes current page.
        options: {
            handler(e) {
                this.query.page = e.page;
                this.query.perPage = e.itemsPerPage;
                this.getDataFromApi();
            },
            deep: true,
        },
        editContainer: {
            handler(e) {
                if (!e) {
                    this.mode = "";
                }
            }
        },
    },
    computed: {
        ...mapGetters("containers", [
            "containerList", "containersPaginatedData", "isLoading", "isDeleting", "container", "isUpdating", "updatedData", "isCreating"
        ]),
    },
    methods: {
        ...mapActions("containers", [
            "fetchAllContainers", "deleteContainer", "fetchDetailContainer", "updateContainer", "storeContainer"
        ]),
        getErrors(name, model) {
            const errors = [];
            if (!model.$dirty) return errors;
            switch (name) {
                case "size":
                    !model.required && errors.push("Size is required");
                    break;
                default:
                    break;
            }
            return errors;
        },
        getDataFromApi() {
            this.fetchAllContainers(this.query);
        },
        confirm(item) {
            const temp = this;
            this.$root.confirm('Confirm Delete', `Are you sure you want to delete the container?`, {color: 'red'}).then((confirm) => {
                temp.deleteContainer(item.id);
                temp.getDataFromApi();
            }).catch((error) => {
                console.log(error);
            });
        },
        show(e) {
            const temp = this;
            this.fetchDetailContainer(e.id).then(function (response) {
                temp.viewContainer = true;
            }).catch(function (error) {
            });
        },
        edit(e) {
            const temp = this;
            this.fetchDetailContainer(e.id).then(async function (response) {
                temp.editContainer = true;
            }).catch(function (error) {
            });
        },
        onUpdate() {
            const temp = this;
            this.$v.$touch();
            if (!this.$v.$invalid) {
                const {id, size} = this.container;
                this.updateContainer({
                    id: !!id ? id : null,
                    size: !!size ? size : "",
                }).then(function (response) {

                    temp.getDataFromApi();
                    temp.editContainer = false;
                }).catch(function (error) {
                });
            }
        },
        onCreate() {
            const temp = this;
            this.$v.$touch();
            if (!this.$v.$invalid) {
                const {size} = this.container;
                this.storeContainer({
                    size: !!size ? size : "",
                }).then(function (response) {
                    temp.getDataFromApi();
                    temp.editContainer = false;
                }).catch(function (error) {
                });
            }
        },
        add() {
            const here = this;
            here.mode = "create";
            here.$store.commit('containers/setContainerDetail', {
                size: "",
            });
            here.editContainer = true;
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
