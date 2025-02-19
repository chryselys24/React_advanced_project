import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Image,
  Button,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import AddEventForm from "../components/AddEventForm";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import SearchBar from "../components/SearchBar";
import EventFilter from "../components/EventFilter";

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsResponse = await fetch("http://localhost:3000/events");
        const eventsData = await eventsResponse.json();

        const categoriesResponse = await fetch(
          "http://localhost:3000/categories"
        );
        const categoriesData = await categoriesResponse.json();

        console.log("Opgehaalde events:", eventsData);
        console.log("Opgehaalde categories:", categoriesData);

        setEvents(eventsData);
        setCategories(categoriesData);
        setLoading(false); 
      } catch (error) {
        console.error("Fout bij ophalen van data:", error);
        setLoading(false); 
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("State events bijgewerkt:", events);
    console.log("State categories bijgewerkt:", categories);
  }, [events, categories]);

  const getCategoryNames = (categoryIds) => {
    if (!categories || categories.length === 0) {
      console.log("Categorieën zijn nog niet geladen of zijn leeg", categories);
      return "Laden...";
    }

    const categoryIdsAsNumbers = categoryIds.map((id) => Number(id));

    console.log("Categorieën:", categories);
    console.log("Event CategoryIds:", categoryIdsAsNumbers);

    return categories
      .filter((category) => categoryIdsAsNumbers.includes(category.id))
      .map((category) => category.name)
      .join(", ");
  };

  const addEvent = (newEvent) => {
    setEvents((prevEvents) => [newEvent, ...prevEvents]);
    onClose();
  };

  const filteredEvents = (events || []).filter((event) => {
    const searchQuery = searchTerm.toLowerCase();
    const eventTitle = event.title.toLowerCase();
    const eventDescription = event.description.toLowerCase();
    const eventCategoryNames = getCategoryNames(
      event.categoryIds
    ).toLowerCase();

    console.log("Event voor filtering:", event);
    console.log("Zoekterm:", searchQuery);
    console.log("Event title:", eventTitle);
    console.log("Event description:", eventDescription);
    console.log("Event category names:", eventCategoryNames);

    const matchesSearchTerm =
      !searchTerm ||
      eventTitle.includes(searchQuery) ||
      eventDescription.includes(searchQuery) ||
      eventCategoryNames.includes(searchQuery);

    const matchesCategory =
      !selectedCategory ||
      event.categoryIds.some((id) => String(id) === String(selectedCategory));

    console.log(
      "Geselecteerde categorie wordt toegepast op evenement:",
      matchesCategory
    );

    return matchesSearchTerm && matchesCategory;
  });

  console.log("Gefilterde evenementen:", filteredEvents);

  if (loading) {
    return <Box>Loading...</Box>;
  }

  console.log("Events bij render:", events);

  return (
    <Box p={5}>
      <Flex mb={5} justify="space-between" w="100%" gap={4}>
        <Box w="50%">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </Box>
        <Box w="50%">
          <EventFilter
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </Box>
      </Flex>

      <Button colorScheme="teal" mb={5} onClick={onOpen}>
        Add New Event
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nieuw Evenement Toevoegen</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddEventForm categories={categories} onAddEvent={addEvent} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Sluiten
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
        {filteredEvents.length === 0 ? (
          <Text>Geen evenementen gevonden.</Text>
        ) : (
          filteredEvents.map((event) => (
            <Link to={`/event/${event.id}`} key={event.id}>
              <Box
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                boxShadow="lg"
                p={5}
                _hover={{ boxShadow: "xl", cursor: "pointer" }}
              >
                <Image
                  src={event.image}
                  alt={event.title}
                  borderRadius="md"
                  mb={4}
                  objectFit="cover"
                  w="100%"
                  h="200px"
                />
                <Heading size="md">{event.title}</Heading>
                <Text mt={2}>{event.description}</Text>
                <Text mt={2} fontWeight="bold">
                  <strong>Start:</strong>{" "}
                  {event.startTime
                    ? new Date(event.startTime).toLocaleString()
                    : "Niet gespecificeerd"}
                </Text>
                <Text mt={2} mb={2} fontWeight="bold">
                  <strong>Einde:</strong>{" "}
                  {event.endTime
                    ? new Date(event.endTime).toLocaleString()
                    : "Niet gespecificeerd"}
                </Text>
                <Box
                  bg="blue.100"
                  color="blue.800"
                  px={2}
                  py={1}
                  borderRadius="md"
                  fontSize="sm"
                  fontWeight="bold"
                >
                  <Text>{getCategoryNames(event.categoryIds)}</Text>
                </Box>
              </Box>
            </Link>
          ))
        )}
      </SimpleGrid>
    </Box>
  );
};
