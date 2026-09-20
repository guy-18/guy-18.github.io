/* 移动端 TOC 抽屉 — Fluid 主题补丁
 * 注入浮动按钮，点击从右侧滑出文章目录
 */
document.addEventListener('DOMContentLoaded', function () {
  var toc = document.getElementById('toc');
  if (!toc) return; // 非文章页没有目录，直接退出
  var sideCol = toc.closest('.side-col');
  if (!sideCol) return;
  sideCol.classList.add('toc-drawer-col');

  var btn = document.createElement('button');
  btn.id = 'toc-fab';
  btn.setAttribute('aria-label', '目录');
  btn.innerHTML = '\u2630'; // ☰
  btn.style.display = 'none'; // 默认隐藏，等目录生成后再显示
  document.body.appendChild(btn);

  var mask = document.createElement('div');
  mask.className = 'toc-mask';
  document.body.appendChild(mask);

  function setOpen(open) {
    document.body.classList.toggle('toc-open', open);
  }
  btn.addEventListener('click', function () {
    setOpen(!document.body.classList.contains('toc-open'));
  });
  mask.addEventListener('click', function () {
    setOpen(false);
  });

  // 点击目录里的链接跳转后自动收起抽屉
  toc.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  // tocbot 异步生成目录：用 MutationObserver 监听，目录项一出现立刻显示按钮；
  // 目录始终为空（文章没有标题）则按钮永远不出现。另加轮询兜底。
  function reveal() {
    btn.style.display = '';
  }
  var mo = new MutationObserver(function () {
    if (toc.querySelector('.toc-list-item')) {
      mo.disconnect();
      reveal();
    }
  });
  mo.observe(toc, { childList: true, subtree: true });
  var tries = 0;
  var timer = setInterval(function () {
    tries++;
    if (toc.querySelector('.toc-list-item')) {
      clearInterval(timer);
      mo.disconnect();
      reveal();
    } else if (tries >= 60) {
      clearInterval(timer);
    }
  }, 500);
});
