import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightAddon,
  Progress,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import BaseLayout from "../components/BaseLayout";
import electron from "electron";
import passwords from "../util/passwords";

import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai"

const deterPass = (strength) => {
  if (strength > 80) return { colorScheme: "green", value: strength }
  else if (strength > 60) return { colorScheme: "orange", value: strength}
  else return { colorScheme: "red", value: strength }
}

export default () => {
  const [passLabel, setPassLabel] = useState("");
  const [passName, setPassName] = useState(undefined);
  const [passValue, setPassValue] = useState(undefined);
  const [passList, setPassList] = useState({});
  const [passStrength, setPassStrength] = useState(0)
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
      <Flex direction="column" m={5} justifyContent="center" alignItems="left" gap={4}>
        <Heading size="lg" marginY={"20px"}>
          New password information:
        </Heading>

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

        <Divider my={2} />
        <Flex gap={2} alignSelf="start">
          <Button colorScheme="green" variant="outline" onClick={async () => setPassList(await passwords.save({ label: passLabel, name: passName, value: passValue }))}>
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
        <Divider my={2} />
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
