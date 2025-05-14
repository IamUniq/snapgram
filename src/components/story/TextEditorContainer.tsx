import { useStory } from "@/context/StoryContext"
import { useCallback, useState } from "react"
import { Textarea } from "../ui/textarea"
import TextEditorToolbar from "./TextEditorToolbar"
import Toolbar from "./Toolbar"

export default function TextEditorContainer() {
    const { text: { content, style }, setText } = useStory()
    const [showEditorToolbar, setShowEditorToolbar] = useState(false)

    const handleChange = useCallback(
        (value: string) => {
            setText(prev => ({
                ...prev,
                content: value
            }))
        },
        [setText],
    )

    return (
        <div className="relative w-full h-full flex flex-col overflow-hidden">
            <div className="flex-center mx-auto relative overflow-hidden w-full lg:w-[40rem] h-[56vh] lg:h-full" style={ { backgroundColor: style.backgroundColor } }>
                <Textarea
                    value={ content }
                    onChange={ (e) => handleChange(e.target.value) }
                    className="w-full h-full bg-transparent border-none resize-none text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                    style={ {
                        color: style.color,
                        fontSize: style.fontSize,
                        lineHeight: style.lineHeight,
                        fontWeight: style.fontWeight,
                        fontStyle: style.fontStyle,
                        textAlign: style.textAlign as any,
                    } }
                    autoFocus
                />
            </div>


            { showEditorToolbar && <TextEditorToolbar setShowEditorToolbar={ setShowEditorToolbar } /> }

            <Toolbar setShowEditorToolbar={ setShowEditorToolbar } />
        </div>
    )
}
