import React from "react";

import {
  Stack,
  Button,
  Modal,
  Tag,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Divider,
  Heading,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Icon,
} from "@chakra-ui/react";
import messenger from "messenger";
import spawnAsync from "@expo/spawn-async";
import { getWindowsIp } from "../utils";

import { MdComputer } from "react-icons/md";
import { RootStoreContext } from "../stores/RootStore";
import { observer } from "mobx-react-lite";

export const ParallelsSettingsWindows: React.FC = observer(({}) => {
  const SERVERADDRES = `${getWindowsIp().address}:8009`;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const projectStore = React.useContext(RootStoreContext);
  const [allVms, setAllVms] = React.useState<string | undefined>();

  React.useEffect(() => {
    console.log("getWindowsIp", getWindowsIp());
    const server1 = messenger.createListener(SERVERADDRES);
    server1.on("OPEN_PROJECT", function (m, data) {
      console.log("server 1 got data", data);
    });
    // var client = messenger.createSpeaker(SERVERADDRES);
    // setInterval(function () {
    //   client.shout("a message came", { some: "data" });
    // }, 1000);
  }, []);
  // findAllVMs();
  // here we have 4 servers listening on 4 different ports
  // // // a client that can be used to emit to all the servers

  // const findAllVMs = async () => {
  //   console.log("run");

  //   const ffmpeg$ = spawnAsync("prlctl", ["list", "-a"]);
  //   const childProcess = ffmpeg$.child;
  //   childProcess.stdout.on("data", (data) => {});
  //   childProcess.stderr.on("data", (data) => {
  //     console.error(`ffmpeg stderr: ${data}`);
  //   });
  //   const result = await ffmpeg$;
  //   setAllVms(result.output[0]);
  // };
  // console.log("allVms", allVms && allVms.split(/(\r\n|\n|\r)/gm));
  // console.log("allVms", allVms && allVms.split("\n")[1].replace(/\s/g, ""));
  return (
    <>
      <Button mr="-px" onClick={onOpen}>
        <Icon as={MdComputer} size="xs" />
      </Button>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Windows Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack pt={3} spacing={4} align="stretch">
              <Heading size="md" mb={4}>
                Your Windows Settings
              </Heading>
              <Heading size="sm" mb={4}>
                Windows IP: {getWindowsIp().address}
              </Heading>

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
