import React from "react";
import Titulo from "./Titulo";

function App() {
  return (
    <section>
      {/* Passando texto como children */}
      <Titulo>Meu Primeiro Titulo</Titulo>

      {/* Passando múltiplos elementos como children */}
      <Titulo>
        <p>Titulo 2</p>
        <p>Titulo 3</p>
      </Titulo>
    </section>
  );
}

export default App;
