const shopUrl = 'https://luccaleather.base.shop/';
const instagramUrl = 'https://www.instagram.com/lucca_leather';
const works = [
  ['bag', 'Leather bag', 'しなやかな革の表情を活かした、日々に馴染む革鞄。'],
  ['wallet', 'Small wallet', '手に触れるたび育つ、コンパクトな革小物。'],
  ['brass', 'Brass detail', '日本の職人が作る真鍮金具を、静かなアクセントに。'],
];

document.getElementById('root').innerHTML = `
<header class="site-header">
  <a class="brand" href="#top" aria-label="Lucca Leather home"><span>Lucca</span><small>Leather craft atelier</small></a>
  <nav><a href="#works">作品</a><a href="#story">ものづくり</a><a href="#order">ご購入・相談</a></nav>
  <a class="header-cta" href="${shopUrl}">Online shop</a>
</header>
<main id="top">
  <section class="hero">
    <div class="hero-copy">
      <p class="eyebrow">✦ Italian leather / Japanese brass</p>
      <h1>「嬉しい」が循環する、<br>日々の革もの。</h1>
      <p class="lead">伝統的な製法で鞣されたイタリアンレザーと、日本の職人によって作られた真鍮金具を用いて、革小物・革鞄を仕立てています。</p>
      <div class="hero-actions"><a class="primary" href="${shopUrl}">作品を見に行く →</a><a class="secondary" href="${instagramUrl}">◎ 制作の記録</a></div>
    </div>
    <div class="hero-art" aria-label="革小物の抽象ビジュアル"><div class="leather-card"><span></span><b>Lucca</b></div><div class="stitch stitch-a"></div><div class="stitch stitch-b"></div></div>
  </section>
  <section class="notice" aria-label="お知らせポップアップ風の案内">
    <strong>POP UP / order note</strong><span>新作・在庫追加・イベント出展のお知らせはInstagramで更新しています。オーダー相談はDMまたはショップのお問い合わせから。</span><a href="${instagramUrl}">最新情報を見る</a>
  </section>
  <section id="works" class="section">
    <div class="section-head"><p>Works</p><h2>眺める時間まで、作品の一部に。</h2></div>
    <div class="work-grid">${works.map(([kind,title,desc]) => `<article class="work ${kind}"><div class="photo"><span></span></div><h3>${title}</h3><p>${desc}</p></article>`).join('')}</div>
  </section>
  <section id="story" class="story">
    <div><p class="eyebrow">◇ Craft story</p><h2>量産ではなく、暮らしに長く残る手ざわりを。</h2></div>
    <p>革が持つ傷やシワ、経年変化を個性として受け止め、糸目・コバ・金具の余白まで静かに整える。作家の世界観を前面に出しながら、初めて訪れた方にも購入まで迷わない導線を設計しました。</p>
  </section>
  <section class="features"><article><h3>♡ 世界観を守る</h3><p>土・真鍮・生成りを基調に、強い売り込みより余韻を重視。</p></article><article><h3>▣ 買いやすくする</h3><p>オンラインショップへの導線、納期、再入荷案内を明確化。</p></article><article><h3>◌ 相談しやすい</h3><p>DM・問い合わせ・POP UP告知をまとめ、集客接点を増やします。</p></article></section>
  <section id="order" class="order"><p>Online shop / Instagram</p><h2>気になる作品や、革の育ち方について。<br>どうぞ気軽に覗いてみてください。</h2><div class="hero-actions center"><a class="primary" href="${shopUrl}">□ BASEで購入する</a><a class="secondary" href="${instagramUrl}">✉ Instagramで相談</a></div></section>
</main>
<footer><b>Lucca Leather</b><span>© 2026 Handmade leather atelier</span></footer>`;
