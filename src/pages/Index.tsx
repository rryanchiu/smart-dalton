import './Index.css'
import ConversationList from "./components/ConversationList.tsx";
import Chat from "./components/Chat.tsx";
import SettingPanel from "./components/SettingPanel.tsx";
import {Content, Sider} from './ui'

const Index = () => {
    return (
        <main id='container' className="container h-full w-screen flex  ">
            <div id='layout' className='layout'>
                <Sider direction={'left'}>
                    <ConversationList/>
                </Sider>
                <Content className="overflow-hidden">
                    <Chat/>
                </Content>
                <Sider direction={'right'}>
                    <SettingPanel/>
                </Sider>
            </div>
        </main>
    )
}

export default Index