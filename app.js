(() => {
  'use strict';

  const SYSTEM_APPS = [
    { id: 'mail', name: 'Mail', icon: { android: './assets/icons/Android/mail.png', ios: './assets/icons/IOS/ios14_mail.png' }, page: 0 },
    { id: 'maps', name: 'Maps', icon: { android: './assets/icons/Android/maps.png', ios: './assets/icons/IOS/ios14_maps.png' }, page: 0 },
    { id: 'gallery', name: 'Fotos', icon: { android: './assets/icons/Android/gallery.png', ios: './assets/icons/IOS/ios14_photos.png' }, page: 0, isTrigger: true },
    { id: 'whatsapp', name: 'WhatsApp', icon: { android: './assets/icons/Android/whatsapp.png', ios: './assets/icons/IOS/ios14_whatsapp.png' }, page: 0 },
    { id: 'instagram', name: 'Instagram', icon: { android: './assets/icons/Android/instagram.png', ios: './assets/icons/IOS/ios14_instagram.png' }, page: 0 },
    { id: 'telegram', name: 'Telegram', icon: { android: './assets/icons/Android/telegram.png', ios: './assets/icons/IOS/ios14_telegram.png' }, page: 0 },
    { id: 'calendar', name: 'Calendario', icon: { android: './assets/icons/Android/calendar.png', ios: './assets/icons/IOS/ios14_calendar.png' }, page: 0 },
    { id: 'settings', name: 'Ajustes', icon: { android: './assets/icons/Android/settings.png', ios: './assets/icons/IOS/ios14_settings.png' }, page: 0, isSettings: true },

    { id: 'files', name: 'Archivos', icon: { android: './assets/icons/Android/files.png', ios: './assets/icons/IOS/ios14_files.png' }, page: 1 },
    { id: 'notes', name: 'Notas', icon: { android: './assets/icons/Android/notes.png', ios: './assets/icons/IOS/ios14_notes.png' }, page: 1 },
    { id: 'calculator', name: 'Calculadora', icon: { android: './assets/icons/Android/calculator.png', ios: './assets/icons/IOS/ios14_calculator.png' }, page: 1 },
    { id: 'contacts', name: 'Contactos', icon: { android: './assets/icons/Android/contacts.png', ios: './assets/icons/IOS/ios14_contacts.png' }, page: 1 },
    { id: 'clock', name: 'Reloj', icon: { android: './assets/icons/Android/clock.png', ios: './assets/icons/IOS/ios14_clock.png' }, page: 1 },

    { id: 'youtube', name: 'YouTube', icon: { android: './assets/icons/Android/youtube.png', ios: './assets/icons/IOS/ios14_youtube.png' }, page: 2 },
    { id: 'spotify', name: 'Spotify', icon: { android: './assets/icons/Android/spotify.png', ios: './assets/icons/IOS/ios14_spotify.png' }, page: 2 },
    { id: 'tinder', name: 'Tinder', icon: { android: './assets/icons/Android/tinder.png', ios: './assets/icons/IOS/ios14_tinder.png' }, page: 2 },

    { id: 'phone', name: 'Teléfono', icon: { android: './assets/icons/Android/phone.png', ios: './assets/icons/IOS/ios14_phone.png' }, isDock: true },
    { id: 'messages', name: 'Mensajes', icon: { android: './assets/icons/Android/messages.png', ios: './assets/icons/IOS/ios14_messages.png' }, isDock: true },
    { id: 'browser', name: 'Safari', icon: { android: './assets/icons/Android/browser.png', ios: './assets/icons/IOS/ios14_safari.png' }, isDock: true },
    { id: 'camera', name: 'Cámara', icon: { android: './assets/icons/Android/camera.png', ios: './assets/icons/IOS/ios14_camera.png' }, isDock: true }
  ];

  // Recuperación persistente desde localStorage
  const savedConfig = JSON.parse(localStorage.getItem('cphone_config') || '{}');

  const state = {
    os: 'ios',
    mode: 'numbers',
    pinInput: '',
    secretResult: { kind: 'num', text: '7543' },
    currentPage: 0,
    use24Hours: savedConfig.use24Hours !== undefined ? savedConfig.use24Hours : true,
    
    photoSourceSrc: localStorage.getItem('cphone_custom_photo') || './assets/demo.jpg',
    fontName: savedConfig.fontName || 'Cryptext25',
    inkColor: savedConfig.inkColor || '#151515',
    
    photoConfig: {
      x: savedConfig.x !== undefined ? savedConfig.x : 48.8,
      y: savedConfig.y !== undefined ? savedConfig.y : 46.4,
      size: savedConfig.size !== undefined ? savedConfig.size : 10,
      rot: savedConfig.rot !== undefined ? savedConfig.rot : 0
    }
  };

  const $ = id => document.getElementById(id);

  const DOM = {
    screenSettings: $('screen-settings'),
    screenPhotoEditor: $('screen-photo-editor'),
    screenPhone: $('screen-phone'),
    phoneFrameContainer: $('phone-frame-container'),
    
    btnOpenPhotoEditor: $('btn-open-photo-editor'),
    btnClosePhotoEditor: $('btn-close-photo-editor'),
    editorPreviewCanvas: $('editor-preview-canvas'),

    layerLock: $('layer-lock'),
    layerPin: $('layer-pin'),
    layerHome: $('layer-home'),
    layerGallery: $('layer-gallery'),
    
    btnStartTrick: $('btn-start-trick'),
    clockStatus: $('clock-status'),
    lockClockText: $('lock-clock-text'),
    lockDateText: $('lock-date-text'),
    galleryClockText: $('gallery-clock-text'),
    swipeHintText: $('swipe-hint-text'),
    pinTitleText: $('pin-title-text'),
    
    pinDotsContainer: $('pin-dots-container'),
    keypad: $('keypad'),
    btnPinDel: $('btn-pin-del'),
    btnPinBack: $('btn-pin-back'),
    
    homeSlider: $('home-slider'),
    pageDots: $('page-dots'),
    dockContainer: $('dock-container'),
    revealedPhotoImg: $('revealed-photo-img'),

    inputLockBgFile: $('input-lockbg-file'),
    btnUploadLockBg: $('btn-upload-lockbg'),
    inputHomeBgFile: $('input-homebg-file'),
    btnUploadHomeBg: $('btn-upload-homebg'),
    inputPhotoFile: $('input-photo-file'),
    btnUploadPhoto: $('btn-upload-photo'),
    
    inputTextSize: $('input-text-size'),
    textSizeVal: $('text-size-val'),
    inputTextPosX: $('input-text-posx'),
    textPosXVal: $('text-posx-val'),
    inputTextPosY: $('input-text-posy'),
    textPosYVal: $('text-posy-val'),

    selectFontFamily: $('select-font-family'),
    inputFontFile: $('input-font-file'),
    btnUploadFont: $('btn-upload-font'),
    inputInkColor: $('input-ink-color'),
    selectTimeFormat: $('select-time-format'),

    btnGalleryBack: $('btn-gallery-back'),
    gestureBarPhotos: $('gesture-bar-photos'),
    galleryStage: $('gallery-stage')
  };

  function saveConfigToStorage() {
    try {
      localStorage.setItem('cphone_config', JSON.stringify({
        use24Hours: state.use24Hours,
        fontName: state.fontName,
        inkColor: state.inkColor,
        x: state.photoConfig.x,
        y: state.photoConfig.y,
        size: state.photoConfig.size,
        rot: state.photoConfig.rot
      }));
    } catch (e) {
      console.warn('Error guardando configuración', e);
    }
  }

  function detectOS() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return 'ios';
    if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) return 'ios';
    return 'android';
  }

  function applyOSTheme() {
    state.os = detectOS();
    
    if (state.os === 'ios') {
      DOM.phoneFrameContainer.className = 'phone-frame theme-ios';
      if (DOM.swipeHintText) DOM.swipeHintText.textContent = 'Desliza hacia arriba para desbloquear';
      if (DOM.pinTitleText) DOM.pinTitleText.textContent = 'Introduce el código';
      if (DOM.btnPinBack) DOM.btnPinBack.textContent = 'Cancelar';
    } else {
      DOM.phoneFrameContainer.className = 'phone-frame theme-android';
      if (DOM.swipeHintText) DOM.swipeHintText.textContent = 'Desliza para desbloquear';
      if (DOM.pinTitleText) DOM.pinTitleText.textContent = 'Introduce tu PIN';
      if (DOM.btnPinBack) DOM.btnPinBack.textContent = '‹ Atrás';
    }

    renderApps();
  }

  function renderApps() {
    const currentTheme = state.os;

    for (let p = 0; p <= 2; p++) {
      const grid = $(`grid-page-${p}`);
      if (!grid) continue;
      grid.innerHTML = '';

      const pageApps = SYSTEM_APPS.filter(app => app.page === p && !app.isDock);
      pageApps.forEach(app => {
        const item = document.createElement('div');
        item.className = 'app-icon-item';
        if (app.isTrigger) item.id = 'app-photos-trigger';
        if (app.isSettings) item.id = 'btn-goto-settings';

        const iconSrc = app.icon[currentTheme] || app.icon.android;

        item.innerHTML = `
          <div class="app-icon-img"><img src="${iconSrc}" alt="${app.name}" onerror="this.src='./icon.png'"></div>
          <span class="app-icon-label">${app.name}</span>
        `;
        grid.appendChild(item);
      });
    }

    if (DOM.dockContainer) {
      DOM.dockContainer.innerHTML = '';
      const dockApps = SYSTEM_APPS.filter(app => app.isDock);
      dockApps.forEach(app => {
        const item = document.createElement('div');
        item.className = 'app-icon-item';
        const iconSrc = app.icon[currentTheme] || app.icon.android;
        item.innerHTML = `
          <div class="app-icon-img"><img src="${iconSrc}" alt="${app.name}" onerror="this.src='./icon.png'"></div>
        `;
        DOM.dockContainer.appendChild(item);
      });
    }

    const photosTrigger = $('app-photos-trigger');
    if (photosTrigger) {
      photosTrigger.addEventListener('click', () => switchLayer('gallery'));
    }

    const settingsTrigger = $('btn-goto-settings');
    if (settingsTrigger) {
      settingsTrigger.addEventListener('click', returnToSettings);
    }
  }

  function decodePin(pin) {
    const d = pin.split('').map(Number);
    if (state.mode === 'numbers') {
      const out = d.map(n => (n === 0 ? 0 : 10 - n)).join('');
      return { kind: 'num', text: String(parseInt(out, 10)) };
    } else {
      const sum = d[1] + d[2];
      const rank = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K' }[sum] || String(sum);
      const suits = ['', '♡', '♧', '♤', '♢'];
      const suitId = { 1: 2, 2: 1, 3: 3, 4: 4 }[d[0]] || 0;
      return { kind: 'card', rank, suitSymbol: suits[suitId] || '' };
    }
  }

  function drawPhotoOnCanvas(canvasEl, sampleText = '7543') {
    const ctx = canvasEl.getContext('2d');
    const baseImg = new Image();
    baseImg.crossOrigin = 'anonymous';

    baseImg.onload = () => {
      canvasEl.width = baseImg.naturalWidth || 1080;
      canvasEl.height = baseImg.naturalHeight || 1920;

      ctx.drawImage(baseImg, 0, 0);

      const W = canvasEl.width;
      const H = canvasEl.height;
      const fs = Math.max(16, (state.photoConfig.size / 100) * W);

      ctx.save();
      ctx.translate((state.photoConfig.x / 100) * W, (state.photoConfig.y / 100) * H);
      ctx.rotate((state.photoConfig.rot * Math.PI) / 180);
      ctx.globalCompositeOperation = 'multiply';
      ctx.globalAlpha = 0.94;

      ctx.font = `${fs}px "${state.fontName}", sans-serif`;
      ctx.fillStyle = state.inkColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillText(sampleText, 0, 0);
      ctx.restore();

      if (canvasEl !== DOM.editorPreviewCanvas) {
        DOM.revealedPhotoImg.src = canvasEl.toDataURL('image/jpeg', 0.92);
      }
    };

    baseImg.onerror = () => {
      canvasEl.width = 1080;
      canvasEl.height = 1920;
      ctx.fillStyle = '#1c1c1e';
      ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
      ctx.font = `80px "${state.fontName}", sans-serif`;
      ctx.fillStyle = state.inkColor;
      ctx.textAlign = 'center';
      ctx.fillText(sampleText, canvasEl.width / 2, canvasEl.height / 2);
      if (canvasEl !== DOM.editorPreviewCanvas) {
        DOM.revealedPhotoImg.src = canvasEl.toDataURL('image/jpeg', 0.92);
      }
    };

    baseImg.src = state.photoSourceSrc;
  }

