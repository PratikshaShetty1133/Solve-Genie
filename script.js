//const Api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5:generateContent?key=AIzaSyBbDFTmuwXTmcl12-d4fgpHjamPmf8zvyc";
const Api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=AIzaSyBbDFTmuwXTmcl12-d4fgpHjamPmf8zvyc";
//const Api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=AIzaSyAs25zUcCHLvWLXxR7O-0uJmiR2kZFrdlI";
//const Api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBbDFTmuwXTmcl12-d4fgpHjamPmf8zvyc";
//const Api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAs25zUcCHLvWLXxR7O-0uJmiR2kZFrdlI";
//const Api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=AIzaSyC0Fxoh5dZ5ic0cf2Icw6gs4UrLbOTytTo";
document.addEventListener("DOMContentLoaded", function () {
let innerUploadImage = document.querySelector(".inner-upload-image");
let input = innerUploadImage.querySelector("input");
let image = document.querySelector("#image");
let loading = document.querySelector("#loading");
let uploadBtn = document.querySelector("#uploadBtn");
let manualBtn = document.querySelector("#manualBtn");
let text = document.querySelector("#text");
let videoResults = document.getElementById("videoResults");
const resetUploadImageBtn = document.getElementById("resetUploadImageBtn");
const icon = document.getElementById("icon");
let output = document.querySelector(".output");
const imageResult = document.getElementById("imageResult");
const uploadText = document.querySelector(".inner-upload-image span");
let equationInput = document.querySelector("#equation-input");
const answerMessageDiv = document.getElementById("answer-message");
const answerContainer = document.getElementById("answer-box");
const extractedText = document.getElementById("extractedText");
const outputSection = document.getElementById("outputSection");
const similarQuestionsSection = document.getElementById("similarQuestionsSection");
const similarQuestions = document.getElementById("similarQuestions");
const youtubeVideosContainer = document.getElementById("video-container");

if(resetUploadImageBtn && input && image && imageResult && icon && uploadText){
    resetUploadImageBtn.addEventListener("click",()=>{
        input.value = "";
        image.style.display = "none" ;
        image.src = "";
        uploadText.style.display = "block";
        icon.style.display = "block";
        imageResult.inneHTML = "";
        answerContainer.style.display = "none";
        youtubeVideosContainer.innerHTML = "";
        similarQuestionsSection.innerHTML = "";
        text.inneHTML = "";
        outputSection.style.display = "none";
    })
}

if (resetManualBtn && equationInput && output) 
{ 
    resetManualBtn.addEventListener("click", () => 
    {
    equationInput.value = "";
     answerContainer.style.display = "none"; 
    text.innerHTML = ""; 
    outputSection.style.display = "none";
    youtubeVideosContainer.innerHTML = "";
    similarQuestionsSection.innerHTML = "";
 }); 
}
let fileDetails = {
    mime_type: null,
    data: null
};

// Function to send API request
// async function generateResponse(content) {
//     const RequestOption = {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         // body: JSON.stringify({
//         //     "contents": [content]
//         // })
//         body: JSON.stringify({
//             "contents": [ { "parts": [ { "text": content } ] } ]
//         })
//     };

//     try {
//         loading.style.display = "block";
//         let response = await fetch(Api_url, RequestOption);
//         if (!response.ok) {
//         let errorData = await response.json();
//         console.error("Error details:", errorData);
//         alert(`Error: ${errorData.error.message}`);
//         return;
// }

//         if (!response.ok) {
//             console.error("Network response was not ok:", response.statusText);
//             return;
//         }

//         let data = await response.json();
//         let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();

//         text.innerHTML = apiResponse;
//         output.style.display = "block";
//     } catch (e) {
//         console.error("Error fetching data:", e);
//     } finally {
//         loading.style.display = "none";
//     }
// }



// Function to send API request
async function generateResponse(content) {
    const RequestOption = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "contents": [content]
        })
    };

    try {
        loading.style.display = "block";
        let response = await fetch(Api_url, RequestOption);

        if (!response.ok) {
            let errorData = await response.json();
            console.error("Error details:", errorData);
            alert(`Error: ${errorData.error.message}`);
            return;
        }

        let data = await response.json();
        let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();

        text.innerHTML = apiResponse;
        output.style.display = "block";
        // Fetch similar questions
        let similarQuestionsResponse = data.similar_questions || []; // Assume API returns 'similar_questions' array
        console.log("Similar Questions:", similarQuestionsResponse); // Debug: Log similar questions
        if (similarQuestionsResponse.length > 0) {
            similarQuestions.innerHTML = ""; // Clear any existing questions
            similarQuestionsResponse.forEach((question) => {
                let listItem = document.createElement("li");
                listItem.textContent = question;
                similarQuestions.appendChild(listItem);
            });

            similarQuestionsSection.style.display = "block"; // Show the section
        } else {
            similarQuestionsSection.style.display = "none"; // Hide if no questions
        }

    } catch (e) {
        console.error("Error fetching data:", e);
    } finally {
        loading.style.display = "none";
    }
}
videoResults.innerHTML = '';
// Event listener for image upload
input.addEventListener("change", (e) => {
    const file = input.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = (e) => {
        let base64data = e.target.result.split(",")[1];
        fileDetails.mime_type = file.type;
        fileDetails.data = base64data;
    
        innerUploadImage.querySelector("span").style.display = "none";
        innerUploadImage.querySelector("#icon").style.display = "none";
        image.style.display = "block";
        image.src = `data:${fileDetails.mime_type};base64,${fileDetails.data}`;
    
        // Adjust the image styles dynamically
        image.style.maxWidth = "100%";  // Ensure it fits within the container
        image.style.maxHeight = "250px";    // Maintain aspect ratio
        output.style.display = "none";
    };
    

    reader.readAsDataURL(file);
});

