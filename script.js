// ===== IMAGE SELECT FEEDBACK + PREVIEW =====
const uploadInput = document.getElementById("upload");
const fileInfo = document.getElementById("file-info");
const preview = document.getElementById("preview");

uploadInput.addEventListener("change", function(){
    if(this.files && this.files[0]){
        const file = this.files[0];
        fileInfo.innerText = `Selected: ${file.name}`;

        const reader = new FileReader();
        reader.onload = e => {
            preview.src = e.target.result;
            preview.style.display = "block";
        }
        reader.readAsDataURL(file);

        // Border color change for feedback
        this.parentElement.style.borderColor = "#22c55e"; // green
    } else {
        fileInfo.innerText = "";
        preview.style.display = "none";
        this.parentElement.style.borderColor = "#6366f1"; // default
    }
});

// ===== IMAGE COMPRESSION FUNCTION =====
function startCompression(){

  const file = document.getElementById("upload").files[0];
  const targetKB = document.getElementById("targetSize").value;
  const loader = document.getElementById("loader");
  const download = document.getElementById("download");

  if(!file || !targetKB){
    alert("Please select image and enter target size");
    return;
  }

  loader.style.display = "block";
  download.style.display = "none";

  const img = new Image();
  const reader = new FileReader();

  reader.onload = e => img.src = e.target.result;

  img.onload = () => {

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext("2d").drawImage(img,0,0);

    let minQ = 0.05;
    let maxQ = 1;
    let finalBlob = null;

    function compress(){
      let q = (minQ + maxQ) / 2;

      canvas.toBlob(blob => {
        let sizeKB = blob.size / 1024;

        if(Math.abs(sizeKB - targetKB) < 5){
          finalBlob = blob;
          finish();
        }
        else if(sizeKB > targetKB){
          maxQ = q;
          compress();
        }
        else{
          minQ = q;
          compress();
        }
      }, "image/jpeg", q);
    }

    function finish(){
      loader.style.display = "none";
      download.href = URL.createObjectURL(finalBlob);
      download.download = "compressed.jpg";
      download.innerText = "⬇ Download Image";
      download.style.display = "block";
    }

    compress();
  };

  reader.readAsDataURL(file);
}