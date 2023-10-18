import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm'
// import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import SyntaxHighlighter from 'react-syntax-highlighter';

// import {default as codeTheme} from 'react-syntax-highlighter/dist/esm/styles/hljs/hybrid';
import {default as codeTheme} from 'react-syntax-highlighter/dist/esm/styles/hljs/gml';
// import {default as codeTheme} from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';
// import {default as codeTheme} from 'react-syntax-highlighter/dist/esm/styles/hljs/androidstudio';
import "katex/dist/katex.min.css"

interface MarkdownProps {
    markdown?: string
}

const Markdown = (props: MarkdownProps) => {

    return (
        <ReactMarkdown
            remarkPlugins={[gfm]}
            components={{
                code(props) {
                    const {children, className, node, ...rest} = props
                    const match = /language-(\w+)/.exec(className || '')
                    return match ? (
                        //@ts-ignore
                        <SyntaxHighlighter
                            {...rest}
                            children={String(children).replace(/\n$/, '')}
                            style={codeTheme}
                            language={match[1]}
                            PreTag="pre"
                        />
                    ) : (
                        <code {...rest} className={className + ''}>
                            {children}
                        </code>
                    )
                },
                pre: (e) => {
                    return (<pre>{e.children}</pre>)
                },
                p: (pProps) => <p style={{whiteSpace:'pre-wrap'}} className={'line-height-[1.5] overflow-hidden dark:color-gray-3'} {...pProps} dir="auto"/>,
                a: (aProps) => {
                    const href = aProps.href || "";
                    const isInternal = /^\/#/i.test(href);
                    const target = isInternal ? "_self" : aProps.target ?? "_blank";
                    return <a {...aProps} target={target}/>;
                },
            }}
        >
            {props.markdown || ''}
        </ReactMarkdown>
    )
}

export default Markdown;