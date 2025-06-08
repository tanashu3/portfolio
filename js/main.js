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
// 2. Contact フォーム送信（mailto:）
// ————————————————————————————————
const form = document.getElementById('contactForm');
if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        // フォームの値を取得
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // 簡易バリデーション：未入力チェック
        if (!name || !email || !message) {
            alert('すべての項目を入力してください。');
            return;
        }

        // mailto 用の件名・本文を組み立て
        const subject = encodeURIComponent(`ポートフォリオサイトからのお問い合わせ: ${name}`);
        const body = encodeURIComponent(
            `名前: ${name}\n` +
            `メール: ${email}\n\n` +
            `メッセージ:\n${message}`
        );

        // mailto リンクを生成して遷移（user のメーラーが起動）
        window.location.href = `mailto:youremail@example.com?subject=${subject}&body=${body}`;
    });
}
