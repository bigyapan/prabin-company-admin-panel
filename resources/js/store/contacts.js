const state = () => ({
    contacts: [{
        id: null, name: "", email: "", phone: "", subject: "", message: "", created_at: "", updated_at: ""
    }],
    contactsPaginatedData: {
        data: [{id: null, name: "", email: "", phone: "", subject: "", message: "", created_at: "", updated_at: ""}],
        pagination: {
            total: null, per_page: null, current_page: null, total_pages: null
        }
    },
    updatedData: {
        id: null, name: "", email: "", phone: "", subject: "", message: "", created_at: "", updated_at: ""
    },
    contact: {
        id: null, name: "", email: "", phone: "", subject: "", message: "", created_at: "", updated_at: ""
    },
    createdData: {
        id: null, name: "", email: "", phone: "", subject: "", message: "", created_at: "", updated_at: ""
    },
    isLoading: false,
    isUpdating: false,
    isDeleting: false,
    isCreating: false,
});

const mutations = {
    setContactIsLoading(state, isLoading) {
        state.isLoading = isLoading;
    }, setContacts(state, contacts) {
        state.contacts = contacts;
    }, setContactsPaginated(state, contactsPaginatedData) {
        state.contactsPaginatedData = contactsPaginatedData;
    }, setContactIsCreating(state, isCreating) {
        state.isCreating = isCreating;
    }, saveNewContacts(state, contact) {
        state.createdData = contact;
    }, setContactIsUpdating(state, isUpdating) {
        state.isUpdating = isUpdating
    }, setContactIsDeleting(state, isDeleting) {
        state.isDeleting = isDeleting
    }, saveUpdatedContact(state, contact) {
        state.updatedData = contact;
    }, setContactDetail: (state, contact) => {
        state.contact = contact
    },
    setDeleteContact: (state, id) => {
        state.contactsPaginatedData.data.filter(x => x.id !== id);
    },

};

const actions = {
    async fetchDetailContact(state, id) {
        state.commit('setContactIsLoading', true);
        await axios.get(`${process.env.MIX_BACKEND_API_URL}grm-contacts/${id}`, {
            headers: {
                Accept: "application/json", Authorization: "Bearer " + state.rootGetters['auth/accessToken']
            }
        }).then(res => {
            state.commit('setContactDetail', res.data.data);
            state.commit('setContactIsLoading', false);
        }).catch(err => {
            console.log('error', err);
            state.commit('setContactIsLoading', false);
        });
    },
    async updateContact(state, payload) {
        state.commit('setContactIsUpdating', true);
        await axios.post(`${process.env.MIX_BACKEND_API_URL}grm-contacts/${payload.id}?_method=PUT`, payload.formData, {
            headers: {
                Accept: 'application/json',
                "Content-Types": "multipart/form-data",
                Authorization: "Bearer " + state.rootGetters['auth/accessToken']
            }
        }).then(res => {
            state.commit('saveUpdatedContact', res.data.data);
            state.commit('setContactIsUpdating', false);
            state.dispatch('showSweetAlert',{
                position: 'top-end',
                type: 'success',
                title: 'Contact Updated',
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
            state.commit('setContactIsUpdating', false);
            state.dispatch('showSweetAlert',{
                position: 'top-end',
                type: 'error',
                title: 'Contact Update Error',
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
    async storeContact(state, contact) {
        state.commit('setContactIsCreating', true);
        await axios.post(`${process.env.MIX_BACKEND_API_URL}grm-contacts`, contact, {
            headers: {
                Accept: "application/json",
                "Content-Types": "multipart/form-data",
                Authorization: "Bearer " + state.rootGetters['auth/accessToken']
            }
        }).then(res => {
            state.commit('saveNewContacts', res.data.data);
            state.commit('setContactIsCreating', false);
            state.dispatch('showSweetAlert',{
                position: 'top-end',
                type: 'success',
                title: 'Contact Created',
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
            state.commit('setContactIsCreating', false);
            state.dispatch('showSweetAlert',{
                position: 'top-end',
                type: 'error',
                title: 'Contact Creation Error',
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
    async fetchAllContacts(state, query = null) {
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
        state.commit('setContactIsLoading', true);
        let url = `${process.env.MIX_BACKEND_API_URL}grm-contacts`;
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
                const contacts = res.data.data;
                state.commit('setContacts', contacts);
                res.data.data.pagination = {
                    total: res.data.data.total,  // total number of elements or contacts
                    per_page: res.data.data.per_page, // contacts per page
                    current_page: res.data.data.current_page, // current page (it will be automatically updated when contactCategories clicks on some page number).
                    total_pages: res.data.data.last_page // total pages in record
                };
                state.commit('setContactsPaginated', res.data.data);
                state.commit('setContactIsLoading', false);
            })
            .catch(err => {
                console.log('error', err);
                state.commit('setContactIsLoading', false);
            })

    },
    async deleteContact(state, id) {
        state.commit('setContactIsDeleting', true);
        await axios.delete(`${process.env.MIX_BACKEND_API_URL}grm-contacts/${id}`, {
            headers: {
                Accept: "application/json", Authorization: "Bearer " + state.rootGetters['auth/accessToken']
            }
        })
            .then(res => {
                state.commit('setDeleteContact', res.data.data.id);
                state.commit('setContactIsDeleting', false);
                state.dispatch('showSweetAlert',{
                    position: 'top-end',
                    type: 'success',
                    title: 'Contact Deleted',
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
                state.commit('setContactIsDeleting', false);
                state.dispatch('showSweetAlert',{
                    position: 'top-end',
                    type: 'error',
                    title: 'Contact Deletion Error',
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
    contactList: state => state.contacts,
    contactsPaginatedData: state => state.contactsPaginatedData,
    isLoading: state => state.isLoading,
    updatedData: state => state.updatedData,
    contact: state => state.contact,
    isUpdating: state => state.isUpdating,
    isDeleting: state => state.isDeleting,
};

export default {
    namespaced: true, state, mutations, actions, getters,
};

