import { useState } from "react";


function NumberButton(props){
  return <button> props.number </button>
}



function App() {


function handleNumber(number){
  if (display === "0"){
    setDisplay(number)
  } else {
    setDisplay( display + number )
  }
}

  const [display , setDisplay]= useState("0")
  return (
    <div>
      <h1>Calculator</h1>
      <h2> {display } </h2>
      <button onClick={() => handleNumber("7")}>7</button>
      <button onClick={() => handleNumber("8")}>8</button>
      <button onClick={() => handleNumber("9")}>9</button>
<button
  onClick={() => handleNumber("0")}>
  0
</button>

    </div>
  )
}

export default App
