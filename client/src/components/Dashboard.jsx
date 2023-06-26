import React, { useState } from 'react';
import RouteForm from './RouteForm';
import MapComponent from './MapComponent';
import RouteList from './RouteList';
import axios from 'axios';
import calculateCarbonFootprint from './CarbonCalculator';
// import useStyles from './DashboardStyles.js';
// import { Container, Row, Col, Card } from 'react-bootstrap';
import Header from './Header';
import '../styles/DashboardStyles.css';
import { Navbar, Nav, Container, Button, Row, Col, Form, Image, Card, Carousel } from 'react-bootstrap';
import header_slider1 from '../images/header_slider1.jpg';
import header_slider2 from '../images/header_slider2.jpg';
import whatIs from '../images/whatIs.jpg';
import communityImg from '../images/conversation1-removebg-preview.png';
import Logo from '../images/logo_new.png';
import client1 from '../images/client.jpg';





const Dashboard = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [originLatLng, setOriginLatLng] = useState(null);
  const [destinationLatLng, setDestinationLatLng] = useState(null);

  const handleFindRoute = async ({ origin, destination }) => {
    setOriginLatLng(origin);
    setDestinationLatLng(destination);
    const routes = await fetchEcoRoutes(origin, destination);
    setRoutes(routes);
  };

  const fetchEcoRoutes = async (origin, destination) => {
    try {
      const modes = ['driving', 'transit', 'walking']; // 'bicycling' eshte hequr pasi Google Maps ska info , eshte shtuar me poshte nga GraphHopper
      const routes = [];

      for (const mode of modes) {
        const response = await axios.get(`http://localhost:8000/directions?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&mode=${mode}`);
        console.log(response.data);

        if (response.data.status === 'ZERO_RESULTS') {
          console.log(`No routes found for mode: ${mode}`);
          continue; // kapercen te iterationi i radhes ne loop
        }

        const routeInfo = response.data.routes[0].legs[0];

        const distanceKm = routeInfo.distance.value / 1000;

        const route = {
          description: `Mode of transport: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`,
          distance: distanceKm,
          duration: routeInfo.duration.text,
          mode: mode.charAt(0).toUpperCase() + mode.slice(1),
        };

        route.carbonFootprint = calculateCarbonFootprint(route);

        routes.push(route);
      }

      // Fetchi per cycling route nga GraphHopper
      const graphHopperResponse = await axios.get(`http://localhost:8000/route?point=${origin.lat},${origin.lng}&point=${destination.lat},${destination.lng}&vehicle=bike&key=75cc2927-563c-43ee-89ea-cf0c094108f8`);

      console.log(graphHopperResponse.data);

      // konvertimi i distances dhe kohes 
      const distanceInKm = (graphHopperResponse.data.paths[0].distance / 1000).toFixed(2);
      const timeInMinutes = (graphHopperResponse.data.paths[0].time / 60000).toFixed(0);

      // Futja e cycling route ne array
      routes.push({
        description: 'Mode of transport: Bicycling (GraphHopper)',
        distance: `${distanceInKm} km`,
        duration: `${timeInMinutes} mins`,
        mode: 'Bicycling',
        carbonFootprint: calculateCarbonFootprint({
          mode: 'Bicycling',
          distance: distanceInKm,
        }),
      });

      const sortedRoutes = routes.sort((a, b) => {
        const ecoFriendlyOrder = ['Walking', 'Bicycling', 'Transit', 'Driving'];
        return ecoFriendlyOrder.indexOf(a.description.split(':')[1].trim()) - ecoFriendlyOrder.indexOf(b.description.split(':')[1].trim());
      });

      return sortedRoutes;

    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };








const carouselItems = [
  { 
    image: header_slider1, 
    title: "Gjeni rrugen me te shpejte dhe eficente..", 
   
    description: " Doni te gjeni rrugen me te shpejte per te shkuar ne nje destinacion. Nuk e keni vendosur akoma transportin me te cilin do udhetoni.. Gjeni udhen me te shpejte me transportin perkates ,",
    buttonLink: "#plan-route",
    buttonText: "Provo Tani"
  },
  { 
    image: header_slider2, 
    title: "Doni te zbuloni rrugen me efficente", 

    description: "Ju tashme mund te masni dhe Carbon Footprint per cdo mjet transporti perkates. Zgjedhjen e beni ju ...",
    buttonLink: "#plan-route",
    buttonText: "Provo Tani"
  }
];



return (
  <React.Fragment>
<section className="slider_section">
  <Carousel indicators={true} interval={4000}>
    {carouselItems.map((item, index) => (
      <Carousel.Item key={index}>
        <div className="slider_bg_box">
          <img src={item.image} alt={`Slide ${index}`} className="d-block w-100" />
        </div>
        <Container>
          <Row>
            <Col md={7} lg={4}>
              <div className="detail-box">
                <h1>
                  <span>{item.title}</span>
                  <br/>{item.subtitle}
                </h1>
                <p>
                  {item.description}{' '}
                  {index === 0 && <span className="green-text">"Udhën e Gjëlber...</span>}
                </p>
                <div className="btn-box">
                  <a href={item.buttonLink} className="btn1">{item.buttonText}</a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </Carousel.Item>
    ))}
  </Carousel>
</section>

    {/* Route Section */}
    <section className="route_section layout_padding">
      <div className="container">
      <Row className="row_content">
       <Col md={12}>
         <Card className="mb-4">
           <Card.Body>
             <h4 className="heading_center" id="plan-route">Plan Your Route</h4>
             <RouteForm onFindRoute={handleFindRoute} />
             <div className="map-container">
               <MapComponent originLatLng={originLatLng} destinationLatLng={destinationLatLng} />
             </div>
             <RouteList routes={routes} />
           </Card.Body>
         </Card>
       </Col>
     </Row>
      </div>
    </section>


          {/* Mission Section */}
          <section className="arrival_section" id="ourMission">
      <div className="container">
        <div className="box">
          <div className="arrival_bg_box">
            <img src={whatIs} alt=""/>
          </div>
          <div className="row">
            <div className="col-md-6 ml-auto">
              <div className="heading_container remove_line_bt">
                <h2>#Cfare eshte Udha e Gjelber?</h2>
              </div>
              <p style={{marginTop: '20px', marginBottom: '30px'}}>
              "Udha e Gjelber" është një aplikacion që fokusohet në promovimin e lëvizshmërisë urbane dhe periferike me opsione miqësore me mjedisin dhe gjithashtu gjurmon dhe shfaq efikasitetin energjetik të përdorimit të këtyre metodave të transportit të gjelbër.
              </p>
              <div className="heading_container remove_line_bt">
                <h2>#Cili është qëllimi i këtij aplikacioni?</h2>
              </div>
              <p style={{marginTop: '20px', marginBottom: '30px'}}>
              Misioni ynë është të përmirësojmë transportin për një të ardhme më të mirë. Zgjidhni opsione transporti miqësore me mjedisin për të kontribuar pozitivisht në mjedis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Product Section */}
    <section className="product_section layout_padding text-center">
  <div className="container mt-3">
    <div className="heading_container heading_center">
      <img src={communityImg} alt="Green mobility and efficiency" className="section-image" />
      <h2 className="section-text">Bashkohuni me Komunitetin tonë, ku ndajmë ide dhe opinione të ndryshme</h2>
      <a href="/community" className="btn btn-success mt-3">Kliko ketu per tu bashkuar tek Kommuniteti jone</a>
    </div>
  </div>
</section>

    {/* Blog Section */}
    <section className="subscribe_section">
  <div className="container-fluid">
    <div className="BlogBox">
      <div className="row">
        <div className="col-md-12">
            <div className="heading_container">
              <img src="https://img.freepik.com/premium-photo/top-view-desk-concept-with-copy-space_23-2148459783.jpg" alt="Green mobility and efficiency" className="section-image" />
              <div className="overlay">
                <h2>Lexoni Artikuj te ndryshem nga Blogu jone.</h2>
                <a href="/blog" className="btn btn-primary">Go to our Blog</a>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</section>



    {/* Client Section */}
    <section className="client_section layout_padding">
      <div className="container">
        <div className="heading_container heading_center">
          <h2 className="text-center mt-4">Customer's Testimonial</h2>
        </div>
        <div id="carouselExample3Controls" className="carousel slide" data-ride="carousel">
          <div className="carousel-inner">
            {Array(3).fill(0).map((_, index) => (
              <div className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                <div className="box col-lg-10 mx-auto">
                  <div className="img_container">
                    <div className="img-box">
                      <div className="img_box-inner">
                        <img src={client1} alt=""/>
                      </div>
                    </div>
                  </div>
                  <div className="detail-box">
                    <h5>Ana Shehu</h5>
                    <h6>Customer</h6>
                    <p>Zgjedhja me e duhur qe kam bere nder kohe...</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="carousel_btn_box">
            <a className="carousel-control-prev" href="#carouselExample3Controls" role="button" data-slide="prev">
              <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
              <span className="sr-only">Previous</span>
            </a>
            <a className="carousel-control-next" href="#carouselExample3Controls" role="button" data-slide="next">
              <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
              <span className="sr-only">Next</span>
            </a>
          </div>
        </div>
      </div>
    </section>
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="full">
            <div className="logo_footer text-center">
  <img width="110" style={{ margin:0, padding:0}} src={Logo} alt="#" />
</div>
              <div className="information_f text-center">
                <p><strong>ADDRESS:</strong> 28 White tower, Rruga Myslym Shyri, Tirane</p>
                <p><strong>TELEPHONE:</strong> +69 40 400 004</p>
                <p><strong>EMAIL:</strong> gertihysenaj@gmail.com</p>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="row">
              <div className="col-md-7">
                <div className="row">
                  <div className="col-md-6">
                    <div className="widget_menu">
                      <h3>Menu</h3>
                      <ul>
                        <li><a href="/dashboard">Home</a></li>
                        <li><a href="#ourMission">About</a></li>
                        <li><a href="#plan-route">Plan Your Route</a></li>
                        <li><a href="/blog">Blog</a></li>
                        <li><a href="/community">Community</a></li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="widget_menu">
                      <h3>Account</h3>
                      <ul>
                        <li><a href="/login">Login</a></li>
                        <li><a href="/register">Register</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-5">
                <div className="widget_menu">
                  <h3>Newsletter</h3>
                  <div className="information_f">
                    <p>Subscribe by our newsletter and get updated.</p>
                  </div>
                  <div className="form_sub">
                    <form>
                      <fieldset>
                        <div className="field">
                          <input type="email" placeholder="Enter Your Mail" name="email" />
                          <input type="submit" value="Subscribe" />
                        </div>
                      </fieldset>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
    <div className="cpy_">
      <p className="mx-auto"> 
      &copy; 2023 Gerti Hysenaj, Thëllëza Leka, Elton Doda. All rights reserved. 
      </p>
    </div>
  </React.Fragment>
);
};


export default Dashboard;





