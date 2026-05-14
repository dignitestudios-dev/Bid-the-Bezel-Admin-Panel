"use client";

import React, { useEffect, useRef, useState } from "react";
import { Clock, File, FileText, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import {
  useGetChatMessages,
  useGetChatRooms,
  useSendMessages,
  useSendMessagesMedia,
} from "@/app/feature/chat/hooks";

import createSocket from "@/app/sockets";
import { formatTime } from "@/lib/utils/date.utils";
import { getUser } from "@/lib/cookies";

const Chats = () => {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const messagesRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const adminData = getUser();
  const sellerId = searchParams.get("sellerId");
  const buyerId = searchParams.get("buyerId");
  const productId = searchParams.get("productId");
  const ADMIN_ID = adminData?.id;
  const [messages, setMessages] = useState<any[]>([]);

  /* ---------------- ROOM ---------------- */

  const { data: roomData } = useGetChatRooms({
    recipientIds: [sellerId, buyerId].filter(Boolean) as string[],
    contextType: "Product",
    contextId: productId || undefined,
  });

  const room = roomData?.data;
  console.log(room, "room");
  const filteredParticipants =
    room?.participants?.filter((p: any) => p?.user?._id !== ADMIN_ID) || [];

  /* ---------------- MESSAGES ---------------- */

  const { data: messagesData, isLoading } = useGetChatMessages(room?._id);

  useEffect(() => {
    if (messagesData?.data) {
      setMessages(messagesData.data);
    }
  }, [messagesData]);

  /* ---------------- SOCKET ---------------- */

  const { socket, connect } = createSocket();

  useEffect(() => {
    connect();

    // if (!selectedChat) return;

    const handleNewMessage = (incomingMsg: any) => {
      console.log(incomingMsg, "new_message");
      queryClient.invalidateQueries({
        queryKey: ["get-chat-rooms"],
      });

      queryClient.invalidateQueries({
        queryKey: ["get-chat-messages"],
      });

      setMessages((prev: any[]) => {
        const tempMessageExists = prev.find(
          (msg) => msg.tempId === incomingMsg.tempId,
        );

        if (tempMessageExists) {
          return prev.map((msg) =>
            msg.tempId === incomingMsg.tempId
              ? {
                  ...incomingMsg,
                  status: "sent",
                }
              : msg,
          );
        }

        const alreadyExists = prev.some((msg) => msg._id === incomingMsg._id);

        if (alreadyExists) return prev;

        return [...prev, incomingMsg];
      });
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, []);

  /* ---------------- AUTO SCROLL ---------------- */

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  /* ---------------- SEND ---------------- */

  const { mutateAsync: sendMessage } = useSendMessages(room?._id || "");

  const { mutateAsync: sendMedia } = useSendMessagesMedia(room?._id || "");

  const handleSend = async () => {
    if (!message.trim() && files.length === 0) return;

    const tempId = `temp_${Date.now()}`;

    const currentMessage = message;
    const currentFiles = files;

    setMessage("");
    setFiles([]);

    const optimisticMsg = {
      _id: tempId,
      tempId,
      text: currentMessage,
      attachments: currentFiles.map((f: any) => ({
        name: f.name,
        type: f.type,
        url: URL.createObjectURL(f),
      })),

      createdAt: new Date().toISOString(),
      status: "sending",
      sender: {
        _id: ADMIN_ID,
        profilePicture: {
          location: "https://placehold.co/600x400",
        },
      },
    };

    setMessages((prev: any) => [...prev, optimisticMsg]);

    try {
      if (currentFiles.length > 0) {
        const formData = new FormData();

        currentFiles.forEach((file) => {
          formData.append("files", file);
        });

        if (currentMessage.trim()) {
          formData.append("text", currentMessage);
        }

        formData.append("tempId", tempId);

        await sendMedia(formData);
        return;
      }

      await sendMessage({
        text: currentMessage,
        tempId,
      });
    } catch {
      setMessages((prev: any) =>
        prev.map((m: any) =>
          m._id === tempId ? { ...m, status: "failed" } : m,
        ),
      );
    }
  };

  useEffect(() => {
    setMessages(messagesData?.data || []);
  }, [messagesData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);

    setFiles((prev) => [...prev, ...selected]);

    e.target.value = "";
  };

  return (
    <div className="h-[calc(100vh-80px)] rounded-2xl border bg-white flex flex-col min-h-0">
      {/* HEADER */}
      <div className="border-b p-4 flex items-center gap-3">
        <div className="relative h-12 w-20">
          {filteredParticipants?.slice(0, 3).map((item: any, index: number) => (
            <img
              key={item._id}
              src={
                item?.user?.profilePicture?.location || "/default-avatar.png"
              }
              className="absolute top-0 h-12 w-12 rounded-full border-2 border-white object-cover"
              style={{
                left: `${index * 20}px`,
                zIndex: index + 1,
              }}
            />
          ))}
        </div>

        <div>
          <h2 className="text-sm font-semibold">Seller & Buyer Chat</h2>

          <p className="text-xs text-muted-foreground">
            {filteredParticipants
              ?.map((p: any) => p?.user?.userName || "User")
              .join(", ")}
          </p>
        </div>
      </div>

      {/* MESSAGES */}
      <div
        ref={messagesRef}
        className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4"
      >
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl bg-gray-200" />
          ))
        ) : messages?.length === 0 ? (
          <div className="text-center text-sm text-gray-500 mt-10">
            No messages yet
          </div>
        ) : (
          messages?.map((item: any) => {
            const isMine = item?.sender?._id === ADMIN_ID;
            const media = item.attachments || [];

            return (
              <div
                key={item._id}
                className={`flex  items-end gap-2 mb-3 ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                {/* LEFT AVATAR (others) */}
                {!isMine && (
                  <img
                    src={item?.sender?.profilePicture?.location}
                    className="h-7 w-7 rounded-full object-cover border border-white shadow"
                  />
                )}

                {/* MESSAGE BUBBLE */}
                <div
                  className={`relative max-w-[75%] rounded-2xl px-4 py-3 shadow-sm
        ${
          isMine
            ? "bg-gray-100 text-gray-800 border border-gray-200 rounded-br-md"
            : "bg-white border border-gray-200 text-gray-900 rounded-bl-md"
        }`}
                >
                  {item?.text && (
                    <p className="rounded-xl rounded-bl-none max-w-md break-all ">
                      {item.text}
                    </p>
                  )}

                  {/* MEDIA */}
                  {media?.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {media.map((file: any, index: number) => {
                        const url = file.url || file.location;

                        const mime = file.mimeType || file.type || "";

                        const isImage = mime.startsWith("image/");
                        const isVideo = mime.startsWith("video/");
                        const isAudio = mime.startsWith("audio/");
                        const isDoc = !isImage && !isVideo && !isAudio;

                        return (
                          <div key={index}>
                            {isImage && (
                              <img
                                src={url}
                                alt="media"
                                className="w-55 h-50 object-cover rounded-lg border"
                              />
                            )}

                            {isVideo && (
                              <video
                                src={url}
                                controls
                                className="w-55 h-50 rounded-lg border"
                              />
                            )}

                            {isDoc && (
                              <a
                                href={url}
                                target="_blank"
                                className="flex items-center gap-2 p-3 bg-white border rounded-lg shadow-sm hover:bg-gray-50"
                              >
                                <FileText className="w-5 h-5 text-red-500" />
                                <span className="text-sm  text-black font-medium">
                                  {file.name || "PDF File"}
                                </span>
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* TIME */}
                  <span
                    className={`text-xs block mt-1 ${
                      isMine ? "text-gray-400 text-right" : "text-gray-500"
                    }`}
                  >
                    <div className="flex items-center justify-end gap-1 mt-1 ">
                      {item.status === "sending" ? (
                        <div className="flex items-center gap-1 text-gray-400">
                          <Clock className="w-3 h-3 animate-pulse " />
                          <span className=" text-xs">Sending...</span>
                        </div>
                      ) : item.status === "failed" ? (
                        <div className="flex items-center gap-1 text-red-400">
                          <X className="w-3 h-3" />
                          <span className="text-xs">Failed</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">
                          {formatTime(item.createdAt)}
                        </span>
                      )}
                    </div>
                  </span>
                </div>

                {/* RIGHT AVATAR (mine) */}
                {isMine && (
                  <div className="h-7 w-7 rounded-full text-center bg-black text-white object-cover border border-white shadow">
                    {adminData?.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* FILE PREVIEW */}
      {files?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {files?.map((file: File, index) => {
            const url = URL.createObjectURL(file);
            const type = file.type;

            const isImage = type.startsWith("image/");
            const isVideo = type.startsWith("video/");
            const isAudio = type.startsWith("audio/");
            const isDoc = !isImage && !isVideo && !isAudio;

            return (
              <div
                key={index}
                className="relative p-2 bg-gray-100 rounded-lg flex items-center gap-2"
              >
                {/* IMAGE */}
                {isImage && (
                  <img
                    src={url}
                    className="w-50 h-37.5 rounded object-cover border"
                  />
                )}

                {/* VIDEO */}
                {isVideo && (
                  <video
                    src={url}
                    className="w-50 h-37.5 rounded border"
                    controls
                  />
                )}

                {isDoc && (
                  <div className="px-2 py-1 rounded flex items-center text-xs bg-gray-200 ">
                    <a
                      href={url}
                      target="_blank"
                      className="flex items-center gap-2 p-3 bg-white border rounded-lg shadow-sm hover:bg-gray-50"
                    >
                      <FileText className="w-5 h-5 text-red-500" />
                      <span className="text-sm font-medium">
                        {file.name || "PDF File"}
                      </span>
                    </a>
                  </div>
                )}

                <button
                  onClick={() => {
                    setFiles((prev) => prev.filter((_, i) => i !== index));
                  }}
                  className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* INPUT */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-xl border px-3">
          <input
            type="file"
            multiple
            id="chat-file"
            className="hidden"
            onChange={handleFileChange}
          />

          <label htmlFor="chat-file" className="cursor-pointer">
            <File className="w-5 h-5" />
          </label>

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 py-4 text-sm outline-none"
          />

          <button
            onClick={handleSend}
            disabled={!message.trim() && files.length === 0}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-black text-white disabled:bg-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                d="M22 2L11 13"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 2L15 22l-4-9-9-4 19-7z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chats;
