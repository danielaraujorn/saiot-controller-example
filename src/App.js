import React, { Component } from "react";
import "./App.css";
import io from "socket.io-client";
import Select from "react-select";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locais: [],
      dispositivos: [],
      socket: io("https://ws.api.saiot.ect.ufrn.br/v1/client"),
      localSelecionado: "",
      dispositivosSelecionado: ""
    };
  }
  componentDidMount() {
    this.state.socket.on("action", this.switch);
    this.emit("/tree/get/levels/user/");
  }
  switch = action => {
    console.log(action);
    switch (action.type) {
      case "getTreeByUser":
        this.setState({ locais: action.data });
        break;
      case "getAllDevicesFromNode":
        this.setState({ dispositivos: action.data });
        break;
      default:
        break;
    }
  };
  emit = (type, data) => this.state.socket.emit("action", { type, data });
  render() {
    return (
      <div style={{ margin: "auto", maxWidth: 500 }}>
        <Select
          onChange={({ value }) => {
            this.emit("/tree/get/device/", { codNode: [value] });
            this.setState({ localSelecionado: value });
          }}
          label="Local"
          options={this.state.locais.map(item => ({
            value: item.codNode,
            label: item.name
          }))}
        />
        {this.state.dispositivos.length > 0 && (
          <Select
            label="Dispositivo"
            onChange={({ value }) => {
              this.setState({ dispositivosSelecionado: value });
            }}
            options={this.state.dispositivos
              .filter(item => item.controllers && item.controllers.length > 0)
              .map(item => ({
                value: item.codDevice,
                label: item.name
              }))}
          />
        )}
      </div>
    );
  }
}

export default App;
