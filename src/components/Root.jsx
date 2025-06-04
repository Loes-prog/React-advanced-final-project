import React from "react";
import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import { Box } from "@chakra-ui/react";

// Main component for the Root layout

export const Root = () => {
  return (
    <>
      <Box as="nav" position="fixed" top="0" left="0" right="0" zIndex="1000">
        <Navigation />
      </Box>

      <Box pt="60px" backgroundColor={"gray.100"}>
        <Outlet />
      </Box>
    </>
  );
};
