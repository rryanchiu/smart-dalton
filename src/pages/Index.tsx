import './Index.css'
import ConversationList from "./components/ConversationList.tsx";
import Chat from "./components/Chat.tsx";
import SettingPanel from "./components/SettingPanel.tsx";
import {Content, Sider} from './ui'

const Index = () => {
    return (
        <main id='container' className="container h-full w-screen flex fullscreen ">
            <div id='layout' className='layout fullscreenlayhout'>
                <Sider id='side-l' direction={'left'}>
                    <ConversationList/>
                </Sider>
                <Content className="overflow-hidden">
                    <Chat/>
                </Content>
                <Sider id='side-r' direction={'right'}>
                    <SettingPanel/>
                </Sider>
            </div>
        </main>
    )
}

export default Index