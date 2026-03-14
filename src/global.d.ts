// src/global.d.ts
declare global {
    interface Window {
        SpeechRecognition: any; // Optionally, replace 'any' with the correct type later if you want more specificity
        webkitSpeechRecognition: any; // Same here
    }
}

export { };
