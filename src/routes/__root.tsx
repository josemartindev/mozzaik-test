import {
  Flex,
  Heading,
  Button,
  Icon,
  HStack,
  StackDivider,
} from "@chakra-ui/react";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "@phosphor-icons/react";

import { UserDropdown } from "../components/user-dropdown";
import { signout } from '../redux/features/authenticationSlice';
import { AppState } from "../main";


export const Route = createRootRouteWithContext()({
  component: () => {
    const isAuthenticated = useSelector((state: AppState) => state.auth.isAuthenticated);

    return (
      <Flex width="full" height="full" direction="column">
        {/* Header */}
        <Flex
          bgColor="cyan.600"
          p={2}
          justifyContent="space-between"
          boxShadow="md"
        >
          {/* Title */}
          <Heading size="lg" color="white">
            MemeFactory
          </Heading>
          {isAuthenticated && (
            <HStack
              alignItems="center"
              divider={<StackDivider border="white" />}
            >
              <Button
                as={Link}
                size="sm"
                leftIcon={<Icon as={Plus} />}
                to="/create"
              >
                Create a meme
              </Button>
              <UserDropdown />
            </HStack>
          )}
        </Flex>
        <Flex flexGrow={1} height={0}>
          <Outlet />
        </Flex>
      </Flex>
    );
  },
});
