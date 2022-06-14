import SocketContextProvider from "./context/SocketContext.js";
import Main from "./components/Main.js";

const App = () => {
  return (
    <SocketContextProvider>
      <Main />
    </SocketContextProvider>
  );
}

export default App;
