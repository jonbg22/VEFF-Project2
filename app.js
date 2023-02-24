// Global Variables
let tunes = [];
let recording = false;
let recordingTime;
let recordedNotes = [];
const synth = new Tone.Synth().toDestination();
const url = 'http://localhost:3000/api/v1/tunes';


// Fetches tunes from server
const getAllTunes = async () => {
    //The URL to which we will send the request

    //Perform a GET request to the url
    try {
        const response = await axios.get(url);
        //When successful, print the received data
        // console.log("Success: ", response.data);
        return response.data;
    }
    catch (error) {
        //When unsuccessful, print the error.
        console.log(error);
    }
}

// Updates the tunes array and populates the website tune selection
const initTunes = async () => { 
    tunes = await getAllTunes();
    const tunesDrop = document.querySelector("#tunesDrop");
    console.log(tunes);
    if (tunes === undefined) {
        tunesDrop.innerHTML = "<option>No Tunes Available</option>"
    }
    else {
    tunesDrop.innerHTML = "";
    tunes.forEach(tune => {
        let optionEl = document.createElement("option");
        optionEl.setAttribute("tuneID",tune.id);
        optionEl.value = tune.name;
        optionEl.textContent = tune.name;
        tunesDrop.append(optionEl);
    });
  }
}

// Initializes the keyboard functionality
const initKeyboard = () => {
    // Fetches all keyboard buttons from DOM into NodeList and casts to Array
    const allKeys = [...document.querySelectorAll("#keyboardDiv > button")];
    // console.log(allKeys);
    allKeys.forEach(key => {
        key.addEventListener("click",() => {
            playNote(key.id);
            if (recording) {
                recordedNotes.push({
                    "note": key.id,
                    "duration": "8n",
                    "timing": Tone.now() - recordingTime
                })
            }
        })
    });
    // Inits Listener for using piano with keyboard
    initKeybardListener();
}

const initKeybardListener = () => {
    // Clicks the corresponding piano key when keyboard is pressed and adds "down" class
    document.addEventListener('keydown', (event) => {
    if (event.repeat || event.target.id === "recordingName") return
        let btn;
        switch (event.key) {
            case "a":
                btn = document.getElementById("c4");
                btn.click();
                btn.classList.add("down");
                break;
            case "w":
                btn = document.getElementById("c#4");
                btn.click();
                btn.classList.add("down");
                break;
            case "s":
                btn = document.getElementById("d4");
                btn.click();
                btn.classList.add("down");
                break;
            case "e":
                btn = document.getElementById("d#4");
                btn.click();
                btn.classList.add("down");
                break;
            case "d":
                btn = document.getElementById("e4");
                btn.click();
                btn.classList.add("down");
                break;
            case "f":
                btn = document.getElementById("f4");
                btn.click();
                btn.classList.add("down");
                break;
            case "t":
                btn = document.getElementById("f#4");
                btn.click();
                btn.classList.add("down");
                break;
            case "g":
                btn = document.getElementById("g4");
                btn.click();
                btn.classList.add("down");
                break;
            case "y":
                btn = document.getElementById("g#4");
                btn.click();
                btn.classList.add("down");
                break;
            case "h":
                btn = document.getElementById("a4");
                btn.click();
                btn.classList.add("down");
                break;
            case "u":
                btn = document.getElementById("bb4");
                btn.click();
                btn.classList.add("down");
                break;
            case "j":
                btn = document.getElementById("b4");
                btn.click();
                btn.classList.add("down");
                break;
            case "k":
                btn = document.getElementById("c5");
                btn.click();
                btn.classList.add("down");
                break;
            case "o":
                btn = document.getElementById("c#5");
                btn.click();
                btn.classList.add("down");
                break;
            case "l":
                btn = document.getElementById("d5");
                btn.click();
                btn.classList.add("down");
                break;
            case "p":
                btn = document.getElementById("d#5");
                btn.click();
                btn.classList.add("down");
                break;
            case ";":
                btn = document.getElementById("e5");
                btn.click();
                btn.classList.add("down");
                break;
        }
    });
    // Removes the "down" class from piano keys when released
    document.addEventListener('keyup', event => {
        switch (event.key) {
            case "a":
                document.getElementById("c4").classList.remove("down");
                break;
            case "w":
                document.getElementById("c#4").classList.remove("down");
                break;
            case "s":
                document.getElementById("d4").classList.remove("down");
                break;
            case "e":
                document.getElementById("d#4").classList.remove("down");
                break;
            case "d":
                document.getElementById("e4").classList.remove("down");
                break;
            case "f":
                document.getElementById("f4").classList.remove("down");
                break;
            case "t":
                document.getElementById("f#4").classList.remove("down");
                break;
            case "g":
                document.getElementById("g4").classList.remove("down");
                break;
            case "y":
                document.getElementById("g#4").classList.remove("down");
                break;
            case "h":
                document.getElementById("a4").classList.remove("down");
                break;
            case "u":
                document.getElementById("bb4").classList.remove("down");
                break;
            case "j":
                document.getElementById("b4").classList.remove("down");
                break;
            case "k":
                document.getElementById("c5").classList.remove("down");
                break;
            case "o":
                document.getElementById("c#5").classList.remove("down");
                break;
            case "l":
                document.getElementById("d5").classList.remove("down");
                break;
            case "p":
                document.getElementById("d#5").classList.remove("down");
                break;
            case ";":
                document.getElementById("e5").classList.remove("down");
                break;
        }
    })
}

