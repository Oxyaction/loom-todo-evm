pragma solidity ^0.4.18;

contract TodoList {

    struct Todo {
        string text;
        bool done;
    }

    mapping(address => Todo[]) todos;

    event Removed(address indexed user, uint id);
    event Done(address indexed user, uint id);
    event Added(address indexed user, uint id);

    function add(string text) public {
        uint id = todos[msg.sender].push(Todo(text, false)) - 1;
        Added(msg.sender, id);
    }

    function remove(uint id) public {
        delete todos[msg.sender][id];
        Removed(msg.sender, id);
    }

    function done(uint id) public {
        todos[msg.sender][id].done = true;
        Done(msg.sender, id);
    }

    function todosCount() public view returns (uint, address) {
        return (todos[msg.sender].length, msg.sender);
    }

    function getTodo(uint id) public view returns (string text, bool done) {
        text = todos[msg.sender][id].text;
        done = todos[msg.sender][id].done;
    }
}
