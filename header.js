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



function setupHeaderDropdowns(){

  const dropdowns =
    document.querySelectorAll(
      ".nav-dropdown"
    );


  dropdowns.forEach(
    dropdown => {

      const button =
        dropdown.querySelector(
          ".nav-dropdown-button"
        );


      button?.addEventListener(
        "click",
        function(event){

          event.stopPropagation();


          dropdowns.forEach(
            otherDropdown => {

              if(
                otherDropdown !==
                dropdown
              ){

                otherDropdown
                  .classList
                  .remove(
                    "open"
                  );

              }

            }
          );


          dropdown
            .classList
            .toggle(
              "open"
            );

        }
      );

    }
  );


  document.addEventListener(
    "click",
    function(){

      dropdowns.forEach(
        dropdown =>
          dropdown
            .classList
            .remove(
              "open"
            )
      );

    }
  );

}



loadHeader();
