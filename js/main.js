// js/main.js

document.addEventListener('DOMContentLoaded', () => {

    // ————————————————————————————————
    // 1. スムーススクロール（アンカーリンク）
    // ————————————————————————————————
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 60, // ヘッダー高さ分を引く
                    behavior: 'smooth'
                });
            }
        });
    });

    // ————————————————————————————————
    // 2. 「詳細を見る」ボタンの表示切り替え
    // ————————————————————————————————
    document.querySelectorAll('.toggle-details').forEach(btn => {
        btn.addEventListener('click', () => {
            // ボタンの直後にある .project-details 要素を取得
            const details = btn.parentElement.querySelector('.project-details');
            if (details) {
                const isHidden = getComputedStyle(details).display === 'none';
                details.style.display = isHidden ? 'block' : 'none';
                btn.textContent = isHidden ? '詳細を閉じる' : '詳細を見る';
            }
        });
    });

    // ————————————————————————————————
    // 3. 画像スライダー機能
    // ————————————————————————————————
    // すべてのプロジェクトカードに対してスライダー設定を試みる
    document.querySelectorAll('.project-card').forEach(card => {
        const sliderContainer = card.querySelector('.slider-container');
        const prevBtn = card.querySelector('.prev-btn');
        const nextBtn = card.querySelector('.next-btn');

        // スライダーの要素がなければ何もしない
        if (!sliderContainer || !prevBtn || !nextBtn) {
            return;
        }

        const images = sliderContainer.querySelectorAll('.project-img');
        let currentIndex = 0;

        // 画像が1枚以下の場合は矢印を隠す
        if (images.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            return;
        }

        function updateSlider() {
            // slider-containerを横にずらして表示する画像を切り替える
            sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        // 「次へ」ボタンのクリックイベント
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateSlider();
        });

        // 「前へ」ボタンのクリックイベント
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateSlider();
        });

        // 初期表示
        updateSlider();
    });
});
