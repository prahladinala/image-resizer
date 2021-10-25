const fileInput = document.querySelector(".resizer-file");
const widthInput = document.querySelector(".resizer-width");
const heightInput = document.querySelector(".resizer-height");
const aspectInput = document.querySelector(".resizer-aspect");

const resizerOption1 = document.querySelector(".resizer-option1")
const resizerOption2 = document.querySelector(".resizer-option2")
const resizerOption3 = document.querySelector(".resizer-option3")

const canvas = document.querySelector(".resizer-canvas");
const canvasCtx = canvas.getContext("2d");

const downJpg = document.querySelector(".resize-jpg")
const downPng = document.querySelector(".resize-png")
const copyImg = document.querySelector(".resize-cpy")


let activeImage, originalWidthToHeightRatio;

fileInput.addEventListener("change", e => {
    // console.log(e)

    // OPTIONS DISPLAY STYLE
    resizerOption1.style.display = "block"
    resizerOption2.style.display = "block"
    resizerOption3.style.display = "block"

    const reader = new FileReader();
    reader.addEventListener("load", () => {
        // console.log(reader.result)
        openImage(reader.result)
    })
    reader.readAsDataURL(e.target.files[0]);

})

widthInput.addEventListener("change", () => {
    if (!activeImage) return;

    const heightValue = aspectInput.checked ? widthInput.value / originalWidthToHeightRatio : heightInput.value;
    resize(widthInput.value, heightValue);
})

heightInput.addEventListener("change", () => {
    if (!activeImage) return;
    const widthValue = aspectInput.checked ? heightInput.value / originalWidthToHeightRatio : widthInput.value;

    resize(widthValue, heightInput.value);
})

function openImage(imageSrc) {
    activeImage = new Image();

    activeImage.addEventListener("load", () => {
        originalWidthToHeightRatio = activeImage.width / activeImage.height;

        resize(activeImage.width, activeImage.height)
    })

    activeImage.src = imageSrc;

    // console.log(activeImage);
}

function resize(width, height) {
    canvas.width = Math.floor(width);
    canvas.height = Math.floor(height);

    widthInput.value = Math.floor(width);
    heightInput.value = Math.floor(height);

    canvasCtx.drawImage(activeImage, 0, 0, Math.floor(width), Math.floor(height))
}

downPng.addEventListener('click', () => {
    // IF IE/EDGE Supports only PNG
    if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(canvas.msToBlob(), "prahladinala-png-resizer.png");
        console.log("IE/EDGE")
    } else {
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = canvas.toDataURL();
        a.download = "prahladinala-png-resizer.png";
        a.click();
        document.body.removeChild(a);
    }
    console.log("Downloading PNG")

})

downJpg.addEventListener('click', () => {
    // IF IE/EDGE Supports only PNG
    if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(canvas.msToBlob(), "prahladinala-jpg-resizer.png");
        console.log("IE/EDGE")
    } else {
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = canvas.toDataURL("image/jpeg", 1);
        a.download = "prahladinala-jpg-resizer.jpg";
        a.click();
        document.body.removeChild(a);
    }
    console.log("Downloading JPEG")

})
function imageToBlob(imageURL) {
    const img = new Image;
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    img.crossOrigin = "";
    img.src = imageURL;
    return new Promise(resolve => {
        img.onload = function () {
            c.width = this.naturalWidth;
            c.height = this.naturalHeight;
            ctx.drawImage(this, 0, 0);
            c.toBlob((blob) => {
                // here the image is a blob
                resolve(blob)
            }, "image/png", 0.75);
        };
    })
}
async function copyImage(imageURL) {
    const blob = await imageToBlob(imageURL)
    const item = new ClipboardItem({ "image/png": blob });
    navigator.clipboard.write([item]);
}
copyImg.addEventListener('click', () => {
    copyImage(activeImage.src)

    // console.log(activeImage.src)
})