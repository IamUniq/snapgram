"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import Loader from "@/components/shared/Loader";
import ProfileUploader from "@/components/shared/ProfileUploader";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUserContext } from "@/context/AuthContext";
import { useModalContext } from "@/context/ModalContext";
import { useUpdateUser } from "@/lib/react-query/queriesAndMutations";
import { ProfileValidation } from "@/lib/validation";
import { useState } from "react";
import PasswordModal from "../shared/PasswordModal";
import { IUpdateUser } from "@/types";
import { toast } from "sonner";

const EditProfileForm = () => {
    const { user } = useUserContext()
    const [dataToUpdate, setDataToUpdate] = useState<IUpdateUser | null>(null)
    const { modalToOpen, setModalToOpen } = useModalContext()
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof ProfileValidation>>({
        resolver: zodResolver(ProfileValidation),
        mode: "onChange",
        defaultValues: {
            name: user.name,
            username: user.username,
            password: "",
            email: user.email,
            bio: user.bio || "",
            file: [],
        },
    });

    const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useUpdateUser()

    async function onSubmit(values: z.infer<typeof ProfileValidation>) {
        const userInfo = {
            username: values.username,
            bio: values.bio,
            file: values.file!,
            userId: user.id,
            imageId: user.imageId,
            imageUrl: user.imageUrl,
            ...(values.email !== user.email && { email: values.email }),
            ...(values.name !== user.name && { name: values.name }),
            ...(values.password !== '' && { newPassword: values.password }),
        }

        if (userInfo.email || userInfo.newPassword) {
            if (userInfo.newPassword && values.password!.length < 8) {
                toast.error("Password must be at least 8 characters long")

                return;
            }

            setDataToUpdate(userInfo)
            setModalToOpen({ type: 'PASSWORD' })

            return;
        } else {
            const updatedUser = await updateProfile(userInfo)

            if (!updatedUser.success) {
                toast.error(updatedUser.error)
            }

            toast.success("Update Successful")
            navigate(`/profile/${user.id}`)
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-5 w-full py-7"
            >
                {modalToOpen?.type === 'PASSWORD' &&
                    <PasswordModal data={dataToUpdate!} />
                }
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <ProfileUploader
                                    fieldChange={field.onChange}
                                    mediaUrl={user.imageUrl}
                                />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />

                <h3 className="text-xl font-semibold mb-2">Account Information</h3>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input type="text" className="shad-input" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" className="shad-input" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" className="shad-input" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <h3 className="text-xl font-semibold mt-7 mb-2">Profile Information</h3>
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input type="text" className="shad-input" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Textarea
                                    className="shad-textarea"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    disabled={!form.formState.isDirty}
                    className="shad-button_primary"
                >
                    {isUpdatingProfile ? (
                        <Loader />
                    ) : (
                        "Update Profile"
                    )}
                </Button>
            </form>
        </Form>
    )
}

export default EditProfileForm