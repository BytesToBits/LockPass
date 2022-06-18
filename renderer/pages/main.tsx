import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
  Progress,
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

const deterPass = (strength) => {
  if (strength > 80) return { colorScheme: "green", value: strength }
  else if (strength > 60) return { colorScheme: "orange", value: strength }
  else return { colorScheme: "red", value: strength }
}

const PasswordView = ({ label, name, value, uuid, setPassList }) => {
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
  const [passStrength, setPassStrength] = useState(0)
  const [passList, setPassList] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [version, setVersion] = useState("");
  const [firstFetch, setFirstFetch] = useState(false);

  useEffect(() => {
    if (!firstFetch) {
      setInterval(async () => {
        const ver = await electron.ipcRenderer.invoke("get-version")
        console.log(ver)
        setVersion(ver)
      }, 5000)

      setFirstFetch(true)
    }
  });

  return (
    <BaseLayout>
      
      <Image src="/images/icon.png" draggable={false} h="200px" mx="auto" />
      <Heading textAlign="center" size="lg" marginY={"20px"}>
          Store Your Passwords
        </Heading>

      <Flex direction="column" m={5} justifyContent="center" alignItems="left" gap={4}>

        <FormControl variant="floating" isRequired>
          <Input
            placeholder={" "}
            value={passLabel}
            type="text"
            onChange={(e) => setPassLabel(e.target.value)}
          />
          <FormLabel>Label</FormLabel>
        </FormControl>

        <FormControl variant="floating">
          <Input
            value={passName}
            type="text"
            placeholder=" "
            onChange={(e) => setPassName(e.target.value)}
          />
          <FormLabel>Username</FormLabel>
        </FormControl>

        <FormControl variant="floating" isRequired>
          <InputGroup>
            <Input
              value={passValue}
              type={showPass ? "text" : "password"}
              placeholder=" "
              onChange={(e) => {
                setPassValue(e.target.value)
                setPassStrength(passwords.strength(e.target.value))
              }}
            />
            <FormLabel>Password</FormLabel>
            <InputRightAddon cursor="pointer" onClick={() => setShowPass(!showPass)}>
              <Icon as={showPass ? AiFillEye : AiFillEyeInvisible} />
            </InputRightAddon>
          </InputGroup>
          <Progress rounded="md" mt={2} {...deterPass(passStrength)} isAnimated hasStripe />
        </FormControl>
        <Flex gap={2} alignSelf="start">
          <Button colorScheme="green" variant="outline" onClick={async() => setPassList(await passwords.save({ label: passLabel, name: passName, value: passValue }))}>
            Create new password
          </Button>
          <Button colorScheme="orange" variant="outline" onClick={() => {
            const pass = passwords.generate()
            setPassValue(pass)
            setPassStrength(passwords.strength(pass))
          }}>
            Generate new password
          </Button>
        </Flex>
      </Flex>

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

      <Text
        fontSize="12px"
        opacity={0.5}
        position="absolute"
        bottom="5px"
        right="5px"
        userSelect="none"
      >
        Version: {version} <a href="/new_main">(VIEW NEW)</a>
      </Text>
    </BaseLayout>
  );
};
