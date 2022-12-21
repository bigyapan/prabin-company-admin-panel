<template>
    <v-dialog v-model="dialog" :max-width="options.width" :style="{ zIndex: options.zIndex }" @keydown.esc="cancel">
        <v-toolbar dark flat color="primary">
            <span class="headline">{{ title }}</span>
            <v-spacer></v-spacer>
            <v-btn @click.native="cancel" depressed fab x-small color="error">
                <v-icon>fa-solid fa-xmark</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card class="pt-4" tile>
            <v-card-text><span>{{ message }}</span>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" depressed @click.native="cancel">Cancel</v-btn>
                <v-btn color="primary" depressed
                       @click.native="agree">Confirm
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
/**
 * Vuetify Confirm Dialog component
 *
 * Insert component where you want to use it:
 * <confirm ref="confirm"></confirm>
 *
 * Call it:
 * this.$refs.confirm.open('Delete', 'Are you sure?', { color: 'red' }).then((confirm) => {})
 * Or use await:
 * if (await this.$refs.confirm.open('Delete', 'Are you sure?', { color: 'red' })) {
 *   // yes
 * }
 * else {
 *   // cancel
 * }
 *
 * Alternatively you can place it in main App component and access it globally via this.$root.$confirm
 * <template>
 *   <v-app>
 *     ...
 *     <confirm ref="confirm"></confirm>
 *   </v-app>
 * </template>
 *
 * mounted() {
 *   this.$root.$confirm = this.$refs.confirm.open
 * }
 */

export default {
    data: () => ({
        dialog: false,
        resolve: null,
        reject: null,
        message: null,
        title: null,
        options: {
            color: 'primary',
            width: 500,
            zIndex: 200
        }
    }),
    methods: {
        open(title, message, options) {
            this.dialog = true
            this.title = title
            this.message = message
            this.options = Object.assign(this.options, options)
            return new Promise((resolve, reject) => {
                this.resolve = resolve
                this.reject = reject
            })
        },
        agree() {
            this.resolve(true)
            this.dialog = false
        },
        cancel() {
            this.reject(false)
            this.dialog = false
        }
    },

}
</script>
