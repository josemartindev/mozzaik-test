import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from 'react-redux';
import { configureStore } from "@reduxjs/toolkit";

import authReducer from './redux/features/authenticationSlice';
import { userReducer } from './redux/features/userSlice';
import { memesSlice } from "./redux/features/memesSlice";

import { tokenExpirationMiddleware } from "./tokenExpirationMiddleware";

import { theme } from "./config/theme";

import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  context: {},
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    memes: memesSlice.reducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(tokenExpirationMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const queryClient = new QueryClient();

function InnerApp() {
  return <RouterProvider router={router} />;
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>
              <InnerApp />
          </ChakraProvider>
        </QueryClientProvider>
      </Provider>
    </StrictMode>,
  );
}
