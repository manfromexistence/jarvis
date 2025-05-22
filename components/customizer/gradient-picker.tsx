"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle, XCircle, Minus, CircleDot } from "lucide-react"; // Updated imports

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { TAILWIND_PALETTE_V4 } from "@/lib/palettes";
import { PREDEFINED_GRADIENTS } from "@/lib/gradient-palettes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider"; // Import Slider
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components
import { Label } from "@/components/ui/label"; // Import Label

interface GradientPickerProps {
    value: string; 
    onValueChange: (value: string) => void;
}

interface ColorStop {
    id: string; // Unique ID for React key
    color: string; // OKLCH color string
    // position?: number; // Optional: for more precise control (0-100)
}

export function GradientPicker({ value, onValueChange }: GradientPickerProps) {
    const [open, setOpen] = React.useState(false);
    // activeTab state removed

    // Determine display value for the trigger button
    const selectedPredefined = PREDEFINED_GRADIENTS.find(g => g.id === value);
    let displayValue = "Custom Gradient";
    let currentGradientCss: string | undefined = value; // Assume value is CSS if not a predefined ID

    if (selectedPredefined) {
        displayValue = selectedPredefined.name;
        currentGradientCss = selectedPredefined.css;
    } else if (!value || (!value.startsWith("linear-gradient") && !value.startsWith("radial-gradient") && !value.startsWith("conic-gradient"))) {
        displayValue = "Select or Create Gradient";
        currentGradientCss = undefined; // No valid gradient selected or being built
    }

    // Custom gradient state
    const initialColorStops: ColorStop[] = [
        { id: `stop-${Date.now()}-1`, color: TAILWIND_PALETTE_V4.blue[500] }, 
        { id: `stop-${Date.now()}-2`, color: TAILWIND_PALETTE_V4.pink[500] },
    ];
    const [colorStops, setColorStops] = React.useState<ColorStop[]>(initialColorStops);
    const [gradientType, setGradientType] = React.useState<"linear" | "radial">("linear");
    const [gradientAngle, setGradientAngle] = React.useState<number>(90);
    
    // Radial gradient specific state
    const [radialShape, setRadialShape] = React.useState<"circle" | "ellipse">("circle");
    const [radialSize, setRadialSize] = React.useState<"farthest-corner" | "farthest-side" | "closest-corner" | "closest-side">("farthest-corner");
    const [radialPositionX, setRadialPositionX] = React.useState<number>(50); // Percentage
    const [radialPositionY, setRadialPositionY] = React.useState<number>(50); // Percentage

    const [editingColorStopId, setEditingColorStopId] = React.useState<string | null>(null);

    // Helper function to find Tailwind color name from OKLCH value
    const getTailwindColorName = (oklchValue: string): string => {
        for (const [colorName, shades] of Object.entries(TAILWIND_PALETTE_V4)) {
            for (const [shade, value] of Object.entries(shades)) {
                if (value === oklchValue) {
                    return `${colorName}-${shade}`;
                }
            }
        }
        return "Custom"; // Fallback if not found (e.g. if user could input arbitrary colors)
    };

    // Generate CSS for the demo div and for applying
    const generateGradientCSS = React.useCallback(() => {
        if (colorStops.length === 0) return "transparent";
        if (colorStops.length === 1) return colorStops[0].color; // Solid color

        const colors = colorStops.map(stop => stop.color).join(", ");
        if (gradientType === "linear") {
            return `linear-gradient(${gradientAngle}deg, ${colors})`;
        }
        if (gradientType === "radial") {
            // More detailed radial gradient
            const position = `at ${radialPositionX}% ${radialPositionY}%`;
            return `radial-gradient(${radialShape} ${radialSize} ${position}, ${colors})`;
        }
        return `linear-gradient(${gradientAngle}deg, ${colors})`; // Fallback
    }, [colorStops, gradientType, gradientAngle, radialShape, radialSize, radialPositionX, radialPositionY]);

    const livePreviewCss = generateGradientCSS();

    const handleApplyCustomGradient = () => {
        const css = generateGradientCSS();
        if (css !== "transparent" && css !== colorStops[0]?.color) { // ensure it's a gradient
             onValueChange(css);
        }
        setOpen(false);
    };

    const addColorStop = () => {
        if (colorStops.length < 5) { // Limit max color stops for simplicity
            const newStop: ColorStop = {
                id: `stop-${Date.now()}-${colorStops.length + 1}`,
                color: TAILWIND_PALETTE_V4.green[500] // Default new color
            };
            setColorStops(prev => [...prev, newStop]);
        }
    };

    const removeColorStop = (idToRemove: string) => {
        if (colorStops.length > 2) { // Keep at least two stops
            setColorStops(prev => prev.filter(stop => stop.id !== idToRemove));
        }
    };

    const updateColorStop = (idToUpdate: string, newColor: string) => {
        setColorStops(prev => prev.map(stop => stop.id === idToUpdate ? { ...stop, color: newColor } : stop));
        setEditingColorStopId(null); // Close palette popover after selection
    };

    // Effect to update custom gradient if already showing custom and colors change
    // This makes the main button preview update live for custom gradients
    React.useEffect(() => {
        if (!selectedPredefined && open) {
            const currentCustomCss = generateGradientCSS();
            if (value !== currentCustomCss && (currentCustomCss.startsWith("linear-gradient") || currentCustomCss.startsWith("radial-gradient"))) {
            }
        }
    }, [colorStops, gradientAngle, gradientType, radialShape, radialSize, radialPositionX, radialPositionY, open, value, selectedPredefined, generateGradientCSS, onValueChange]);

    return (
        <Popover open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            // setActiveTab("custom") removed
            if (!isOpen) setEditingColorStopId(null); // Reset editing state when closing
        }}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                >
                    {/* <span className="truncate flex items-center">
                        {currentGradientCss && (
                            <span
                                className="mr-2 inline-block h-4 w-4 rounded border"
                                style={{ background: currentGradientCss }}
                            />
                        )}
                        {displayValue}
                    </span> */}
                    <ChevronsUpDown className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-4 space-y-3"> {/* Removed p-0, added p-4 and space-y-3 directly */}
                {/* Tabs component removed */}
                {/* Content of former TabsContent value="custom" is now directly here */}
                {/* <div className="text-center mb-2">
                        <h3 className="text-lg font-medium">Create Custom Gradient</h3>
                </div> */}
                {/* Demo Div */}
                <div className="h-24 w-full rounded" style={{ background: livePreviewCss }} />

                <div>
                    <h4 className="mb-1 text-sm font-medium">Color Stops</h4>
                    <div className="space-y-2">
                        {colorStops.map((stop, index) => (
                            <div key={stop.id} className="flex items-center space-x-2">
                                <Popover open={editingColorStopId === stop.id} onOpenChange={(isPopoverOpen) => {
                                    if (!isPopoverOpen) setEditingColorStopId(null);
                                }}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="h-8 w-8 p-0 border-2"
                                            style={{ backgroundColor: stop.color, borderColor: editingColorStopId === stop.id ? 'hsl(var(--primary))' : stop.color }}
                                            onClick={() => setEditingColorStopId(stop.id)}
                                            title="Edit color"
                                        />
                                    </PopoverTrigger>
                                    <PopoverContent className="p-1 w-[280px]">
                                        <ScrollArea className="h-[200px]">
                                        <div className="grid grid-cols-7 gap-1 p-1">
                                            {Object.entries(TAILWIND_PALETTE_V4).flatMap(([colorName, shades]) => {
                                                const allShadeEntries = Object.entries(shades) as [string, string][];

                                                const shadesToRemove = ["50", "100", "200", "300", "950"];
                                                
                                                const filteredShades = allShadeEntries.filter(
                                                    ([shade]) => !shadesToRemove.includes(shade)
                                                );

                                                let shade500Entry: [string, string] | undefined;
                                                const otherShades: [string, string][] = [];

                                                filteredShades.forEach(entry => {
                                                    if (entry[0] === "500") {
                                                        shade500Entry = entry;
                                                    } else {
                                                        otherShades.push(entry);
                                                    }
                                                });

                                                otherShades.sort(([a], [b]) => parseInt(a) - parseInt(b));

                                                const orderedShades: [string, string][] = [];
                                                if (shade500Entry) {
                                                    orderedShades.push(shade500Entry);
                                                }
                                                orderedShades.push(...otherShades);

                                                return orderedShades.map(([shade, oklchValue]) => (
                                                    <Button
                                                        key={`${colorName}-${shade}`}
                                                        variant="outline"
                                                        size="icon"
                                                        className={cn("h-7 w-7 border rounded-full", stop.color === oklchValue && "ring-2 ring-ring ring-offset-2")}
                                                        style={{ backgroundColor: oklchValue }}
                                                        onClick={() => updateColorStop(stop.id, oklchValue)}
                                                        title={`${colorName}-${shade}`}
                                                    />
                                                ));
                                            })}
                                        </div>
                                        </ScrollArea>
                                    </PopoverContent>
                                </Popover>
                                <span className="text-xs text-muted-foreground truncate w-20" title={getTailwindColorName(stop.color)}>
                                    {getTailwindColorName(stop.color)}
                                </span>
                                {colorStops.length > 2 && (
                                    <Button variant="ghost" size="icon" onClick={() => removeColorStop(stop.id)} className="h-6 w-6 ml-auto">
                                        <XCircle className="h-4 w-4 text-destructive" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                    {colorStops.length < 5 && (
                        <Button variant="outline" size="sm" onClick={addColorStop} className="mt-2 w-full">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Color Stop
                        </Button>
                    )}
                </div>

                <div>
                    <h4 className="mb-1 text-sm font-medium">Gradient Type</h4>
                    <div className="flex space-x-2">
                        <Button variant={gradientType === 'linear' ? 'secondary' : 'outline'} onClick={() => setGradientType('linear')} size="icon" title="Linear Gradient">
                            <Minus className="h-5 w-5" />
                        </Button>
                        <Button variant={gradientType === 'radial' ? 'secondary' : 'outline'} onClick={() => setGradientType('radial')} size="icon" title="Radial Gradient">
                            <CircleDot className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {gradientType === 'linear' && (
                    <div>
                        <h4 className="mb-1 text-sm font-medium">Angle</h4>
                        <div className="flex items-center space-x-2">
                            <Slider
                                defaultValue={[gradientAngle]}
                                min={0}
                                max={360}
                                step={1}
                                onValueChange={(value) => setGradientAngle(value[0])}
                                className="w-full accent-primary"
                            />
                            <span className="text-sm w-10 text-right">{gradientAngle}°</span>
                        </div>
                    </div>
                )}
                {gradientType === 'radial' && (
                    <div className="space-y-3">
                        <div>
                            <Label htmlFor="radial-shape" className="mb-1 text-sm font-medium block">Shape</Label>
                            <Select value={radialShape} onValueChange={(val: "circle" | "ellipse") => setRadialShape(val)}>
                                <SelectTrigger id="radial-shape">
                                    <SelectValue placeholder="Select shape" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="circle">Circle</SelectItem>
                                    <SelectItem value="ellipse">Ellipse</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="radial-size" className="mb-1 text-sm font-medium block">Size</Label>
                            <Select value={radialSize} onValueChange={(val: "farthest-corner" | "farthest-side" | "closest-corner" | "closest-side") => setRadialSize(val)}>
                                <SelectTrigger id="radial-size">
                                    <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="farthest-corner">Farthest Corner</SelectItem>
                                    <SelectItem value="farthest-side">Farthest Side</SelectItem>
                                    <SelectItem value="closest-corner">Closest Corner</SelectItem>
                                    <SelectItem value="closest-side">Closest Side</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <h4 className="mb-1 text-sm font-medium">Position X</h4>
                            <div className="flex items-center space-x-2">
                                <Slider
                                    defaultValue={[radialPositionX]}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onValueChange={(val) => setRadialPositionX(val[0])}
                                    className="w-full accent-primary"
                                />
                                <span className="text-sm w-12 text-right">{radialPositionX}%</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="mb-1 text-sm font-medium">Position Y</h4>
                            <div className="flex items-center space-x-2">
                                <Slider
                                    defaultValue={[radialPositionY]}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onValueChange={(val) => setRadialPositionY(val[0])}
                                    className="w-full accent-primary"
                                />
                                <span className="text-sm w-12 text-right">{radialPositionY}%</span>
                            </div>
                        </div>
                    </div>
                )}

                <Button onClick={handleApplyCustomGradient} className="w-full mt-3">
                    Apply Gradient
                </Button>
            </PopoverContent>
        </Popover>
    );
}
