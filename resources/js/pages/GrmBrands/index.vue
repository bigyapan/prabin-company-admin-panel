<template>
    <v-container fluid>
        <h1 class="display-1 font-weight-bold mb-8">Brands</h1>
        <v-card flat color="accent" class="pa-4">
            <v-container fluid>
                <v-row>
                    <v-col>
                        <v-data-table
                            :hide-default-footer="true"
                            :items="brandsPaginatedData.data"
                            :items-per-page="query.perPage"
                            :headers="headers"
                            :options.sync="options"
                            :page="query.page"
                            :pageCount="brandsPaginatedData.pagination.total_pages"
                            :server-items-length="brandsPaginatedData.pagination.total"
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
                                                <span>Add Brand</span>
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
                            <template v-slot:item.brand="{ item }">
                                <v-list-item class="ma-0 pa-0">
                                    <v-list-item-avatar>
                                        <img
                                            alt="user-image"
                                            :src="`/storage/images/gautam-rice-mill/brands/${item.image}`"
                                        >
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            {{ item.title }}
                                            <v-chip small color="primary"
                                                    v-if="!!item ? parseInt(item.is_customer)===1:false">
                                                Custom
                                            </v-chip>
                                        </v-list-item-title>
                                        <v-list-item-subtitle class="text-truncate" v-if="item.description">
                                            {{ item.description }}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
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
        <v-dialog scrollable width="45vw" v-model="viewBrand">
            <v-card tile>
                <v-toolbar dark flat color="primary">
                    <span class="headline">View Brand</span>
                    <v-spacer></v-spacer>
                    <v-btn @click="viewBrand=false" depressed fab x-small color="error">
                        <v-icon>fa-solid fa-xmark</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-container fluid>
                        <v-row align="stretch">
                            <v-col cols="7">
                                <v-card height="100%" flat color="accent">
                                    <v-card-title>
                                        <h3><b>{{ brand.title }}</b>
                                            <v-chip small color="primary"
                                                    v-if="!!brand ? parseInt(brand.is_customer)===1:false">
                                                Custom
                                            </v-chip>
                                        </h3>
                                    </v-card-title>
                                    <v-card-subtitle>
                                        <template v-if="!!brand.created_at">
                                            <v-icon small left>fa-solid fa-calendar-alt</v-icon>
                                            {{ new Date(brand.created_at).toLocaleDateString() }}
                                        </template>
                                    </v-card-subtitle>
                                    <v-card-subtitle>
                                        {{ brand.description }}
                                    </v-card-subtitle>
                                </v-card>
                            </v-col>
                            <v-col cols="5">
                                <v-card flat color="accent" class="py-4">
                                    <v-img
                                        contain
                                        :aspect-ratio="1"
                                        @click="overlay = !overlay"
                                        :src="`/storage/images/gautam-rice-mill/brands/${brand.image}`"
                                    ></v-img>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
            <v-overlay @click="overlay = false" opacity="0.95" :value="overlay">
                <v-container style="width:100vw" fluid>
                    <v-card flat color="transparent">
                        <v-card-title>
                            <v-spacer></v-spacer>
                            <v-btn @click.stop.prevent="overlay = false" depressed fab
                                   x-small color="error">
                                <v-icon>fas fa-xmark</v-icon>
                            </v-btn>
                        </v-card-title>
                        <v-card-text>
                            <v-img contain height="88vh"
                                   :src="imageUrl"
                                   alt="Brand Image"></v-img>
                        </v-card-text>
                    </v-card>
                </v-container>
            </v-overlay>
        </v-dialog>
        <v-dialog scrollable width="45vw" v-model="editBrand">
            <v-card tile>
                <v-toolbar dark flat color="primary">
                    <span v-if="mode==='create'" class="headline">Add Brand</span>
                    <span v-else class="headline">Edit Brand</span>
                    <v-spacer></v-spacer>
                    <v-btn @click="editBrand=false" depressed fab x-small color="error">
                        <v-icon>fa-solid fa-xmark</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="pt-4">
                    <v-form>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="brand.title"
                                    :error-messages="getErrors('title',$v.brand.title)"
                                    filled
                                    label="Title"
                                    placeholder="Enter your brand title here..."
                                    append-icon="fas fa-heading"
                                    title="title"
                                    @blur="$v.brand.title.$touch()"
                                ></v-text-field>

                            </v-col>
                            <v-col cols="12">
                                <v-textarea
                                    v-model="brand.description"
                                    filled
                                    label="Description"
                                    placeholder="Enter your brand description here..."
                                    append-icon="fas fa-list"
                                    title="description"
                                ></v-textarea>
                            </v-col>
                            <v-col cols="11">
                                <v-file-input
                                    v-model="imageFile"
                                    @change="previewImage($event)"
                                    chips
                                    counter
                                    filled
                                    show-size
                                    small-chips
                                    truncate-length="15"
                                    label="Brand Image"
                                    append-icon="fas fa-paperclip"
                                    prepend-icon=""
                                >
                                </v-file-input>
                            </v-col>
                            <v-col cols="1">
                                <v-img @click="overlay = !overlay" height="60" v-if="brand.image" contain
                                       :aspect-ratio="1"
                                       :src="imageUrl"></v-img>
                            </v-col>
                            <v-col cols="12">
                                <v-checkbox
                                    v-model="brand.is_customer"
                                    :true-value="1"
                                    :false-value="0"
                                    label="Is Custom Brand"
                                ></v-checkbox>
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
            <v-overlay @click="overlay = false" opacity="0.95" :value="overlay">
                <v-container style="width:100vw" fluid>
                    <v-card flat color="transparent">
                        <v-card-title>
                            <v-spacer></v-spacer>
                            <v-btn @click.stop.prevent="overlay = false" depressed fab
                                   x-small color="error">
                                <v-icon>fas fa-xmark</v-icon>
                            </v-btn>
                        </v-card-title>
                        <v-card-text>
                            <v-img contain height="88vh"
                                   :src="imageUrl"
                                   alt="Brand Image"></v-img>
                        </v-card-text>
                    </v-card>
                </v-container>
            </v-overlay>
        </v-dialog>

    </v-container>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {validationMixin} from "vuelidate";
