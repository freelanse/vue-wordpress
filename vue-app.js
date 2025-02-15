const app = Vue.createApp({
    data() {
        return {
            posts: [],          // Список записей
            page: 1,            // Текущая страница
            perPage: 3,         // Количество записей на страницу
            allLoaded: false,   // Флаг загрузки всех постов
            selectedCategory: '',
            isLoading: false
        };
    },
    mounted() {
        this.loadMore(); // Загрузка первых 3 записей
    },
    methods: {
        fetchPosts(category = '') {
            this.selectedCategory = category;
            this.page = 1;
            this.posts = [];
            this.allLoaded = false;
            this.loadMore();
        },
        loadMore() {
            if (this.allLoaded || this.isLoading) return;

            this.isLoading = true;
            let url = `${wpApiSettings.root}wp/v2/posts?per_page=${this.perPage}&page=${this.page}`;
            if (this.selectedCategory) {
                url += `&categories=${this.selectedCategory}`;
            }

            fetch(url, { headers: { 'X-WP-Nonce': wpApiSettings.nonce } })
                .then(res => {
                    if (!res.ok) this.allLoaded = true;
                    return res.json();
                })
                .then(data => {
                    if (data.length === 0) {
                        this.allLoaded = true;
                    } else {
                        this.posts = this.page === 1 ? data : [...this.posts, ...data];
                        this.page++;
                    }
                })
                .finally(() => {
                    this.isLoading = false;
                });
        }
    }
});

app.component('filters', {
    template: `
        <div>
            <select v-model="selectedCategory" @change="$emit('update', selectedCategory)">
                <option value="">Все категории</option>
                <option v-for="category in categories" :value="category.id">{{ category.name }}</option>
            </select>
        </div>
    `,
    data() {
        return {
            categories: [],
            selectedCategory: ''
        };
    },
    mounted() {
        fetch(`${wpApiSettings.root}wp/v2/categories`)
            .then(res => res.json())
            .then(data => this.categories = data);
    }
});

app.component('post-list', {
    props: ['posts'],
    template: `
        <div>
            <article v-for="post in posts" :key="post.id">
                <h2 v-html="post.title.rendered"></h2>
                <img v-if="post.featured_media" :src="post.featured_media" alt="Изображение" class="post-image">
                <div v-html="post.excerpt.rendered"></div>
                <a :href="post.link" class="read-more">Читать далее</a>
            </article>
        </div>
    `
});

app.component('loading-indicator', {
    template: `<div class="loading" v-if="isLoading">Загрузка...</div>`,
    props: ['isLoading']
});

app.mount('#app');
