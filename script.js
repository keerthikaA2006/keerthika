// 1. Typing effect. EDIT the roles below.
const roles=["aspiring Web Developer","Information Technology student","AWS Certified Cloud Practitioner","problem solver"];
const el=document.getElementById("typed");
let r=0,c=0,del=false;
function type(){
  const word=roles[r];
  el.textContent=word.slice(0,c);
  if(!del&&c<word.length){c++;setTimeout(type,90)}
  else if(!del){del=true;setTimeout(type,1400)}
  else if(c>0){c--;setTimeout(type,45)}
  else{del=false;r=(r+1)%roles.length;setTimeout(type,300)}
}
type();

// 2. Skill bars fill when scrolled into view
const bars=document.querySelectorAll(".skill");
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){e.target.querySelector("i").style.width=e.target.dataset.level+"%";io.unobserve(e.target)}
}),{threshold:.3});
bars.forEach(b=>io.observe(b));

// 3. Skill filter
document.getElementById("filters").addEventListener("click",e=>{
  const btn=e.target.closest("button"); if(!btn) return;
  document.querySelectorAll("#filters button").forEach(b=>b.setAttribute("aria-pressed",b===btn));
  bars.forEach(s=>s.classList.toggle("hide",btn.dataset.f!=="all"&&s.dataset.c!==btn.dataset.f));
});

// 4. Project details toggle
document.querySelectorAll(".proj button").forEach(b=>b.addEventListener("click",()=>{
  const open=b.nextElementSibling.classList.toggle("open");
  b.setAttribute("aria-expanded",open);
  b.textContent=open?"Hide":"Details";
}));

// 5. Light/dark theme (follows the device, remembers your choice)
const root=document.documentElement,tb=document.getElementById("theme");
function setTheme(t){root.dataset.theme=t;tb.textContent=t==="dark"?"Light":"Dark";try{localStorage.setItem("theme",t)}catch(e){}}
let saved=null;try{saved=localStorage.getItem("theme")}catch(e){}
setTheme(saved||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"));
tb.addEventListener("click",()=>setTheme(root.dataset.theme==="dark"?"light":"dark"));

document.getElementById("year").textContent=new Date().getFullYear();

// 6. Floating particle network background
(function(){
  if(matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cv=document.getElementById("bg"),cx=cv.getContext("2d");
  let W,H,pts=[];
  function size(){
    W=cv.width=innerWidth;H=cv.height=innerHeight;
    pts=Array.from({length:Math.min(70,Math.floor(W*H/18000))},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35}));
  }
  function frame(){
    cx.clearRect(0,0,W,H);
    const rgb=getComputedStyle(document.documentElement).getPropertyValue("--dot").trim()||"34,211,238";
    pts.forEach((p,i)=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>W)p.vx*=-1;
      if(p.y<0||p.y>H)p.vy*=-1;
      cx.fillStyle="rgba("+rgb+",.7)";
      cx.beginPath();cx.arc(p.x,p.y,1.8,0,6.283);cx.fill();
      for(let j=i+1;j<pts.length;j++){
        const q=pts[j],d=Math.hypot(p.x-q.x,p.y-q.y);
        if(d<130){cx.strokeStyle="rgba("+rgb+","+(.25*(1-d/130))+")";cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(q.x,q.y);cx.stroke()}
      }
    });
    requestAnimationFrame(frame);
  }
  addEventListener("resize",size);size();frame();
})();

// 7. Viewer interactions
(function(){
  const $=(q,r=document)=>r.querySelector(q), $$=(q,r=document)=>[...r.querySelectorAll(q)];
  // progress bar + back to top
  const pg=$("#progress"),tp=$("#top-btn");
  addEventListener("scroll",()=>{
    const h=document.documentElement.scrollHeight-innerHeight;
    pg.style.width=(h>0?scrollY/h*100:0)+"%";tp.classList.toggle("show",scrollY>600);
  },{passive:true});
  tp.onclick=()=>scrollTo({top:0,behavior:"smooth"});
  // reveal on scroll
  const rio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");rio.unobserve(e.target)}}),{threshold:.12});
  $$("section .wrap > *:not(h2), .item, .proj, .certs li").forEach(n=>{n.classList.add("rv");rio.observe(n)});
  // active nav link
  const links=$$("nav ul a");
  const nio=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting)links.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+e.target.id));
  }),{rootMargin:"-45% 0px -50% 0px"});
  $$("section[id]").forEach(s=>nio.observe(s));
  // mobile menu
  const menu=$("#menu"),ul=$("nav ul");
  menu.onclick=()=>{const o=ul.classList.toggle("open");menu.setAttribute("aria-expanded",o)};
  links.forEach(a=>a.addEventListener("click",()=>{ul.classList.remove("open");menu.setAttribute("aria-expanded",false)}));
  // certification search
  $("#certSearch").addEventListener("input",e=>{
    const q=e.target.value.trim().toLowerCase();let n=0;
    $$(".certs li").forEach(li=>{const ok=li.textContent.toLowerCase().includes(q);li.style.display=ok?"":"none";if(ok)n++});
    $("#certEmpty").style.display=n?"none":"block";
  });
  // copy email
  $("#copyMail").onclick=async function(){
    const m="keerthikaanbalaganak@gmail.com";
    try{await navigator.clipboard.writeText(m);this.textContent="Copied!"}catch(e){this.textContent="Press Ctrl+C on the email above"}
    setTimeout(()=>this.textContent="Copy email",2000);
  };
  // contact form: sends through Formspree when FORM_ENDPOINT is set, otherwise opens the visitor's email app
  const FORM_ENDPOINT=""; // EDIT: paste your Formspree URL here, e.g. "https://formspree.io/f/abcdwxyz"
  $("#contactForm").addEventListener("submit",e=>{
    e.preventDefault();
    const n=$("#cn").value.trim(),f=$("#ce").value.trim(),m=$("#cm").value.trim(),msg=$("#formMsg"),btn=e.target.querySelector("button[type=submit]");
    function viaMail(){
      location.href="mailto:keerthikaanbalaganak@gmail.com?subject="+encodeURIComponent("Portfolio message from "+n)+"&body="+encodeURIComponent(m+"\n\n— "+n+" ("+f+")");
      msg.textContent="Opening your email app. If nothing opens, copy the address above and write to me directly.";
    }
    if(!FORM_ENDPOINT){viaMail();return}
    btn.disabled=true;msg.textContent="Sending…";
    fetch(FORM_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({name:n,email:f,message:m})})
      .then(r=>{if(!r.ok)throw 0;e.target.reset();msg.textContent="Thank you, "+n+"! Your message was sent. I will reply soon."})
      .catch(()=>{msg.textContent="Could not send directly, opening your email app instead.";viaMail()})
      .finally(()=>{btn.disabled=false});
  });
  // quick-answer assistant
  const KB=[
    {k:["skill","know","language","tech","java","python","sql"],t:"Skills",a:"Java, C, Advanced C, Python and SQL; HTML, CSS and JavaScript for the web; PyTorch for deep learning; and AWS cloud fundamentals.",go:"#skills"},
    {k:["educat","college","study","school","cgpa","degree","mark"],t:"Education",a:"B.Tech in Information Technology at Saveetha Engineering College, Chennai (2024 – 2028, CGPA 8.5). Higher secondary 85% and secondary 90%.",go:"#education"},
    {k:["project","deepfake","voice","work"],t:"Projects",a:"A team project on voice deepfake detection using Wiener–Hopf Linear Prediction, built with Python and machine learning on the ASVspoof 2019 LA dataset.",go:"#projects"},
    {k:["intern","experience","approtech"],t:"Internship",a:"A one-month virtual web development internship at APPROTECH R&D Solutions Private Limited.",go:"#internship"},
    {k:["cert","aws","course","coursera","pytorch"],t:"Certifications",a:"AWS Certified Cloud Practitioner, plus PyTorch and database courses from Packt, Illinois Tech and the University of Colorado via Coursera.",go:"#certs"},
    {k:["resume","cv","download"],t:"Resume",a:"You can download my resume as a PDF from the My resume link in the Contact section.",go:"#contact"},
    {k:["game","play","quiz","fun"],t:"Game",a:"Try the Real or AI? game. It is a short quiz about spotting synthetic voices, based on my deepfake detection project.",go:"#game"},
    {k:["contact","email","hire","reach","mail","linkedin","github"],t:"Contact",a:"Email keerthikaanbalaganak@gmail.com, or use the form in the Contact section. GitHub and LinkedIn links are there too.",go:"#contact"}
  ];
  const log=$("#log"),chat=$("#chat"),fab=$("#chat-fab");
  function say(t,me){const d=document.createElement("div");if(me)d.className="me";d.textContent=t;log.appendChild(d);log.scrollTop=log.scrollHeight}
  function ask(q){
    say(q,true);const l=q.toLowerCase();
    const hit=KB.find(x=>x.k.some(w=>l.includes(w)));
    if(hit){say(hit.a);setTimeout(()=>{chat.classList.remove("open");fab.setAttribute("aria-expanded",false);$(hit.go).scrollIntoView({behavior:"smooth"})},1200)}
    else say("I can answer about skills, education, projects, internship, certifications or contact. Try one of the buttons.");
  }
  KB.forEach(x=>{const b=document.createElement("button");b.textContent=x.t;b.type="button";b.onclick=()=>ask(x.t);$("#chips").appendChild(b)});
  say("Hi! I can tell you about Keerthika. Pick a topic or type a question.");
  fab.onclick=()=>{const o=chat.classList.toggle("open");fab.setAttribute("aria-expanded",o)};
  $("#chatForm").addEventListener("submit",e=>{e.preventDefault();const i=$("#chatIn"),v=i.value.trim();if(v){ask(v);i.value=""}});
})();
// 8. Extra interactions: stats, spotlight, tilt, linked skills, game, command menu
(function(){
  const $=(q,r=document)=>r.querySelector(q), $$=(q,r=document)=>[...r.querySelectorAll(q)];
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover=matchMedia("(hover: hover)").matches;
  const go=sel=>{const n=$(sel);if(n)n.scrollIntoView({behavior:"smooth"})};

  $("#statCerts").dataset.to=$$(".certs li").length;
  const cio=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return;cio.unobserve(e.target);
    const b=e.target,to=parseFloat(b.dataset.to),dec=+(b.dataset.dec||0);
    if(reduce){b.textContent=to.toFixed(dec);return}
    const t0=performance.now();
    (function step(t){const p=Math.min((t-t0)/1200,1),v=to*(1-Math.pow(1-p,3));b.textContent=v.toFixed(dec);if(p<1)requestAnimationFrame(step)})(t0);
  }),{threshold:.6});
  $$(".stat b").forEach(b=>cio.observe(b));

  if(canHover&&!reduce){
    addEventListener("mousemove",e=>{const r=document.documentElement.style;r.setProperty("--mx",e.clientX+"px");r.setProperty("--my",e.clientY+"px")},{passive:true});
    $$(".proj,.stat").forEach(card=>{
      card.addEventListener("mousemove",e=>{
        const b=card.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;
        card.style.transform="perspective(700px) rotateX("+(-y*7)+"deg) rotateY("+(x*7)+"deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave",()=>{card.style.transform=""});
    });
  }

  const skills=$$(".skill"),usable=$$("[data-uses]"),info=$("#linkInfo");
  usable.forEach((n,i)=>{n.id=n.id||"use"+i});
  let cur=null;
  const labelOf=n=>{const h=n.querySelector("h3,span");return h?h.textContent.trim():"item"};
  function clearLink(){
    cur=null;skills.forEach(s=>{s.classList.remove("sel");s.setAttribute("aria-pressed","false")});
    usable.forEach(n=>n.classList.remove("match"));document.body.classList.remove("linking");info.hidden=true;
  }
  function pick(s){
    if(cur===s){clearLink();return}
    clearLink();cur=s;s.classList.add("sel");s.setAttribute("aria-pressed","true");
    const k=s.dataset.k,name=s.querySelector("span").textContent;
    const hits=usable.filter(n=>n.dataset.uses.split(" ").includes(k));
    hits.forEach(n=>n.classList.add("match"));
    document.body.classList.toggle("linking",hits.length>0);
    info.innerHTML="";
    const t=document.createElement("div");
    t.innerHTML="<b></b>";t.firstChild.textContent=name;
    t.append(hits.length?" appears in "+hits.length+" place"+(hits.length>1?"s":"")+" on this page:":" is not tied to a listed project or certificate yet. I learned it through coursework.");
    info.append(t);
    const row=document.createElement("div");row.className="chips";
    hits.forEach(n=>{const b=document.createElement("button");b.type="button";b.textContent=labelOf(n);b.onclick=()=>go("#"+n.id);row.append(b)});
    const c=document.createElement("button");c.type="button";c.className="clr";c.textContent="Clear";c.onclick=clearLink;row.append(c);
    info.append(row);info.hidden=false;
  }
  skills.forEach(s=>{
    s.tabIndex=0;s.setAttribute("role","button");s.setAttribute("aria-pressed","false");
    s.addEventListener("click",()=>pick(s));
    s.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();pick(s)}});
  });

  // Real or AI? game. To use real audio, add clips here, for example:
  // {src:"audio/clip1.mp3",answer:"real",why:"Natural breathing and pitch changes."}
  const CLIPS=[];
  const QUIZ=[
    {q:"Which of these is a common clue that a voice may be synthetic?",opts:["Very even pitch and rhythm with no natural breaths","Some traffic noise in the background","A slightly hoarse voice"],ans:0,why:"Synthetic speech often lacks the small, natural variations of a real speaker. Modern fakes can be convincing, which is why detectors analyse signal features instead of relying on the ear."},
    {q:"In my project, what does Linear Prediction do with a speech signal?",opts:["Turns speech into text","Predicts each sample from earlier samples, which captures the shape of the vocal tract","Removes all background noise"],ans:1,why:"Linear Prediction models how each audio sample depends on the ones before it. The Wiener–Hopf equations give the best predictor coefficients, and those coefficients become features for the classifier."},
    {q:"What is the ASVspoof 2019 LA dataset?",opts:["A video game engine","A cloud service from AWS","A benchmark of genuine and spoofed speech for anti-spoofing research"],ans:2,why:"It contains real human speech and spoofed speech made with text-to-speech and voice conversion, so researchers can compare detection methods fairly."},
    {q:"Why does a detector need to be \"reliability-aware\" and \"explainable\"?",opts:["So audio files become smaller","So people can see why audio was flagged and how far to trust the result","So it runs without a computer"],ans:1,why:"A detector that only says \"fake\" is hard to trust. Showing its reasoning and confidence helps people decide what to do with the verdict."}
  ];
  const rounds=CLIPS.length?CLIPS.map(c=>({audio:c.src,q:"Listen to the clip. Is this voice real or AI-generated?",opts:["Real human","AI-generated"],ans:c.answer==="real"?0:1,why:c.why||""})):QUIZ;
  const gBody=$("#gBody"),gMeta=$("#gMeta");
  let gi=0,score=0,audio=null;
  const mk=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt)n.textContent=txt;return n};
  function stopAudio(){if(audio){audio.pause();audio=null}}
  function round(){
    stopAudio();
    if(gi>=rounds.length)return end();
    const r=rounds[gi];
    gMeta.textContent="Round "+(gi+1)+" of "+rounds.length+" · Score "+score;
    gBody.innerHTML="";
    gBody.append(mk("p","gq",r.q));
    const wrap=mk("div","gopts"),fb=mk("p","gfb"),nx=mk("button","btn fill gnext",gi===rounds.length-1?"See my score":"Next");
    if(r.audio){
      const pb=mk("button","btn gplay","▶ Play clip");pb.type="button";
      pb.onclick=()=>{
        if(!audio){audio=new Audio(r.audio);audio.onended=()=>{pb.textContent="▶ Play again"}}
        if(audio.paused){audio.play().catch(()=>{fb.textContent="This clip could not be played."});pb.textContent="❚❚ Pause"}
        else{audio.pause();pb.textContent="▶ Play"}
      };
      gBody.append(pb);
    }
    fb.setAttribute("role","status");nx.type="button";nx.hidden=true;
    r.opts.forEach((t,k)=>{
      const b=mk("button","gopt",t);b.type="button";
      b.onclick=()=>{
        const btns=$$(".gopt",wrap);btns.forEach(x=>x.disabled=true);
        btns[r.ans].classList.add("ok");
        if(k===r.ans){score++;fb.textContent="Correct! "+r.why}
        else{b.classList.add("bad");fb.textContent="Not quite. "+r.why}
        gMeta.textContent="Round "+(gi+1)+" of "+rounds.length+" · Score "+score;
        nx.hidden=false;nx.focus();
      };
      wrap.append(b);
    });
    nx.onclick=()=>{gi++;round()};
    gBody.append(wrap,fb,nx);
  }
  function end(){
    gMeta.textContent="Finished";gBody.innerHTML="";
    gBody.append(mk("p","gscore",score+" / "+rounds.length));
    const msg=score===rounds.length?"Perfect! You think like a deepfake detector.":score>=rounds.length/2?"Nice work. You spotted most of the clues.":"Good try. Deepfakes are hard to catch, and that is why this research matters.";
    gBody.append(mk("p","gq",msg));
    const row=mk("div","gend"),again=mk("button","btn gagain","Play again"),pr=mk("a","btn fill","See the project");
    again.type="button";again.onclick=()=>{gi=0;score=0;round()};pr.href="#projects";
    row.append(again,pr);gBody.append(row);
  }
  round();

  // command menu (Ctrl+K or Cmd+K)
  const pal=$("#pal"),palIn=$("#palIn"),palList=$("#palList");
  const link=u=>()=>window.open(u,"_blank","noopener");
  const cmds=[
    ["Go to About",()=>go("#about")],["Go to Education",()=>go("#education")],["Go to Skills",()=>go("#skills")],
    ["Go to Internship",()=>go("#internship")],["Go to Projects",()=>go("#projects")],["Play the Real or AI? game",()=>go("#game")],
    ["Go to Certifications",()=>go("#certs")],["Go to Contact",()=>go("#contact")],
    ["Switch light / dark theme",()=>$("#theme").click()],["Ask the quick-answer assistant",()=>$("#chat-fab").click()],
    ["Copy email address",()=>$("#copyMail").click()],
    ["Open my resume (PDF)",()=>{const a=$('a[download]');if(a)a.click()}],
    ["Open GitHub",link("https://github.com/keerthikaA2006")],["Open LinkedIn",link("https://www.linkedin.com/in/keerthika-a-6072a932a/")],
    ["Back to top",()=>scrollTo({top:0,behavior:"smooth"})]
  ];
  let shown=[],sel=0,lastFocus=null;
  function mark(){$$("li",palList).forEach((li,k)=>{li.classList.toggle("sel",k===sel);if(k===sel)li.scrollIntoView({block:"nearest"})})}
  function render(q){
    palList.innerHTML="";q=q.trim().toLowerCase();
    shown=cmds.filter(c=>c[0].toLowerCase().includes(q));sel=0;
    shown.forEach((c,k)=>{const li=mk("li","",c[0]);li.setAttribute("role","option");li.onclick=()=>run(c);li.onmousemove=()=>{sel=k;mark()};palList.append(li)});
    if(!shown.length)palList.append(mk("li","none","No matching command"));
    mark();
  }
  function openPal(){lastFocus=document.activeElement;pal.classList.add("open");palIn.value="";render("");palIn.focus()}
  function closePal(){pal.classList.remove("open");if(lastFocus&&lastFocus.focus)lastFocus.focus()}
  function run(c){closePal();setTimeout(c[1],50)}
  palIn.addEventListener("input",()=>render(palIn.value));
  palIn.addEventListener("keydown",e=>{
    if(e.key==="ArrowDown"){e.preventDefault();if(shown.length){sel=(sel+1)%shown.length;mark()}}
    else if(e.key==="ArrowUp"){e.preventDefault();if(shown.length){sel=(sel-1+shown.length)%shown.length;mark()}}
    else if(e.key==="Enter"){e.preventDefault();if(shown[sel])run(shown[sel])}
  });
  pal.addEventListener("mousedown",e=>{if(e.target===pal)closePal()});
  $("#kbtn").onclick=openPal;
  addEventListener("keydown",e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();pal.classList.contains("open")?closePal():openPal()}
    else if(e.key==="Escape"&&pal.classList.contains("open"))closePal();
  });
})();