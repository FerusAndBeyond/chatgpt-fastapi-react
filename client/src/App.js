import { Component } from "react";
import "./App.css";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from '@mui/icons-material/Close';
import Message from "./Message";

const sendMessage = async (messages) => {
  const response = await fetch("http://localhost:8000/message", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
      },
      body: JSON.stringify(messages.map(({ content, role }) => ({ content, role }))),
  })

  // eslint-disable-next-line no-undef
  const stream = response.body.pipeThrough(new TextDecoderStream()).getReader();

  return stream
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [{
                role: "system",
                content: "You are a super-intelligent AI assistant. Assist the user in any way you can."
            }],
            loading: false,
            userInput: ""
        };

        this.stopFetching = this.stopFetching.bind(this);
        this.handleSendMessage = this.handleSendMessage.bind(this);
    }

    stopFetching() {
        this.stop = true;
    }

    async handleSendMessage() {
        // extract current messages and userInput
        const { messages, userInput } = this.state;

        // ignore if empty input
        if (userInput === "")
            return

        const newMessage = { role: "user", content: userInput };
        // new messages
        const newMessages = [...messages, newMessage]

        // boolean indicator stating whether we should continue
        // or stop loading messages
        this.stop = false

        // add user message, and clear input, also set loading to true
        this.setState({ messages: newMessages, userInput: "", loading: true });

        const stream = await sendMessage(newMessages)
        let response = ""
        let first = true

        while (true) {
            // read from stream
            let { value, done } = await stream.read();

            // add to input
            response += value

            // either if data is finished or if the user has stopped the output
            if (done || this.stop) break;

            // if scrolled down, keep scrolling down to show new content
            const isScrolledToBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 5

            this.setState({
                // set new conversation
                messages: [...newMessages, { role: "assistant", content: response }]
            }, () => {
                // always scroll down on first message
                if (isScrolledToBottom || first) {
                    window.scrollTo({ top: document.body.scrollHeight });
                }
                first = false
            })
        };

        this.setState({ loading: false });
    }

    render() {
        const { messages, userInput, loading } = this.state;
        return (
            <Container maxWidth="md">
                <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <h1>Your Personal AI</h1>
                    <div style={{ flexGrow: 1 }}>
                        {messages.map((message, index) =>
                            <>
                                <Message {...message} />
                                {index === 0 ? <hr /> : null}
                            </>
                        )}
                    </div>
                    <div style={{ display: "flex", marginTop: "2em" }}>
                        <TextField
                            fullWidth
                            value={userInput}
                            multiline
                            maxRows={Infinity}
                            onChange={(e) => this.setState({ userInput: e.target.value })}
                            onKeyDown={(e) => {
                                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                                    this.handleSendMessage();
                                }
                            }}
                            placeholder="Type your message"
                            variant="outlined"
                            className="input-box"
                        />
                        <IconButton color="primary" aria-label="send message" component="span" onClick={loading ? this.stopFetching : this.handleSendMessage}>
                            {!loading ? <SendIcon /> : <CloseIcon />}
                        </IconButton>
                    </div>
                </div>
            </Container >
        );
    }
}

export default App;
