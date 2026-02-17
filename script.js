/* ============================
   MUFQI ANDIKA PANGESTU
   Portfolio JavaScript
============================ */

// ---- FAST LOADER (max 1s) ----
const loader = document.getElementById('loader');
const loaderBar = document.getElementById('loaderBar');

function hideLoader(){
  if(loader){
    loader.classList.add('hide');
    setTimeout(()=> loader.style.display='none', 550);
  }
}

// Hide after fonts/images settle, max 1 second
window.addEventListener('load', ()=> setTimeout(hideLoader, 600));
setTimeout(hideLoader, 1000); // hard max 1s

// ---- CUSTOM CURSOR ----
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;

document.addEventListener('mousemove', e=>{
  mx=e.clientX; my=e.clientY;
  dot.style.left=mx+'px'; dot.style.top=my+'px';
});
(function anim(){
  rx+=(mx-rx)*.13; ry+=(my-ry)*.13;
  ring.style.left=rx+'px'; ring.style.top=ry+'px';
  requestAnimationFrame(anim);
})();
document.addEventListener('mouseleave',()=>{dot.style.opacity='0';ring.style.opacity='0'});
document.addEventListener('mouseenter',()=>{dot.style.opacity='1';ring.style.opacity='1'});

document.querySelectorAll('a,button,.pf,.ch-item,.pj-card,.skill-block,.ah-item').forEach(el=>{
  el.addEventListener('mouseenter',()=>{
    dot.style.transform='translate(-50%,-50%) scale(2.5)';
    ring.style.transform='translate(-50%,-50%) scale(1.4)';
    ring.style.borderColor='rgba(59,110,248,.8)';
  });
  el.addEventListener('mouseleave',()=>{
    dot.style.transform='translate(-50%,-50%) scale(1)';
    ring.style.transform='translate(-50%,-50%) scale(1)';
    ring.style.borderColor='rgba(59,110,248,.5)';
  });
});

// ---- NAV SCROLL & ACTIVE ----
const header = document.getElementById('siteHeader');
const burger = document.getElementById('burger');
const navList = document.getElementById('navList');
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', ()=>{
  header.classList.toggle('scrolled', window.scrollY>40);
  backTop.classList.toggle('show', window.scrollY>500);
  updateActive();
});

burger.addEventListener('click',()=>{
  burger.classList.toggle('on');
  navList.classList.toggle('open');
  document.body.style.overflow = navList.classList.contains('open') ? 'hidden':'';
});
navList.querySelectorAll('.nl').forEach(l=>{
  l.addEventListener('click',()=>{
    burger.classList.remove('on');
    navList.classList.remove('open');
    document.body.style.overflow='';
  });
});

function updateActive(){
  const sections = document.querySelectorAll('section[id]');
  const pos = window.scrollY + 100;
  sections.forEach(sec=>{
    const t = sec.offsetTop, h = sec.offsetHeight, id = sec.id;
    const link = document.querySelector(`.nl[href="#${id}"]`);
    if(link){
      link.classList.toggle('active', pos>=t && pos<t+h);
    }
  });
}

backTop.addEventListener('click',()=> window.scrollTo({top:0,behavior:'smooth'}));

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const target = document.querySelector(a.getAttribute('href'));
    if(target){
      e.preventDefault();
      window.scrollTo({top: target.offsetTop - 80, behavior:'smooth'});
    }
  });
});

// ---- SCROLL REVEAL ----
const revEls = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
const revObs = new IntersectionObserver(entries=>{
  entries.forEach((entry,i)=>{
    if(entry.isIntersecting){
      entry.target.style.transitionDelay = (entry.target.dataset.delay||'0')+'s';
      entry.target.classList.add('vis');
    }
  });
},{threshold:0.08,rootMargin:'0px 0px -40px 0px'});
revEls.forEach(el=> revObs.observe(el));

// ---- SKILL BAR ANIMATION ----
const skillObs = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.querySelectorAll('.sbb-fill,.dsb-fill,.cg-fill,.comp-fill').forEach((bar,i)=>{
        const w = bar.dataset.w||'70';
        setTimeout(()=>{ bar.style.width = w+'%'; }, i*60+200);
      });
      skillObs.unobserve(entry.target);
    }
  });
},{threshold:0.1});
document.querySelectorAll('.skill-block,.data-story,.comp-section').forEach(el=> skillObs.observe(el));

