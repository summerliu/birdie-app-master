import React, { Component } from "react";
import "./dropdown.css";
import { DropdownButton } from "react-bootstrap";
import { MenuItem } from "react-bootstrap";
import { Table } from "react-bootstrap";

class Dropdown extends Component {
  constructor() {
    super();
    this.state = {
      dropdowns: [],
      selection: "class of worker",
      lists: []
    };
    this.onChange = this.onChange.bind(this);
  }

  fetchData = () => {
    fetch("/api/rows")
      .then(res => res.json())
      .then(rows => this.setState({ dropdowns: rows }));

    const selection = this.state.selection;
    fetch("/api/update/list")
      .then(res => res.json())
      .then(rows => this.setState({ lists: rows }));

    fetch("/api/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ selection: selection })
    });
  };

  componentDidMount() {
    this.fetchData();
  }

  onChange(event) {
    const selection = event.target.innerHTML;
    this.setState({ selection: selection });
  }

  render() {
    const buttons = this.state.dropdowns;
    const selection = this.state.selection;
    const lists = this.state.lists;
    console.log(selection, lists);

    return (
      <div className="container">
        <div className="dropdown-content">
          <DropdownButton
            bsStyle="primary"
            title={selection}
            id="dropdown-basic-1"
          >
            {buttons.map((button, key) => (
              <MenuItem
                id={key + 1}
                key={key}
                onClick={event => this.onChange(event)}
                onSelect={this.fetchData}
              >
                {button.Field}
              </MenuItem>
            ))}
          </DropdownButton>
        </div>
        <div className="list-content">
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>{selection}</th>
                <th>Count</th>
                <th>Average Age</th>
              </tr>
            </thead>
            <tbody>
              {lists.map((list, key) => (
                <tr key={key}>
                  <td>{key + 1}</td>
                  <td>{list.category}</td>
                  <td>{list.count}</td>
                  <td>{list.average.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default Dropdown;
