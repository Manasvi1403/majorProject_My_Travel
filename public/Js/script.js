(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


// ⭐ Rating
const starButtons = document.querySelectorAll(".star-btn");
const ratingValue = document.getElementById("rating-value");

starButtons.forEach(button => {
    button.addEventListener("click", function () {

        const rating = Number(this.dataset.rating);

        ratingValue.value = rating;

        starButtons.forEach(star => {
            const starRating = Number(star.dataset.rating);

            if (starRating <= rating) {
                star.classList.add("selected");
            } else {
                star.classList.remove("selected");
            }
        });

    });
});