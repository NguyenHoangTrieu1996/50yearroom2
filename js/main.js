const app = document.getElementById('app');

const loaded = {
    pages: {
        index: true,
        page1: false,
        page2: false,
        page3: false,
    },
    datas: {
        page1: false,
        page2: false,
        page3: false
    }
};

const routes = {
    '/': {
        page: 'index'
    },
    '/page1': {
        page: 'page1',
        data: 'page1'
    },
    '/page2': {
        page: 'page2',
        data: 'page2'
    },
    '/page3': {
        page: 'page3',
        data: 'page3'
    }
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const s = document.createElement('script');
        s.src = src;
        s.defer = true;
        s.onload = resolve;
        s.onerror = reject;
        document.body.appendChild(s);
    });
}

function afterRender(scope) {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const lang = localStorage.getItem('language');
    if (lang) {
        document.querySelector('#lang-vi, #lang-eng')?.setAttribute('id', lang);
        document.querySelectorAll('.lang').forEach(el => el.style.display = 'none');
        document.querySelectorAll(`.${lang}`).forEach(el => el.style.display = 'block');
    }
    if (scope === 'page1') initAnimations?.();
    if (scope === 'page2'||'page3') window.initCarousel?.();
}

// Animation Page1
let observer;
function initAnimations() {
    document.getElementById('hero-title')
        ?.classList.replace('opacity-0', 'opacity-100');
    document.getElementById('hero-title')
        ?.classList.replace('translate-y-4', 'translate-y-0');
    observer?.disconnect();
    observer = new IntersectionObserver(
        entries => entries.forEach(({ target, isIntersecting }) => {
            if (!isIntersecting) return;
            target.classList.remove(
                'opacity-0',
                'translate-y-10'
            );
            target.classList.add(
                'opacity-100',
                'translate-y-0'
            );
            observer.unobserve(target);
        }),
        { threshold: 0.1 }
    );
    document.querySelectorAll('.glass-card').forEach(card => {

        card.classList.add(
            'opacity-0',
            'translate-y-10',
            'transition-all',
            'duration-700'
        );

        observer.observe(card);

    });
}
// Loader
const loader = document.getElementById('loader');
function showLoader() {
    loader.classList.remove('hidden');
}
function hideLoader() {
    loader.classList.add('hidden');
}
showLoader();

// Render
async function render() {
    showLoader();
    const path = location.hash.replace('#', '') || '/';
    const route = routes[path];
    if (!route) {
        hideLoader();
        app.innerHTML = `<h2>404 - Trang không tồn tại</h2><a href="#/">← Quay về trang chủ</a>`;
        return;
    }
    try {

        if (!loaded.pages[route.page]) await loadScript(`./pages/${route.page}.js`).then(() => loaded.pages[route.page] = true);
        app.innerHTML = window.Pages[route.page](null);
        if (loaded.pages[route.page] && route.data && loaded.datas[route.data]) {
            app.innerHTML = window.Pages[route.page](window.datas[route.data]);
        }
        if (loaded.pages[route.page] && route.data && !loaded.datas[route.data]) {
            await loadScript(`./public/datas/${route.data}Data.js`).then(() => loaded.datas[route.data] = true);
            app.innerHTML = window.Pages[route.page](window.datas[route.data]);
        }


    } catch (e) {
        alert("Lỗi tải trang, Trang chưa được Load, đợi một ít phút xong quay lại trang");
        app.innerHTML = "<h2>Lỗi tải trang, Trang chưa được Load, đợi một ít phút xong quay lại trang</h2>";
        console.log(e)
        showLoader();
    } finally {
        requestAnimationFrame(() => {
            afterRender(route.page);
            hideLoader();
        });
    }
}

function preloadData() {
    setTimeout(() => {
        Object.values(routes).forEach(route => {
            if (route.page && !loaded.pages[route.page]) {
                loadScript(`./pages/${route.page}.js`).then(() => loaded.pages[route.page] = true);
            }
            if (route.data && !loaded.datas[route.data]) {
                loadScript(`./public/datas/${route.data}Data.js`).then(() => loaded.datas[route.data] = true);
            }
        });

    }, 500);
}

window.addEventListener('hashchange', render);
window.addEventListener('load', render);

preloadData();