## FastAPI server with ChatGPT + ReactJS Frontend

Article about the project can be found [here](https://medium.com/@dreamferus/how-to-setup-chatgpt-in-fastapi-and-display-the-conversation-in-reactjs-5d1ce7c7a288?sk=3f4a2e84fc09deffa08a74df0d1fc407).

#### Installation

###### Install Python dependencies:

```bash
pip install -r requirements.txt
```

###### Install JavaScript dependencies:

First:
```bash
cd client
```

Then:
```bash
npm install
```

#### Run

###### Run the server:

```bash
uvicorn main:app --reload --port 8000
```

###### Run the client:

First:
```bash
cd client
```

Then:
```bash
npm start
```
