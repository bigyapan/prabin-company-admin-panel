const state = () => ({
    packagings: [
        {
            id: null,
            title: "",
            created_at: "",
            updated_at: ""
        }
    ],
    packagingsPaginatedData: {
        data: [
            {
                id: null,
                title: "",
                created_at: "",
                updated_at: ""
            }
        ],
        pagination: {
            total: null,
            per_page: null,
            current_page: null,
            total_pages: null
        }
    },
    isLoading: false,
    isUpdating: false,
    isDeleting: false,
    updatedData: {
        id: null,
        title: "",
        created_at: "",
        updated_at: ""
    },
    packaging: {
        id: null,
        title: "",
        created_at: "",
        updated_at: ""
    },
    isCreating: false,
    createdData: {
        id: null,
        title: "",
        created_at: "",
        updated_at: ""
    },
});

const mutations = {
    setPackagingIsLoading(state, isLoading) {
        state.isLoading = isLoading;
    }, setPackagings(state, packagings) {
        state.packagings = packagings;
    }, setPackagingsPaginated(state, packagingsPaginatedData) {
        state.packagingsPaginatedData = packagingsPaginatedData;
    }, setPackagingIsCreating(state, isCreating) {
        state.isCreating = isCreating;
    }, saveNewPackagings(state, packaging) {
        state.createdData = packaging;
    }, setPackagingIsUpdating(state, isUpdating) {
        state.isUpdating = isUpdating
    }, setPackagingIsDeleting(state, isDeleting) {
        state.isDeleting = isDeleting
    }, saveUpdatedPackaging(state, packaging) {
        state.updatedData = packaging;
    }, setPackagingDetail: (state, packaging) => {
        state.packaging = packaging
    },
    setDeletePackaging: (state, id) => {
        state.packagingsPaginatedData.data.filter(x => x.id !== id);
    },

};

