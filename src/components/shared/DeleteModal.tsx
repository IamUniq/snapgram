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

const DeleteModal = ({ imageId }: { imageId: string }) => {
    const navigate = useNavigate()
    const { modalToOpen, setModalToOpen } = useModalContext()

    const postId = modalToOpen?.postId

    const onOpenChange = () => {
        if (!postId) {
            setModalToOpen(null)
        }

        modalToOpen?.type === 'DELETE'
            ? setModalToOpen(null)
            : setModalToOpen({ type: 'DELETE', postId })
    }

    const { mutateAsync: deletePost, isPending: isDeletingPost } = useDeletePost()

    const handleDeletePost = async () => {
        await deletePost({ postId: postId!, imageId })
        navigate(-1)
    }

    return (
        <AlertDialog open={ modalToOpen?.type === 'DELETE' } onOpenChange={ onOpenChange }>
            <AlertDialogContent className="bg-dark-4">
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-left">
                        This will permanently delete your post. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row items-end justify-end space-x-2">
                    { isDeletingPost
                        ? <Loader /> : (
                            <>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={ handleDeletePost }
                                    className="bg-red text-white mb-0"
                                >
                                    Delete
                                </AlertDialogAction>
                            </>
                        ) }
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteModal