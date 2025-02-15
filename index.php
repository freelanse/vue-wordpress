<?php wp_head()?>

    <div id="app">
        <filters @update="fetchPosts"></filters>
        <post-list :posts="posts"></post-list>
        <loading-indicator :isLoading="isLoading"></loading-indicator>
        <button v-if="!allLoaded" @click="loadMore">Загрузить ещё</button>
    </div>


<?php wp_footer()?>
