async function loadHeader(){

  const container =
    document.getElementById(
      "header-container"
    );


  if(!container){
    return;
  }


  try{

    const response =
      await fetch(
        "header.html"
      );


    if(!response.ok){

      throw new Error(
        "Impossible de charger le header."
      );

    }


    const html =
      await response.text();


    container.innerHTML =
      html;


    setupMobileNavigation();
    setupHeaderDropdowns();
    setupActiveNavigation();
    await ensureLanguageSystem();

  }


  catch(error){

    console.error(
      "Erreur header Ti'Doc :",
      error
    );

  }

}


async function ensureLanguageSystem(){
  if(window.TiDocLanguage){
    window.TiDocLanguage.refresh?.();
    return;
  }

  function loadScript(src){
    return new Promise((resolve,reject)=>{
      const existing=document.querySelector(`script[src="${src}"]`);
      if(existing){
        if(
          existing.dataset.loaded==='true' ||
          (src==='translations.js' && window.TIDOC_EN_TRANSLATIONS) ||
          (src==='language.js' && window.TiDocLanguage)
        ){
          resolve();
        }else{
          existing.addEventListener('load',()=>resolve(),{once:true});
          existing.addEventListener('error',()=>reject(new Error(`Impossible de charger ${src}`)),{once:true});
        }
        return;
      }

      const script=document.createElement('script');
      script.src=src;
      script.defer=true;
      script.dataset.loaded='false';
      script.onload=()=>{
        script.dataset.loaded='true';
        resolve();
      };
      script.onerror=()=>reject(new Error(`Impossible de charger ${src}`));
      document.head.appendChild(script);
    });
  }

  try{
    await loadScript('translations.js');
    await loadScript('language.js');
    window.TiDocLanguage?.refresh?.();
  }
  catch(error){
    console.error("Erreur chargement traductions Ti'Doc :", error);
  }
}


/* Current page stays highlighted, including the selected edition. */
function setupActiveNavigation(){
  const nav=document.getElementById('main-navigation');
  if(!nav)return;
  const url=new URL(window.location.href);
  const page=url.pathname.split('/').pop()||'index.html';
  const edition=url.searchParams.get('edition');
  const links=[...nav.querySelectorAll('a[href]')];
  for(const link of links){
    const target=new URL(link.getAttribute('href'),window.location.href);
    const targetPage=target.pathname.split('/').pop()||'index.html';
    const targetEdition=target.searchParams.get('edition');
    let active=false;
    if(page==='index.html'&&targetPage==='index.html'){
      // Both top-level Home and matching anchor remain relevant.
      active=!link.closest('.nav-dropdown-menu');
    }else if(page==='activites.html'&&targetPage==='activites.html'){
      active=edition ? targetEdition===edition : !targetEdition;
    }else{
      active=page===targetPage && !targetEdition;
    }
    if(!active)continue;
    link.classList.add('is-current');
    link.setAttribute('aria-current','page');
    const dropdown=link.closest('.nav-dropdown');
    if(dropdown){
      dropdown.classList.add('is-current');
      dropdown.querySelector(':scope > .nav-main-row > .nav-main-link')?.classList.add('is-current');
    }
  }
  // Highlight the Activities parent on all edition pages.
  if(page==='activites.html'){
    const parent=nav.querySelector('.nav-main-link[href="activites.html"]');
    parent?.classList.add('is-current');
    parent?.closest('.nav-dropdown')?.classList.add('is-current');
  }
  // Other nested pages select their parent menu.
  if(['equipe.html','wonca.html'].includes(page)){
    nav.querySelector('.nav-main-link[href="apropos.html"]')?.classList.add('is-current');
  }
}

function setupMobileNavigation(){
  const toggle = document.querySelector(".menu-toggle");
  const navigation = document.getElementById("main-navigation");

  if(!toggle || !navigation){
    return;
  }

  toggle.addEventListener("click", function(event){
    event.stopPropagation();
    const isOpen = navigation.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  navigation.addEventListener("click", function(event){
    if(event.target.closest("a")){
      navigation.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("click", function(event){
    if(!event.target.closest("header")){
      navigation.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", function(event){
    if(event.key === "Escape"){
      navigation.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}



/* =====================================================
   MENUS DÉROULANTS
===================================================== */

function setupHeaderDropdowns(){

  const dropdowns =
    document.querySelectorAll(
      ".nav-dropdown"
    );


  dropdowns.forEach(
    dropdown => {

      const toggle =
        dropdown.querySelector(
          ".nav-dropdown-toggle"
        );


      if(!toggle){
        return;
      }


      toggle.addEventListener(
        "click",
        function(event){

          event.preventDefault();
          event.stopPropagation();


          const isOpen =
            dropdown.classList.contains(
              "open"
            );


          /*
            Fermer tous les autres menus
          */

          dropdowns.forEach(
            otherDropdown => {

              otherDropdown
                .classList
                .remove(
                  "open"
                );

            }
          );


          /*
            Si celui-ci était fermé,
            on l'ouvre.
            S'il était déjà ouvert,
            il reste fermé.
          */

          if(!isOpen){

            dropdown
              .classList
              .add(
                "open"
              );

          }

        }
      );



      /*
        Empêche un clic à l'intérieur
        du sous-menu de déclencher
        la fermeture immédiatement.
      */

      const menu =
        dropdown.querySelector(
          ".nav-dropdown-menu"
        );


      menu?.addEventListener(
        "click",
        function(event){

          event.stopPropagation();

        }
      );

    }
  );



  /* ===================================================
     CLIC EN DEHORS = FERMER TOUS LES MENUS
  =================================================== */

  document.addEventListener(
    "click",
    function(){

      dropdowns.forEach(
        dropdown => {

          dropdown
            .classList
            .remove(
              "open"
            );

        }
      );

    }
  );



  /* ===================================================
     TOUCHE ÉCHAP = FERMER
  =================================================== */

  document.addEventListener(
    "keydown",
    function(event){

      if(
        event.key ===
        "Escape"
      ){

        dropdowns.forEach(
          dropdown => {

            dropdown
              .classList
              .remove(
                "open"
              );

          }
        );

      }

    }
  );

}



/* =====================================================
   CHARGEMENT DU HEADER
===================================================== */

loadHeader();
