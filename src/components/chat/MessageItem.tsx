import { format } from "date-fns";
import { FileIcon, Trash2, Reply, Download, MoreHorizontal, Ban, ShieldAlert } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Message {
    id: string;
    content: string | null;
    file_url: string | null;
    file_type: string | null;
    file_name: string | null;
    created_at: string;
    user_id: string;
    reply_to_id: string | null;
    is_deleted: boolean;
    profiles: {
        display_name: string | null;
        email: string | null;
        avatar_url: string | null;
        username: string | null;
    };
    reply_to?: {
        profiles: {
            display_name: string | null;
        };
        content: string | null;
    };
}

interface MessageItemProps {
    message: Message;
    onReply: (message: Message) => void;
    onDelete: (id: string) => void;
    onBan?: (userId: string, username: string) => void;
    onRestrict?: (userId: string, username: string) => void;
    isAdmin: boolean;
}

const renderContent = (content: string, isOwn: boolean) => {
    // Regex to match @username (basic alphanumeric + underscore)
    const parts = content.split(/(@[a-zA-Z0-9_]+)/g);

    return parts.map((part, i) => {
        if (part.startsWith('@')) {
            return (
                <span key={i} className={`font-bold ${isOwn ? 'text-indigo-100 bg-indigo-500/30' : 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30'} px-1 py-0.5 rounded mx-0.5`}>
                    {part}
                </span>
            );
        }
        return part;
    });
};

export function MessageItem({ message, onReply, onDelete, onBan, onRestrict, isAdmin }: MessageItemProps) {
    const { user } = useAuth();
    const isOwn = user?.id === message.user_id;

    if (message.is_deleted) {
        return (
            <div className="flex justify-center my-4">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-800">
                    Message deleted
                </span>
            </div>
        );
    }

    return (
        <div
            className={`group flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
        >
            <div className={`flex max-w-[90%] sm:max-w-[80%] md:max-w-[70%] gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>

                {/* Avatar */}
                <Avatar className={`h-8 w-8 mt-auto shrink-0 border-2 border-white dark:border-slate-950 shadow-sm ${isOwn ? 'hidden' : 'block'}`}>
                    <AvatarImage src={message.profiles?.avatar_url || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 text-[10px] font-bold">
                        {(message.profiles?.display_name || message.profiles?.username || '?')[0]?.toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>

                    {/* Metadata (Name) - only for others */}
                    {!isOwn && (
                        <span className="text-[10px] font-bold text-slate-400 mb-1 ml-1">
                            {message.profiles?.display_name || message.profiles?.username || 'Unknown'}
                        </span>
                    )}

                    {/* Bubble */}
                    <div
                        className={`relative px-5 py-3 shadow-sm text-[14px] leading-relaxed break-words overflow-hidden
                ${isOwn
                                ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-2xl rounded-tr-sm'
                                : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl rounded-tl-sm'}
                `}
                    >
                        {/* Reply Context */}
                        {message.reply_to && (
                            <div className={`mb-2 text-xs rounded-lg p-2 flex items-center gap-2 ${isOwn ? 'bg-white/10 text-indigo-50' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}`}>
                                <div className={`w-0.5 h-full self-stretch rounded-full ${isOwn ? 'bg-indigo-300' : 'bg-slate-300'}`} />
                                <div className="flex-1 min-w-0">
                                    <span className="block font-bold text-[10px] opacity-75">{message.reply_to.profiles?.display_name}</span>
                                    <span className="block truncate opacity-90">{message.reply_to.content || 'Attached File'}</span>
                                </div>
                            </div>
                        )}

                        {/* Text */}
                        {message.content && <p className="whitespace-pre-wrap">{renderContent(message.content, isOwn || false)}</p>}

                        {/* Attachments */}
                        {message.file_url && (
                            <div className={`mt-3 ${message.content ? 'pt-3 border-t ' + (isOwn ? 'border-white/10' : 'border-slate-100 dark:border-slate-800') : ''}`}>
                                {message.file_type?.startsWith('image/') ? (
                                    <div className="relative rounded-xl overflow-hidden group/image">
                                        <img
                                            src={message.file_url}
                                            alt="attachment"
                                            className="max-w-full w-full rounded-lg object-cover max-h-[300px]"
                                        />
                                        <a
                                            href={message.file_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors flex items-center justify-center pointer-events-none group-hover/image:pointer-events-auto"
                                        >
                                            <div className="opacity-0 group-hover/image:opacity-100 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm transition-opacity">
                                                View Full
                                            </div>
                                        </a>
                                    </div>
                                ) : (
                                    <a
                                        href={message.file_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isOwn ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100'}`}
                                    >
                                        <div className={`p-2 rounded-lg ${isOwn ? 'bg-indigo-500/20 text-indigo-100' : 'bg-indigo-50 text-indigo-600'}`}>
                                            <FileIcon className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold truncate">{message.file_name || 'Document'}</p>
                                            <p className="text-[10px] opacity-70 uppercase">{message.file_type?.split('/')[1] || 'FILE'} • Download</p>
                                        </div>
                                        <Download className="h-4 w-4 opacity-70" />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer / Actions */}
                    <div className={`flex items-center gap-2 mt-1 px-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="text-[10px] text-slate-300 dark:text-slate-600 font-medium">
                            {format(new Date(message.created_at), "h:mm a")}
                        </span>

                        {/* Actions Dropdown (Only visible on hover) */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-indigo-500">
                                    <MoreHorizontal className="h-4 w-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align={isOwn ? "end" : "start"} className="w-32">
                                <DropdownMenuItem onClick={() => onReply(message)}>
                                    <Reply className="h-3.5 w-3.5 mr-2" /> Reply
                                </DropdownMenuItem>
                                {(isOwn || isAdmin) && (
                                    <DropdownMenuItem onClick={() => onDelete(message.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                        <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                                    </DropdownMenuItem>
                                )}
                                {isAdmin && !isOwn && onBan && onRestrict && (
                                    <>
                                        <DropdownMenuItem
                                            onClick={() => onRestrict(message.user_id, message.profiles?.username || 'user')}
                                            className="text-amber-600 focus:text-amber-600 focus:bg-amber-50"
                                        >
                                            <ShieldAlert className="h-3.5 w-3.5 mr-2" /> Restrict Access
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onBan(message.user_id, message.profiles?.username || 'user')}
                                            className="text-red-700 focus:text-red-700 focus:bg-red-50"
                                        >
                                            <Ban className="h-3.5 w-3.5 mr-2" /> Ban User
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                </div>
            </div>
        </div>
    );
}
