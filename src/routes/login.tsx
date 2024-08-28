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
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { login, UnauthorizedError } from "../api";
import { useSelector, useDispatch } from 'react-redux';
import { authenticate } from "../redux/features/authenticationSlice";
import { useEffect } from "react";
import { AppState } from "../main";

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
  const isAuthenticated = useSelector((state: AppState) => state.auth.isAuthenticated);
  console.log('is authhhh ===> ', isAuthenticated)
  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: Inputs) => login(data.username, data.password),
    onSuccess: ({ jwt }) => {
      console.log('JWT ====> ', jwt)
      dispatch(authenticate(jwt));
    }
  });
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    mutate(data);
  };

  useEffect(() => {
    console.log('IS AUTH ====> ', isAuthenticated)
  }, [isAuthenticated])

  if (isAuthenticated) {
    console.log('REDIRECT ====> ', redirect)
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
