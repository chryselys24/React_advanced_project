import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Image,
  VStack,
  Button,
  Flex,
  Avatar,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";

export const EventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [creator, setCreator] = useState(null);
  const [editedEvent, setEditedEvent] = useState(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/events/${eventId}`);
        if (!response.ok) throw new Error("Fout bij ophalen van het evenement");

        const eventData = await response.json();
        setEvent(eventData);
        setEditedEvent(eventData);

        const userResponse = await fetch(
          `http://localhost:3000/users/${eventData.createdBy}`
        );
        if (!userResponse.ok)
          throw new Error("Fout bij ophalen van de gebruiker");

        const userData = await userResponse.json();
        setCreator(userData);
      } catch (error) {
        console.error("Fout bij ophalen data:", error);
      }
    };

    fetchData();
  }, [eventId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedEvent),
      });

      if (!response.ok) {
        throw new Error("Fout bij het bijwerken van het evenement");
      }

      toast({
        title: "Evenement bijgewerkt",
        description: "De evenementgegevens zijn succesvol bijgewerkt.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
      setEvent(editedEvent);
    } catch (error) {
      console.error("Fout bij bijwerken:", error);
      toast({
        title: "Fout",
        description:
          "Er is iets misgegaan bij het bijwerken van het evenement.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Evenement verwijderd",
          description: "Het evenement is succesvol verwijderd.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/");
      } else {
        toast({
          title: "Fout",
          description:
            "Er is iets misgegaan bij het verwijderen van het evenement.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Fout bij verwijderen:", error);
      toast({
        title: "Fout",
        description:
          "Er is iets misgegaan bij het verwijderen van het evenement.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setShowDeleteWarning(false);
    }
  };

  if (!event || !creator) return <Text>Loading...</Text>;

  return (
    <Box p={5}>
      <Box maxW="1200px" mx="auto">
        <VStack spacing={6} align="start">
          <Image
            src={event.image}
            alt={event.title}
            borderRadius="md"
            objectFit="cover"
            w="100%"
            h="300px"
          />
        </VStack>

        <Flex
          direction={["column", "row"]}
          spacing={6}
          align="start"
          justify="space-between"
          mt={4}
        >
          <Box flex="1" pr={[0, 6]}>
            <VStack spacing={6} align="start">
              <Heading size="xl">{event.title}</Heading>
              <Text fontSize="lg">{event.description}</Text>
              <Text>
                <strong>📍 Locatie: </strong>
                {event.location}
              </Text>
              <Text>
                <strong>📅 Start: </strong>
                {new Date(event.startTime).toLocaleString()}
              </Text>
              <Text>
                <strong>⏳ Einde: </strong>
                {new Date(event.endTime).toLocaleString()}
              </Text>
              <Button colorScheme="blue" onClick={() => navigate("/")} mt={4}>
                Terug naar alle evenementen
              </Button>
              <Button colorScheme="green" onClick={onOpen} mt={4}>
                Bewerken
              </Button>

              <Button
                colorScheme="red"
                onClick={() => setShowDeleteWarning(true)}
                mt={4}
              >
                Verwijder Evenement
              </Button>
            </VStack>
          </Box>

          <Box
            flex="0 0 250px"
            bg="gray.100"
            p={4}
            borderRadius="md"
            boxShadow="md"
          >
            <VStack align="center" spacing={4}>
              <Text fontSize="lg" fontWeight="bold">
                Gemaakt door:
              </Text>
              <Avatar src={creator.image} name={creator.name} size="xl" />
              <Text fontSize="md">{creator.name}</Text>
            </VStack>
          </Box>
        </Flex>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Evenement bewerken</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Titel</FormLabel>
              <Input
                name="title"
                value={editedEvent?.title}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Beschrijving</FormLabel>
              <Textarea
                name="description"
                value={editedEvent?.description}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Locatie</FormLabel>
              <Input
                name="location"
                value={editedEvent?.location}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Afbeelding URL</FormLabel>
              <Input
                name="image"
                value={editedEvent.image}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Startdatum en tijd</FormLabel>
              <Input
                type="datetime-local"
                name="startTime"
                value={editedEvent.startTime}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Einddatum en tijd</FormLabel>
              <Input
                type="datetime-local"
                name="endTime"
                value={editedEvent.endTime}
                onChange={handleInputChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Opslaan
            </Button>
            <Button onClick={onClose}>Annuleren</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
