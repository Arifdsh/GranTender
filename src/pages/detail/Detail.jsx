import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar.jsx";
import DarkLightMode from "../../components/navbar/DarkLightMode.jsx";
import axios from "axios";
import "../detail/detail.scss";
import { useParams } from "react-router-dom";
import { FaUserCircle, FaCalendarCheck } from "react-icons/fa";
import { FaLocationDot, FaCalendarXmark } from "react-icons/fa6";
import { GiMoneyStack } from "react-icons/gi";
import { RiMoneyEuroBoxFill } from "react-icons/ri";
import Button from "react-bootstrap/Button";
import ScrollToTop from "../../components/scrolltotop/ScrollToTop.jsx";
import { Container, Row, Col } from "react-bootstrap";
const Detail = () => {
  const baseApiUrl = import.meta.env.VITE_API_URL;
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(baseApiUrl);
        console.log("Full API response:", response.data);

        if (response.data && Array.isArray(response.data)) {
          setData(response.data);
        } else {
          console.error("Unexpected data structure:", response.data);
          setError("Unexpected data structure");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      }
    };

    fetchData();
  }, [baseApiUrl]);

  const findTender = data.find((tender) => tender.id.toString() === id);
  console.log(findTender);

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    function simulateNetworkRequest() {
      return new Promise((resolve) => setTimeout(resolve, 2000));
    }

    if (isLoading) {
      simulateNetworkRequest().then(() => {
        setLoading(false);
      });
    }
  }, [isLoading]);

  const handleClick = () => setLoading(true);

  return (
    <div>
      <Navbar />
      <DarkLightMode />

      <Container fluid className="detail mt-5 py-5">
        <Row className="justify-content-center">
          <Col xs={12} className="detail__heading">
            <h2>Ətraflı</h2>
          </Col>
        </Row>
        <Row className="detail-list justify-content-center align-items-center shadow">
          <div className="detail-list__item detail-list__leftside">
            <p className="detail-list__vertical detail-list__light-effect m-2 ">
              GRANTENDER
            </p>
            <div className="detail-list__photo">
              <img src="/src/assets/image/velievcolor.png" alt=" " />
            </div>
          </div>
          {findTender ? (
            <div className="detail-list__item detail-list__rightside">
              <h3 className="detail-list__title">Elan sahibi</h3>
              <p className="detail-list__content">
                <FaUserCircle className="detail-list__icon" />
                {findTender.owner}
              </p>

              <h3 className="detail-list__title">Elanın predmeti</h3>
              <p className="detail-list__content">{findTender.subject}</p>

              <h3 className="detail-list__title">Təşkilatın ünvanı</h3>
              <p className="detail-list__content">
                <FaLocationDot className="detail-list__icon" />
                {findTender.address}
              </p>

              <h3 className="detail-list__title">Ehtimal olunan qiyməti </h3>
              <p className="detail-list__content">
                <RiMoneyEuroBoxFill className="detail-list__icon" />
                {findTender.price}
              </p>

              <h3 className="detail-list__title">
              
                Elanın yaradılış tarixi ve vaxtı
              </h3>
              <p className="detail-list__content">
                <FaCalendarCheck className="detail-list__icon" />
                {findTender.creationDate}
              </p>

              <h3 className="detail-list__title">Elanın bitmə tarixi </h3>
              <p className="detail-list__content">
                <FaCalendarXmark className="detail-list__icon" />
                {findTender.expirationDate}
              </p>
              <Button
                className="detail-list__apply mt-3"
                onClick={!isLoading ? handleClick : null}
              >
                {isLoading ? "Loading…" : "Müraciət et"}
              </Button>
            </div>
          ) : (
            <p>No tender found</p>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default Detail;
