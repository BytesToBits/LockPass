import { Button, useDisclosure } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import Main from "../components/Main"
import CreatePassModal from "../components/modals/createPass.modal"
import passwords from "../util/passwords"

export default () => {
    const [firstFetch, setFirstFetch] = useState(false)

    const createModal = useDisclosure()

    useEffect(() => {

        if(!firstFetch) {


            setFirstFetch(true)
        }

    })

    return (
        <Main>
            <CreatePassModal isOpen={createModal.isOpen} onClose={createModal.onClose} />

            <Button onClick={createModal.onOpen}>+</Button>
            <Button onClick={async() => console.log(await passwords.getAll())}>Show</Button>

        </Main>
    )
}