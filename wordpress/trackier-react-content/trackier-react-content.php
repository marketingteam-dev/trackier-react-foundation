<?php
/**
 * Plugin Name: Trackier React Content Starter
 * Description: Structured published content and shared navigation for an incremental React frontend. Install on staging first.
 * Version: 0.1.0
 * Requires at least: 6.4
 * Requires PHP: 8.0
 */
defined('ABSPATH') || exit;

function trf_link_shape() { return ['label' => 'text', 'href' => 'href']; }
function trf_image_shape() { return ['url' => 'image-url', 'alt' => 'alt', 'width' => 'integer', 'height' => 'integer']; }
function trf_list($shape, $max) { return ['_list' => $shape, '_max' => $max]; }
function trf_page_shape() {
    return [
        'seo' => ['title' => 'text', 'description' => 'text', 'image?' => trf_image_shape(), 'noIndex' => 'boolean'],
        'hero' => ['eyebrow' => 'text', 'heading' => 'text', 'description' => 'text', 'primaryCta' => trf_link_shape(), 'secondaryCta?' => trf_link_shape(), 'image?' => trf_image_shape()],
        'features' => ['heading' => 'text', 'items' => trf_list(['title' => 'text', 'description' => 'text'], 12)],
        'testimonials' => trf_list(['quote' => 'text', 'name' => 'text', 'role' => 'text'], 12),
        'faq' => ['heading' => 'text', 'items' => trf_list(['question' => 'text', 'answer' => 'text'], 30)],
        'cta' => ['heading' => 'text', 'description' => 'text', 'link' => trf_link_shape()],
    ];
}
function trf_site_shape() {
    return [
        'name' => 'text', 'logo?' => trf_image_shape(),
        'navigation' => trf_list(array_merge(trf_link_shape(), ['children?' => trf_list(trf_link_shape(), 30)]), 20),
        'headerCta' => trf_link_shape(),
        'footer' => ['description' => 'text', 'columns' => trf_list(['title' => 'text', 'links' => trf_list(trf_link_shape(), 30)], 6), 'socialLinks' => trf_list(trf_link_shape(), 10), 'copyright' => 'text'],
    ];
}

// A small, strict contract validator. Unknown keys are omitted; text is plain text.
function trf_clean($value, $shape, $path = 'content') {
    $fail = static function () use ($path) { throw new InvalidArgumentException('Invalid or missing field: ' . $path); };
    if (is_array($shape)) {
        if (!is_array($value)) { $fail(); }
        if (array_key_exists('_list', $shape)) {
            if (array_values($value) !== $value || count($value) > $shape['_max']) { $fail(); }
            $out = [];
            foreach ($value as $index => $item) { $out[] = trf_clean($item, $shape['_list'], $path . '.' . $index); }
            return $out;
        }
        $out = [];
        foreach ($shape as $raw_key => $child) {
            $optional = str_ends_with($raw_key, '?');
            $key = rtrim($raw_key, '?');
            if (!array_key_exists($key, $value)) {
                if ($optional) { continue; }
                throw new InvalidArgumentException('Missing field: ' . $path . '.' . $key);
            }
            $out[$key] = trf_clean($value[$key], $child, $path . '.' . $key);
        }
        return $out;
    }
    if ($shape === 'boolean') { if (!is_bool($value)) { $fail(); } return $value; }
    if ($shape === 'integer') { if (!is_int($value) || $value < 1 || $value > 20000) { $fail(); } return $value; }
    if (!is_string($value) || strlen($value) > 10000) { $fail(); }
    if ($shape === 'text' || $shape === 'alt') {
        $value = trim(wp_strip_all_tags($value));
        if (($shape === 'text' && $value === '') || ($shape === 'alt' && strlen($value) > 1000)) { $fail(); }
        return $value;
    }
    if (strlen($value) > 2048 || preg_match('/[\s\\\\\x00-\x1f\x7f]/', $value)) { $fail(); }
    if ($shape === 'href' && (preg_match('~^/(?!/)~', $value) || preg_match('/^#[A-Za-z][\w-]*$/', $value) || preg_match('/^(mailto:|tel:)[^:]+$/i', $value))) { return $value; }
    if ($shape === 'image-url' && preg_match('~^/react-assets/[\w./-]+$~', $value) && !str_contains($value, '..')) { return $value; }
    $url = wp_parse_url($value);
    if (!$url || ($url['scheme'] ?? '') !== 'https' || empty($url['host']) || isset($url['user']) || isset($url['pass'])) { $fail(); }
    if ($shape === 'image-url' && preg_match('/\.svg$/i', $url['path'] ?? '')) { $fail(); }
    return esc_url_raw($value, ['https']);
}

