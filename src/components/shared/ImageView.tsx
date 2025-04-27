import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

const ImageView = ({ images, containerClassname, className }: { images: string[], containerClassname?: string, className?: string }) => {
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!api) {
            return
        }

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])

    const goToSlide = (index: number) => {
        api?.scrollTo(index)
    }

    return (
        <Carousel setApi={setApi} className={cn("", containerClassname)}>
            <CarouselContent>
                {images.map((url, index) => (
                    <CarouselItem key={index}>
                        <img
                            src={url || "/assets/icons/profile-placeholder.svg"}
                            className={cn("", className)}
                        />
                    </CarouselItem>
                ))}

            </CarouselContent>
            {count > 1 && (
                <div className="absolute bottom-7 right-1/2 -translate-x-1/2 flex gap-2 justify-center z-10">
                    {Array.from({ length: count }).map((_, index) => (
                        <button
                            key={index}
                            className={cn(
                                "w-2.5 h-2.5 bg-white rounded-full transition-all", {
                                "bg-primary-500 scale-125": current === (index + 1)
                            }
                            )}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </Carousel>
    )
}

export default ImageView