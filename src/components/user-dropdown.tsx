import {
  Menu,
  MenuButton,
  Text,
  MenuList,
  MenuItem,
  Avatar,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { CaretDown, CaretUp, SignOut } from "@phosphor-icons/react";
import { getUserById } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "../redux/features/authenticationSlice";
import { AppState } from "../main";

export const UserDropdown: React.FC = () => {
  // const { state, signout } = useAuthentication();
  const isAuthenticated = useSelector((state: AppState) => state.auth.isAuthenticated);
  const token = useSelector((state: AppState) => state.auth.token);
  const userId = useSelector((state: AppState) => state.auth.userId);
  const dispatch = useDispatch();
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", isAuthenticated ? userId : "anon"],
    queryFn: () => {
      if (isAuthenticated) {
        return getUserById(token, userId);
      }
      return null;
    },
    enabled: isAuthenticated,
  });

  if (!isAuthenticated || isLoading) {
    return null;
  }

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton>
            <Flex direction="row" alignItems="center">
              <Avatar
                size="xs"
                mr={2}
                name={user?.username}
                src={user?.pictureUrl}
                border="1px solid white"
              />
              <Text color="white">
                {user?.username}
              </Text>
              <Icon color="white" ml={2} as={isOpen ? CaretUp : CaretDown} mt={1} />
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem icon={<Icon as={SignOut} />} onClick={() => dispatch(signout())}>Sign Out</MenuItem>
          </MenuList>
        </>
      )}
    </Menu>
  );
};
