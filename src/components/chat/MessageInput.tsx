import { useState, useRef, ChangeEvent } from "react";
import { Send, Paperclip, X, Loader2, FileIcon, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
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
        <div className="p-4 pb-6">
            <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-indigo-500/5 border border-slate-200 dark:border-slate-800 p-2 transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50">

                {/* Reply Context (Floating above) */}
                {replyTo && (
                    <div className="absolute -top-12 left-0 right-0 mx-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl border border-indigo-100 dark:border-indigo-900 shadow-sm p-2 flex items-center justify-between animate-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <div className="w-1 h-8 rounded-full bg-indigo-500 shrink-0" />
                            <div className="flex flex-col text-xs min-w-0">
                                <span className="font-bold text-indigo-600">Replying to {replyTo.user}</span>
                                <span className="truncate text-slate-500">{replyTo.content}</span>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-slate-100" onClick={onCancelReply}>
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                )}

                {/* File Preview (Inset) */}
                {file && (
                    <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-2 mx-1 border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95">
                        <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center text-indigo-600">
                            {file.type.startsWith('image/') ? <ImageIcon className="h-5 w-5" /> : <FileIcon className="h-5 w-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate text-slate-700 dark:text-slate-200">{file.name}</p>
                            <p className="text-[10px] font-medium text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                            onClick={() => {
                                setFile(null);
                                if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                <div className="flex items-end gap-2">
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
                        className="shrink-0 rounded-full h-10 w-10 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled || isSending}
                        title="Attach file"
                    >
                        <Paperclip className="h-5 w-5 rotate-45" />
                    </Button>

                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={file ? "Add a caption..." : "Type a message..."}
                        className="min-h-[44px] max-h-32 py-3 px-2 resize-none border-0 shadow-none focus-visible:ring-0 bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 font-medium"
                        disabled={disabled || isSending}
                        rows={1}
                    />

                    <Button
                        onClick={handleSend}
                        disabled={(!content.trim() && !file) || isSending || disabled}
                        className={`shrink-0 rounded-xl h-10 w-10 shadow-lg transition-all duration-300 ${(!content.trim() && !file)
                            ? 'bg-slate-100 text-slate-300 shadow-none'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95'}`}
                    >
                        {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 ml-0.5" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}
