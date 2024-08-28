import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./config/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from 'react-redux';
import authReducer, { AuthenticationState } from './redux/features/authenticationSlice';

import { routeTree } from "./routeTree.gen";
import { configureStore } from "@reduxjs/toolkit";

export type AppState = {
  auth: AuthenticationState;
}

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
    auth: authReducer, // Add the counter slice reducer
  },
});


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
