import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Flex,
  HStack,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
} from "@chakra-ui/react";

export const Navigation = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) =>
        console.error("Fout bij ophalen van gebruikers:", error)
      );
  }, []);

  return (
    <Box bg="teal.500" color="white" p={4}>
      <Flex justify="space-between" align="center">
        <HStack spacing={8}>
          <Text fontSize="2xl" fontWeight="bold">
            <Link to="/">Event Manager</Link>
          </Text>
          <HStack spacing={4}>
            <Button as={Link} to="/" variant="link" color="white" fontSize="lg">
              Events
            </Button>
          </HStack>
        </HStack>
        <Menu>
          <MenuButton as={Button} bg="white" color="black">
            {selectedUser ? selectedUser.name : "Select User"}
          </MenuButton>
          <MenuList>
            {users.map((user) => (
              <MenuItem
                key={user.id}
                onClick={() => setSelectedUser(user)}
                color="black"
              >
                <Avatar src={user.image} size="xs" mr={2} />
                {user.name}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
};
