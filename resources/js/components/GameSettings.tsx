/**
 * Game Settings Component - Controls for instrument mode and scroll direction
 */

import { ArrowDown, ArrowRight, Guitar, Music2, Piano } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

import type { GameSettings, InstrumentMode } from '@/types/music';

interface GameSettingsProps {
    settings: GameSettings;
    onSettingsChange: (settings: GameSettings) => void;
    compact?: boolean;
}

const INSTRUMENT_ICONS: Record<InstrumentMode, React.ReactNode> = {
    piano: <Piano className="h-4 w-4" />,
    guitar: <Guitar className="h-4 w-4" />,
    drums: <Music2 className="h-4 w-4" />,
    bass: <Guitar className="h-4 w-4" />,
};

const INSTRUMENT_LABELS: Record<InstrumentMode, string> = {
    piano: 'Piano',
    guitar: 'Guitar',
    drums: 'Drums',
    bass: 'Bass',
};

export default function GameSettingsComponent({ settings, onSettingsChange, compact = false }: GameSettingsProps) {
    const updateSetting = <K extends keyof GameSettings>(key: K, value: GameSettings[K]): void => {
        onSettingsChange({ ...settings, [key]: value });
    };

    if (compact) {
        return (
            <div className="flex flex-wrap items-center gap-4">
                {/* Instrument Mode */}
                <div className="flex items-center gap-2">
                    <Label htmlFor="instrument-mode" className="text-sm">
                        Instrument:
                    </Label>
                    <Select
                        value={settings.instrumentMode}
                        onValueChange={(value) => updateSetting('instrumentMode', value as InstrumentMode)}
                    >
                        <SelectTrigger id="instrument-mode" className="w-[140px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {(Object.keys(INSTRUMENT_LABELS) as InstrumentMode[]).map((mode) => (
                                <SelectItem key={mode} value={mode}>
                                    <div className="flex items-center gap-2">
                                        {INSTRUMENT_ICONS[mode]}
                                        <span>{INSTRUMENT_LABELS[mode]}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Scroll Direction */}
                <div className="flex items-center gap-2">
                    <Label className="text-sm">Direction:</Label>
                    <div className="flex gap-1">
                        <Button
                            variant={settings.scrollDirection === 'vertical' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateSetting('scrollDirection', 'vertical')}
                            className="gap-1"
                        >
                            <ArrowDown className="h-4 w-4" />
                            Vertical
                        </Button>
                        <Button
                            variant={settings.scrollDirection === 'horizontal' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateSetting('scrollDirection', 'horizontal')}
                            className="gap-1"
                        >
                            <ArrowRight className="h-4 w-4" />
                            Horizontal
                        </Button>
                    </div>
                </div>

                {/* Scroll Speed */}
                <div className="flex items-center gap-2">
                    <Label htmlFor="scroll-speed" className="text-sm">
                        Speed:
                    </Label>
                    <div className="flex items-center gap-2">
                        <Slider
                            id="scroll-speed"
                            min={100}
                            max={400}
                            step={50}
                            value={[settings.scrollSpeed]}
                            onValueChange={([value]: number[]) => updateSetting('scrollSpeed', value)}
                            className="w-[120px]"
                        />
                        <span className="text-sm text-muted-foreground w-12">{settings.scrollSpeed}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Game Settings</CardTitle>
                <CardDescription>Customize your practice experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Instrument Mode */}
                <div className="space-y-2">
                    <Label htmlFor="instrument-mode-full">Instrument Mode</Label>
                    <Select
                        value={settings.instrumentMode}
                        onValueChange={(value) => updateSetting('instrumentMode', value as InstrumentMode)}
                    >
                        <SelectTrigger id="instrument-mode-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {(Object.keys(INSTRUMENT_LABELS) as InstrumentMode[]).map((mode) => (
                                <SelectItem key={mode} value={mode}>
                                    <div className="flex items-center gap-2">
                                        {INSTRUMENT_ICONS[mode]}
                                        <span>{INSTRUMENT_LABELS[mode]}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                        Choose your instrument to customize the visual layout
                    </p>
                </div>

                {/* Scroll Direction */}
                <div className="space-y-2">
                    <Label>Scroll Direction</Label>
                    <div className="flex gap-2">
                        <Button
                            variant={settings.scrollDirection === 'vertical' ? 'default' : 'outline'}
                            onClick={() => updateSetting('scrollDirection', 'vertical')}
                            className="flex-1 gap-2"
                        >
                            <ArrowDown className="h-4 w-4" />
                            Vertical (Top to Bottom)
                        </Button>
                        <Button
                            variant={settings.scrollDirection === 'horizontal' ? 'default' : 'outline'}
                            onClick={() => updateSetting('scrollDirection', 'horizontal')}
                            className="flex-1 gap-2"
                        >
                            <ArrowRight className="h-4 w-4" />
                            Horizontal (Left to Right)
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {settings.scrollDirection === 'vertical'
                            ? 'Notes scroll from top to bottom (Guitar Hero style)'
                            : 'Notes scroll from left to right (Piano Roll style)'}
                    </p>
                </div>

                {/* Scroll Speed */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="scroll-speed-full">Scroll Speed</Label>
                        <span className="text-sm text-muted-foreground">{settings.scrollSpeed} px/s</span>
                    </div>
                    <Slider
                        id="scroll-speed-full"
                        min={100}
                        max={400}
                        step={50}
                        value={[settings.scrollSpeed]}
                        onValueChange={([value]: number[]) => updateSetting('scrollSpeed', value)}
                    />
                    <p className="text-sm text-muted-foreground">Adjust how fast notes move across the screen</p>
                </div>

                {/* Display Options */}
                <div className="space-y-4">
                    <Label>Display Options</Label>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="show-notes" className="font-normal">
                                Show Note Names
                            </Label>
                            <p className="text-sm text-muted-foreground">Display chord/note names on blocks</p>
                        </div>
                        <Switch
                            id="show-notes"
                            checked={settings.showNotes}
                            onCheckedChange={(checked: boolean) => updateSetting('showNotes', checked)}
                        />
                    </div>

                    {settings.instrumentMode === 'guitar' && (
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="show-frets" className="font-normal">
                                    Show Fret Numbers
                                </Label>
                                <p className="text-sm text-muted-foreground">Display fret positions for guitar</p>
                            </div>
                            <Switch
                                id="show-frets"
                                checked={settings.showFretNumbers}
                                onCheckedChange={(checked: boolean) => updateSetting('showFretNumbers', checked)}
                            />
                        </div>
                    )}

                    {settings.instrumentMode === 'piano' && (
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="show-keyboard" className="font-normal">
                                    Show Piano Keyboard
                                </Label>
                                <p className="text-sm text-muted-foreground">Display piano keyboard at hit line</p>
                            </div>
                            <Switch
                                id="show-keyboard"
                                checked={settings.showKeyboard}
                                onCheckedChange={(checked: boolean) => updateSetting('showKeyboard', checked)}
                            />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

// Made with Bob
