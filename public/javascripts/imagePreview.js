const fileInput = document.getElementById("coverImage");
const preview = document.getElementById("preview");

fileInput.addEventListener("change", (e) => {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
        preview.src = event.target.result;
    };

    reader.readAsDataURL(file);
});
