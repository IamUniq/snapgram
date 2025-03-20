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
import { useDeletePost } from "@/lib/react-query/queriesAndMutations"
import { useNavigate } from "react-router-dom"
import Loader from "./Loader"

type DeleteModalProps = {
    post: {
        id: string;
        imageId: string;
    }
}

const DeleteModal = ({ post }: DeleteModalProps) => {
    const navigate = useNavigate()
    const { modalToOpen, setModalToOpen } = useModalContext()

    const onOpenChange = () => {
        modalToOpen === 'DELETE'
            ? setModalToOpen(null)
            : setModalToOpen('DELETE')
    }

    const { mutateAsync: deletePost, isPending: isDeletingPost } = useDeletePost()

    const handleDeletePost = async () => {
        await deletePost({ postId: post.id, imageId: post.imageId })
        navigate(-1)
    }

    return (
        <AlertDialog open={modalToOpen === 'DELETE'} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    {isDeletingPost
                        ? <Loader /> : (
                            <>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeletePost}>Continue</AlertDialogAction>
                            </>
                        )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteModal