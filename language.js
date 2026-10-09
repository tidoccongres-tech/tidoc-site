/* Ti'Doc bilingual text translations; does not modify links or business logic. */
(function(){
  'use strict';
  const EN=window.TIDOC_EN_TRANSLATIONS||{};
  const original=new WeakMap();
  const attrOriginal=new WeakMap();
  const ignored='script,style,code,pre,textarea,option,svg,[data-no-translate],.notranslate';
  let current=(function(){try{return localStorage.getItem('tidoc-language')==='en'?'en':'fr'}catch(e){return 'fr'}})();
  const clean=s=>String(s).replace(/\s+/g,' ').trim();
  const normalized=s=>clean(s).normalize('NFC');
  const match=s=>EN[normalized(s)];
  function rewriteText(node){
    if(!node.parentElement||node.parentElement.closest(ignored))return;
    if(!original.has(node))original.set(node,node.nodeValue);
    const source=original.get(node);
    const value=match(source);
    if(!value){if(current==='fr'&&node.nodeValue!==source)node.nodeValue=source;return}
    const leading=(source.match(/^\s*/)||[''])[0],trailing=(source.match(/\s*$/)||[''])[0];
    const result=current==='en'?leading+value+trailing:source;
    if(node.nodeValue!==result)node.nodeValue=result;
  }
  function rewriteAttrs(el){
    const names=['placeholder','title','aria-label','alt'];
    let saved=attrOriginal.get(el);
    if(!saved){saved={};attrOriginal.set(el,saved)}
    for(const name of names){
      if(!el.hasAttribute(name))continue;
      if(!(name in saved))saved[name]=el.getAttribute(name);
      const src=saved[name],value=match(src);
      if(value)el.setAttribute(name,current==='en'?value:src);
    }
  }
  function translate(root){
    if(!root)return;
    if(root.nodeType===3){rewriteText(root);return}
    if(root.nodeType!==1&&root.nodeType!==9)return;
    if(root.nodeType===1&&root.matches(ignored))return;
    if(root.nodeType===1)rewriteAttrs(root);
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);
    let n;while((n=walker.nextNode())){
      if(n.nodeType===3)rewriteText(n);
      else if(!n.closest(ignored))rewriteAttrs(n);
    }
    document.documentElement.lang=current;
    document.querySelectorAll('.language-choice').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.lang===current)));
  }
  function setLanguage(lang){
    current=lang==='en'?'en':'fr';
    try{localStorage.setItem('tidoc-language',current)}catch(e){}
    translate(document.body);
  }
  document.addEventListener('click',e=>{const button=e.target.closest('.language-choice');if(button)setLanguage(button.dataset.lang)});
  let running=false;
  const observer=new MutationObserver(changes=>{
    if(running)return;
    running=true;
    observer.disconnect();
    for(const change of changes){
      if(change.type==='childList')change.addedNodes.forEach(n=>translate(n));
    }
    translate(document.body);
    observer.observe(document.body,{childList:true,subtree:true});
    running=false;
  });
  function start(){translate(document.body);observer.observe(document.body,{childList:true,subtree:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
  window.TiDocLanguage={get:()=>current,set:setLanguage,refresh:()=>translate(document.body)};
})();
