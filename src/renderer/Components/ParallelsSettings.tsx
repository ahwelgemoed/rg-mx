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
  useClipboard,
  Icon,
  Flex,
  Input,
} from "@chakra-ui/react";
// import messenger from "messenger";
import spawnAsync from "@expo/spawn-async";
import { getWindowsIp } from "../utils";
import { MdComputer } from "react-icons/md";
import { RootStoreContext } from "../stores/RootStore";
import { observer } from "mobx-react-lite";

export const ParallelsSettings: React.FC = observer(({}) => {
  const iPWindows = getWindowsIp().address;
  const { hasCopied, onCopy } = useClipboard(iPWindows);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const projectStore = React.useContext(RootStoreContext);
  const [allVms, setAllVms] = React.useState<string | undefined>();

  React.useEffect(() => {
    findAllVMs();

    // here we have 4 servers listening on 4 different ports
    // var server1 = messenger.createListener(8001);

    // server1.on("a message came", function (m, data) {
    //   // note that m.data and data are equivalent
    //   console.log("server 1 got data", data);
    // });

    // // a client that can be used to emit to all the servers
    // var client = messenger.createSpeaker("127.0.0.1:8001");

    // setInterval(function () {
    //   client.shout("a message came", { some: "data" });
    // }, 1000);
  }, []);

  const findAllVMs = async () => {
    // const ffmpeg$ = spawnAsync("prlctl", ["list", "-a"]);
    // const childProcess = ffmpeg$.child;
    // childProcess.stdout.on("data", (data) => {});
    // childProcess.stderr.on("data", (data) => {
    //   console.error(`ffmpeg stderr: ${data}`);
    // });
    // const result = await ffmpeg$;
    // setAllVms(result.output[0]);
  };
  console.log("allVms", allVms && allVms.split(/(\r\n|\n|\r)/gm));
  console.log("allVms", allVms && allVms.split("\n")[1].replace(/\s/g, ""));
  return (
    <>
      <Button mr="-px" onClick={onOpen}>
        <Icon as={MdComputer} size="xs" />
      </Button>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Parales</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack pt={3} spacing={4} align="stretch">
              <Heading size="md" mb={4}>
                Setup
              </Heading>
              <Divider />
              <Heading size="md" mb={4}>
                Copy This into The Tray App
              </Heading>
              <Flex mb={2}>
                <Input
                  size="sm"
                  value={iPWindows}
                  isReadOnly
                  placeholder="Welcome"
                />
                <Button onClick={onCopy}>
                  {hasCopied ? "Copied" : "Copy"}
                </Button>
              </Flex>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal">Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});
