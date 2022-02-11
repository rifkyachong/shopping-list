import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./showNotif.css";

const showNotif = (action) => {
  let format;
  switch (action) {
    case "add":
      format = {
        text: "Item has been added",
        status: "success",
        animate: true,
      };
      break;
    case "edit":
      format = {
        text: "",
        status: "success",
        animate: false,
      };
      break;
    case "commit-change":
      format = {
        text: "Item has been edited",
        status: "success",
        animate: true,
      };
      break;
    case "delete":
      format = {
        text: "Item has been deleted",
        status: "success",
        animate: true,
      };
      break;
    case "delete-all":
      format = {
        text: "All item has been deleted",
        status: "success",
        animate: true,
      };
      break;
    case "move":
      format = {
        text: "item has been moved",
        status: "success",
        animate: true,
      };
      break;
    case "should not empty":
      format = {
        text: "input field should not empty",
        status: "warning",
        animate: true,
      };
      break;
    default:
  }
  if (format)
    ReactDOM.render(
      <CustomNotification {...format} />,
      document.getElementById("notif-container")
    );
};

export default showNotif;

const CustomNotification = ({ text, status, animate }) => {
  const notifBox = useRef(null);
  const customize = [
    {
      status: "success",
      themecolor: "lightgreen",
      icon: <i className="fas fa-check-circle"></i>,
    },
    {
      status: "warning",
      themecolor: "#ffcc00",
      icon: <i class="fas fa-exclamation-circle"></i>,
    },
  ];

  useEffect(() => {
    if (animate) {
      notifBox.current.classList.remove("animate");
      notifBox.current.offsetHeight;
      notifBox.current.classList.add("animate");
    }
  });

  return (
    <div
      className="notif-box"
      ref={notifBox}
      style={{
        backgroundColor: customize.find((elem) => elem.status === status)
          .themecolor,
      }}
    >
      <p className="notif-message">{text}</p>
      <div className="notif-icon"></div>
      {customize.find((elem) => elem.status === status).icon}
    </div>
  );
};
