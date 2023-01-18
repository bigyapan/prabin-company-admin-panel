const state = () => ({
    brands: [
        {
            id: null,
            title: "",
            description: "",
            image: [],
            is_customer: null,
            created_at: "",
            updated_at: ""
        }
    ],
    brandsPaginatedData: {
        data: [
            {
                id: null,
                title: "",
                description: "",
                image: [],
                is_customer: null,
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
        description: "",
        image: [],
        is_customer: null,
        created_at: "",
        updated_at: ""
    },
    brand: {
        id: null,
        title: "",
        description: "",
        image: [],
        is_customer: null,
        created_at: "",
        updated_at: ""
    },
    isCreating: false,
    createdData: {
        id: null,
        title: "",
        description: "",
        image: [],
        is_customer: null,
        created_at: "",
        updated_at: ""
    },
});

const mutations = {
    setBrandIsLoading(state, isLoading) {
        state.isLoading = isLoading;
    }, setBrands(state, brands) {
        state.brands = brands;
    }, setBrandsPaginated(state, brandsPaginatedData) {
        state.brandsPaginatedData = brandsPaginatedData;
    }, setBrandIsCreating(state, isCreating) {
        state.isCreating = isCreating;
    }, saveNewBrands(state, brand) {
        state.createdData = brand;
    }, setBrandIsUpdating(state, isUpdating) {
        state.isUpdating = isUpdating
    }, setBrandIsDeleting(state, isDeleting) {
        state.isDeleting = isDeleting
    }, saveUpdatedBrand(state, brand) {
        state.updatedData = brand;
    }, setBrandDetail: (state, brand) => {
        state.brand = brand
    },
    setDeleteBrand: (state, id) => {
        state.brandsPaginatedData.data.filter(x => x.id !== id);
    },

};

const actions = {
    async fetchDetailBrand(state, id) {
        state.commit('setBrandIsLoading', true);
        await axios.get(`${process.env.MIX_BACKEND_API_URL}grm-brands/${id}`, {
            headers: {
                Accept: "application/json", Authorization: "Bearer " + state.rootGetters['auth/accessToken']
            }
        }).then(res => {
            state.commit('setBrandDetail', res.data.data);
            state.commit('setBrandIsLoading', false);
        }).catch(err => {
            console.log('error', err);
            state.commit('setBrandIsLoading', false);
        });
    },
    async updateBrand(state, brand) {
        state.commit('setBrandIsUpdating', true);
        await axios.post(`${process.env.MIX_BACKEND_API_URL}grm-brands/${brand.get('id')}?_method=PUT`, brand, {
            headers: {
                Accept: 'application/json',
                "Content-Types": "multipart/form-data",
                Authorization: "Bearer " + state.rootGetters['auth/accessToken']
            }
        }).then(res => {
            state.commit('saveUpdatedBrand', res.data.data);
            state.commit('setBrandIsUpdating', false);
            state.dispatch('showSweetAlert',{
                position: 'top-end',
                type: 'success',
                title: 'Brand Updated',
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
            state.commit('setBrandIsUpdating', false);
            state.dispatch('showSweetAlert',{
                position: 'top-end',
                type: 'error',
                title: 'Brand Update Error',
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
    async storeBrand(state, brand) {
        state.commit('setBrandIsCreating', true);
        await axios.post(`${process.env.MIX_BACKEND_API_URL}grm-brands`, brand, {
            headers: {
                Accept: "application/json",
                "Content-Types": "multipart/form-data",
                Authorization: "Bearer " + state.rootGetters['auth/accessToken']
            }
        }).then(res => {
            state.commit('saveNewBrands', res.data.data);
            state.commit('setBrandIsCreating', false);
            state.dispatch('showSweetAlert',{
                position: 'top-end',
                type: 'success',
                title: 'Brand Created',
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
            state.commit('setBrandIsCreating', false);
            state.dispatch('showSweetAlert',{
                position: 'top-end',
                type: 'error',
                title: 'Brand Create Error',
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
    async fetchAllBrands(state, query = null) {
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
        state.commit('setBrandIsLoading', true);
        let url = `${process.env.MIX_BACKEND_API_URL}grm-brands`;
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
                const brands = res.data.data;
                state.commit('setBrands', brands);
                res.data.data.pagination = {
                    total: res.data.data.total,  // total number of elements or brands
                    per_page: res.data.data.per_page, // brands per page
                    current_page: res.data.data.current_page, // current page (it will be automatically updated when brandCategories clicks on some page number).
                    total_pages: res.data.data.last_page // total pages in record
                };
                state.commit('setBrandsPaginated', res.data.data);
                state.commit('setBrandIsLoading', false);
            })
            .catch(err => {
                console.log('error', err);
                state.commit('setBrandIsLoading', false);
            })

    }, async deleteBrand(state, id) {
        state.commit('setBrandIsDeleting', true);
        state.commit('setBrandIsLoading', true);
        await axios.delete(`${process.env.MIX_BACKEND_API_URL}grm-brands/${id}`, {
            headers: {
                Accept: "application/json", Authorization: "Bearer " + state.rootGetters['auth/accessToken']
            }
        })
            .then(res => {
                state.commit('setDeleteBrand', res.data.data.id);
                state.commit('setBrandIsDeleting', false);
                state.commit('setBrandIsLoading', false);
                state.dispatch('showSweetAlert',{
                    position: 'top-end',
                    type: 'success',
                    title: 'Brand Deleted',
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
                state.commit('setBrandIsDeleting', false);
                state.commit('setBrandIsLoading', false);
                state.dispatch('showSweetAlert',{
                    position: 'top-end',
                    type: 'error',
                    title: 'Brand Deletion Error',
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
    brandList: state => state.brands,
    brandsPaginatedData: state => state.brandsPaginatedData,
    isLoading: state => state.isLoading,
    updatedData: state => state.updatedData,
    brand: state => state.brand,
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

