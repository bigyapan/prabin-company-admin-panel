const state = () => ({
    containers: [
        {
            id: null,
            size: "",
            created_at: "",
            updated_at: ""
        }
    ],
    containersPaginatedData: {
        data: [
            {
                id: null,
                size: "",
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
        size: "",
        created_at: "",
        updated_at: ""
    },
    container: {
        id: null,
        size: "",
        created_at: "",
        updated_at: ""
    },
    isCreating: false,
    createdData: {
        id: null,
        size: "",
        created_at: "",
        updated_at: ""
    },
});

const mutations = {
    setContainerIsLoading(state, isLoading) {
        state.isLoading = isLoading;
    }, setContainers(state, containers) {
        state.containers = containers;
    }, setContainersPaginated(state, containersPaginatedData) {
        state.containersPaginatedData = containersPaginatedData;
    }, setContainerIsCreating(state, isCreating) {
        state.isCreating = isCreating;
    }, saveNewContainers(state, container) {
        state.createdData = container;
    }, setContainerIsUpdating(state, isUpdating) {
        state.isUpdating = isUpdating
    }, setContainerIsDeleting(state, isDeleting) {
        state.isDeleting = isDeleting
    }, saveUpdatedContainer(state, container) {
        state.updatedData = container;
    }, setContainerDetail: (state, container) => {
        state.container = container
    },
    setDeleteContainer: (state, id) => {
        state.containersPaginatedData.data.filter(x => x.id !== id);
    },

};

const actions = {
    async fetchDetailContainer(state, id) {
        state.commit('setContainerIsLoading', true);
        await axios.get(`${process.env.MIX_BACKEND_API_URL}grm-containers/${id}`, {
            headers: {
                Accept: "application/json", Authorization: "Bearer " + state.rootGetters['auth/accessToken']
            }
        }).then(res => {
            state.commit('setContainerDetail', res.data.data);
            state.commit('setContainerIsLoading', false);
        }).catch(err => {
            console.log('error', err);
            state.commit('setContainerIsLoading', false);
        });
    },
    async updateContainer(state, container) {
        state.commit('setContainerIsUpdating', true);
        await axios.post(`${process.env.MIX_BACKEND_API_URL}grm-containers/${container.id}?_method=PUT`, container, {
            headers: {
                Accept: 'application/json',
                "Content-Types": "multipart/form-data",
                Authorization: "Bearer " + state.rootGetters['auth/accessToken']
            }
        }).then(res => {
            state.commit('saveUpdatedContainer', res.data.data);
            state.commit('setContainerIsUpdating', false);
            state.dispatch('showSweetAlert',{
                position: 'top-end',
                type: 'success',
                title: 'Container Updated',
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
            state.commit('setContainerIsUpdating', false);
            state.dispatch('showSweetAlert',{
                position: 'top-end',
                type: 'error',
                title: 'Container Update Error',
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
    async storeContainer(state, container) {
        state.commit('setContainerIsCreating', true);
        await axios.post(`${process.env.MIX_BACKEND_API_URL}grm-containers`, container, {
            headers: {
                Accept: "application/json",
                "Content-Types": "multipart/form-data",
                Authorization: "Bearer " + state.rootGetters['auth/accessToken']
            }
        }).then(res => {
            state.commit('saveNewContainers', res.data.data);
            state.commit('setContainerIsCreating', false);
            state.dispatch('showSweetAlert',{
                position: 'top-end',
                type: 'success',
                title: 'Container Created',
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
            state.commit('setContainerIsCreating', false);
            state.dispatch('showSweetAlert',{
                position: 'top-end',
                type: 'error',
                title: 'Container Creation Error',
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
    async fetchAllContainers(state, query = null) {
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
        state.commit('setContainerIsLoading', true);
        let url = `${process.env.MIX_BACKEND_API_URL}grm-containers`;
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
                const containers = res.data.data;
                state.commit('setContainers', containers);
                res.data.data.pagination = {
                    total: res.data.data.total,  // total number of elements or containers
                    per_page: res.data.data.per_page, // containers per page
                    current_page: res.data.data.current_page, // current page (it will be automatically updated when containerCategories clicks on some page number).
                    total_pages: res.data.data.last_page // total pages in record
                };
                state.commit('setContainersPaginated', res.data.data);
                state.commit('setContainerIsLoading', false);
            })
            .catch(err => {
                console.log('error', err);
                state.commit('setContainerIsLoading', false);
            })

    }, async deleteContainer(state, id) {
        state.commit('setContainerIsDeleting', true);
        state.commit('setContainerIsLoading', true);
        await axios.delete(`${process.env.MIX_BACKEND_API_URL}grm-containers/${id}`, {
            headers: {
                Accept: "application/json", Authorization: "Bearer " + state.rootGetters['auth/accessToken']
            }
        })
            .then(res => {
                state.commit('setDeleteContainer', res.data.data.id);
                state.commit('setContainerIsDeleting', false);
                state.commit('setContainerIsLoading', false);
                state.dispatch('showSweetAlert',{
                    position: 'top-end',
                    type: 'success',
                    title: 'Container Deleted',
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
                state.commit('setContainerIsDeleting', false);
                state.commit('setContainerIsLoading', false);
                state.dispatch('showSweetAlert',{
                    position: 'top-end',
                    type: 'error',
                    title: 'Container Deletion Error',
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
    containerList: state => state.containers,
    containersPaginatedData: state => state.containersPaginatedData,
    isLoading: state => state.isLoading,
    updatedData: state => state.updatedData,
    container: state => state.container,
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

