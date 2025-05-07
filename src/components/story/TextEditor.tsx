import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, Check } from "lucide-react"

interface TextEditorProps {
    onClose: () => void
    onAdd: (text: string, style: Record<string, any>) => void
}

export default function TextEditor({ onClose, onAdd }: TextEditorProps) {
    const [text, setText] = useState("")
    const [style, setStyle] = useState({
        color: "#FFFFFF",
        fontWeight: "normal",
        fontStyle: "normal",
        textAlign: "center",
        backgroundColor: "transparent",
    })

    const colors = [
        "#FFFFFF", // White
        "#F87171", // Red
        "#FBBF24", // Yellow
        "#34D399", // Green
        "#60A5FA", // Blue
        "#A78BFA", // Purple
        "#000000", // Black
    ]

    const toggleStyle = (property: string, value: string) => {
        setStyle((prev) => ({
            ...prev,
            [property]: prev[property] === value ? "normal" : value,
        }))
    }

    const setTextAlign = (value: string) => {
        setStyle((prev) => ({
            ...prev,
            textAlign: value,
        }))
    }

    const setTextColor = (color: string) => {
        setStyle((prev) => ({
            ...prev,
            color,
        }))
    }

    const handleSubmit = () => {
        if (text.trim()) {
            onAdd(text, style)
        } else {
            onClose()
        }
    }

    return (
        <div className="absolute inset-0 bg-black/90 flex flex-col p-4 z-10 h-[68vh]">
            <div className="flex-1 flex flex-col">
                <div className="mb-4 flex justify-between items-center">
                    <Button variant="ghost" size="sm" onClick={ onClose }>
                        Cancel
                    </Button>
                    <Button variant="ghost" size="sm" onClick={ handleSubmit }>
                        <Check className="h-5 w-5 mr-1" />
                        Done
                    </Button>
                </div>

                <div className="flex-1 flex items-center justify-center">
                    <Textarea
                        value={ text }
                        onChange={ (e) => setText(e.target.value) }
                        placeholder="Type your story..."
                        className="w-full h-32 text-xl bg-transparent border-none resize-none text-center focus-visible:ring-0 focus-visible:ring-offset-0"
                        style={ {
                            color: style.color,
                            fontWeight: style.fontWeight,
                            fontStyle: style.fontStyle,
                            textAlign: style.textAlign as any,
                        } }
                        autoFocus
                    />
                </div>
            </div>

            <div className="mt-4">
                <div className="flex justify-center space-x-2 mb-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={ () => toggleStyle("fontWeight", "bold") }
                        className={ style.fontWeight === "bold" ? "bg-white/20" : "" }
                    >
                        <Bold className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={ () => toggleStyle("fontStyle", "italic") }
                        className={ style.fontStyle === "italic" ? "bg-white/20" : "" }
                    >
                        <Italic className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={ () => setTextAlign("left") }
                        className={ style.textAlign === "left" ? "bg-white/20" : "" }
                    >
                        <AlignLeft className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={ () => setTextAlign("center") }
                        className={ style.textAlign === "center" ? "bg-white/20" : "" }
                    >
                        <AlignCenter className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={ () => setTextAlign("right") }
                        className={ style.textAlign === "right" ? "bg-white/20" : "" }
                    >
                        <AlignRight className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex justify-center space-x-2">
                    { colors.map((color) => (
                        <button
                            key={ color }
                            className={ `w-8 h-8 rounded-full ${style.color === color ? "ring-2 ring-white" : ""}` }
                            style={ { backgroundColor: color } }
                            onClick={ () => setTextColor(color) }
                        />
                    )) }
                </div>
            </div>
        </div>
    )
}
