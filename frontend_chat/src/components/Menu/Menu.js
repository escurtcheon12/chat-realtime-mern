import React, { useEffect, useState } from "react";
import "../../assets/css/menu.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import EmojiPicker, {
  EmojiStyle,
  SkinTones,
  Theme,
  Categories,
  EmojiClickData,
  Emoji,
  SuggestionMode,
  SkinTonePickerLocation,
} from "emoji-picker-react";

const Menu = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [message, setMessage] = useState("");
  const [targetDataUser, setTargetDataUser] = useState({});
  const [room, setRoom] = useState(Math.floor(Math.random() * 90000) + 10000);
  const [statusSend, setStatusSend] = useState(false);
  const [dataUserStatus, setDataUserStatus] = useState([]);
  const [dataUser, setDataUser] = useState([]);

  useEffect(() => {
    if (
      localStorage.getItem("user_id") == "" ||
      localStorage.getItem("user_id") == null
    ) {
      navigate("/login");
    }

    (async () => {
      try {
        const data_user = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL_PORT}/web/user`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        );

        setDataUser(data_user.data.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [dataUserStatus, targetDataUser]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id);
    });

    socket.emit("data_users_online", {
      _id: localStorage.getItem("user_id"),
      username: localStorage.getItem("username"),
    });

    const eventListener = (data) => {
      setDataUserStatus(data);
    };

    socket.on("data_users", eventListener);

    socket.on("message", (data) => {
      setData((previous) => [...previous, { ...data, createdAt: new Date() }]);
    });

    return () => {
      socket.off("data_users", eventListener);
      socket.off("message");
    };
  }, [socket]);

  const onClick = (emojiData, event) => {
    setMessage(
      (inputValue) =>
        inputValue + (emojiData.isCustom ? emojiData.unified : emojiData.emoji)
    );
    setSelectedEmoji(emojiData.unified);
  };

  const handleSend = async () => {
    try {
      const data_user = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL_PORT}/web/message/create`,
        {
          recipient_user_id: targetDataUser._id,
          message: message,
          room_chat_number: room,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );

      if (data_user.data.status === "success" && message) {
        socket.emit("message", {
          message,
          room,
          username: localStorage.getItem("username"),
          user_id: localStorage.getItem("user_id"),
        });

        setStatusSend(!statusSend);
        setMessage("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleStartChat = async (id) => {
    try {
      const data = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL_PORT}/web/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );

      const result = await axios.get(
        `${
          process.env.REACT_APP_BACKEND_URL_PORT
        }/web/message?recipient_user_id=${id}&user_id=${localStorage.getItem(
          "user_id"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );

      setData(result.data.data);

      let room_data_user = 0;
      const [first_result_index] = result.data.data;
      if (result.data.data.length > 0) {
        room_data_user = first_result_index.room_chat_number;
      } else {
        room_data_user = 0;
      }

      socket.emit("join", room_data_user ? room_data_user : room);
      setRoom((value) => (room_data_user ? room_data_user : value));

      setTargetDataUser(data.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
    await axios.post(
      `${process.env.REACT_APP_BACKEND_URL_PORT}/web/user/update`,
      {
        user_id: localStorage.getItem("user_id"),
        username: localStorage.getItem("username"),
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      }
    );

    socket.emit("data_users_offline");
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <div className="d-flex justify-content-between w-100 p-2 navbar">
        <h3>MyChat</h3>
        <button onClick={handleLogout} className="btn">
          <FontAwesomeIcon
            icon={faRightFromBracket}
            className="text-white mr-4 ml-2"
          />
        </button>
      </div>

      <div className="container pb-4">
        <div className="row row-chat">
          <div className="left-container col-sm-4 mt-3">
            <div className="h-100">
              <div className="h-50 online-board overflow-auto bg-white">
                <div className="p-3 online-bar-board">
                  <h3 className="fw-bold">Online</h3>
                </div>
                <div className="p-2 mt-1">
                  {(dataUserStatus || []).map((item) => {
                    if (
                      item.username !== localStorage.getItem("username") &&
                      item.status === "Online"
                    )
                      return (
                        <>
                          <button
                            className="btn card-online-board w-100"
                            onClick={() => handleStartChat(item._id)}
                          >
                            <div className="p-3 d-flex">
                              <div className="me-3">
                                <div className="left-bar-profile">
                                  <FontAwesomeIcon
                                    icon={faUser}
                                    className="mr-4 ml-2"
                                  />
                                </div>
                              </div>
                              <div>
                                <p className="fw-bold mt-2">{item.username}</p>
                              </div>
                            </div>
                          </button>
                          <hr />
                        </>
                      );
                  })}
                </div>
              </div>

              <div className="h-50 offline-board overflow-auto mt-2 bg-white">
                <div className="p-3 offline-bar-board">
                  <h3 className="fw-bold">Offline</h3>
                </div>
                <div className="p-2 mt-1">
                  {(
                    dataUser.filter(
                      (obj2) =>
                        !dataUserStatus.some((obj1) => obj1._id === obj2._id)
                    ) || []
                  ).map((item, index) => {
                    if (item.username !== localStorage.getItem("username"))
                      return (
                        <>
                          <button
                            className="btn card-offline-board w-100"
                            onClick={() => handleStartChat(item._id)}
                          >
                            <div className="p-3 d-flex ">
                              <div className="me-3">
                                <div className="left-bar-profile">
                                  <FontAwesomeIcon
                                    icon={faUser}
                                    className="mr-4 ml-2"
                                  />
                                </div>
                              </div>
                              <div>
                                <p className="fw-bold">{item.username}</p>
                                <small className="fst-italic">
                                  {new Date(item.lastseenAt).toLocaleString() +
                                    ""}
                                </small>
                              </div>
                            </div>
                          </button>
                          <hr />
                        </>
                      );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="right-container col-sm-8 mt-3">
            <div className="container-send-message mt-3 overflow-auto ps-3 pt-3 pe-3">
              <div className="bar-message-place">
                {(data || []).map((item, index) => {
                  if (item.user_id == localStorage.getItem("user_id")) {
                    return (
                      <div className="bar-message-left mt-3">
                        <div className="d-flex p-3">
                          <div className="sended-bar-profile right-bar-profile me-3">
                            <FontAwesomeIcon
                              icon={faUser}
                              className="mr-4 ml-2"
                            />
                          </div>
                          <div className="left-chat-board chat-board w-100 p-2">
                            <p className="fw-bold">
                              {item.username ||
                                localStorage.getItem("username")}
                            </p>
                            <p>{item.message}</p>
                            <small>
                              {new Date(item.createdAt).toLocaleString()}
                            </small>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="bar-message-left mt-3">
                        <div className="d-flex p-3">
                          <div className="right-chat-board chat-board w-100 p-2 text-end">
                            <p className="fw-bold">{targetDataUser.username}</p>
                            <p>{item.message}</p>
                            <small>
                              {new Date(item.createdAt).toLocaleString()}
                            </small>
                          </div>
                          <div className="accept-bar-profile right-bar-profile ms-3">
                            <FontAwesomeIcon
                              icon={faUser}
                              className="mr-4 ml-2"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>

              {Object.values(targetDataUser) != 0 ? (
                <div className="bar-message pt-3">
                  <input
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    className="form-control w-75 me-3 mb-3"
                    name="message"
                    type="text"
                  />

                  <button
                    onClick={() => handleSend()}
                    className="btn btn-success mb-3"
                  >
                    <FontAwesomeIcon
                      icon={faPaperPlane}
                      className="mr-4 ml-2"
                    />
                  </button>

                  {/* <EmojiPicker
                    onEmojiClick={onClick}
                    autoFocusSearch={false}
                    emojiStyle={EmojiStyle.NATIVE}
                  /> */}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
