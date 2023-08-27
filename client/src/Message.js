import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism as style } from 'react-syntax-highlighter/dist/esm/styles/prism'
import React from "react";
import "./Message.css"

export default function Message({ role, content }) {
    return <div className={role + "-message message"}>
        <div className="message-text">
            <ReactMarkdown
                components={{
                    "code": ({ inline, children, language }) => {
                        const code = String(children)
                        return inline ? <pre style={{ display: "inline" }}>{code}</pre> : (
                            <SyntaxHighlighter
                                showLineNumbers={true}
                                style={style}
                                customStyle={{ borderRadius: "5px", border: "1px solid lightgray", backgroundColor: "#f4f7f6" }}
                                useInlineStyles={true}
                                language={language}>
                                {code.replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        )
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
        {role.slice(0, 1).toUpperCase() + role.slice(1)}
    </div>
}