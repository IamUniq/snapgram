import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { useModalContext } from "@/context/ModalContext"
import { useNavigate } from "react-router-dom"
import Loader from "./Loader"
import { IUpdateUser } from "@/types"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { useState } from "react"
import { useUpdateUser } from "@/lib/react-query/queriesAndMutations"
import { toast } from "sonner"

const PasswordModal = ({ data }: { data: IUpdateUser }) => {
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useUpdateUser()
    const { modalToOpen, setModalToOpen } = useModalContext()

    const onOpenChange = () => {
        modalToOpen?.type === 'PASSWORD'
            ? setModalToOpen(null)
            : setModalToOpen({ type: 'PASSWORD' })
    }

    const handleSubmit = async () => {
        const newData = {
            ...data,
            password
        }

        const updatedUser = await updateProfile(newData)

        if (updatedUser.success == false) {
            toast.error(updatedUser.error)

            return;
        }

        toast.success("Update Successful")
        navigate(`/profile/${data.userId}`)
    }

    return (
        <AlertDialog open={modalToOpen?.type === 'PASSWORD'} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Action</AlertDialogTitle>
                    <AlertDialogDescription>
                        To update your login information, please enter your password to confirm your status.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex flex-col gap-4">
                    <Label className="absolute -left-[9999px] top-0">Password</Label>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="shad-input"
                    />
                </div>
                <AlertDialogFooter>
                    {isUpdatingProfile
                        ? <Loader /> : (
                            <>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleSubmit} className="bg-primary-500 text-dark-1">Update</AlertDialogAction>
                            </>
                        )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default PasswordModal