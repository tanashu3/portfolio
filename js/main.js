document.addEventListener('DOMContentLoaded', () => {
    // アンカーのスムーススクロール
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            if (target) {
                window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' });
            }
        });
    });

    // 「詳細を見る」トグル（ARIA対応）
    document.querySelectorAll('.toggle-details').forEach(btn => {
        btn.addEventListener('click', () => {
            const controlsId = btn.getAttribute('aria-controls');
            const details = controlsId ? document.getElementById(controlsId) : btn.parentElement.querySelector('.project-details');
            if (!details) return;
            const isHidden = getComputedStyle(details).display === 'none';
            details.style.display = isHidden ? 'block' : 'none';
            btn.textContent = isHidden ? '詳細を閉じる' : '詳細を見る';
            btn.setAttribute('aria-expanded', String(isHidden));
        });
    });

    // 各カードのシンプルスライダー
    document.querySelectorAll('.project-card').forEach(card => {
        const sliderContainer = card.querySelector('.slider-container');
        const prevBtn = card.querySelector('.prev-btn');
        const nextBtn = card.querySelector('.next-btn');
        if (!sliderContainer || !prevBtn || !nextBtn) return;

        const images = sliderContainer.querySelectorAll('.project-img');
        let currentIndex = 0;

        if (images.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            return;
        }

        const updateSlider = () => {
            sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        };

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateSlider();
        });

        updateSlider();
    });
});
