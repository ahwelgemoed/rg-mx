import React from "react";

import {
  Stack,
  Button,
  Modal,
  Heading,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Divider,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { AttachmentIcon } from "@chakra-ui/icons";
import { RootStoreContext } from "../stores/RootStore";
import { observer } from "mobx-react-lite";

export const ExtraInfoModal: React.FC = observer(({ project }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const projectStore = React.useContext(RootStoreContext);

  return (
    <>
      <Button
        colorScheme="teal"
        variant="ghost"
        size="xs"
        mr="-px"
        onClick={onOpen}
      >
        Options
      </Button>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg" mb={4}>
              Options for: <b>{project.name}</b>{" "}
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack pt={3} spacing={4} align="stretch">
              <Heading size="md" mb={4}>
                Setup Gulp in Project:
              </Heading>
              <Button colorScheme="cyan">Setup Gulp</Button>
              <Divider />
            </Stack>
            <Stack pt={3} spacing={4} align="stretch">
              <Heading size="md" mb={4}>
                Setup Gulp in Project:
              </Heading>
              <Button colorScheme="cyan">Setup Gulp</Button>
              <Divider />
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="cyan">Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});
