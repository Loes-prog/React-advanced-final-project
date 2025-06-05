import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Heading, Box, Text, Image, HStack } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { UpdateForm } from "../components/UpdateForm";

// Main component for the Event page

export const EventPage = () => {
  // Retrieve the eventId from the URL parameters
  const { eventId } = useParams();

  // Fetching event data, users and categories data using react-query
  const { isLoading, error, data } = useQuery({
    queryKey: ["eventData", eventId],
    queryFn: () =>
      fetch(`http://localhost:3000/events/${eventId}`).then((res) =>
        res.json()
      ),
  });

  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["usersData"],
    queryFn: () =>
      fetch("http://localhost:3000/users").then((res) => res.json()),
  });

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categoriesData"],
    queryFn: () =>
      fetch("http://localhost:3000/categories").then((res) => res.json()),
  });

  // State to manage editing mode
  const [isEditing, setIsEditing] = useState(false);

  // Handle loading and error states
  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>An error has occurred: {error.message}</Text>;

  if (usersLoading) return <Text>Loading users...</Text>;
  if (usersError) return <Text>Error loading users: {usersError.message}</Text>;

  if (categoriesLoading) return <Text>Loading categories...</Text>;
  if (categoriesError)
    return <Text>Error loading categories: {categoriesError.message}</Text>;

  // Extract categories data or set to an empty array if not available
  const categories = categoriesData || [];

  // Find the user who created the event
  const createdBy = usersData?.find((user) => user.id === data.createdBy);

  // Match categories based on categoryIds in the event data
  const matchedCategories = data.categoryIds
    .map((id) => categories?.find((cat) => cat.id === id))
    .filter(Boolean);

  return (
    <Box p={4}>
      <Heading size="md">Details Selected Event</Heading>

      {/* Display the event details or the update form based on editing state */}
      {isEditing ? (
        <Box>
          <UpdateForm eventId={eventId} />

          <Box mt={4}>
            <Button colorScheme="blue" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          <Heading mb={4}>{data.title}</Heading>
          <Text>{data.description}</Text>
          <Image
            src={data.image}
            alt="event"
            objectFit="cover"
            width="100%"
            maxW="500px"
            mt={4}
          />
          <Text mt={2}>Start: {data.startTime}</Text>
          <Text>End: {data.endTime}</Text>
          <Text>
            Categories:{" "}
            {matchedCategories.length > 0
              ? matchedCategories.map((cat) => cat.name).join(", ")
              : "Loading..."}
          </Text>
          {createdBy ? (
            <Box>
              <Text fontWeight="bold">Gemaakt door:</Text>
              <Box display="flex" alignItems="center" mt={2}>
                <Image
                  src={createdBy.image}
                  alt={createdBy.name}
                  boxSize="40px"
                  borderRadius="full"
                  mr={2}
                />
                <Text>{createdBy.name}</Text>
              </Box>
            </Box>
          ) : (
            <Text>Gemaakt door: Onbekend</Text>
          )}

          <HStack mt={4} spacing={4}>
            <Box>
              <Button colorScheme="blue" onClick={() => setIsEditing(true)}>
                Edit Event
              </Button>
            </Box>
            <Box>
              <Link to="/">
                <Button colorScheme="teal">Back to Events</Button>
              </Link>
            </Box>
          </HStack>
        </Box>
      )}
    </Box>
  );
};
