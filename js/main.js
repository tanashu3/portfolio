// js/main.js

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
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.toggle-details').forEach(btn => {
        btn.addEventListener('click', () => {
            const details = btn.nextElementSibling;
            const isHidden = getComputedStyle(details).display === 'none';

            // 詳細の表示／非表示を切り替え
            details.style.display = isHidden ? 'block' : 'none';

            // ボタンテキストも切り替え
            btn.textContent = isHidden ? '詳細を閉じる' : '詳細を見る';
        });
    });
});
