import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import axios from "axios";
import { ReactMultiEmail } from "react-multi-email";
import "react-multi-email/dist/style.css";

function Mail(props) {
  const [emails, setEmails] = useState([]);
  const [focused, setFocused] = useState(false);
  const [foundationEmail, setFoundationEmail] = useState("");
  const [showError, setshowError] = useState(false);
  const [showSuccess, setshowSuccess] = useState(false);

  const handleClose = () => {
    setshowSuccess(false);
    setshowError(false);
    props.closeModal();
  };

  //triggers sending mail to all the non profits email from foundation email
  const sendMail = () => {
    setshowSuccess(false);
    setshowError(false);
    let mailSentTime = new Date();
    axios
      .post("api/mail", {
        foundation_id: foundationEmail,
        email_ids: emails,
      })
      .then(async (response) => {
        setshowSuccess(true);
        setTimeout(() => setshowSuccess(false), 2000);
        await props.refreshMailList();
        props.setMailSentTime(mailSentTime, foundationEmail);
        setEmails([]);
        setFoundationEmail("");
      })
      .catch((error) => {
        setshowError(true);
        setTimeout(() => setshowError(false), 2000);
        setEmails([]);
        setFoundationEmail("");
      });
  };

  return (
    <Modal show={props.show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Send Email</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
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

          <ReactMultiEmail
            placeholder="Enter Non profit Emails"
            emails={emails}
            onChange={(_emails) => {
              setEmails(_emails);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            getLabel={(email, index, removeEmail) => {
              return (
                <div data-tag key={index}>
                  <div data-tag-item>{email}</div>
                  <span data-tag-handle onClick={() => removeEmail(index)}>
                    ×
                  </span>
                </div>
              );
            }}
          />
          <Form.Text muted>
            You can add multiple emails by pressing enter button after each mail
            id is entered.
          </Form.Text>
        </Form>
        {showSuccess ? <p>Mail Sent Successfully!</p> : ""}
        {showError ? <p>Foundation email doesnot exist!</p> : ""}
      </Modal.Body>
      <Modal.Footer>
        <Button className="button" variant="dark" onClick={sendMail}>
          Send Mail
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Mail;
