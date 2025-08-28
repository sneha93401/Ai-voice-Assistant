import React, { createContext, useState } from "react";
import main from "../gemini";

export const dataContext = createContext();

function UserContext({ children }) {
  let [speaking, setSpeaking] = useState(false);
  let [prompt, setPrompt] = useState("listening...");
  let [response, setResponse] = useState(false);

  // function speak(text) {
  //   let text_speak = new SpeechSynthesisUtterance(text);
  //   text_speak.volume = 1;
  //   text_speak.rate = 1;
  //   text_speak.pitch = 1;
  //   text_speak.lang = "hi-GB";
  //   // window.speechSynthesis.speak(text_speak);

  //   text_speak.onend = () => {
  //   // when AI finishes speaking
  //   setResponse(false);
  //   setSpeaking(false); // ✅ button comes back immediately
  // };

  // window.speechSynthesis.speak(text_speak);
  // }

  function speak(text) {
    let text_speak = new SpeechSynthesisUtterance(text);

    // ✅ Select female voice if available
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice =
      voices.find(
        (v) =>
          v.name.toLowerCase().includes("female") ||
          v.name.toLowerCase().includes("samantha") || // MacOS
          v.name.toLowerCase().includes("google us english") // Chrome (female)
      ) || voices[0]; // fallback

    text_speak.voice = femaleVoice;

    // ✅ Settings
    text_speak.volume = 1;
    text_speak.rate = 1; 
    text_speak.pitch = 1.1; 

    text_speak.lang = femaleVoice?.lang || "en-US";

    text_speak.onend = () => {
      setResponse(false);
      setSpeaking(false); // button visible again
    };

    window.speechSynthesis.speak(text_speak);
  }

  async function aiResponse(prompt) {
    let text = await main(prompt);
    let newText =
      text.split("**") &&
      text.split("*") &&
      text.replace("google", "Sneha jain") &&
      text.replace("Google", "Sneha jain");
    setPrompt(newText);
    speak(newText);
    setResponse(true);
  }

  let SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  let recognition = new SpeechRecognition();
  recognition.interimResults = true; // we can still show live text if needed
  recognition.continuous = false; // stop after one phrase

  recognition.onresult = (e) => {
    let currentIndex = e.resultIndex;
    let transcript = e.results[currentIndex][0].transcript;
    setPrompt(transcript);
    // ✅ Only use final result
    if (e.results[currentIndex].isFinal) {
      // console.log(transcript);
      // aiResponse(transcript);
      takeCommand(transcript.toLowerCase().trim());
    }
  };

  // function takeCommand(command){
  //   if(command.includes("open") && command.includes("youtube")){
  //     window.open("https://www.youtube.com","_blank")
  //     speak("opening youtube boss")
  //     setPrompt("opening youtube..")
  //   }
  //   else if(command.includes("open") && command.includes("google")){
  //     window.open("https://www.google.com/","_blank")
  //     speak("opening google boss")
  //     setPrompt("opening google..")
  //   }
  //   else if(command.includes("open") && command.includes("instagram")){
  //     window.open("https://www.instagram.com","_blank")
  //     speak("opening instagram boss")
  //     setPrompt("opening instagram..")
  //   }

  //   else{
  //     aiResponse(command)
  //   }
  // }
  function takeCommand(command) {
    // --- Websites ---
    if (command.includes("open") && command.includes("youtube")) {
      window.open("https://www.youtube.com", "_blank");
      speak("Opening YouTube boss");
      setPrompt("Opening YouTube...");
    } else if (command.includes("open") && command.includes("google")) {
      window.open("https://www.google.com", "_blank");
      speak("Opening Google boss");
      setPrompt("Opening Google...");
    } else if (command.includes("open") && command.includes("instagram")) {
      window.open("https://www.instagram.com", "_blank");
      speak("Opening Instagram boss");
      setPrompt("Opening Instagram...");
    } else if (command.includes("open") && command.includes("chrome")) {
      speak(
        "Boss, Chrome can’t be opened directly from browser. Please open it manually."
      );
      setPrompt("Can't open desktop apps from web.");
    } else if (command.includes("open") && command.includes("brave")) {
      speak(
        "Boss, Brave browser can’t be opened directly from here. Please open it manually."
      );
      setPrompt("Can't open Brave directly.");
    }

    // --- Time ---
    else if (command.includes("time")) {
      let time = new Date().toLocaleString(undefined, {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });

      setPrompt(time); // UI pe turant show karega
      speak("The time is " + time);
    }

    // --- Date ---
    else if (command.includes("date")) {
      let date = new Date().toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      setPrompt(date);
      speak("Today is " + date);
    }

    // --- Temperature / Weather ---
    else if (command.includes("temperature") || command.includes("weather")) {
      // For real weather, need API (OpenWeather, etc.)
      speak(
        "Currently, I can't fetch live weather without API integration. But we can add it."
      );
      setPrompt("Add OpenWeather API for live temperature updates.");
    }

    // --- Battery ---
    else if (command.includes("battery")) {
      if (navigator.getBattery) {
        navigator.getBattery().then(function (battery) {
          let level = Math.round(battery.level * 100) + "%";
          let charging = battery.charging ? "charging" : "not charging";
          let msg = `Battery is at ${level} and it is ${charging}`;
          speak(msg);
          setPrompt(msg);
        });
      } else {
        speak("Sorry, battery status is not supported in this browser.");
        setPrompt("Battery API not supported.");
      }
    }

    // --- VS Code / System Apps ---
    else if (command.includes("open") && command.includes("vs code")) {
      speak(
        "Boss, VS Code can't be opened directly from the browser for security reasons."
      );
      setPrompt("Need system integration (Electron / Node.js app).");
    }

    // --- Fallback: Ask AI ---
    else {
      aiResponse(command);
    }
  }

  let value = {
    recognition,
    speaking,
    setSpeaking,
    prompt,
    setPrompt,
    response,
    setResponse,
  };

  return <dataContext.Provider value={value}>{children}</dataContext.Provider>;
}

export default UserContext;
