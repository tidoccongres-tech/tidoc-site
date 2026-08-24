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


    setupHeaderDropdowns();

  }


  catch(error){

    console.error(
      "Erreur header Ti'Doc :",
      error
    );

  }

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
