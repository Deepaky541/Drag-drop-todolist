import React, { useEffect, useState } from "react";
import "./App.css";

import DragNDrop from "./components/DragNDrop";

const defaultData = [
  { title: "Not Started", items: ["workout", "diet"] },
  { title: "In Development", items: ["classes", "interviews"] },
  { title: "Completed", items: ["masai school"] },
];

function App() {
  const [data, setData] = useState();

  useEffect(() => {
    if (localStorage.getItem("List")) {
      setData(JSON.parse(localStorage.getItem("List")));
    } else {
      localStorage.setItem("List", JSON.stringify(defaultData));
      setData(defaultData);
    }
  }, [setData]);
  return (
    <div className="App">
      <header className="App-header">
        <DragNDrop data={data} />
      </header>
    </div>
  );
}

export default App;