// ---- PROJECT SLIDERS ----
document.querySelectorAll('.pj-card').forEach(card=>{
  const slides = card.querySelectorAll('.pjm-img');
  const dotsWrap = card.querySelector('.pjm-dots');
  const prev = card.querySelector('.pjm-prev');
  const next = card.querySelector('.pjm-next');
  if(slides.length<=1){ if(prev)prev.style.display='none'; if(next)next.style.display='none'; return; }

  let cur=0, timer=null;
  // Build dots
  if(dotsWrap){
    slides.forEach((_,i)=>{
      const d=document.createElement('div');
      d.className='pjm-dot'+(i===0?' on':'');
      d.addEventListener('click',()=>goTo(i));
      dotsWrap.appendChild(d);
    });
  }

  function goTo(n){
    slides[cur].classList.remove('active');
    if(dotsWrap) dotsWrap.querySelectorAll('.pjm-dot')[cur]?.classList.remove('on');
    cur=(n+slides.length)%slides.length;
    slides[cur].classList.add('active');
    if(dotsWrap) dotsWrap.querySelectorAll('.pjm-dot')[cur]?.classList.add('on');
  }

  function start(){ timer=setInterval(()=>goTo(cur+1),3800); }
  function stop(){ clearInterval(timer); }

  if(prev) prev.addEventListener('click',()=>{stop();goTo(cur-1);start();});
  if(next) next.addEventListener('click',()=>{stop();goTo(cur+1);start();});
  card.querySelector('.pj-media').addEventListener('mouseenter',stop);
  card.querySelector('.pj-media').addEventListener('mouseleave',start);

  // Touch
  let tx=0;
  card.querySelector('.pj-media').addEventListener('touchstart', e=>{ tx=e.changedTouches[0].clientX; },{passive:true});
  card.querySelector('.pj-media').addEventListener('touchend', e=>{
    const diff=tx-e.changedTouches[0].clientX;
    if(Math.abs(diff)>40){ stop(); goTo(cur+(diff>0?1:-1)); start(); }
  });

  start();
});

// ---- PROJECT FILTER ----
document.querySelectorAll('.pf').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.pf').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f=btn.dataset.f;
    document.querySelectorAll('.pj-card').forEach(card=>{
      const show = f==='all'||card.dataset.cat===f;
      card.classList.toggle('hidden',!show);
    });
  });
});

// ---- STAGGERED CHILDREN ANIMATION ----
function staggerAnimate(parent, childSelector, delay=80){
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.querySelectorAll(childSelector).forEach((child,i)=>{
          child.style.opacity='0';
          child.style.transform='translateY(16px)';
          child.style.transition='opacity .45s ease, transform .45s ease';
          setTimeout(()=>{
            child.style.opacity='1';
            child.style.transform='none';
          }, i*delay);
        });
        obs.unobserve(entry.target);
      }
    });
  },{threshold:0.05});
  document.querySelectorAll(parent).forEach(el=>obs.observe(el));
}

staggerAnimate('.about-highlights', '.ah-item', 80);
staggerAnimate('.courses-list', '.cl-item', 60);
staggerAnimate('.soft-grid', '.sg-card', 60);
staggerAnimate('.tools-grid', '.tg-item', 50);
staggerAnimate('.data-cards-col', '.dcc', 70);
staggerAnimate('.opp-items', '.oi', 100);

// ---- HERO ROLE ROTATOR ----
const roles = document.querySelectorAll('.ht-item');
let ri=0;
if(roles.length>1){
  setInterval(()=>{
    roles[ri].classList.remove('active');
    ri=(ri+1)%roles.length;
    roles[ri].classList.add('active');
  }, 2200);
}

// ---- IPK ARC ANIMATION ----
const ipkArc = document.getElementById('ipkArc');
if(ipkArc){
  const arcObs = new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting){
      // 3.66/4.00 = 91.5% → circumference 264, offset = 264*(1-.915) = 22.44
      setTimeout(()=>{ ipkArc.style.strokeDashoffset='22'; },300);
      arcObs.disconnect();
    }
  },{threshold:0.3});
  arcObs.observe(ipkArc);
}

// ---- COUNTER ANIMATION ----
function animCounter(el, target, suffix=''){
  let cur=0;
  const step = target/40;
  const t = setInterval(()=>{
    cur+=step;
    if(cur>=target){ cur=target; clearInterval(t); }
    el.textContent = (Number.isInteger(target)?Math.round(cur):cur.toFixed(2)) + suffix;
  }, 35);
}
const counterObs = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.querySelectorAll('.hs-item strong').forEach(el=>{
        const val = parseFloat(el.textContent);
        const suffix = el.textContent.includes('+') ? '+':'';
        animCounter(el, val, suffix);
      });
      counterObs.disconnect();
    }
  });
},{threshold:0.5});
const statsEl = document.querySelector('.hero-stats');
if(statsEl) counterObs.observe(statsEl);

// ---- CONSOLE BRANDING ----
console.log('%c MAP Portfolio ', 'background:#3b6ef8;color:#fff;padding:6px 14px;font-size:14px;font-weight:bold;border-radius:4px;');
console.log('%c Mufqi Andika Pangestu | Mobile & Web Developer | Data Analyst ', 'color:#3b6ef8;');