function updateEditorPreview() {
    if (DOM.editorPreviewCanvas) {
      // Texto fijo definido directamente en el código para la previsualización
      const textoEjemploFijo = "1234"; 
      
      drawPhotoOnCanvas(DOM.editorPreviewCanvas, textoEjemploFijo);
    }
  }

  function generateRevealedPhoto(result) {
    const tempCanvas = document.createElement('canvas');
    let textToDraw = '';
    
    if (result.kind === 'num') {
      textToDraw = result.text;
    } else {
      textToDraw = `${result.rank}${result.suitSymbol}`;
    }
    
    drawPhotoOnCanvas(tempCanvas, textToDraw);
  }

  function updateClocks() {
    const now = new Date();
    let hours = now.getHours();
    const mins = String(now.getMinutes()).padStart(2, '0');
    
    let timeStr = '';
    if (state.use24Hours) {
      const hrsFormatted = String(hours).padStart(2, '0');
      timeStr = `${hrsFormatted}:${mins}`;
    } else {
      hours = hours % 12;
      hours = hours ? hours : 12;
      const hrsFormatted = String(hours).padStart(2, '0');
      timeStr = `${hrsFormatted}:${mins}`;
    }

    if (DOM.clockStatus) DOM.clockStatus.textContent = timeStr;
    if (DOM.lockClockText) DOM.lockClockText.textContent = timeStr;
    if (DOM.galleryClockText) DOM.galleryClockText.textContent = timeStr;

    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateStr = now.toLocaleDateString('es-ES', options);
    if (DOM.lockDateText) {
      DOM.lockDateText.textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    }
  }

  function switchLayer(targetLayer) {
    [DOM.layerLock, DOM.layerPin, DOM.layerHome, DOM.layerGallery].forEach(layer => {
      layer.classList.add('hidden');
    });

    if (targetLayer === 'lock') DOM.layerLock.classList.remove('hidden');
    if (targetLayer === 'pin') DOM.layerPin.classList.remove('hidden');
    if (targetLayer === 'home') DOM.layerHome.classList.remove('hidden');
    if (targetLayer === 'gallery') DOM.layerGallery.classList.remove('hidden');
  }

  function startTrick() {
    applyOSTheme();
    DOM.screenSettings.classList.remove('active');
    DOM.screenPhotoEditor.classList.remove('active');
    DOM.screenPhone.classList.add('active');
    state.pinInput = '';
    updatePinDots();
    switchLayer('lock');
  }

  function returnToSettings() {
    DOM.screenPhone.classList.remove('active');
    DOM.screenPhotoEditor.classList.remove('active');
    DOM.screenSettings.classList.add('active');
  }

  function updatePinDots() {
    const dots = DOM.pinDotsContainer.querySelectorAll('span');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('filled', idx < state.pinInput.length);
    });
  }

  function handleKeyPress(key) {
    if (state.pinInput.length < 4) {
      state.pinInput += key;
      updatePinDots();
      if (state.pinInput.length === 4) {
        setTimeout(processUnlock, 150);
      }
    }
  }

  function handleBackspace() {
    if (state.pinInput.length > 0) {
      state.pinInput = state.pinInput.slice(0, -1);
      updatePinDots();
    }
  }

  function processUnlock() {
    if (state.pinInput.length === 4) {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMins = String(now.getMinutes()).padStart(2, '0');
      const timePinCode = currentHours + currentMins;

      if (state.pinInput === timePinCode) {
        let timeStr = '';
        if (state.use24Hours) {
          timeStr = `${currentHours}${currentMins}`;
        } else {
          let h12 = now.getHours() % 12;
          h12 = h12 ? h12 : 12;
          timeStr = `${String(h12).padStart(2, '0')}${currentMins}`;
        }
        generateRevealedPhoto({ kind: 'num', text: timeStr });
      } else {
        state.secretResult = decodePin(state.pinInput);
        generateRevealedPhoto(state.secretResult);
      }
      switchLayer('home');
    }
  }

  function updateHomeSlider() {
    const translatePercent = -state.currentPage * (100 / 3);
    DOM.homeSlider.style.transform = `translateX(${translatePercent}%)`;
    const dots = DOM.pageDots.querySelectorAll('span');
    dots.forEach((dot, idx) => dot.classList.toggle('active', idx === state.currentPage));
  }

  let startX = 0, currentX = 0, isDragging = false;
  DOM.layerHome.addEventListener('touchstart', e => { startX = e.touches[0].clientX; isDragging = true; });
  DOM.layerHome.addEventListener('touchmove', e => { if (isDragging) currentX = e.touches[0].clientX; });
  DOM.layerHome.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    const diffX = startX - currentX;
    if (Math.abs(diffX) > 40) {
      if (diffX > 0 && state.currentPage < 2) state.currentPage++;
      else if (diffX < 0 && state.currentPage > 0) state.currentPage--;
      updateHomeSlider();
    }
  });

  let lastHomeClick = 0;
  DOM.layerHome.addEventListener('click', e => {
    if (e.target.closest('.app-icon-item') || e.target.closest('.widget-box')) return;
    const now = Date.now();
    if (now - lastHomeClick < 350) {
      state.pinInput = '';
      updatePinDots();
      switchLayer('lock');
    }
    lastHomeClick = now;
  });

  // Funcionalidad de ARRASTRAR EL TEXTO EN EL CANVAS
  let isDraggingText = false;
  const canvas = DOM.editorPreviewCanvas;

  function getCanvasTouchPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: ((clientX - rect.left) * scaleX / canvas.width) * 100,
      y: ((clientY - rect.top) * scaleY / canvas.height) * 100
    };
  }

  canvas.addEventListener('mousedown', () => isDraggingText = true);
  canvas.addEventListener('touchstart', () => isDraggingText = true);

  window.addEventListener('mousemove', e => {
    if (!isDraggingText) return;
    const pos = getCanvasTouchPos(e);
    state.photoConfig.x = Math.max(0, Math.min(100, parseFloat(pos.x.toFixed(1))));
    state.photoConfig.y = Math.max(0, Math.min(100, parseFloat(pos.y.toFixed(1))));
    
    DOM.inputTextPosX.value = state.photoConfig.x;
    DOM.textPosXVal.textContent = `${state.photoConfig.x}%`;
    DOM.inputTextPosY.value = state.photoConfig.y;
    DOM.textPosYVal.textContent = `${state.photoConfig.y}%`;

    updateEditorPreview();
    saveConfigToStorage();
  });

  canvas.addEventListener('touchmove', e => {
    if (!isDraggingText) return;
    const pos = getCanvasTouchPos(e);
    state.photoConfig.x = Math.max(0, Math.min(100, parseFloat(pos.x.toFixed(1))));
    state.photoConfig.y = Math.max(0, Math.min(100, parseFloat(pos.y.toFixed(1))));
    
    DOM.inputTextPosX.value = state.photoConfig.x;
    DOM.textPosXVal.textContent = `${state.photoConfig.x}%`;
    DOM.inputTextPosY.value = state.photoConfig.y;
    DOM.textPosYVal.textContent = `${state.photoConfig.y}%`;

    updateEditorPreview();
    saveConfigToStorage();
  });

  window.addEventListener('mouseup', () => isDraggingText = false);
  window.addEventListener('touchend', () => isDraggingText = false);

  DOM.btnOpenPhotoEditor.addEventListener('click', () => {
    DOM.screenSettings.classList.remove('active');
    DOM.screenPhotoEditor.classList.add('active');
    
    // Sincronizar valores actuales en la UI de sliders
    DOM.inputTextSize.value = state.photoConfig.size;
    DOM.textSizeVal.textContent = `${state.photoConfig.size}%`;
    DOM.inputTextPosX.value = state.photoConfig.x;
    DOM.textPosXVal.textContent = `${state.photoConfig.x}%`;
    DOM.inputTextPosY.value = state.photoConfig.y;
    DOM.textPosYVal.textContent = `${state.photoConfig.y}%`;
    if (DOM.selectTimeFormat) DOM.selectTimeFormat.value = state.use24Hours ? '24' : '12';
    if (DOM.selectFontFamily && state.fontName !== 'CustomUserFont') DOM.selectFontFamily.value = state.fontName;
    if (DOM.inputInkColor) DOM.inputInkColor.value = state.inkColor;

    updateEditorPreview();
  });

  DOM.btnClosePhotoEditor.addEventListener('click', () => {
    DOM.screenPhotoEditor.classList.remove('active');
    DOM.screenSettings.classList.add('active');
  });

  DOM.btnUploadLockBg.addEventListener('click', () => DOM.inputLockBgFile.click());
  DOM.inputLockBgFile.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      DOM.phoneFrameContainer.style.setProperty('--lock-bg', `url('${url}')`);
      localStorage.setItem('cphone_lock_bg', url);
    }
  });

  DOM.btnUploadHomeBg.addEventListener('click', () => DOM.inputHomeBgFile.click());
  DOM.inputHomeBgFile.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      DOM.phoneFrameContainer.style.setProperty('--home-bg', `url('${url}')`);
      localStorage.setItem('cphone_home_bg', url);
    }
  });

  DOM.btnUploadPhoto.addEventListener('click', () => DOM.inputPhotoFile.click());
  DOM.inputPhotoFile.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        state.photoSourceSrc = event.target.result;
        try {
          localStorage.setItem('cphone_custom_photo', state.photoSourceSrc);
        } catch (err) {
          console.warn('La imagen es demasiado grande para guardarse en localStorage', err);
        }
        updateEditorPreview();
      };
      reader.readAsDataURL(file);
    }
  });

  if (DOM.selectTimeFormat) {
    DOM.selectTimeFormat.addEventListener('change', e => {
      state.use24Hours = (e.target.value === '24');
      updateClocks();
      updateEditorPreview();
      saveConfigToStorage();
    });
  }

  DOM.inputTextSize.addEventListener('input', e => {
    const val = e.target.value;
    state.photoConfig.size = parseFloat(val);
    DOM.textSizeVal.textContent = `${val}%`;
    updateEditorPreview();
    saveConfigToStorage();
  });

  DOM.inputTextPosX.addEventListener('input', e => {
    const val = e.target.value;
    state.photoConfig.x = parseFloat(val);
    DOM.textPosXVal.textContent = `${val}%`;
    updateEditorPreview();
    saveConfigToStorage();
  });

  DOM.inputTextPosY.addEventListener('input', e => {
    const val = e.target.value;
    state.photoConfig.y = parseFloat(val);
    DOM.textPosYVal.textContent = `${val}%`;
    updateEditorPreview();
    saveConfigToStorage();
  });

  DOM.selectFontFamily.addEventListener('change', e => {
    const val = e.target.value;
    if (val === 'custom') {
      DOM.btnUploadFont.classList.remove('hidden');
    } else {
      DOM.btnUploadFont.classList.add('hidden');
      state.fontName = val;
      updateEditorPreview();
      saveConfigToStorage();
    }
  });

  DOM.btnUploadFont.addEventListener('click', () => DOM.inputFontFile.click());
  DOM.inputFontFile.addEventListener('change', async e => {
    const file = e.target.files[0];
    if (file) {
      const customFont = new FontFace('CustomUserFont', `url(${URL.createObjectURL(file)})`);
      await customFont.load();
      document.fonts.add(customFont);
      state.fontName = 'CustomUserFont';
      updateEditorPreview();
      saveConfigToStorage();
    }
  });

  DOM.inputInkColor.addEventListener('input', e => { 
    state.inkColor = e.target.value;
    updateEditorPreview();
    saveConfigToStorage();
  });

  let lockStartY = 0;
  DOM.layerLock.addEventListener('touchstart', e => { lockStartY = e.touches[0].clientY; });
  DOM.layerLock.addEventListener('touchend', e => {
    if (lockStartY - e.changedTouches[0].clientY > 50) switchLayer('pin');
  });
  DOM.layerLock.addEventListener('click', () => switchLayer('pin'));

  DOM.keypad.addEventListener('click', e => {
    const btn = e.target.closest('.keypad-btn');
    if (!btn) return;
    const key = btn.dataset.key;
    if (key) handleKeyPress(key);
  });

  DOM.btnPinDel.addEventListener('click', handleBackspace);
  DOM.btnPinBack.addEventListener('click', () => switchLayer('lock'));
  DOM.btnStartTrick.addEventListener('click', startTrick);

  if (DOM.btnGalleryBack) {
    DOM.btnGalleryBack.addEventListener('click', e => { e.stopPropagation(); switchLayer('home'); });
  }

  if (DOM.gestureBarPhotos) {
    DOM.gestureBarPhotos.addEventListener('click', e => { e.stopPropagation(); switchLayer('home'); });
  }

  let clockHoldTimer;
  const initClockHoldSecret = el => {
    if (!el) return;
    el.addEventListener('touchstart', e => {
      e.stopPropagation();
      clearTimeout(clockHoldTimer);
      clockHoldTimer = setTimeout(() => {
        if (navigator.vibrate) navigator.vibrate(50);
        returnToSettings();
      }, 2000);
    });
    ['touchend', 'touchcancel'].forEach(evt => el.addEventListener(evt, () => clearTimeout(clockHoldTimer)));
  };

  initClockHoldSecret(DOM.clockStatus);
  initClockHoldSecret(DOM.lockClockText);

  if (DOM.btnPinDel) {
    DOM.btnPinDel.innerHTML = `
      <svg class="delete-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
        <line x1="18" y1="9" x2="12" y2="15"></line>
        <line x1="12" y1="9" x2="18" y2="15"></line>
      </svg>
    `;
  }

  async function initDefaults() {
    const savedLockBg = localStorage.getItem('cphone_lock_bg');
    const savedHomeBg = localStorage.getItem('cphone_home_bg');

    DOM.phoneFrameContainer.style.setProperty('--lock-bg', savedLockBg ? `url('${savedLockBg}')` : `url('./assets/lock_bg.png')`);
    DOM.phoneFrameContainer.style.setProperty('--home-bg', savedHomeBg ? `url('${savedHomeBg}')` : `url('./assets/home_bg.png')`);

    try {
      const font2 = new FontFace('Cryptext2', 'url("./assets/fonts/Cryptext 2 - Font.ttf")');
      const font25 = new FontFace('Cryptext25', 'url("./assets/fonts/Cryptext 2.5 - Font.ttf")');
      
      const loadedFont2 = await font2.load();
      const loadedFont25 = await font25.load();
      
      document.fonts.add(loadedFont2);
      document.fonts.add(loadedFont25);
    } catch (e) {
      console.warn('PWA Offline: Cargando con fuentes de sistema como respaldo.');
    }
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js', { scope: './' })
        .then(reg => console.log('ServiceWorker registrado:', reg.scope))
        .catch(err => console.warn('Error en ServiceWorker:', err));
    });
  }

  applyOSTheme();
  initDefaults();
  updateClocks();
  setInterval(updateClocks, 10000);
  updateHomeSlider();
})();