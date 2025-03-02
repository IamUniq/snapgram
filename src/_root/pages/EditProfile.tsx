import EditProfileForm from "@/components/forms/EditProfileForm"

const EditProfile = () => {
    return (
        <div className="flex flex-col flex-1 py-10 px-5 md:p-14 overflow-scroll custom-scrollbar gap-8 max-w-[45rem]">
            <div className="flex gap-2 w-full max-w-5xl">
                <img
                    src="/assets/icons/edit.svg"
                    width={36}
                    height={36}
                    alt="edit"
                    className="invert-white"
                />
                <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
            </div>

            <EditProfileForm />
        </div>
    )
}

export default EditProfile