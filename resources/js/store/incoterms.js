const state = () => ({
    incoterms: [
        {
            id: null,
            title: "",
            created_at: "",
            updated_at: ""
        }
    ],
    incotermsPaginatedData: {
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
    incoterm: {
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
    setIncotermIsLoading(state, isLoading) {
        state.isLoading = isLoading;
    }, setIncoterms(state, incoterms) {
        state.incoterms = incoterms;
    }, setIncotermsPaginated(state, incotermsPaginatedData) {
        state.incotermsPaginatedData = incotermsPaginatedData;
    }, setIncotermIsCreating(state, isCreating) {
        state.isCreating = isCreating;
    }, saveNewIncoterms(state, incoterm) {
        state.createdData = incoterm;
    }, setIncotermIsUpdating(state, isUpdating) {
        state.isUpdating = isUpdating
    }, setIncotermIsDeleting(state, isDeleting) {
        state.isDeleting = isDeleting
    }, saveUpdatedIncoterm(state, incoterm) {
        state.updatedData = incoterm;
    }, setIncotermDetail: (state, incoterm) => {
        state.incoterm = incoterm
    },
    setDeleteIncoterm: (state, id) => {
        state.incotermsPaginatedData.data.filter(x => x.id !== id);
    },

};

const actions = {
    async fetchDetailIncoterm(state, id) {
        state.commit('setIncotermIsLoading', true);
        await axios.get(`${process.env.MIX_BACKEND_API_URL}grm-incoterms/${id}`, {
            headers: {
                Accept: "application/json", Authorization: "Bearer " + state.rootGetters['auth/accessToken']
            }
        }).then(res => {
            state.commit('setIncotermDetail', res.data.data);
            state.commit('setIncotermIsLoading', false);
        }).catch(err => {
            console.log('error', err);
            state.commit('setIncotermIsLoading', false);
        });
    },
    async updateIncoterm(state, incoterm) {
        state.commit('setIncotermIsUpdating', true);
        await axios.post(`${process.env.MIX_BACKEND_API_URL}grm-incoterms/${incoterm.id}?_method=PUT`, incoterm, {
            headers: {
                Accept: 'application/json',
                "Content-Types": "multipart/form-data",
                Authorization: "Bearer " + state.rootGetters['auth/accessToken']
            }
        }).then(res => {
            state.commit('saveUpdatedIncoterm', res.data.data);
            state.commit('setIncotermIsUpdating', false);
            state.dispatch('showSweetAlert',{
                position: 'top-end',
                type: 'success',
                title: 'Incoterm Updated',
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
            state.commit('setIncotermIsUpdating', false);
            state.dispatch('showSweetAlert',{
                position: 'top-end',
                type: 'error',
                title: 'Incoterm Update Error',
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
    async storeIncoterm(state, incoterm) {
        state.commit('setIncotermIsCreating', true);
        await axios.post(`${process.env.MIX_BACKEND_API_URL}grm-incoterms`, incoterm, {
            headers: {
                Accept: "application/json",
                "Content-Types": "multipart/form-data",
                Authorization: "Bearer " + state.rootGetters['auth/accessToken']
            }
        }).then(res => {
            state.commit('saveNewIncoterms', res.data.data);
            state.commit('setIncotermIsCreating', false);
            state.dispatch('showSweetAlert',{
                position: 'top-end',
                type: 'success',
                title: 'Incoterm Created',
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
            state.commit('setIncotermIsCreating', false);
            state.dispatch('showSweetAlert',{
                position: 'top-end',
                type: 'error',
                title: 'Incoterm Creation Error',
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
    async fetchAllIncoterms(state, query = null) {
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
        state.commit('setIncotermIsLoading', true);
        let url = `${process.env.MIX_BACKEND_API_URL}grm-incoterms`;
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
                const incoterms = res.data.data;
                state.commit('setIncoterms', incoterms);
                res.data.data.pagination = {
                    total: res.data.data.total,  // total number of elements or incoterms
                    per_page: res.data.data.per_page, // incoterms per page
                    current_page: res.data.data.current_page, // current page (it will be automatically updated when incotermCategories clicks on some page number).
                    total_pages: res.data.data.last_page // total pages in record
                };
                state.commit('setIncotermsPaginated', res.data.data);
                state.commit('setIncotermIsLoading', false);
            })
            .catch(err => {
                console.log('error', err);
                state.commit('setIncotermIsLoading', false);
            })

    }, async deleteIncoterm(state, id) {
        state.commit('setIncotermIsDeleting', true);
        state.commit('setIncotermIsLoading', true);
        await axios.delete(`${process.env.MIX_BACKEND_API_URL}grm-incoterms/${id}`, {
            headers: {
                Accept: "application/json", Authorization: "Bearer " + state.rootGetters['auth/accessToken']
            }
        })
            .then(res => {
                state.commit('setDeleteIncoterm', res.data.data.id);
                state.commit('setIncotermIsDeleting', false);
                state.commit('setIncotermIsLoading', false);
                state.dispatch('showSweetAlert',{
                    position: 'top-end',
                    type: 'success',
                    title: 'Incoterm Deleted',
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
                state.commit('setIncotermIsDeleting', false);
                state.commit('setIncotermIsLoading', false);
                state.dispatch('showSweetAlert',{
                    position: 'top-end',
                    type: 'error',
                    title: 'Incoterm Deletion Error',
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
    incotermList: state => state.incoterms,
    incotermsPaginatedData: state => state.incotermsPaginatedData,
    isLoading: state => state.isLoading,
    updatedData: state => state.updatedData,
    incoterm: state => state.incoterm,
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

