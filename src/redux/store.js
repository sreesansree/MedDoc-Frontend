import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.js";
import themeReducer from "./theme/themeSlice.js";
import adminReducer from "./admin/adminSlice.js";
import doctorReducer from "./doctor/doctorSlice.js";
import chatReducer from "./chat/chatSlice.js";
import reminderReducer from "./reminder/reminderSlice.js";
import notificationReducer from "./notification/notificationSlice.js";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  admin: adminReducer,
  doctor: doctorReducer,
  chat: chatReducer,
  reminders: reminderReducer,
  notifications: notificationReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