// Click event for answering image upload
uploadBtn.addEventListener("click",async () => {
    if (fileDetails.data) {
        generateResponse({
            "parts": [
                { "text": "solve the mathematical problem with proper steps of solution stepwise" },
                {
                    "inline_data": {
                        "mime_type": fileDetails.mime_type,
                        "data": fileDetails.data
                    }
                }
            ]
        });
    } else {
        console.error("No file data found");
    }
});
// // Click event for answering image upload
// uploadBtn.addEventListener("click", async () => {
//     if (fileDetails.data) {
//         // Convert base64 image data to text using OCR
//         Tesseract.recognize(
//             `data:${fileDetails.mime_type};base64,${fileDetails.data}`, // Image Data
//             'eng', // Language (English)
//             {
//                 logger: m => console.log(m) // Log OCR processing progress
//             }
//         ).then(({ data: { text } }) => {
//             console.log("Extracted Text from Image:", text);
            
//             // ✅ Check if text contains a valid math expression
//             if (!text || text.length < 3) {
//                 alert("Error: No valid math problem detected in the image.");
//                 return;
//             }

//             // ✅ Call API with extracted text
//             generateResponse(text);
//         }).catch(err => {
//             console.error("OCR Error:", err);
//             alert("Error processing image. Please try again.");
//         });
//     } else {
//         console.error("No file data found");
//         alert("Please upload an image.");
//     }
// });


// Click event for manual equation entry
// manualBtn.addEventListener("click", () => {
//     const equation = equationInput.value.trim();
//     if (equation) {
//         const problemType = getMathProblemType(equation);
//         getYouTubeVideo(problemType); // Fetch and display the video
//         generateResponse({
//             "parts": [
//                 { "text": `solve the equation: ${equation} with proper steps` }
//             ]
//         });
//         equationInput.value = ""; // Clear input field after submission
//     } else {
//         alert("Please enter an equation.");
//     }
// });
// manualBtn.addEventListener("click", async () => {
//     try {
//         // Fetch response from the API (ensure you replace 'API_URL' with the actual endpoint)
//         const equation = equationInput.value.trim();
//         if (!equation) {
//             alert("Please enter an equation.");
//             return;
//         }
//         // Construct the correct API request body
//         const requestBody = {
//             contents: [
//                 {
//                     parts: [
//                         { text: equation } // Sending the entered equation to API
//                     ]
//                 }
//             ]
//         };
//          // Show loading indicator
//          document.getElementById("loading").style.display = "block";
//         const response = await fetch(Api_url, {
//             method: "POST", // or "GET", depending on your API
//             headers: {

//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(requestBody), // Replace with your query if needed
//         });
//         // Check if the response is successful
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         // Parse the response as JSON
//         const data = await response.json();
//         console.log("Raw API response:", data);

