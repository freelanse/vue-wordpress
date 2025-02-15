<?php

function enqueue_vue_scripts() {
    wp_enqueue_style('style', get_stylesheet_uri());

    wp_enqueue_script('vue', 'https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js', [], null, true);
    wp_enqueue_script('custom-vue', get_template_directory_uri() . '/vue-app.js', ['vue'], null, true);
    wp_localize_script('custom-vue', 'wpApiSettings', [
        'root'  => esc_url_raw(rest_url()),
        'nonce' => wp_create_nonce('wp_rest'),
    ]);
}
add_action('wp_enqueue_scripts', 'enqueue_vue_scripts');
