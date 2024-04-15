import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import axios from "axios";

function CreateFoundation(props) {
  const [foundationEmail, setFoundationEmail] = useState("");
  const [foundationName, setFoundationName] = useState("");
  const [showError, setshowError] = useState(false);
  const [showSuccess, setshowSuccess] = useState(false);

  const handleClose = () => {
    setshowSuccess(false);
    setshowError(false);
    props.closeModal();
  };

  //creates a new foundation
  const create = () => {
    setshowSuccess(false);
    setshowError(false);
    axios
      .post("api/foundation", {
        name: foundationName,
        email: foundationEmail,
      })
      .then((response) => {
        setshowSuccess(true);
        setTimeout(() => setshowSuccess(false), 2000);
        setFoundationEmail("");
        setFoundationName("");
      })
      .catch((error) => {
        setshowError(true);
        setTimeout(() => setshowError(false), 2000);
        setFoundationEmail("");
        setFoundationName("");
      });
  };

  return (
    <Modal show={props.show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Foundation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter Foundation Name"
              value={foundationName}
              onChange={(e) => {
                setFoundationName(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Foundation Email"
              value={foundationEmail}
              onChange={(e) => {
                setFoundationEmail(e.target.value);
              }}
            />
          </Form.Group>
        </Form>
        {showSuccess ? <p>Foundation Created!</p> : ""}
        {showError ? <p>email already exist!</p> : ""}
      </Modal.Body>
      <Modal.Footer>
        <Button className="button" variant="dark" onClick={create}>
          Create
        </Button>
        <Button className="button" variant="light" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateFoundation;
