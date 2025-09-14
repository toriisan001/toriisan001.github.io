{
  ("use strict");

  // 画面読み込み前に実行されてエラーになったので100ミリ秒遅延させた。
  setTimeout(function () {
    // 変数storageにlocalStorageを格納
    const storage = localStorage;
    const config = getConfig();
    const body = document.getElementsByTagName("body")[0];
    // スクロールした時の処理
    $(window).scroll(function() {
      // windowがスクロールされた時に実行する処理
      storage.setItem(config.SYSTEM_KEY.LAST_PAGEY_OFFSET, window.pageYOffset);
    });
    // ページ読み込み時、前回のスクロール箇所があれば移動
    if (storage.getItem(config.SYSTEM_KEY.LAST_PAGEY_OFFSET) !== null) {
        window.scrollTo({
          top: storage.getItem(config.SYSTEM_KEY.LAST_PAGEY_OFFSET),
          behavior: "auto",
        });
    }
    // 初期設定関係
    const mainFontFamily = storage.getItem(config.SYSTEM_KEY.FONT_FAMILY);
    body.style.fontFamily = (mainFontFamily === null) ? config.INITIALIZATION.FONT_FAMILY: mainFontFamily;
    const mainFontSize = storage.getItem(config.SYSTEM_KEY.FONT_SIZE);
    body.style.fontSize = (mainFontSize === null) ? config.INITIALIZATION.FONT_SIZE: mainFontSize;
    const mainFontWeight = storage.getItem(config.SYSTEM_KEY.FONT_WEIGHT);
    body.style.fontWeight = (mainFontWeight === null) ? config.INITIALIZATION.FONT_WEIGHT: mainFontWeight;
    const fontSelect = document.getElementById("fontSelect");
    const sizeSelect = document.getElementById("sizeSelect");
    const fontWeight = document.getElementById("font-weight");
    for (const [key, obj] of Object.entries(Array.from(fontSelect.options))) {
      if (obj.value.replaceAll('"', '') === body.style.fontFamily.replaceAll('"', '')) {
        fontSelect.selectedIndex = key;
      }
    }
    for (const [key, obj] of Object.entries(Array.from(sizeSelect.options))) {
      if (obj.value === body.style.fontSize) {
        sizeSelect.selectedIndex = key;
      }
    }
    for (const [key, obj] of Object.entries(Array.from(fontWeight.options))) {
      if (obj.value === body.style.fontWeight) {
        fontWeight.selectedIndex = key;
      }
    }

    // メニュー制御
    const open = document.getElementById("open");
    const menu = document.getElementById("menu");
    const mask = document.getElementById("mask");
    open.addEventListener("click", () => {
      menu.classList.remove("hidden");
      mask.classList.remove("hidden");
      // スクロール禁止付与
      document.addEventListener("touchmove", maskDisableScroll, {
        passive: false,
      });
      document.body.classList.add("overflow-hidden");
    });
    mask.addEventListener("click", () => {
      menu.classList.add("hidden");
      mask.classList.add("hidden");
      // スクロール禁止除去
      document.removeEventListener("touchmove", maskDisableScroll, {
        passive: false,
      });
      document.body.classList.remove("overflow-hidden");
    });

    // スクロール禁止(マスク上)
    function maskDisableScroll(event) {
      console.log(event.path[0].id);
      if (
        event.path[0].id === "mask"
        || event.path[0].id === "operationMenuMask"
      ) {
        event.preventDefault();
      }
    }

    // 最終更新日を追記
    const lastModified = document.getElementById("lastModified");
    lastModified.textContent +=
      "(最終更新日時：" +
      dateFomatYYYYMMDDhhmmss(new Date(document.lastModified), "/", ":") +
      ")";

    // スクロール禁止付与
    function noScrollingAdd() {
      document.addEventListener("touchmove", maskDisableScroll, {
        passive: false,
      });
      document.body.classList.add("overflow-hidden");
    }
    // スクロール禁止除去
    function noScrollingRemove() {
      document.removeEventListener("touchmove", maskDisableScroll, {
        passive: false,
      });
      document.body.classList.remove("overflow-hidden");
    }

    // QRボタン
    const qr_button = document.getElementById("qr_button");
    const qr = document.getElementById("qr");
    const qr_Mask = document.getElementById("qr_Mask");
    qr_button.addEventListener("click", (e) => {
      qr_toggle();
      noScrollingAdd();
    });
    qr_Mask.addEventListener("click", (e) => {
      qr_toggle();
      noScrollingRemove();
    });
    // QR切り替え
    function qr_toggle() {
      qr.classList.toggle("hidden");
      qr_Mask.classList.toggle("hidden");
    }

    // 操作パネルの制御
    const operationMenuShow = document.getElementById("operationMenuShow");
    const operationMenu = document.getElementById("operationMenu");
    const operationMenuMask = document.getElementById("operationMenuMask");
    const pageSlide = document.getElementById("pageSlide");
    const pageTop = document.getElementById("pageTop");
    const pageBottom = document.getElementById("pageBottom");
    pageSlide.value = -500;
    pageSlide.max = document.documentElement.scrollHeight;
    operationMenuShow.addEventListener("click", (e) => {
      setlog('operationMenuShow click.\n');
      operationMenu.classList.toggle("hidden");
      operationMenuShow.classList.toggle("hidden");
      operationMenuMask.classList.toggle("hidden");
      noScrollingAdd();
      pageSlide.value = window.pageYOffset;
    });
    operationMenuMask.addEventListener('click', e => {
      operationMenuShow.click();
      noScrollingRemove();
    });
    sizeSelect.addEventListener("change", () => {
      setlog('sizeSelect change.\n');
      body.style.fontSize = sizeSelect.value;
      pageSlide.max = document.documentElement.scrollHeight;
      storage.setItem(config.SYSTEM_KEY.FONT_SIZE, sizeSelect.value);
    });
    fontSelect.addEventListener("change", () => {
      setlog('fontSelect change.\n');
      body.style.fontFamily = fontSelect.value;
      pageSlide.max = document.documentElement.scrollHeight;
      storage.setItem(config.SYSTEM_KEY.FONT_FAMILY, fontSelect.value);
    });
    fontWeight.addEventListener("change", () => {
      setlog('fontWeight change.\n');
      body.style.fontWeight = fontWeight.value;
      pageSlide.max = document.documentElement.scrollHeight;
      storage.setItem(config.SYSTEM_KEY.FONT_WEIGHT, fontWeight.value);
    });
    const details = document.querySelectorAll('details');
    details.forEach(el => {
        el.addEventListener('toggle', e => {
          setlog('details click.\n');
          el.open = e.target.open;
          pageSlide.max = document.documentElement.scrollHeight;
        });
    });
    pageSlide.addEventListener("input", () => {
      // setlog('pageSlide input.\n');
      window.scrollTo({
        top: pageSlide.value,
      });
    });
    pageTop.addEventListener("click", (e) => {
      setlog('pageTop click.\n');
      e.preventDefault();
      window.scrollTo({
        top: -500,
        behavior: "smooth",
      });
    });
    const statusBarParts = document.getElementById("statusBarParts");
    statusBarParts.addEventListener("click", () => {
      pageTop.click();
    });
    pageBottom.addEventListener("click", (e) => {
      setlog('pageBottom click.\n');
      e.preventDefault();
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    });
    // タブの状態を切り替え
    const all_detail_open = document.getElementById("all_detail_open");
    const all_detail_close = document.getElementById("all_detail_close");
    all_detail_open.addEventListener("click", (e) => {
      var detailsElements = document.querySelectorAll('details');
      detailsElements.forEach(function(detailsElement) {
          detailsElement.setAttribute('open', 'true');
      });
    });
    all_detail_close.addEventListener("click", (e) => {
      var detailsElements = document.querySelectorAll('details');
      detailsElements.forEach(function(detailsElement) {
        detailsElement.removeAttribute('open');
      });
    });

    // ログを設定
    // param text ログに設定するテキスト(\nで改行が可能)
    // return void
    // use) setlog('mvShow' + '\n');
    function setlog(text) {
      const log = document.getElementById("log");
      log.innerText += `${text}`;
      console.log(text);
    }
    // 最終アクセスを保持
    storage.setItem(config.SYSTEM_KEY.LAST_HREF, decodeURI(location.href));
    // ステータスバー
    const statusBarYmdHis = document.getElementById("statusBarYmdHis");
    logShowSet();
    // ログを表示させるか切り替え
    logShoFlag.addEventListener('click', () => {
        // フラグ設定
        storage.setItem(config.SYSTEM_KEY.LOG_SHO_FLAG, Number(logShoFlag.checked));
        logShowSet();
    });
    // ログを表示させるか判定関数
    function logShowSet() {
      const log = document.getElementById('log');
      const logShoFlag = document.getElementById('logShoFlag');
      if (storage.getItem(config.SYSTEM_KEY.LOG_SHO_FLAG) === '1') {
          log.classList.remove('hidden');
          logShoFlag.checked = true;
      } else {
          log.classList.add('hidden');
          logShoFlag.checked = false;
      }
    }

    // Readmine
    // const redmine = document.getElementById("redmine");
    // redmine.addEventListener("click", () => {
    //   if (confirm("ログインID:user、パスワード:userpassでユーザー権限でログイン出来ます。")) {
    //     redmine.setAttribute('href', 'http://3.115.25.3:8080/login?username=user');
    //   }
    // });

    // すべての details にイベントを付ける
    document.querySelectorAll('details').forEach(d => {
    if (!d.querySelector('summary')) {
      const summary = document.createElement('summary');
      summary.textContent = '詳細';
      d.insertBefore(summary, d.firstChild);
    }

    setInterval(() => {
      // 現在日時取得
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const  hour = date.getHours();
      const  minute = date.getMinutes();
      const dayOfWeek = date.getDay();
      const dayOfWeekStr = ["日", "月", "火", "水", "木", "金", "土"][dayOfWeek];
      const options = { year: 'numeric' };
      const japaneseCalender = new Intl.DateTimeFormat('ja-JP-u-ca-japanese', options).format(date);
      statusBarYmdHis.innerHTML = '('+ japaneseCalender + ')' +year + '/' + month + '/' + day + '&nbsp;('+ dayOfWeekStr + ')&nbsp;&nbsp;' + zeroPadding(hour, 2) + ":" + zeroPadding(minute, 2);
    }, 2000);
  }, 1000);
}
