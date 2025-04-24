import OndcRoutes from "./Router/Router";
import "./Api/firebase-init";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className='App'>
      <OndcRoutes />
      <ToastContainer />
    </div>
  );
}

export default App;