//         // Extract the candidate's content, which likely contains the answer or explanation
//         if (!data.candidates || data.candidates.length === 0) {
//             console.error("API returned an empty or invalid response");
//             return;
//         }


//         // Extracting steps and building the answer
//         let steps = data.candidates[0].steps.map(step => step.text).join("\n\n");
//         let mainAnswer = steps.trim();

//         // Display the solution
//         displayAnswerBox(mainAnswer);
//         speak("Here is your answer.");
//         // Show the solution and output section
//         //answerMessageDiv.style.display = "block";
//         //outputSection.style.display = "block";


//         // Fetch and display related YouTube videos
//         const queryType = getQueryType(mainAnswer);
//         const videos = await fetchYouTubeVideos(queryType);
//         videoContainer.innerHTML = '<h3>Related Videos:</h3>';
//         videos.forEach(video => {
//             videoContainer.innerHTML += `
//                 <div>
//                     <iframe width="560" height="315" src="https://www.youtube.com/embed/${video.id}" frameborder="0" allowfullscreen></iframe>
//                     <p>${video.title}</p>
//                 </div>
//             `;
//         });
            

//              // Generate similar questions
//         let similarQuestions = generateSimilarQuestions(mainAnswer);
//         displaySimilarQuestions(similarQuestions);
        
//         // Clear the input field after submission
//         equationInput.value = "";
//     } catch (error) {
//         console.error("Error:", error.message);
//         alert("An error occurred. Please try again.");
//     }
//     finally {
//         document.getElementById("loading").style.display = "none";
//     }
// });
//
manualBtn.addEventListener("click", () => {
    const equation = equationInput.value.trim();
    if (equation) {
        generateResponse({
            "parts": [
                { "text": `solve the equation: ${equation} with proper steps` }
            ]
        });
        equationInput.value = ""; // Clear input field after submission
    } else {
        alert("Please enter an equation.");
    }
});

// Click to open file selector
innerUploadImage.addEventListener("click", () => {
    input.click();
});


// Function to create calculator buttons dynamically
function createButtons(buttonSet) {
    const calculatorButtons = document.querySelector("#calculator-buttons");
    calculatorButtons.innerHTML = ''; // Clear existing buttons

    buttonSet.forEach(button => {
        const btn = document.createElement("button");
        btn.textContent = button.label;
        btn.onclick = () => handleButtonClick(button.value);
        calculatorButtons.appendChild(btn);
    });
}

const basicButtons = [
    { label: '1', value: '1' }, { label: '2', value: '2' }, { label: '3', value: '3' }, { label: '+', value: '+' },
    { label: '4', value: '4' }, { label: '5', value: '5' }, { label: '6', value: '6' }, { label: '-', value: '-' },
    { label: '7', value: '7' }, { label: '8', value: '8' }, { label: '9', value: '9' }, { label: '*', value: '*' },
    { label: '0', value: '0' }, { label: '.', value: '.' }, { label: '=', value: 'calculate' }, { label: '/', value: '/' },
    { label: 'C', value: 'clear' }, { label: '←', value: 'backspace' }
];
const scientificButtons = [
    { label: '( )', value: '( )' }, { label: '^', value: '^' }, { label: '√', value: 'sqrt(' },
    { label: 'sin', value: 'sin(' }, { label: 'cos', value: 'cos(' }, { label: 'tan', value: 'tan(' },
    { label: 'log', value: 'log(' }, { label: 'exp', value: 'exp(' }, { label: 'π', value: 'pi' }, { label: 'e', value: 'e' }
];
// Switch calculator mode
function setMode(mode) {
    if (mode === 'basic') {
        createButtons(basicButtons);
    } else if (mode === 'scientific') {
        createButtons([...basicButtons, ...scientificButtons]);
    }
}

// Handle button clicks
function handleButtonClick(value) {
    if (value === 'clear') {
        equationInput.value = '';
    } else if (value === 'backspace') {
        equationInput.value = equationInput.value.slice(0, -1);
    } else if (value === 'calculate') {
        try {
            // Simplified evaluation for demonstration, consider using a math library for complex calculations
            equationInput.value = eval(equationInput.value.replace('^', '**'));
        } catch {
            equationInput.value = 'Error';
        }
    } else {
        equationInput.value += value;
    }
}

