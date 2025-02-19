import React from "react";
import {
  List,
  ListItem,
  Link,
  Box,
  Image,
  VStack,
  Heading,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const EventList = ({ events }) => {
  if (!events || events.length === 0) {
    return <Text>Geen evenementen gevonden.</Text>;
  }

  return (
    <List spacing={4} mt={4}>
      {events.map((event) => (
        <ListItem key={event.id} p={4} borderWidth="1px" borderRadius="md">
          <Link
            as={RouterLink}
            to={`/events/${event.id}`}
            _hover={{ textDecoration: "none" }}
          >
            <VStack align="start" spacing={3}>
              <Image
                src={event.image}
                alt={event.title}
                borderRadius="md"
                objectFit="cover"
                w="100%"
                h="200px"
              />
              <Heading size="md">{event.title}</Heading>
              <Text>{event.description}</Text>
              <Text fontSize="sm" color="gray.600">
                📍 {event.location} | 📅{" "}
                {new Date(event.startTime).toLocaleDateString()}
              </Text>
            </VStack>
          </Link>
        </ListItem>
      ))}
    </List>
  );
};

export default EventList;
