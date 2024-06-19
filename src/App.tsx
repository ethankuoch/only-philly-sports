import { useState } from "react";
import { MantineProvider } from "@mantine/core";
import TeamSelect from "./components/TeamSelect/TeamSelect.tsx";
import "./App.css";
import "@mantine/core/styles.css";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <MantineProvider>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <TeamSelect league={"nfl"} />
      </MantineProvider>
    </>
  );
}

export default App;
