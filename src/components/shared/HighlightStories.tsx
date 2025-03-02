const HighlightStories = () => {
    return (
        <div className="flex gap-6">
            {
                ['BTS', 'Frisbee', 'Nature', 'Outdoor', 'My Games']
                    .map((highlight, index) => (
                        <div
                            key={index}
                            className="flex-center flex-col gap-2"
                        >
                            <div className="w-16 h-16 outline outline-dark-4 rounded-full cursor-pointer overflow-hidden">
                                <img
                                    src="/assets/images/profile.png" className="w-full h-full object-cover object-center"
                                />

                            </div>
                            <p className="text-light-2 small-medium">{highlight}</p>
                        </div>
                    ))}
        </div>
    )
}

export default HighlightStories