import React, { useState } from "react";
import {
  Input,
  Select,
  FormControl,
  FormLabel,
  Checkbox,
  Button,
  VStack,
} from "@chakra-ui/react";

const AddEventForm = ({ categories, onAddEvent, events = [] }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);
  const [location, setLocation] = useState("");
  const [createdBy, setCreatedBy] = useState(1); // Default to User 1

  // Handle checkbox changes
  const handleCategoryChange = (e) => {
    const categoryId = Number(e.target.value);
    if (e.target.checked) {
      setCategoryIds((prevCategoryIds) => [...prevCategoryIds, categoryId]);
    } else {
      setCategoryIds((prevCategoryIds) =>
        prevCategoryIds.filter((id) => id !== categoryId)
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Genereer een willekeurige unieke ID
    const randomId = Date.now() + Math.floor(Math.random() * 1000);

    const newEvent = {
      id: randomId, // Willekeurige unieke ID
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
        headers: {
          "Content-Type": "application/json",
        },
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
        setCreatedBy(1); // Reset de gebruiker naar User 1 na het toevoegen
        alert("Evenement succesvol toegevoegd!");
      } else {
        alert("Fout bij het toevoegen van evenement.");
      }
    } catch (error) {
      console.error("Fout bij verzenden naar server:", error);
      alert("Er is iets mis gegaan bij het toevoegen van het evenement.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </FormControl>

        <FormControl>
          <FormLabel>Description</FormLabel>
          <Input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </FormControl>

        <FormControl>
          <FormLabel>Image URL</FormLabel>
          <Input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Location</FormLabel>
          <Input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </FormControl>

        <FormControl>
          <FormLabel>Start Time</FormLabel>
          <Input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </FormControl>

        <FormControl>
          <FormLabel>End Time</FormLabel>
          <Input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </FormControl>

        <FormControl>
          <FormLabel>Select Categories</FormLabel>
          <VStack align="start">
            {categories.map((category) => (
              <Checkbox
                key={category.id}
                value={category.id}
                onChange={handleCategoryChange}
              >
                {category.name}
              </Checkbox>
            ))}
          </VStack>
        </FormControl>

        <FormControl>
          <FormLabel>Select User</FormLabel>
          <Select
            value={createdBy}
            onChange={(e) => setCreatedBy(Number(e.target.value))}
            placeholder="Select User"
          >
            <option value={1}>Ignacio Doe</option>
            <option value={2}>Jane Bennett</option>
          </Select>
        </FormControl>

        <Button type="submit" colorScheme="teal">
          Add Event
        </Button>
      </VStack>
    </form>
  );
};

export default AddEventForm;
