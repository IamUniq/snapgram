import { useState, useRef, useCallback } from "react"
import { useStory } from "@/context/StoryContext"
import TextEditor from "./TextEditor"
import DrawingCanvas from "./DrawingCanvas"
import StoryToolbar from "./StoryToolbar"

interface StoryEditorProps {
    mediaType: string;
    mediaUrl: string
}

export default function StoryEditor({ mediaType, mediaUrl }: StoryEditorProps) {
    const { activeToolId, elements, backgroundColor, addElement } = useStory()
    const [showTextEditor, setShowTextEditor] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const isVideo = mediaType.toLowerCase().includes("video")

    const handleToolSelect = (toolId: string) => {
        if (toolId === "text") {
            setShowTextEditor(true)
        } else {
            setShowTextEditor(false)
        }
    }

    const handleAddText = useCallback(
        (text: string, style: any) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect()
                const x = rect.width / 2 - 100
                const y = rect.height / 2 - 20

                addElement({
                    type: "text",
                    content: text,
                    position: { x, y },
                    style,
                })
            }
            setShowTextEditor(false)
        },
        [addElement],
    )

    return (
        <div className="relative w-full h-full flex flex-col overflow-hidden">
            <div ref={ containerRef } className="flex-center mx-auto relative overflow-hidden w-full lg:w-[40rem] h-[56vh] lg:h-full" style={ { backgroundColor } }>
                {/* Media display */ }
                <div className="absolute inset-0 flex items-center justify-center">
                    { isVideo ? (
                        <video src={ mediaUrl } autoPlay loop muted playsInline className="max-h-full max-w-full object-contain" />
                    ) : (
                        <img
                            src={ mediaUrl || "/placeholder.svg" }
                            alt="Story media"
                            className="max-h-full max-w-full object-contain"
                        />
                    ) }
                </div>

                {/* Text layer */ }
                <div className="absolute inset-0 pointer-events-none">
                    { elements.map((element) => {
                        if (element.type === 'text') {
                            return (
                                <div
                                    key={ element.id }
                                    className="absolute pointer-events-auto cursor-move"
                                    style={ {
                                        left: element.position.x,
                                        top: element.position.y,
                                        ...element.style,
                                    } }
                                >
                                    { element.content }
                                </div>
                            )
                        }
                        return null
                    }) }
                </div>

                {/* Drawing layer */ }
                { activeToolId === "draw" && <DrawingCanvas /> }
            </div>

            {/* Text editor */ }
            { showTextEditor && <TextEditor onClose={ () => setShowTextEditor(false) } onAdd={ handleAddText } /> }

            {/* Toolbar */ }
            <StoryToolbar onToolSelect={ handleToolSelect } />
        </div>
    )
}
