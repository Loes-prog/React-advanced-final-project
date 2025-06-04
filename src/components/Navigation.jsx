import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Flex, HStack, Link, Heading, Spacer } from "@chakra-ui/react";

// Main component for the Navigation bar

export const Navigation = () => {
  return (
    <Box bg="teal.500" px={6} py={4} color="white">
      <Flex alignItems="center">
        <Heading size="md">My Events App</Heading>
        <Spacer />
        <HStack spacing={6}>
          <Link as={RouterLink} to="/" _hover={{ textDecoration: "underline" }}>
            Events
          </Link>
          <Link
            as={RouterLink}
            to="/event/1"
            _hover={{ textDecoration: "underline" }}
          >
            Event
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
};
