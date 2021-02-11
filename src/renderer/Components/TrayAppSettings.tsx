import React, { useState } from "react";

import {
  Stack,
  Button,
  Modal,
  Input,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Divider,
  Heading,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { RootStoreContext } from "../stores/RootStore";
import { observer } from "mobx-react-lite";

export const TrayAppSettings: React.FC = observer(({}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [windowsIP, setWindowsIP] = useState<string>("");
  const mainStore = React.useContext(RootStoreContext);
  // const [mendixAppsPath, setMendixAppsPath] = React.useState<
  //   string | undefined
  // >();

  React.useEffect(() => {
    if (!mainStore.macStore.windowsIp) {
      onOpen;
    }
    setWindowsIP(mainStore.macStore.windowsIp);
  }, []);
  const handleChange = (e: any) => {
    setWindowsIP(e.target.value);
  };
  const saveAllDate = () => {
    mainStore.macStore.setWindowsIp(windowsIP);
  };
  return (
    <>
      <Button mr="-px" onClick={onOpen}>
        <SettingsIcon size="xs" />
      </Button>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack pt={3} spacing={4} align="stretch">
              <Heading size="sm">Set Windows IP:</Heading>
              <Input
                variant="outline"
                placeholder="Windows IP"
                value={windowsIP}
                onChange={handleChange}
              />
              <Divider />
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="cyan" onClick={saveAllDate}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});
