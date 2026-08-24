async function loadFooter(){

  const container =
    document.getElementById(
      "footer-container"
    );


  if(!container){
    return;
  }


  try{

    const response =
      await fetch(
        "footer.html"
      );


    if(!response.ok){

      throw new Error(
        "Impossible de charger le footer."
      );

    }


    const html =
      await response.text();


    container.innerHTML =
      html;

  }


  catch(error){

    console.error(
      "Erreur footer Ti'Doc :",
      error
    );

  }

}


loadFooter();
