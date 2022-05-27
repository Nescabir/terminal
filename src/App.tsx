import { useState, useRef, ReactNode } from "react";
import "./App.scss";

type cmd = {
  alias?: string[];
  desc: string;
};

function App() {
  const inputElement = useRef<HTMLInputElement>(null!);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<ReactNode[]>([]);
  const [commands, setCommands] = useState<string[]>([]);
  const commandsList = new Map<string, cmd>([
    [
      "help",
      {
        alias: ["?", "cmd"],
        desc: "This prompt",
      },
    ],
    [
      "about",
      {
        desc: "About me",
      },
    ],
    [
      "skills",
      {
        desc: "My skills",
      },
    ],
    [
      "experiences",
      {
        alias: ["xp"],
        desc: "My experiences",
      },
    ],
    [
      "projects",
      {
        desc: "My projects",
      },
    ],
    [
      "socials",
      {
        desc: "My socials",
      },
    ],
    [
      "history",
      {
        alias: ["hist"],
        desc: "Commands history",
      },
    ],
    [
      "clearhistory",
      {
        alias: ["clearhist"],
        desc: "Clear the commands history",
      },
    ],
    [
      "clear",
      {
        alias: ["cls"],
        desc: "Clear the terminal",
      },
    ],
  ]);

  const Help = (cmd: string) => {
    const msg = (
      <>
        <div className="helpcmd header">
          <span className="cmd">Command</span>
          <span>Aliases</span>
          <span>Description</span>
        </div>
        {[...commandsList.entries()].map((value, index) => {
          const [cmdName, details] = value;
          return (
            <div className="helpcmd" key={`cmd${index}`}>
              <span className="cmd">{cmdName}</span>
              <span>{details.alias ? details.alias.join(" ") : ""}</span>
              <span>{details.desc}</span>
            </div>
          );
        })}
      </>
    );
    sendToScreen(cmd, msg);
  };

  const History = (cmd: string) => {
    const _commands = commands.filter((c) => c !== "");
    const msg = _commands.map((cmd, index) => (
      <div key={`history${index}`}>
        {cmd}
        <br />
      </div>
    ));
    sendToScreen(cmd, msg);
  };

  const Clear = () => {
    setOutput([]);
  };

  const ClearHistory = () => {
    setCommands([]);
    sendToScreen("");
  };

  const submit = async () => {
    const _commands = commands;
    _commands.push(input);
    setCommands(_commands);
    await command(input);
    inputElement.current.value = "";
    setInput("");
    focus();
  };

  const focus = () => {
    inputElement.current.focus();
  };

  const sendToScreen = (
    command: string,
    data?: any,
    level = 0,
    multiline = true
  ) => {
    const _output = output;
    const msg = (
      <div className={["inner", multiline ? "multiline" : ""].join(" ")}>
        <div className="prompt">
          <div className="hostname">guest@term.blgn.dev ~ $</div>
          <span>{command}</span>
        </div>
        {data && <span className={`level-${level}`}>{data}</span>}
      </div>
    );
    _output.unshift(msg);
    setOutput(output);
  };

  const command = async (cmd: string) => {
    switch (cmd.toLowerCase()) {
      case "":
        sendToScreen("");
        break;

      case "help":
      case "cmd":
      case "?":
        Help(cmd);
        break;

      case "hist":
      case "history":
        History(cmd);
        break;

      case "clearhist":
      case "clearhistory":
        ClearHistory();
        break;

      case "cls":
      case "clear":
        Clear();
        break;

      default:
        sendToScreen(cmd, `-bash: ${cmd}: command not found`, 2);
        break;
    }
  };

  return (
    <div className="App" onClick={focus}>
      <div className="terminal">
        <div className="display">
          {output.map((msg, index) => {
            return (
              <div className="command" key={`command${index}`}>
                {msg}
              </div>
            );
          })}
        </div>
        <div className="prompt">
          <div className="hostname">guest@term.blgn.dev ~ $</div>
          <form action="#" onSubmit={submit}>
            <input
              type="text"
              className="input"
              autoFocus
              onChange={(e) => setInput(e.target.value)}
              ref={inputElement}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