function trf_parse_json($raw, $shape) {
    if (!is_string($raw) || strlen($raw) > 100000) { throw new InvalidArgumentException('JSON must be text under 100 KB.'); }
    return trf_clean(json_decode($raw, true, 32, JSON_THROW_ON_ERROR), $shape);
}
function trf_notice($message) { set_transient('trf_notice_' . get_current_user_id(), $message, 120); }
add_action('admin_notices', function () {
    $key = 'trf_notice_' . get_current_user_id();
    $message = get_transient($key);
    if ($message) { echo '<div class="notice notice-error"><p>' . esc_html($message) . '</p></div>'; delete_transient($key); }
});

add_action('init', function () {
    register_post_type('trackier_react', [
        'labels' => ['name' => 'React Pages', 'singular_name' => 'React Page'],
        'public' => false, 'publicly_queryable' => false, 'exclude_from_search' => true,
        'show_ui' => true, 'show_in_rest' => false, 'show_in_nav_menus' => false,
        'rewrite' => false, 'query_var' => false, 'has_archive' => false,
        'supports' => ['title'], 'capability_type' => 'page', 'map_meta_cap' => true,
        'menu_icon' => 'dashicons-layout',
    ]);
    register_nav_menus(['trackier_primary' => 'Trackier shared primary navigation', 'trackier_footer' => 'Trackier shared first footer column']);
});

add_action('add_meta_boxes_trackier_react', function ($post) {
    add_meta_box('slugdiv', 'Content key (slug)', 'post_slug_meta_box', 'trackier_react', 'side');
    add_meta_box('trf_content', 'Structured page content (JSON)', function ($post) {
        wp_nonce_field('trf_save_content', 'trf_nonce');
        $content = get_post_meta($post->ID, '_trf_content', true);
        echo '<p>Paste a page payload from wordpress/examples/page.json. Use plain text. Slug uses lowercase letters, numbers and hyphens. No draft preview is implemented.</p>';
        echo '<p>Keep a backup before edits. This initial JSON editor does not provide content revisions or autosave.</p>';
        echo '<label class="screen-reader-text" for="trf_json">Page content JSON</label><textarea id="trf_json" name="trf_json" rows="28" style="width:100%;font-family:monospace">' . esc_textarea($content ? wp_json_encode($content, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) : '') . '</textarea>';
    }, 'trackier_react', 'normal', 'high');
});

// Never publish a first invalid payload. An invalid edit retains the previous payload.
add_filter('wp_insert_post_data', function ($data, $postarr) {
    if (($data['post_type'] ?? '') !== 'trackier_react' || !isset($_POST['trf_json'], $_POST['trf_nonce'])) { return $data; }
    if (!wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['trf_nonce'])), 'trf_save_content') || !current_user_can('edit_pages')) { return $data; }
    try { trf_parse_json(wp_unslash($_POST['trf_json']), trf_page_shape()); }
    catch (Throwable $e) {
        if (empty($postarr['ID']) || !get_post_meta($postarr['ID'], '_trf_content', true)) { $data['post_status'] = 'draft'; }
        trf_notice('React content was not saved: ' . $e->getMessage() . '. Previous valid content is unchanged; title/status may have changed.');
    }
    return $data;
}, 10, 2);

add_action('save_post_trackier_react', function ($post_id) {
    if ((defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) || wp_is_post_revision($post_id) || !current_user_can('edit_post', $post_id)) { return; }
    if (!isset($_POST['trf_nonce'], $_POST['trf_json']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['trf_nonce'])), 'trf_save_content')) { return; }
    try { update_post_meta($post_id, '_trf_content', trf_parse_json(wp_unslash($_POST['trf_json']), trf_page_shape())); }
    catch (Throwable $e) { trf_notice('React content was not saved: ' . $e->getMessage() . '. Previous valid content is unchanged.'); }
});

