/* =====================================
   NOVA INCLUSIVE LEARNING
===================================== */


/* ELEMENTS */

const inputText =
    document.getElementById("inputText");

const wordCount =
    document.getElementById("wordCount");

const result =
    document.getElementById("translationResult");

const fromLanguage =
    document.getElementById("fromLanguage");

const toLanguage =
    document.getElementById("toLanguage");

const translateBtn =
    document.getElementById("translateBtn");

const copyBtn =
    document.getElementById("copyBtn");

const swapBtn =
    document.getElementById("swapBtn");


/* =====================================
   WORD COUNT
===================================== */

inputText.addEventListener("input", function () {

    const text =
        inputText.value.trim();

    if (text === "") {

        wordCount.textContent =
            "0 words";

    } else {

        const words =
            text.split(/\s+/).length;

        wordCount.textContent =
            words + " words";

    }

});


/* =====================================
   CLEAR
===================================== */

document
    .getElementById("clearBtn")
    .addEventListener("click", function () {

        inputText.value = "";

        wordCount.textContent =
            "0 words";

    });


/* =====================================
   TEXT TO SPEECH
===================================== */

function readText() {

    const text =
        inputText.value.trim();

    if (text === "") {

        alert(
            "Please enter text first."
        );

        return;

    }


    if (!window.speechSynthesis) {

        alert(
            "Text-to-speech is not supported."
        );

        return;

    }


    speechSynthesis.cancel();


    const speech =
        new SpeechSynthesisUtterance(text);


    speech.rate = 0.9;

    speech.pitch = 1;

    speech.volume = 1;


    speechSynthesis.speak(speech);

}


document
    .getElementById("listenBtn")
    .addEventListener(
        "click",
        readText
    );


document
    .getElementById("readTool")
    .addEventListener(
        "click",
        readText
    );


/* =====================================
   SPEECH TO TEXT
===================================== */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


let recognition = null;


if (SpeechRecognition) {

    recognition =
        new SpeechRecognition();

    recognition.continuous = false;

    recognition.interimResults = false;


    recognition.onstart = function () {

        document
            .getElementById("speechStatus")
            .textContent =
            "🔴 Listening... Speak now";

    };


    recognition.onresult =
        function (event) {

            const speech =
                event.results[0][0].transcript;


            inputText.value =
                speech;


            const words =
                speech.trim()
                    .split(/\s+/)
                    .length;


            wordCount.textContent =
                words + " words";


            document
                .getElementById("speechStatus")
                .textContent =
                "✓ Speech converted to text";

        };


    recognition.onerror =
        function () {

            document
                .getElementById("speechStatus")
                .textContent =
                "Speech recognition error";

        };


    recognition.onend =
        function () {

            setTimeout(function () {

                document
                    .getElementById("speechStatus")
                    .textContent =
                    "Ready to listen";

            }, 1500);

        };

}


/* START SPEECH */

function startSpeech() {

    if (!recognition) {

        alert(
            "Speech recognition is not supported. Please use Google Chrome."
        );

        return;

    }


    const lang =
        fromLanguage.value;


    const speechLanguages = {

        en: "en-IN",

        te: "te-IN",

        hi: "hi-IN",

        ta: "ta-IN",

        kn: "kn-IN",

        ml: "ml-IN",

        fr: "fr-FR",

        de: "de-DE",

        es: "es-ES"

    };


    recognition.lang =
        speechLanguages[lang] || "en-IN";


    recognition.start();

}


document
    .getElementById("startSpeech")
    .addEventListener(
        "click",
        startSpeech
    );


document
    .getElementById("speechTool")
    .addEventListener(
        "click",
        function () {

            document
                .getElementById("workspace")
                .scrollIntoView({
                    behavior: "smooth"
                });

            setTimeout(
                startSpeech,
                500
            );

        }
    );


document
    .getElementById("heroSpeech")
    .addEventListener(
        "click",
        function () {

            document
                .getElementById("workspace")
                .scrollIntoView({
                    behavior: "smooth"
                });

            setTimeout(
                startSpeech,
                500
            );

        }
    );


/* =====================================
   LANGUAGE SWAP
===================================== */

swapBtn.addEventListener(
    "click",
    function () {

        const temp =
            fromLanguage.value;

        fromLanguage.value =
            toLanguage.value;

        toLanguage.value =
            temp;

    }
);


/* =====================================
   REAL TRANSLATION
===================================== */

