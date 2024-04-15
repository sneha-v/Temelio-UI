import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import axios from "axios";

function CreateNonProfits(props) {
  const [nonprofitEmail, setNonprofitEmail] = useState("");
  const [nonprofitName, setNonprofitName] = useState("");
  const [nonprofitAddress, setNonprofitAddress] = useState("");
  const [showError, setshowError] = useState(false);
  const [showSuccess, setshowSuccess] = useState(false);

  const handleClose = () => {
    setshowSuccess(false);
    setshowError(false);
    props.closeModal();
  };

  //creates a non profit
  const create = () => {
    setshowSuccess(false);
    setshowError(false);
    axios
      .post("api/nonprofit", {
        name: nonprofitName,
        email: nonprofitEmail,
        address: nonprofitAddress,
      })
      .then((response) => {
        setshowSuccess(true);
        setTimeout(() => setshowSuccess(false), 2000);
        setNonprofitEmail("");
        setNonprofitName("");
        setNonprofitAddress("");
      })
      .catch((error) => {
        setshowError(true);
        setTimeout(() => setshowError(false), 2000);
        setNonprofitEmail("");
        setNonprofitName("");
        setNonprofitAddress("");
      });
  };

  return (
    <Modal show={props.show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create NonProfit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter Nonprofit Name"
              value={nonprofitName}
              onChange={(e) => {
                setNonprofitName(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Nonprofit Email"
              value={nonprofitEmail}
              onChange={(e) => {
                setNonprofitEmail(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Nonprofit Address"
              value={nonprofitAddress}
              onChange={(e) => {
                setNonprofitAddress(e.target.value);
              }}
            />
          </Form.Group>
        </Form>
        {showSuccess ? <p>Nonprofit Created!</p> : ""}
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

export default CreateNonProfits;
