import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormLabel,
  Heading,
  Input,
  FormControl,
  FormErrorMessage,
  Text,
  Select,
  Checkbox,
  VStack,
  HStack,
} from "@chakra-ui/react";

// Main component for updating an event

export const UpdateForm = ({ eventId }) => {
  // Retrieving data via react-query

  const { isLoading, error, data } = useQuery({
    queryKey: ["eventData", eventId],
    queryFn: () =>
      fetch(`http://localhost:3000/events/${eventId}`).then((res) =>
        res.json()
      ),
  });

  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  // Set form with react-hook-form

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  // react-hook-form houdt zelf geen checkboxGroup state bij, dus moet je dit met watch en setValue doen
  const selectedCategories = watch("categoryIds") || [];

  // On checkbox toggle: update react-hook-form state
  const onCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let newCategories = [...selectedCategories];

    if (checked) {
      newCategories.push(value);
    } else {
      newCategories = newCategories.filter((v) => v !== value);
    }
    setValue("categoryIds", newCategories);
  };

  // Once data is loaded, reset form with old data

  React.useEffect(() => {
    if (data) {
      reset({
        createdBy: data.createdBy?.toString(),
        title: data.title,
        description: data.description,
        image: data.image,
        startTime: formatDateTimeLocal(data.startTime),
        endTime: formatDateTimeLocal(data.endTime),
        categoryIds: data.categoryIds?.map(String) || [],
        location: data.location,
      });
    }
  }, [data, reset]);

  // Function to give startTime & endTime a good format. Format YYYY-MM-DDTHH:mm

  function formatDateTimeLocal(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  }

  // Form submit handler, send data to API with PUT (update event)

  const onSubmit = async (values) => {
    try {
      // Prepare the data to be sent to the server
      const updatedValues = {
        ...values,
        categoryIds: values.categoryIds.map((id) => Number(id)), // convert categoryIds to an array of numbers
        createdBy: parseInt(values.createdBy, 10), // convert string to number
      };

      // PUT request to the server to update the event
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedValues),
      });
      if (!response.ok) {
        throw new Error("Update failed");
      }
      const updatedEvent = await response.json();
      console.log("Update gelukt:", updatedEvent);
      setSuccessMessage("Event succesvol geüpdatet!");
      setTimeout(() => {
        navigate("/"); // Navigate to homepage after 2 seconds
      }, 2000);
    } catch (error) {
      alert("Error bij update:", error);
    }
  };

  // Function to handle delete event - button click
  const handleDelete = async () => {
    if (!window.confirm("Weet je zeker dat je dit event wilt verwijderen?"))
      return;

    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }
      setSuccessMessage("Event succesvol verwijderd!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Fout bij verwijderen:", error);
    }
  };

  // Handle loading and error states

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>An error has occurred: {error.message}</Text>;

  // Categories for the checkbox input

  const categories = [
    { id: 1, label: "sports" },
    { id: 2, label: "games" },
    { id: 3, label: "relaxation" },
  ];

  return (
    <Box>
      <Heading size="sm" mb={4}>
        {" "}
        Edit this Event[ID {eventId}]{" "}
      </Heading>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Title input */}

        <FormControl isInvalid={errors.title} mb={4}>
          <FormLabel htmlFor="title">Event Titel</FormLabel>
          <Input
            id="title"
            {...register("title", {
              required: "Titel is verplicht",
              minLength: { value: 4, message: "Minimale lengte is 4" },
            })}
            backgroundColor="white"
          />
          <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
        </FormControl>

        {/* Description input */}

        <FormControl isInvalid={errors.description} mb={4}>
          <FormLabel htmlFor="description">Event Description</FormLabel>
          <Input
            id="description"
            {...register("description", {
              required: "Description is verplicht",
              minLength: { value: 4, message: "Minimale lengte is 4" },
            })}
            backgroundColor="white"
          />
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>

        {/* image input */}

        <FormControl isInvalid={errors.image}>
          <FormLabel htmlFor="image">Afbeelding URL</FormLabel>
          <Input
            id="image"
            type="url"
            placeholder="https://voorbeeld.nl/afbeelding.jpg"
            backgroundColor="white"
            {...register("image", {
              required: "Afbeelding URL is verplicht",
              pattern: {
                value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg))$/i,
                message: "Voer een geldige afbeelding-URL in",
              },
            })}
          />
          <FormErrorMessage>
            {errors.image && errors.image.message}
          </FormErrorMessage>
        </FormControl>

        {/* startTime input */}

        <FormControl isInvalid={errors.startTime} mb={4}>
          <FormLabel htmlFor="startTime">Starttijd</FormLabel>
          <Input
            id="startTime"
            type="datetime-local"
            backgroundColor="white"
            {...register("startTime", {
              required: "Starttijd is verplicht",
            })}
          />
          <FormErrorMessage>
            {errors.startTime && errors.startTime.message}
          </FormErrorMessage>
        </FormControl>

        {/* endTime input */}

        <FormControl isInvalid={errors.endTime} mb={4}>
          <FormLabel htmlFor="endTime">Eindtijd</FormLabel>
          <Input
            id="endTime"
            type="datetime-local"
            backgroundColor="white"
            {...register("endTime", {
              required: "Eindtijd is verplicht",
            })}
          />
          <FormErrorMessage>
            {errors.endTime && errors.endTime.message}
          </FormErrorMessage>
        </FormControl>

        {/* Category input */}

        <FormControl isInvalid={errors.categoryIds} mb={4}>
          <FormLabel>Choose one or more categories</FormLabel>
          <VStack align="start">
            {categories.map((cat) => (
              <Checkbox
                key={cat.id}
                value={cat.id.toString()}
                {...register("categoryIds", {
                  required: "Minstens één categorie is verplicht",
                })}
                isChecked={selectedCategories.includes(cat.id.toString())}
                onChange={onCheckboxChange}
                borderColor="gray.300"
                colorScheme="whiteAlpha"
                iconColor="black"
              >
                {cat.label}
              </Checkbox>
            ))}
          </VStack>
          <FormErrorMessage>{errors.categoryIds?.message}</FormErrorMessage>
        </FormControl>

        {/* Location input */}

        <FormControl isInvalid={errors.location} mb={4}>
          <FormLabel htmlFor="location">Location Event</FormLabel>
          <Input
            id="location"
            placeholder="Location"
            backgroundColor="white"
            {...register("location", {
              required: "This is required",
              minLength: {
                value: 4,
                message: "Minimum length should be 4",
              },
            })}
          />
          <FormErrorMessage>
            {errors.location && errors.location.message}
          </FormErrorMessage>
        </FormControl>

        {/* CreatedBy input */}

        <FormControl isInvalid={errors.createdBy} mb={4}>
          <FormLabel htmlFor="createdBy">Aangemaakt door</FormLabel>

          <Select
            id="createdBy"
            backgroundColor="white"
            {...register("createdBy", {
              required: "This is required",
            })}
            placeholder="Kies uw naam"
          >
            <option value="1">Michael Turner</option>
            <option value="2">Sophia Collins</option>
            <option value="3">Emily Carter</option>
          </Select>
          <FormErrorMessage>
            {errors.createdBy && errors.createdBy.message}
          </FormErrorMessage>
        </FormControl>

        {/* Success message after update */}

        {successMessage && (
          <Text color="green.500" mb={4} fontWeight="bold">
            {successMessage}
          </Text>
        )}

        {/* Submit and Delete buttons */}

        <HStack spacing={4} mt={4}>
          <Button type="submit" colorScheme="blue">
            Update
          </Button>

          <Button type="button" colorScheme="red" onClick={handleDelete}>
            Delete this Event
          </Button>
        </HStack>
      </form>
    </Box>
  );
};
