import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import makeToast from "../Toaster";

const DashboardPage = (props) => {
  const [chatrooms, setChatrooms] = React.useState([]);
  const chatroomNameRef = React.createRef();
  const createChatrooms = () => {
    const name = chatroomNameRef.current.value;
    const headers = {
      'Authorization': "Bearer " + localStorage.getItem("CC_Token")
    }
    axios
      .post('http://localhost:8000/chatroom', {
        name,
      }, {
        headers: headers
      })
      .then((response) => {
        makeToast('success', response.data.message);
        props.history.push("/dashboard");
      })
      .catch((err) => {
        // console.log(err);
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        )
          makeToast("error", err.response.data.message);
      });
  }
  const getChatrooms = () => {
    axios
      .get("http://localhost:8000/chatroom", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        },
      })
      .then((response) => {
        setChatrooms(response.data);
      })
      .catch((err) => {
        setTimeout(getChatrooms, 3000);
      });
  };

  React.useEffect(() => {
    getChatrooms();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="card">
      <div className="cardHeader">Chatrooms</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="chatroomName">Chatroom Name</label>
          <input
            type="text"
            name="chatroomName"
            id="chatroomName"
            placeholder="ChatterBox Nepal"
            ref={chatroomNameRef}
          />
        </div>
      </div>
      <button onClick={createChatrooms} >Create Chatroom</button>
      <div className="chatrooms">
        {chatrooms.map((chatroom) => (
          <div key={chatroom._id} className="chatroom">
            <div>{chatroom.name}</div>
            <Link to={"/chatroom/" + chatroom._id}>
              <div className="join">Join</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
