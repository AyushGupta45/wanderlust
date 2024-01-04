(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

const taxCheckbox = document.getElementById("flexSwitchCheckDefault");

taxCheckbox.addEventListener("change", function () {
  const allCards = document.querySelectorAll(".card");

  allCards.forEach((card) => {
    const originalPriceElement = card.querySelector(".original-price");
    const calculatedGstElement = card.querySelector(".calculated-gst");

    const originalPrice = parseInt(
      originalPriceElement.innerText.replace(/,/g, "")
    );
    const gst = originalPrice * 0.18;
    const totalWithGST = originalPrice + gst;

    if (taxCheckbox.checked) {
      originalPriceElement.style.display = "none";
      calculatedGstElement.innerHTML = `${totalWithGST.toLocaleString(
        "en-IN"
      )} / Night <b><i style="font-size: 12px;">&nbsp;&nbsp;+18% gst</i></b>`;
      calculatedGstElement.style.display = "inline";
    } else {
      originalPriceElement.style.display = "inline";
      calculatedGstElement.style.display = "none";
    }
  });
});
