import SettingPanel from "./SettingPanel.tsx";
import Chat from "./Chat.tsx";
import ConversationList from "./ConversationList.tsx";

const MessageBox = () => {
    return (
        <div className="bg-white dark:bg-dark-300  w-full flex  dark:bg-dark-300 m5 rd-3 overflow-hidden">
            <ConversationList/>
            <Chat/>
            <SettingPanel/>
        </div>
    )
}
export default MessageBox