// Initialize with basic mode
setMode('basic');
var toggleButton = document.querySelector("#toggleButton");
var imageUploadSection = document.querySelector("#imageUploadSection");
var manualEntrySection = document.querySelector("#manualEntrySection");
var manualAnswerButton = document.querySelector("#manualAnswerButton");
var imageAnswerButton = document.querySelector("#imageAnswerButton");

setMode('scientific');
 toggleButton = document.querySelector("#toggleButton");
 imageUploadSection = document.querySelector("#imageUploadSection");
 manualEntrySection = document.querySelector("#manualEntrySection");
 manualAnswerButton = document.querySelector("#manualAnswerButton");
 imageAnswerButton = document.querySelector("#imageAnswerButton");

// Initially show image upload section
imageUploadSection.style.display = "block";

// Toggle button click event to switch sections
toggleButton.addEventListener("click", () => {
    if (imageUploadSection.style.display === "none") {
        imageUploadSection.style.display = "block";
        manualEntrySection.style.display = "none";
        toggleButton.textContent = "Switch to Manual Entry";
        answerContainer.style.display = "none";
        youtubeVideosContainer.innerHTML = "";
        similarQuestionsSection.innerHTML = "";
    } else {
        imageUploadSection.style.display = "none";
        manualEntrySection.style.display = "block";
        toggleButton.textContent = "Switch to Image Upload";
        input.value = "";
        image.style.display = "none" ;
        image.src = "";
        uploadText.style.display = "block";
        icon.style.display = "block";
        imageResult.inneHTML = "";
        answerContainer.style.display = "none";
        youtubeVideosContainer.innerHTML = "";
        similarQuestionsSection.innerHTML = "";
    }
});

// Function to speak the given text using the Web Speech API
function speak(text) {
    // Create a new SpeechSynthesisUtterance instance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Optional: Adjust voice properties
    utterance.pitch = 1; // Pitch of the voice
    utterance.rate = 1;  // Speed of speech
    utterance.volume = 1;
    // Speak the text
    window.speechSynthesis.speak(utterance);
}

