import { Toaster } from "react-hot-toast";
import Routes from "./Routes/Routes";

function App() {
  return (
    <>
      <Toaster
        toastOptions={{
          className: "",
          duration: 1000,
          success: {
            duration: 1000,
          },
        }}
        position="top-right"
        reverseOrder={false}
      />
      <Routes />
    </>
  );
}

export default App;
