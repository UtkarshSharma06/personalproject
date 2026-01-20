import { useState, useRef, ChangeEvent } from "react";
import { Send, Paperclip, X, Loader2, FileIcon, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageCropper } from "@/components/ui/ImageCropper";

interface MessageInputProps {
    onSend: (content: string | null, file: File | null) => Promise<void>;
    replyTo: { id: string; user: string; content: string } | null;
    onCancelReply: () => void;
    disabled?: boolean;
}

export function MessageInput({ onSend, replyTo, onCancelReply, disabled }: MessageInputProps) {
    const [content, setContent] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isSending, setIsSending] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Cropper State
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isCropperOpen, setIsCropperOpen] = useState(false);

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = () => {
                    setSelectedImage(reader.result as string);
                    setIsCropperOpen(true);
                };
                reader.readAsDataURL(selectedFile);
            } else {
                setFile(selectedFile);
            }
        }
    };

    const handleCropComplete = (croppedBlob: Blob) => {
        const croppedFile = new File([croppedBlob], "cropped_image.jpg", { type: "image/jpeg" });
        setFile(croppedFile);
        setIsCropperOpen(false);
        setSelectedImage(null);
    };

    const handleSend = async () => {
        if ((!content.trim() && !file) || isSending) return;

        setIsSending(true);
        try {
            await onSend(content.trim() || null, file);
            setContent("");
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="w-full">
            {/* Reply Context */}
            {replyTo && (
                <div className="mx-2 mb-2 p-2 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-indigo-500 shadow-sm flex items-center justify-between animate-in slide-in-from-bottom-2">
                    <div className="flex flex-col text-xs min-w-0 px-2">
                        <span className="font-bold text-indigo-600">{replyTo.user}</span>
                        <span className="truncate text-slate-500">{replyTo.content}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" onClick={onCancelReply}>
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            )}

            {/* File Preview */}
            {file && (
                <div className="mx-2 mb-2 p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                    <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center text-indigo-600">
                        {file.type.startsWith('image/') ? <ImageIcon className="h-5 w-5" /> : <FileIcon className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-slate-700 dark:text-slate-200">{file.name}</p>
                        <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                        onClick={() => {
                            setFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            <div className="flex items-end gap-2 px-2 py-1">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                    accept="image/*,.pdf,.doc,.docx"
                />

                <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-10 w-10 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled || isSending}
                >
                    <Paperclip className="h-5 w-5" />
                </Button>

                <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-white dark:border-slate-800 shadow-sm focus-within:ring-1 focus-within:ring-indigo-500/30 flex items-center min-h-[40px]">
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={file ? "Add a caption..." : "Type a message..."}
                        className="flex-1 min-h-[40px] max-h-32 py-2.5 px-4 resize-none border-0 shadow-none focus-visible:ring-0 bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-[15px] leading-6"
                        disabled={disabled || isSending}
                        rows={1}
                    />
                </div>

                <Button
                    onClick={handleSend}
                    disabled={(!content.trim() && !file) || isSending || disabled}
                    className={`shrink-0 h-10 w-10 rounded-full transition-all duration-200 ${(!content.trim() && !file)
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                        : 'bg-[#00a884] hover:bg-[#008f6f] text-white shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95'}`}
                >
                    {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 ml-0.5" />}
                </Button>
            </div>

            {isCropperOpen && selectedImage && (
                <ImageCropper
                    image={selectedImage}
                    onCropComplete={handleCropComplete}
                    onCancel={() => {
                        setIsCropperOpen(false);
                        setSelectedImage(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                />
            )}
        </div>
    );
}