import {required} from "vuelidate/lib/validators";

export default {
    name: "GrmBrands",
    data() {
        return {
            query: {
                page: 1,
                search: '',
                perPage: 10,
            },
            options: {},
            headers: [
                {text: "Brand", value: "brand"},
                {text: "Created At", value: "created_at"},
                {text: "Actions", value: "actions", width: "15%"},
            ],
            viewBrand: false,
            editBrand: false,
            overlay: false,
            imageUrl: "",
            imageFile: "",
            mode: ""
        };
    },
    mixins: [validationMixin],
    validations: {
        brand: {
            title: {
                required
            },
        },
    },
    watch: {
        //this one will populate new data set when brand changes current page.
        options: {
            handler(e) {
                this.query.page = e.page;
                this.query.perPage = e.itemsPerPage;
                this.getDataFromApi();
            },
            deep: true,
        },
        editBrand: {
            handler(e) {
                if (!e) {
                    this.mode = "";
                }
            }
        },
    },
    computed: {
        ...mapGetters("brands", [
            "brandList", "brandsPaginatedData", "isLoading", "isDeleting", "brand", "isUpdating", "updatedData", "isCreating"
        ]),
    },
    methods: {
        ...mapActions("brands", [
            "fetchAllBrands", "deleteBrand", "fetchDetailBrand", "updateBrand", "storeBrand"
        ]),
        async createFileFromUrl(url) {
            const response = await fetch(url);
            const blob = await response.blob();
            return new File([blob], this.brand.image);
        },
        previewImage(f) {
            let reader = new FileReader()
            reader.onload = (e) => {
                this.imageUrl = e.target.result
            }
            if (f && f.type.match('image.*')) {
                reader.readAsDataURL(f)
            }
        },
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
            this.fetchAllBrands(this.query);
        },
        confirm(item) {
            const temp = this;
            this.$root.confirm('Confirm Delete', `Are you sure you want to delete ${item.title} ?`, {color: 'red'}).then((confirm) => {
                temp.deleteBrand(item.id);
                temp.getDataFromApi();
            }).catch((error) => {
                console.log(error);
            });
        },
        show(e) {
            const temp = this;
            this.fetchDetailBrand(e.id).then(function (response) {
                temp.imageUrl = `/storage/images/gautam-rice-mill/brands/${temp.brand.image}`
                if (!!temp.brand.image) {
                    temp.imageFile = temp.createFileFromUrl(process.env.MIX_BACKEND_API_URL + `storage/images/gautam-rice-mill/brands/${temp.brand.image}`);
                }
                temp.viewBrand = true;
            }).catch(function (error) {
            });
        },
        edit(e) {
            const temp = this;
            this.fetchDetailBrand(e.id).then(async function (response) {
                temp.imageUrl = `/storage/images/gautam-rice-mill/brands/${temp.brand.image}`
                if (!!temp.brand.image) {
                    temp.imageFile = await temp.createFileFromUrl(process.env.MIX_BACKEND_API_URL + `storage/images/gautam-rice-mill/brands/${temp.brand.image}`);
                }
                temp.editBrand = true;
            }).catch(function (error) {
            });
        },
        onUpdate() {
            const temp = this;
            this.$v.$touch();
            if (!this.$v.$invalid) {
                const {id, title, description, is_customer} = this.brand;
                let formData = new FormData();
                formData.append('id', !!id ? id : '');
                formData.append('title', !!title ? title : '');
                formData.append('description', !!description ? description : '');
                formData.append('is_customer', !!is_customer ? is_customer : 0);
                if (!!temp.imageFile ? temp.imageFile.name !== temp.brand.image : false) {
                    formData.append('image', !!temp.imageFile ? temp.imageFile : '');
                } else {
                    if (!!temp.imageFile ? temp.imageFile.name === temp.brand.image : false) {
                        formData.append('image', 'no_update');
                    } else {
                        formData.append('image', '');
                    }
                }
                this.updateBrand(formData).then(function (response) {
                    temp.getDataFromApi();
                    temp.editBrand = false;
                }).catch(function (error) {
                });
            }
        },
        onCreate() {
            const temp = this;
            this.$v.$touch();
            if (!this.$v.$invalid) {
                const {title, description, is_customer} = this.brand;
                let formData = new FormData();
                formData.append('title', !!title ? title : '');
                formData.append('description', !!description ? description : '');
                formData.append('is_customer', !!is_customer ? is_customer : 0);
                formData.append('image', !!temp.imageFile ? temp.imageFile : '');
                this.storeBrand(formData).then(function (response) {
                    temp.getDataFromApi();
                    temp.editBrand = false;
                }).catch(function (error) {
                });
            }
        },
        add() {
            const here = this;
            here.mode = "create";
            here.imageFile = [];
            here.imageUrl = "";
            here.$store.commit('brands/setBrandDetail', {
                title: "",
                description: "",
                image: [],
                is_customer: 0,
            });
            here.editBrand = true;
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
