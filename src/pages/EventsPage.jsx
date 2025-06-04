import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { SearchIcon } from "@chakra-ui/icons";
import { AddForm } from "../components/AddForm";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Image,
  Button,
  SimpleGrid,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
} from "@chakra-ui/react";

// Main component for the Events page

export const EventsPage = () => {
  // Fetching events and categories data using react-query
  const {
    isPending,
    error,
    data: events,
  } = useQuery({
    queryKey: ["homepageData"],
    queryFn: () =>
      fetch("http://localhost:3000/events").then((res) => res.json()),
  });

  const { data: categories } = useQuery({
    queryKey: ["category"],
    queryFn: () =>
      fetch(`http://localhost:3000/categories/`).then((res) => res.json()),
  });

  // Local state for search and category filter
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");

  // Handle loading and error states
  if (isPending) return "Loading...";
  if (error) return "An error has occurred: " + error.message;

  // Filter events based on search term and selected category
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      !selectedCategory ||
      event.categoryIds.includes(parseInt(selectedCategory));

    return matchesSearch && matchesCategory;
  });

  return (
    <Box p={4}>
      <Heading mb={4}>List of events</Heading>
      <Box
        mb={6}
        display="flex"
        flexDirection={{ base: "column", md: "row" }}
        gap={4}
      >
        {/* Search and filter inputs */}
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search events"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            backgroundColor="white"
          />
        </InputGroup>

        <Select
          placeholder="Filter by category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          backgroundColor="white"
        >
          <option value="1">sports</option>
          <option value="2">games</option>
          <option value="3">relaxation</option>
        </Select>

        {/* Button > component to create a new event */}
        <Box>
          <AddForm />
        </Box>
      </Box>

      {/* Display (filtered) events */}
      {/* Display (filtered) events */}
      <Box>
        {filteredEvents.length === 0 ? (
          <Text mt={4} color="gray.500">
            No results found.
          </Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {filteredEvents.map((event) => {
              const matchedCategories = event.categoryIds
                .map((id) => categories?.find((cat) => cat.id === id))
                .filter(Boolean);

              return (
                <Card key={event.id} backgroundColor="yellow.50">
                  <CardHeader>
                    <Heading size="md">{event.title}</Heading>
                  </CardHeader>
                  <CardBody>
                    <Text>{event.description}</Text>
                    <Image
                      objectFit="cover"
                      width="100%"
                      height="150px"
                      src={event.image}
                      alt="event image"
                    />
                    <Text>Start: {event.startTime}</Text>
                    <Text>End: {event.endTime}</Text>
                    <Text>
                      Categories:{" "}
                      {matchedCategories.length > 0
                        ? matchedCategories.map((cat) => cat.name).join(", ")
                        : "Loading..."}
                    </Text>
                  </CardBody>
                  <CardFooter>
                    <Link to={`/event/${event.id}`}>
                      <Button colorScheme="teal">View Event </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </SimpleGrid>
        )}
      </Box>
    </Box>
  );
};
