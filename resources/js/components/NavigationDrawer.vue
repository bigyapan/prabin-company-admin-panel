<template>
    <v-navigation-drawer
        app
        dark
        color="primary"
        width="20vw"
    >
        <v-list dark>
            <v-list-item>
                <v-list-item-content>
                    <h1 class="white--text">ADMIN PANEL</h1>
                </v-list-item-content>

            </v-list-item>
            <v-divider></v-divider>

            <template
                v-for="item in items"
            >
                <v-list-item
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
                   <v-subheader >{{item.title.toUpperCase()}}</v-subheader>
                   <template v-for="subitem in item.subitems">
                       <v-list-item
                           dark
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
                <v-divider></v-divider>
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
                }
            ]
        }
    }
}
</script>

<style scoped>

</style>
