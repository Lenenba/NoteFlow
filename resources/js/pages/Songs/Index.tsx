import { Head, Link, router } from '@inertiajs/react';
import { Clock, Music, Search, Zap } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';

import type { PaginatedSongs, SongFilters } from '@/types/music';

interface Props {
    songs: PaginatedSongs;
    filters: SongFilters;
}

export default function Index({ songs, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [difficulty, setDifficulty] = useState<string | undefined>(filters.difficulty || undefined);

    const handleFilter = () => {
        router.get('/songs', {
            search: search || undefined,
            difficulty: difficulty && difficulty !== 'all' ? difficulty : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'beginner':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'intermediate':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'advanced':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);

        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <AppLayout>
            <Head title="Songs" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Practice Songs</h1>
                            <p className="mt-2 text-muted-foreground">
                                Choose a song to practice your chord progressions
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/songs/create">Create Song</Link>
                        </Button>
                    </div>

                    {/* Filters */}
                    <Card className="mb-8">
                        <CardContent className="pt-6">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            type="text"
                                            placeholder="Search songs..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <Select value={difficulty || 'all'} onValueChange={(value) => setDifficulty(value === 'all' ? undefined : value)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="All Difficulties" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Difficulties</SelectItem>
                                        <SelectItem value="beginner">Beginner</SelectItem>
                                        <SelectItem value="intermediate">Intermediate</SelectItem>
                                        <SelectItem value="advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleFilter}>Filter</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Songs Grid */}
                    {songs.data.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Music className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-semibold">No songs found</h3>
                                <p className="text-muted-foreground">
                                    Try adjusting your filters or create a new song
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {songs.data.map((song) => (
                                <Card key={song.id} className="flex flex-col">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="line-clamp-1">{song.title}</CardTitle>
                                            <Badge className={getDifficultyColor(song.difficulty)}>
                                                {song.difficulty}
                                            </Badge>
                                        </div>
                                        <CardDescription className="line-clamp-2">
                                            {song.description || 'No description available'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Zap className="h-4 w-4 text-muted-foreground" />
                                                <span>{song.bpm} BPM</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span>{formatDuration(song.duration)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Music className="h-4 w-4 text-muted-foreground" />
                                                <span>{song.total_events} chords</span>
                                            </div>
                                            {song.key && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-muted-foreground">Key:</span>
                                                    <span className="font-medium">{song.key}</span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex gap-2">
                                        <Button asChild className="flex-1" size="sm">
                                            <Link href={`/songs/${song.id}/practice`}>Practice</Link>
                                        </Button>
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/songs/${song.id}`}>Details</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {songs.last_page > 1 && (
                        <div className="mt-8 flex items-center justify-center gap-2">
                            {Array.from({ length: songs.last_page }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={page === songs.current_page ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => router.get(`/songs?page=${page}`)}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

// Made with Bob
