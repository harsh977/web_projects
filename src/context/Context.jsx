import  runChat from "../config/gemini";
import { createContext, useState } from "react";
import { marked } from 'marked';
export const Context = createContext();


const ContextProvider = (props) => {
    const[input,setInput]= useState("");
    const[recentPrompt,setRecentPrompt]=useState("");
    const[previousPrompt,setPreviousPrompt]=useState([]);
    const[showResult,setShowResult]=useState(false);
    const[loading,setLoading]=useState(false);
    const[resultData,setResultData]=useState("");

    const delapPara = (index,nextWord) => {
        setTimeout(function (){
            setResultData(prev => prev+nextWord);
        },75*index)
    }

    const newChat = () => {
        setLoading(false)
        setShowResult(false)
    }

    
const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response="";
    if(prompt !== undefined){
        response = await runChat(prompt);
        setRecentPrompt(prompt);
    }else{
        setPreviousPrompt(prev => [...prev,input]);
        setRecentPrompt(input);
        response = await runChat(input);
    }
    
    

    // Convert Markdown to HTML
    let htmlResponse = marked(response);

    // Replace <strong> with <b> for styling
    htmlResponse = htmlResponse.replace(/<strong>/g, '<b>').replace(/<\/strong>/g, '</b>');

      // Debugging: Log the HTML conversion
    let newResponseArray= htmlResponse.split(" ");
    for(let i=0;i<newResponseArray.length;i++){
            const nextWord=newResponseArray[i];
            delapPara(i,nextWord + " ");
    } 
    setLoading(false);
    setInput("");
};


    const contextValue ={
            previousPrompt,
            setPreviousPrompt,
            onSent,
            setRecentPrompt,
            recentPrompt,
            showResult,
            loading,
            resultData,
            input,
            setInput,
            newChat,
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>

    )
}

export default ContextProvider
