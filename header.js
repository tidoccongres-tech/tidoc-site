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
