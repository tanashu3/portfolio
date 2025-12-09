document.addEventListener('DOMContentLoaded', () => {

    // --- 関数: スライダーの初期化 (再利用可能にする) ---
    const initSliders = (scopeElement = document) => {
        scopeElement.querySelectorAll('.slider-container').forEach(container => {
            // 既に初期化済みならスキップ（二重登録防止）
            if (container.dataset.initialized === 'true') return;

            const track = container.querySelector('.slider-track');
            if (!track) return;

            const images = track.querySelectorAll('img');
            const prevBtn = container.querySelector('.prev-btn');
            const nextBtn = container.querySelector('.next-btn');

            // 画像が1枚以下の場合の処理
            if (images.length <= 1) {
                if (prevBtn) prevBtn.style.display = 'none';
                if (nextBtn) nextBtn.style.display = 'none';
                return;
            } else {
                // 複数枚ある場合はボタンを表示（非表示になっていた場合の復帰）
                if (prevBtn) prevBtn.style.display = 'flex';
                if (nextBtn) nextBtn.style.display = 'flex';
            }

            let currentIndex = 0;
            container.dataset.initialized = 'true'; // 初期化済みフラグ

            const updateSlider = () => {
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
            };

            // イベントリスナーの再登録を防ぐため、古いリスナーを削除する仕組みはないので
            // 新しい要素（クローン）に対してのみ実行されることを前提とする
            if (nextBtn) {
                // クローン時にイベントが消えているので、新規に登録する
                nextBtn.onclick = (e) => { // addEventListenerだと重複の懸念があるためonclickで上書きも手だが、今回はcloneなのでaddEventListenerでOK
                    e.preventDefault();
                    e.stopPropagation();
                    currentIndex = (currentIndex + 1) % images.length;
                    updateSlider();
                };
            }

            if (prevBtn) {
                prevBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    currentIndex = (currentIndex - 1 + images.length) % images.length;
                    updateSlider();
                };
            }
        });
    };

    // --- 関数: 「詳細を見る」トグルの初期化 ---
    const initToggles = (scopeElement = document) => {
        scopeElement.querySelectorAll('.toggle-details').forEach(btn => {
            // クローン要素の場合、イベントが消えているので再設定が必要
            // 既存のリスナーと重複しないよう、onclick プロパティを使用する（簡易的な重複防止）
            btn.onclick = () => {
                const controlsId = btn.getAttribute('aria-controls');
                // ID重複を避けるため、親要素から探すロジックを優先
                let details = btn.parentElement.querySelector('.project-details') || btn.parentElement.querySelector('.tech-deep-dive');

                // ID指定がある場合（ただしモーダル内ではIDが変わっている/削除されている可能性があるため注意）
                if (!details && controlsId) {
                    details = document.getElementById(controlsId);
                }

                if (!details) return;

                const isHidden = getComputedStyle(details).display === 'none';
                if (isHidden) {
                    details.style.display = 'block';
                    btn.setAttribute('aria-expanded', 'true');
                } else {
                    details.style.display = 'none';
                    btn.setAttribute('aria-expanded', 'false');
                }
            };
        });
    };

    // ページ読み込み時に初期化実行 (静的ページ用)
    initSliders(document);
    initToggles(document);

    // --- ページ内リンクのスムーススクロール ---
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href === '#' || href.includes('modal')) return;

            const targetId = href.slice(1);
            const target = document.getElementById(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = 80;
                window.scrollTo({
                    top: target.offsetTop - headerHeight,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- モーダルシステムの制御 ---
    const modalOverlay = document.getElementById('global-modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.modal-close-btn');
    const body = document.body;

    // モーダルを開く関数
    const openModal = (contentId) => {
        // 隠しエリアからコンテンツを探す
        const sourceContent = document.getElementById(contentId);

        if (sourceContent) {
            // コンテンツをコピーしてモーダルに配置
            modalBody.innerHTML = '';
            const clone = sourceContent.cloneNode(true);

            // 重要: クローンした要素の初期化フラグを削除して、再度initSlidersが動くようにする
            clone.style.display = 'block'; // 隠し属性を解除
            clone.removeAttribute('id'); // ID重複を防ぐ

            // クローン内のすべてのスライダーコンテナから初期化フラグを削除
            clone.querySelectorAll('.slider-container').forEach(el => {
                delete el.dataset.initialized;
            });

            modalBody.appendChild(clone);

            // モーダルを表示
            modalOverlay.style.display = 'flex';
            setTimeout(() => {
                modalOverlay.classList.add('active');
            }, 10);
            body.style.overflow = 'hidden'; // 背景スクロール禁止

            // モーダル内のスライダーとトグルを初期化
            initSliders(modalBody);
            initToggles(modalBody);
        } else {
            console.error('Content not found:', contentId);
        }
    };

    // モーダルを閉じる関数
    const closeModal = () => {
        modalOverlay.classList.remove('active');
        setTimeout(() => {
            modalOverlay.style.display = 'none';
            modalBody.innerHTML = ''; // 中身をクリア（動画の再生停止など）
            body.style.overflow = ''; // 背景スクロール再開
        }, 300);
    };

    // トリガーの設定（.card-interactive クラスを持つリンク）
    document.querySelectorAll('.card-interactive').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            // hrefが "page.html#id" の形式か確認
            if (href && href.includes('#')) {
                const targetId = href.split('#')[1]; // #以降のIDを取得

                // 隠しコンテンツの中にターゲットIDが存在するか確認
                if (document.getElementById(targetId)) {
                    e.preventDefault(); // ページ遷移をキャンセル
                    openModal(targetId);
                }
                // ターゲットがなければ通常のリンク遷移を行う
            }
        });
    });

    // 閉じるイベント
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // 背景クリックで閉じる
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }
});