translateBtn.addEventListener(
    "click",
    async function () {

        const text =
            inputText.value.trim();


        const source =
            fromLanguage.value;


        const target =
            toLanguage.value;


        if (text === "") {

            alert(
                "Please enter text to translate."
            );

            return;

        }


        if (source === target) {

            result.innerHTML = `
                <div style="
                    color:#ffb4b4;
                    padding:20px;
                ">
                    Please select two different languages.
                </div>
            `;

            return;

        }


        /* LOADING */

        translateBtn.textContent =
            "Translating...";


        translateBtn.disabled =
            true;


        result.innerHTML = `

            <div class="empty">

                <div>✨</div>

                <p>
                    NOVA is translating...
                </p>

            </div>

        `;


        try {

            /*
                MyMemory Translation API

                No API key required for
                small hackathon demos.
            */

            const url =
                "https://api.mymemory.translated.net/get" +
                "?q=" +
                encodeURIComponent(text) +
                "&langpair=" +
                source +
                "|" +
                target;


            const response =
                await fetch(url);


            if (!response.ok) {

                throw new Error(
                    "Translation request failed"
                );

            }


            const data =
                await response.json();


            if (
                !data.responseData ||
                !data.responseData.translatedText
            ) {

                throw new Error(
                    "No translation returned"
                );

            }


            const translated =
                data.responseData.translatedText;


            result.innerHTML = `

                <div style="
                    color:#ffffff;
                    font-size:17px;
                    line-height:1.8;
                ">

                    ${escapeHTML(
                        translated
                    )}

                </div>

            `;


        } catch (error) {

            console.error(error);


            result.innerHTML = `

                <div style="
                    color:#ffb4b4;
                    padding:20px;
                    line-height:1.7;
                ">

                    <strong>
                        Translation could not be completed.
                    </strong>

                    <br><br>

                    Please check your internet connection
                    and try again.

                </div>

            `;

        }


        translateBtn.textContent =
            "Translate with NOVA →";


        translateBtn.disabled =
            false;

    }
);


/* =====================================
   COPY
===================================== */

copyBtn.addEventListener(
    "click",
    async function () {

        const text =
            result.innerText.trim();


        if (
            !text ||
            text.includes(
                "Your translated text"
            )
        ) {

            return;

        }


        try {

            await navigator.clipboard
                .writeText(text);


            copyBtn.textContent =
                "✓ Copied";


            setTimeout(function () {

                copyBtn.textContent =
                    "📋 Copy";

            }, 1500);


        } catch {

            alert(
                "Copy is not available."
            );

        }

    }
);


/* =====================================
   ACCESSIBILITY
===================================== */


/* CONTRAST */

document
    .getElementById("contrastBtn")
    .addEventListener(
        "click",
        function () {

            document.body
                .classList
                .toggle("contrast");


            this.textContent =
                document.body
                    .classList
                    .contains("contrast")
                    ? "Disable"
                    : "Enable";

        }
    );


/* READING MODE */

document
    .getElementById("readingBtn")
    .addEventListener(
        "click",
        function () {

            document.body
                .classList
                .toggle("reading");


            this.textContent =
                document.body
                    .classList
                    .contains("reading")
                    ? "Disable"
                    : "Enable";

        }
    );


/* FOCUS */

document
    .getElementById("focusBtn")
    .addEventListener(
        "click",
        function () {

            document.body
                .classList
                .toggle("focus");


            this.textContent =
                document.body
                    .classList
                    .contains("focus")
                    ? "Disable"
                    : "Enable";

        }
    );


/* =====================================
   FONT SIZE
===================================== */

let fontSize = 16;


document
    .getElementById("largeText")
    .addEventListener(
        "click",
        function () {

            fontSize = 19;

            document.body.style.fontSize =
                fontSize + "px";

        }
    );


document
    .getElementById("smallText")
    .addEventListener(
        "click",
        function () {

            fontSize = 14;

            document.body.style.fontSize =
                fontSize + "px";

        }
    );


document
    .getElementById("normalText")
    .addEventListener(
        "click",
        function () {

            fontSize = 16;

            document.body.style.fontSize =
                "16px";

        }
    );


/* =====================================
   ACCESSIBILITY NAVIGATION
===================================== */

document
    .getElementById("accessibilityBtn")
    .addEventListener(
        "click",
        function () {

            document
                .getElementById("accessibility")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


document
    .getElementById("accessTool")
    .addEventListener(
        "click",
        function () {

            document
                .getElementById("accessibility")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


/* =====================================
   TRANSLATION NAVIGATION
===================================== */

document
    .getElementById("translationTool")
    .addEventListener(
        "click",
        function () {

            document
                .getElementById("workspace")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


/* =====================================
   HTML SECURITY
===================================== */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}