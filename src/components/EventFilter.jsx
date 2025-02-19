import React from "react";
import { Select } from "@chakra-ui/react";

const EventFilter = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <Select
      placeholder="Filter op Categorie"
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      mb={5}
    >
      <option value="">Alle Categorieën</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </Select>
  );
};

export default EventFilter;
