import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "./dashboard.css";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import { useState } from "react";
import CreateFoundation from "../Foundation/foundation";
import CreateNonProfits from "../Nonprofits/nonprofits";
import Mail from "../Mail/mail";
import axios from "axios";
import { useEffect } from "react";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import useMailList from "../../custom-hook/getSetHook";

function Dashboard() {
  const [openCreateFoundationModal, setopenCreateFoundationModal] =
    useState(false);
  const [openCreateNonProfitModal, setopenCreateNonprofitModal] =
    useState(false);
  const [openSendMail, setopenSendMailModal] = useState(false);
  const mailListFromApi = useMailList([]);
  const [mailList, setMailList] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState();

  useEffect(() => {
    refreshList();
  }, []);

  //refreshes the mail list onload and also when searching and when a new mail is sent
  const refreshList = () => {
    return axios
      .get("api/mail")
      .then((response) => {
        setMailList(response.data);
        mailListFromApi.set(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //filters the mail list based on email or date or both
  const SearchQuery = (query, selectedDate) => {
    if (query === "" && !!!selectedDate) {
      setMailList(mailListFromApi.get());
    } else if (query === "" && !!selectedDate) {
      setMailList(
        mailListFromApi
          .get()
          .filter((mail) => new Date(mail.createdOn) >= selectedDate)
      );
    } else if (query !== "" && !!!selectedDate) {
      setMailList(
        mailListFromApi
          .get()
          .filter(
            (mail) =>
              mail.foundation.email.toString().toLowerCase().includes(query) ||
              mail.nonprofit.email.toLowerCase().includes(query)
          )
      );
    } else {
      setMailList(
        mailListFromApi
          .get()
          .filter(
            (mail) =>
              (mail.foundation.email.toString().toLowerCase().includes(query) ||
                mail.nonprofit.email.toLowerCase().includes(query)) &&
              new Date(mail.createdOn) >= selectedDate
          )
      );
    }
  };

  //search the mail based on email
  const search = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      SearchQuery(query, selectedDate);
    }
  };

  const handleOpenFoundation = () => {
    setopenCreateFoundationModal(!openCreateFoundationModal);
  };

  const handleOpenNonprofit = () => {
    setopenCreateNonprofitModal(!openCreateNonProfitModal);
  };

  const handleOpenMail = () => {
    setopenSendMailModal(!openSendMail);
  };

  const onDateChange = (updatedDate, updatedQuery) => {
    setSelectedDate(updatedDate);
    if (updatedQuery) {
      setQuery(updatedQuery);
    }
    SearchQuery(updatedQuery || query, updatedDate);
  };
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">Temelio</Navbar.Brand>
        </Container>
      </Navbar>
      <div className="container-dashboard">
        <div className="container-header">
          <h3 className="mail-header">Sent Mails</h3>
          <Form.Text muted>
            (filter mails on foundation/nonprofits email or sent
            date/time or both)
          </Form.Text>
        </div>

        <div className="header">
          <div className="search-bar">
            <Form inline className="search-bar-item">
              <InputGroup>
                <Form.Control
                  placeholder="Search by email"
                  onKeyDown={search}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </InputGroup>
            </Form>
            <DateTimePicker
              className="search-bar-item"
              onChange={onDateChange}
              value={selectedDate}
              disableClock="true"
            />
          </div>
          <div className="create-mail">
            <Button className="button" variant="light" onClick={handleOpenMail}>
              Send Mail
            </Button>{" "}
            <Button
              className="button"
              variant="dark"
              onClick={handleOpenFoundation}
            >
              Create Foundation
            </Button>
            <Button
              className="button"
              variant="dark"
              onClick={handleOpenNonprofit}
            >
              Create NonProfit
            </Button>
          </div>
        </div>
        <div className="container-body">
          {mailList.map(function (mail) {
            return (
              <Card className="card">
                <Card.Header>
                  {mail.foundation.email} to {mail.nonprofit.email}
                  <Badge className="badge" bg="success">
                    {new Date(mail.createdOn).toDateString()}
                  </Badge>
                </Card.Header>
              </Card>
            );
          })}
        </div>
      </div>
      <CreateFoundation
        show={openCreateFoundationModal}
        closeModal={handleOpenFoundation}
      />
      <CreateNonProfits
        show={openCreateNonProfitModal}
        closeModal={handleOpenNonprofit}
      />
      <Mail
        show={openSendMail}
        closeModal={handleOpenMail}
        setMailSentTime={onDateChange}
        refreshMailList={refreshList}
      />
    </>
  );
}

export default Dashboard;
