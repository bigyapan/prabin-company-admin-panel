<template>
    <v-navigation-drawer
        app
        dark
        color="primary"
        width="20vw"
    >
        <v-list
                dark>
            <v-list-item
            >
                <v-list-item-content>
                    <h1 class="white--text">ADMIN PANEL</h1>
                </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <template
                v-for="item in items"
            >
                <template v-if="!item.submenu">
                    <v-list-item
                        active-class="secondary"
                        link
                        :to="item.to"
                        v-if="item.subitems === undefined || item.subitems.length === 0"
                    >
                        <v-list-item-icon>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <template v-else>
                        <v-subheader>{{ item.title.toUpperCase() }}</v-subheader>
                        <template v-for="subitem in item.subitems">
                            <v-list-item
                                active-class="secondary"
                                :to="subitem.to"
                            >
                                <v-list-item-icon>
                                    <v-icon>{{ subitem.icon }}</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title v-text="subitem.title"></v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </template>
                    </template>
                </template>
                <template v-else>
                    <v-list-group
                        active-class="white--text"
                        no-action
                        :prepend-icon="item.icon"
                    >
                        <template v-slot:activator>
                            <v-list-item-content>
                                <v-list-item-title>{{ item.title }}</v-list-item-title>
                            </v-list-item-content>
                        </template>
                        <v-list-item
                            active-class="white--text secondary"
                            v-for="subitem in item.subitems"
                            :key="subitem.title"
                            :to="subitem.to">
                            <v-list-item-icon>
                                <v-icon>{{ subitem.icon }}</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>{{ subitem.title }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-group>
                </template>
            </template>

        </v-list>
    </v-navigation-drawer>
</template>

<script>
export default {
    name: "NavigationDrawer",
    data() {
        return {
            items: [
                {title: 'Dashboard', icon: 'fa-solid fa-gauge', to: '/'},
                {
                    title: 'Gautam Rice Mill',
                    icon: 'fa-solid fa-bowl-rice',
                    to: '#',
                    subitems: [
                        {title: 'Contacts', icon: 'fa-solid fa-address-book', to: '/grm-contacts'},
                        {title: 'Quote Requests', icon: 'fa-solid fa-file-invoice', to: '/grm-quotations'}
                    ]
                },
                {
                    title: 'Resources',
                    icon: 'fa-solid fa-bowl-rice',
                    to: '#',
                    submenu: true,
                    subitems: [
                        {title: 'Brands', icon: 'fa-solid fa-address-book', to: '/grm-brands'},
                        {title: 'Incoterms', icon: 'fa-solid fa-file-invoice', to: '/grm-incoterms'},
                        {title: 'Containers', icon: 'fa-solid fa-file-invoice', to: '/grm-containers'},
                        {title: 'Packagings', icon: 'fa-solid fa-file-invoice', to: '/grm-packagings'}
                    ]
                }

            ],
        }
    }
}
</script>

<style scoped>

</style>
