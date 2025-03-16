import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  FormControl,
  FormLabel,
  Checkbox,
  Button,
  VStack,
  useToast,
  Flex,
} from "@chakra-ui/react";

const AddEventForm = ({ categories, onAddEvent }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);
  const [location, setLocation] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [users, setUsers] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Fout bij ophalen van gebruikers:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleCategoryChange = (e) => {
    const categoryId = Number(e.target.value);
    if (e.target.checked) {
      setCategoryIds((prev) => [...prev, categoryId]);
    } else {
      setCategoryIds((prev) => prev.filter((id) => id !== categoryId));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newEvent = {
      id: Date.now(),
      createdBy,
      title,
      description,
      image,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      categoryIds,
      location,
    };

    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        onAddEvent(newEvent);
        setTitle("");
        setDescription("");
        setImage("");
        setStartTime("");
        setEndTime("");
        setCategoryIds([]);
        setLocation("");
        setCreatedBy("");

        toast({
          title: "Evenement toegevoegd",
          description: `Het evenement "${newEvent.title}" is succesvol toegevoegd.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Fout bij toevoegen",
          description: "Het evenement kon niet worden toegevoegd.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Fout bij verzenden naar server:", error);
      toast({
        title: "Er is een fout opgetreden",
        description: "Probeer het later opnieuw.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </FormControl>

        <FormControl>
          <FormLabel>Description</FormLabel>
          <Input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </FormControl>

        <FormControl>
          <FormLabel>Image URL</FormLabel>
          <Input type="url" value={image} onChange={(e) => setImage(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>Location</FormLabel>
          <Input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </FormControl>

        <FormControl>
          <FormLabel>Start Time</FormLabel>
          <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </FormControl>

        <FormControl>
          <FormLabel>End Time</FormLabel>
          <Input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </FormControl>

        <FormControl>
          <FormLabel>Select Categories</FormLabel>
          <VStack align="start">
            {categories.map((category) => (
              <Checkbox key={category.id} value={category.id} onChange={handleCategoryChange}>
                {category.name}
              </Checkbox>
            ))}
          </VStack>
        </FormControl>

        <FormControl>
          <FormLabel>Select User</FormLabel>
          <Select value={createdBy} onChange={(e) => setCreatedBy(Number(e.target.value))} placeholder="Select User">
            {users.length > 0 ? (
              users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))
            ) : (
              <option value="" disabled>
                Laden...
              </option>
            )}
          </Select>
        </FormControl>

        {/* Alleen de 'Add Event' knop blijft over */}
        <Flex justify="flex-end" w="full">
          <Button type="submit" colorScheme="teal">
            Add Event
          </Button>
        </Flex>
      </VStack>
    </form>
  );
};

export default AddEventForm;
