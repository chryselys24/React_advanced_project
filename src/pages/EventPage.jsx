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
  const [users, setUsers] = useState([]);
  const [editedEvent, setEditedEvent] = useState(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/events.json");
        const data = await response.json();

        const selectedEvent = data.events.find(
          (e) => e.id === parseInt(eventId)
        );
        setEvent(selectedEvent);

        const userList = data.users;
        setUsers(userList);

        const eventCreator = userList.find(
          (user) => user.id === selectedEvent.createdBy
        );
        setCreator(eventCreator);
        setEditedEvent(selectedEvent);
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
        navigate("/"); // Redirect naar de evenementenpagina
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
      setShowDeleteWarning(false); // Sluit de waarschuwing na het verwijderen
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

              {/* Verwijder Evenement knop */}
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

      {/* Modal for Editing Event */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Bewerk Evenement</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel htmlFor="title">Titel</FormLabel>
              <Input
                id="title"
                name="title"
                value={editedEvent.title || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel htmlFor="description">Beschrijving</FormLabel>
              <Textarea
                id="description"
                name="description"
                value={editedEvent.description || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel htmlFor="location">Locatie</FormLabel>
              <Input
                id="location"
                name="location"
                value={editedEvent.location || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel htmlFor="startTime">Starttijd</FormLabel>
              <Input
                id="startTime"
                name="startTime"
                type="datetime-local"
                value={new Date(editedEvent.startTime)
                  .toISOString()
                  .slice(0, 16)}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel htmlFor="endTime">Eindtijd</FormLabel>
              <Input
                id="endTime"
                name="endTime"
                type="datetime-local"
                value={new Date(editedEvent.endTime).toISOString().slice(0, 16)}
                onChange={handleInputChange}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Annuleren
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Opslaan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Bevestigingswaarschuwing voor Verwijdering */}
      {showDeleteWarning && (
        <Alert status="warning" variant="left-accent" mb={4}>
          <AlertIcon />
          Ben je zeker dat je dit evenement wilt verwijderen?
          <Button colorScheme="red" ml={4} onClick={handleDelete}>
            Ja, Verwijderen
          </Button>
          <Button ml={2} onClick={() => setShowDeleteWarning(false)}>
            Annuleren
          </Button>
        </Alert>
      )}
    </Box>
  );
};
