// import "./App.css";
import { AuthProvider } from "./contexts/auth";
import { Browser } from "./route/browser";
import { BrowserRouter } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Browser />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
