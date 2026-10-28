// home.js — index.html interactive layer. CSP-safe (external file, no inline).
// theme + OS-smart CTA + Nothing dot-matrix canvas.
(function () {
  'use strict';

  var root = document.documentElement;

  // ---- theme ----
  var toggle = document.getElementById('theme-toggle');
  var saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches)
    root.setAttribute('data-theme', 'dark');

  if (toggle)
    toggle.addEventListener('click', function () {
      var d = root.getAttribute('data-theme') === 'dark';
      root.setAttribute('data-theme', d ? 'light' : 'dark');
      localStorage.setItem('theme', d ? 'light' : 'dark');
      initMatrix();
    });

  // ---- smart CTA label ----
  var ua = navigator.userAgent.toLowerCase();
  var btn = document.getElementById('btn-smart');
  if (btn) {
    var os = 'your device';
    if (ua.includes('win')) os = 'Windows';
    else if (ua.includes('mac')) os = 'macOS';
    else if (ua.includes('android')) os = 'Android';
    else if (/iphone|ipad|ipod/.test(ua)) os = 'iOS';
    else if (ua.includes('linux')) os = 'Linux';
    btn.textContent = 'Download for ' + os;
  }

  // ---- Nothing dot-matrix canvas ----
  var canvas = document.getElementById('dotMatrix');
  var ctx = canvas.getContext('2d');
  var particles = [];
  var mouse = { x: null, y: null, radius: 60 };
  var textOptions = ['ConsumeHalal', 'مستهلك حلال'];
  var currentTextIndex = 0;

  function getDotColor() {
    var cs = getComputedStyle(root);
    return cs.getPropertyValue('--dot').trim() || '#ede4d6';
  }

  function resizeCanvas() {
    var dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.parentElement.clientWidth * dpr;
    canvas.height = canvas.parentElement.clientHeight * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    initMatrix();
  }

  function initMatrix() {
    particles = [];
    var dpr = window.devicePixelRatio || 1;
    var w = canvas.width / dpr, h = canvas.height / dpr;
    var dotColor = getDotColor();
    ctx.fillStyle = dotColor;
    ctx.font = currentTextIndex === 0 ? '700 64px monospace' : '700 72px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(textOptions[currentTextIndex], w / 2, h / 2);
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, w, h);
    var gap = Math.max(5, Math.round(7 * dpr));
    for (var y = 0; y < canvas.height; y += gap) {
      for (var x = 0; x < canvas.width; x += gap) {
        var idx = (y * canvas.width + x) * 4;
        if (imgData.data[idx + 3] > 128) {
          particles.push({
            x: x / dpr, y: y / dpr,
            baseX: x / dpr, baseY: y / dpr,
            density: Math.random() * 30 + 12,
            size: 2.5
          });
        }
      }
    }
  }

  function animate() {
    var dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    var dotColor = getDotColor();
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var dx = mouse.x - p.x, dy = mouse.y - p.y;
      var dist = Math.hypot(dx, dy);
      var maxD = mouse.radius;
      if (dist < maxD && dist > 0) {
        var f = (maxD - dist) / maxD;
        p.x -= (dx / dist) * f * p.density * 0.3;
        p.y -= (dy / dist) * f * p.density * 0.3;
      } else {
        p.x -= (p.x - p.baseX) / 10;
        p.y -= (p.y - p.baseY) / 10;
      }
      ctx.fillStyle = dotColor;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(animate);
  }

  window.addEventListener('mousemove', function (e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  window.addEventListener('mouseout', function () { mouse.x = null; mouse.y = null; });
  window.addEventListener('resize', resizeCanvas);
  document.addEventListener('DOMContentLoaded', resizeCanvas);
  resizeCanvas();
  animate();

  setInterval(function () {
    currentTextIndex = (currentTextIndex + 1) % textOptions.length;
    initMatrix();
  }, 30000);
})();