const playNote = (note,duration = "8n",delay = 0) => {
    const now = Tone.now();
    synth.triggerAttackRelease(note, duration, now+delay);
}

const playTune = (tuneId) => {
    try {
    const tune = tunes.find((item) => item.id == tuneId);
    tune.tune.forEach((note) => {
        playNote(note.note,note.duration,note.timing)
    })
  } catch {
    console.log("No Tune Available")
  }
}

// Adds functionality to playing songs
const initPlaying = () => {
    const playBtn = document.querySelector("#tunebtn")
    playBtn.addEventListener("click",() => {
        const tunesEl = document.querySelector("#tunesDrop")
        const selectedTune = tunesEl.options[tunesEl.selectedIndex]
        playTune(selectedTune.getAttribute("tuneid"));
    })
}

const toggleRecord = (recording) => {
    // Toggles the disabled state of the record and stop buttons
    const recBtn = document.querySelector("#recordbtn");
    const stopBtn = document.querySelector("#stopbtn")
    const recNameContainer = document.getElementById("recordingNameContainer");
    const recNameInput = recNameContainer.querySelector("#recordingName");

    if (recording === true) {
        recBtn.setAttribute("disabled",true)
        stopBtn.removeAttribute("disabled");
        recNameContainer.style.display = "flex";
    } else {
        stopBtn.setAttribute("disabled",true)
        recBtn.removeAttribute("disabled");
        recNameContainer.style.display = "none";
        recNameInput.value = "";
    }
}

// Adds functionality to recording songs
const initRecording = () => {
    const recBtn = document.querySelector("#recordbtn");
    recBtn.addEventListener("click", () => {
        recordingTime = Tone.now();
        recording = true;
        toggleRecord(true);
    });

    const stopBtn = document.querySelector("#stopbtn")
    stopBtn.addEventListener("click", () => {
        uploadRecording();
        recordedNotes = [];
        recordingTime = null;
        recording = false;
        toggleRecord(false);
    });
}

const uploadRecording = async () => {
    if (recordedNotes.length === 0) return
    const recNameInput = document.querySelector("#recordingName");
    
    const newTune = {
        "name": recNameInput.value != "" ? recNameInput.value : "No-name Tune",
        "tune": recordedNotes
    }

    // Upload recorded note using POST
    try {
        await axios.post(url, {
            "name": newTune.name,
            "tune": newTune.tune
        })
        // console.log("Post Successful")
        initTunes(); // updates the tunes array and selection on site
    }
    catch (error) {
        console.log("Unable to Upload:",error)
    }
}


initTunes();

initKeyboard();

initPlaying();
initRecording();

