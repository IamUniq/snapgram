import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Eraser, Undo, Trash2 } from "lucide-react"

export default function DrawingCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [color, setColor] = useState("#FFFFFF")
    const [brushSize, setBrushSize] = useState(5)
    const [isEraser, setIsEraser] = useState(false)
    const [history, setHistory] = useState<ImageData[]>([])
    const [historyIndex, setHistoryIndex] = useState(-1)

    const colors = [
        "#FFFFFF", // White
        "#F87171", // Red
        "#FBBF24", // Yellow
        "#34D399", // Green
        "#60A5FA", // Blue
        "#A78BFA", // Purple
        "#000000", // Black
    ]

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Set canvas size to match parent
        const resizeCanvas = () => {
            const parent = canvas.parentElement
            if (parent) {
                canvas.width = parent.clientWidth
                canvas.height = parent.clientHeight

                // Restore drawing after resize
                if (historyIndex >= 0) {
                    ctx.putImageData(history[historyIndex], 0, 0)
                }
            }
        }

        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)

        // Save initial blank canvas
        const initialState = ctx.getImageData(0, 0, canvas.width, canvas.height)
        setHistory([initialState])
        setHistoryIndex(0)

        return () => {
            window.removeEventListener("resize", resizeCanvas)
        }
    }, [])

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        setIsDrawing(true)

        ctx.beginPath()
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.lineWidth = brushSize
        ctx.strokeStyle = isEraser ? "rgba(0,0,0,0)" : color

        if (ctx.globalCompositeOperation) {
            ctx.globalCompositeOperation = isEraser ? "destination-out" : "source-over"
        }

        let x, y

        if ("touches" in e) {
            // Touch event
            const rect = canvas.getBoundingClientRect()
            x = e.touches[0].clientX - rect.left
            y = e.touches[0].clientY - rect.top
        } else {
            // Mouse event
            x = e.nativeEvent.offsetX
            y = e.nativeEvent.offsetY
        }

        ctx.moveTo(x, y)
    }

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let x, y

        if ("touches" in e) {
            // Touch event
            const rect = canvas.getBoundingClientRect()
            x = e.touches[0].clientX - rect.left
            y = e.touches[0].clientY - rect.top
        } else {
            // Mouse event
            x = e.nativeEvent.offsetX
            y = e.nativeEvent.offsetY
        }

        ctx.lineTo(x, y)
        ctx.stroke()
    }

    const endDrawing = () => {
        if (!isDrawing) return
        setIsDrawing(false)

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Save current state to history
        const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height)

        // Remove any "future" history if we drew after undoing
        const newHistory = history.slice(0, historyIndex + 1)
        setHistory([...newHistory, currentState])
        setHistoryIndex(newHistory.length)
    }

    const handleUndo = () => {
        if (historyIndex <= 0) return

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const newIndex = historyIndex - 1
        ctx.putImageData(history[newIndex], 0, 0)
        setHistoryIndex(newIndex)
    }

    const handleClear = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Save cleared state to history
        const clearedState = ctx.getImageData(0, 0, canvas.width, canvas.height)
        setHistory([...history, clearedState])
        setHistoryIndex(history.length)
    }

    return (
        <div className="absolute inset-0 z-10 pointer-events-auto">
            <canvas
                ref={ canvasRef }
                className="touch-none"
                onMouseDown={ startDrawing }
                onMouseMove={ draw }
                onMouseUp={ endDrawing }
                onMouseLeave={ endDrawing }
                onTouchStart={ startDrawing }
                onTouchMove={ draw }
                onTouchEnd={ endDrawing }
            />

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className={ `rounded-full ${isEraser ? "bg-white/20" : ""}` }
                    onClick={ () => setIsEraser(!isEraser) }
                >
                    <Eraser className="h-5 w-5" />
                </Button>

                <Button variant="ghost" size="icon" onClick={ handleUndo } disabled={ historyIndex <= 0 }>
                    <Undo className="h-5 w-5" />
                </Button>

                <Button variant="ghost" size="icon" onClick={ handleClear }>
                    <Trash2 className="h-5 w-5" />
                </Button>

                <div className="h-6 border-l border-white/20 mx-1" />

                { colors.map((c) => (
                    <button
                        key={ c }
                        className={ `w-6 h-6 rounded-full ${color === c ? "ring-2 ring-white" : ""}` }
                        style={ { backgroundColor: c } }
                        onClick={ () => {
                            setColor(c)
                            setIsEraser(false)
                        } }
                    />
                )) }
            </div>
        </div>
    )
}
