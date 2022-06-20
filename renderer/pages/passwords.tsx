import { Box, Flex, FormControl, FormLabel, HStack, Icon, Image, Input, InputGroup, InputRightElement, Text, useDisclosure } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import Main from "../components/Main"
import CreatePassModal from "../components/modals/createPass.modal"
import passwords from "../util/passwords"
import _ from "lodash"

import { GoSearch } from "react-icons/go"
import { IoIosAddCircle } from "react-icons/io"
import { RiKey2Fill } from "react-icons/ri"

import { darken } from "@chakra-ui/theme-tools"
import { PasswordData } from "../util/interfaces"

const alphabeticSort = (object, factor) => {
    let newObject = {}
    let alphabeticKeys = Object.keys(object).sort((a, b) => object[a][factor].localeCompare(object[b][factor]))

    alphabeticKeys.forEach(key => { newObject[key] = object[key] })
    return newObject
}

const alphaSplit = (object, factor) => {
    const order: any = "!@#$%^&*()_+-=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const unusedKeys = Object.keys(object)
    const splitObject = {}

    for (let i in order) {
        const elems = []
        Object.keys(object).forEach((key) => {
            if (object[key][factor].toUpperCase().startsWith(order[i])) {
                elems.push(key)
                unusedKeys.splice(unusedKeys.indexOf(key), 1)
            }
        })

        if (!_.isEmpty(elems)) {
            splitObject[order[i]] = elems
        }
    }

    if (!_.isEmpty(unusedKeys)) {
        splitObject["OTHER"] = unusedKeys
    }

    return splitObject
}

const dotWrap = (text: string) => text.length <= 30 ? text : text.slice(0, 31).split(" ").slice(0,-1).join(' ') + '...'

const PassBox = ({ data }) => {
    const password: PasswordData = data

    const extra = password.website || password.email || password.notes || `${data.label} Password`

    return (
        <Flex alignItems="center" borderBottom="2px solid gray" p={2}>
            {!password.icon && (
                <Icon as={RiKey2Fill} fontSize="40px" />
            )}
            {password.icon && (
                <Image draggable={false} src={password.icon} boxSize="40px" />
            )}

            <Box ml={2}>
                <Text fontWeight="bold">{dotWrap(password.label)}</Text>
                <Text>{dotWrap(extra)}</Text>
            </Box>
        </Flex>
    )
}

export default () => {
    const [firstFetch, setFirstFetch] = useState(false)
    const [passList, setPassList] = useState({})
    const [displayList, setDisplayList] = useState({})

    const createModal = useDisclosure()

    useEffect(() => {

        if (!firstFetch) {
            const init = async () => {
                const new_list = alphabeticSort((await passwords.getAll()), "label")
                setPassList(new_list)
                setDisplayList(alphaSplit(new_list, "label"))
            }
            init()

            setInterval(() => {
                init()
            }, 1500)

            setFirstFetch(true)
        }

    })

    return (
        <Main>
            <CreatePassModal isOpen={createModal.isOpen} onClose={createModal.onClose} />
            <Flex minH="calc(100vh - 30px)" w="300px"
                direction="column"
                alignItems={"center"}
            >
                {/* @ts-ignore */}
                <Box p={5} bg={darken("background", 10)} w="100%">
                    {/* @ts-ignore */}
                    <FormControl variant="floating" labelColor={darken("background", 10)}>
                        <InputGroup>
                            <Input type="text" placeholder=" " />
                            <FormLabel>Search by Label</FormLabel>
                            <InputRightElement>
                                <Icon as={GoSearch} />
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                </Box>

                {/* @ts-ignore */}
                <HStack bg={darken("background", 6)}
                    p={2}
                    w="100%"
                    justifyContent="center"
                >
                    <Text>Showing {Object.keys(passList).length} stored passwords</Text>
                    <Icon fontSize="25px" color="limegreen" cursor="pointer" onClick={createModal.onOpen} as={IoIosAddCircle} />
                </HStack>

                <Flex
                    w="100%"
                    p={2}
                    borderTop="2px solid gray"
                    direction="column"
                    gap={2}
                    maxH="100%"
                >
                    {Object.keys(displayList).map((key) => (
                        <Box>
                            <Text fontWeight="bold">{key}</Text>
                            <Box>
                                {displayList[key].map((uuid) => <PassBox data={passList[uuid]} />)}
                            </Box>
                        </Box>
                    ))}
                </Flex>
            </Flex>
        </Main>
    )
}