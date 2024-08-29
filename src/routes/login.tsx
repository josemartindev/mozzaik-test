import { useState } from "react";
import {
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Text,
  Input,
  Button,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from 'react-redux';
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { login, UnauthorizedError } from "../api";

import { authenticate } from "../redux/features/authenticationSlice";

import { RootState } from "../main";

type SearchParams = {
  redirect?: string;
};

type Inputs = {
  username: string;
  password: string;
};

function renderError(error: Error) {
  if (error instanceof UnauthorizedError) {
    return <FormErrorMessage>Wrong credentials</FormErrorMessage>;
  }
  return (
    <FormErrorMessage>
      An unknown error occured, please try again later
    </FormErrorMessage>
  );
}

export const LoginPage: React.FC = () => {
  const { redirect } = Route.useSearch();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState(false);
  
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit = async (data: { username: string, password: string }) => {
    setIsPending(true);
    try {
      const res = await login(data.username, data.password);
        setIsPending(false);
        setError(null);
        dispatch(authenticate(res.jwt));
    } catch (error: unknown) {
      setIsPending(false);
      setError(error as UnauthorizedError);
    } 
  };

  if (isAuthenticated) {
    return <Navigate to={redirect ?? '/'} />;
  }

  return (
    <Flex
      height="full"
      width="full"
      alignItems="center"
      justifyContent="center"
    >
      <Flex
        direction="column"
        bgGradient="linear(to-br, cyan.100, cyan.200)"
        p={8}
        borderRadius={16}
      >
        <Heading as="h2" size="md" textAlign="center" mb={4}>
          Login
        </Heading>
        <Text textAlign="center" mb={4}>
          Welcome back! 👋
          <br />
          Please enter your credentials.
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              placeholder="Enter your username"
              bg="white"
              size="sm"
              {...register("username")}
            />
          </FormControl>
          <FormControl isInvalid={error !== null}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              bg="white"
              size="sm"
              {...register("password")}
            />
            {error !== null && renderError(error)}
          </FormControl>
          <Button
            color="white"
            colorScheme="cyan"
            mt={4}
            size="sm"
            type="submit"
            width="full"
            isLoading={isPending}
          >
            Login
          </Button>
        </form>
      </Flex>
    </Flex>
  );
};

export const Route = createFileRoute("/login")({
  validateSearch: (search): SearchParams => {
    return {
      redirect: typeof search.redirect === "string" ? search.redirect : undefined,
    }
  },
  component: LoginPage,
});
