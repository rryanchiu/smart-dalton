import './Index.css'
import ConversationList from "./components/ConversationList.tsx";
import Chat from "./components/Chat.tsx";
import SettingPanel from "./components/SettingPanel.tsx";
import {Sider, Content} from './ui'

const Index = () => {
    return (
        // <main className="py-[8vh] max-w-[80ch] mx-auto dark:prose-invert">
        <main className="container">
            <div className='layout'>
                <Sider id="side-l" direction="left" className="hidden md:block">
                    <ConversationList/>
                </Sider>
                <Content className="md:block">
                    <Chat/>
                </Content>
                <Sider id="side-r" direction="right" className="hidden md:block">
                    <SettingPanel/>
                </Sider>
            </div>
        </main>
    )
}

export default Index