// Define the fetchYouTubeVideos function first
async function fetchYouTubeVideos(mathType) {
    const API_KEY = 'AIzaSyBNmvJD-fo4DPEP6pDd6FwdGZW11fugVp4'; // Replace with your actual YouTube API key
    let query = "";
    if (mathType.toLowerCase().includes("add")) {
        query = "addition math tutorial";
    } else if (mathType.toLowerCase().includes("subtract")) {
        query = "subtraction math tutorial";
    } else if (mathType.toLowerCase().includes("multiply")) {
        query = "multiplication math tutorial";
    } else if (mathType.toLowerCase().includes("divide")) {
        query = "division math tutorial";
    } else {
        query = mathType + " tutorial"; // Default case
    }

    //const query = queryMap[mathType] || 'math tutorial'; // Default to general tutorial if no match

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=3&key=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            
            throw new Error(`YouTube API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.items.map(video => ({
            id: video.id.videoId,
            title: video.snippet.title
        }));
    } catch (error) {
        console.error("Error fetching YouTube video:", error);
        return [];
    }
}


// Function to determine the query type from uploaded question
function getQueryType(question) {
    question = question.toLowerCase();

    // Check for permutation keywords
    if (question.includes('permutation') || question.includes('npr') || question.includes('arrangement')) {
        return 'Permutation tutorial';
    }

    // Check for combination keywords
    if (question.includes('combination') || question.includes('ncr') || question.includes('selection')) {
        return 'Combination tutorial';
    }

    // Check for quadratic equation keywords
    if (question.includes('quadratic equation') || question.includes('solve quadratic') || question.includes('ax^2 + bx + c')) {
        return 'Quadratic equation tutorial';
    }

    // Check for straight-line equation keywords
    if (question.includes('straight line equation') || question.includes('linear equation') || question.includes('y = mx + c') || question.includes('mid-point') || question.includes('origin') || question.includes('segment')) {
        return 'Straight-line equation tutorial';
    }

    // Check for integration keywords
    if (question.includes('integration') || question.includes('integral') || question.includes('∫')) {
        return 'Integration tutorial';
    }

    // Check for derivation keywords
    if (question.includes('derivation') || question.includes('derive') || question.includes('d/dx')) {
        return 'Derivation tutorial';
    }

    // Check for matrix keywords
    if (question.includes('matrix') || question.includes('matrices') || question.includes('determinant') || question.includes('transpose')) {
        return 'Matrix tutorial';
    }

    // Check for multiplication keywords or symbols
    if (/\b(x|\*)\b/.test(question) || question.includes('multiply') || question.includes('multiplication')) {
        return 'How to multiply numbers';
    }

    // Check for addition keywords or symbols
    if (/\b\+\b/.test(question) || question.includes('add') || question.includes('addition')) {
        return 'How to add numbers';
    }

    // Check for division keywords or symbols
    if (/[\/%]/.test(question) || question.includes('divide') || question.includes('division')) {
        return 'How to divide numbers';
    }

    // Check for subtraction keywords or symbols
    if (/\b-\b/.test(question) || question.includes('subtract') || question.includes('subtraction')) {
        return 'How to subtract numbers';
    }

    return 'Math tutorial'; // Default if no match found
}







// Function to send API request
// async function generateResponse(content) {
//     const RequestOption = {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//             "contents": [
//                 { "parts": [ { "text": content + "\n\nAlso, provide 3 similar math questions." } ] } // ✅ Asking for similar questions in the prompt itself
//             ]
//         })
        
//     };
//     // body: JSON.stringify({
//     //     "contents": [content]
//     // })
//     try {
//         loading.style.display = "block";
//         let response = await fetch(Api_url, RequestOption);
//         const videoContainer = document.getElementById("video-container");
//         if (!response.ok) {
//             console.error("Network response was not ok:", response.statusText);
//             return;
//         }

//         let data = await response.json();
//         let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();

//         // Show answer message and speak
//         const answerMessageDiv = document.getElementById("answer-message");
//         answerMessageDiv.textContent = "Here is your answer:";
//         answerMessageDiv.style.display = "block";
//         speak("Here is your answer");

//          // Extract similar questions from the response
//          let responseParts = apiResponse.split("\n");
//          let mainAnswer = responseParts[0]; // First line is the answer
//          let similarQuestionsResponse = responseParts.slice(1).filter(q => q.trim() !== ""); // Remaining lines are similar questions
        
//          // Display the answer
//         text.innerHTML = apiResponse;
//         output.style.display = "block";

//         // Scroll to the answer section
//         answerMessageDiv.scrollIntoView({ behavior: "smooth", block: "start" });
//         const queryType = getQueryType(apiResponse);
//         const videos = await fetchYouTubeVideos(queryType );
//         videoContainer.innerHTML = '<h3>Related Videos:</h3>';
//         videos.forEach(video => {
//             videoContainer.innerHTML += `
//                 <div>
//                     <iframe width="560" height="315" src="https://www.youtube.com/embed/${video.id}" frameborder="0" allowfullscreen></iframe>
//                     <p>${video.title}</p>
//                 </div>
//             `;
//         });

//         // Fetch similar questions
//         //let similarQuestionsResponse = data.similar_questions || []; // Assume API returns 'similar_questions' array
//         //console.log("Similar Questions:", similarQuestionsResponse); // Debug: Log similar questions
//         if (similarQuestionsResponse.length > 0) {
//             similarQuestions.innerHTML = ""; // Clear any existing questions
//             similarQuestionsResponse.forEach((question) => {
//                 let listItem = document.createElement("li");
//                 listItem.textContent = question;
//                 similarQuestions.appendChild(listItem);
//             });

//             similarQuestionsSection.style.display = "block"; // Show the section
//         } else {
//             similarQuestionsSection.style.display = "none"; // Hide if no questions
//         }

//     } catch (e) {
//         console.error("Error fetching data:", e);
//     } finally {
//         loading.style.display = "none";
//     }
// }
function detectMathType(content) {
    if (content.includes("+")) return "addition";
    if (content.includes("-")) return "subtraction";
    if (content.includes("*") || content.includes("×")) return "multiplication";
    if (content.includes("/") || content.includes("%")) return "division";
    return "general math";
}
// Function to process the uploaded image and generate a response
async function generateResponse(content) {
    console.log("Extracted Math Problem:", content);
    // Detect the math type
    //let mathType = detectMathType(content);

    // Prepare API prompt
    //const formattedPrompt = `Solve the equation step by step: ${content}`;
    //const formattedPrompt = `Solve this math problem step by step: ${content}.
    //Then generate 3 similar ${mathType} problems.`;


    const RequestOption = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "contents": [content]
        })
        // body: JSON.stringify({
        //     "contents": [{ "parts": [{ "text": formattedPrompt }] } ]
        // })
    };

    try {
        const loading = document.getElementById("loading");
        loading.style.display = "block";

        let response = await fetch(Api_url, RequestOption);
        const videoContainer = document.getElementById("video-container");
        const similarQuestionsContainer = document.getElementById("similarQuestionsSection");
        if (!response.ok) {
            let errorData = await response.json();
            console.error("Error details:", errorData);
            alert(`Error: ${errorData.error.message}`);
            return;
        }

        let data = await response.json();
        console.log("Full API Response:", data);

        if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content.parts.length) {
        console.error("API returned an empty response");
        return;
        }


        let apiResponse = data.candidates[0].content.parts[0].text.trim();
        let responseParts = apiResponse.split("\n\n");
         // Extract the main answer from the API response
        let mainAnswer = responseParts.join("<br>"); 
         
       
        // Display the answer inside a box
        displayAnswerBox(mainAnswer);

        // Speak the answer once
        speak("Here is your answer.");

        
        
        // Fetch and display related YouTube videos
        const queryType = getQueryType(apiResponse);
        const videos = await fetchYouTubeVideos(queryType );
        videoContainer.innerHTML = '<h3>Related Videos:</h3>';
        videos.forEach(video => {
            videoContainer.innerHTML += `
                <div>
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${video.id}" frameborder="0" allowfullscreen></iframe>
                    <p>${video.title}</p>
                </div>
            `;
        });
        // Generate similar questions based on the problem (if not directly provided by API)
        let similarQuestionsResponse = generateSimilarQuestions(apiResponse);
        // Display similar questions
        displaySimilarQuestions(similarQuestionsResponse);

    } catch (e) {
        console.error("Error fetching data:", e);
    } finally {
        document.getElementById("loading").style.display = "none";
    }
}

