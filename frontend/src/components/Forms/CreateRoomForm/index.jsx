import { useState } from "react";
import {useNavigate} from "react-router-dom";

const CreateRoomForm = ({uuid, socket, setUser}) => {

    const [roomId, setRoomId] = useState(uuid());
    const [name, setName] = useState("");

    const navigate = useNavigate();

    const handleCreateRoom = (e) => {
        e.preventDefault();

        // {name, roomId, userId, host, presenter}

        const roomData = {
            name,
            roomId, 
            userId: uuid(),
            host: true,
            presenter: true
        };

        setUser(roomData);
        navigate(`/${roomId}`);
        console.log(roomData);
        socket.emit("userJoined", roomData);
    };

    const copyRoomIdToClipboard = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(roomId)
            .then(() => {
                console.log('Room ID copied to clipboard');
            })
            .catch((error) => {
                console.error('Failed to copy room ID to clipboard:', error);
            });
    };

    return (
        <form className="form col-md-12 mt-5">
            <div className="form-group">
                <input type="text" value={name} className="form-control my-2" placeholder="Enter your name" onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className="form-group border">
                <div className="input-group d-flex align-items-center justify-content-center">
                    <input type="text" value={roomId} className="form-control my-2 border-0" disabled placeholder="Generate room code" />
                    <div className="input-group-append d-flex gap-1">
                        <button className="btn btn-primary btn-sm me-1" type="button" onClick={() => setRoomId(uuid())}>
                            generate
                        </button>
                        <button className="btn btn-outline-danger btn-sm me-2" type="button" onClick={copyRoomIdToClipboard}>
                            copy
                        </button>
                    </div>
                </div>
            </div>
            <button className="mt-4 btn btn-primary btn-block form-control" type="submit" onClick={handleCreateRoom}>
                Generate Room
            </button>
        </form>
    );
}

export default CreateRoomForm;