const actions = {
    async fetchDetailPackaging(state, id) {
        state.commit('setPackagingIsLoading', true);
        await axios.get(`${process.env.MIX_BACKEND_API_URL}grm-packagings/${id}`, {
            headers: {
                Accept: "application/json", Authorization: "Bearer " + state.rootGetters['auth/accessToken']
            }
        }).then(res => {
            state.commit('setPackagingDetail', res.data.data);
            state.commit('setPackagingIsLoading', false);
        }).catch(err => {
            console.log('error', err);
            state.commit('setPackagingIsLoading', false);
        });
    },
    async updatePackaging(state, packaging) {
        state.commit('setPackagingIsUpdating', true);
        await axios.post(`${process.env.MIX_BACKEND_API_URL}grm-packagings/${packaging.id}?_method=PUT`, packaging, {
            headers: {
                Accept: 'application/json',
                "Content-Types": "multipart/form-data",
                Authorization: "Bearer " + state.rootGetters['auth/accessToken']
            }
        }).then(res => {
            state.commit('saveUpdatedPackaging', res.data.data);
            state.commit('setPackagingIsUpdating', false);
            state.dispatch('showSweetAlert',{
                position: 'top-end',
                type: 'success',
                title: 'Packaging Updated',
                text: res.data.message,
                icon: 'success',
                toast: 'true',
                showConfirmButton: false,
                heightAuto: true,
                timer: 3000,
                timerProgressBar: true,
                showCloseButton: true,
            },{root: true});
        }).catch(err => {
            console.log('error', err);
            state.commit('setPackagingIsUpdating', false);
            state.dispatch('showSweetAlert',{
                position: 'top-end',
                type: 'error',
                title: 'Packaging Update Error',
                text: err.data.message,
                icon: 'error',
                toast: 'true',
                showConfirmButton: false,
                heightAuto: true,
                timer: 3000,
                timerProgressBar: true,
                showCloseButton: true,
            },{root: true})
        });
    },
    async storePackaging(state, packaging) {
        state.commit('setPackagingIsCreating', true);
        await axios.post(`${process.env.MIX_BACKEND_API_URL}grm-packagings`, packaging, {
            headers: {
                Accept: "application/json",
                "Content-Types": "multipart/form-data",
                Authorization: "Bearer " + state.rootGetters['auth/accessToken']
            }
        }).then(res => {
            state.commit('saveNewPackagings', res.data.data);
            state.commit('setPackagingIsCreating', false);
            state.dispatch('showSweetAlert',{
                position: 'top-end',
                type: 'success',
                title: 'Packaging Created',
                text: res.data.message,
                icon: 'success',
                toast: 'true',
                showConfirmButton: false,
                heightAuto: true,
                timer: 3000,
                timerProgressBar: true,
                showCloseButton: true,
            },{root: true});
        }).catch(err => {
            console.log('error', err);
            state.commit('setPackagingIsCreating', false);
            state.dispatch('showSweetAlert',{
                position: 'top-end',
                type: 'error',
                title: 'Packaging Creation Error',
                text: err.data.message,
                icon: 'error',
                toast: 'true',
                showConfirmButton: false,
                heightAuto: true,
                timer: 3000,
                timerProgressBar: true,
                showCloseButton: true,
            },{root: true})
        });
    },
    async fetchAllPackagings(state, query = null) {
        let page = '';
        let search = '';
        let perPage = '';
        let sortBy = '';
        let sortDesc = '';
        if (query != null) {
            page = query.page;
            search = query.search;
            perPage = query.perPage;
            sortBy = query.sortBy;
            sortDesc = query.sortDesc;
        }
        state.commit('setPackagingIsLoading', true);
        let url = `${process.env.MIX_BACKEND_API_URL}grm-packagings`;
        if (search === null || search.length <= 0) {
            url = `${url}?page=${page}&perPage=${perPage}&sortBy=${sortBy}&sortDesc=${sortDesc}`;
        } else {
            url = `${url}?page=${page}&perPage=${perPage}&sortBy=${sortBy}&sortDesc=${sortDesc}&search=${search}`;
        }

        await axios.get(url, {
            headers: {
                Accept: "application/json", Authorization: "Bearer " + state.rootGetters['auth/accessToken']
            }
        })
            .then(res => {
                const packagings = res.data.data;
                state.commit('setPackagings', packagings);
                res.data.data.pagination = {
                    total: res.data.data.total,  // total number of elements or packagings
                    per_page: res.data.data.per_page, // packagings per page
                    current_page: res.data.data.current_page, // current page (it will be automatically updated when packagingCategories clicks on some page number).
                    total_pages: res.data.data.last_page // total pages in record
                };
                state.commit('setPackagingsPaginated', res.data.data);
                state.commit('setPackagingIsLoading', false);
            })
            .catch(err => {
                console.log('error', err);
                state.commit('setPackagingIsLoading', false);
            })

    }, async deletePackaging(state, id) {
        state.commit('setPackagingIsDeleting', true);
        state.commit('setPackagingIsLoading', true);
        await axios.delete(`${process.env.MIX_BACKEND_API_URL}grm-packagings/${id}`, {
            headers: {
                Accept: "application/json", Authorization: "Bearer " + state.rootGetters['auth/accessToken']
            }
        })
            .then(res => {
                state.commit('setDeletePackaging', res.data.data.id);
                state.commit('setPackagingIsDeleting', false);
                state.commit('setPackagingIsLoading', false);
                state.dispatch('showSweetAlert',{
                    position: 'top-end',
                    type: 'success',
                    title: 'Packaging Deleted',
                    text: res.data.message,
                    icon: 'success',
                    toast: 'true',
                    showConfirmButton: false,
                    heightAuto: true,
                    timer: 3000,
                    timerProgressBar: true,
                    showCloseButton: true,
                },{root: true});
            }).catch(err => {
                console.log('error', err);
                state.commit('setPackagingIsDeleting', false);
                state.commit('setPackagingIsLoading', false);
                state.dispatch('showSweetAlert',{
                    position: 'top-end',
                    type: 'error',
                    title: 'Packaging Deletion Error',
                    text: err.data.message,
                    icon: 'error',
                    toast: 'true',
                    showConfirmButton: false,
                    heightAuto: true,
                    timer: 3000,
                    timerProgressBar: true,
                    showCloseButton: true,
                },{root: true})
            });
    },

};

const getters = {
    packagingList: state => state.packagings,
    packagingsPaginatedData: state => state.packagingsPaginatedData,
    isLoading: state => state.isLoading,
    updatedData: state => state.updatedData,
    packaging: state => state.packaging,
    isUpdating: state => state.isUpdating,
    isDeleting: state => state.isDeleting,
    isCreating: state => state.isCreating,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};

