const state = () => ({
    quotes: [{
        id: null,
        name: "",
        email: "",
        phone: "",
        port: "",
        brand_id: null,
        incoterm_id: null,
        packaging_id: null,
        container_id: null,
        created_at: "",
        updated_at: "",
        brand: {
            id: null,
            title: "",
            description: null,
            image: [],
            is_customer: null,
            created_at: "",
            updated_at: ""
        },
        incoterm: {
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
        container: {
            id: null,
            size: "",
            created_at: "",
            updated_at: ""
        }
    }], quotesPaginatedData: {
        data: [{
            id: null,
            name: "",
            email: "",
            phone: "",
            port: "",
            brand_id: null,
            incoterm_id: null,
            packaging_id: null,
            container_id: null,
            created_at: "",
            updated_at: "",
            brand: {
                id: null,
                title: "",
                description: null,
                image: [],
                is_customer: null,
                created_at: "",
                updated_at: ""
            },
            incoterm: {
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
            container: {
                id: null,
                size: "",
                created_at: "",
                updated_at: ""
            }
        }],
        pagination: {
            total: null, per_page: null, current_page: null, total_pages: null
        }
    }, updatedData: {
        id: null,
        name: "",
        email: "",
        phone: "",
        port: "",
        brand_id: null,
        incoterm_id: null,
        packaging_id: null,
        container_id: null,
        created_at: "",
        updated_at: "",
        brand: {
            id: null,
            title: "",
            description: null,
            image: [],
            is_customer: null,
            created_at: "",
            updated_at: ""
        },
        incoterm: {
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
        container: {
            id: null,
            size: "",
            created_at: "",
            updated_at: ""
        }
    }, quote: {
        id: null,
        name: "",
        email: "",
        phone: "",
        port: "",
        brand_id: null,
        incoterm_id: null,
        packaging_id: null,
        container_id: null,
        created_at: "",
        updated_at: "",
        brand: {
            id: null,
            title: "",
            description: null,
            image: [],
            is_customer: null,
            created_at: "",
            updated_at: ""
        },
        incoterm: {
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
        container: {
            id: null,
            size: "",
            created_at: "",
            updated_at: ""
        }
    }, createdData: {
        id: null,
        name: "",
        email: "",
        phone: "",
        port: "",
        brand_id: null,
        incoterm_id: null,
        packaging_id: null,
        container_id: null,
        created_at: "",
        updated_at: "",
        brand: {
            id: null,
            title: "",
            description: null,
            image: [],
            is_customer: null,
            created_at: "",
            updated_at: ""
        },
        incoterm: {
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
        container: {
            id: null,
            size: "",
            created_at: "",
            updated_at: ""
        }
    }, isLoading: false, isUpdating: false, isDeleting: false, isCreating: false,
});

const mutations = {
    setQuoteIsLoading(state, isLoading) {
        state.isLoading = isLoading;
    }, setQuotes(state, quotes) {
        state.quotes = quotes;
    }, setQuotesPaginated(state, quotesPaginatedData) {
        state.quotesPaginatedData = quotesPaginatedData;
    }, setQuoteIsCreating(state, isCreating) {
        state.isCreating = isCreating;
    }, saveNewQuotes(state, quote) {
        state.createdData = quote;
    }, setQuoteIsUpdating(state, isUpdating) {
        state.isUpdating = isUpdating
    }, setQuoteIsDeleting(state, isDeleting) {
        state.isDeleting = isDeleting
    }, saveUpdatedQuote(state, quote) {
        state.updatedData = quote;
    }, setQuoteDetail: (state, quote) => {
        state.quote = quote
    },
    setDeleteQuote: (state, id) => {
        state.quotesPaginatedData.data.filter(x => x.id !== id);
    },

};

const actions = {
    fetchDetailQuote(state, id) {
        return new Promise(((resolve, reject) => {
            state.commit('setQuoteIsLoading', true);
            axios.get(`${process.env.MIX_BACKEND_API_URL}grm-quotes/${id}`, {
                headers: {
                    Accept: "application/json", Authorization: "Bearer " + state.rootGetters['auth/accessToken']
                }
            }).then(res => {
                state.commit('setQuoteDetail', res.data.data);
                state.commit('setQuoteIsLoading', false);
                resolve(res);
            }).catch(err => {
                console.log('error', err);
                state.commit('setQuoteIsLoading', false);
                reject(err);
            });
        }))

    },
    async updateQuote(state, payload) {
        state.commit('setQuoteIsUpdating', true);
        await axios.post(`${process.env.MIX_BACKEND_API_URL}grm-quotes/${payload.id}?_method=PUT`, payload.formData, {
            headers: {
                Accept: 'application/json',
                "Content-Types": "multipart/form-data",
                Authorization: "Bearer " + state.rootGetters['auth/accessToken']
            }
        }).then(res => {
            state.commit('saveUpdatedQuote', res.data.data);
            state.commit('setQuoteIsUpdating', false);
            state.dispatch('showSweetAlert',{
                position: 'top-end',
                type: 'success',
                title: 'Quote Updated',
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
            state.commit('setQuoteIsUpdating', false);
            state.dispatch('showSweetAlert',{
                position: 'top-end',
                type: 'error',
                title: 'Quote Update Error',
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
    async storeQuote(state, quote) {
        state.commit('setQuoteIsCreating', true);
        await axios.post(`${process.env.MIX_BACKEND_API_URL}grm-quotes`, quote, {
            headers: {
                Accept: "application/json",
                "Content-Types": "multipart/form-data",
                Authorization: "Bearer " + state.rootGetters['auth/accessToken']
            }
        }).then(res => {
            state.commit('saveNewQuotes', res.data.data);
            state.commit('setQuoteIsCreating', false);
            state.dispatch('showSweetAlert',{
                position: 'top-end',
                type: 'success',
                title: 'Quote Created',
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
            state.commit('setQuoteIsCreating', false);
            state.dispatch('showSweetAlert',{
                position: 'top-end',
                type: 'error',
                title: 'Quote Creation Error',
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
    async fetchAllQuotes(state, query = null) {
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
        state.commit('setQuoteIsLoading', true);
        let url = `${process.env.MIX_BACKEND_API_URL}grm-quotes`;
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
                const quotes = res.data.data;
                state.commit('setQuotes', quotes);
                res.data.data.pagination = {
                    total: res.data.data.total,  // total number of elements or quotes
                    per_page: res.data.data.per_page, // quotes per page
                    current_page: res.data.data.current_page, // current page (it will be automatically updated when quoteCategories clicks on some page number).
                    total_pages: res.data.data.last_page // total pages in record
                };
                state.commit('setQuotesPaginated', res.data.data);
                state.commit('setQuoteIsLoading', false);
            })
            .catch(err => {
                console.log('error', err);
                state.commit('setQuoteIsLoading', false);
            })

    }, async deleteQuote(state, id) {
        state.commit('setQuoteIsLoading', true);
        await axios.delete(`${process.env.MIX_BACKEND_API_URL}grm-quotes/${id}`, {
            headers: {
                Accept: "application/json", Authorization: "Bearer " + state.rootGetters['auth/accessToken']
            }
        })
            .then(res => {
                state.commit('setDeleteQuote', res.data.data.id);
                state.commit('setQuoteIsLoading', false);
                state.dispatch('showSweetAlert',{
                    position: 'top-end',
                    type: 'success',
                    title: 'Quote Deleted',
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
                state.commit('setQuoteIsLoading', false);
                state.dispatch('showSweetAlert',{
                    position: 'top-end',
                    type: 'error',
                    title: 'Quote Deletion Error',
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
    quoteList: state => state.quotes,
    quotesPaginatedData: state => state.quotesPaginatedData,
    isLoading: state => state.isLoading,
    updatedData: state => state.updatedData,
    quote: state => state.quote,
    isUpdating: state => state.isUpdating,
    isDeleting: state => state.isDeleting,
};

export default {
    namespaced: true, state, mutations, actions, getters,
};

