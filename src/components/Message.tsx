import { Trash, Volume2 } from "lucide-react";

export default function Message({
  role,
  message,
  onDelete,
}: {
  role: "user" | "assistant";
  message: string;
  onDelete: () => void;
}) {
  return (
    <div
      className={`flex flex-col justify-center p-4 rounded-lg my-2 max-w-[75%] ${
        role === "user" ? "bg-blue-500" : "bg-green-500"
      }`}
    >
      <p className="text-white">{message || "..."}</p>

      <div className="flex justify-end items-center mt-2 gap-1">
        <Volume2 className="text-white cursor-pointer" size={16} />
        <Trash
          className="text-white cursor-pointer"
          size={16}
          onClick={onDelete}
        />
      </div>
    </div>
  );
}