add_action('admin_menu', function () {
    add_options_page('React Site Settings', 'React Site Settings', 'manage_options', 'trf-site', function () {
        if (!current_user_can('manage_options')) { return; }
        if (isset($_POST['trf_site_json'])) {
            check_admin_referer('trf_save_site');
            try {
                update_option('trf_site', trf_parse_json(wp_unslash($_POST['trf_site_json']), trf_site_shape()), false);
                echo '<div class="notice notice-success"><p>Shared site content saved.</p></div>';
            } catch (Throwable $e) { echo '<div class="notice notice-error"><p>' . esc_html($e->getMessage() . '. Previous settings are unchanged.') . '</p></div>'; }
        }
        echo '<div class="wrap"><h1>React Site Settings</h1><p>Start from wordpress/examples/site.json. Assign the shared menu locations to override navigation and the first footer column. Elementor must be configured separately to consume those same menus.</p><form method="post">';
        wp_nonce_field('trf_save_site');
        echo '<label for="trf_site_json">Shared site JSON</label><textarea id="trf_site_json" name="trf_site_json" rows="30" style="width:100%;font-family:monospace">' . esc_textarea(wp_json_encode(get_option('trf_site', new stdClass()), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)) . '</textarea>';
        submit_button('Save shared content');
        echo '</form></div>';
    });
});

function trf_menu($location, $children = true) {
    $locations = get_nav_menu_locations();
    if (empty($locations[$location])) { return null; }
    $items = wp_get_nav_menu_items($locations[$location]) ?: [];
    $out = [];
    foreach ($items as $item) {
        if ($item->menu_item_parent || !empty($item->_invalid)) { continue; }
        $link = ['label' => wp_strip_all_tags($item->title), 'href' => $item->url];
        if ($children) {
            $nested = [];
            foreach ($items as $child) {
                if ((int) $child->menu_item_parent === (int) $item->ID && empty($child->_invalid)) { $nested[] = ['label' => wp_strip_all_tags($child->title), 'href' => $child->url]; }
            }
            if ($nested) { $link['children'] = $nested; }
        }
        $out[] = $link;
    }
    return $out;
}
function trf_response($data) {
    $response = new WP_REST_Response($data, 200);
    // Next.js owns the short public-data cache. Avoid another opaque WP/CDN cache.
    $response->header('Cache-Control', 'no-store');
    $response->header('X-Robots-Tag', 'noindex');
    return $response;
}
add_action('rest_api_init', function () {
    register_rest_route('trackier/v1', '/site', [
        'methods' => WP_REST_Server::READABLE, 'permission_callback' => '__return_true',
        'callback' => function () {
            $site = get_option('trf_site');
            if (!$site) { return new WP_Error('trackier_site_unconfigured', 'Site settings are not configured.', ['status' => 503]); }
            try {
                $primary = trf_menu('trackier_primary');
                $footer = trf_menu('trackier_footer', false);
                if ($primary !== null) { $site['navigation'] = $primary; }
                if ($footer !== null) {
                    if (empty($site['footer']['columns'][0])) { $site['footer']['columns'][0] = ['title' => 'Links', 'links' => []]; }
                    $site['footer']['columns'][0]['links'] = $footer;
                }
                return trf_response(trf_clean($site, trf_site_shape()));
            } catch (Throwable $e) { return new WP_Error('trackier_invalid_site', 'Shared content is invalid. Ask an administrator to review it.', ['status' => 500]); }
        },
    ]);
    register_rest_route('trackier/v1', '/pages/(?P<slug>[a-z0-9]+(?:-[a-z0-9]+)*)', [
        'methods' => WP_REST_Server::READABLE, 'permission_callback' => '__return_true',
        'callback' => function ($request) {
            $posts = get_posts(['post_type' => 'trackier_react', 'name' => $request['slug'], 'post_status' => 'publish', 'has_password' => false, 'posts_per_page' => 1]);
            if (!$posts) { return new WP_Error('trackier_page_not_found', 'No published React page exists for this slug.', ['status' => 404]); }
            $post = $posts[0];
            try {
                $page = trf_clean(get_post_meta($post->ID, '_trf_content', true), trf_page_shape());
                $page['slug'] = $post->post_name;
                $page['title'] = trf_clean($post->post_title, 'text');
                $page['modified'] = get_post_modified_time('Y-m-d\TH:i:s\Z', true, $post);
                return trf_response($page);
            } catch (Throwable $e) { return new WP_Error('trackier_invalid_page', 'Published page content is invalid. Ask an editor to review it.', ['status' => 500]); }
        },
    ]);
});
