import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';

interface ChordEvent {
    id: string;
    chord: string;
    start_time: number;
    duration: number;
    track: number;
}

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        bpm: 120,
        duration: 60,
        key: 'C',
        difficulty: 'beginner',
        is_public: true,
    });

    const [events, setEvents] = useState<ChordEvent[]>([]);

    const addEvent = (): void => {
        const newEvent: ChordEvent = {
            id: `event-${Date.now()}`,
            chord: 'C',
            start_time: 0,
            duration: 2,
            track: 0,
        };
        setEvents([...events, newEvent]);
    };

    const updateEvent = (id: string, field: keyof ChordEvent, value: string | number): void => {
        setEvents(
            events.map((event) =>
                event.id === id ? { ...event, [field]: value } : event
            )
        );
    };

    const removeEvent = (id: string): void => {
        setEvents(events.filter((event) => event.id !== id));
    };

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();

        // Calculate duration from events
        const maxTime = events.reduce((max, event) => {
            const eventEnd = event.start_time + event.duration;

            return Math.max(max, eventEnd);
        }, 0);

        const songData = {
            ...data,
            duration: Math.max(data.duration, maxTime),
            events: events.map((event) => ({
                chord: event.chord,
                start_time: event.start_time,
                duration: event.duration,
                track: event.track,
            })),
        };

        post('/songs', songData, {
            onSuccess: () => {
                router.visit('/songs');
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Create Song" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">Create New Song</h1>
                        <p className="mt-2 text-muted-foreground">
                            Create a custom chord progression for practice
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6 lg:grid-cols-3">
                            {/* Song Details */}
                            <div className="lg:col-span-2 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Song Details</CardTitle>
                                        <CardDescription>
                                            Basic information about your song
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="title">Title *</Label>
                                            <Input
                                                id="title"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                placeholder="My Song"
                                                required
                                            />
                                            {errors.title && (
                                                <p className="mt-1 text-sm text-destructive">{errors.title}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                value={data.description}
                                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                                                placeholder="A beautiful chord progression..."
                                                rows={3}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="bpm">BPM *</Label>
                                                <Input
                                                    id="bpm"
                                                    type="number"
                                                    min="40"
                                                    max="240"
                                                    value={data.bpm}
                                                    onChange={(e) => setData('bpm', parseInt(e.target.value))}
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="key">Key</Label>
                                                <Select value={data.key} onValueChange={(value) => setData('key', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map((key) => (
                                                            <SelectItem key={key} value={key}>
                                                                {key}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="difficulty">Difficulty *</Label>
                                            <Select
                                                value={data.difficulty}
                                                onValueChange={(value) => setData('difficulty', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="beginner">Beginner</SelectItem>
                                                    <SelectItem value="intermediate">Intermediate</SelectItem>
                                                    <SelectItem value="advanced">Advanced</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Chord Events */}
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle>Chord Events</CardTitle>
                                                <CardDescription>
                                                    Add chords and their timing
                                                </CardDescription>
                                            </div>
                                            <Button type="button" onClick={addEvent} size="sm">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Chord
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {events.length === 0 ? (
                                            <div className="py-8 text-center text-muted-foreground">
                                                No chords added yet. Click "Add Chord" to get started.
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {events.map((event) => (
                                                    <div
                                                        key={event.id}
                                                        className="flex items-end gap-4 rounded-lg border p-4"
                                                    >
                                                        <div className="flex-1 grid grid-cols-4 gap-4">
                                                            <div>
                                                                <Label>Chord</Label>
                                                                <Input
                                                                    value={event.chord}
                                                                    onChange={(e) =>
                                                                        updateEvent(event.id, 'chord', e.target.value)
                                                                    }
                                                                    placeholder="C"
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>Start (s)</Label>
                                                                <Input
                                                                    type="number"
                                                                    step="0.1"
                                                                    min="0"
                                                                    value={event.start_time}
                                                                    onChange={(e) =>
                                                                        updateEvent(
                                                                            event.id,
                                                                            'start_time',
                                                                            parseFloat(e.target.value)
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>Duration (s)</Label>
                                                                <Input
                                                                    type="number"
                                                                    step="0.1"
                                                                    min="0.1"
                                                                    value={event.duration}
                                                                    onChange={(e) =>
                                                                        updateEvent(
                                                                            event.id,
                                                                            'duration',
                                                                            parseFloat(e.target.value)
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>Track</Label>
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    max="3"
                                                                    value={event.track}
                                                                    onChange={(e) =>
                                                                        updateEvent(
                                                                            event.id,
                                                                            'track',
                                                                            parseInt(e.target.value)
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon"
                                                            onClick={() => removeEvent(event.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Actions */}
                            <div>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Actions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Button type="submit" className="w-full" disabled={processing}>
                                            <Save className="mr-2 h-4 w-4" />
                                            {processing ? 'Saving...' : 'Save Song'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => router.visit('/songs')}
                                        >
                                            Cancel
                                        </Button>

                                        <div className="pt-4 border-t">
                                            <p className="text-sm text-muted-foreground">
                                                <strong>Total Events:</strong> {events.length}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                <strong>Estimated Duration:</strong>{' '}
                                                {Math.ceil(
                                                    events.reduce(
                                                        (max, e) => Math.max(max, e.start_time + e.duration),
                                                        0
                                                    )
                                                )}
                                                s
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

// Made with Bob