// ✅ Function to display the answer inside a box
function displayAnswerBox(answer) {
    // const answerContainer = document.getElementById("answer-box");
    answerContainer.innerHTML = `
        <div style="border: 2px solid #007bff; padding: 15px; border-radius: 10px; background-color: #f8f9fa; font-size: 16px;">
            <h1>Solution:</h1>
            <p>${answer.replace(/\n/g, "<br>")}</p>
        </div>
    `;
    answerContainer.style.display = "block";
    answerContainer.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Function to generate similar questions
function generateSimilarQuestions(content) {
    
    const variations = [];

    // Check for specific types of problems and generate variations based on them
    if (content.toLowerCase().includes('quadratic')) {
        // Example: Generate similar quadratic equations by changing coefficients
        variations.push("Solve the equation x² + 5x + 6 = 0.");
        variations.push("Solve the equation x² - 4x - 5 = 0.");
        variations.push("Solve the equation x² + 3x - 4 = 0.");
    } else if (content.toLowerCase().includes('permutation') || content.toLowerCase().includes('combination')) {
        // Example: Generate similar permutation or combination questions
        variations.push("How many ways can 3 people be arranged in a row?");
        variations.push("How many ways can 5 books be arranged on a shelf?");
        variations.push("In how many ways can 4 people be selected from a group of 10?");
    } else if (content.toLowerCase().includes('linear')) {
        // Example: Generate similar linear equation problems
        variations.push("Solve the equation 3x + 4 = 12.");
        variations.push("Solve the equation 2x - 5 = 9.");
        variations.push("Solve the equation 4x + 7 = 19.");
    } else if ((content.toLowerCase().includes('multiply'))||content.toLowerCase().includes('multiplication')) {
        // Example: Generate multiplication equation problems
        variations.push("Solve the equation 3 X 4.");
        variations.push("Solve the equation 5 X 5.");
        variations.push("Solve the equation 8 X 8.");
    }else if ((content.toLowerCase().includes('subtract'))||content.toLowerCase().includes('subtraction')) {
        // Example: Generate subtraction equation problems
        variations.push("Solve the equation 4 - 3.");
        variations.push("Solve the equation 10 - 8.");
        variations.push("Solve the equation 6 - 5.");
    }else if ((content.toLowerCase().includes('divide'))||content.toLowerCase().includes('division')) {
        // Example: Generate division equation problems
        variations.push("Solve the equation 9 / 3.");
        variations.push("Solve the equation 50 / 2.");
        variations.push("Solve the equation 30 / 2.");
    }else if ((content.toLowerCase().includes('add'))||content.toLowerCase().includes('addition')) {
        // Example: Generate addition equation problems
        variations.push("Solve the equation 3 + 4.");
        variations.push("Solve the equation 2 + 5");
        variations.push("Solve the equation 7 + 19");
    }else if ((content.toLowerCase().includes('derivation'))||content.toLowerCase().includes('derive')||(content.toLowerCase().includes('d/dx'))) {
        // Example: Generate derivation equation problems
        variations.push("Differentiate 20x-4 + 9.");
        variations.push("Differentiate sin(3x+5).");
        variations.push("Differentiate 10x2 with respect to x.");
    }else if ((content.toLowerCase().includes('integral'))||content.toLowerCase().includes('∫')||(content.toLowerCase().includes('integration'))) {
        // Example: Generate integration equation problems
        variations.push("Determine ∫[(x 3 +2x+3)/√x] dx.");
        variations.push("Find ∫(3x 2 +2x+1) dx.");
        variations.push("Evaluate ∫(x 2 +e x ) dx.");
    }else {
        // Default generic questions for other types
        variations.push("What is 2 + 3?");
        variations.push("What is 5 x 6?");
        variations.push("What is 12 ÷ 4?");
    }
    return variations;
}





// Function to display similar questions
function displaySimilarQuestions(similarQuestions) {
    const container = document.getElementById("similarQuestionsSection");
    container.innerHTML = ""; // Clear previous data

    if (similarQuestions.length > 0) {
        // Create the similar questions container with each question displayed on a new line
        container.innerHTML = `
            <div style="border: 2px solid #28a745; padding: 15px; border-radius: 10px; background-color: #e9f7ef; font-size: 16px; margin-top: 15px;">
                <h3>Similar Questions:</h3>
                <div>
                    ${similarQuestions.map(q => `<p>${q}</p>`).join("")}
                </div>
            </div>
        `;
        container.style.display = "block";
    } else {
        container.style.display = "none";
    }
}

// ✅ Function to fetch and display related YouTube videos
async function displayRelatedVideos(problemType) {
    const videoContainer = document.getElementById("video-container");
    videoContainer.innerHTML = "<h3>Related Videos:</h3>";

    // YouTube API key (replace with your own key)
    //const API_KEY = "AIzaSyAs25zUcCHLvWLXxR7O-0uJmiR2kZFrdlI";
    const API_KEY = "AIzaSyBNmvJD-fo4DPEP6pDd6FwdGZW11fugVp4";
    const searchQuery = `${mathType} tutorial`;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=3&key=${API_KEY}`;

    try {
        let response = await fetch(url);
        let data = await response.json();

        if (data.items.length > 0) {
            data.items.forEach(video => {
                videoContainer.innerHTML += `
                    <div>
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/${video.id.videoId}" frameborder="0" allowfullscreen></iframe>
                        <p>${video.snippet.title}</p>
                    </div>
                `;
            });
        } else {
            videoContainer.innerHTML += "<p>No related videos found.</p>";
        }
    } catch (e) {
        console.error("Error fetching YouTube videos:", e);
        videoContainer.innerHTML += "<p>Failed to load videos.</p>";
    }
}





// 🔊 Speech function
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
}








// Speech function with volume maxed out
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US"; // Set language
    utterance.rate = 1; // Normal speech speed
    window.speechSynthesis.speak(utterance);
}

// Handle speech recognition for equation input
const micButton = document.getElementById("micButton");

micButton.addEventListener("click", () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        micButton.textContent = "Listening...";
    };

    recognition.onspeechend = () => {
        micButton.textContent = "🎤";
        recognition.stop();
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        equationInput.value = transcript;
    };

    recognition.start();
});
function displayAnswerWithSteps(answer) {
    const steps = answer.split("\n"); // Assuming steps are separated by newlines
    text.innerHTML = ''; // Clear previous answer

    steps.forEach((step, index) => {
        setTimeout(() => {
            text.innerHTML += `<p>${step}</p>`;
        }, index * 500); // Display each step with a delay
    });
}
function saveToHistory(equation, answer) {
    let history = JSON.parse(localStorage.getItem('history')) || [];
    history.push({ equation, answer });
    localStorage.setItem('history', JSON.stringify(history));
}

function loadHistory() {
    let history = JSON.parse(localStorage.getItem('history')) || [];
    history.forEach(item => {
        const historyItem = document.createElement("div");
        historyItem.classList.add("history-item");
        historyItem.innerHTML = `<strong>${item.equation}</strong>: ${item.answer}`;
        document.querySelector(".output").appendChild(historyItem);
    });
}

loadHistory(); // Call this on page load to populate history
document.addEventListener("DOMContentLoaded", () => {
    // Check if each element exists before attaching event listeners

    const resetUploadImageBtn = document.getElementById("resetUploadImageBtn");
    const imageInput = document.getElementById("imageInput");
    const imageResult = document.getElementById("imageResult");

    if (resetUploadImageBtn && imageInput && imageResult) {
        resetUploadImageBtn.addEventListener("click", () => {
            imageInput.value = "";  // Clear the file input
            imageResult.innerHTML = "";  // Clear any results displayed from the image processing
        });
    }

    const resetManualBtn = document.getElementById("resetManualBtn");
    const equationInput = document.getElementById("equation-input");
    const calculatorButtons = document.getElementById("calculator-buttons");

    if (resetManualBtn && equationInput && calculatorButtons) {
        resetManualBtn.addEventListener("click", () => {
            equationInput.value = "";  // Clear the equation input
            calculatorButtons.innerHTML = "";  // Clear any results or displayed answers
        });
    } 
});
});

document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("themeToggle");

    if (!themeToggle) {
        console.error("Checkbox with ID 'themeToggle' not found.");
        return;
    }

    // Apply the correct class based on the toggle state on load
    if (themeToggle.checked) {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.add("light-mode");
    }

    // Add event listener for the toggle
    themeToggle.addEventListener("change", () => {
        if (themeToggle.checked) {
            document.body.classList.remove("light-mode");
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
            document.body.classList.add("light-mode");
        }
    });
    document.getElementById('clickableHeader').addEventListener('click', () => {
        window.location.href = 'welcome.html'; // Redirect to the desired URL
    });
    
});
// Example function to handle image upload and problem classification
async function handleImageUpload() {
    // Assume you have some code here to solve the equation from the uploaded image
    const equation = '5 + 3'; // Example equation after solving the uploaded image
    const problemType = getMathProblemType(equation);

    console.log('Detected problem type:', problemType);
    await getYouTubeVideo(problemType); // Fetch and display relevant video
}
// Example function to classify math problem type and display YouTube video
function getMathProblemType(equation) {
    // Basic checks to classify the math operation
    equation = equation.toLowerCase.replace(/\s+/g,'');
    if (equation.includes('x') || equation.includes('*')) {
        return 'multiplication';
    } else if (equation.includes('+')) {
        return 'addition';
    }  else if (equation.includes('-')) {
        return 'subtraction';
    } else if (equation.includes('/') || equation.includes('%')) {
        return 'division';
    }
    return 'unknown';
}
// Function to fetch YouTube video based on problem type
async function getYouTubeVideo(problemType) {
    //const API_KEY = 'AIzaSyAs25zUcCHLvWLXxR7O-0uJmiR2kZFrdlI'; // Replace with your actual YouTube API key
    const API_KEY = 'AIzaSyBNmvJD-fo4DPEP6pDd6FwdGZW11fugVp4'; // Replace with your actual YouTube API key
    const queryMap = {
        addition: 'addition tutorial',
        subtraction: 'subtraction tutorial',
        multiplication: 'multiplication tutorial',
        division: 'division tutorial',
    };
    const query = queryMap[problemType] || 'math tutorial'; // Default to general tutorial if no match

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1&key=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`YouTube API Error: ${response.status}`);
        }

        const data = await response.json();
        const videoId = data.items[0]?.id?.videoId;
        if (videoId) {
            displayYouTubeVideo(videoId);
        } else {
            alert("No tutorial videos found for this problem type.");
        }
    } catch (error) {
        console.error("Error fetching YouTube video:", error);
        alert("An error occurred while fetching YouTube videos.");
    }
}

// Function to display the YouTube video
function displayYouTubeVideo(videoId) {
    const videoContainer = document.getElementById("videoContainer");
    videoContainer.innerHTML = `
        <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/${videoId}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
        </iframe>
    `;
    videoContainer.scrollIntoView({ behavior: "smooth" });
}







