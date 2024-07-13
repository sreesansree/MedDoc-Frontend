import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { persistor, store } from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import ThemeProvider from "./component/themeProvider/ThemeProvider.jsx";
import "react-toastify/dist/ReactToastify.css";
import { CookiesProvider } from "react-cookie";
ReactDOM.createRoot(document.getElementById("root")).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <CookiesProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </CookiesProvider>
    </Provider>
  </PersistGate>
);
