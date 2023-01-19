import "../styles/globals.css";
import Navbar from "../components/Navbar.js";
import { Provider } from "react-redux";
import reduxStore from "../redux/store.js";
import { AppProvider } from "../components/context.js";

export default function App({ Component, pageProps }) {
  return (
    <AppProvider>
      <Navbar></Navbar>
      <Component {...pageProps} />
    </AppProvider>
  );
}
