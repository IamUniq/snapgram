import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useUserContext } from "@/context/AuthContext";
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations";
import { PostValidation } from "@/lib/validation";
import { Models } from "appwrite";
import { useNavigate } from "react-router-dom";
import FileUploader from "../shared/FileUploader";
import Loader from "../shared/Loader";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

type PostFormProps = {
  post?: Models.Document;
  action: 'Create' | 'Update'
};

const PostForm = ({ post, action }: PostFormProps) => {
  const { mutateAsync: createPost, isPending: isCreatingPost } =
    useCreatePost();
  const { mutateAsync: updatePost, isPending: isUpdatingPost } =
    useUpdatePost();
  const { user } = useUserContext();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      tags: post ? post?.tags.join(",") : "",
    },
  });

  async function onSubmit(values: z.infer<typeof PostValidation>) {
    if (action === 'Create') {
      const newPost = await createPost({
        ...values,
        userId: user?.id,
      });

      if (!newPost) {
        toast.error("Error. Please try again");
      }

      navigate("/");
    }

    if (post && action === 'Update') {
      const updatedPost = await updatePost({
        ...values,
        postId: post.$id,
        imageIds: post?.imageIds,
        imageUrls: post?.imageUrls,
      })

      if (!updatedPost) {
        toast.error("Error. Please try again");
      }

      return navigate(`/posts/${post.$id}`);
    }

  }
  return (
    <Form { ...form }>
      <form
        onSubmit={ form.handleSubmit(onSubmit) }
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={ form.control }
          name="caption"
          render={ ({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  { ...field }
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          ) }
        />
        { action === "Create" && (
          <FormField
            control={ form.control }
            name="file"
            render={ ({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Add Photos</FormLabel>
                <FormControl>
                  <FileUploader
                    fieldChange={ field.onChange }
                    mediaUrls={ post?.imageUrls || [] }
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            ) }
          />
        ) }
        <FormField
          control={ form.control }
          name="location"
          render={ ({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" { ...field } />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          ) }
        />
        <FormField
          control={ form.control }
          name="tags"
          render={ ({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  placeholder="Nextjs, React, Angular"
                  { ...field }
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          ) }
        />

        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="shad-button_dark_4">
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={ isCreatingPost || isUpdatingPost }
            className="shad-button_primary whitespace-nowrap"
          >
            { isCreatingPost || isUpdatingPost ? (
              <div className="flex-center gap-2">
                <Loader /> Posting...
              </div>
            ) : `${action} Post` }
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
