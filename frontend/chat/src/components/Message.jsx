export const Message = ({ messageInfo }) => {
    return (
        <div className="max-w-[70%] break-words">

            <span className="!text-sm text-slate-600">
                {messageInfo.userName}
            </span>

            <div className="!p-2 bg-gray-100 rounded-lg shadow-md text-black">
                {messageInfo.message}
            </div>

        </div>
    );
}
