import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageIcon, Trash2, RefreshCw, Clock, HardDrive, AlertCircle, CheckCircle, CheckSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useT } from '@/translations';

interface UploadedImage {
    id: string;
    original_filename: string;
    filename: string;
    path: string;
    file_size: number;
    content_type: string;
    status: string;
    created_at: string;
}

interface RecentUploadsProps {
    golfCourseId: number;
    golfCourseName: string;
    refreshTrigger?: number;
}

export function RecentUploads({ golfCourseId, golfCourseName, refreshTrigger }: RecentUploadsProps) {
    const [uploads, setUploads] = useState<UploadedImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
    const [isBatchDeleting, setIsBatchDeleting] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const t = useT();

    // Dialog State
    const [deleteConfirmInfo, setDeleteConfirmInfo] = useState<{
        isOpen: boolean;
        type: 'single' | 'batch';
        image?: UploadedImage;
    }>({ isOpen: false, type: 'single' });

    const fetchRecentUploads = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

            const { data, error } = await (supabase as any)
                .from('images')
                .select('id, original_filename, filename, path, file_size, content_type, status, created_at')
                .eq('user_id', user.id)
                .eq('golf_course_id', golfCourseId)
                .gte('created_at', twentyFourHoursAgo)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching recent uploads:', error);
                return;
            }

            setUploads(data || []);
            setSelectedIds(new Set());
        } catch (err) {
            console.error('Fetch recent uploads error:', err);
        } finally {
            setIsLoading(false);
        }
    }, [golfCourseId]);

    useEffect(() => {
        fetchRecentUploads();
    }, [fetchRecentUploads, refreshTrigger]);

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const selectAll = () => setSelectedIds(new Set(uploads.map(u => u.id)));
    const deselectAll = () => setSelectedIds(new Set());
    const allSelected = uploads.length > 0 && selectedIds.size === uploads.length;

    const confirmSingleDelete = (e: React.MouseEvent, image: UploadedImage) => {
        e.preventDefault();
        e.stopPropagation();
        setDeleteConfirmInfo({ isOpen: true, type: 'single', image });
    };

    const confirmBatchDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        if (selectedIds.size === 0) return;
        setDeleteConfirmInfo({ isOpen: true, type: 'batch' });
    };

    const executeSingleDelete = async (image: UploadedImage) => {
        setDeletingIds(prev => new Set(prev).add(image.id));
        setStatusMessage(null);

        try {
            const { data, error } = await supabase.functions.invoke('r2-sign', {
                body: { action: 'deleteOwnUpload', key: image.path }
            });

            if (error) throw new Error(error.message || 'Delete failed');
            if (data?.error) throw new Error(data.error);

            setUploads(prev => prev.filter(u => u.id !== image.id));
            setSelectedIds(prev => { const n = new Set(prev); n.delete(image.id); return n; });
            setStatusMessage({ type: 'success', text: t.recentUploads.successDeletedSingle(image.original_filename) });
            setTimeout(() => setStatusMessage(null), 3000);
        } catch (err: any) {
            setStatusMessage({ type: 'error', text: err.message || 'Failed to delete file' });
        } finally {
            setDeletingIds(prev => { const n = new Set(prev); n.delete(image.id); return n; });
        }
    };

    const executeBatchDelete = async () => {
        setIsBatchDeleting(true);
        setStatusMessage(null);

        try {
            const imageIds = Array.from(selectedIds);
            const { data, error } = await supabase.functions.invoke('r2-sign', {
                body: { action: 'deleteBatchOwnUploads', imageIds }
            });

            if (error) throw new Error(error.message || 'Batch delete request failed');
            if (data?.error) throw new Error(data.error);

            const deleted = data?.deleted || 0;
            const skipped = data?.skippedTooOld || 0;

            setUploads(prev => prev.filter(u => !selectedIds.has(u.id)));
            setSelectedIds(new Set());

            let msg = t.recentUploads.successDeletedBatch(deleted, skipped);
            if (data?.partialError) msg += ` ${data.partialError}`;

            setStatusMessage({ type: 'success', text: msg });
            setTimeout(() => setStatusMessage(null), 8000);
        } catch (err: any) {
            setStatusMessage({ type: 'error', text: err.message || 'Batch delete failed' });
        } finally {
            setIsBatchDeleting(false);
        }
    };

    const handleConfirmAction = () => {
        if (deleteConfirmInfo.type === 'single' && deleteConfirmInfo.image) {
            executeSingleDelete(deleteConfirmInfo.image);
        } else if (deleteConfirmInfo.type === 'batch') {
            executeBatchDelete();
        }
        setDeleteConfirmInfo({ isOpen: false, type: 'single' });
    };

    const formatSize = (bytes: number) => {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const diffMs = Date.now() - date.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        const diffHr = Math.floor(diffMin / 60);
        if (diffMin < 1) return t.recentUploads.justNow;
        if (diffMin < 60) return t.recentUploads.minutesAgo(diffMin);
        if (diffHr < 24) return t.recentUploads.hoursAgo(diffHr);
        return date.toLocaleDateString();
    };

    if (uploads.length === 0 && !isLoading && !statusMessage) return null;

    return (
        <>
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                            <ImageIcon className="w-5 h-5 text-primary" />
                            {t.recentUploads.cardTitle}
                            {uploads.length > 0 && (
                                <Badge variant="secondary" className="ml-1 text-xs">
                                    {uploads.length}
                                </Badge>
                            )}
                        </CardTitle>
                        <Button type="button" variant="ghost" size="sm" onClick={fetchRecentUploads} disabled={isLoading}>
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {t.recentUploads.cardSubtitle}
                    </p>
                </CardHeader>

                <CardContent className="space-y-3">
                    {/* Action bar: Select All / Delete Selected */}
                    {!isLoading && uploads.length > 0 && (
                        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/50">
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => { e.preventDefault(); allSelected ? deselectAll() : selectAll(); }}
                                    className="text-xs h-7 px-2"
                                >
                                    <CheckSquare className="w-3.5 h-3.5 mr-1" />
                                    {allSelected ? t.recentUploads.deselectAll : t.recentUploads.selectAll}
                                </Button>
                                {selectedIds.size > 0 && (
                                    <span className="text-xs text-muted-foreground hidden sm:inline">
                                        {t.recentUploads.selectedSummary(
                                            selectedIds.size,
                                            uploads.length,
                                            formatSize(uploads.filter(u => selectedIds.has(u.id)).reduce((s, u) => s + (u.file_size || 0), 0))
                                        )}
                                    </span>
                                )}
                            </div>
                            {selectedIds.size > 0 && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={confirmBatchDelete}
                                    disabled={isBatchDeleting}
                                    className="text-xs h-7 px-3"
                                >
                                    {isBatchDeleting ? (
                                        <><RefreshCw className="w-3.5 h-3.5 mr-1 animate-spin" /> {t.recentUploads.deleting}</>
                                    ) : (
                                        <><Trash2 className="w-3.5 h-3.5 mr-1" /> {t.recentUploads.deleteSelected(selectedIds.size)}</>
                                    )}
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Status Messages */}
                    {statusMessage && (
                        <Alert
                            className={statusMessage.type === 'success' ? 'bg-success-green/10 border-success-green/30' : ''}
                            variant={statusMessage.type === 'error' ? 'destructive' : 'default'}
                        >
                            {statusMessage.type === 'success' ? <CheckCircle className="w-4 h-4 text-success-green" /> : <AlertCircle className="w-4 h-4" />}
                            <AlertDescription className={statusMessage.type === 'success' ? 'text-success-green break-all' : 'break-all'}>
                                {statusMessage.text}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Loading */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-6">
                            <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground mr-2" />
                            <span className="text-sm text-muted-foreground">{t.recentUploads.loading}</span>
                        </div>
                    )}

                    {/* Upload List */}
                    {!isLoading && uploads.length > 0 && (
                        <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
                            {uploads.map((image) => {
                                const isDeleting = deletingIds.has(image.id) || isBatchDeleting;
                                const isSelected = selectedIds.has(image.id);
                                return (
                                    <div
                                        key={image.id}
                                        className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${isDeleting ? 'opacity-50 pointer-events-none' :
                                                isSelected ? 'border-primary/40 bg-primary/5 hover:bg-primary/10' :
                                                    'border-border bg-background/50 hover:bg-muted/50'
                                            }`}
                                        onClick={() => !isDeleting && toggleSelect(image.id)}
                                    >
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => toggleSelect(image.id)}
                                            className="shrink-0"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <div className="p-1.5 rounded-md bg-primary/5 shrink-0">
                                            <ImageIcon className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate" title={image.original_filename}>
                                                {image.original_filename}
                                            </p>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                                <span className="flex items-center gap-1">
                                                    <HardDrive className="w-3 h-3" />
                                                    {formatSize(image.file_size)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {formatTime(image.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => confirmSingleDelete(e, image)}
                                            disabled={isDeleting}
                                            className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-1.5 h-auto"
                                            title={t.recentUploads.deleteTooltip}
                                        >
                                            {deletingIds.has(image.id) ? (
                                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-3.5 h-3.5" />
                                            )}
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Summary footer */}
                    {!isLoading && uploads.length > 0 && (
                        <div className="pt-2 border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground">
                            <span>{t.recentUploads.totalLabel} {formatSize(uploads.reduce((sum, u) => sum + (u.file_size || 0), 0))}</span>
                            <span>{t.recentUploads.last24h}</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            <AlertDialog
                open={deleteConfirmInfo.isOpen}
                onOpenChange={(isOpen) => setDeleteConfirmInfo(prev => ({ ...prev, isOpen }))}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t.recentUploads.dialogTitle}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {deleteConfirmInfo.type === 'single'
                                ? t.recentUploads.dialogDescSingle(deleteConfirmInfo.image?.original_filename ?? '')
                                : t.recentUploads.dialogDescBatch(selectedIds.size)}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t.recentUploads.dialogCancel}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmAction}
                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                        >
                            {t.recentUploads.dialogConfirm}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
