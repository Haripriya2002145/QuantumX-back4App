// H to Be elements
//Teachable Machine model Url

//const URL = "https://teachablemachine.withgoogle.com/models/XTs3NXuAG/"; 
const URL = "https://teachablemachine.withgoogle.com/models/47eTKbQ0I/";//sample

let model, webcam, labelContainer, maxPredictions;
//is started Webcam flag
let startCamFlag = true;
//is started Upload flag
let startUpFlag = true;

let camButton = document.getElementById("camButton"), upButton = document.getElementById("upButton");


function startCamHandler() {
    if (startUpFlag) {
        if (startCamFlag) init();
        else stop();
        startCamFlag = !startCamFlag;
    }
}

function startUpHandler() {
    if (startCamFlag) {
        if (startUpFlag) openUploadImage();
        else closeUploadImage();
        startUpFlag = !startUpFlag;
    }
}

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");

    labelContainer.appendChild(document.createElement("div"));

    //Changing button text
    camButton.textContent = "Stop";
    
    //Showing containers //6oth line
    document.getElementById("webcam-container").className = "";
    document.getElementById("label-container").className = "";
    document.getElementById("fullAnswer").className="";

}

async function stop() {
    await webcam.stop();
    document.getElementById("webcam-container").removeChild(webcam.canvas);

    labelContainer = document.getElementById("label-container");
    console.log(labelContainer.children);

    labelContainer.removeChild(labelContainer.children[0]);
   
    camButton.textContent = "Start Webcam";

    //Change Answer
    document.getElementById("fullAnswer").innerHTML="";

    //Hiding containers
    document.getElementById("webcam-container").className = "d-none";
    document.getElementById("label-container").className = "d-none";
    document.getElementById("fullAnswer").className="d-none";

}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict(imageModel = webcam.canvas) {
    let highestProbability;
    let lastProbability = 0;
    // predict can take in an image, video or canvas html element

    const prediction = await model.predict(imageModel);
    console.log(prediction);
    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability.toFixed(2) > lastProbability)
            highestProbability = i;
        lastProbability = prediction[i].probability.toFixed(2);
    }
    const className1 = prediction[highestProbability].className;
    let classNameShow = className1;
    //document.getElementById("label-container").innerHTML=classNameShow;
    labelContainer.childNodes[0].innerHTML = classNameShow;

    //Predict the answer
    if(classNameShow=="Hydrogen"){
        document.getElementById("fullAnswer").innerHTML="Atomic Number: 1 <br> Atomic Mass: 1.00797 amu <br> Group: 1 <br> Electronic Configuration: 1s"+'1'.sup();
    }
    else if(classNameShow=="Helium"){
        document.getElementById("fullAnswer").innerHTML="Atomic Number: 2 <br> Atomic Mass: 4.00260 amu <br> Group: 18 <br> Electronic Configuration: 1s"+'2'.sup();
    }
    else if(classNameShow=="Lithium"){
        document.getElementById("fullAnswer").innerHTML="Atomic Number: 3 <br> Atomic Mass: 6.941 amu <br> Group: 1 <br> Electronic Configuration: [He] 2s"+'1'.sup();
    }
    else if(classNameShow=="Beryllium"){
        document.getElementById("fullAnswer").innerHTML="Atomic Number: 4 <br> Atomic Mass: 9.01218 amu <br> Group: 2 <br> Electronic Configuration: [He] 2s"+'2'.sup();
    }
}

function openUploadImage() {
    //Showing elements
    document.getElementById("inp").className = "";
    document.getElementById("canvas").className = "";
    document.getElementById("fullAnswer").className="";

    //Changing button text
    upButton.textContent = "Close";
}
function closeUploadImage() {
    labelContainer = document.getElementById("label-container");
    let canvas = document.getElementById("canvas"),input = document.getElementById("inp");

    //Hiding input
    input.className = "d-none";
    input.value = null;

    //Removing Label
    labelContainer.className = "d-none";
    if (labelContainer.children.length > 0)
        labelContainer.removeChild(labelContainer.children[0]);
    canvas.className = "d-none";

    //Removing and changing the answer
    document.getElementById("fullAnswer").innerHTML="";
    document.getElementById("fullAnswer").className="d-none";

    //Clear canvas
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    upButton.textContent = "Upload Image";    
}

//Uploading Image

document.getElementById("inp").onchange = function (e) {
    var img = new Image();
    img.onload = draw;
    img.onerror = failed;
    img.src = window.URL.createObjectURL(this.files[0]);
};
async function draw() {
    var canvas = document.getElementById("canvas");
    canvas.width = this.width;
    canvas.height = this.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(this, 0, 0);

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    labelContainer = document.getElementById("label-container");
    labelContainer.appendChild(document.createElement("div"));

    labelContainer.className = "";
    await predict(canvas);
}
function failed() {
    console.error("The provided file couldn't be loaded as an Image media");
}



