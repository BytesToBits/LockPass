import {
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
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
import _ from "lodash";

export const PasswordView = ({ label, name, value, uuid, setPassList }) => {
  const [show, setShow] = useState(false);
  const { hasCopied, onCopy } = useClipboard(value);

  const handleDelete = async () => {
    electron.ipcRenderer.send("delete-pass", uuid);
    const passwords = await electron.ipcRenderer.invoke("pass-request");
    setPassList(passwords);
  };

  return (
    <Tr>
      <Td>{label}</Td>
      <Td>{name}</Td>
      <Td>{show ? value : <em>Hidden</em>}</Td>
      <Td>
        <Button mr={2} colorScheme="orange" onClick={() => setShow(!show)}>
          Toggle Show
        </Button>
        <Button mr={2} colorScheme="red" onClick={handleDelete}>
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
      electron.ipcRenderer.on("update-version", (event, ver) => {
        setVersion(ver);
      });
    }
  });

  const handleAdd = async () => {
    electron.ipcRenderer.send("new-password", {
      label: passLabel,
      name: passName,
      value: passValue,
    });

    const passwords = await electron.ipcRenderer.invoke("pass-request");
    setPassList(passwords);
  };

  const handleGen = () => {
    const CHARS =
      "1234567890-=_+asdfghjkl;zxcvbnm,.!@#$%^&*()ASDFGHJKLZXCVBNM<>?";
    let password = "";
    for (let i = 0; i < _.range(12, 25)[Math.floor(Math.random() * 12)]; i++) {
      password += CHARS[Math.floor(Math.random() * CHARS.length)];
    }

    setPassValue(password);
  };

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
          <Input
            value={passValue}
            bottom={2}
            id="password"
            type={showPass ? "text" : "password"}
            placeholder="•••••••••••••"
            onChange={(e) => setPassValue(e.target.value)}
          />
          <Checkbox
            mt={2}
            defaultChecked={showPass}
            onChange={() => setShowPass(!showPass)}
          >
            Show Password?
          </Checkbox>
        </FormControl>
        <Divider my={2} />
        <Flex gap={2} alignSelf="start">
          <Button colorScheme="green" variant="outline" onClick={handleAdd}>
            Create new password
          </Button>
          <Button colorScheme="orange" variant="outline" onClick={handleGen}>
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
