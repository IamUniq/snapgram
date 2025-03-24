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
import { useUpdateUser } from "@/lib/react-query/queriesAndMutations";
import { ProfileValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast";

const EditProfileForm = () => {
    const { user } = useUserContext()
    const { toast } = useToast();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof ProfileValidation>>({
        resolver: zodResolver(ProfileValidation),
        mode: "onChange",
        defaultValues: {
            name: user.name,
            username: user.username,
            email: user.email,
            bio: user.bio || "",
            file: [],
        },
    });

    const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useUpdateUser()

    async function onSubmit(values: z.infer<typeof ProfileValidation>) {
        const userInfo = {
            ...values,
            file: values.file!,
            userId: user.id,
            imageId: user.imageId,
            imageUrl: user.imageUrl
        }
        const updatedUser = await updateProfile(userInfo)

        if (!updatedUser) {
            toast({
                variant: "destructive",
                title: "Error updating profile. Please try again"
            })
        }

        toast({
            title: "Updated Successful"
        })
        navigate(`/profile/${user.id}`)

    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-5 w-full py-7"
            >
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
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" disabled className="shad-input" {...field} />
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