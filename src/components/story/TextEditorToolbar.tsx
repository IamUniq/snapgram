import { Button } from "@/components/ui/button"
import { StoryText, useStory } from "@/context/StoryContext"
import { AlignCenter, AlignLeft, AlignRight, ArrowDown, ArrowUp, Bold, Italic, X } from "lucide-react"

type TextEditorToolbarProps = {
    setShowEditorToolbar: React.Dispatch<React.SetStateAction<boolean>>
}

const TextEditorToolbar = ({ setShowEditorToolbar }: TextEditorToolbarProps) => {
    const { text: { style }, setText } = useStory()

    const colors = [
        "#FFFFFF", // White
        "#F87171", // Red
        "#FBBF24", // Yellow
        "#34D399", // Green
        "#60A5FA", // Blue
        "#A78BFA", // Purple
        "#000000", // Black
    ]

    const toggleStyle = (property: keyof StoryText["style"], value: string) => {
        setText(prev => ({
            ...prev,
            style: {
                ...prev.style,
                [property]: prev.style[property] === value ? "normal" : value,
            }
        }));
    };


    const setStyle = (property: keyof StoryText['style'], value: string) => {
        setText((prev) => ({
            ...prev,
            style: {
                ...prev.style,
                [property]: value
            },
        }))
    }

    const increaseFontSize = () => {
        if (style.fontSize === 32) {
            return;
        } else if (style.fontSize < 32) {
            setText(prev => ({
                ...prev,
                style: {
                    ...prev.style,
                    fontSize: prev.style.fontSize + 2,
                    lineHeight: prev.style.lineHeight + 0.05
                }
            }))
        }
    }

    const decreaseFontSize = () => {
        if (style.fontSize === 12) {
            return;
        } else if (style.fontSize > 12) {
            setText(prev => ({
                ...prev,
                style: {
                    ...prev.style,
                    fontSize: prev.style.fontSize - 2,
                    lineHeight: prev.style.lineHeight - 0.05
                }
            }))
        }
    }

    return (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex-center flex-col mx-auto w-[26rem] h-fit bg-dark-3 border-2 border-light-1/80 backdrop-blur-sm z-10 py-3 rounded-3xl">
            <div className="flex-center space-x-2 mb-4">
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
                    onClick={ () => setStyle("textAlign", "left") }
                    className={ style.textAlign === "left" ? "bg-white/20" : "" }
                >
                    <AlignLeft className="h-5 w-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={ () => setStyle("textAlign", "center") }
                    className={ style.textAlign === "center" ? "bg-white/20" : "" }
                >
                    <AlignCenter className="h-5 w-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={ () => setStyle("textAlign", "right") }
                    className={ style.textAlign === "right" ? "bg-white/20" : "" }
                >
                    <AlignRight className="h-5 w-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={ increaseFontSize }
                    className={ style.textAlign === "right" ? "bg-white/20" : "flex gap-0" }
                >
                    <span className="text-sm">A</span>
                    <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={ decreaseFontSize }
                    className={ style.textAlign === "right" ? "bg-white/20" : "flex gap-0" }
                >
                    <span className="text-sm">A</span>
                    <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={ () => setShowEditorToolbar(false) }
                    className="p-2"
                >
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <div className="flex justify-center space-x-2">
                { colors.map((color) => (
                    <button
                        key={ color }
                        className={ `w-8 h-8 rounded-full ${style.color === color ? "ring-2 ring-white" : ""}` }
                        style={ { backgroundColor: color } }
                        onClick={ () => setStyle("color", color) }
                    />
                )) }
            </div>
        </div>
    )
}

export default TextEditorToolbar