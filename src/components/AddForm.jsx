import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  VStack,
  Checkbox,
} from "@chakra-ui/react";

// Main component for the HookForm to add a new event

export const AddForm = () => {
  // Chakra UI hooks for modal functionality
  const { isOpen, onOpen, onClose } = useDisclosure();

  // React Hook Form for form handling > useForm
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors, isSubmitting },
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

  // Function to handle form submission
  const onSubmit = async (values) => {
    try {
      // Prepare the data to be sent to the server
      const data = {
        id: uuidv4(), // generates a unique ID for the event
        ...values,
        categoryIds: values.categoryIds.map((id) => Number(id)), // convert categoryIds to an array of numbers
      };

      // POST request to the server to add the event
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Fout bij verzenden van data");
      }

      await response.json();
      alert("Event succesvol toegevoegd!");
      onClose(); // close the modal after successful submission
      window.location.reload(); // reload the page to see the new event
    } catch (error) {
      alert("Er is iets misgegaan: " + error.message);
    }
  };

  // Categories for the checkbox input

  const categories = [
    { id: 1, label: "sports" },
    { id: 2, label: "games" },
    { id: 3, label: "relaxation" },
  ];

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        Add Event
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} vh="100vh">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* CreatedBy input */}

              <FormControl isInvalid={errors.createdBy} mb={4}>
                <Select
                  id="createdBy"
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

              {/* Title input */}

              <FormControl isInvalid={errors.title} mb={4}>
                <FormLabel htmlFor="title">Event Title</FormLabel>
                <Input
                  id="title"
                  placeholder="Event Title"
                  {...register("title", {
                    required: "This is required",
                    minLength: {
                      value: 4,
                      message: "Minimum length should be 4",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.title && errors.title.message}
                </FormErrorMessage>
              </FormControl>

              {/* Description input */}

              <FormControl isInvalid={errors.description} mb={4}>
                <FormLabel htmlFor="description">Description</FormLabel>
                <Input
                  id="description"
                  placeholder="Event Description"
                  {...register("description", {
                    required: "This is required",
                    minLength: {
                      value: 4,
                      message: "Minimum length should be 4",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.description && errors.description.message}
                </FormErrorMessage>
              </FormControl>

              {/* Image input */}

              <FormControl isInvalid={errors.image}>
                <FormLabel htmlFor="image">Afbeelding URL</FormLabel>
                <Input
                  id="image"
                  type="url"
                  placeholder="https://voorbeeld.nl/afbeelding.jpg"
                  {...register("image", {
                    required: "Afbeelding URL is verplicht",
                    pattern: {
                      value:
                        /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg))$/i,
                      message: "Voer een geldige afbeelding-URL in",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.image && errors.image.message}
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
                <FormErrorMessage>
                  {errors.categoryIds?.message}
                </FormErrorMessage>
              </FormControl>

              {/* Location input */}

              <FormControl isInvalid={errors.location} mb={4}>
                <FormLabel htmlFor="location">Location Event</FormLabel>
                <Input
                  id="location"
                  placeholder="Location"
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

              {/* startTime input */}

              <FormControl isInvalid={errors.startTime} mb={4}>
                <FormLabel htmlFor="startTime">Starttijd</FormLabel>
                <Input
                  id="startTime"
                  type="datetime-local"
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
                  {...register("endTime", {
                    required: "Eindtijd is verplicht",
                  })}
                />
                <FormErrorMessage>
                  {errors.endTime && errors.endTime.message}
                </FormErrorMessage>
              </FormControl>
              <Button
                mt={4}
                colorScheme="blue"
                isLoading={isSubmitting}
                type="submit"
              >
                Submit
              </Button>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button mt={4} colorScheme="teal" type="submit" onClick={onClose}>
              Go Back
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
