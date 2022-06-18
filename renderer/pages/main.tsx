import {
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightAddon,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useClipboard,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import BaseLayout from "../components/BaseLayout";
import electron from "electron";
import passwords from "../util/passwords";

import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai"

export const PasswordView = ({ label, name, value, uuid, setPassList }) => {
  const [show, setShow] = useState(false);
  const { hasCopied, onCopy } = useClipboard(value);

  return (
    <Tr>
      <Td>{label}</Td>
      <Td>{name}</Td>
      <Td>{show ? value : <em>Hidden</em>}</Td>
      <Td>
        <Button mr={2} colorScheme="orange" onClick={() => setShow(!show)}>
          Toggle Show
        </Button>
        <Button mr={2} colorScheme="red" onClick={async () => setPassList(await passwords.delete(uuid))}>
          Delete
        </Button>
        <Button colorScheme="green" onClick={onCopy}>
          {hasCopied ? "Copied" : "Copy"}
        </Button>
      </Td>
    </Tr>
  );
};

export default () => {
  const [passLabel, setPassLabel] = useState("");
  const [passName, setPassName] = useState(undefined);
  const [passValue, setPassValue] = useState(undefined);
  const [passList, setPassList] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [version, setVersion] = useState("");
  const [firstFetch, setFirstFetch] = useState(false);

  useEffect(() => {
    const setPasswords = async () => {
      const passwords = await electron.ipcRenderer.invoke("pass-request");
      setPassList(passwords);
      console.log(passwords);
      setFirstFetch(true);
    };

    if (!firstFetch) {
      setPasswords();

      setInterval(async () => {
        const ver = await electron.ipcRenderer.invoke("get-version")
        console.log(ver)
        setVersion(ver)
      }, 5000)
    }
  });

  return (
    <BaseLayout>
      <Flex direction="column" m={5} justifyContent="center" alignItems="left">
        <Heading size="lg" marginY={"20px"}>
          New password information:
        </Heading>
        <FormControl>
          <FormLabel htmlFor="label">Label</FormLabel>
          <Input
            value={passLabel}
            bottom={2}
            id="label"
            type="text"
            placeholder="GitHub"
            onChange={(e) => setPassLabel(e.target.value)}
          />
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input
            value={passName}
            bottom={2}
            id="username"
            type="text"
            placeholder="JohnSmith03"
            onChange={(e) => setPassName(e.target.value)}
          />
          <FormLabel htmlFor="password">Password</FormLabel>
          <InputGroup bottom={2}>
            <Input
              value={passValue}
              id="password"
              type={showPass ? "text" : "password"}
              placeholder="•••••••••••••"
              onChange={(e) => setPassValue(e.target.value)}
            />
            <InputRightAddon cursor="pointer" onClick={() => setShowPass(!showPass)}>
              <Icon as={showPass ? AiFillEye : AiFillEyeInvisible} />
            </InputRightAddon>
          </InputGroup>
        </FormControl>
        <Divider my={2} />
        <Flex gap={2} alignSelf="start">
          <Button colorScheme="green" variant="outline" onClick={async () => setPassList(await passwords.save({ label: passLabel, name: passName, value: passValue }))}>
            Create new password
          </Button>
          <Button colorScheme="orange" variant="outline" onClick={() => setPassValue(passwords.generate())}>
            Generate new password
          </Button>
        </Flex>
        <Divider my={2} />
        <Heading size="lg" marginY={"20px"}>
          Saved Passwords:
        </Heading>
        <TableContainer maxW="max-content">
          <Table variant="striped" colorScheme="red">
            <TableCaption>* Password deletions are irreversible!</TableCaption>
            <Thead>
              <Tr>
                <Th>Label</Th>
                <Th>Username</Th>
                <Th>Password</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.keys(passList).map((uuid, i) => (
                <PasswordView
                  label={passList[uuid].label}
                  name={passList[uuid].name}
                  value={passList[uuid]["value"]}
                  uuid={uuid}
                  setPassList={setPassList}
                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>

      <Text
        fontSize="12px"
        opacity={0.5}
        position="absolute"
        bottom="5px"
        right="5px"
        userSelect="none"
      >
        Version: {version}
      </Text>
    </BaseLayout>
  );
};
