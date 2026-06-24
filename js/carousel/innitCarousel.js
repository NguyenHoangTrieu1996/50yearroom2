let carouselAutoPlay = null;

function initCarousel() {

    const carousel = document.getElementById('carousel');

    // Không có carousel thì bỏ qua
    if (!carousel) return;

    // Tránh khởi tạo nhiều lần
    if (carousel.dataset.initialized === 'true') return;

    carousel.dataset.initialized = 'true';

    const dots = [...document.querySelectorAll('.indicator-dot')];
    const originalSlides = [...carousel.querySelectorAll('.carousel-slide')];

    const slideCount = originalSlides.length;

    if (!slideCount) return;

    // Clone để tạo infinite carousel
    originalSlides.forEach(slide => {
        carousel.appendChild(slide.cloneNode(true));
    });

    [...originalSlides].reverse().forEach(slide => {
        carousel.insertBefore(
            slide.cloneNode(true),
            carousel.firstChild
        );
    });

    let isJumping = false;
    let scrollTimeout;

    const getSlideWidth = () => {
        const slide = carousel.querySelector('.carousel-slide');

        if (!slide) return 0;

        const styles = getComputedStyle(carousel);

        const gap =
            parseFloat(styles.columnGap) ||
            parseFloat(styles.gap) ||
            24;

        return slide.offsetWidth + gap;
    };

    const getActiveIndex = () => {

        const slideWidth = getSlideWidth();

        if (!slideWidth) return 0;

        let index =
            Math.round(carousel.scrollLeft / slideWidth)
            % slideCount;

        if (index < 0) index += slideCount;

        return index;
    };

    const updateDots = () => {

        const activeIndex = getActiveIndex();

        dots.forEach((dot, index) => {

            dot.classList.toggle(
                'bg-primary/40',
                index === activeIndex
            );

            dot.classList.toggle(
                'w-[6vw]',
                index === activeIndex
            );

            dot.classList.toggle(
                'bg-outline-variant',
                index !== activeIndex
            );

            dot.classList.toggle(
                'w-[1.6vw]',
                index !== activeIndex
            );
        });
    };

    const handleInfiniteScroll = () => {

        if (isJumping) return;

        const slideWidth = getSlideWidth();

        if (!slideWidth) return;

        const currentScroll = carousel.scrollLeft;

        if (currentScroll <= slideWidth * 0.5) {

            isJumping = true;

            carousel.classList.remove('scroll-smooth');

            carousel.scrollLeft =
                slideWidth * slideCount;

            requestAnimationFrame(() => {

                carousel.classList.add(
                    'scroll-smooth'
                );

                isJumping = false;
            });

        } else if (
            currentScroll >=
            slideWidth * (slideCount * 2 - 0.5)
        ) {

            isJumping = true;

            carousel.classList.remove('scroll-smooth');

            carousel.scrollLeft =
                slideWidth * slideCount;

            requestAnimationFrame(() => {

                carousel.classList.add(
                    'scroll-smooth'
                );

                isJumping = false;
            });
        }
    };

    const nextSlide = () => {

        carousel.scrollTo({
            left:
                carousel.scrollLeft +
                getSlideWidth(),
            behavior: 'smooth'
        });
    };

    const stopAutoPlay = () => {

        if (carouselAutoPlay) {
            clearInterval(carouselAutoPlay);
            carouselAutoPlay = null;
        }
    };

    const startAutoPlay = () => {

        stopAutoPlay();

        carouselAutoPlay = setInterval(
            nextSlide,
            10000
        );
    };

    // Scroll event
    carousel.addEventListener('scroll', () => {

        updateDots();

        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(
            handleInfiniteScroll,
            100
        );
    });

    // Pause autoplay
    carousel.addEventListener(
        'touchstart',
        stopAutoPlay
    );

    carousel.addEventListener(
        'mousedown',
        stopAutoPlay
    );

    // Resume autoplay
    carousel.addEventListener(
        'touchend',
        startAutoPlay
    );

    carousel.addEventListener(
        'mouseup',
        startAutoPlay
    );

    // Click indicator
    dots.forEach((dot, index) => {

        dot.addEventListener('click', () => {

            stopAutoPlay();

            carousel.scrollTo({
                left:
                    (slideCount + index) *
                    getSlideWidth(),
                behavior: 'smooth'
            });

            startAutoPlay();
        });
    });

    // Init position
    requestAnimationFrame(() => {

        const slideWidth = getSlideWidth();

        carousel.classList.remove(
            'scroll-smooth'
        );

        carousel.scrollLeft =
            slideWidth * slideCount;

        requestAnimationFrame(() => {

            carousel.classList.add(
                'scroll-smooth'
            );

            updateDots();

            startAutoPlay();
        });
    });
}

// Export global
window.initCarousel = initCarousel;