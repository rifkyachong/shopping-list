import React, { useState, useEffect, useRef, useReducer } from "react";
import ControlledInput from "./ControlledInput";
import showNotif from "./showNotif";
import useVerticalDrag from "./useVerticalDrag";
import "./ShoppingListApp.css";

const reducer = (state, action) => {
  let newState;
  switch (action.type) {
    case "add": {
      // process input
      const inputField = action.input.ref;
      const newItem = {
        name: inputField.current.value,
        "time created": Date(),
        "last edited": Date(),
      };
      newState = [...state, newItem];
      // reset input field
      inputField.current.value = "";
      inputField.current.dispatchEvent(
        new window.Event("input", { bubbles: true })
      );
      break;
    }
    case "edit": {
      const { item, input, setOnEdit } = action;
      const inputField = input.ref;
      setOnEdit({ status: true, editedItemKey: item.key });
      inputField.current.value = item.name;
      inputField.current.dispatchEvent(
        new window.Event("input", { bubbles: true })
      );
      newState = state;
      break;
    }
    case "commit-change": {
      const { input, item, setOnEdit } = action;
      const inputList = input.ref;
      newState = state.map((elem, index) => {
        if (index === item.key) {
          return {
            name: inputList.current.value,
            "time created": elem["time created"],
            "last edited": Date(),
          };
        }
        return elem;
      });
      setOnEdit({ type: false, editedItemKey: null });
      break;
    }
    case "delete": {
      newState = state.filter((elem, index) => action.item.key !== index);
      break;
    }
    case "delete-all": {
      newState = [];
      break;
    }
    case "move": {
      const { item } = action;
      const movedItem = state[item.key];
      const tempState = state.filter((elem, index) => item.key !== index);
      newState = tempState
        .slice(0, item.placeAt)
        .concat(movedItem, tempState.slice(item.placeAt));
      break;
    }
    default:
      newState = state;
  }
  showNotif(action.type);
  return newState;
};

const Shoppinglistapp = () => {
  const localData = JSON.parse(localStorage.getItem("shopping-list-data"));
  const initialState = localData ? localData : [];
  const [onEdit, setOnEdit] = useState({ status: false, editedItemKey: null });
  const inputField = useRef(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    localStorage.setItem("shopping-list-data", JSON.stringify(state));
  });

  return (
    <div id="app-container">
      <div id="notif-container"></div>
      <h1 id="title">Grocery Bud</h1>
      <div className="input-group">
        <ControlledInput
          type="text"
          className="form-control"
          placeholder="e.g. egg"
          ref={inputField}
        />
        <button
          className="btn btn-outline-secondary btn-text"
          type="button"
          onClick={
            onEdit.status
              ? () => {
                  dispatch({
                    type: "commit-change",
                    input: { ref: inputField },
                    item: { key: onEdit.editedItemKey },
                    setOnEdit: setOnEdit,
                  });
                }
              : () => {
                  if (inputField.current.value === "") {
                    showNotif("should not empty");
                  } else {
                    dispatch({ type: "add", input: { ref: inputField } });
                  }
                }
          }
        >
          {onEdit.status ? "Edit" : "Submit"}
        </button>
      </div>
      <ul id="shopping-items">
        {state.map((elem, index) => (
          <ShoppingItem
            key={index}
            id={index}
            name={elem.name}
            dispatch={dispatch}
            onEdit={onEdit}
            setOnEdit={setOnEdit}
            inputField={inputField}
          />
        ))}
      </ul>
      <button className="btn btn-outline-danger" id="clear-all-btn">
        Clear All
      </button>
    </div>
  );
};

export default Shoppinglistapp;

const ShoppingItem = function ({
  id,
  name,
  dispatch,
  onEdit,
  setOnEdit,
  inputField,
}) {
  const listItem = useRef(null);
  const [dragElement, cleanDragElement] = useVerticalDrag();

  const moveItem = () => {};

  useEffect(() => {
    listItem.current.itemOrder = id;
    listItem.current.moveItem = (movedItemKey, newPosY) => {
      const items = listItem.current.offsetParent.children;
      let placeAt = 0;
      for (let item of items) {
        if (movedItemKey === item.itemOrder) {
          continue;
        }
        if (newPosY < item.offsetTop) {
          // targetItem = item.itemOrder;
          break;
        }
        placeAt++;
      }
      listItem.current.style.position = "static";
      listItem.current.style.top = "0px";

      dispatch({
        type: "move",
        item: { key: movedItemKey, placeAt: placeAt },
      });
    };

    dragElement(listItem.current);
    return () => {
      cleanDragElement(listItem.current);
    };
  });

  return (
    <li className="shopping-item" ref={listItem}>
      <p className="item-name">{name}</p>
      <button
        className="btn edit-btn"
        onClick={() => {
          dispatch({
            type: "edit",
            item: { key: id, name },
            input: { ref: inputField },
            setOnEdit: setOnEdit,
          });
        }}
        disabled={onEdit.status ? true : false}
      >
        <i className="fas fa-edit"></i>
      </button>
      <button
        className="btn delete-btn"
        onClick={() => {
          dispatch({ type: "delete", item: { key: id } });
        }}
        disabled={onEdit.status ? true : false}
      >
        <i className="fas fa-trash"></i>
      </button>
    </li>
  );
};
