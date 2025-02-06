import { useState } from "react";
import UpdateElectron from "@/components/update";
import logoVite from "./assets/logo-vite.svg";
import logoElectron from "./assets/logo-electron.svg";
import "./App.css";
import { Button } from "./components/ui/button";

function App() {
  return (
    <div>
      <Button variant={"destructive"}>Button</Button>
      <UpdateElectron />
    </div>
  );
}

export default App;
